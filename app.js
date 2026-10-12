/* 一模練習題庫 主程式
 * 題目格式（寫在 data/*.js）：
 *   靜態題：['主題', '題目', ['正解', '錯1', '錯2', '錯3'], '解析']
 *   類題產生器：{ t: '主題', g: function (R) { return ['題目', ['正解', ...], '解析']; } }
 *     → 每次出題都換新數字，用來練「類似題」
 *   英文單字等可在單元加 gen: function () { return [靜態題...] }
 *
 * ⚠ 保留作答紀錄的規則：題目編號 = 科目id-單元順序-題目順序
 *   新題目只能加在該單元「最後面」，新單元只能加在該科目「最後面」；
 *   修改題目時不要移動位置、不要刪題（要淘汰就原地改寫內容）。
 */
(function () {
  'use strict';

  // ---------- 更新日誌（新版本加在最上面） ----------
  var CHANGELOG = [
    { v: '1.7', date: '2026-10-12', items: [
      '設定新增「只出計算題」勾勾：勾選後一般練習與錯題本只出需要計算的題目（國文、英文不算，簡單版、困難版都適用）',
      '作答紀錄全部保留'
    ] },
    { v: '1.6', date: '2026-10-12', items: [
      '作答畫面新增「✏️ 計算區」：可拖移、縮放的大畫布，有筆、橡皮擦、復原，每題各自一份，算到一半網頁重新整理也會保留',
      '交卷後可在「計算區回顧」或錯題檢討的「看計算區」重看當時的計算過程'
    ] },
    { v: '1.6', date: '2026-10-12', items: [
      '計算題數字變好算：每次出題會多試幾組數字，挑正解和詳解過程最乾淨的那組（少出 24.53 這種數字）',
      '作答紀錄不受影響'
    ] },
    { v: '1.5', date: '2026-10-12', items: [
      '作答到一半網頁被重新整理也不會不見：題目、已選答案和計時器都會自動接回來'
    ] },
    { v: '1.4', date: '2026-10-12', items: [
      '新增「測驗模式」（設定區勾選）：全部做完交卷才顯示答案與詳解，作答中可按上一題／下一題或題號回去改答案',
      '新增計時器（設定區勾選、可自訂分鐘數）：時間到會跳出「時間結束」，按「看測驗結果」看成績',
      '原本的作答紀錄、錯題本都保留'
    ] },
    { v: '1.3.1', date: '2026-10-12', items: [
      '困難版名稱更正為「模考類似題」（題目是仿歷屆一模模考，不是統測），作答紀錄不受影響'
    ] },
    { v: '1.3', date: '2026-10-12', items: [
      '加入 110、111 學年度一模的題型（原本只參考 112～114），只收 115 一模範圍內的單元',
      '困難版新增：色碼與誤差、額定功率串並聯、換參考點求電位、電流源功率、迴路方程式係數、兩次量測求 E 與內阻、電表接法誤差、燈泡規格選用、BJT 由三腳電壓判斷工作區、電晶體開關驅動 LED、示波器求增益、含隨意項的卡諾圖（SOP／POS）、TTL 故障判斷、萬用閘 IC 顆數、MIPS 與時脈計算、跳脫字元、sizeof、字元運算等',
      '簡單版也新增幾種題型；新題有圖的會跟著數字一起變',
      '原本的題目、作答紀錄、錯題本、弱點分析全部保留'
    ] },
    { v: '1.2', date: '2026-10-11', items: [
      '新增「簡單版／困難版」切換：困難版是仿統測與歷屆一模的類似題（多步驟計算、何者正確／錯誤、情境題、程式追蹤），紀錄和簡單版分開',
      '困難版的電路、二極體、電晶體、邏輯電路、卡諾圖、波形題都附示意圖，換數字時圖也跟著換',
      '國文、英文、數學C 也有困難版題目',
      '簡單版的題目、作答紀錄、錯題本、弱點分析全部保留'
    ] },
    { v: '1.1', date: '2026-10-11', items: [
      '依歷屆一模題型加上圖：電路圖（串並聯、電橋、Δ 接、戴維寧、節點、二極體、整流、稽納、電晶體偏壓、CE 放大器）、波形（脈波、電流波形、漣波、負載線）、示波器螢幕、邏輯閘、時序圖、解碼器',
      '新增看圖題型：求 R_AB、戴維寧等效、最大功率、電表接法、二極體導通、截波、讀負載線、認邏輯閘、特殊接法、時序圖、二極體邏輯、邏輯電路寫布林式、梯形脈波工作週期',
      '示波器題改成看螢幕數格子，和考試一樣',
      '錯題檢討、錯題紀錄也會顯示圖；作答紀錄、錯題本、弱點分析全部保留'
    ] },
    { v: '1.0', date: '2026-10-11', items: [
      '初版：電子科（資電類）一模題庫',
      '共同科目：國文、英文、數學C',
      '專一：基本電學、基本電學實習、電子學、電子學實習；專二：微處理機、數位邏輯設計、程式設計實習',
      '功能：選科目與單元、錯題本、弱點分析、類題練習（計算題每次換數字）、一鍵練最弱 5 個主題、錯題紀錄'
    ] }
  ];

  // ---------- 小工具 ----------
  var R = {
    int: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick: function (arr) { return arr[Math.floor(Math.random() * arr.length)]; },
    sign: function () { return Math.random() < 0.5 ? -1 : 1; },
    round: function (x, d) { var p = Math.pow(10, d || 0); return Math.round(x * p) / p; },
    nz: function (a, b) { var x; do { x = R.int(a, b); } while (x === 0); return x; },
    // 產生和正解不同的數字干擾選項
    near: function (ans, list) {
      var out = [], seen = {}; seen[String(ans)] = 1;
      list.forEach(function (v) { var s = String(v); if (!seen[s]) { seen[s] = 1; out.push(v); } });
      var k = 1;
      while (out.length < 3) { var v = ans + k * (k % 2 ? 1 : -1); k++; if (!seen[String(v)]) { seen[String(v)] = 1; out.push(v); } }
      return [ans].concat(out.slice(0, 3));
    }
  };
  window.QR = R;

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return document.getElementById(id); }

  // ---------- 儲存（try/catch 避免無痕模式出錯） ----------
  var KEY = 'mock1-elec-quiz-v1';
  var store = { sel: null, stats: {}, wrong: {}, log: [] };
  try { var raw = localStorage.getItem(KEY); if (raw) { var o = JSON.parse(raw); for (var k in o) store[k] = o[k]; } } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {} }

  // ---------- 題庫整理 ----------
  var SUBJ = window.QUIZ_DATA;
  var TEMPLATES = []; // 每個「題目模板」：{id, si, ui, tag, kind, item}
  SUBJ.forEach(function (s, si) {
    s.units.forEach(function (u, ui) {
      (u.qs || []).forEach(function (it, qi) {
        TEMPLATES.push({ id: s.id + '-' + ui + '-' + qi, si: si, ui: ui, tag: Array.isArray(it) ? it[0] : it.t, kind: Array.isArray(it) ? 's' : 'g', item: it });
      });
      if (u.gen) {
        u.gen().forEach(function (it) {
          TEMPLATES.push({ id: s.id + '-' + ui + '-' + it.id, si: si, ui: ui, tag: it[0], kind: 's', item: it });
        });
      }
      // 困難版（統測類似題）：id 多一個 h，和簡單版的紀錄分開
      (u.hard || []).forEach(function (it, qi) {
        TEMPLATES.push({ id: s.id + '-' + ui + '-h' + qi, si: si, ui: ui, tag: Array.isArray(it) ? it[0] : it.t, kind: Array.isArray(it) ? 's' : 'g', item: it, hard: true });
      });
    });
  });
  var TPL_BY_ID = {}; TEMPLATES.forEach(function (t) { TPL_BY_ID[t.id] = t; });

  // 困難版的主題 key 結尾加 |H，弱點分析才不會和簡單版混在一起
  function tagKey(t) { return t.si + '|' + t.ui + '|' + t.tag + (t.hard ? '|H' : ''); }
  function isHardMode() { return store.mode === 'hard'; }
  function inMode(t) { return !!t.hard === isHardMode(); }

  // 顯示用：跳脫 HTML，並把「a→」「AB→」改成箭頭在字母上方的向量寫法
  function fmt(s) { return esc(s).replace(/([A-Za-z]{1,2})→/g, '<span class="vec">$1</span>'); }

  // 由模板做出一題（產生器每次都是新數字）
  // 數字醜不醜：正解與詳解裡「題目沒給的」數字，小數超過 1 位就扣分（正解扣比較重）
  function ugly(raw) {
    var given = {};
    (String(raw[0]).match(/\d+(?:\.\d+)?/g) || []).forEach(function (x) { given[x] = 1; });
    function sc(s, w) {
      var p = 0;
      (String(s).match(/\d+\.\d+/g) || []).forEach(function (x) {
        if (given[x]) return;
        var d = x.split('.')[1].length;
        if (d > 1) p += (d - 1) * w;
      });
      return p;
    }
    return sc(raw[1] && raw[1][0], 5) + sc(raw[2], 1);
  }
  // 產生器多試幾次，挑數字最好算的一組（考試不會出 24.53 這種數字）
  function gen(t) {
    var best = null, bs = Infinity;
    for (var k = 0; k < 40; k++) {
      var raw = t.item.g(R), s = ugly(raw);
      if (s < bs) { best = raw; bs = s; }
      if (s === 0) break;
    }
    return best;
  }
  function build(t) {
    var raw = t.kind === 'g' ? gen(t) : t.item.slice(1);
    var q = QH.clean(String(raw[0])), opts = QH.fill(raw[1]).slice(0, 4), exp = QH.clean(String(raw[2] || ''));
    var order = shuffle(opts.map(function (_, i) { return i; }));
    return {
      tpl: t, q: q, exp: exp, fig: raw[3] || '',
      opts: order.map(function (i) { return String(opts[i]); }),
      ans: order.indexOf(0)
    };
  }

  // ---------- 選擇狀態 ----------
  var sel = store.sel || {};
  SUBJ.forEach(function (s) {
    if (!sel[s.id]) sel[s.id] = { on: false, units: s.units.map(function () { return true; }) };
    if (sel[s.id].units.length !== s.units.length) sel[s.id].units = s.units.map(function () { return true; });
  });
  store.sel = sel;

  // 計算題判斷：國英以外、題目與正解都含數字（產生器先試做一題來判斷，結果快取）
  function isCalc(t) {
    if (t.calc === undefined) {
      try {
        var raw = t.kind === 'g' ? t.item.g(R) : t.item.slice(1);
        t.calc = !/^(chi|eng)$/.test(SUBJ[t.si].id) && /\d/.test(String(raw[0])) && /\d/.test(String(QH.fill(raw[1])[0]));
      } catch (e) { t.calc = false; }
    }
    return t.calc;
  }
  function calcOk(t) { return !store.calcOnly || isCalc(t); }

  function selectedTemplates() {
    return TEMPLATES.filter(function (t) { var s = sel[SUBJ[t.si].id]; return s.on && s.units[t.ui] && inMode(t) && calcOk(t); });
  }

  // ---------- 首頁 ----------
  function accText(si, ui) {
    var n = 0, c = 0;
    for (var k in store.stats) {
      var p = k.split('|');
      if (+p[0] === si && (ui === undefined || +p[1] === ui)) { n += store.stats[k].n; c += store.stats[k].c; }
    }
    return n ? Math.round(c / n * 100) + '%（' + n + ' 題）' : '尚未作答';
  }

  function renderHome() {
    $('modeEasy').classList.toggle('on', !isHardMode());
    $('modeHard').classList.toggle('on', isHardMode());
    $('modeHint').textContent = isHardMode() ? '困難版：仿歷屆一模模考題型，多步驟計算與綜合判斷。紀錄與簡單版分開。' : '簡單版：基本觀念與單一公式，適合先熟悉重點。';
    var g = $('subjGrid'); g.innerHTML = '';
    SUBJ.forEach(function (s, si) {
      var cnt = TEMPLATES.filter(function (t) { return t.si === si && inMode(t); }).length;
      var d = document.createElement('div');
      d.className = 'subj' + (sel[s.id].on ? ' on' : '');
      d.innerHTML = '<div class="nm">' + esc(s.name) + '</div><div class="meta">' + esc(s.desc || '') + '・' + cnt + ' 題型</div><div class="acc">正確率：' + accText(si) + '</div>';
      d.onclick = function () { sel[s.id].on = !sel[s.id].on; save(); renderHome(); };
      g.appendChild(d);
    });

    var box = $('units'); box.innerHTML = '';
    var any = false;
    SUBJ.forEach(function (s, si) {
      if (!sel[s.id].on) return; any = true;
      var b = document.createElement('div'); b.className = 'ublock';
      b.innerHTML = '<div class="ut">' + esc(s.name) + '</div>';
      s.units.forEach(function (u, ui) {
        var n = TEMPLATES.filter(function (t) { return t.si === si && t.ui === ui && inMode(t); }).length;
        if (!n) return; // 這個模式沒有題目的單元先不顯示
        var c = document.createElement('span');
        c.className = 'chip' + (sel[s.id].units[ui] ? ' on' : '');
        c.textContent = u.name;
        c.title = '正確率：' + accText(si, ui);
        c.onclick = function () { sel[s.id].units[ui] = !sel[s.id].units[ui]; save(); renderHome(); };
        b.appendChild(c);
      });
      box.appendChild(b);
    });
    if (!any) box.innerHTML = '<span class="muted">先在上面選科目</span>';

    var pool = selectedTemplates();
    $('poolInfo').textContent = pool.length ? '可出題型 ' + pool.length + ' 種' : '';
    $('startBtn').disabled = !pool.length;
    var wc = Object.keys(store.wrong).filter(function (id) { return TPL_BY_ID[id] && inMode(TPL_BY_ID[id]); }).length;
    $('wrongBtn').textContent = '錯題本（' + wc + '）';
    $('wrongBtn').disabled = !wc;
    renderWeak();
  }

  // ---------- 弱點分析 ----------
  function weakList() {
    var arr = [];
    for (var k in store.stats) {
      var st = store.stats[k], p = k.split('|');
      var s = SUBJ[+p[0]]; if (!s) continue;
      var u = s.units[+p[1]]; if (!u) continue;
      var tpls = TEMPLATES.filter(function (t) { return tagKey(t) === k; });
      if (!tpls.length) continue;
      var hard = p[p.length - 1] === 'H';
      arr.push({ key: k, hard: hard, subj: s.name, unit: u.name, tag: p.slice(2, hard ? -1 : undefined).join('|'), n: st.n, c: st.c, acc: st.c / st.n, recentWrong: st.rw || 0, gen: tpls.some(function (t) { return t.kind === 'g'; }), size: tpls.length });
    }
    // 先排正確率低、再排最近連錯多
    arr.sort(function (a, b) { return (a.acc - b.acc) || (b.recentWrong - a.recentWrong) || (b.n - a.n); });
    return arr;
  }

  function level(acc, n) {
    if (n < 2) return ['資料不足', 'muted'];
    if (acc < 0.6) return ['不熟', 'badc'];
    if (acc < 0.8) return ['普通', ''];
    return ['熟練', 'okc'];
  }

  function renderWeak() {
    var list = weakList();
    var box = $('weakList');
    var weak = list.filter(function (w) { return w.acc < 0.8; });
    $('weakBtn').disabled = !weak.length;
    if (!list.length) { box.innerHTML = '<span class="muted">還沒有作答紀錄，先練幾題就會出現分析。</span>'; return; }
    // 單元總覽
    var units = {};
    list.forEach(function (w) { var k = w.subj + '・' + w.unit + (w.hard ? '（困難）' : ''); units[k] = units[k] || { n: 0, c: 0 }; units[k].n += w.n; units[k].c += w.c; });
    var uk = Object.keys(units).sort(function (a, b) { return units[a].c / units[a].n - units[b].c / units[b].n; });
    var html = '<div class="ugrid">' + uk.map(function (k) {
      var u = units[k], a = u.c / u.n, lv = level(a, u.n);
      return '<div class="ucell"><div>' + esc(k) + '</div><div class="mini wide"><i style="width:' + Math.round(a * 100) + '%"></i></div><span class="' + lv[1] + '">' + Math.round(a * 100) + '%（' + u.c + '/' + u.n + '）' + lv[0] + '</span></div>';
    }).join('') + '</div>';
    html += '<table><tr><th>科目／單元</th><th>主題</th><th>正確率</th><th>狀態</th><th></th></tr>';
    list.slice(0, 30).forEach(function (w) {
      var lv = level(w.acc, w.n);
      html += '<tr><td><span class="muted">' + esc(w.subj) + '</span><br>' + esc(w.unit) + '</td><td>' + esc(w.tag) + (w.hard ? ' <span class="tag hardtag">困難</span>' : '') + (w.gen ? ' <span class="tag">可出新數字</span>' : '') +
        '</td><td>' + Math.round(w.acc * 100) + '%<div class="mini"><i style="width:' + Math.round(w.acc * 100) + '%"></i></div><span class="hint">' + w.c + '/' + w.n + '</span></td><td class="' + lv[1] + '"><b>' + lv[0] + '</b></td>' +
        '<td><button class="btn small" data-k="' + esc(w.key) + '">練類題</button></td></tr>';
    });
    html += '</table>';
    if (list.length > 30) html += '<div class="hint">只列出最弱的 30 個主題</div>';
    box.innerHTML = html;
    Array.prototype.forEach.call(box.querySelectorAll('button[data-k]'), function (b) {
      b.onclick = function () { startSimilar([b.getAttribute('data-k')]); };
    });
  }

  // ---------- 出題 ----------
  var session = null;

  // 作答中的進度暫存在 sessionStorage：網頁被重新整理也能接著寫
  var CUR_KEY = KEY + '-cur';
  function saveCur() {
    var s = session;
    try {
      if (!s || s.done || $('quiz').classList.contains('hidden')) { sessionStorage.removeItem(CUR_KEY); return; }
      sessionStorage.setItem(CUR_KEY, JSON.stringify({
        qs: s.qs.map(function (q) { return { id: q.tpl.id, q: q.q, exp: q.exp, fig: q.fig, opts: q.opts, ans: q.ans, sketch: q.sketch || null }; }),
        i: s.i, title: s.title, exam: s.exam, picks: s.picks, end: s.end || 0, answered: !!s.answered, sk: Scratch.isOpen(),
        results: s.results.map(function (r) { return { k: s.qs.indexOf(r.q), mine: r.mine, ok: r.ok }; })
      }));
    } catch (e) {}
  }
  function restoreCur() {
    var o; try { o = JSON.parse(sessionStorage.getItem(CUR_KEY)); } catch (e) {}
    if (!o || !o.qs || !o.qs.every(function (q) { return TPL_BY_ID[q.id]; })) return false;
    var qs = o.qs.map(function (q) { return { tpl: TPL_BY_ID[q.id], q: q.q, exp: q.exp, fig: q.fig, opts: q.opts, ans: q.ans, sketch: q.sketch || undefined }; });
    session = { qs: qs, i: o.i, title: o.title, exam: o.exam, picks: o.picks,
      results: o.results.map(function (r) { return { q: qs[r.k], mine: r.mine, ok: r.ok }; }) };
    $('quitBtn').textContent = o.exam ? '交卷' : '結束並看成績';
    show('quiz'); renderQ();
    if (!o.exam && o.answered) showAnswer(o.results[o.results.length - 1].mine);
    if (o.end) startTimer(session, Math.max((o.end - Date.now()) / 60000, 0));
    if (o.sk) openSketch();
    return true;
  }
  window.addEventListener('pagehide', saveCur);
  document.addEventListener('visibilitychange', function () { if (document.hidden) saveCur(); });

  function makeQuestions(tpls, count, opts) {
    opts = opts || {};
    var list = shuffle(tpls);
    if (opts.wrongFirst) {
      list.sort(function (a, b) { return (store.wrong[b.id] ? 1 : 0) - (store.wrong[a.id] ? 1 : 0); });
    }
    var out = [];
    if (!count || count >= list.length) {
      out = list.slice();
      // 類題模式：題數不夠時，用產生器補新數字的題目
      if (count && opts.fillWithGen) {
        var gens = list.filter(function (t) { return t.kind === 'g'; });
        while (out.length < count && gens.length) out.push(R.pick(gens));
      }
    } else out = list.slice(0, count);
    return shuffle(out).map(build);
  }

  function startSession(qs, title) {
    if (!qs.length) { flash('沒有可以出的題目，請先選科目或單元。'); return; }
    if (session) stopTimer();
    var exam = !!store.exam;
    session = { qs: qs, i: 0, results: [], title: (title || '') + (exam ? '（測驗模式）' : ''), exam: exam, picks: exam ? qs.map(function () { return null; }) : null };
    $('quitBtn').textContent = exam ? '交卷' : '結束並看成績';
    $('timeUp').classList.add('hidden');
    show('quiz'); renderQ();
    if (store.timerOn && store.timerMin > 0) startTimer(session, store.timerMin);
  }

  function startNormal() {
    var count = +$('count').value;
    startSession(makeQuestions(selectedTemplates(), count, { wrongFirst: $('optWrongFirst').checked }), '一般練習');
  }

  function startWrongBook() {
    var ids = Object.keys(store.wrong).filter(function (id) { return TPL_BY_ID[id] && inMode(TPL_BY_ID[id]) && calcOk(TPL_BY_ID[id]); });
    var tpls = ids.map(function (id) { return TPL_BY_ID[id]; });
    var count = +$('count').value;
    startSession(makeQuestions(tpls, count), '錯題本');
  }

  // 類題：同一個主題的所有題目（產生器每次換數字）
  function startSimilar(keys) {
    var set = {}; keys.forEach(function (k) { set[k] = 1; });
    var tpls = TEMPLATES.filter(function (t) { return set[tagKey(t)]; });
    var count = Math.max(+$('count').value || 20, 5);
    if (keys.length === 1) count = Math.min(count, Math.max(tpls.length, tpls.some(function (t) { return t.kind === 'g'; }) ? 8 : tpls.length));
    startSession(makeQuestions(tpls, count, { fillWithGen: true }), '類題練習');
  }

  function startWeakest() {
    var weak = weakList().filter(function (w) { return w.acc < 0.8 && w.hard === isHardMode(); }).slice(0, 5).map(function (w) { return w.key; });
    if (!weak.length) { flash('目前沒有不熟的主題，繼續保持！'); return; }
    startSimilar(weak);
  }

  // ---------- 作答畫面 ----------
  function renderQ() {
    var s = session, q = s.qs[s.i], t = q.tpl;
    $('qProg').textContent = s.title + '　第 ' + (s.i + 1) + ' / ' + s.qs.length + ' 題';
    $('qTag').textContent = (t.hard ? '困難・' : '') + SUBJ[t.si].name + '・' + SUBJ[t.si].units[t.ui].name + '・' + t.tag;
    $('qBar').style.width = (s.i / s.qs.length * 100) + '%';
    $("qText").innerHTML = fmt(q.q) + (q.fig ? '<div class="figbox">' + q.fig + '</div>' : '');
    var box = $('qOpts'); box.innerHTML = '';
    q.opts.forEach(function (o, i) {
      var b = document.createElement('button');
      b.innerHTML = '<span class="k">' + (i + 1) + '.</span>' + fmt(o);
      b.onclick = function () { answer(i); };
      if (s.exam && s.picks[s.i] === i) b.classList.add('pick');
      box.appendChild(b);
    });
    $('qFeedback').innerHTML = '';
    s.answered = false;
    $('prevBtn').classList.toggle('hidden', !s.exam);
    $('prevBtn').disabled = s.i === 0;
    var nav = $('qNav'); nav.classList.toggle('hidden', !s.exam);
    if (s.exam) {
      $('nextBtn').classList.toggle('hidden', s.i + 1 >= s.qs.length);
      $('nextBtn').textContent = '下一題 ▶';
      $('qBar').style.width = (s.picks.filter(function (p) { return p != null; }).length / s.qs.length * 100) + '%';
      nav.innerHTML = s.qs.map(function (_, k) { return '<button class="' + (s.picks[k] != null ? 'done' : '') + (k === s.i ? ' cur' : '') + '" data-k="' + k + '">' + (k + 1) + '</button>'; }).join('');
      Array.prototype.forEach.call(nav.children, function (b) { b.onclick = function () { s.i = +b.getAttribute('data-k'); renderQ(); }; });
    } else $('nextBtn').classList.add('hidden');
    sketchLabel();
  }

  // 計算區：每題一份，存在 q.sketch
  function sketchLabel() { var q = session.qs[session.i]; $('sketchBtn').textContent = '✏️ 計算區' + (Scratch.has(q.sketch) ? ' •' : ''); saveCur(); }
  function qHtml(q) { return '<div class="qq">' + fmt(q.q) + '</div>' + (q.fig ? '<div class="figbox">' + q.fig + '</div>' : '') + q.opts.map(function (o, i) { return '<div>' + (i + 1) + '. ' + fmt(o) + '</div>'; }).join(''); }
  function openSketch() {
    var q = session.qs[session.i];
    Scratch.open({ data: q.sketch || (q.sketch = {}), html: qHtml(q), onClose: sketchLabel });
  }
  function reviewSketch(r, k) {
    var q = r.q;
    Scratch.open({ data: q.sketch, fit: true, tool: 'hand', html: '<b>第 ' + (k + 1) + ' 題</b>' + qHtml(q) +
      '<div class="' + (r.ok ? 'okc' : 'badc') + '">你的答案：' + (r.mine == null ? '（未作答）' : fmt(q.opts[r.mine])) + '</div><div class="okc">正解：' + fmt(q.opts[q.ans]) + '</div><div class="hint">' + fmt(q.exp) + '</div>' });
  }

  function answer(i) {
    var s = session;
    if (s.exam) { s.picks[s.i] = i; renderQ(); return; }
    if (s.answered) return; s.answered = true;
    var q = s.qs[s.i];
    record(q, i);
    s.results.push({ q: q, mine: i, ok: i === q.ans });
    showAnswer(i);
    saveCur();
  }
  function showAnswer(i) {
    var s = session, q = s.qs[s.i], ok = i === q.ans;
    s.answered = true;
    var btns = $('qOpts').children;
    for (var k = 0; k < btns.length; k++) { btns[k].disabled = true; if (k === q.ans) btns[k].classList.add('ok'); }
    if (!ok) btns[i].classList.add('bad');
    $('qFeedback').innerHTML = '<div class="exp"><div class="verdict ' + (ok ? 'ok">✔ 答對了' : 'bad">✘ 答錯了，正解是 ' + (q.ans + 1) + '. ' + fmt(q.opts[q.ans])) + '</div>' + fmt(q.exp) + '</div>';
    $('nextBtn').classList.remove('hidden');
    $('nextBtn').textContent = s.i + 1 < s.qs.length ? '下一題 ▶' : '看成績';
    $('nextBtn').focus();
  }

  function record(q, i) {
    var t = q.tpl, ok = i === q.ans;
    // 紀錄：主題正確率
    var key = tagKey(t);
    var st = store.stats[key] || { n: 0, c: 0, rw: 0 };
    st.n++; if (ok) { st.c++; st.rw = 0; } else st.rw = (st.rw || 0) + 1;
    store.stats[key] = st;
    // 錯題本：答錯 +1，之後答對 -1，歸零就移出
    if (!ok) {
      store.wrong[t.id] = (store.wrong[t.id] || 0) + 1;
      store.log.unshift({ id: t.id, q: q.q, fig: q.fig, mine: q.opts[i], ans: q.opts[q.ans], exp: q.exp, time: Date.now() });
      if (store.log.length > 300) store.log.length = 300;
    } else if (store.wrong[t.id]) {
      store.wrong[t.id]--; if (store.wrong[t.id] <= 0) delete store.wrong[t.id];
    }
    save();
  }

  function next() {
    var s = session;
    if (s.exam) { if (s.i + 1 < s.qs.length) { s.i++; renderQ(); } return; }
    if (!s.answered) return;
    s.i++;
    if (s.i >= s.qs.length) finish(); else renderQ();
  }
  function prev() { var s = session; if (s.exam && s.i > 0) { s.i--; renderQ(); } }

  // 交卷：測驗模式還有沒作答的題目要按兩次確認
  var submitArmed = false;
  function submit() {
    var s = session;
    if (s.exam) {
      var left = s.picks.filter(function (p) { return p == null; }).length;
      if (left && !submitArmed) {
        submitArmed = true; $('quitBtn').textContent = '還有 ' + left + ' 題沒寫，再按一次交卷';
        setTimeout(function () { submitArmed = false; if (session === s) $('quitBtn').textContent = '交卷'; }, 4000);
        return;
      }
    }
    submitArmed = false;
    finish();
  }

  // ---------- 計時器 ----------
  function fmtTime(sec) { var m = Math.floor(sec / 60), x = sec % 60; return m + ':' + (x < 10 ? '0' : '') + x; }
  function stopTimer() { if (session && session.timer) { clearInterval(session.timer); session.timer = null; } $('qTimer').classList.add('hidden'); }
  function startTimer(s, min) {
    s.end = Date.now() + min * 60000;
    var el = $('qTimer'); el.classList.remove('hidden', 'low');
    function tick() {
      var left = Math.max(0, Math.round((s.end - Date.now()) / 1000));
      el.textContent = '⏱ ' + fmtTime(left); el.classList.toggle('low', left <= 60);
      if (!left) { clearInterval(s.timer); s.timer = null; $('timeUp').classList.remove('hidden'); $('timeUpBtn').focus(); }
    }
    tick(); s.timer = setInterval(tick, 500);
  }

  // ---------- 成績 ----------
  function finish() {
    var s = session;
    stopTimer(); $('timeUp').classList.add('hidden');
    if (Scratch.isOpen()) Scratch.close();
    // 測驗模式：交卷時才一次寫入紀錄（沒作答的題目不記）
    if (s.exam && !s.done) {
      s.done = true;
      s.results = s.qs.map(function (q, k) { var i = s.picks[k]; if (i != null) record(q, i); return { q: q, mine: i, ok: i === q.ans }; });
    }
    var res = s.results;
    if (!res.length) { show('home'); renderHome(); return; }
    var c = res.filter(function (r) { return r.ok; }).length;
    $('rScore').textContent = Math.round(c / res.length * 100) + ' 分';
    $('rDetail').textContent = '答對 ' + c + ' / ' + res.length + ' 題';

    // 依主題統計這次的表現
    var by = {};
    res.forEach(function (r) {
      var t = r.q.tpl, k = SUBJ[t.si].name + '｜' + t.tag;
      by[k] = by[k] || { n: 0, c: 0, key: tagKey(t) }; by[k].n++; if (r.ok) by[k].c++;
    });
    var rows = Object.keys(by).map(function (k) { return [k, by[k]]; }).sort(function (a, b) { return a[1].c / a[1].n - b[1].c / b[1].n; });
    var html = '<tr><th>科目｜主題</th><th>這次</th></tr>';
    rows.forEach(function (r) { var v = r[1]; html += '<tr><td>' + esc(r[0]) + '</td><td class="' + (v.c === v.n ? 'okc' : 'badc') + '">' + v.c + '/' + v.n + '</td></tr>'; });
    $('rTable').innerHTML = html;

    var wrong = res.filter(function (r) { return !r.ok; });
    $('retryWrong').disabled = !wrong.length;
    $('similarWrong').disabled = !wrong.length;
    session.wrongTpls = wrong.map(function (r) { return r.q.tpl; });
    $('rWrongCard').style.display = wrong.length ? '' : 'none';
    $('rWrong').innerHTML = wrong.map(function (r) {
      var k = res.indexOf(r);
      return '<div class="wrong">' + (Scratch.has(r.q.sketch) ? '<button class="btn small ghost" style="float:right" data-sk="' + k + '">✏️ 看計算區</button>' : '') + '<div class="q">' + fmt(r.q.q) + '</div>' + (r.q.fig ? '<div class="figbox small">' + r.q.fig + '</div>' : '') + '<div class="badc">你的答案：' + (r.mine == null ? '（未作答）' : fmt(r.q.opts[r.mine])) + '</div><div class="okc">正解：' + fmt(r.q.opts[r.q.ans]) + '</div><div class="hint">' + fmt(r.q.exp) + '</div></div>';
    }).join('');
    var sk = res.filter(function (r) { return Scratch.has(r.q.sketch); });
    $('rSketchCard').style.display = sk.length ? '' : 'none';
    $('rSketch').innerHTML = sk.map(function (r) { var k = res.indexOf(r); return '<button class="btn small ' + (r.ok ? 'ghost' : '') + '" data-sk="' + k + '">第 ' + (k + 1) + ' 題 ' + (r.ok ? '✔' : '✘') + '</button>'; }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('#result [data-sk]'), function (b) {
      b.onclick = function () { var k = +b.getAttribute('data-sk'); reviewSketch(res[k], k); };
    });
    $('qBar').style.width = '100%';
    show('result');
  }

  // ---------- 錯題紀錄 ----------
  function renderLog() {
    var box = $('logList');
    if (!store.log.length) { box.innerHTML = '<span class="muted">目前沒有錯題紀錄</span>'; return; }
    var groups = {};
    store.log.forEach(function (l) {
      var t = TPL_BY_ID[l.id]; if (!t) return;
      var k = tagKey(t);
      groups[k] = groups[k] || { t: t, items: [] }; groups[k].items.push(l);
    });
    var keys = Object.keys(groups).sort(function (a, b) { return groups[b].items.length - groups[a].items.length; });
    box.innerHTML = keys.map(function (k) {
      var g = groups[k], t = g.t;
      return '<details class="lg"><summary><b>' + esc(SUBJ[t.si].name) + '・' + esc(t.tag) + '</b>' + (t.hard ? ' <span class="tag hardtag">困難</span>' : '') + ' <span class="muted">（' + esc(SUBJ[t.si].units[t.ui].name) + '）錯 ' + g.items.length + ' 次</span> <button class="btn small" data-k="' + esc(k) + '">練類題</button></summary>' +
        g.items.slice(0, 10).map(function (l) {
          return '<div class="wrong"><div class="q">' + fmt(l.q) + '</div>' + (l.fig ? '<div class="figbox small">' + l.fig + '</div>' : '') + '<div class="badc">你選：' + fmt(l.mine) + '</div><div class="okc">正解：' + fmt(l.ans) + '</div><div class="hint">' + fmt(l.exp) + '<br>' + new Date(l.time).toLocaleString() + '</div></div>';
        }).join('') + '</details>';
    }).join('');
    Array.prototype.forEach.call(box.querySelectorAll('button[data-k]'), function (b) {
      b.onclick = function (e) { e.preventDefault(); startSimilar([b.getAttribute('data-k')]); };
    });
  }

  // ---------- 畫面切換 ----------
  function show(id) {
    ['home', 'quiz', 'result', 'log'].forEach(function (x) { $(x).classList.toggle('hidden', x !== id); });
    if (id !== 'quiz') try { sessionStorage.removeItem(CUR_KEY); } catch (e) {}
    window.scrollTo(0, 0);
  }

  // ---------- 綁定事件 ----------
  $('allOn').onclick = function () { SUBJ.forEach(function (s) { sel[s.id].on = true; }); save(); renderHome(); };
  $('allOff').onclick = function () { SUBJ.forEach(function (s) { sel[s.id].on = false; }); save(); renderHome(); };
  $('modeEasy').onclick = function () { store.mode = 'easy'; save(); renderHome(); };
  $('modeHard').onclick = function () { store.mode = 'hard'; save(); renderHome(); };
  $('optCalcOnly').checked = !!store.calcOnly;
  $('optCalcOnly').onchange = function () { store.calcOnly = this.checked; save(); renderHome(); };
  $('startBtn').onclick = startNormal;
  $('wrongBtn').onclick = startWrongBook;
  $('weakBtn').onclick = startWeakest;
  $('logBtn').onclick = function () { renderLog(); show('log'); };
  $('logBack').onclick = function () { show('home'); renderHome(); };
  $('nextBtn').onclick = next;
  $('sketchBtn').onclick = openSketch;
  $('prevBtn').onclick = prev;
  $('quitBtn').onclick = submit;
  $('timeUpBtn').onclick = finish;
  if (store.exam === undefined) store.exam = true;
  $('optExam').checked = store.exam;
  $('optExam').onchange = function () { store.exam = this.checked; save(); };
  $('optTimer').checked = !!store.timerOn;
  $('timerMin').value = store.timerMin = store.timerMin || 30;
  $('optTimer').onchange = function () { store.timerOn = this.checked; save(); };
  $('timerMin').onchange = function () { var v = Math.round(+this.value); if (!(v > 0)) v = 30; if (v > 300) v = 300; this.value = v; store.timerMin = v; save(); };
  $('homeBtn').onclick = function () { show('home'); renderHome(); };
  $('retryWrong').onclick = function () { startSession(session.wrongTpls.map(build), '重練錯題'); };
  $('similarWrong').onclick = function () {
    var keys = {}; session.wrongTpls.forEach(function (t) { keys[tagKey(t)] = 1; });
    startSimilar(Object.keys(keys));
  };
  // 清除紀錄要按兩次確認（不用 confirm 對話框）
  var resetArmed = false;
  $('resetBtn').onclick = function () {
    if (!resetArmed) {
      resetArmed = true; $('resetBtn').textContent = '再按一次確定清除';
      setTimeout(function () { resetArmed = false; $('resetBtn').textContent = '清除紀錄'; }, 4000);
      return;
    }
    resetArmed = false; $('resetBtn').textContent = '清除紀錄';
    store.stats = {}; store.wrong = {}; store.log = []; save(); renderHome(); flash('紀錄已清除。');
  };

  function flash(text) {
    show('home'); renderHome();
    var m = $('homeMsg'); m.textContent = text; m.hidden = false;
    clearTimeout(flash.t); flash.t = setTimeout(function () { m.hidden = true; }, 4000);
  }
  document.addEventListener('keydown', function (e) {
    if (Scratch.isOpen() || $('quiz').classList.contains('hidden') || !$('timeUp').classList.contains('hidden')) return;
    if (session && session.exam && e.key === 'ArrowLeft') { prev(); return; }
    if (session && session.exam && e.key === 'ArrowRight') { next(); return; }
    if (e.key >= '1' && e.key <= '4') { var b = $('qOpts').children[+e.key - 1]; if (b) b.click(); }
    else if (e.key === 'Enter' && session && (session.answered || session.exam)) { e.preventDefault(); next(); }
  });

  // ---------- 更新日誌畫面 ----------
  var latest = CHANGELOG[0];
  $('verText').textContent = '目前版本 v' + latest.v + '（' + latest.date + '）';
  $('clList').innerHTML = CHANGELOG.map(function (c, i) {
    return '<div class="cl"><span class="v">v' + esc(c.v) + '</span> <span class="muted">' + esc(c.date) + '</span>' + (i === 0 ? '<span class="new">最新</span>' : '') +
      '<ul>' + c.items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>';
  }).join('');
  // 有新版本時按鈕顯示提示，看過就消失
  if (store.seenVer !== latest.v) $('clBtn').textContent = '更新日誌 ●';
  $('clBtn').onclick = function () {
    var c = $('clCard'), open = c.hidden;
    c.hidden = !open; $('clBtn').setAttribute('aria-expanded', String(open));
    if (open && store.seenVer !== latest.v) { store.seenVer = latest.v; save(); $('clBtn').textContent = '更新日誌'; }
  };

  renderHome();
  restoreCur();
})();
