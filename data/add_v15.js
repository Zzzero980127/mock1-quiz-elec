/* v1.5：專業科目的「變化圖」題型——電路的結構、元件方向、極性、波形設定每次都換，不只換數字。
 * 基本電學：串並聯網路（隨機結構）、色碼電阻、導線拉長／剪斷、雙電源節點、惠斯登電橋
 * 電子學：示波器讀值（正弦／方波／三角波、含直流準位）、二極體串聯、截波電路、稽納穩壓、BJT 偏壓（固定／射極／分壓）
 * 數位邏輯：隨機組合邏輯電路、時序圖；微處理機：記憶體 IC 腳位；程式設計：流程圖追蹤
 * 用 DR（_draw.js）畫圖；一律 addEasy／addHard／addTc 往後接，不插隊、不刪題。
 */
(function () {
  var H = QH, D = H.dec, R = DR;
  function O(ans, c, mf) { var r = H.opts(ans, c, mf); return r.length < 4 ? H.fill(r) : r; }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function T(x, y, s, a, sz) { return R.text(x, y, esc(s), a, sz); }
  // 越乾淨（小數位越少）的數字分數越低
  function messy(list) { return list.filter(function (x) { return Math.abs(x * 100 - Math.round(x * 100)) > 1e-6; }).length; }
  function best(make, tries) { var b = null; for (var i = 0; i < (tries || 40); i++) { var r = make(); if (!r) continue; if (!b || r.score < b.score) b = r; if (b.score === 0) break; } return b; }
  function U(u, d) { return function (x) { return D(x, d === undefined ? 2 : d) + ' ' + u; }; }
  function more(f, ans) { return function (k) { return f(ans * (1 + (k % 2 ? 1 : -1) * 0.1 * Math.ceil(k / 2)) + (ans === 0 ? k : 0)); }; }
  var RV = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60];

  /* ================= 基本電學 ================= */

  // 串並聯網路：隨機產生樹狀結構（串、並交錯），自動排版
  function rtree(k, pt) {
    if (k === 1) return { t: 'R', v: pick(RV) };
    var t = pt === 'S' ? 'P' : pt === 'P' ? 'S' : pick(['S', 'P']), parts;
    if (k === 3 && Math.random() < 0.25) parts = [1, 1, 1]; else { var a = ri(1, k - 1); parts = [a, k - a]; }
    return { t: t, c: parts.map(function (p) { return rtree(p, t); }) };
  }
  function req(nd) { if (nd.t === 'R') return nd.v; var s = 0; nd.c.forEach(function (c) { s += nd.t === 'S' ? req(c) : 1 / req(c); }); return nd.t === 'S' ? s : 1 / s; }
  function lay(nd) {
    if (nd.t === 'R') { nd.w = 66; nd.h = 46; nd.tt = 26; return; }
    nd.c.forEach(lay);
    if (nd.t === 'S') { nd.tt = Math.max.apply(null, nd.c.map(function (c) { return c.tt; })); nd.h = Math.max.apply(null, nd.c.map(function (c) { return nd.tt - c.tt + c.h; })); nd.w = nd.c.reduce(function (a, c) { return a + c.w; }, 0); }
    else { nd.w = Math.max.apply(null, nd.c.map(function (c) { return c.w; })) + 40; nd.h = nd.c.reduce(function (a, c) { return a + c.h; }, 0); nd.tt = nd.c[0].tt; }
  }
  function drawNet(nd, x, y, names) {
    if (nd.t === 'R') { names.push(nd); nd.name = 'R' + names.length; return R.el('R', [x, y + nd.tt], [x + 66, y + nd.tt], { l: nd.name + ' ' + nd.v + 'Ω', side: 'a' }); }
    var s = '';
    if (nd.t === 'S') { var cx = x; nd.c.forEach(function (c) { s += drawNet(c, cx, y + nd.tt - c.tt, names); cx += c.w; }); return s; }
    var cy = y, lx = x + 10, rx = x + nd.w - 10, ys = [];
    nd.c.forEach(function (c, i) {
      var ty = cy + c.tt; ys.push(ty);
      s += drawNet(c, x + 20, cy, names) + R.wire([lx, ty], [x + 20, ty]) + R.wire([x + 20 + c.w, ty], [rx, ty]);
      if (i < nd.c.length - 1) s += R.dot(lx, ty) + R.dot(rx, ty);
      cy += c.h;
    });
    return s + R.wire([lx, ys[0]], [lx, ys[ys.length - 1]]) + R.wire([rx, ys[0]], [rx, ys[ys.length - 1]]) + R.wire([x, y + nd.tt], [lx, y + nd.tt]) + R.wire([rx, y + nd.tt], [x + nd.w, y + nd.tt]);
  }
  function solve(nd, V) { if (nd.t === 'R') { nd.V = V; nd.I = V / nd.v; return; } if (nd.t === 'S') { var I = V / req(nd); nd.c.forEach(function (c) { solve(c, I * req(c)); }); } else nd.c.forEach(function (c) { solve(c, V); }); }
  function leaves(nd, out) { if (nd.t === 'R') out.push(nd); else nd.c.forEach(function (c) { leaves(c, out); }); return out; }
  function expr(nd) { if (nd.t === 'R') return nd.name; return '(' + nd.c.map(expr).join(nd.t === 'S' ? ' + ' : ' ∥ ') + ')'; }
  function network() {
    var b = best(function () {
      var tr = rtree(ri(3, 5), null); lay(tr); if (tr.w > 290) return null;
      var Rt = req(tr), E = pick([6, 12, 18, 24, 30, 36, 48, 60]); solve(tr, E);
      var ls = leaves(tr, []), tg = pick(ls);
      return { score: messy([Rt, E / Rt, tg.V, tg.I]) + messy(ls.map(function (l) { return l.I; })) * 0.2, tr: tr, Rt: Rt, E: E, ls: ls, tg: tg };
    });
    var tr = b.tr, names = [], ox = 90, oy = 6, body = drawNet(tr, ox, oy, names), ask = pick(['req', 'I', 'V', 'Ik']);
    var yt = oy + tr.tt, yb = oy + tr.h + 20, xr = ox + tr.w + 18, Om = U('Ω'), A = U('A', 3), V = U('V');
    if (ask === 'req') body += R.wire([ox - 30, yt], [ox, yt]) + R.term(ox - 30, yt) + T(ox - 36, yt + 5, 'a', 'end') + R.wire([ox + tr.w, yt], [xr, yt]) + R.term(xr, yt) + T(xr + 7, yt + 5, 'b', 'start');
    else body += R.wire([ox + tr.w, yt], [xr, yt], [xr, yb], [50, yb]) + R.el('V', [50, yb], [50, yt], { plus: 'b', l: 'E=' + b.E + 'V', side: 'l' }) + R.wire([50, yt], [ox, yt]);
    var fig = R.svg(xr + 24, yb + 10, body), tg = b.tg;
    var ex = '結構：R_T = ' + expr(tr).replace(/^\(|\)$/g, '') + '（+ 串聯、∥ 並聯）= ' + Om(b.Rt) + '。';
    var detail = '\n各電阻（電壓／電流）：' + b.ls.map(function (l) { return l.name + ' ' + D(l.V, 2) + ' V／' + D(l.I, 3) + ' A'; }).join('、');
    if (ask === 'req') return ['如圖電路，a、b 兩端的總電阻為何？', O(Om(b.Rt), [Om(b.ls.reduce(function (s, l) { return s + l.v; }, 0)), Om(1 / b.ls.reduce(function (s, l) { return s + 1 / l.v; }, 0)), Om(b.Rt * 1.5), Om(b.Rt + pick(b.ls).v)], more(Om, b.Rt)), ex + '\n先算最內層的並聯（R∥R = 乘積/和），再一層層往外合併。', fig];
    if (ask === 'I') return ['如圖電路，電源供給的總電流為何？', O(A(b.E / b.Rt), [A(b.E / b.ls.reduce(function (s, l) { return s + l.v; }, 0)), A(b.E * b.Rt / 100), A(b.E / b.Rt * 2), A(b.E / b.Rt / 2)], more(A, b.E / b.Rt)), ex + '\nI = E / R_T = ' + b.E + ' ÷ ' + D(b.Rt, 3) + ' = ' + A(b.E / b.Rt) + '。', fig];
    if (ask === 'V') return ['如圖電路，' + tg.name + ' 兩端的電壓為何？', O(V(tg.V), b.ls.filter(function (l) { return Math.abs(l.V - tg.V) > 1e-9; }).map(function (l) { return V(l.V); }).concat([V(b.E), V(b.E / b.ls.length)]), more(V, tg.V)), ex + '\n總電流 I = ' + A(b.E / b.Rt) + '；串聯部分分壓、並聯部分電壓相同。' + detail, fig];
    return ['如圖電路，流過 ' + tg.name + ' 的電流為何？', O(A(tg.I), b.ls.filter(function (l) { return Math.abs(l.I - tg.I) > 1e-9; }).map(function (l) { return A(l.I); }).concat([A(b.E / b.Rt), A(b.E / tg.v)]), more(A, tg.I)), ex + '\n總電流 I = ' + A(b.E / b.Rt) + '；並聯支路依電阻反比分流。' + detail, fig];
  }

  // 色碼電阻：四環或五環，顏色真的畫出來（下面也標顏色名）
  var COL = [['黑', '#111'], ['棕', '#7b4a1e'], ['紅', '#d22'], ['橙', '#f80'], ['黃', '#ee0'], ['綠', '#1a1'], ['藍', '#24f'], ['紫', '#a2d'], ['灰', '#888'], ['白', '#fff']], GOLD = ['金', '#c9a227'], SILV = ['銀', '#c0c0c0'];
  function ohm(x) { return x >= 1e6 ? D(x / 1e6, 3) + ' MΩ' : x >= 1000 ? D(x / 1000, 3) + ' kΩ' : D(x, 3) + ' Ω'; }
  function colorCode() {
    var five = Math.random() < 0.35, dg = [ri(1, 9), ri(0, 9)]; if (five) dg.push(ri(0, 9));
    var e = ri(five ? -1 : -2, five ? 3 : 5), tol = five ? pick([['棕', 1], ['紅', 2], ['金', 5]]) : pick([['金', 5], ['銀', 10]]);
    var num = +dg.join(''), val = num * Math.pow(10, e), bands = dg.map(function (d) { return COL[d]; });
    bands.push(e === -1 ? GOLD : e === -2 ? SILV : COL[e]); bands.push(tol[0] === '棕' ? COL[1] : tol[0] === '紅' ? COL[2] : tol[0] === '金' ? GOLD : SILV);
    var s = R.line(10, 50, 70, 50) + R.line(290, 50, 350, 50) + '<rect x="70" y="28" width="220" height="44" rx="18" style="fill:#e8d3a8;stroke:currentColor"/>';
    bands.forEach(function (c, i) { var x = i === bands.length - 1 ? 255 : 95 + i * 30; s += '<rect x="' + x + '" y="28" width="14" height="44" style="fill:' + c[1] + ';stroke:#333;stroke-width:.8"/>' + T(x + 7, 92, c[0], 'middle', 12); });
    var fig = R.svg(360, 100, s), ask = pick(['val', 'val', 'range']), f = function (v, t) { return ohm(v) + ' ± ' + t + '%'; };
    var swap = +(String(dg[1]) + String(dg[0]) + (five ? String(dg[2]) : '')) * Math.pow(10, e);
    var ex = '前 ' + (five ? 3 : 2) + ' 環是數字（' + dg.join('、') + '），第 ' + (five ? 4 : 3) + ' 環是乘數（' + bands[dg.length][0] + ' = 10^' + e + '），最後一環是誤差（' + tol[0] + ' ±' + tol[1] + '%）。\n黑0 棕1 紅2 橙3 黃4 綠5 藍6 紫7 灰8 白9；乘數金 = 0.1、銀 = 0.01。\n→ ' + num + ' × 10^' + e + ' = ' + ohm(val) + '。';
    if (ask === 'val') return ['如圖' + (five ? '五' : '四') + '環色碼電阻（由左讀起），其電阻值為何？', O(f(val, tol[1]), [f(val * 10, tol[1]), f(val / 10, tol[1]), f(swap, tol[1]), f(val, tol[1] === 5 ? 10 : 5)]), ex, fig];
    var lo = val * (1 - tol[1] / 100), hi = val * (1 + tol[1] / 100);
    return ['如圖' + (five ? '五' : '四') + '環色碼電阻（由左讀起），其實際電阻值的合格範圍為何？', O(ohm(lo) + ' ～ ' + ohm(hi), [ohm(val * (1 - tol[1] / 50)) + ' ～ ' + ohm(val * (1 + tol[1] / 50)), ohm(lo * 10) + ' ～ ' + ohm(hi * 10), ohm(val) + ' ～ ' + ohm(hi)]), ex + '\n範圍 = 標稱值 × (1 ± ' + tol[1] + '%)。', fig];
  }

  // 導線改變形狀：拉長、剪斷並聯、換直徑
  function wireR() {
    var R0 = pick([2, 4, 5, 8, 10, 12, 20]), k = pick([2, 3, 4]), type = pick(['stretch', 'cut', 'diam']), s = '', Rn, q, ex;
    var bar = function (x, y, w, h) { return '<rect x="' + x + '" y="' + (y - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + Math.min(4, h / 2) + '" style="fill:var(--accent-soft);stroke:currentColor"/>'; };
    s += bar(20, 30, 90, 16) + T(65, 58, '原導線 R = ' + R0 + ' Ω', 'middle', 12);
    if (type === 'stretch') { Rn = R0 * k * k; s += bar(140, 30, Math.min(210, 90 * k), 16 / Math.sqrt(k)) + T(245, 58, '均勻拉長為 ' + k + ' 倍長', 'middle', 12); q = '把電阻 ' + R0 + ' Ω 的導線均勻拉長為原來的 ' + k + ' 倍（體積不變），新電阻為何？'; ex = '長度 ×' + k + '、截面積 ÷' + k + ' → R = ρL/A 變 ' + k + '×' + k + ' = ' + k * k + ' 倍 = ' + Rn + ' Ω。'; }
    else if (type === 'cut') { Rn = R0 / (k * k); for (var i = 0; i < k; i++) s += bar(170, 12 + i * 18, 90 / k, 12); s += R.line(165, 12, 165, 12 + (k - 1) * 18) + R.line(175 + 90 / k, 12, 175 + 90 / k, 12 + (k - 1) * 18) + T(220, 32 + k * 18, '剪成 ' + k + ' 等段後並聯', 'middle', 12); q = '把電阻 ' + R0 + ' Ω 的導線剪成 ' + k + ' 等段，再全部並聯，總電阻為何？'; ex = '每段 R/' + k + ' = ' + D(R0 / k, 3) + ' Ω，' + k + ' 段相同電阻並聯再 ÷' + k + ' → R/' + k * k + ' = ' + D(Rn, 4) + ' Ω。'; }
    else { Rn = R0 / (k * k); s += bar(140, 30, 90, Math.min(40, 16 * k)) + T(185, 70, '同材料同長度、直徑 ' + k + ' 倍', 'middle', 12); q = '同材料、同長度的另一條導線，直徑是電阻 ' + R0 + ' Ω 導線的 ' + k + ' 倍，其電阻為何？'; ex = '直徑 ×' + k + ' → 截面積 ×' + k * k + ' → R 變 1/' + k * k + ' = ' + D(Rn, 4) + ' Ω。'; }
    var Om = U('Ω', 4);
    return ['如圖，' + q, O(Om(Rn), [Om(R0 * k), Om(R0 / k), Om(type === 'stretch' ? R0 / (k * k) : R0 * k * k), Om(R0)]), ex, R.svg(360, 80, s)];
  }

  // 雙電源（或電壓源＋電流源）單節點電路：極性隨機
  function twoSrc() {
    var b = best(function () {
      var R1 = pick(RV.slice(0, 11)), R2 = pick(RV.slice(0, 11)), R3 = pick(RV.slice(0, 11)), V1 = pick([6, 9, 10, 12, 15, 18, 20, 24]), V2 = pick([3, 6, 9, 10, 12, 15, 18]);
      var s1 = pick([1, 1, -1]), s2 = pick([1, -1]), isI = Math.random() < 0.3, I = pick([0.5, 1, 1.5, 2, 3]), sI = pick([1, -1]);
      var G = 1 / R1 + 1 / R2 + (isI ? 0 : 1 / R3), VN = (s1 * V1 / R1 + (isI ? sI * I : s2 * V2 / R3)) / G;
      return { score: messy([VN, VN / R2, (s1 * V1 - VN) / R1]), R1: R1, R2: R2, R3: R3, V1: V1, V2: V2, s1: s1, s2: s2, isI: isI, I: I, sI: sI, VN: VN };
    });
    var s = R.el('V', [40, 150], [40, 40], { plus: b.s1 > 0 ? 'b' : 'a', l: 'V1=' + b.V1 + 'V', side: 'l' }) + R.el('R', [40, 40], [170, 40], { l: 'R1 ' + b.R1 + 'Ω' }) + R.el('R', [170, 40], [170, 150], { l: 'R2 ' + b.R2 + 'Ω', side: 'r' });
    if (b.isI) s += R.wire([170, 40], [300, 40]) + R.el('I', [300, 150], [300, 40], { rev: b.sI < 0, l: b.I + 'A', side: 'r' });
    else s += R.el('R', [170, 40], [300, 40], { l: 'R3 ' + b.R3 + 'Ω' }) + R.el('V', [300, 150], [300, 40], { plus: b.s2 > 0 ? 'b' : 'a', l: 'V2=' + b.V2 + 'V', side: 'r' });
    s += R.wire([40, 150], [300, 150]) + R.dot(170, 40) + R.dot(170, 150) + T(170, 28, 'N') + R.gnd(170, 150);
    var fig = R.svg(340, 170, s), V = U('V'), A = U('A', 3), ask = pick(['VN', 'VN', 'I2', 'I1']), I1 = (b.s1 * b.V1 - b.VN) / b.R1;
    var kcl = '以接地為參考，對節點 N 列 KCL（流出為正）：(V_N ' + (b.s1 > 0 ? '− ' : '+ ') + b.V1 + ')/' + b.R1 + ' + V_N/' + b.R2 + (b.isI ? (b.sI > 0 ? ' − ' : ' + ') + b.I : ' + (V_N ' + (b.s2 > 0 ? '− ' : '+ ') + b.V2 + ')/' + b.R3) + ' = 0\n→ V_N = ' + V(b.VN) + '。（電源「+」端在下方時，該電源在上端的電位是負的）';
    if (ask === 'VN') return ['如圖電路，節點 N 對地的電壓 V_N 為何？', O(V(b.VN), [V(-b.VN), V(b.VN * 1.5), V(b.V1 - b.VN), V((b.V1 + b.V2) / 2)], more(V, b.VN)), kcl, fig];
    if (ask === 'I2') return ['如圖電路，流過 R2 的電流（由上往下為正）為何？', O(A(b.VN / b.R2), [A(-b.VN / b.R2), A(b.V1 / b.R2), A(b.VN / b.R1), A(b.VN / b.R2 * 2)], more(A, b.VN / b.R2)), kcl + '\nI_R2 = V_N / R2 = ' + A(b.VN / b.R2) + '。', fig];
    var dir = function (x) { return D(Math.abs(x), 3) + ' A（' + (x >= 0 ? '向右' : '向左') + '）'; };
    return ['如圖電路，流過 R1 的電流大小與方向為何？', O(dir(I1), [dir(-I1), dir(b.V1 / b.R1), dir(I1 * 2), dir(b.VN / b.R1)]), kcl + '\nI_R1 = (V1 端電位 − V_N)/R1 = (' + (b.s1 * b.V1) + ' − ' + D(b.VN, 3) + ')/' + b.R1 + ' = ' + D(I1, 3) + ' A（正值向右）。', fig];
  }

  // 惠斯登電橋：未知電阻的位置隨機
  function bridge() {
    var RB = [100, 200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000], b = best(function () {
      var r = [pick(RB), pick(RB), pick(RB), pick(RB)], u = ri(0, 3); // R1 R2 R3 R4，平衡 R1·R4 = R2·R3
      r[u] = u === 0 ? r[1] * r[2] / r[3] : u === 1 ? r[0] * r[3] / r[2] : u === 2 ? r[0] * r[3] / r[1] : r[1] * r[2] / r[0];
      if (r[u] < 10 || r[u] > 10000) return null;
      return { score: messy([r[u]]), r: r, u: u };
    });
    var P = { A: [60, 110], B: [160, 30], C: [260, 110], Dn: [160, 190] }, pairs = [['A', 'B'], ['B', 'C'], ['A', 'Dn'], ['Dn', 'C']], s = '';
    pairs.forEach(function (p, i) {
      var a = P[p[0]], c = P[p[1]], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, ox = mx + (mx - 160) * 0.45, oy = my + (my - 110) * 0.55;
      s += R.el('R', a, c) + T(ox, oy + 4, i === b.u ? 'R' + (i + 1) + ' = Rx' : 'R' + (i + 1) + ' = ' + b.r[i] + 'Ω', 'middle', 12);
    });
    s += R.el('M', P.B, P.Dn, { m: 'G' }) + R.wire(P.C, [300, 110], [300, 230], [20, 230], [20, 175]) + R.el('V', [20, 175], [20, 110], { plus: 'b', l: 'E', side: 'l' }) + R.wire([20, 110], P.A);
    ['A', 'B', 'C', 'Dn'].forEach(function (k) { s += R.dot(P[k][0], P[k][1]); });
    s += T(52, 104, 'a', 'end') + T(160, 20, 'b') + T(270, 104, 'c', 'start') + T(160, 212, 'd');
    var Om = U('Ω'), x = b.r[b.u], alt = b.r.filter(function (_, i) { return i !== b.u; });
    return ['如圖惠斯登電橋，檢流計 G 指示為零（電橋平衡），未知電阻 Rx 為何？', O(Om(x), [Om(alt[0] * alt[1] / alt[2]), Om(alt[1] * alt[2] / alt[0]), Om(alt[0] * alt[2] / alt[1]), Om(x * 2)], more(Om, x)),
      '平衡條件：對邊電阻乘積相等 → R1 × R4 = R2 × R3（左上×右下 = 右上×左下）。\n代入得 Rx = ' + Om(x) + '。此時 b、d 兩點等電位，檢流計電流為 0。', R.svg(320, 240, s)];
  }

  /* ================= 電子學 ================= */

  // 示波器：波形種類、VOLTS/DIV、TIME/DIV、直流準位都隨機
  function scopeQ() {
    var vd = pick([0.5, 1, 2, 5]), td = pick([[10, 'μs', 1e-6], [20, 'μs', 1e-6], [50, 'μs', 1e-6], [0.1, 'ms', 1e-3], [0.2, 'ms', 1e-3], [0.5, 'ms', 1e-3], [1, 'ms', 1e-3]]);
    var wave = pick(['sin', 'sin', 'sq', 'tri']), Ad = pick([1, 1.5, 2, 2.5, 3]), Pd = pick([2, 2.5, 4, 5]), off = (wave === 'sin' && Math.random() < 0.6) ? 0 : pick([0, 1, -1]);
    if (Ad + Math.abs(off) > 4) Ad = 4 - Math.abs(off);
    var d = 22, x0 = 10, y0 = 10, W = 10 * d, Hh = 8 * d, cy = y0 + Hh / 2, pts = [];
    var fn = function (t) { var u = t / Pd; if (wave === 'sin') return Math.sin(2 * Math.PI * u); if (wave === 'sq') return (u - Math.floor(u)) < 0.5 ? 1 : -1; return 1 - 4 * Math.abs((u - Math.floor(u)) - 0.5); };
    for (var i = 0; i <= 600; i++) { var t = i / 600 * 10; pts.push([x0 + t * d, cy - (off + Ad * fn(t)) * d]); }
    var s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + Hh + '" rx="4"/>' + R.grid(x0, y0, 10, 8, d, true) + '<g stroke-width="0.9" opacity="0.6">' + R.line(x0, cy, x0 + W, cy) + R.line(x0 + W / 2, y0, x0 + W / 2, y0 + Hh) + '</g><g stroke-width="2.2">' + R.wire.apply(null, pts) + '</g>';
    s += T(x0, y0 + Hh + 20, 'VOLTS/DIV：' + vd + ' V　TIME/DIV：' + td[0] + ' ' + td[1], 'start', 12);
    var Vpp = 2 * Ad * vd, Tsec = Pd * td[0] * td[2], f = 1 / Tsec, Hz = function (x) { return x >= 1000 ? D(x / 1000, 3) + ' kHz' : D(x, 2) + ' Hz'; }, V = U('V', 3);
    var asks = ['vpp', 'f', 'f']; if (wave === 'sin' && !off) asks.push('rms'); if (off) asks.push('dc', 'dc');
    var ask = pick(asks), fig = R.svg(W + 20, Hh + 34, s), wn = { sin: '正弦波', sq: '方波', tri: '三角波' }[wave] + '（畫面中央水平線為 0 V）';
    var ex = '峰對峰 = ' + 2 * Ad + ' 格 × ' + vd + ' V = ' + V(Vpp) + '；一週期 = ' + Pd + ' 格 × ' + td[0] + ' ' + td[1] + ' → f = 1/T = ' + Hz(f) + '。' + (off ? '\n波形中心偏離 0 V 線 ' + off + ' 格 → 直流成分 ' + V(off * vd) + '。' : '');
    if (ask === 'vpp') return ['如圖示波器顯示的' + wn + '，其峰對峰值 Vp-p 為何？', O(V(Vpp), [V(Vpp / 2), V(Ad * 2 * (vd === 5 ? 2 : 5)), V(Vpp * 2), V(Ad * vd)]), ex, fig];
    if (ask === 'f') return ['如圖示波器顯示的' + wn + '，其頻率為何？', O(Hz(f), [Hz(f * 10), Hz(f / 10), Hz(1 / (Pd * td[2])), Hz(f * 2)]), ex, fig];
    if (ask === 'rms') return ['如圖示波器顯示的正弦波，其有效值約為何？', O(V(Ad * vd * 0.707), [V(Ad * vd), V(Vpp * 0.707), V(Ad * vd * 0.637), V(Vpp)]), ex + '\n峰值 Vm = ' + V(Ad * vd) + '，有效值 = 0.707 Vm = ' + V(Ad * vd * 0.707) + '。', fig];
    return ['如圖示波器（DC 耦合）顯示的' + wn + '，其直流成分（平均值）為何？', O(V(off * vd), [V(-off * vd), V(0), V((off + Ad) * vd), V(Ad * vd)]), ex + '\n對稱波形的交流部分平均為 0，平均值就是中心準位。', fig];
  }

  // 二極體串聯：電源極性、二極體方向、個數隨機（矽 0.7 V）
  function diodeSeries() {
    var b = best(function () { var E = pick([5, 6, 9, 10, 12, 15]), Rk = pick([0.5, 1, 2, 2.5, 4, 5]), nD = pick([1, 1, 2]), plusTop = Math.random() < 0.75, fwdLR = Math.random() < 0.8, on = plusTop === fwdLR, I = on ? (E - 0.7 * nD) / Rk : 0; return I < 0 ? null : { score: messy([I]), E: E, Rk: Rk, nD: nD, plusTop: plusTop, fwdLR: fwdLR, on: on, I: I }; });
    var s = R.el('V', [40, 140], [40, 40], { plus: b.plusTop ? 'b' : 'a', l: 'E=' + b.E + 'V', side: 'l' }) + R.el('R', [40, 40], [140, 40], { l: 'R ' + b.Rk + 'kΩ' });
    var xs = b.nD === 1 ? [140, 260] : [140, 200, 260];
    for (var i = 0; i < b.nD; i++) s += b.fwdLR ? R.el('D', [xs[i], 40], [xs[i + 1], 40], { l: 'D' + (i + 1) }) : R.el('D', [xs[i + 1], 40], [xs[i], 40], { l: 'D' + (i + 1) });
    s += R.wire([260, 40], [300, 40], [300, 140], [40, 140]);
    var mA = U('mA', 3), V = U('V'), ask = pick(['I', 'I', 'VR', 'VD']), VR = b.I * b.Rk, VD = b.E - VR;
    var ex = b.on ? '電源使電流順時針流，二極體為順偏導通，每顆壓降 0.7 V。\nI = (E − ' + b.nD + '×0.7)/R = (' + b.E + ' − ' + D(0.7 * b.nD, 1) + ')/' + b.Rk + ' kΩ = ' + mA(b.I) + '。' : '二極體的方向和電流方向相反 → 逆偏截止，I = 0，電阻上沒有壓降，電源電壓全部落在二極體上。';
    var fig = R.svg(330, 160, s);
    if (ask === 'I') return ['如圖電路（矽二極體，導通壓降 0.7 V），電路電流 I 為何？', O(mA(b.I), [mA(b.E / b.Rk), mA(b.on ? 0 : (b.E - 0.7 * b.nD) / b.Rk), mA((b.E - 0.7) / b.Rk), mA((b.E + 0.7 * b.nD) / b.Rk)], more(mA, b.I)), ex, fig];
    if (ask === 'VR') return ['如圖電路（矽二極體，導通壓降 0.7 V），電阻 R 兩端的電壓為何？', O(V(VR), [V(b.E), V(VD), V(b.E - 0.7), V(0.7 * b.nD)], more(V, VR)), ex + '\nV_R = I × R = ' + V(VR) + '。', fig];
    return ['如圖電路（矽二極體，導通壓降 0.7 V），二極體' + (b.nD > 1 ? '（全部）' : '') + '兩端的總電壓為何？', O(V(VD), [V(VR), V(b.E), V(0.7), V(0)]), ex + '\nV_D = E − V_R = ' + V(VD) + '。', fig];
  }

  // 截波電路：二極體方向、偏壓電池極性隨機
  function clipper() {
    for (var t = 0; t < 50; t++) {
      var Vm = pick([5, 8, 10, 12, 15, 20]), VB = pick([1, 2, 3, 4, 5]), up = Math.random() < 0.5, sg = pick([1, -1]), L = up ? sg * VB + 0.7 : sg * VB - 0.7;
      if (L <= -Vm + 0.5 || L >= Vm - 0.5) continue;
      var s = R.ac(40, 40, 160, 'vi', 'l') + R.el('R', [40, 40], [150, 40], { l: 'R' }) + R.wire([150, 40], [300, 40]) + R.dot(190, 40);
      s += (up ? R.el('D', [190, 40], [190, 100]) : R.el('D', [190, 100], [190, 40])) + R.el('V', [190, 100], [190, 160], { plus: sg > 0 ? 'a' : 'b', l: VB + 'V', side: 'r' });
      s += R.wire([40, 160], [300, 160]) + R.dot(190, 160) + R.term(300, 40) + R.term(300, 160) + T(306, 104, 'vo', 'start') + T(306, 52, '+', 'start') + T(306, 156, '−', 'start');
      var max = up ? L : Vm, min = up ? -Vm : L, ask = pick(['max', 'min']), V = U('V'), fig = R.svg(330, 180, s);
      var ex = '二極體' + (up ? '陽極在上' : '陰極在上') + '，電池' + (sg > 0 ? '正端在上' : '負端在上') + '（上端電位 ' + (sg * VB) + ' V）。\n' + (up ? '當 vo > ' + (sg * VB) + ' + 0.7 = ' + D(L, 1) + ' V 時二極體導通，vo 被限制在 ' + D(L, 1) + ' V；其餘時間截止，vo = vi。' : '當 vo < ' + (sg * VB) + ' − 0.7 = ' + D(L, 1) + ' V 時二極體導通，vo 被限制在 ' + D(L, 1) + ' V；其餘時間截止，vo = vi。') + '\n輸入峰值 ' + Vm + ' V → vo 最大 ' + V(max) + '、最小 ' + V(min) + '。';
      var cand = [V(-L), V(sg * VB), V(Vm), V(-Vm), V(L + (L > 0 ? -1.4 : 1.4))];
      if (ask === 'max') return ['如圖截波電路，輸入 vi = ' + Vm + ' sinωt V，矽二極體導通壓降 0.7 V，輸出 vo 的最大值為何？', O(V(max), cand.filter(function (c) { return c !== V(max); })), ex, fig];
      return ['如圖截波電路，輸入 vi = ' + Vm + ' sinωt V，矽二極體導通壓降 0.7 V，輸出 vo 的最小值為何？', O(V(min), cand.filter(function (c) { return c !== V(min); })), ex, fig];
    }
    return clipper();
  }

  // 稽納穩壓：負載可能大到讓稽納不崩潰
  function zener() {
    var b = best(function () {
      var Vi = pick([12, 15, 18, 20, 24]), Rs = pick([0.2, 0.25, 0.5, 1]), Vz = pick([5, 6, 9, 10, 12]), RL = pick([0.25, 0.5, 1, 2, 5, 10]);
      if (Vz > Vi - 2) return null;
      var Vth = Vi * RL / (Rs + RL), on = Vth >= Vz, VL = on ? Vz : Vth, IS = (Vi - VL) / Rs, IL = VL / RL, IZ = on ? IS - IL : 0;
      return { score: messy([VL, IS, IL, IZ]), Vi: Vi, Rs: Rs, Vz: Vz, RL: RL, on: on, VL: VL, IS: IS, IL: IL, IZ: IZ, Vth: Vth };
    });
    var s = R.el('V', [40, 150], [40, 40], { plus: 'b', l: 'Vi=' + b.Vi + 'V', side: 'l' }) + R.el('R', [40, 40], [170, 40], { l: 'Rs ' + D(b.Rs * 1000, 0) + 'Ω' }) + R.wire([170, 40], [280, 40]);
    s += R.el('Z', [190, 150], [190, 40], { l: 'Vz=' + b.Vz + 'V', side: 'l' }) + R.el('R', [280, 40], [280, 150], { l: 'RL ' + (b.RL >= 1 ? b.RL + 'kΩ' : D(b.RL * 1000, 0) + 'Ω'), side: 'r' }) + R.wire([40, 150], [280, 150]) + R.dot(190, 40) + R.dot(190, 150);
    var fig = R.svg(330, 170, s), mA = U('mA', 3), V = U('V'), ask = pick(['IZ', 'IZ', 'VL']);
    var ex = '先拿掉稽納看負載電壓：Vi × RL/(Rs + RL) = ' + D(b.Vth, 3) + ' V ' + (b.on ? '≥' : '<') + ' Vz = ' + b.Vz + ' V → 稽納' + (b.on ? '崩潰，VL = Vz = ' + b.Vz + ' V' : '不崩潰（相當於斷路），VL = ' + V(b.VL)) + '。' + (b.on ? '\nIs = (Vi − Vz)/Rs = ' + mA(b.IS) + '、IL = Vz/RL = ' + mA(b.IL) + ' → IZ = Is − IL = ' + mA(b.IZ) + '。' : '\nIZ = 0。');
    if (ask === 'IZ') return ['如圖稽納二極體穩壓電路，流過稽納二極體的電流 IZ 為何？', O(mA(b.IZ), [mA(b.IS), mA(b.IL), mA(b.on ? 0 : (b.Vi - b.Vz) / b.Rs - b.Vz / b.RL), mA(b.IS + b.IL)], more(mA, b.IZ)), ex, fig];
    return ['如圖稽納二極體穩壓電路，負載 RL 兩端的電壓為何？', O(V(b.VL), [V(b.on ? b.Vth : b.Vz), V(b.Vi), V(b.Vi - b.Vz), V(b.VL / 2)], more(V, b.VL)), ex, fig];
  }

  // BJT 直流偏壓：固定偏壓、射極回授、分壓偏壓
  function bjt() {
    var b = best(function () {
      var type = pick(['fix', 'emit', 'div', 'div']), Vcc = pick([9, 10, 12, 15, 20]), beta = pick([50, 80, 100, 120, 150, 200]), RC = pick([1, 2, 2.2, 3, 4, 4.7, 5]), r = { type: type, Vcc: Vcc, beta: beta, RC: RC };
      if (type === 'fix') { r.RB = pick([100, 200, 220, 300, 470, 500, 1000]); r.IB = (Vcc - 0.7) / r.RB; r.IC = beta * r.IB; r.VCE = Vcc - r.IC * RC; }
      else if (type === 'emit') { r.RB = pick([100, 200, 300, 470, 500]); r.RE = pick([0.5, 1, 2]); r.IB = (Vcc - 0.7) / (r.RB + (beta + 1) * r.RE); r.IC = beta * r.IB; r.VCE = Vcc - r.IC * RC - (beta + 1) * r.IB * r.RE; }
      else { r.R1 = pick([10, 20, 30, 40, 47, 50, 60, 80, 100]); r.R2 = pick([5, 10, 15, 20]); r.RE = pick([0.5, 1, 1.2, 2]); r.VB = Vcc * r.R2 / (r.R1 + r.R2); r.IC = (r.VB - 0.7) / r.RE; r.IB = r.IC / beta; r.VCE = Vcc - r.IC * (RC + r.RE); }
      if (!(r.VCE > 0.5) || !(r.IC > 0)) return null;
      r.score = messy(type === 'div' ? [r.VB, r.IC, r.VCE] : [r.IB * 1000, r.IC, r.VCE]); return r;
    });
    var q = R.npn(150, 140), s = q.s, top = 20, gy = 225;
    s += R.line(70, top, 200, top) + T(135, top - 6, 'VCC = ' + b.Vcc + ' V') + R.el('R', [182, top], q.C, { l: 'RC ' + b.RC + 'kΩ', side: 'r' });
    if (b.type === 'div') s += R.el('R', [100, top], [100, 140], { l: 'R1 ' + b.R1 + 'kΩ', side: 'l' }) + R.el('R', [100, 140], [100, gy], { l: 'R2 ' + b.R2 + 'kΩ', side: 'l' }) + R.wire([100, 140], q.B) + R.dot(100, 140) + R.gnd(100, gy) + R.dot(100, top);
    else s += R.el('R', [100, top], [100, 140], { l: 'RB ' + b.RB + 'kΩ', side: 'l' }) + R.wire([100, 140], q.B) + R.dot(100, top);
    s += b.RE ? R.el('R', q.E, [182, gy], { l: 'RE ' + b.RE + 'kΩ', side: 'r' }) + R.gnd(182, gy) : R.wire(q.E, [182, gy - 20]) + R.gnd(182, gy - 20);
    s += T(205, 145, 'β = ' + b.beta, 'start', 12);
    var fig = R.svg(300, 248, s), mA = U('mA', 3), uA = U('μA', 2), V = U('V'), nm = { fix: '固定偏壓', emit: '射極回授偏壓', div: '分壓式偏壓' }[b.type];
    var ex = b.type === 'fix' ? 'IB = (VCC − 0.7)/RB = (' + b.Vcc + ' − 0.7)/' + b.RB + 'k = ' + uA(b.IB * 1000) + '\nIC = βIB = ' + mA(b.IC) + '；VCE = VCC − IC·RC = ' + V(b.VCE) + '。'
      : b.type === 'emit' ? 'B–E 迴路：VCC = IB·RB + 0.7 + (β+1)IB·RE → IB = (' + b.Vcc + ' − 0.7)/(' + b.RB + ' + ' + (b.beta + 1) + '×' + b.RE + ') k = ' + uA(b.IB * 1000) + '\nIC = βIB = ' + mA(b.IC) + '；VCE = VCC − IC·RC − IE·RE = ' + V(b.VCE) + '。'
        : '近似法：VB = VCC × R2/(R1+R2) = ' + V(b.VB) + '；IE = (VB − 0.7)/RE = ' + mA(b.IC) + ' ≈ IC\nVCE = VCC − IC(RC + RE) = ' + V(b.VCE) + '。';
    var asks = b.type === 'div' ? ['VB', 'IC', 'VCE'] : ['IB', 'IC', 'VCE'], ask = pick(asks), qs = '如圖' + nm + '電路（矽電晶體 VBE = 0.7 V' + (b.type === 'div' ? '，用近似法' : '') + '），';
    if (ask === 'IB') return [qs + '基極電流 IB 為何？', O(uA(b.IB * 1000), [uA(b.Vcc / (b.RB || 1) * 1000), uA(b.IC * 1000), uA(b.IB * 1000 * 2), uA(b.IB * 100)], more(uA, b.IB * 1000)), ex, fig];
    if (ask === 'VB') return [qs + '基極對地電壓 VB 為何？', O(V(b.VB), [V(b.Vcc * b.R1 / (b.R1 + b.R2)), V(b.VB - 0.7), V(b.Vcc / 2), V(b.VB + 0.7)], more(V, b.VB)), ex, fig];
    if (ask === 'IC') return [qs + '集極電流 IC 為何？', O(mA(b.IC), [mA(b.IC / 2), mA(b.IC * 2), mA(b.Vcc / b.RC), mA(b.IB || b.IC / b.beta)], more(mA, b.IC)), ex, fig];
    return [qs + '集射極電壓 VCE 為何？', O(V(b.VCE), [V(b.Vcc - b.VCE), V(b.Vcc), V(b.VCE + 0.7), V(b.Vcc - b.IC * b.RC)], more(V, b.VCE)), ex, fig];
  }

  /* ================= 數位邏輯 ================= */
  var GT = ['AND', 'OR', 'NAND', 'NOR', 'XOR'];
  function gv(t, a, c) { var r = /AND/.test(t) ? a & c : /XOR/.test(t) ? a ^ c : a | c; return /^N/.test(t) ? 1 - r : r; }

  // 三輸入組合電路：閘的種類與接線都隨機
  function logicCkt() {
    for (var t = 0; t < 80; t++) {
      var prs = [[0, 1], [1, 2], [0, 2]], p1 = pick(prs), p2 = pick(prs), g1 = pick(GT), g2 = pick(GT), g3 = pick(GT);
      var used = {}; p1.concat(p2).forEach(function (k) { used[k] = 1; }); if (Object.keys(used).length < 3 || p1 === p2) continue;
      var tbl = [], cnt = 0;
      for (var m = 0; m < 8; m++) { var v = [m >> 2 & 1, m >> 1 & 1, m & 1], y = gv(g3, gv(g1, v[p1[0]], v[p1[1]]), gv(g2, v[p2[0]], v[p2[1]])); tbl.push(y); cnt += y; }
      if (cnt === 0 || cnt === 8) continue;
      var bx = [20, 40, 60], nm = ['A', 'B', 'C'], s = '';
      bx.forEach(function (x, i) { s += R.line(x, 16, x, 170) + T(x, 10, nm[i]); });
      var G1 = R.gate(g1, 120, 20), G2 = R.gate(g2, 120, 110), G3 = R.gate(g3, 240, 65);
      s += G1.s + G2.s + G3.s;
      [[G1, p1], [G2, p2]].forEach(function (e) { e[0].ins.forEach(function (pt, k) { var x = bx[e[1][k]]; s += R.wire([x, pt[1]], pt) + R.dot(x, pt[1]); }); });
      s += R.wire(G1.out, [205, G1.out[1]], [205, G3.ins[0][1]], G3.ins[0]) + R.wire(G2.out, [215, G2.out[1]], [215, G3.ins[1][1]], G3.ins[1]) + T(G3.out[0] + 6, G3.out[1] + 5, 'Y', 'start');
      var fig = R.svg(330, 180, s), ask = pick(['val', 'val', 'cnt']), m0 = ri(0, 7), ab = [m0 >> 2 & 1, m0 >> 1 & 1, m0 & 1];
      var ex = '上閘 ' + g1 + '(' + nm[p1[0]] + ', ' + nm[p1[1]] + ')、下閘 ' + g2 + '(' + nm[p2[0]] + ', ' + nm[p2[1]] + ')，輸出閘 ' + g3 + '。\n真值表（ABC → Y）：' + tbl.map(function (y, i) { return (i >> 2 & 1) + '' + (i >> 1 & 1) + (i & 1) + '→' + y; }).join('、');
      if (ask === 'val') return ['如圖邏輯電路，當 A = ' + ab[0] + '、B = ' + ab[1] + '、C = ' + ab[2] + ' 時，輸出 Y 為何？', O('Y = ' + tbl[m0], ['Y = ' + (1 - tbl[m0]), '無法判斷', 'Y 為高阻抗']), ex + '\n代入：上閘輸出 ' + gv(g1, ab[p1[0]], ab[p1[1]]) + '、下閘輸出 ' + gv(g2, ab[p2[0]], ab[p2[1]]) + ' → Y = ' + tbl[m0] + '。', fig];
      return ['如圖邏輯電路，A、B、C 共 8 種輸入組合中，有幾種會使輸出 Y = 1？', O(cnt + ' 種', [8 - cnt + ' 種', (cnt + 1) % 9 + ' 種', (cnt + 7) % 9 + ' 種', (cnt + 2) % 9 + ' 種'].filter(function (x) { return x !== cnt + ' 種'; })), ex, fig];
    }
    return logicCkt();
  }

  // 時序圖：輸入波形與閘種類隨機，選輸出波形
  function timingQ() {
    var A, B, g, Ys, guard = 0;
    do { A = []; B = []; for (var i = 0; i < 8; i++) { A.push(ri(0, 1)); B.push(ri(0, 1)); } g = pick(GT.concat(['XNOR'])); Ys = {}; GT.concat(['XNOR']).forEach(function (t) { Ys[t] = A.map(function (a, i) { return t === 'XNOR' ? 1 - (a ^ B[i]) : gv(t, a, B[i]); }).join(' '); }); }
    while (guard++ < 50 && Object.keys(Ys).map(function (k) { return Ys[k]; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).length < 6);
    var fig = R.timing([{ n: 'A', v: A }, { n: 'B', v: B }], 30), ans = Ys[g];
    return ['如圖輸入波形 A、B 接到一個 ' + g + ' 閘，輸出 Y 依序（每格一個時段）為何？', O(ans, Object.keys(Ys).filter(function (k) { return k !== g; }).map(function (k) { return Ys[k]; })),
      g + ' 閘：' + { AND: '全 1 才 1', OR: '有 1 就 1', NAND: 'AND 再反相（全 1 才 0）', NOR: 'OR 再反相（全 0 才 1）', XOR: '相異為 1', XNOR: '相同為 1' }[g] + '。\nA = ' + A.join(' ') + '\nB = ' + B.join(' ') + '\nY = ' + ans, fig];
  }

  /* ================= 微處理機、程式設計 ================= */

  // 記憶體 IC：位址線、資料線數量隨機，求容量或位址範圍
  function memChip() {
    var nA = ri(10, 16), nD = pick([1, 4, 8, 8, 8, 16]), base = pick([0x0000, 0x2000, 0x4000, 0x8000, 0xC000]);
    while (base + Math.pow(2, nA) > 0x10000) base -= 0x2000; if (base < 0) base = 0;
    var s = '<rect x="110" y="20" width="120" height="170" rx="6" style="fill:var(--accent-soft)"/>' + T(170, 110, '記憶體 IC');
    var lp = ['A0', 'A1', 'A2', '⋮', 'A' + (nA - 1)], rp = nD === 1 ? ['D0'] : ['D0', 'D1', '⋮', 'D' + (nD - 1)];
    lp.forEach(function (p, i) { var y = 40 + i * 30; if (p !== '⋮') s += R.line(80, y, 110, y); s += T(p === '⋮' ? 95 : 76, y + 5, p, p === '⋮' ? 'middle' : 'end', 12); });
    rp.forEach(function (p, i) { var y = 40 + i * 30; if (p !== '⋮') s += R.line(230, y, 260, y); s += T(p === '⋮' ? 245 : 264, y + 5, p, p === '⋮' ? 'middle' : 'start', 12); });
    s += R.line(150, 190, 150, 210) + T(150, 224, 'CS', 'middle', 11) + R.line(190, 190, 190, 210) + T(190, 224, 'R/W', 'middle', 11);
    var fig = R.svg(330, 230, s), words = Math.pow(2, nA), hx = function (v) { return (v.toString(16).toUpperCase()); }, h4 = function (v) { return ('0000' + hx(v)).slice(-4) + 'H'; };
    var K = function (w) { return w >= 1024 ? (w / 1024) + 'K' : String(w); }, cap = function (w, d) { return K(w) + ' × ' + d + ' 位元'; };
    var ask = pick(['cap', 'cap', 'end']);
    if (ask === 'cap') return ['如圖記憶體 IC 有位址線 A0～A' + (nA - 1) + '、資料線 ' + (nD === 1 ? 'D0' : 'D0～D' + (nD - 1)) + '，其容量為何？', O(cap(words, nD), [cap(words / 2, nD), cap(words * 2, nD), cap(nA * 1024, nD), cap(words, nD * 2)]),
      nA + ' 條位址線 → 2^' + nA + ' = ' + K(words) + ' 個位址；每個位址存 ' + nD + ' 位元 → ' + cap(words, nD) + (nD === 8 ? '（= ' + K(words) + 'B）' : '') + '。', fig];
    return ['如圖記憶體 IC 有位址線 A0～A' + (nA - 1) + '，若起始位址為 ' + h4(base) + '，最後一個位址為何？', O(h4(base + words - 1), [h4(base + words), h4(base + words / 2 - 1), h4(base + words * 2 - 1), h4(base + nA * 1024 - 1)]),
      '容量 2^' + nA + ' = ' + words + ' 個位址 = ' + hx(words) + 'H。\n最後位址 = 起始 + 容量 − 1 = ' + h4(base) + ' + ' + hx(words) + 'H − 1 = ' + h4(base + words - 1) + '。', fig];
  }

  // 流程圖追蹤：初值、終值、步長、累加方式、比較符號都隨機
  function flowQ() {
    var a = ri(0, 3), bnd = ri(5, 12), st = pick([1, 2, 3]), op = pick(['s = s + i', 's = s + i', 's = s × i', 's = s + 2', 's = s + i × i']), cmp = pick(['≤', '<']), s0 = op === 's = s × i' ? 1 : 0;
    if (op === 's = s × i') { a = Math.max(a, 1); bnd = Math.min(bnd, 7); }
    var i = a, sv = s0, cnt = 0;
    while (cmp === '≤' ? i <= bnd : i < bnd) { sv = op === 's = s + i' ? sv + i : op === 's = s × i' ? sv * i : op === 's = s + 2' ? sv + 2 : sv + i * i; i += st; cnt++; }
    var box = function (cx, cy, w, h, txt, shape) {
      var sh = shape === 'oval' ? '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '" rx="' + h / 2 + '"/>' : shape === 'dia' ? '<polygon points="' + cx + ',' + (cy - h / 2) + ' ' + (cx + w / 2) + ',' + cy + ' ' + cx + ',' + (cy + h / 2) + ' ' + (cx - w / 2) + ',' + cy + '"/>' : shape === 'io' ? '<polygon points="' + (cx - w / 2 + 10) + ',' + (cy - h / 2) + ' ' + (cx + w / 2 + 10) + ',' + (cy - h / 2) + ' ' + (cx + w / 2 - 10) + ',' + (cy + h / 2) + ' ' + (cx - w / 2 - 10) + ',' + (cy + h / 2) + '"/>' : '<rect x="' + (cx - w / 2) + '" y="' + (cy - h / 2) + '" width="' + w + '" height="' + h + '"/>';
      return sh + T(cx, cy + 5, txt, 'middle', 12);
    };
    var cx = 120, s = box(cx, 18, 70, 24, '開始', 'oval') + R.arrow(cx, 30, cx, 48) + box(cx, 62, 120, 28, 'i = ' + a + '，s = ' + s0) + R.arrow(cx, 76, cx, 96);
    s += box(cx, 120, 120, 48, 'i ' + cmp + ' ' + bnd + ' ?', 'dia') + R.arrow(cx, 144, cx, 162) + T(cx + 6, 157, '是', 'start', 11) + box(cx, 176, 120, 28, op) + R.arrow(cx, 190, cx, 208) + box(cx, 222, 120, 28, 'i = i + ' + st);
    s += R.wire([cx, 236], [cx, 250], [30, 250], [30, 120]) + R.arrow(30, 120, cx - 60, 120) + R.wire([cx + 60, 120], [270, 120]) + T(cx + 66, 112, '否', 'start', 11) + R.arrow(270, 120, 270, 160) + box(270, 176, 100, 28, '輸出 s', 'io') + R.arrow(270, 190, 270, 208) + box(270, 222, 70, 24, '結束', 'oval');
    var fig = R.svg(330, 258, s), ask = pick(['s', 's', 'cnt']), trace = [];
    i = a; sv = s0; var k = 0; while ((cmp === '≤' ? i <= bnd : i < bnd) && k < 12) { sv = op === 's = s + i' ? sv + i : op === 's = s × i' ? sv * i : op === 's = s + 2' ? sv + 2 : sv + i * i; trace.push('i=' + i + ' → s=' + sv); i += st; k++; }
    var ex = '逐次追蹤：' + trace.join('；') + '\n之後 i = ' + i + '，條件 i ' + cmp + ' ' + bnd + ' 不成立 → 離開迴圈，共執行 ' + cnt + ' 次，輸出 s = ' + sv + '。';
    if (ask === 's') return ['依如圖流程圖執行，輸出的 s 為何？', O(String(sv), [String(op === 's = s × i' ? sv * i : sv + i), String(op === 's = s × i' ? sv / (i - st || 1) : sv - (i - st)), String(sv + 1), String(sv * 2)], function (q) { return String(sv + q * st); }), ex, fig];
    return ['依如圖流程圖執行，迴圈內的動作共執行幾次？', O(cnt + ' 次', [(cnt + 1) + ' 次', Math.max(0, cnt - 1) + ' 次', bnd + ' 次', (bnd - a) + ' 次']), ex, fig];
  }

  /* ================= 掛到各單元 ================= */
  var it = function (t, f) { return { t: t, g: function () { return f(); } }; };
  [addEasy, addHard, addTc].forEach(function (add) {
    add('bee', 1, [it('色碼電阻（看圖）', colorCode), it('導線形狀改變的電阻（看圖）', wireR)]);
    add('bee', 2, [it('串並聯網路（結構變化）', network)]);
    add('bee', 3, [it('雙電源節點電壓（極性變化）', twoSrc), it('惠斯登電橋（位置變化）', bridge)]);
    add('beel', 2, [it('色碼電阻判讀（看圖）', colorCode), it('串並聯網路量測（結構變化）', network)]);
    add('elec', 0, [it('示波器讀值（波形變化）', scopeQ)]);
    add('elec', 1, [it('二極體串聯電路（方向變化）', diodeSeries), it('截波電路（方向與偏壓變化）', clipper), it('稽納穩壓（負載變化）', zener)]);
    add('elec', 2, [it('BJT 直流偏壓（偏壓方式變化）', bjt)]);
    add('elecl', 1, [it('截波電路實習（方向與偏壓變化）', clipper), it('稽納穩壓實習（負載變化）', zener)]);
    add('elecl', 2, [it('BJT 偏壓量測（偏壓方式變化）', bjt)]);
    add('dl', 1, [it('時序圖判讀（輸入變化）', timingQ)]);
    add('dl', 2, [it('組合邏輯電路（接線變化）', logicCkt)]);
    add('mpu', 1, [it('記憶體 IC 容量與位址（看圖）', memChip)]);
    add('prog', 1, [it('流程圖追蹤（看圖）', flowQ)]);
  });
})();
