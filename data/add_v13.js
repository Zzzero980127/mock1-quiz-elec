/* v1.3 新增：依 110、111 學年度一模（電機與電子群資電類）題型自編的類似題，只取 115 一模範圍內的單元。
   題目、數字、圖都是自己出的，沒有照抄原題。只能往後加，不要插隊或刪題（id 依順序）。 */
(function () {
  var H = QH, si = H.si, d = H.dec, D = DR, el = D.el, w = D.wire, T = D.text, E = DR.elec, K = DR.dlh;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function uniq(a) { var s = {}, o = []; a.forEach(function (x) { x = String(x); if (!s[x]) { s[x] = 1; o.push(x); } }); return o; }
  function om(x) { return x + ' Ω'; }
  function sup(m) { return String(m).split('').map(function (c) { return { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' }[c]; }).join(''); }
  function dash(x1, y1, x2, y2) { return D.line(x1, y1, x2, y2, ' stroke-dasharray="4 3" stroke-width="1"'); }
  function dim(x1, x2, y, s) { return D.arrow((x1 + x2) / 2, y, x1, y) + D.arrow((x1 + x2) / 2, y, x2, y) + T((x1 + x2) / 2, y - 5, s); }

  // ---------- 色碼 ----------
  var COL = ['黑', '棕', '紅', '橙', '黃', '綠', '藍', '紫', '灰', '白'];
  function multCol(e) { return e === -1 ? '金' : e === -2 ? '銀' : COL[e]; }
  function colorCode(R) { var e = Math.floor(Math.log10(R) + 1e-9) - 1, ab = Math.round(R / Math.pow(10, e)); return [Math.floor(ab / 10), ab % 10, e]; }
  function codeStr(c, tol) { return COL[c[0]] + COL[c[1]] + multCol(c[2]) + (tol || '金'); }
  function codeOpts(R, tol) {
    var c = colorCode(R);
    return uniq([codeStr(c, tol), codeStr([c[0], c[1], c[2] + 1], tol), codeStr([c[0], c[1], c[2] > -2 ? c[2] - 1 : c[2] + 2], tol), codeStr([c[1], c[0], c[2]], tol), codeStr([c[0], c[1], c[2] + 2], tol)]).slice(0, 4);
  }

  // ---------- 圖 ----------
  // 串聯迴路 a(左上)–b(右上)–c(右下)–d(左下)，電池在左邊（+ 在 a）
  function figRef(Ev, r1, r2, r3) {
    var s = el('V', [40, 165], [40, 25], { plus: 'b', l: Ev, side: 'l' }) + el('R', [40, 25], [240, 25], { l: r1 }) + el('R', [240, 25], [240, 165], { l: r2 }) + el('R', [240, 165], [40, 165], { l: r3, side: 'b' });
    [[40, 25, 'a', -10, -4], [240, 25, 'b', 10, -4], [240, 165, 'c', 10, 16], [40, 165, 'd', -10, 16]].forEach(function (p) { s += D.dot(p[0], p[1]) + T(p[0] + p[3], p[1] + p[4], p[2], p[3] < 0 ? 'end' : 'start', 15); });
    return D.svg(280, 195, s);
  }
  // 電流源（左，箭頭向上）、上方電阻、右邊電池
  function figCS(Is, Rl, Ev, plusTop) {
    return D.svg(280, 175, el('I', [40, 150], [40, 30], { l: Is, side: 'l' }) + el('R', [40, 30], [240, 30], { l: Rl }) +
      el('V', [240, 30], [240, 150], { plus: plusTop ? 'a' : 'b', l: Ev, side: 'r' }) + w([240, 150], [40, 150]));
  }
  // 三個網目的梯形電路
  function figMesh(Ev, lab) {
    var s = el('V', [30, 160], [30, 30], { plus: 'b', l: Ev, side: 'l' }) +
      el('R', [30, 30], [130, 30], { l: lab[0] }) + el('R', [130, 30], [130, 160], { l: lab[1], side: 'r' }) +
      el('R', [130, 30], [230, 30], { l: lab[2] }) + el('R', [230, 30], [230, 160], { l: lab[3], side: 'r' }) +
      el('R', [230, 30], [330, 30], { l: lab[4] }) + el('R', [330, 30], [330, 160], { l: lab[5], side: 'r' }) + w([330, 160], [30, 160]) +
      D.dot(130, 30) + D.dot(230, 30) + D.dot(130, 160) + D.dot(230, 160);
    [80, 180, 280].forEach(function (x, i) { s += T(x, 148, 'I' + '₁₂₃'[i] + ' ↻', 'middle', 13); });
    return D.svg(400, 180, s);
  }
  // 有高低準位的脈波
  function figPulse2(VH, VL, r, Tl, tl) {
    var x0 = 50, top = 40, bot = 150, vmax = Math.max(VH, 0), vmin = Math.min(VL, 0), P = 100;
    function y(v) { return top + (vmax - v) / (vmax - vmin) * (bot - top); }
    var y0 = y(0), yh = y(VH), yl = y(VL), pts = [[x0, yl]];
    for (var k = 0; k < 3; k++) { var xs = x0 + 10 + k * P; pts.push([xs, yl], [xs, yh], [xs + r * P, yh], [xs + r * P, yl]); }
    pts.push([x0 + 10 + 3 * P, yl]);
    var s = D.arrow(x0, y0, x0 + 320, y0) + D.arrow(x0, bot + 8, x0, top - 22) + T(x0 + 323, y0 + 4, 't', 'start') + T(x0 - 4, top - 18, 'v', 'end');
    s += '<g stroke-width="2.2">' + w.apply(null, pts) + '</g>' + T(x0 - 6, yh + 4, VH + ' V', 'end') + T(x0 - 6, yl + 4, H.n(VL) + ' V', 'end') + dash(x0, yl, x0 + 10, yl);
    if (VL < 0) s += T(x0 - 6, y0 + 4, '0', 'end');
    s += dim(x0 + 10, x0 + 10 + r * P, top - 10, tl) + dim(x0 + 10, x0 + 10 + P, bot + 24, Tl) + dash(x0 + 10, yl, x0 + 10, bot + 28) + dash(x0 + 10 + P, yl, x0 + 10 + P, bot + 28);
    return D.svg(390, 190, s);
  }
  // 燈泡電路
  function figLamp(Ev, Rs) {
    return D.svg(300, 170, el('V', [40, 150], [40, 30], { plus: 'b', l: Ev, side: 'l' }) + el('R', [40, 30], [220, 30], { l: Rs }) + w([220, 30], [220, 70]) +
      '<circle cx="220" cy="90" r="20"/>' + D.line(206, 76, 234, 104) + D.line(234, 76, 206, 104) + w([220, 110], [220, 150], [40, 150]) + T(248, 95, '燈泡', 'start', 13));
  }
  // 電晶體三腳電壓（NPN／PNP）
  function figPins(VB, VE, VC, pnp) {
    var q = D.npn(110, 85, pnp);
    return D.svg(250, 175, q.s + w(q.B, [60, 85]) + D.term(57, 85) + T(50, 90, 'B：' + VB, 'end') + w(q.C, [142, 18]) + D.term(142, 15) + T(152, 19, 'C：' + VC, 'start') +
      w(q.E, [142, 150]) + D.term(142, 153) + T(152, 157, 'E：' + VE, 'start') + T(200, 90, pnp ? 'PNP' : 'NPN', 'start', 12));
  }
  // 橋式整流加濾波電容
  function figBridgeC(lbl) {
    return E.figRect('bridge', lbl).replace('</svg>', el('C', [300, 14], [300, 160], { l: 'C', side: 'r' }) + D.dot(300, 14) + D.dot(300, 160) + '</svg>');
  }
  // 卡諾圖（含隨意項 X）
  function figKmapD(ms, dc) {
    var gray = ['00', '01', '11', '10'], c = 40, x0 = 70, y0 = 40, s = T(x0 - 18, y0 - 18, 'CD＼AB', 'end', 12);
    gray.forEach(function (g, j) { s += T(x0 + j * c + c / 2, y0 - 8, g, 'middle', 12); });
    gray.forEach(function (r, i) {
      s += T(x0 - 8, y0 + i * c + c / 2 + 5, r, 'end', 12);
      gray.forEach(function (g, j) {
        var m = parseInt(g + r, 2), v = ms.indexOf(m) >= 0 ? '1' : dc.indexOf(m) >= 0 ? 'X' : '0';
        s += '<rect x="' + (x0 + j * c) + '" y="' + (y0 + i * c) + '" width="' + c + '" height="' + c + '"/>' + T(x0 + j * c + c / 2, y0 + i * c + c / 2 + 6, v, 'middle', 15);
      });
    });
    return D.svg(x0 + 4 * c + 20, y0 + 4 * c + 10, s);
  }

  // ---------- 布林化簡（含隨意項） ----------
  var V4 = ['A', 'B', 'C', 'D'];
  function cov(t, m) { return (m & ~t.mask) === t.v; }
  function litc(n, t) { var c = 0; for (var i = 0; i < n; i++) if (!(t.mask & (1 << i))) c++; return c; }
  function minSOPd(n, ms, dc) {
    if (!ms.length) return [];
    var P = K.primes(n, ms.concat(dc)).filter(function (t) { return ms.some(function (m) { return cov(t, m); }); }), best = null, bestL = 1e9;
    for (var k = 1; k <= P.length && !best; k++) {
      (function choose(start, sel) {
        if (sel.length === k) {
          if (ms.every(function (m) { return sel.some(function (t) { return cov(t, m); }); })) {
            var L = sel.reduce(function (s, t) { return s + litc(n, t); }, 0);
            if (L < bestL) { bestL = L; best = sel.slice(); }
          }
          return;
        }
        for (var i = start; i < P.length; i++) { sel.push(P[i]); choose(i + 1, sel); sel.pop(); }
      })(0, []);
    }
    return best;
  }
  function totalLits(n, ts) { return ts.reduce(function (s, t) { return s + litc(n, t); }, 0); }
  function validD(n, terms, ms, dc) {
    for (var m = 0; m < (1 << n); m++) {
      var c = terms.some(function (t) { return cov(t, m); });
      if (ms.indexOf(m) >= 0 && !c) return false;
      if (c && ms.indexOf(m) < 0 && dc.indexOf(m) < 0) return false;
    }
    return true;
  }
  // 錯誤選項：少一項、改一個變數的補數、少一個變數（都必須真的不成立）
  function wrongD(n, terms, ms, dc) {
    var out = [], seen = {}; seen[K.sopStr(n, terms)] = 1;
    function add(ts) { var s = K.sopStr(n, ts); if (!seen[s] && !validD(n, ts, ms, dc)) { seen[s] = 1; out.push(ts); } }
    terms.forEach(function (t, i) {
      if (terms.length > 1) add(terms.filter(function (_, j) { return j !== i; }));
      for (var b = 0; b < n; b++) if (!(t.mask & (1 << b))) { var t2 = { v: t.v ^ (1 << b), mask: t.mask }; add(terms.map(function (x, j) { return j === i ? t2 : x; })); }
      for (b = 0; b < n; b++) if (!(t.mask & (1 << b))) { var t3 = { v: t.v & ~(1 << b), mask: t.mask | (1 << b) }; add(terms.map(function (x, j) { return j === i ? t3 : x; })); }
    });
    return shuffle(out);
  }
  function posStr(n, terms) {
    return terms.map(function (t) {
      var l = []; for (var i = n - 1; i >= 0; i--) if (!(t.mask & (1 << i))) l.push(V4[n - 1 - i] + ((t.v >> i) & 1 ? "'" : ''));
      return l.length > 1 ? '(' + l.join(' + ') + ')' : l.length ? l[0] : '0';
    }).join('');
  }
  function num(a, b) { return a - b; }
  function Sm(l) { return 'Σm(' + l.join(', ') + ')'; }

  // ======================= 基本電學 =======================
  addHard('bee', 0, [
    { t: '馬力與效率', g: function (R) {
      var hp = R.pick([2, 3, 5, 7.5, 10]), V = R.pick([100, 110, 220]), Pout = hp * 746, I = Math.ceil(Pout / (V * 0.95)) + R.int(0, 4);
      var eta = Pout / (V * I) * 100;
      return ['一部電動機輸出 ' + hp + ' 馬力，工作電壓 ' + V + ' V、電流 ' + I + ' A，此電動機的效率約為？（1 hp = 746 W）',
        [d(eta, 2) + '%', d(hp * 736 / (V * I) * 100, 2) + '%', d(100 - eta, 2) + '%', d(hp * 1000 / (V * I) * 100, 2) + '%'],
        'Pout = ' + hp + ' × 746 = ' + d(Pout, 1) + ' W；Pin = V × I = ' + V + ' × ' + I + ' = ' + V * I + ' W；η = Pout ÷ Pin = ' + d(eta, 2) + '%。'];
    } },
    { t: '太陽能板發電度數', g: function (R) {
      var I = R.pick([500, 800, 1000, 1200]), V = R.pick([2, 5, 6]), np = R.pick([5, 10]), ns = R.pick([4, 8, 20]), h = R.pick([4, 5, 6, 8]);
      var P = I / 1000 * V * np * ns, Ek = P * h / 1000;
      return ['單一太陽能板模組在日照下平均輸出 ' + I + ' mA、' + V + ' V。把 ' + np + ' 個模組並聯成一組，再將 ' + ns + ' 組串聯，若每日平均日照 ' + h + ' 小時，每日可發電幾度？',
        [d(Ek, 3) + ' 度', d(Ek / np, 3) + ' 度', d(Ek / ns, 3) + ' 度', d(Ek * 1000, 1) + ' 度'],
        '並聯使電流變 ' + np + ' 倍、串聯使電壓變 ' + ns + ' 倍：P = ' + I / 1000 + ' A × ' + np + ' × ' + V + ' V × ' + ns + ' = ' + d(P, 2) + ' W；W = ' + d(P, 2) + ' W × ' + h + ' h = ' + d(P * h, 1) + ' Wh = ' + d(Ek, 3) + ' 度（kWh）。'];
    } }
  ]);
  addHard('bee', 1, [
    { t: '拉長後電導', g: function (R) {
      var G = R.pick([2, 3, 4, 5, 8, 10]), k = R.pick([2, 3]), byD = Math.random() < 0.5, f = byD ? Math.pow(k, 4) : k * k;
      return ['某導線的電導為 ' + G + ' S，若在體積不變下把它均勻拉長，使' + (byD ? '線徑變為原來的 1/' + k : '長度變為原來的 ' + k + ' 倍') + '，拉長後的電導為？',
        [H.frac(G, f) + ' S', H.frac(G, byD ? k * k : k) + ' S', H.n(G * f) + ' S', H.frac(G, byD ? k : Math.pow(k, 4)) + ' S'],
        (byD ? '線徑變 1/' + k + ' → 截面積變 1/' + k * k + '，體積不變所以長度變 ' + k * k + ' 倍' : '長度變 ' + k + ' 倍 → 截面積變 1/' + k) + '；R = ρL/A 變為 ' + f + ' 倍，G = 1/R 變為 1/' + f + '：' + G + ' ÷ ' + f + ' = ' + H.frac(G, f) + ' S。'];
    } },
    { t: '色碼串聯最大電流', g: function (R) {
      var L = [150, 330, 470, 680, 750, 1000, 1200, 1500, 2200], r1 = R.pick(L), r2 = R.pick(L.filter(function (x) { return x !== r1; }));
      var t1 = R.pick([5, 10]), t2 = R.pick([5, 10]), V = R.pick([9, 12, 15, 21, 24]);
      var mn = r1 * (1 - t1 / 100) + r2 * (1 - t2 / 100), mx = r1 * (1 + t1 / 100) + r2 * (1 + t2 / 100);
      var c1 = codeStr(colorCode(r1), t1 === 5 ? '金' : '銀'), c2 = codeStr(colorCode(r2), t2 === 5 ? '金' : '銀');
      return ['色碼為「' + c1 + '」與「' + c2 + '」的兩個電阻串聯後接 ' + V + ' V 直流電源，考慮誤差時，電源可能提供的最大電流約為？',
        [si(V / mn, 'A'), si(V / (r1 + r2), 'A'), si(V / mx, 'A'), si(V / (r1 * r2 / (r1 + r2)), 'A')],
        c1 + ' = ' + r1 + ' Ω ±' + t1 + '%（最小 ' + d(r1 * (1 - t1 / 100), 1) + ' Ω）；' + c2 + ' = ' + r2 + ' Ω ±' + t2 + '%（最小 ' + d(r2 * (1 - t2 / 100), 1) + ' Ω）。電阻最小時電流最大：I = ' + V + ' ÷ ' + d(mn, 1) + ' ≈ ' + si(V / mn, 'A') + '。'];
    } },
    { t: '由功率反推色碼', g: function (R) {
      var Rv = R.pick([0.5, 1.2, 4.7, 10, 22, 47, 100, 220, 470, 1000]), V = R.pick([6, 12, 24]), P = V * V / Rv;
      return ['某電阻（誤差 ±5%）接在 ' + V + ' V 直流電源上，消耗功率 ' + d(P, 3) + ' W，其色碼可能為？', codeOpts(Rv),
        'R = V² ÷ P = ' + V * V + ' ÷ ' + d(P, 3) + ' = ' + Rv + ' Ω → 色碼 ' + codeStr(colorCode(Rv)) + '（第三環是乘數：金 ×0.1、銀 ×0.01）。'];
    } }
  ]);
  addHard('bee', 2, [
    { t: '並聯額定功率', g: function (R) {
      var L = [[8, 8, 8], [8, 2, 4], [1, 16, 4], [2, 18, 6], [4, 9, 6], [1, 9, 3], [9, 1, 3], [6, 6, 6], [3, 12, 6], [10, 10, 10], [5, 20, 10], [4, 1, 2], [1, 4, 2], [12, 3, 6], [3, 3, 3], [2, 2, 2]], p, k = 0;
      do { p = shuffle(L).slice(0, 3); } while (uniq(p.map(function (x) { return x[2]; })).length < 3 && ++k < 50);
      var vs = p.map(function (x) { return x[2]; }).sort(num), G = p.reduce(function (s, x) { return s + 1 / x[0]; }, 0);
      var P = vs[0] * vs[0] * G, sumP = p.reduce(function (s, x) { return s + x[1]; }, 0);
      return ['將 ' + p.map(function (x) { return x[0] + ' Ω／' + x[1] + ' W'; }).join('、') + ' 三個電阻並聯，在不超過任何一個額定值的情況下，並聯電路最多能消耗多少功率？',
        uniq([d(P, 3) + ' W', d(sumP, 3) + ' W', d(vs[2] * vs[2] * G, 3) + ' W', d(vs[1] * vs[1] * G, 3) + ' W', d(P * 2, 3) + ' W', d(P * 3, 3) + ' W']).slice(0, 4),
        '各電阻的最大電壓 V = √(PR)：' + p.map(function (x) { return '√(' + x[1] + ' × ' + x[0] + ') = ' + x[2] + ' V'; }).join('、') + '。並聯電壓相同，只能取最小的 ' + vs[0] + ' V：P = V² × Σ(1/R) = ' + vs[0] * vs[0] + ' × ' + d(G, 4) + ' ≈ ' + d(P, 3) + ' W。'];
    } },
    { t: '串聯額定功率限制', g: function (R) {
      var r1, r2, p1, p2, i1, i2, k = 0;
      do {
        r1 = R.pick([1, 2, 4, 5, 10, 15, 20]); r2 = R.pick([1, 2, 4, 5, 10, 15, 20]); p1 = R.pick([60, 100, 125, 250, 500]); p2 = R.pick([60, 100, 125, 250, 500]);
        i1 = Math.sqrt(p1 / 1000 / (r1 * 1000)); i2 = Math.sqrt(p2 / 1000 / (r2 * 1000));
      } while ((Math.abs(i1 - i2) / i1 < 0.05 || r1 === r2) && ++k < 50);
      var I = Math.min(i1, i2), Vm = I * (r1 + r2) * 1000, Vbad = Math.max(i1, i2) * (r1 + r2) * 1000, Vsum = (i1 * r1 + i2 * r2) * 1000, Vone = (i1 < i2 ? i1 * r1 : i2 * r2) * 1000;
      return ['A 電阻規格 ' + r1 + ' kΩ／' + p1 + ' mW，B 電阻規格 ' + r2 + ' kΩ／' + p2 + ' mW。兩者串聯後，兩端最多可加多少電壓而不超過任何一個的額定功率？',
        [d(Vm, 2) + ' V', d(Vbad, 2) + ' V', d(Vsum, 2) + ' V', d(Vone, 2) + ' V'],
        'IA(max) = √(P/R) = √(' + p1 / 1000 + ' ÷ ' + r1 * 1000 + ') ≈ ' + d(i1 * 1000, 3) + ' mA；IB(max) ≈ ' + d(i2 * 1000, 3) + ' mA。串聯電流相同，只能取較小的 ' + d(I * 1000, 3) + ' mA：V = I × (' + r1 + ' + ' + r2 + ') kΩ ≈ ' + d(Vm, 2) + ' V。'];
    } },
    { t: '參考點與電位', g: function (R) {
      var r = shuffle([1, 2, 3, 4, 5, 6]).slice(0, 3), S = r[0] + r[1] + r[2], I = R.pick([1, 2, 3]), Ev = S * I;
      var V = { a: Ev, b: Ev - I * r[0], c: I * r[2], d: 0 }, nodes = ['a', 'b', 'c', 'd'];
      var g = R.pick(['b', 'c', 'd']), p = R.pick(nodes.filter(function (x) { return x !== g; })), q = nodes.filter(function (x) { return x !== g && x !== p; })[0];
      var ans = V[p] - V[g];
      return ['如圖所示，若以 ' + g + ' 點為參考點（接地），則 ' + p + ' 點的電位 V' + p + ' 為多少？',
        uniq([H.n(ans) + ' V', H.n(-ans) + ' V', H.n(V[p]) + ' V', H.n(V[p] - V[q]) + ' V'].concat(nodes.filter(function (x) { return x !== p; }).map(function (x) { return H.n(V[x] - V[g]) + ' V'; })).concat([H.n(Ev - ans) + ' V', H.n(ans + Ev) + ' V'])).slice(0, 4),
        'I = ' + Ev + ' ÷ (' + r.join(' + ') + ') = ' + I + ' A（順時針）。以 d 為基準：Va = ' + V.a + '、Vb = ' + V.b + '、Vc = ' + V.c + '、Vd = 0 V。改以 ' + g + ' 為參考點，每點都減掉 ' + V[g] + ' V：V' + p + ' = ' + V[p] + ' − ' + V[g] + ' = ' + H.n(ans) + ' V。（換參考點只會改變電位，兩點間的電位差不變）',
        figRef(Ev + ' V', om(r[0]), om(r[1]), om(r[2]))];
    } }
  ]);
  addHard('bee', 3, [
    { t: '電流源功率', g: function (R) {
      var Is, Rv, Ev, top, Vx, k = 0;
      do { Is = R.pick([0.5, 1, 2, 3]); Rv = R.pick([2, 4, 5, 6, 10]); Ev = R.pick([6, 10, 12, 20, 24]); top = Math.random() < 0.5; Vx = Is * Rv + (top ? Ev : -Ev); }
      while ((Vx === 0 || Math.abs(Vx) === Ev || Math.abs(Vx) === Is * Rv) && ++k < 50);
      var P = Math.abs(Is * Vx), sup2 = Vx > 0;
      return ['如圖所示，電流源的功率為何？',
        [(sup2 ? '供給 ' : '吸收 ') + d(P, 2) + ' W', (sup2 ? '吸收 ' : '供給 ') + d(P, 2) + ' W', '供給 ' + d(Is * Is * Rv, 2) + ' W', '吸收 ' + d(Ev * Is, 2) + ' W'],
        '迴路電流 = ' + Is + ' A（順時針）。電流源兩端電壓（上端為正）= I·R ' + (top ? '+' : '−') + ' E = ' + d(Is * Rv, 2) + (top ? ' + ' : ' − ') + Ev + ' = ' + H.n(Vx) + ' V。' + (sup2 ? '電流從正端流出 → 供給' : '電壓為負，表示電流從正端流入 → 吸收') + ' P = ' + Is + ' × ' + Math.abs(Vx) + ' = ' + d(P, 2) + ' W。',
        figCS('Is = ' + Is + ' A', 'R = ' + Rv + ' Ω', 'E = ' + Ev + ' V', top)];
    } },
    { t: '兩次量測求 E 與 RS', g: function (R) {
      var Ev, Rs, R1, R2, V1, V2, k = 0;
      function ok(x) { return Math.abs(x * 100 - Math.round(x * 100)) < 1e-9; }
      do { Ev = R.pick([12, 14, 15, 18, 20, 24, 30]); Rs = R.pick([5, 10, 15, 20, 25]); R1 = R.pick([20, 30, 40, 50, 60, 80, 100]); R2 = R.pick([10, 20, 30, 36, 40, 45, 60]); V1 = Ev * R1 / (R1 + Rs); V2 = Ev * R2 / (R2 + Rs); }
      while ((R1 === R2 || !ok(V1) || !ok(V2)) && ++k < 300);
      if (!ok(V1) || !ok(V2) || R1 === R2) { Ev = 14; Rs = 20; R1 = 50; R2 = 36; V1 = 10; V2 = 9; }
      return ['一個內阻 RS 的電壓源接可變電阻 RL：RL = ' + R1 + ' Ω 時電壓表量得 RL 兩端 ' + d(V1, 2) + ' V；RL = ' + R2 + ' Ω 時量得 ' + d(V2, 2) + ' V。則 E 與 RS 為？',
        ['E = ' + Ev + ' V，RS = ' + Rs + ' Ω', 'E = ' + d(Math.max(V1, V2), 2) + ' V，RS = ' + Rs + ' Ω', 'E = ' + Ev + ' V，RS = ' + d(Rs / 2, 1) + ' Ω', 'E = ' + Ev + ' V，RS = ' + Rs * 2 + ' Ω'],
        'V = E·RL ÷ (RS + RL)：' + d(V1, 2) + '(RS + ' + R1 + ') = ' + R1 + 'E、' + d(V2, 2) + '(RS + ' + R2 + ') = ' + R2 + 'E，兩式聯立得 E = ' + Ev + ' V、RS = ' + Rs + ' Ω。'];
    } },
    { t: '戴維寧量測接負載', g: function (R) {
      var Rab = R.pick([100, 150, 200, 250, 300, 350, 400, 450]), V = R.pick([5, 6, 8, 10, 12]), RL = R.pick([60, 120, 180, 220, 270]);
      return ['某線性直流網路 a、b 兩端開路時量得電壓 ' + V + ' V，把網路內的電源移除後量得 a、b 間電阻 ' + Rab + ' Ω。若在 a、b 接上 ' + RL + ' Ω 電阻，流過的電流為？',
        uniq([si(V / (Rab + RL), 'A'), si(V / RL, 'A'), si(V / Rab, 'A'), si(V * (Rab + RL) / (Rab * RL), 'A'), si(V / (Rab + RL) * 2, 'A')]).slice(0, 4),
        '量到的就是戴維寧等效：Eth = ' + V + ' V、Rth = ' + Rab + ' Ω。I = Eth ÷ (Rth + RL) = ' + V + ' ÷ ' + (Rab + RL) + ' ≈ ' + si(V / (Rab + RL), 'A') + '。'];
    } },
    { t: '相同電源並聯的諾頓等效', g: function (R) {
      var N = R.pick([2, 3, 4]), Ev = R.pick([6, 9, 12, 24]), r = R.pick([2, 3, 6, 12]);
      return [N + ' 個相同的電壓源（E = ' + Ev + ' V、內阻 r = ' + r + ' Ω）並聯後，化簡成諾頓等效電路，IN 與 RN 分別為？',
        ['IN = ' + d(N * Ev / r, 3) + ' A，RN = ' + d(r / N, 3) + ' Ω', 'IN = ' + d(Ev / r, 3) + ' A，RN = ' + d(r / N, 3) + ' Ω', 'IN = ' + d(N * Ev / r, 3) + ' A，RN = ' + N * r + ' Ω', 'IN = ' + d(Ev / (N * r), 3) + ' A，RN = ' + N * r + ' Ω'],
        '並聯的相同電壓源端電壓仍是 E = ' + Ev + ' V；內阻並聯 RN = r/N = ' + d(r / N, 3) + ' Ω；IN = E ÷ RN = N·E/r = ' + d(N * Ev / r, 3) + ' A（也就是每個電源的短路電流 E/r 相加）。'];
    } },
    { t: '迴路分析係數', g: function (R) {
      var r = shuffle([1, 2, 3, 4, 5, 6, 8, 10]).slice(0, 6), Ev = R.pick([10, 12, 20, 24]);
      var a11 = r[0] + r[1], a22 = r[1] + r[2] + r[3], a33 = r[3] + r[4] + r[5], lab = r.map(function (x, i) { return 'R' + '₁₂₃₄₅₆'[i] + ' = ' + x + ' Ω'; }), fig = figMesh(Ev + ' V', lab);
      var eq = '以迴路分析法（I₁、I₂、I₃ 都取順時針）列出圖示電路的方程式：\na₁₁I₁ + a₁₂I₂ + a₁₃I₃ = ' + Ev + '\na₂₁I₁ + a₂₂I₂ + a₂₃I₃ = 0\na₃₁I₁ + a₃₂I₂ + a₃₃I₃ = 0\n';
      var rule = 'aᵢᵢ = 自己網目內所有電阻的和；aᵢⱼ = −（兩網目共用的電阻），網目沒有相鄰則為 0。';
      if (Math.random() < 0.5) return [eq + '則 a₁₁ + a₂₂ + a₃₃ = ？',
        [String(a11 + a22 + a33), String(r.reduce(function (s, x) { return s + x; }, 0)), String(a11 + a22 + a33 - r[1]), String(a11 + a22 + a33 + r[1] + r[3])],
        rule + 'a₁₁ = R₁ + R₂ = ' + a11 + '、a₂₂ = R₂ + R₃ + R₄ = ' + a22 + '、a₃₃ = R₄ + R₅ + R₆ = ' + a33 + '，和為 ' + (a11 + a22 + a33) + '（共用電阻 R₂、R₄ 各算兩次）。', fig];
      return [eq + '則 a₂₂ 與 a₂₃ 分別為？',
        ['a₂₂ = ' + a22 + '，a₂₃ = ' + H.n(-r[3]), 'a₂₂ = ' + r[2] + '，a₂₃ = ' + H.n(-r[3]), 'a₂₂ = ' + a22 + '，a₂₃ = ' + r[3], 'a₂₂ = ' + a22 + '，a₂₃ = ' + H.n(-r[1])],
        rule + 'a₂₂ = R₂ + R₃ + R₄ = ' + a22 + '；網目 2、3 共用 R₄ → a₂₃ = −' + r[3] + '。', fig];
    } },
    ['電源等效', '有關電壓源與電流源，下列敘述何者錯誤？', ['N 個相同的電壓源（E、內阻 r）並聯，端電壓變為 N·E', '理想電壓源內阻為 0，理想電流源內阻為無限大', '電壓源 E 串聯內阻 r，可等效為電流源 E/r 並聯內阻 r', 'N 個相同的電流源 I 並聯，等效電流為 N·I'], '相同電壓源並聯，端電壓仍是 E（內阻變 r/N、可供電流變大）；串聯時電壓才相加。']
  ]);

  // ======================= 基本電學實習 =======================
  addHard('beel', 0, [
    { t: '安全標示判讀', g: function (R) {
      var S = [['紅色圓形（加斜線）', '禁止（例：禁止煙火）'], ['藍色圓形', '指示，必須遵守（例：必須戴護目鏡）'], ['黃色三角形', '警告，注意危險（例：當心觸電）'], ['綠色方形', '安全狀況（例：緊急出口、急救箱）'], ['紅色方形', '消防設備位置（例：滅火器）']];
      var p = shuffle(S);
      return ['工場安全標示中，「' + p[0][0] + '」的標示代表哪一類？', [p[0][1], p[1][1], p[2][1], p[3][1]], S.map(function (x) { return x[0] + '：' + x[1]; }).join('；') + '。'];
    } },
    ['用電安全', '有關防止電線走火與用電安全，下列做法何者不恰當？', ['把電器過長的電源線凹折後用束帶綁緊收納', '大功率電器不要插在同一條延長線上', '定期清除插座周圍的灰塵', '無熔絲開關跳脫時，先排除過載原因再把開關復歸'], '電線綁緊會散熱不良，熱量集中使絕緣劣化而走火。無熔絲開關跳脫後排除原因即可復歸，不需要換保險絲。'],
    ['觸電與急救', '急救口訣「叫叫 CABD」中，D 代表什麼？', ['使用 AED 對患者電擊去顫', '把患者送醫（Delivery）', '給患者服藥（Drug）', '檢查傷口（Damage）'], '叫（確認意識）、叫（求救並拿 AED）、C 胸部按壓、A 暢通呼吸道、B 人工呼吸、D 使用 AED 電擊。']
  ]);
  addHard('beel', 1, [
    { t: '電表讀值反推色碼', g: function (R) {
      var FSs = [2.5, 25, 250], fr = [[0.5, '刻度的一半'], [0.25, '刻度的四分之一'], [0.4, '刻度的五分之二'], [0.8, '刻度的五分之四']], FS, f, V, I, Rv, c, k = 0;
      do { FS = R.pick(FSs); f = R.pick(fr); V = R.pick([5, 6, 8, 9, 10, 12, 15]); I = FS * f[0] / 1000; Rv = V / I; c = colorCode(Rv); } while ((Math.abs((c[0] * 10 + c[1]) * Math.pow(10, c[2]) - Rv) > 1e-6 * Rv || c[2] < -1 || c[2] > 6) && ++k < 300);
      if (k >= 300) { FS = 25; f = fr[0]; V = 8; I = 0.0125; Rv = 640; }
      return ['一個誤差 ±5% 的電阻接在 ' + V + ' V 直流電源上，用三用電表 DCmA ' + FS + ' mA 檔串聯量電流，指針停在滿' + f[1] + '。此電阻的色碼應為？', codeOpts(Rv),
        'I = ' + FS + ' mA × ' + f[0] + ' = ' + d(I * 1000, 3) + ' mA；R = V ÷ I = ' + V + ' ÷ ' + d(I * 1000, 3) + ' mA = ' + si(Rv, 'Ω') + ' → ' + codeStr(colorCode(Rv)) + '。'];
    } },
    ['三用電表', '接電源前先用三用電表檢查電路：DCV 檔量電源電壓正常，但改用歐姆檔量每一個電阻，指針都完全不動（指在 ∞）。最可能的原因是？', ['電表內部電池沒電或沒裝電池', '每一個電阻都斷路了', '電表表頭燒毀', '電源電壓太高'], 'DCV 正常代表表頭沒壞；歐姆檔要靠內部電池送電流，電池沒電時量什麼都不偏轉。'],
    { t: '電鍋加熱與保溫功率', g: function (R) {
      var Ph = R.pick([500, 550, 605, 800, 1100]), Pw = R.pick([40, 50, 55, 100, 110, 121]), Rh = 12100 / Ph, Rt = 12100 / Pw, Rw = Rt - Rh, Iw = 110 / Rt;
      return ['電鍋加熱時只有電熱板 RH 通電，保溫時改為 RH 與保溫電阻 RW 串聯。拔掉插頭用三用電表量得 RH = ' + d(Rh, 3) + ' Ω、RW = ' + d(Rw, 3) + ' Ω，接 110 V 時加熱與保溫功率約各為多少？',
        ['加熱 ' + d(Ph, 1) + ' W，保溫 ' + d(Pw, 1) + ' W', '加熱 ' + d(Ph, 1) + ' W，保溫 ' + d(12100 / Rw, 1) + ' W', '加熱 ' + d(Pw, 1) + ' W，保溫 ' + d(Ph, 1) + ' W', '加熱 ' + d(Ph, 1) + ' W，保溫 ' + d(Iw * Iw * Rw, 1) + ' W'],
        '加熱：P = 110² ÷ ' + d(Rh, 3) + ' = ' + d(Ph, 1) + ' W；保溫：P = 110² ÷ (' + d(Rh, 3) + ' + ' + d(Rw, 3) + ') = 12100 ÷ ' + d(Rt, 3) + ' = ' + d(Pw, 1) + ' W（串聯電阻變大，功率變小）。'];
    } },
    ['家電量測', '要判斷一台冰箱是否省電，應該看哪一種標章？', ['節能標章', '環保標章', '安全標章', '綠建材標章'], '節能標章：能源效率比國家標準高；環保標章著重減少污染與資源回收。']
  ]);
  addHard('beel', 2, [
    { t: 'SMD 電阻判讀', g: function (R) {
      var t = R.int(0, 2), code, Rv;
      if (t === 0) { var ab = R.pick([10, 15, 22, 33, 47, 68]), m = R.int(0, 4); code = String(ab) + m; Rv = ab * Math.pow(10, m); }
      else if (t === 1) { var abc = R.pick([100, 120, 150, 249, 330, 470, 750]), m2 = R.int(0, 3); code = String(abc) + m2; Rv = abc * Math.pow(10, m2); }
      else { var a = R.int(1, 9), b = R.int(0, 9); code = a + 'R' + b; Rv = a + b / 10; }
      var V = R.pick([5, 9, 12]);
      return ['一顆 SMD 晶片電阻上印「' + code + '」，接在 ' + V + ' V 直流電源上，電阻值與電流為？',
        ['R = ' + si(Rv, 'Ω') + '，I ≈ ' + si(V / Rv, 'A'), 'R = ' + si(Rv * 10, 'Ω') + '，I ≈ ' + si(V / Rv / 10, 'A'), 'R = ' + si(Rv / 10, 'Ω') + '，I ≈ ' + si(V / Rv * 10, 'A'), 'R = ' + si(Rv, 'Ω') + '，I ≈ ' + si(V / Rv * 1000, 'A')],
        (t === 0 ? '3 碼：前兩碼是有效數字、第三碼是 10 的次方：' + code.slice(0, 2) + ' × 10' + sup(code.slice(2)) : t === 1 ? '4 碼（精密電阻）：前三碼是有效數字、第四碼是 10 的次方：' + code.slice(0, 3) + ' × 10' + sup(code.slice(3)) : 'R 代表小數點：' + code + ' = ' + Rv) + ' = ' + si(Rv, 'Ω') + '；I = ' + V + ' ÷ ' + si(Rv, 'Ω') + ' ≈ ' + si(V / Rv, 'A') + '。'];
    } },
    { t: '電表接法誤差', g: function (R) {
      var Rv = R.pick([100, 200, 500, 1000]), V = R.pick([5, 10, 20]), Im = R.pick([0.5, 1, 2, 4]);
      var Rm = V / Im, Iv = V / Rv, Rt = V / (Im - Iv), err = (Rm - Rt) / Rt * 100;
      return ['伏特表（內阻 ' + Rv + ' kΩ）直接並在待測電阻 R 兩端，安培表串在外側。伏特表讀 ' + V + ' V、安培表讀 ' + Im + ' mA，則 R 的實際值與測量誤差百分率約為？（誤差 = (測量值 − 實際值) ÷ 實際值）',
        ['實際 ' + d(Rt, 3) + ' kΩ，誤差 ' + d(err, 2) + '%', '實際 ' + d(Rm, 3) + ' kΩ，誤差 0%', '實際 ' + d(2 * Rm - Rt, 3) + ' kΩ，誤差 ' + d(-err, 2) + '%', '實際 ' + d(Rt, 3) + ' kΩ，誤差 ' + d(-err, 2) + '%'],
        '測量值 = ' + V + ' ÷ ' + Im + ' mA = ' + d(Rm, 3) + ' kΩ。安培表讀數包含流過伏特表的 ' + V + ' ÷ ' + Rv + ' k = ' + d(Iv, 4) + ' mA，R 的實際電流 = ' + d(Im - Iv, 4) + ' mA → 實際 R = ' + d(Rt, 3) + ' kΩ；誤差 = ' + d(err, 2) + '%（量小了）。待測電阻比伏特表內阻小很多時，這種接法誤差才小。'];
    } },
    { t: '電池內阻量測', g: function (R) {
      var Ev = R.pick([1.5, 3, 6, 9, 12]), r = R.pick([0.5, 1, 2, 2.5]), RL = R.pick([2, 4, 5, 10]), V = Ev * RL / (RL + r);
      if (Math.random() < 0.5) return ['用理想電壓表量電池：開關打開時讀 ' + Ev + ' V；開關閉合、接上 ' + RL + ' Ω 負載後讀 ' + d(V, 3) + ' V。電池內阻約為？',
        uniq([d(r, 3) + ' Ω', d(RL * (Ev - V) / Ev, 3) + ' Ω', d(RL * V / (Ev - V), 3) + ' Ω', d(Ev - V, 3) + ' Ω', d(r * 2, 3) + ' Ω', d(r / 2, 3) + ' Ω', d(r + 1, 3) + ' Ω', d(r * 4, 3) + ' Ω', d(r + 3, 3) + ' Ω']).slice(0, 4),
        '開路電壓 = E = ' + Ev + ' V；接負載後 I = ' + d(V, 3) + ' ÷ ' + RL + ' = ' + d(V / RL, 4) + ' A，內阻壓降 ' + d(Ev - V, 3) + ' V → r = ' + d(Ev - V, 3) + ' ÷ ' + d(V / RL, 4) + ' = ' + d(r, 3) + ' Ω。'];
      return ['一個內阻 ' + r + ' Ω 的電池，開關打開時理想電壓表讀 ' + Ev + ' V；開關閉合接上負載 R 後讀 ' + d(V, 3) + ' V。R 約為？',
        uniq([d(RL, 3) + ' Ω', d(r * Ev / (Ev - V), 3) + ' Ω', d(r * (Ev - V) / V, 3) + ' Ω', d(RL * 2, 3) + ' Ω', d(RL + r, 3) + ' Ω', d(RL / 2, 3) + ' Ω', d(RL * 3, 3) + ' Ω', d(RL + 1, 3) + ' Ω']).slice(0, 4),
        '內阻壓降 = ' + Ev + ' − ' + d(V, 3) + ' = ' + d(Ev - V, 3) + ' V → I = ' + d(Ev - V, 3) + ' ÷ ' + r + ' = ' + d((Ev - V) / r, 4) + ' A；R = ' + d(V, 3) + ' ÷ ' + d((Ev - V) / r, 4) + ' = ' + RL + ' Ω。'];
    } },
    { t: '燈泡規格選用', g: function (R) {
      var Rl = R.pick([4, 6, 8, 12]), Rs = R.pick([2, 4, 6, 8]), I = R.pick([0.5, 1, 1.5, 2]), Ev = I * (Rs + Rl), Pa = I * I * Rl, vs = [];
      for (var v = 1; v <= 40; v++) vs.push(v);
      var good = vs.filter(function (x) { return x * x / Rl >= Pa; })[0], low = vs.filter(function (x) { return x * x / Rl < Pa; }).pop(), Pg = good * good / Rl;
      function spec(x, p) { return x + ' V／' + d(p, 3) + ' W'; }
      return ['如圖電路，要在燈泡位置裝上內阻 ' + Rl + ' Ω 的燈泡（內阻以額定值 V²/P 計算），並且長時間通電也不會燒毀，應選用哪一顆燈泡？（E = ' + Ev + ' V、R = ' + Rs + ' Ω）',
        [spec(good, Pg), spec(low, low * low / Rl), spec(good, Pg * 2), spec(good * 2, Pg)],
        'I = ' + Ev + ' ÷ (' + Rs + ' + ' + Rl + ') = ' + I + ' A，燈泡實際功率 = I²R = ' + d(Pa, 3) + ' W。燈泡內阻 V²/P 要等於 ' + Rl + ' Ω，且額定功率要 ≥ ' + d(Pa, 3) + ' W → ' + spec(good, Pg) + '（' + good * good + ' ÷ ' + d(Pg, 3) + ' = ' + Rl + ' Ω）。',
        figLamp(Ev + ' V', 'R = ' + Rs + ' Ω')];
    } },
    { t: '電容標示判讀', g: function (R) {
      var ab = R.pick([10, 22, 33, 47, 68]), m = R.int(1, 5), tol = R.pick([['J', '±5%'], ['K', '±10%'], ['M', '±20%']]), C = ab * Math.pow(10, m) * 1e-12;
      var tl = ['±5%', '±10%', '±20%'].filter(function (x) { return x !== tol[1]; });
      return ['電容器上標示「' + ab + m + tol[0] + '」，其電容值與誤差為？', [si(C, 'F') + '，' + tol[1], si(C * 10, 'F') + '，' + tol[1], si(C, 'F') + '，' + tl[0], si(C / 10, 'F') + '，' + tl[1]],
        '前兩碼是有效數字、第三碼是 10 的次方，單位 pF：' + ab + ' × 10' + sup(m) + ' pF = ' + si(C, 'F') + '。誤差碼 J = ±5%、K = ±10%、M = ±20%。'];
    } }
  ]);

  // ======================= 電子學 =======================
  addHard('elec', 0, [
    { t: '工作週期情境', g: function (R) {
      var D0 = R.pick([20, 25, 30, 40, 60]), Tm = R.pick([5, 10]), on = D0 / 100 * Tm, askOff = Math.random() < 0.4;
      return ['一台電焊機的額定工作週期為 ' + D0 + '%（以 ' + Tm + ' 分鐘為一個週期），正常使用下' + (askOff ? '每個週期至少要休息幾分鐘？' : '每個週期最多能連續工作幾分鐘？'),
        uniq([d(askOff ? Tm - on : on, 2) + ' 分鐘', d(askOff ? on : Tm - on, 2) + ' 分鐘', d(D0 / 10, 2) + ' 分鐘', d(Tm * 100 / D0, 2) + ' 分鐘', d(on / 2, 2) + ' 分鐘']).slice(0, 4),
        '工作週期 D = 工作時間 ÷ 週期：工作 ' + Tm + ' × ' + D0 + '% = ' + d(on, 2) + ' 分鐘，休息 ' + d(Tm - on, 2) + ' 分鐘。'];
    } },
    { t: '直流加交流的有效值', g: function (R) {
      var Vdc = R.pick([3, 4, 5, 6, 8]), Vm = R.pick([4, 6, 8, 10, 12]), Vr = Math.sqrt(Vdc * Vdc + Vm * Vm / 2);
      return ['電壓 v(t) = ' + Vdc + ' + ' + Vm + ' sin(ωt) V，其平均值與有效值各為？',
        ['Vav = ' + Vdc + ' V，Vrms ≈ ' + d(Vr, 2) + ' V', 'Vav = ' + Vdc + ' V，Vrms ≈ ' + d(Vdc + Vm / Math.SQRT2, 2) + ' V', 'Vav = ' + d(Vdc + 0.636 * Vm, 2) + ' V，Vrms ≈ ' + d(Vr, 2) + ' V', 'Vav = ' + Vdc + ' V，Vrms ≈ ' + d(Math.sqrt(Vdc * Vdc + Vm * Vm), 2) + ' V'],
        '正弦部分一週期平均為 0 → Vav = ' + Vdc + ' V。有效值要用功率相加：Vrms = √(Vdc² + (Vm/√2)²) = √(' + Vdc * Vdc + ' + ' + Vm * Vm / 2 + ') ≈ ' + d(Vr, 2) + ' V，不能把 ' + Vdc + ' 和 ' + d(Vm / Math.SQRT2, 2) + ' 直接相加。'];
    } },
    { t: '含直流準位的脈波平均值', g: function (R) {
      var VH = R.pick([5, 8, 10, 12]), VL = R.pick([-4, -2, 2, 3]), D0 = R.pick([0.2, 0.25, 0.4, 0.6, 0.75]), Tm = R.pick([4, 5, 10, 20]), tH = D0 * Tm;
      var Va = D0 * VH + (1 - D0) * VL;
      return ['如圖的週期性脈波，高準位 ' + VH + ' V、低準位 ' + H.n(VL) + ' V，此波形的平均值為？',
        uniq([d(Va, 3) + ' V', d(D0 * VH, 3) + ' V', d((VH + VL) / 2, 3) + ' V', d(D0 * (VH - VL), 3) + ' V', d((1 - D0) * VH + D0 * VL, 3) + ' V', d(Va + VL, 3) + ' V']).slice(0, 4),
        'D = ' + d(tH, 3) + ' ÷ ' + Tm + ' = ' + D0 + '。Vav = D·VH + (1 − D)·VL = ' + D0 + ' × ' + VH + ' + ' + d(1 - D0, 2) + ' × (' + H.n(VL) + ') = ' + d(Va, 3) + ' V。',
        figPulse2(VH, VL, D0, 'T = ' + Tm + ' ms', 'tH = ' + d(tH, 3) + ' ms')];
    } },
    { t: '脈波有效值與波形因數', g: function (R) {
      var D0 = R.pick([0.25, 0.16, 0.36, 0.64, 0.49]), Vm = R.pick([5, 10, 12, 20]), Tm = R.pick([5, 10, 20, 25]), tH = D0 * Tm;
      var Vr = Vm * Math.sqrt(D0), Va = Vm * D0, FF = 1 / Math.sqrt(D0);
      return ['如圖的週期性方波脈波（低準位 0 V），其有效值 Vrms 與波形因數 FF 為？',
        ['Vrms = ' + d(Vr, 3) + ' V，FF = ' + d(FF, 3), 'Vrms = ' + d(Va, 3) + ' V，FF = ' + d(FF, 3), 'Vrms = ' + d(Vr, 3) + ' V，FF = ' + d(Math.sqrt(D0), 3), 'Vrms = ' + d(Vm / Math.SQRT2, 3) + ' V，FF = 1.11'],
        'D = ' + d(tH, 3) + ' ÷ ' + Tm + ' = ' + D0 + '。Vav = D·Vm = ' + d(Va, 3) + ' V；Vrms = Vm√D = ' + d(Vr, 3) + ' V；FF = Vrms ÷ Vav = 1/√D = ' + d(FF, 3) + '。（1.11 是正弦波的波形因數）',
        E.figPulse('T = ' + Tm + ' ms', 'tH = ' + d(tH, 3) + ' ms', Vm + ' V', D0)];
    } },
    { t: 'IC 元件數分類', g: function (R) {
      var c = R.pick([[R.int(20, 90), 'SSI'], [R.int(150, 900), 'MSI'], [R.int(1500, 9000), 'LSI'], [R.int(20, 900) * 1000, 'VLSI']]);
      return ['某晶片內含約 ' + c[0] + ' 個電子元件（電晶體、電阻等），依元件數分類屬於哪一類積體電路？', [c[1]].concat(['SSI', 'MSI', 'LSI', 'VLSI', 'ULSI'].filter(function (x) { return x !== c[1]; }).slice(0, 3)),
        '依元件數：SSI < 100、MSI 100～1000、LSI 1000～10⁴、VLSI 10⁴～10⁶、ULSI > 10⁶（例：Intel 4004 約 2300 顆電晶體 → LSI）。若改以邏輯閘數分類，SSI < 12、MSI 12～99、LSI 100～999。'];
    } }
  ]);
  addHard('elec', 1, [
    { t: '二極體交流電阻', g: function (R) {
      var ID = R.pick([1, 2, 2.5, 5, 6.5, 10, 13, 26]), eta = R.pick([1, 2]), rd = eta * 26 / ID;
      return ['室溫下（VT = 26 mV）一顆 η = ' + eta + ' 的二極體工作電流為 ' + ID + ' mA，其交流電阻 rd 約為？',
        uniq([d(rd, 2) + ' Ω', d(eta === 1 ? rd * 2 : rd / 2, 2) + ' Ω', d(rd * 1000, 1) + ' Ω', d(ID / 26 * 1000 / eta, 2) + ' Ω', d(rd * 4, 2) + ' Ω']).slice(0, 4),
        'rd = ηVT ÷ ID = ' + eta + ' × 26 mV ÷ ' + ID + ' mA = ' + d(rd, 2) + ' Ω。（矽二極體大電流時 η ≈ 1、小電流時 η ≈ 2）'];
    } },
    ['發光二極體', '有關 LED 與 OLED，下列敘述何者錯誤？', ['OLED 是點狀發光，LED 是整面發光', 'LED 由 PN 接面的電子與電洞復合放出光能，屬冷光', 'OLED 以有機材料發光，可做成輕薄、可彎曲的面板', 'LED 的發光顏色由半導體材料（能隙）決定'], 'LED 是點光源，OLED 是面光源，兩者剛好相反。'],
    { t: '摻雜與載子', g: function (R) {
      var e = R.pick([['硼', 3], ['鎵', 3], ['銦', 3], ['磷', 5], ['砷', 5], ['銻', 5]]), p = e[1] === 3;
      return ['在純矽中摻入少量「' + e[0] + '」，會形成哪一型半導體？其中自由電子濃度與電洞濃度的關係、材料整體電性為何？',
        [(p ? 'P 型；電子濃度小於電洞濃度' : 'N 型；電子濃度大於電洞濃度') + '；整體呈電中性', p ? 'P 型；電子濃度小於電洞濃度；整體帶正電' : 'N 型；電子濃度大於電洞濃度；整體帶負電', (p ? 'N 型；電子濃度大於電洞濃度' : 'P 型；電子濃度小於電洞濃度') + '；整體呈電中性', (p ? 'P 型；電子濃度大於電洞濃度' : 'N 型；電子濃度小於電洞濃度') + '；整體呈電中性'],
        e[0] + '是 ' + e[1] + ' 價元素 → ' + (p ? '受體，產生電洞，形成 P 型（多數載子為電洞）' : '施體，提供自由電子，形成 N 型（多數載子為電子）') + '。摻雜的原子本身是電中性，所以半導體整體仍是電中性。'];
    } },
    ['半導體', 'N 型半導體的溫度升高時，其中電洞（少數載子）的濃度會如何變化？', ['增加', '減少', '不變', '先增加後減少'], '溫度升高使更多共價鍵斷裂，產生電子-電洞對，本質載子濃度 ni 上升；少數載子濃度約為 ni² ÷ ND，所以電洞濃度增加。'],
    { t: '稽納負載電阻範圍', g: function (R) {
      var Vz, Rs, Vi, IS, Imin, Imax, k = 0;
      do { Vz = R.pick([5, 6, 9, 10, 12]); Rs = R.pick([100, 200, 250]); Vi = Vz + R.pick([5, 6, 8, 10, 12]); IS = (Vi - Vz) / Rs * 1000; Imin = R.pick([2, 5]); Imax = R.pick([15, 20, 25, 30]); } while (IS - Imax < 6 && ++k < 100);
      if (IS - Imax < 6) { Vz = 5; Rs = 100; Vi = 15; IS = 100; Imin = 5; Imax = 30; }
      var ILmax = IS - Imin, ILmin = IS - Imax, Rmin = Vz / ILmax * 1000, Rmax = Vz / ILmin * 1000;
      return ['如圖稽納穩壓電路，VZ = ' + Vz + ' V（理想），IZ 須維持在 ' + Imin + ' mA ～ ' + Imax + ' mA 才能穩壓又不燒毀；輸入 ' + Vi + ' V、RS = ' + Rs + ' Ω，負載 RL 的合理範圍為？',
        [d(Rmin, 1) + ' Ω ≤ RL ≤ ' + d(Rmax, 1) + ' Ω', d(Vz / IS * 1000, 1) + ' Ω ≤ RL ≤ ' + d(Rmax, 1) + ' Ω', d(Rmin, 1) + ' Ω ≤ RL ≤ ' + d(Vz / Imin * 1000, 1) + ' Ω', d(Vz / Imax * 1000, 1) + ' Ω ≤ RL ≤ ' + d(Vz / Imin * 1000, 1) + ' Ω'],
        'IS = (' + Vi + ' − ' + Vz + ') ÷ ' + Rs + ' = ' + d(IS, 2) + ' mA，IL = IS − IZ。IZ 最小時 IL 最大 = ' + d(ILmax, 2) + ' mA → RL(min) = ' + Vz + ' V ÷ ' + d(ILmax, 2) + ' mA ≈ ' + d(Rmin, 1) + ' Ω；IZ 最大時 IL 最小 = ' + d(ILmin, 2) + ' mA → RL(max) ≈ ' + d(Rmax, 1) + ' Ω。',
        E.figZener(Vi + ' V', 'RS = ' + Rs + ' Ω', 'VZ = ' + Vz + ' V', 'IL')];
    } },
    { t: '整流後負載功率', g: function (R) {
      var full = Math.random() < 0.5, Vm = R.pick([10, 20, 40, 50, 100]), Rl = R.pick([50, 100, 200, 500]);
      var P = full ? Vm * Vm / (2 * Rl) : Vm * Vm / (4 * Rl), Pavg = Math.pow(full ? 2 * Vm / Math.PI : Vm / Math.PI, 2) / Rl;
      return ['峰值 ' + Vm + ' V 的正弦波經理想' + (full ? '全波' : '半波') + '整流（無濾波）後，加在 ' + Rl + ' Ω 電阻上，電阻消耗的平均功率為？',
        [d(P, 3) + ' W', d(Pavg, 3) + ' W', d(full ? Vm * Vm / (4 * Rl) : Vm * Vm / (2 * Rl), 3) + ' W', d(Vm * Vm / Rl, 3) + ' W'],
        (full ? '全波整流的有效值 = Vm/√2' : '半波整流的有效值 = Vm/2') + ' → P = Vrms² ÷ R = ' + d(P, 3) + ' W。算功率要用有效值，不能用平均值（' + (full ? '2Vm/π' : 'Vm/π') + '）。'];
    } },
    { t: '橋式濾波輸出平均值', g: function (R) {
      var Vm = R.pick([20, 50, 100]), w0 = R.pick([[314, 50], [377, 60]]), C = R.pick([100, 220, 470]), Rl = R.pick([100, 200, 500, 1000]);
      var x = 4 * w0[1] * Rl * C * 1e-6, Vdc = Vm / (1 + 1 / x), half = Vm / (1 + 2 / x);
      return ['如圖橋式整流濾波電路（二極體理想），變壓器二次側 v(t) = ' + Vm + ' sin(' + w0[0] + 't) V，C = ' + C + ' μF、RL = ' + Rl + ' Ω，輸出電壓平均值約為？',
        [d(Vdc, 1) + ' V', d(Vm, 1) + ' V', d(2 * Vm / Math.PI, 1) + ' V', d(half, 1) + ' V'],
        '全波漣波頻率 fr = 2 × ' + w0[1] + ' = ' + 2 * w0[1] + ' Hz，Vr(p-p) ≈ IDC ÷ (fr·C)，IDC = VDC ÷ RL。VDC = Vm − Vr(p-p)/2 → VDC = Vm ÷ (1 + 1/(4fRLC)) = ' + Vm + ' ÷ (1 + 1/' + d(x, 3) + ') ≈ ' + d(Vdc, 1) + ' V。',
        figBridgeC('v(t)')];
    } }
  ]);
  addHard('elec', 2, [
    ['BJT 結構', '有關未加偏壓的 BJT，下列敘述何者正確？', ['射極摻雜最濃，所以 BE 接面的空乏區比 BC 接面窄', '基極最寬，摻雜濃度最高', '集極摻雜最濃，所以集極耐壓最低', 'BE 接面的空乏區比 BC 接面寬'], '射極最濃、基極最薄最淡、集極面積最大且耐壓最高。空乏區偏向淡摻雜的一側，BE 接面窄、BC 接面寬（所以 BE 接面電容較大）。'],
    ['BJT 結構', '想讓 BJT 的 α（IC ÷ IE）更接近 1，應如何改善？', ['降低基極摻雜濃度並減少基極寬度', '提高基極摻雜濃度並加寬基極', '降低射極摻雜濃度', '提高集極摻雜濃度並加寬基極'], '基極越薄、越淡，射極注入的載子在基極復合越少，幾乎都被集極收集，α 越接近 1。'],
    { t: '電晶體開關驅動 LED', g: function (R) {
      var Vcc = R.pick([5, 9, 12]), VL = R.pick([1.6, 2, 2.2]), Vi = R.pick([3, 5]), RB = R.pick([20, 47, 50, 100]), beta = R.pick([50, 100]);
      var IB = (Vi - 0.7) / RB, num0 = Vcc - VL - 0.2, RC = num0 / (beta * IB);
      return ['NPN 電晶體當開關驅動 LED：輸入 ' + Vi + ' V 經 RB = ' + RB + ' kΩ 接基極，LED 與 RC 串聯接在 VCC = ' + Vcc + ' V 與集極之間。β = ' + beta + '、VBE = 0.7 V、VCE(sat) = 0.2 V、VLED = ' + VL + ' V，要讓電晶體飽和點亮 LED，RC 最小值約為？',
        [d(RC, 3) + ' kΩ', d((Vcc - 0.2) / (beta * IB), 3) + ' kΩ', d((Vcc - VL) / (beta * IB), 3) + ' kΩ', d(num0 / IB, 3) + ' kΩ'],
        'IB = (' + Vi + ' − 0.7) ÷ ' + RB + ' k = ' + d(IB * 1000, 2) + ' μA，βIB = ' + d(beta * IB, 3) + ' mA。飽和條件 IC(sat) = (' + Vcc + ' − ' + VL + ' − 0.2) ÷ RC ≤ βIB → RC ≥ ' + d(num0, 2) + ' ÷ ' + d(beta * IB, 3) + ' mA = ' + d(RC, 3) + ' kΩ。'];
    } },
    { t: '由 VCE 反推 β', g: function (R) {
      var Vcc, RB, RC, beta, IB, IC, VCE, k = 0;
      do { Vcc = R.pick([10, 12, 15]); RB = R.pick([200, 300, 390, 470, 560]); RC = R.pick([1, 1.5, 2, 2.2]); beta = R.pick([50, 80, 100, 120, 150]); IB = (Vcc - 0.7) / RB; IC = beta * IB; VCE = Vcc - IC * RC; } while ((VCE < 1.5 || VCE > Vcc - 1) && ++k < 100);
      var VCEs = Math.round(VCE * 10) / 10, b = (Vcc - VCEs) / RC / IB, b2 = (Vcc - VCEs) / RC / (Vcc / RB);
      return ['固定偏壓 CE 電路：VCC = ' + Vcc + ' V、RB = ' + RB + ' kΩ、RC = ' + RC + ' kΩ、VBE = 0.7 V，量得 VCE = ' + VCEs + ' V，電晶體的 β 約為？',
        uniq([String(Math.round(b)), String(Math.round(b2)), String(Math.round(b * 1.25)), String(Math.round(b * 0.8)), String(Math.round(b) + 10)]).slice(0, 4),
        'IC = (' + Vcc + ' − ' + VCEs + ') ÷ ' + RC + ' k = ' + d((Vcc - VCEs) / RC, 3) + ' mA；IB = (' + Vcc + ' − 0.7) ÷ ' + RB + ' k = ' + d(IB * 1000, 2) + ' μA；β = IC ÷ IB ≈ ' + Math.round(b) + '。'];
    } },
    { t: 'gm、rπ、re 換算', g: function (R) {
      var gm = R.pick([20, 40, 50, 80, 100]), beta = R.pick([79, 99, 149, 199]), rpi = beta / gm, re = rpi * 1000 / (beta + 1);
      return ['已知電晶體的互導 gm = ' + gm + ' mS、基極交流輸入電阻 rπ = ' + d(rpi, 3) + ' kΩ，則射極交流電阻 re 約為？',
        [d(re, 2) + ' Ω', d(1000 / gm * 2, 2) + ' Ω', d(rpi * 1000 / (beta - 1), 2) + ' Ω', d(rpi * (beta + 1), 1) + ' kΩ'],
        'β = gm·rπ = ' + gm + ' m × ' + d(rpi, 3) + ' k = ' + beta + '；rπ = (1 + β)re → re = ' + d(rpi * 1000, 1) + ' ÷ ' + (beta + 1) + ' ≈ ' + d(re, 2) + ' Ω（≈ 1/gm = ' + d(1000 / gm, 2) + ' Ω）。'];
    } },
    { t: '由三腳電壓判斷工作區', g: function (R) {
      var pnp = Math.random() < 0.4, be = Math.random() < 0.6, bc = Math.random() < 0.4, VE = R.pick([0, 1, 2, 3]);
      var vbe = be ? 0.7 : R.pick([0, -1, -2]), vbc = bc ? 0.5 : R.pick([-2, -4, -5.3]), VB, VC;
      if (!pnp) { VB = VE + vbe; VC = VB - vbc; } else { VB = VE - vbe; VC = VB + vbc; }
      var reg = be ? (bc ? '飽和區' : '主動區') : (bc ? '反向主動區' : '截止區'), all = ['主動區', '飽和區', '截止區', '反向主動區'];
      return [(pnp ? 'PNP' : 'NPN') + ' 電晶體 BE 接面切入電壓 0.7 V、BC 接面切入電壓 0.5 V，量得三腳對地電壓如圖，此電晶體工作在哪一區？', [reg].concat(all.filter(function (x) { return x !== reg; })),
        (pnp ? 'PNP：VEB = VE − VB = ' + d(VE - VB, 1) + ' V、VCB = VC − VB = ' + d(VC - VB, 1) + ' V' : 'NPN：VBE = VB − VE = ' + d(VB - VE, 1) + ' V、VBC = VB − VC = ' + d(VB - VC, 1) + ' V') + ' → BE 接面' + (be ? '順偏' : '未導通') + '、BC 接面' + (bc ? '順偏' : '逆偏') + ' → ' + reg + '。（BE 順 BC 逆：主動；都順：飽和；都不導通：截止；BE 逆 BC 順：反向主動）',
        figPins(d(VB, 1) + ' V', d(VE, 1) + ' V', d(VC, 1) + ' V', pnp)];
    } },
    { t: '共基極 VCB', g: function (R) {
      var VEE, RE, al, Vcc, RC, IE, IC, VCB, k = 0;
      do { VEE = R.pick([5.7, 6.7, 10.7]); RE = R.pick([1, 2, 2.5, 5]); al = R.pick([0.95, 0.98, 0.99]); Vcc = R.pick([12, 15, 18, 20]); RC = R.pick([1, 2, 3]); IE = (VEE - 0.7) / RE; IC = al * IE; VCB = Vcc - IC * RC; } while (VCB < 1 && ++k < 100);
      return ['NPN 共基極電路：基極接地，射極經 RE = ' + RE + ' kΩ 接到 −' + VEE + ' V，集極經 RC = ' + RC + ' kΩ 接到 +' + Vcc + ' V。α = ' + al + '、VBE = 0.7 V，集極對基極電壓 VCB 約為？',
        uniq([d(VCB, 2) + ' V', d(Vcc - IE * RC, 2) + ' V', d(VCB + 0.7, 2) + ' V', d(IC * RC, 2) + ' V', d(VCB - 0.7, 2) + ' V']).slice(0, 4),
        'IE = (' + VEE + ' − 0.7) ÷ ' + RE + ' k = ' + d(IE, 3) + ' mA；IC = αIE = ' + d(IC, 3) + ' mA；基極接地，VCB = VC = ' + Vcc + ' − ' + d(IC, 3) + ' × ' + RC + ' = ' + d(VCB, 2) + ' V。'];
    } },
    ['偏壓穩定性', '想做一個工作點幾乎不受溫度與 β 影響的擴音器前級，最適合用哪一種 BJT 偏壓電路？', ['分壓式偏壓（含射極電阻）', '固定偏壓', '集極回授偏壓', '射極回授偏壓（基極只接一個電阻）'], '分壓式偏壓的基極電壓由分壓決定，再加上 RE 負回授，工作點最穩定；固定偏壓最差。']
  ]);
  addHard('elec', 3, [
    { t: '示波器求電壓增益', g: function (R) {
      var Vs = R.pick([0.02, 0.05, 0.1]), vd = R.pick([1, 2, 5]), div = R.pick([2, 4, 6]), Vop = div / 2 * vd, Av = Vop / Vs;
      return ['CE 放大器輸入 vs = ' + Vs + ' sin(ωt) V，示波器垂直刻度 ' + vd + ' V/DIV，量到的輸出波形如圖（峰對峰 ' + div + ' 格）。電壓增益 Av 為？',
        [H.n(-Av), H.n(Av), H.n(-Av * 2), H.n(-Av / 2)],
        'Vo(p-p) = ' + div + ' 格 × ' + vd + ' V = ' + div * vd + ' V → Vo(p) = ' + d(Vop, 2) + ' V；|Av| = ' + d(Vop, 2) + ' ÷ ' + Vs + ' = ' + d(Av, 1) + '。CE 組態輸出與輸入反相 → Av = ' + H.n(-Av) + '。',
        D.scope(4, div)];
    } },
    { t: '削峰原因與改善', g: function (R) {
      var pos = Math.random() < 0.5;
      return ['NPN 共射極（CE）放大器使用固定偏壓，輸入正弦波時，輸出波形的' + (pos ? '正' : '負') + '半週被削平、另一半週正常。最恰當的改善方法為？',
        [pos ? '減小 RB，使 ICQ 增大' : '增大 RB，使 ICQ 減小', pos ? '增大 RB，使 ICQ 減小' : '減小 RB，使 ICQ 增大', '把輸入訊號加大', pos ? '改用 β 較小的電晶體' : '改用 β 較大的電晶體'],
        'CE 輸出 vce 與 ic 反相。' + (pos ? '輸出正半週是 vce 變大、ic 變小 → 碰到截止。Q 點太靠近截止（ICQ 太小），應減小 RB 讓 ICQ 增大。' : '輸出負半週是 vce 變小、ic 變大 → 碰到飽和。Q 點太靠近飽和（ICQ 太大），應增大 RB 讓 ICQ 減小。') + '加大輸入只會更嚴重。'];
    } }
  ]);

  // ======================= 電子學實習 =======================
  addHard('elecl', 0, [
    ['工場安全', '公共場所設置的 AED（自動體外心臟電擊去顫器）主要用於哪一種緊急狀況？', ['心跳停止（如心室顫動）的患者', '一般燒燙傷的患者', '擦傷流血的患者', '中暑但意識清醒的患者'], 'AED 會自動分析心律，對心室顫動等可電擊心律給予電擊，要搭配 CPR。'],
    ['工場安全', '設備接地的主要目的為何？', ['外殼漏電時讓電流經接地線流走，防止感電', '提高設備效率', '減少線路的電流損失', '節省電費'], '接地是安全措施：絕緣失效時，漏電流經接地線流入大地，並使漏電斷路器跳脫。']
  ]);
  addHard('elecl', 1, [
    ['電源電路', '一般線性直流電源供應器，由輸入到輸出的方塊順序為何？', ['變壓器 → 整流 → 濾波 → 穩壓', '整流 → 變壓器 → 濾波 → 穩壓', '變壓器 → 濾波 → 整流 → 穩壓', '變壓器 → 穩壓 → 整流 → 濾波'], '先用變壓器降壓，整流成脈動直流，電容濾波減少漣波，最後穩壓（稽納或穩壓 IC）。'],
    { t: 'LED 限流電阻範圍', g: function (R) {
      var Vs = R.pick([5, 6, 9, 12]), VF = R.pick([1.5, 2, 2.2]), rg = R.pick([[5, 50], [10, 30], [5, 20], [2, 20]]), Rmin = (Vs - VF) / rg[1] * 1000, Rmax = (Vs - VF) / rg[0] * 1000;
      return ['LED 順向壓降 ' + VF + ' V，正常工作電流 ' + rg[0] + ' mA ～ ' + rg[1] + ' mA，接在 ' + Vs + ' V 電源上，為避免燒毀，限流電阻 RS 最小不得低於多少？',
        uniq([d(Rmin, 1) + ' Ω', d(Rmax, 1) + ' Ω', d(Vs / rg[1] * 1000, 1) + ' Ω', d((Vs + VF) / rg[1] * 1000, 1) + ' Ω', d(Rmin / 2, 1) + ' Ω']).slice(0, 4),
        '電流最大時電阻最小：RS(min) = (' + Vs + ' − ' + VF + ') ÷ ' + rg[1] + ' mA = ' + d(Rmin, 1) + ' Ω。（電流最小時對應 RS(max) = ' + d(Rmax, 1) + ' Ω）'];
    } }
  ]);
  addHard('elecl', 2, [
    { t: '工作點偏移調整', g: function (R) {
      var toCut = Math.random() < 0.5;
      return ['固定偏壓電路原本工作點在負載線中央，更換一顆 β ' + (toCut ? '較小' : '較大') + '的電晶體後，工作點移向' + (toCut ? '截止區' : '飽和區') + '附近。在不改變集極飽和電流的條件下，應如何把工作點調回中央？',
        [toCut ? '減少 RB' : '增加 RB', toCut ? '增加 RB' : '減少 RB', '減少 RC', '增加 RC'],
        'IC(sat) = VCC ÷ RC，不改 IC(sat) 就不能動 RC。' + (toCut ? 'β 變小使 IC 變小 → 減少 RB 讓 IB 變大，IC 回升。' : 'β 變大使 IC 變大 → 增加 RB 讓 IB 變小，IC 下降。')];
    } }
  ]);
  addHard('elecl', 3, [
    { t: '放大器類別', g: function (R) {
      var L = [['工作點在直流負載線中點，整個週期 360° 都導通', 'A 類'], ['兩顆電晶體推挽，各導通半週，容易產生交越失真', 'B 類'], ['工作點略高於截止點，用來減少推挽電路的交越失真', 'AB 類'], ['導通角小於 180°，常配合 LC 調諧電路做射頻放大', 'C 類']], p = shuffle(L);
      return ['「' + p[0][0] + '」是哪一類放大器？', [p[0][1], p[1][1], p[2][1], p[3][1]], L.map(function (x) { return x[1] + '：' + x[0]; }).join('；') + '。'];
    } }
  ]);

  // ======================= 微處理機 =======================
  addHard('mpu', 0, [
    { t: '指令數與執行時間', g: function (R) {
      var M = R.pick([5, 10, 20, 50, 100]), N = R.pick([6, 12, 30, 60, 120]), t = N * 1e8 / (M * 1e6);
      return ['一部 CPU 的效能為 ' + M + ' MIPS，執行 ' + N + ' 億個指令約需多少時間？',
        uniq([d(t, 2) + ' 秒', d(t * 10, 2) + ' 秒', d(t / 10, 2) + ' 秒', d(t / 60, 2) + ' 秒', d(t * 60, 2) + ' 秒']).slice(0, 4),
        'MIPS = 每秒百萬個指令：t = ' + N + ' × 10⁸ ÷ (' + M + ' × 10⁶) = ' + d(t, 2) + ' 秒' + (t >= 60 ? '（' + d(t / 60, 2) + ' 分鐘）' : '') + '。'];
    } },
    { t: '指令時脈計算', g: function (R) {
      var f = R.pick([20, 24, 40, 48, 50, 100]), a = R.pick([2, 4, 6]), b = R.pick([4, 8]), c = R.pick([6, 10, 12]), n = a + b + c, t = n / f;
      return ['某 CPU 時脈 ' + f + ' MHz，一道指令的提取需 ' + a + ' 個時脈、解碼需 ' + b + ' 個時脈、執行與回存需 ' + c + ' 個時脈，完成一道指令約需多少時間？',
        uniq([d(t, 4) + ' μs', d(c / f, 4) + ' μs', d(t * 2, 4) + ' μs', d(n * f / 1000, 4) + ' μs', d(t / 2, 4) + ' μs']).slice(0, 4),
        '總時脈數 = ' + a + ' + ' + b + ' + ' + c + ' = ' + n + '；一個時脈 = 1 ÷ ' + f + ' MHz = ' + d(1000 / f, 3) + ' ns；t = ' + n + ' ÷ ' + f + ' MHz ≈ ' + d(t, 4) + ' μs。'];
    } },
    ['效能', '有關微處理機的效能評估，下列敘述何者錯誤？', ['CPU 的字組長度是指一次能處理的「位址」位元數', 'MIPS 表示每秒可執行幾百萬個指令', '記憶體效能可用記憶體頻寬與存取時間評估', '時脈相同時，平均每個指令所需時脈數（CPI）越小越快'], '字組長度是 CPU 一次能處理的「資料」位元數（和資料匯流排寬度有關），不是位址位元數。']
  ]);
  function bytesStr(b) { return b >= 1048576 ? d(b / 1048576, 3) + ' MB' : b >= 1024 ? d(b / 1024, 3) + ' KB' : b + ' Bytes'; }
  addHard('mpu', 1, [
    { t: '記憶體容量（字組寬度）', g: function (R) {
      var n = R.int(10, 20), wd = R.pick([8, 16, 32, 64]), cap = Math.pow(2, n) * wd / 8;
      return ['某記憶體有 ' + n + ' 條位址線、' + wd + ' 條資料線，可儲存多少位元組（Bytes）？',
        uniq([bytesStr(cap), bytesStr(Math.pow(2, n)), bytesStr(Math.pow(2, n) * wd), bytesStr(cap * 2), bytesStr(cap / 2)]).slice(0, 4),
        '位址數 2^' + n + ' = ' + Math.pow(2, n) + ' 個，每個存 ' + wd + ' bits = ' + wd / 8 + ' Bytes → 容量 = ' + Math.pow(2, n) + ' × ' + wd / 8 + ' = ' + bytesStr(cap) + '。'];
    } },
    { t: '記憶體映對 I/O 剩餘空間', g: function (R) {
      var n = R.pick([16, 18, 20]), tot = Math.pow(2, n) / 1024, io = R.pick([4, 8, 16, 32, 64, 128, 256].filter(function (x) { return x < tot && x !== tot / 2; }));
      return ['某微處理機有 ' + n + ' 條位址線、8 條資料線，採用記憶體映對式 I/O，I/O 規劃佔用 ' + io + ' KB 位址空間，剩下可規劃給記憶體的空間為多少？',
        uniq([tot - io + ' KB', tot + ' KB', io + ' KB', tot + io + ' KB', tot / 2 + ' KB']).slice(0, 4),
        '總位址空間 = 2^' + n + ' × 1 Byte = ' + tot + ' KB；記憶體映對式 I/O 會佔用記憶體位址：' + tot + ' − ' + io + ' = ' + (tot - io) + ' KB。（獨立式 I/O 才不佔用）'];
    } },
    ['I/O', 'CPU 傳資料給較慢的 I/O 裝置，並且要和多個裝置共用匯流排，通常會在匯流排與 I/O 之間加上哪些元件？', ['栓鎖器與三態緩衝器', '多工器與解多工器', '編碼器與解碼器', '計數器與移位暫存器'], '栓鎖器把 CPU 送出的資料暫存住，等慢速裝置讀取；三態緩衝器在不使用時呈高阻抗，隔離多個裝置。']
  ]);
  addHard('mpu', 2, [
    ['語言與翻譯', '連結程式（Linker）把目的檔和函式庫組合成可執行檔，它屬於哪一類軟體？', ['公用（服務）程式', '應用程式', '作業系統核心', '文書處理程式'], '系統軟體包含作業系統、語言翻譯程式與公用程式；連結器、載入器屬於公用服務程式。'],
    ['語言與翻譯', '哪一種翻譯方式逐行翻譯並執行、不產生目的檔，所以每次執行都要重新翻譯？', ['直譯器', '編譯器', '組譯器', '連結器'], '直譯器逐行翻譯執行，不產生目的檔；編譯器、組譯器整份翻譯產生目的檔，再經連結器成為執行檔。']
  ]);

  // ======================= 數位邏輯 =======================
  addHard('dl', 0, [
    { t: '系統方塊順序', g: function (R) {
      var ok = '麥克風 → ADC → DSP → DAC → 揚聲器';
      return ['卡拉 OK 麥克風要把歌聲數位處理（加回音）後再從喇叭播出，下列方塊順序何者正確？', [ok, '麥克風 → DAC → DSP → ADC → 揚聲器', '麥克風 → DSP → ADC → DAC → 揚聲器', 'ADC → 麥克風 → DSP → 揚聲器 → DAC'],
        '聲音是類比訊號：麥克風轉成電壓 → ADC 轉成數位 → DSP 處理 → DAC 轉回類比 → 揚聲器發聲。'];
    } },
    { t: '脈波寬度與工作週期', g: function (R) {
      var f = R.pick([10, 20, 25, 40, 50, 200]), D0 = R.pick([0.2, 0.25, 0.4, 0.6, 0.75]), Tus = 1000 / f, tw = Tus * D0;
      if (Math.random() < 0.5) return ['函數波產生器輸出 ' + f + ' kHz 的脈波，示波器量得脈波寬度為 ' + d(tw, 3) + ' μs，其工作週期為？',
        [d(D0 * 100, 1) + '%', d((1 - D0) * 100, 1) + '%', d(D0 * 50, 1) + '%', d(tw * f / 100, 3) + '%'],
        'T = 1 ÷ ' + f + ' kHz = ' + d(Tus, 3) + ' μs；D = tw ÷ T = ' + d(tw, 3) + ' ÷ ' + d(Tus, 3) + ' = ' + d(D0 * 100, 1) + '%。'];
      return ['某脈波頻率 ' + f + ' kHz、工作週期 ' + d(D0 * 100, 1) + '%，其脈波寬度為？',
        [d(tw, 3) + ' μs', d(Tus - tw, 3) + ' μs', d(tw * 10, 3) + ' μs', d(tw / 10, 3) + ' μs'],
        'T = 1 ÷ ' + f + ' kHz = ' + d(Tus, 3) + ' μs；tw = D × T = ' + d(D0, 2) + ' × ' + d(Tus, 3) + ' = ' + d(tw, 3) + ' μs。'];
    } },
    { t: '類比與數位實例', g: function (R) {
      var dig = ['數字型溫度計', '電子碼錶', '日曆', 'LED 的亮與滅', '計算機上顯示的數字'], ana = ['光影的明暗變化', '聲音的大小', '電池電量的變化', '水銀溫度計的液柱高度', '指針式手錶的指針位置'], askD = Math.random() < 0.5;
      var a = shuffle(askD ? dig : ana)[0], o = shuffle(askD ? ana : dig).slice(0, 3);
      return ['下列何者屬於' + (askD ? '數位' : '類比') + '表示法的數量？', [a].concat(o), '數位量是不連續、一階一階的數值（如顯示的數字、亮滅兩種狀態）；類比量是連續變化的量（如亮度、音量、液柱高度）。'];
    } }
  ]);
  var GF = { AND: function (a, b) { return a & b; }, OR: function (a, b) { return a | b; }, NAND: function (a, b) { return 1 - (a & b); }, NOR: function (a, b) { return 1 - (a | b); }, XOR: function (a, b) { return a ^ b; }, XNOR: function (a, b) { return 1 - (a ^ b); } };
  addHard('dl', 1, [
    { t: '多輸入閘的輸出狀態數', g: function (R) {
      var n = R.int(2, 5), g = R.pick(['OR', 'AND', 'NOR', 'NAND']), v = R.pick([0, 1]), all = Math.pow(2, n);
      var one = (g === 'OR' || g === 'NAND') ? all - 1 : 1, ans = v ? one : all - one;
      return [n + ' 輸入的 ' + g + ' 閘，所有輸入組合中，輸出為「' + v + '」的有幾種？', uniq([String(ans), String(all - ans), String(all), String(n), String(ans + 1)]).slice(0, 4),
        n + ' 個輸入共 2^' + n + ' = ' + all + ' 種組合。' + { OR: 'OR 只有全 0 時輸出 0', AND: 'AND 只有全 1 時輸出 1', NOR: 'NOR 只有全 0 時輸出 1', NAND: 'NAND 只有全 1 時輸出 0' }[g] + ' → 輸出為 ' + v + ' 的有 ' + ans + ' 種。'];
    } },
    { t: 'TTL 故障判斷', g: function (R) {
      var gs = shuffle(['AND', 'OR', 'NAND', 'NOR', 'XOR']).slice(0, 4), bad = R.int(0, 3);
      function hv() { return R.pick([3.4, 3.6, 4.2, 5]); } function lv() { return R.pick([0, 0.2, 0.3]); }
      var rows = gs.map(function (g, i) {
        var a = R.int(0, 1), b = R.int(0, 1), y = GF[g](a, b); if (i === bad) y = 1 - y;
        return g + ' 閘：輸入 ' + (a ? hv() : lv()) + ' V、' + (b ? hv() : lv()) + ' V，輸出 ' + (y ? hv() : lv()) + ' V';
      });
      return ['用 TTL IC 接線後以三用電表量各閘腳位電壓如下（接線無誤），哪一個邏輯閘可能故障？\n' + rows.join('\n'), [gs[bad]].concat(gs.filter(function (_, i) { return i !== bad; })),
        'TTL 輸入 ≥ 2 V 視為 1、≤ 0.8 V 視為 0。逐一核對真值表，只有 ' + gs[bad] + ' 閘的輸出和輸入不符。'];
    } },
    { t: '萬用閘 IC 顆數', g: function (R) {
      var U = R.pick([['7400（4 個 2 輸入 NAND）', 'NAND', { NOT: 1, AND: 2, OR: 3, NOR: 4 }], ['7402（4 個 2 輸入 NOR）', 'NOR', { NOT: 1, OR: 2, AND: 3, NAND: 4 }]]);
      var tg = R.pick(Object.keys(U[2])), m = R.int(2, 6), per = U[2][tg], tot = m * per, ic = Math.ceil(tot / 4);
      return ['電路需要 ' + m + ' 個 2 輸入 ' + tg + ' 閘，但手邊只有 ' + U[0] + '，最少需要幾顆 IC？',
        uniq([ic + ' 顆', Math.ceil(m / 4) + ' 顆', tot + ' 顆', (ic + 1) + ' 顆', Math.ceil(tot / 2) + ' 顆', (ic + 2) + ' 顆', (ic + 3) + ' 顆']).slice(0, 4),
        '只用 ' + U[1] + ' 做 1 個 ' + tg + ' 要 ' + per + ' 個閘 → 共 ' + m + ' × ' + per + ' = ' + tot + ' 個閘；每顆 IC 有 4 個 → ' + tot + ' ÷ 4 無條件進位 = ' + ic + ' 顆。'];
    } },
    { t: '脈波序列經邏輯閘', g: function (R) {
      var g, A, B, f, k = 0;
      function bits() { var s = ''; for (var i = 0; i < 7; i++) s += R.int(0, 1); return s; }
      do { g = R.pick(Object.keys(GF)); A = bits(); B = bits(); f = A.split('').map(function (c, i) { return GF[g](+c, +B[i]); }).join(''); } while (uniq([f, A, B, f.replace(/./g, function (c) { return 1 - c; })]).length < 4 && ++k < 100);
      var nf = f.replace(/./g, function (c) { return 1 - c; });
      return ['輸入脈波 A = ' + A + '、B = ' + B + '（依時間順序）送入 2 輸入 ' + g + ' 閘，輸出序列為？', uniq([f, nf, A, B, f.split('').reverse().join('')]).slice(0, 4),
        '逐位元套用 ' + g + ' 的真值表：' + f + '。'];
    } },
    { t: 'XNOR 串接', g: function (R) {
      var n = R.int(3, 5), V = ['A', 'B', 'C', 'D', 'E'].slice(0, n), x = V.join(' ⊕ '), odd = n % 2 === 1;
      return ['F = ' + V.join(' ⊙ ') + '（⊙ 為 XNOR）等效於下列何者？', [odd ? x : '(' + x + ")'", odd ? '(' + x + ")'" : x, V.join(''), V.join(' + ')],
        "A ⊙ B = (A ⊕ B)'，每多串一個 ⊙ 就多反相一次。" + n + ' 個變數有 ' + (n - 1) + ' 個 ⊙，反相 ' + (n - 1) + ' 次：' + (odd ? '偶數次互相抵消 → ' + x + '。' : '奇數次 → (' + x + ")'。")];
    } }
  ]);
  addHard('dl', 2, [
    { t: '兩函數 XOR', g: function (R) {
      var a, b, x, and, or, xn, k = 0;
      function rnd() { return shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, R.int(3, 4)).sort(num); }
      do {
        a = rnd(); b = rnd(); x = []; and = []; or = []; xn = [];
        for (var m = 0; m < 8; m++) { var ia = a.indexOf(m) >= 0, ib = b.indexOf(m) >= 0; if (ia !== ib) x.push(m); else xn.push(m); if (ia && ib) and.push(m); if (ia || ib) or.push(m); }
      } while (!(and.length && x.length && xn.length && uniq([x, and, or, xn].map(String)).length === 4) && ++k < 100);
      return ['F₁(A,B,C) = ' + Sm(a) + '，F₂(A,B,C) = ' + Sm(b) + '，則 F₁ ⊕ F₂ = ？', [Sm(x), Sm(and), Sm(or), Sm(xn)],
        'XOR：兩函數一個為 1、另一個為 0 的最小項才是 1 → 取只出現在其中一邊的項：' + Sm(x) + '。（F₁F₂ 是交集、F₁ + F₂ 是聯集）'];
    } },
    { t: '求補函數', g: function (R) {
      var ms, comp, F, Fc, opts = [], k = 0;
      do {
        ms = []; for (var m = 0; m < 8; m++) if (Math.random() < 0.5) ms.push(m);
        comp = [0, 1, 2, 3, 4, 5, 6, 7].filter(function (x) { return ms.indexOf(x) < 0; });
        if (ms.length < 2 || comp.length < 2) continue;
        F = K.minSOP(3, ms); Fc = K.minSOP(3, comp);
        opts = uniq([K.sopStr(3, Fc), K.sopStr(3, F)].concat(wrongD(3, Fc, comp, []).map(function (t) { return K.sopStr(3, t); }))).slice(0, 4);
      } while (opts.length < 4 && ++k < 100);
      return ['F(A,B,C) = ' + K.sopStr(3, F) + "，其補函數 F' 的最簡積之和為？", opts,
        'F 為 1 的最小項是 ' + Sm(ms) + "，F' 就是其餘的 " + Sm(comp) + " → 化簡得 F' = " + K.sopStr(3, Fc) + '。'];
    } },
    { t: '布林定律辨識', g: function (R) {
      var L = [['A + BC = (A + B)(A + C)', '分配律'], ['A + AB = A', '吸收律'], ["(A + B)' = A'B'", '第摩根定理'], ["AB + A'C + BC = AB + A'C", '一致性定理（消去多餘項）'], ['A + (B + C) = (A + B) + C', '結合律'], ["A + A' = 1", '互補律'], ['A + A = A', '冪等律（重疊律）'], ['AB = BA', '交換律']];
      var p = shuffle(L);
      return ['布林等式「' + p[0][0] + '」符合下列哪一個定律？', [p[0][1], p[1][1], p[2][1], p[3][1]], p[0][0] + ' 是' + p[0][1] + '。'];
    } }
  ]);
  addHard('dl', 3, [
    { t: '函數等效的邏輯閘', g: function (R) {
      var vars = R.pick([['A', 'B', 2, 1], ['A', 'C', 2, 0], ['B', 'C', 1, 0]]), g = R.pick(Object.keys(GF)), ms = [];
      for (var m = 0; m < 8; m++) if (GF[g]((m >> vars[2]) & 1, (m >> vars[3]) & 1)) ms.push(m);
      var others = shuffle(Object.keys(GF).filter(function (x) { return x !== g; })).slice(0, 3);
      function lab(x) { return vars[0] + '、' + vars[1] + ' 接到 ' + x + ' 閘'; }
      return ['F(A,B,C) = ' + Sm(ms) + '，這個函數相當於哪一種接法的輸出？', [lab(g)].concat(others.map(lab)),
        '把最小項寫成真值表，會發現輸出和' + 'ABC'.replace(vars[0], '').replace(vars[1], '') + '無關，只看 ' + vars[0] + '、' + vars[1] + '：符合 ' + g + ' 的真值表。', K.figKmap(3, ms, true)];
    } },
    { t: '卡諾圖化簡（含隨意項）', g: function (R) {
      var ms, dc, best, wr, k = 0;
      do {
        var p = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        ms = p.slice(0, R.int(4, 7)).sort(num); dc = p.slice(9, 9 + R.int(2, 3)).sort(num);
        best = minSOPd(4, ms, dc); wr = wrongD(4, best, ms, dc);
      } while ((wr.length < 3 || totalLits(4, best) >= totalLits(4, K.minSOP(4, ms))) && ++k < 200);
      return ['F(A,B,C,D) = ' + Sm(ms) + ' + d(' + dc.join(', ') + ')，最簡積之和（SOP）為？', [K.sopStr(4, best)].concat(wr.slice(0, 3).map(function (t) { return K.sopStr(4, t); })),
        '隨意項 X 可當 1 也可當 0，能讓圈變大就用：F = ' + K.sopStr(4, best) + '。', figKmapD(ms, dc)];
    } },
    { t: '最簡 POS（含隨意項）', g: function (R) {
      var ms, dc, off, best, wr, k = 0;
      do {
        var p = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
        ms = p.slice(0, R.int(6, 9)).sort(num); dc = p.slice(11, 11 + R.int(2, 4)).sort(num);
        off = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].filter(function (x) { return ms.indexOf(x) < 0 && dc.indexOf(x) < 0; });
        best = minSOPd(4, off, dc); wr = uniq([posStr(4, best)].concat(wrongD(4, best, off, dc).map(function (t) { return posStr(4, t); }))).slice(0, 4);
      } while ((wr.length < 4 || best.length > 3) && ++k < 200);
      return ['F(A,B,C,D) = ' + Sm(ms) + ' + d(' + dc.join(', ') + ')，最簡和之積（POS）為？', wr,
        "圈 0（隨意項可一起圈）求 F' = " + K.sopStr(4, best) + "，再用第摩根取補：F = " + posStr(4, best) + '。', figKmapD(ms, dc)];
    } },
    { t: '情境轉布林式', g: function (R) {
      var S = [['三位室友各有一把鑰匙，任何一把都能把門打開（A、B、C = 1 表示插入鑰匙）', 'F = A + B + C'],
        ['保險箱要三位主管同時插入鑰匙才能打開（A、B、C = 1 表示插入）', 'F = ABC'],
        ['三個火災偵測器中至少兩個偵測到（= 1）才發出警報，避免誤報', 'F = AB + BC + AC'],
        ['三個開關中有奇數個被按下（= 1）時燈亮，任何一個開關切換都會改變燈的狀態', 'F = A ⊕ B ⊕ C'],
        ['三個人體感測器都沒偵測到人（皆為 0）時，輸出 F = 1 關閉冷氣', "F = A'B'C'"]];
      var p = shuffle(S);
      return ['「' + p[0][0] + '」，輸出 F 的布林式為？', [p[0][1], p[1][1], p[2][1], p[3][1]], S.map(function (x) { return x[1]; }).join('；') + '，各自對應 OR、AND、多數決、奇同位、NOR。'];
    } }
  ]);

  // ======================= 程式設計實習 =======================
  addHard('prog', 0, [
    ['工場安全', '電腦教室因電線走火起火，下列處置何者不妥？', ['立刻拿泡沫滅火器對著電腦噴', '先切斷總電源', '通報師長並疏散同學', '使用 CO₂ 或乾粉滅火器'], '泡沫滅火器含水會導電，不能用在通電中的電氣火災；應先斷電，再用 CO₂ 或乾粉。']
  ]);
  addHard('prog', 1, [
    { t: '註解與輸出', g: function (R) {
      var a = R.int(1, 9), b = R.int(1, 9), s = a + b, line = Math.random() < 0.5;
      var code = 'int a = ' + a + ', b = ' + b + ';\nprintf("A=");\n' + (line ? '// printf("%d", a);' : '/* printf("%d", a); */') + '\nprintf("%d", a + b);';
      return ['下列 C 程式片段的輸出為？\n' + code, uniq(['A=' + s, 'A=' + a + s, 'A=' + a, String(s), 'A=a+b']).slice(0, 4),
        (line ? '// 之後到行尾都是註解' : '/* */ 之間都是註解') + '，那一行不會執行。輸出「A=」再接 a + b = ' + s + ' → A=' + s + '。'];
    } },
    { t: '跳脫字元', g: function (R) {
      var C = [
        ['printf("He said \\"Hi\\"");', 'He said "Hi"', ['He said \\"Hi\\"', 'He said Hi', '編譯錯誤']],
        ['printf("C:\\\\data");', 'C:\\data', ['C:\\\\data', 'C:data', 'C:\\d ata']],
        ['printf("50%%");', '50%', ['50%%', '50', '5%']],
        ['printf("%d%%", 3 * 4);', '12%', ['12%%', '3 * 4%', '34%']],
        ["printf(\"It\\'s ok\");", "It's ok", ["It\\'s ok", 'Its ok', '編譯錯誤']]
      ], c = R.pick(C);
      return ['下列 C 敘述在螢幕上顯示的內容為？\n' + c[0], [c[1]].concat(c[2]), '\\" 印出雙引號、\\\\ 印出一個反斜線、\\\' 印出單引號；printf 的格式字串中 %% 印出一個 %。'];
    } },
    ['C 語言', '有關 C 語言，下列敘述何者錯誤？', ['C 語言不分大小寫，main() 和 MAIN() 相同', 'C 屬於高階、結構化的程式語言', 'C 原始檔的副檔名通常為 .c', 'main()、printf()、scanf() 都是函式'], 'C 語言區分大小寫，main 和 MAIN 是不同的名稱。'],
    ['C 語言', '有關 C 語言的註解，下列敘述何者錯誤？', ['/* */ 註解可以巢狀，在裡面再包一組 /* */', '// 可以寫單行註解', '註解會被編譯器忽略，不會變成機器碼', '可以用註解暫時讓某一行程式不執行'], '/* */ 不能巢狀：遇到第一個 */ 就結束，後面的 */ 會造成編譯錯誤。'],
    ['printf／scanf', '「\\f」與「%f」在 printf 中分別代表什麼？', ['\\f 是換頁字元；%f 是浮點數的格式', '\\f 是換行字元；%f 是字元的格式', '\\f 是定位（Tab）；%f 是整數的格式', '\\f 是浮點數的格式；%f 是換頁字元'], '跳脫字元：\\n 換行、\\t 定位、\\f 換頁；格式符號：%d 整數、%f 浮點數、%c 字元、%s 字串。']
  ]);
  addHard('prog', 2, [
    { t: '十六進位常數', g: function (R) {
      var v = R.int(16, 255), h = v.toString(16).toUpperCase();
      return ['執行 printf("%d", 0x' + h + '); 的輸出為？', uniq([String(v), h, '0x' + h, String(v + 16), String(v - 1)]).slice(0, 4),
        '0x 開頭是十六進位常數，%d 以十進位印出：' + h.split('').map(function (c, i, a) { return parseInt(c, 16) + ' × 16' + sup(a.length - 1 - i); }).join(' + ') + ' = ' + v + '。'];
    } }
  ]);
  addHard('prog', 3, [
    { t: 'sizeof', g: function (R) {
      var s = ['D', 'Hi', 'C++', 'Good', 'Hello'][R.int(0, 4)], t = R.pick([['char', 1], ['int', 4], ['double', 8], ['float', 4]]);
      return ['char s[] = "' + s + '";  ' + t[0] + ' x;\nprintf("%d %d", sizeof("' + s + '"), sizeof(x)); 的輸出為？（int、float 為 4 Bytes，double 為 8 Bytes）',
        uniq([(s.length + 1) + ' ' + t[1], s.length + ' ' + t[1], (s.length + 1) + ' ' + (t[1] === 1 ? 2 : t[1] / 2), s.length + ' ' + (t[1] === 8 ? 4 : 8), (s.length + 2) + ' ' + t[1]]).slice(0, 4),
        '字串常數結尾有一個 \\0：「' + s + '」佔 ' + s.length + ' + 1 = ' + (s.length + 1) + ' Bytes；' + t[0] + ' 佔 ' + t[1] + ' Byte' + (t[1] > 1 ? 's' : '') + '。'];
    } },
    { t: '字元運算', g: function (R) {
      var words = ['code', 'love', 'star', 'byte', 'chip', 'gate', 'logic', 'data'], wd = R.pick(words), mode = R.int(0, 2), k = R.int(1, 3);
      function tr(c, m, kk) { var x = c.charCodeAt(0); return String.fromCharCode(m === 0 ? x + kk : m === 1 ? 219 - x : x - 32); }
      function all(m, kk) { return wd.split('').map(function (c) { return tr(c, m, kk); }).join(''); }
      var expr = mode === 0 ? 'c = c + ' + k + ';' : mode === 1 ? 'c = 219 - c;' : 'c = c - 32;';
      var ans = all(mode, k), opts = uniq([ans, mode === 0 ? all(0, k + 1) : all(0, 1), mode === 0 ? all(0, k - 1 || 2) : all(2), mode === 1 ? all(2) : all(1), wd.split('').reverse().join('')]);
      return ['逐一讀入字元 c，執行 ' + expr + ' 後以 %c 印出。輸入「' + wd + '」時輸出為？（\'a\' 的 ASCII = 97、\'A\' = 65）', opts.filter(function (x) { return x === ans; }).concat(opts.filter(function (x) { return x !== ans; })).slice(0, 4),
        mode === 0 ? '每個字母的 ASCII 加 ' + k + '，往後移 ' + k + ' 個字母 → ' + ans + '。' : mode === 1 ? "219 = 'a' + 'z'（97 + 122），所以 a ↔ z、b ↔ y…字母頭尾對調 → " + ans + '。' : '小寫比大寫的 ASCII 大 32，減 32 變大寫 → ' + ans + '。'];
    } },
    ['printf／scanf', '「scanf("%d", &n);」中的 & 代表什麼？', ['取得變數 n 的記憶體位址，把輸入值存到那裡', '把輸入值與 n 做 AND 運算', '把輸入值轉成字元再存進 n', '表示 n 是常數'], '& 是取址運算子：scanf 需要知道變數的位址才能把讀到的值寫進去。']
  ]);

  // ======================= 簡單版新增 =======================
  addEasy('bee', 2, [
    { t: '串並聯功率比', g: function (R) {
      var n = R.int(2, 6), P = R.pick([2, 3, 5, 10, 12]);
      return [n + ' 個相同電阻串聯接到固定電壓時總功率 ' + P + ' W；改成並聯接到同一電壓，總功率為？', [P * n * n + ' W', P * n + ' W', d(P / n, 3) + ' W', d(P / n / n, 3) + ' W'],
        '串聯 nR、並聯 R/n，電阻比 n²：1；電壓相同時功率和電阻成反比 → 並聯是串聯的 ' + n * n + ' 倍 = ' + P * n * n + ' W。'];
    } }
  ]);
  addEasy('bee', 3, [
    { t: '戴維寧量測', g: function (R) {
      var Rab = R.pick([100, 200, 300, 400]), V = R.pick([6, 8, 10, 12]), RL = R.pick([50, 150]);
      return ['網路 a、b 端開路電壓 ' + V + ' V、等效電阻 ' + Rab + ' Ω，接上 ' + RL + ' Ω 負載時電流為？', [si(V / (Rab + RL), 'A'), si(V / RL, 'A'), si(V / Rab, 'A'), si(V * (Rab + RL) / (Rab * RL), 'A')],
        'I = Eth ÷ (Rth + RL) = ' + V + ' ÷ ' + (Rab + RL) + ' = ' + si(V / (Rab + RL), 'A') + '。'];
    } }
  ]);
  addEasy('beel', 0, [
    ['觸電與急救', '急救口訣「叫叫 CABD」的 D 是？', ['使用 AED 電擊去顫', '送醫', '給藥', '包紮傷口'], 'D = Defibrillation，使用 AED。'],
    ['用電安全', '浴室等潮濕場所的插座迴路應加裝哪一種保護裝置以防感電？', ['漏電斷路器', '無熔絲開關', '保險絲', '電磁開關'], '漏電斷路器偵測漏電立即跳脫；無熔絲開關、保險絲是過載與短路保護。']
  ]);
  addEasy('beel', 1, [
    ['三用電表', '指針式三用電表在量電流前，指針沒有停在左邊的 0，應如何處理？', ['用一字起子調整機械零位調整鈕', '兩測試棒短路後調整歐姆歸零鈕', '搖晃電表讓指針歸零', '更換內部電池'], '指針不在左邊 0 是機械零位偏移，調整機械零位鈕；歐姆歸零鈕只在量電阻時使用。'],
    ['三用電表', '指針式三用電表內部電池沒電時，哪一項功能不能用？', ['歐姆檔', 'DCV 檔', 'ACV 檔', 'DCmA 檔'], '量電阻要靠內部電池；電壓、電流檔由待測電路提供能量。']
  ]);
  addEasy('beel', 2, [
    { t: 'SMD 電阻', g: function (R) {
      var ab = R.pick([10, 22, 33, 47, 68]), m = R.int(1, 4), Rv = ab * Math.pow(10, m);
      return ['SMD 電阻標示「' + ab + m + '」，電阻值為？', [si(Rv, 'Ω'), ab + '' + m + ' Ω', si(Rv * 10, 'Ω'), si(Rv / 10, 'Ω')], '前兩碼有效數字、第三碼是 10 的次方：' + ab + ' × 10' + sup(m) + ' = ' + si(Rv, 'Ω') + '。'];
    } }
  ]);
  addEasy('elec', 0, [
    { t: '直流加交流', g: function (R) {
      var c = R.pick([[6, 8, 10], [3, 4, 5], [5, 12, 13], [8, 6, 10], [9, 12, 15]]);
      return ['v(t) = ' + c[0] + ' + ' + c[1] + '√2 sin(ωt) V 的有效值為？', [c[2] + ' V', (c[0] + c[1]) + ' V', c[1] + ' V', d(c[0] + c[1] * Math.SQRT2, 2) + ' V'],
        '交流部分有效值 ' + c[1] + ' V；Vrms = √(' + c[0] + '² + ' + c[1] + '²) = ' + c[2] + ' V。'];
    } }
  ]);
  addEasy('elec', 1, [
    { t: '二極體交流電阻', g: function (R) {
      var ID = R.pick([1, 2, 2.6, 5.2, 13, 26]);
      return ['二極體工作電流 ' + ID + ' mA（η = 1、VT = 26 mV），交流電阻 rd 為？', uniq([d(26 / ID, 2) + ' Ω', d(52 / ID, 2) + ' Ω', d(ID / 26 * 1000, 2) + ' Ω', d(26 / ID * 1000, 1) + ' Ω', d(26 * ID, 2) + ' Ω', d(13 / ID, 2) + ' Ω']).slice(0, 4), 'rd = ηVT ÷ ID = 26 mV ÷ ' + ID + ' mA = ' + d(26 / ID, 2) + ' Ω。'];
    } }
  ]);
  addEasy('elec', 2, [
    { t: '小信號參數', g: function (R) {
      var IC = R.pick([0.5, 1, 2, 2.6, 5.2]), beta = R.pick([50, 100, 200]), gm = IC / 26 * 1000, rpi = beta / gm * 1000;
      return ['電晶體 IC = ' + IC + ' mA、β = ' + beta + '、VT = 26 mV，gm 與 rπ 為？', ['gm = ' + d(gm, 2) + ' mS，rπ = ' + d(rpi, 1) + ' Ω', 'gm = ' + d(gm, 2) + ' mS，rπ = ' + d(rpi / beta, 1) + ' Ω', 'gm = ' + d(gm / 1000, 4) + ' mS，rπ = ' + d(rpi, 1) + ' Ω', 'gm = ' + d(gm, 2) + ' mS，rπ = ' + d(rpi * 2, 1) + ' Ω'],
        'gm = IC ÷ VT = ' + IC + ' ÷ 26 m = ' + d(gm, 2) + ' mS；rπ = β ÷ gm = ' + d(rpi, 1) + ' Ω。'];
    } }
  ]);
  addEasy('elecl', 3, [
    ['放大器類別', '工作點設在直流負載線中點、輸入整個週期都導通的放大器是？', ['A 類', 'B 類', 'AB 類', 'C 類'], 'A 類導通 360°；B 類 180°（推挽，有交越失真）；AB 類略大於 180°；C 類小於 180°。']
  ]);
  addEasy('mpu', 0, [
    { t: '效能', g: function (R) {
      var M = R.pick([10, 20, 50]), N = R.pick([60, 120, 300]);
      return ['10 億 = 10⁹。效能 ' + M + ' MIPS 的 CPU 執行 ' + N + ' 億個指令需要幾秒？', [d(N * 100 / M, 2) + ' 秒', d(N / M, 2) + ' 秒', d(N * 1000 / M, 2) + ' 秒', d(N * 10 / M, 2) + ' 秒'], 't = ' + N + ' × 10⁸ ÷ (' + M + ' × 10⁶) = ' + d(N * 100 / M, 2) + ' 秒。'];
    } }
  ]);
  addEasy('mpu', 1, [
    { t: '位址與容量', g: function (R) {
      var n = R.pick([10, 12, 14, 16]), wd = R.pick([8, 16]), cap = Math.pow(2, n) * wd / 8;
      return [n + ' 條位址線、' + wd + ' 條資料線的記憶體容量為？', [bytesStr(cap), bytesStr(Math.pow(2, n) * wd), bytesStr(cap * 2), bytesStr(cap / 4)], '2^' + n + ' × ' + wd / 8 + ' Bytes = ' + bytesStr(cap) + '。'];
    } }
  ]);
  addEasy('dl', 0, [
    { t: '脈波', g: function (R) {
      var f = R.pick([10, 20, 25, 50]), D0 = R.pick([0.2, 0.25, 0.4, 0.6]), Tus = 1000 / f;
      return ['頻率 ' + f + ' kHz、工作週期 ' + D0 * 100 + '% 的脈波，脈波寬度為？', [d(Tus * D0, 2) + ' μs', d(Tus, 2) + ' μs', d(Tus * (1 - D0), 2) + ' μs', d(Tus * D0 * 10, 2) + ' μs'], 'T = 1 ÷ ' + f + ' kHz = ' + d(Tus, 2) + ' μs；tw = D × T = ' + d(Tus * D0, 2) + ' μs。'];
    } }
  ]);
  addEasy('dl', 1, [
    { t: '邏輯閘特性', g: function (R) {
      var n = R.int(2, 4), all = Math.pow(2, n);
      return [n + ' 輸入的 OR 閘，輸出為 1 的輸入組合有幾種？', [String(all - 1), String(all), '1', String(n)], '只有全部輸入為 0 時輸出 0：2^' + n + ' − 1 = ' + (all - 1) + ' 種。'];
    } }
  ]);
  addEasy('prog', 2, [
    { t: '常數', g: function (R) {
      var v = R.pick([16, 17, 31, 32, 85, 100, 255]), h = v.toString(16).toUpperCase();
      return ['printf("%d", 0x' + h + '); 輸出為？', [String(v), h, '0x' + h, String(v * 2)], '0x' + h + ' 是十六進位 = ' + v + '。'];
    } }
  ]);
  addEasy('prog', 3, [
    ['基本型態', 'C 語言中 int 與 unsigned int 佔用的記憶體大小關係為？', ['兩者相同', 'unsigned int 較大', 'int 較大', '看存入的值而定'], '加 unsigned 只是把負數範圍挪給正數，佔用空間不變（常見都是 4 Bytes）。']
  ]);
})();
