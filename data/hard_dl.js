/* 數位邏輯設計 困難版：仿統測／歷屆一模（卡諾圖化簡、時序圖、邏輯電路、何者正確） */
(function () {
  var H = QH, d = H.dec, D = DR, T = D.text, w = D.wire, X = DR.dl, G = X.GATES, shuffle = X.shuffle;
  var V4 = ['A', 'B', 'C', 'D'];

  // ---------- 最簡 SOP（Quine–McCluskey + 最少項覆蓋） ----------
  function primes(n, ms) {
    var cur = ms.map(function (m) { return { v: m, mask: 0 }; }), P = [];
    while (cur.length) {
      var next = [], used = {}, seen = {};
      for (var i = 0; i < cur.length; i++) for (var j = i + 1; j < cur.length; j++) {
        var a = cur[i], b = cur[j], x = a.v ^ b.v;
        if (a.mask === b.mask && x && !(x & (x - 1))) {
          used[i] = used[j] = 1; var t = { v: a.v & ~x, mask: a.mask | x }, k = t.v + '/' + t.mask;
          if (!seen[k]) { seen[k] = 1; next.push(t); }
        }
      }
      cur.forEach(function (t, i) { if (!used[i]) P.push(t); });
      cur = next;
    }
    return P;
  }
  function covers(t, m) { return (m & ~t.mask) === t.v; }
  function lits(n, t) { var c = 0; for (var i = 0; i < n; i++) if (!(t.mask & (1 << i))) c++; return c; }
  function minSOP(n, ms) {
    if (!ms.length) return [];
    if (ms.length === (1 << n)) return [{ v: 0, mask: (1 << n) - 1 }];
    var P = primes(n, ms), best = null, bestL = 1e9;
    for (var k = 1; k <= P.length && !best; k++) {
      (function choose(start, sel) {
        if (sel.length === k) {
          if (ms.every(function (m) { return sel.some(function (t) { return covers(t, m); }); })) {
            var L = sel.reduce(function (s, t) { return s + lits(n, t); }, 0);
            if (L < bestL) { bestL = L; best = sel.slice(); }
          }
          return;
        }
        for (var i = start; i < P.length; i++) { sel.push(P[i]); choose(i + 1, sel); sel.pop(); }
      })(0, []);
    }
    return best;
  }
  function termStr(n, t) {
    var s = '';
    for (var i = n - 1; i >= 0; i--) if (!(t.mask & (1 << i))) s += V4[n - 1 - i] + ((t.v >> i) & 1 ? '' : "'");
    return s || '1';
  }
  function sopStr(n, terms) { return terms.length ? terms.map(function (t) { return termStr(n, t); }).join(' + ') : '0'; }
  function evalTerms(n, terms) { var out = []; for (var m = 0; m < (1 << n); m++) if (terms.some(function (t) { return covers(t, m); })) out.push(m); return out.join(','); }
  // 干擾選項：少一項、改一個變數的補數、換成別的質項
  function wrongSOPs(n, terms, ms) {
    var F = ms.join(','), out = [], seen = {}; seen[sopStr(n, terms)] = 1;
    function add(ts) { var s = sopStr(n, ts); if (!seen[s] && evalTerms(n, ts) !== F) { seen[s] = 1; out.push(s); } }
    terms.forEach(function (t, i) {
      if (terms.length > 1) add(terms.filter(function (_, j) { return j !== i; }));
      for (var b = 0; b < n; b++) if (!(t.mask & (1 << b))) { var t2 = { v: t.v ^ (1 << b), mask: t.mask }; add(terms.map(function (x, j) { return j === i ? t2 : x; })); }
      for (b = 0; b < n; b++) if (!(t.mask & (1 << b))) { var t3 = { v: t.v & ~(1 << b), mask: t.mask | (1 << b) }; add(terms.map(function (x, j) { return j === i ? t3 : x; })); }
    });
    return shuffle(out);
  }
  // 卡諾圖：行 = 前兩個變數（格雷碼），列 = 後面變數
  function figKmap(n, ms, showZero) {
    var gray = ['00', '01', '11', '10'], rows = n === 4 ? gray : ['0', '1'], c = 40, x0 = 70, y0 = 40, s = '';
    s += T(x0 - 18, y0 - 18, n === 4 ? 'CD＼AB' : 'C＼AB', 'end', 12);
    gray.forEach(function (g, j) { s += T(x0 + j * c + c / 2, y0 - 8, g, 'middle', 12); });
    rows.forEach(function (r, i) {
      s += T(x0 - 8, y0 + i * c + c / 2 + 5, r, 'end', 12);
      gray.forEach(function (g, j) {
        var m = parseInt(g + r, 2), on = ms.indexOf(m) >= 0;
        s += '<rect x="' + (x0 + j * c) + '" y="' + (y0 + i * c) + '" width="' + c + '" height="' + c + '"/>' + (on || showZero ? T(x0 + j * c + c / 2, y0 + i * c + c / 2 + 6, on ? '1' : '0', 'middle', 15) : '');
      });
    });
    return D.svg(x0 + 4 * c + 20, y0 + rows.length * c + 10, s);
  }
  // 三級串接邏輯電路：g1(D, C) → g2(·, B) → g3(·, A)
  function figChain(g1, g2, g3) {
    var a = D.gate(g1, 50, 10, 2), b = D.gate(g2, 140, 40, 2), c = D.gate(g3, 230, 70, 2), s = a.s + b.s + c.s;
    s += T(a.ins[0][0] - 6, a.ins[0][1] + 5, 'D', 'end', 14) + T(a.ins[1][0] - 6, a.ins[1][1] + 5, 'C', 'end', 14);
    s += w(a.out, [116, a.out[1]], [116, b.ins[0][1]], b.ins[0]) + w([20, b.ins[1][1]], b.ins[1]) + T(14, b.ins[1][1] + 5, 'B', 'end', 14);
    s += w(b.out, [206, b.out[1]], [206, c.ins[0][1]], c.ins[0]) + w([20, c.ins[1][1]], c.ins[1]) + T(14, c.ins[1][1] + 5, 'A', 'end', 14);
    return D.svg(340, 125, s + T(c.out[0] + 6, c.out[1] + 5, 'F', 'start', 15));
  }
  // 黑盒子：XOR(A, B) 與 盒子(C, D) 接到 AND
  function figBox() {
    var x = D.gate('XOR', 60, 10, 2), a = D.gate('AND', 170, 30, 2), s = x.s + a.s;
    s += T(x.ins[0][0] - 6, x.ins[0][1] + 5, 'A', 'end', 14) + T(x.ins[1][0] - 6, x.ins[1][1] + 5, 'B', 'end', 14);
    s += '<rect x="60" y="70" width="46" height="36" style="fill:var(--line)"/>' + T(83, 93, '?', 'middle', 16);
    s += D.line(30, 80, 60, 80) + D.line(30, 96, 60, 96) + T(24, 85, 'C', 'end', 14) + T(24, 101, 'D', 'end', 14);
    s += w(x.out, [140, x.out[1]], [140, a.ins[0][1]], a.ins[0]) + w([106, 88], [140, 88], [140, a.ins[1][1]], a.ins[1]);
    return D.svg(280, 115, s + T(a.out[0] + 6, a.out[1] + 5, 'F', 'start', 15));
  }

  addHard('dl', 0, [
    ['邏輯族', '有關 TTL 與 CMOS 的敘述，下列何者正確？', ['CMOS 工作電壓 3～18 V，VSS = 0 V 時輸入 0.3 VDD 以下視為 0、0.7 VDD 以上視為 1', 'TTL 的封裝密度比 CMOS 高', 'TTL 的消耗功率比 CMOS 低', 'TTL 工作電壓 5 V，輸入 0.4 V 以下視為 0、2.4 V 以上視為 1'], 'TTL 輸入判定是 VIL = 0.8 V、VIH = 2.0 V（0.4、2.4 V 是輸出規格）；CMOS 密度高、耗電小。'],
    ['類比與數位', '關於數位與類比系統，下列何者錯誤？', ['類比系統訊號連續，抗雜訊能力強，比數位系統更能準確呈現細節', '對手機說話時，聲波經感測器轉成電壓，再經 ADC 轉為數位訊號', '數位系統取樣、量化仍可能失真，但容易傳輸與保存', '類比 IC 是感測器與數位系統之間的橋樑'], '類比訊號容易受雜訊干擾；抗雜訊能力強是數位系統的優點。'],
    { t: '雜訊邊限判斷', g: function (R) {
      var c = R.pick([['74 系列 TTL', 2.4, 2.0, 0.8, 0.4], ['74LS 系列', 2.7, 2.0, 0.8, 0.5], ['CMOS（VDD = 5 V）', 4.9, 3.5, 1.5, 0.1]]);
      var NH = c[1] - c[2], NL = c[3] - c[4];
      return [c[0] + '：VOH(min) = ' + c[1] + ' V、VIH(min) = ' + c[2] + ' V、VIL(max) = ' + c[3] + ' V、VOL(max) = ' + c[4] + ' V。下列何者正確？',
        ['NMH = ' + d(NH, 2) + ' V、NML = ' + d(NL, 2) + ' V', 'NMH = ' + d(c[1] - c[3], 2) + ' V、NML = ' + d(c[2] - c[4], 2) + ' V', 'NMH = ' + d(NL, 2) + ' V、NML = ' + d(NH, 2) + ' V', 'NMH = ' + d(c[1] - c[4], 2) + ' V、NML = ' + d(c[2] - c[3], 2) + ' V'],
        'NMH = VOH(min) − VIH(min) = ' + d(NH, 2) + ' V；NML = VIL(max) − VOL(max) = ' + d(NL, 2) + ' V。'];
    } },
    { t: 'CMOS 功率比較', g: function (R) {
      var v1 = R.pick([3.3, 5]), v2 = R.pick([1.8, 2.5]), f1 = R.pick([1, 2]), f2 = R.pick([2, 4]);
      var r = (v2 * v2 * f2) / (v1 * v1 * f1);
      return ['同一 CMOS 電路由 ' + v1 + ' V、' + f1 + ' MHz 改成 ' + v2 + ' V、' + f2 + ' MHz 操作，動態功率變為原來的多少倍？',
        [d(r, 3) + ' 倍', d((v2 * f2) / (v1 * f1), 3) + ' 倍', d((v2 * v2 * f1) / (v1 * v1 * f2), 3) + ' 倍', d(f2 / f1, 3) + ' 倍'],
        'PD = C·VDD²·f → (' + v2 + '/' + v1 + ')² × (' + f2 + '/' + f1 + ') = ' + d(r, 3) + ' 倍。PD 與 f 成正比、與 VDD² 成正比。'];
    } }
  ]);

  addHard('dl', 1, [
    { t: '三輸入時序圖', g: function (R) {
      var combos = shuffle([0, 1, 2, 3, 4, 5, 6, 7]).concat(shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, 2));
      var names = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'], g = R.pick(names);
      var bit = function (m, k) { return (m >> k) & 1; };
      var A = combos.map(function (m) { return bit(m, 2); }), B = combos.map(function (m) { return bit(m, 1); }), C = combos.map(function (m) { return bit(m, 0); });
      var Y = combos.map(function (m) { return G[g]([bit(m, 2), bit(m, 1), bit(m, 0)]); });
      return ['如圖所示的時序圖，A、B、C 為輸入，Y 為某個三輸入邏輯閘的輸出，此邏輯閘為？', ['三輸入 ' + g].concat(shuffle(names.filter(function (x) { return x !== g; })).slice(0, 3).map(function (x) { return '三輸入 ' + x; })),
        '逐格對照真值：' + combos.slice(0, 5).map(function (m, i) { return '' + A[i] + B[i] + C[i] + ' 時 Y = ' + Y[i]; }).join('、') + '…，符合 ' + g + '。',
        D.timing([{ n: 'A', v: A }, { n: 'B', v: B }, { n: 'C', v: C }, { n: 'Y', v: Y }], 24)];
    } },
    { t: '邏輯閘機率情境', g: function (R) {
      var n = R.pick([2, 3, 4]), win = R.pick([['NAND', 0], ['NOR', 1], ['AND', 1], ['OR', 0]]), k = Math.pow(2, n);
      return ['香腸攤的遊戲機內部是 ' + n + ' 輸入 ' + win[0] + ' 閘，按下按鈕後各輸入隨機為 0 或 1，輸出為 ' + win[1] + ' 時客人贏得香腸。客人贏的機率為多少？',
        [d(100 / k, 2) + '%', d(100 - 100 / k, 2) + '%', d(100 / n, 2) + '%', '50%'],
        win[0] + ' 輸出為 ' + win[1] + ' 只有「全部輸入為 ' + (win[0] === 'NAND' || win[0] === 'AND' ? 1 : 0) + '」一種情況，共 2^' + n + ' = ' + k + ' 種 → 1/' + k + ' = ' + d(100 / k, 2) + '%。'];
    } },
    { t: '黑盒子推閘', g: function (R) {
      var cands = ['NAND', 'NOR', 'OR', 'XNOR'], g, rows, tries = 0;
      do {
        g = R.pick(cands); var pairs = shuffle([[0, 0], [0, 1], [1, 0], [1, 1]]).slice(0, 2);
        rows = pairs.map(function (p) { return p.concat([G[g](p)]); });
        var match = cands.filter(function (x) { return rows.every(function (r) { return G[x]([r[0], r[1]]) === r[2]; }); });
      } while (match.length !== 1 && ++tries < 100);
      var ab = [[0, 1], [1, 0]];
      return ['如圖所示，A、B 經 XOR 閘、C、D 經灰色盒子內的某邏輯閘，兩者再接到 AND 閘。已知兩組量測：' + rows.map(function (r, i) { return 'ABCD = ' + ab[i].join('') + r[0] + r[1] + ' 時 F = ' + r[2]; }).join('；') + '。盒子內最可能是哪一種閘？',
        [g].concat(cands.filter(function (x) { return x !== g; })),
        'AB = 01 或 10 時 XOR = 1，AND 的輸出就等於盒子的輸出：' + rows.map(function (r) { return r[0] + '' + r[1] + ' → ' + r[2]; }).join('、') + '；四個選項中只有 ' + g + ' 同時符合。',
        figBox()];
    } },
    { t: '串接電路求值', g: function (R) {
      var gs = ['AND', 'OR', 'NAND', 'NOR'], g1 = R.pick(gs), g2 = R.pick(gs), g3 = R.pick(gs);
      var f = function (m) { var A = (m >> 3) & 1, B = (m >> 2) & 1, C = (m >> 1) & 1, Dd = m & 1; return G[g3]([G[g2]([G[g1]([Dd, C]), B]), A]); };
      var ones = [], zeros = []; for (var m = 0; m < 16; m++) (f(m) ? ones : zeros).push(m);
      var want = ones.length && zeros.length >= 3 ? 1 : 0, A1 = want ? ones : zeros, B1 = want ? zeros : ones;
      if (B1.length < 3) { want = 1 - want; A1 = want ? ones : zeros; B1 = want ? zeros : ones; }
      var b4 = function (m) { return ('000' + m.toString(2)).slice(-4); };
      var ans = R.pick(A1);
      return ['如圖所示的邏輯電路，下列哪一組輸入（ABCD）會使 F = ' + want + '？', [b4(ans)].concat(shuffle(B1).slice(0, 3).map(b4)),
        '由內往外算：先 ' + g1 + '(D, C)、再 ' + g2 + '(·, B)、最後 ' + g3 + '(·, A)。代入 ABCD = ' + b4(ans) + '：' + g1 + ' → ' + G[g1]([ans & 1, (ans >> 1) & 1]) + '，' + g2 + ' → ' + G[g2]([G[g1]([ans & 1, (ans >> 1) & 1]), (ans >> 2) & 1]) + '，F = ' + want + '。',
        figChain(g1, g2, g3)];
    } }
  ]);

  addHard('dl', 2, [
    ['基本定理', '布林代數基本定理的運用，下列何者正確？', ["A + A' = 1；A·A' = 0", "A'' = 1", 'A + AB = A；A(A + B) = B', "(A + B)' = A' + B'；(AB)' = A'·B'"], "補數定理 A + A' = 1、A·A' = 0；自補 A'' = A；吸收律 A(A + B) = A；第摩根是 (A + B)' = A'B'、(AB)' = A' + B'。"],
    ['第摩根定理', "以第摩根定理化簡 F = (X' + (YZ)')'，下列何者正確？", ['XYZ', "XY'Z'", "X'YZ", "X' + Y + Z"], "外層斷線變號：F = (X')'·((YZ)')' = X·YZ = XYZ。"],
    ['布林化簡', "化簡 F = A + (A'B' + AB')'，下列何者正確？", ['A + B', "(AB)'", 'AB', 'B'], "A'B' + AB' = B'(A' + A) = B'；(B')' = B；F = A + B。"],
    ['布林化簡', "將函數 CA' + AB + CB' 化為最簡式，下列何者正確？", ["C + AB", "AB + A'C + B'C", 'A + BC', "C + (AB)'"], "CA' + CB' = C(A' + B') = C(AB)'；F = AB + C(AB)' = AB + C（X + X'Y = X + Y）。"],
    { t: '布林式化簡（計算）', g: function (R) {
      var c = R.pick([
        ["A + A'B + AB'C", 'A + B', ['A + BC', "A + B'", 'AB']],
        ["(A + B)(A' + C)(B + C)", "(A + B)(A' + C)", ["AB + A'C", '(A + B)C', 'A + C']],
        ["AB + AB'C + A'BC", 'AB + AC + BC', ['AB + C', "AB + A'C", 'A + BC']],
        ["A'B'C + A'BC + AB'C + ABC", 'C', ['A + C', "A'C", 'BC']],
        ["(AB' + A'B)' + AB'", "A + B'", ["A'B + AB'", 'AB', 'A + B']]
      ]);
      return [c[0] + ' 化簡後為？', [c[1]].concat(c[2]), '可用吸收律、共識定理、X + X\'Y = X + Y，或代 0／1 比對真值。正解：' + c[1] + '。'];
    } }
  ]);

  addHard('dl', 3, [
    { t: '卡諾圖化簡（三變數）', g: function (R) {
      var ms, terms, tries = 0;
      do { ms = shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, R.int(3, 5)).sort(function (a, b) { return a - b; }); terms = minSOP(3, ms); } while ((terms.length < 2) && ++tries < 50);
      var ans = sopStr(3, terms), wrong = wrongSOPs(3, terms, ms).slice(0, 3);
      return ['F(A, B, C) 的卡諾圖如圖所示（空格為 0），化簡成最簡 SOP 為何？', [ans].concat(wrong),
        '圈法：' + terms.map(function (t) { return termStr(3, t) + '（圈 ' + Math.pow(2, 3 - lits(3, t)) + ' 格）'; }).join('、') + '；F = Σm(' + ms.join(', ') + ') = ' + ans + '。',
        figKmap(3, ms, true)];
    } },
    { t: '卡諾圖化簡（四變數）', g: function (R) {
      var ms, terms, tries = 0;
      do { ms = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]).slice(0, R.int(6, 10)).sort(function (a, b) { return a - b; }); terms = minSOP(4, ms); } while ((terms.length < 2 || terms.length > 4) && ++tries < 80);
      var zeros = []; for (var m = 0; m < 16; m++) if (ms.indexOf(m) < 0) zeros.push(m);
      var usePi = Math.random() < 0.5, ans = sopStr(4, terms), wrong = wrongSOPs(4, terms, ms).slice(0, 3);
      return [(usePi ? 'F(A, B, C, D) = ΠM(' + zeros.join(', ') + ')' : 'F(A, B, C, D) = Σm(' + ms.join(', ') + ')') + '，最簡 SOP 為何？（卡諾圖如圖）', [ans].concat(wrong),
        (usePi ? 'ΠM 的編號是 0 的位置，其餘 Σm(' + ms.join(', ') + ') 為 1。' : '') + '圈大圈：' + terms.map(function (t) { return termStr(4, t); }).join('、') + ' → F = ' + ans + '。',
        figKmap(4, ms, true)];
    } },
    { t: '真值表判斷函數', g: function (R) {
      var pick = R.pick([['A ⊕ B ⊕ C', [1, 2, 4, 7]], ['A ⊙ B ⊕ C', [0, 3, 5, 6]]]);
      var other = pick[0] === 'A ⊕ B ⊕ C' ? 'A ⊙ B ⊕ C' : 'A ⊕ B ⊕ C';
      return ['F(A, B, C) 的卡諾圖如圖所示，此函數可化簡為？', [pick[0], other, "A'B'C + AB'C' + A'BC' + ABC 已無法再用 XOR 表示", 'A + B + C'],
        '1 的位置呈棋盤狀，相鄰格都不能圈 → 是 XOR／XNOR 型。Σm(' + pick[1].join(', ') + ') ' + (pick[0] === 'A ⊕ B ⊕ C' ? '是「奇數個 1」→ A ⊕ B ⊕ C。' : '是「偶數個 1」→ A ⊙ B ⊕ C（= (A ⊕ B ⊕ C)\'）。'),
        figKmap(3, pick[1], true)];
    } }
  ]);
  // 給 hard_more.js 用
  DR.dlh = { primes: primes, minSOP: minSOP, termStr: termStr, sopStr: sopStr, wrongSOPs: wrongSOPs, figKmap: figKmap };
})();
