/* 數位邏輯設計（專二）：一模範圍 第一～四單元（依一模全科筆記） */
(function () {
  var H = QH, d = H.dec;
  function b(x) { return x ? 1 : 0; }

  // 邏輯閘
  var GATES = {
    AND: function (v) { return b(v.every(function (x) { return x; })); },
    OR: function (v) { return b(v.some(function (x) { return x; })); },
    NAND: function (v) { return 1 - GATES.AND(v); },
    NOR: function (v) { return 1 - GATES.OR(v); },
    XOR: function (v) { return v.reduce(function (s, x) { return s ^ x; }, 0); },
    XNOR: function (v) { return 1 - GATES.XOR(v); }
  };
  var DUAL = { AND: 'OR', OR: 'AND', NAND: 'NOR', NOR: 'NAND', XOR: 'XNOR', XNOR: 'XOR' };

  // 三變數布林式（m = 4A + 2B + C）
  var EXPR = [
    ["A'B + C", function (a, b_, c) { return (!a && b_) || c; }],
    ["AB + A'C", function (a, b_, c) { return (a && b_) || (!a && c); }],
    ["(A + B)C'", function (a, b_, c) { return (a || b_) && !c; }],
    ['A ⊕ B ⊕ C', function (a, b_, c) { return a ^ b_ ^ c; }],
    ["(AB)'C", function (a, b_, c) { return !(a && b_) && c; }],
    ["(A + B')'C", function (a, b_, c) { return !(a || !b_) && c; }],
    ["AB'C + A'BC'", function (a, b_, c) { return (a && !b_ && c) || (!a && b_ && !c); }],
    ["(A + C)(B + C')", function (a, b_, c) { return (a || c) && (b_ || !c); }]
  ];
  // 化簡結果唯一的最簡 SOP
  var SIMP = [
    ['A', function (a) { return a; }], ["B'", function (a, b_) { return !b_; }], ['C', function (a, b_, c) { return c; }],
    ['AB', function (a, b_) { return a && b_; }], ["A'C", function (a, b_, c) { return !a && c; }], ["BC'", function (a, b_, c) { return b_ && !c; }],
    ["AB'", function (a, b_) { return a && !b_; }], ["A'B'", function (a, b_) { return !a && !b_; }],
    ['A + BC', function (a, b_, c) { return a || (b_ && c); }], ["AB + A'C", function (a, b_, c) { return (a && b_) || (!a && c); }],
    ["A'B' + AC", function (a, b_, c) { return (!a && !b_) || (a && c); }], ["B + A'C'", function (a, b_, c) { return b_ || (!a && !c); }],
    ["AB' + BC", function (a, b_, c) { return (a && !b_) || (b_ && c); }], ['A + B', function (a, b_) { return a || b_; }], ["B' + C", function (a, b_, c) { return !b_ || c; }]
  ];
  function mins(f) { var out = []; for (var m = 0; m < 8; m++) if (f((m >> 2) & 1, (m >> 1) & 1, m & 1)) out.push(m); return out; }
  function bits3(m) { return ('00' + m.toString(2)).slice(-3); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  QUIZ_DATA.push({
    id: 'dl', name: '數位邏輯設計', desc: '專二・第一～四單元',
    units: [
      {
        name: '數位邏輯基本概念',
        qs: [
          ['類比與數位', '下列何者「不是」數位系統的優點？', ['可以直接處理真實世界的連續信號', '抗雜訊能力強', '容易儲存與處理', '可用 IC 大量製造'], '真實世界（聲音、溫度）是類比，數位系統需要 ADC、DAC 轉換。'],
          ['類比與數位', '為什麼數位時代仍然需要 ADC 與 DAC？', ['真實世界的信號是類比的', '數位電路無法運算', 'IC 無法製造', '數位信號容易受雜訊干擾'], '聲音、溫度等是連續的類比信號，要轉換才能給數位系統處理。'],
          ['脈波', '工作週期 50% 的脈波稱為？', ['對稱方波', '非對稱波形', '三角波', '鋸齒波'], 'D% = 50% 為對稱方波；不是 50% 為非對稱波形。'],
          ['脈波', '脈波寬度 tH 是在振幅的哪個位置量測？', ['50%', '10%', '90%', '100%'], '脈波寬度量 50% 振幅處；上升時間 10% → 90%。'],
          ['邏輯族', 'TTL 與 CMOS 相比，下列何者正確？', ['CMOS 耗電小、雜訊邊限大、電源範圍寬', 'TTL 耗電較小', 'CMOS 只能用 5 V 電源', 'TTL 的封裝密度較高'], 'TTL（74 系列）5 V、速度快、耗電大；CMOS（40／45、74HC）耗電小、密度高、雜訊邊限大、3～18 V。'],
          ['邏輯族', '標準 TTL（74 系列）的電源電壓為？', ['5 V', '3～18 V', '12 V', '1.5 V'], 'TTL 電源 5 V；CMOS 3～18 V。'],
          ['邏輯族', '74HC 系列屬於哪一種邏輯族？', ['CMOS', 'TTL', 'ECL', 'RTL'], 'CMOS：40／45、74HC 系列。'],
          { t: '脈波', g: function (R) {
            var T = R.pick([1, 2, 4, 5, 10]), D = R.pick([10, 20, 25, 40, 50, 60, 75, 80]), tH = T * D / 100, unit = R.pick(['ms', 'μs']);
            return ['某脈波週期 ' + T + ' ' + unit + '、脈波寬度 ' + d(tH, 3) + ' ' + unit + '，工作週期為多少？是否為對稱方波？', [D + '%，' + (D === 50 ? '是對稱方波' : '非對稱波形'), (100 - D) + '%，' + (100 - D === 50 ? '是對稱方波' : '非對稱波形'), D + '%，' + (D === 50 ? '非對稱波形' : '是對稱方波'), d(T / tH, 2) + '%，非對稱波形'],
              'D% = tH ÷ T × 100% = ' + d(tH, 3) + ' ÷ ' + T + ' × 100% = ' + D + '%。'];
          } },
          { t: '雜訊邊限', g: function (R) {
            var VOH = R.pick([2.4, 2.7, 3.4, 4.4, 4.9]), VIH = R.pick([2, 3.5]), VIL = R.pick([0.8, 1.5]), VOL = R.pick([0.1, 0.4, 0.5]);
            if (VOH <= VIH) VOH = VIH + 0.9; if (VIL <= VOL) VIL = VOL + 0.6;
            var NMH = VOH - VIH, NML = VIL - VOL;
            return ['某邏輯族 VOH(min) = ' + d(VOH, 1) + ' V、VIH(min) = ' + VIH + ' V、VIL(max) = ' + d(VIL, 1) + ' V、VOL(max) = ' + VOL + ' V，NMH 與 NML 為？', ['NMH = ' + d(NMH, 2) + ' V、NML = ' + d(NML, 2) + ' V', 'NMH = ' + d(NML, 2) + ' V、NML = ' + d(NMH, 2) + ' V', 'NMH = ' + d(VOH - VIL, 2) + ' V、NML = ' + d(VIH - VOL, 2) + ' V', 'NMH = ' + d(VOH - VOL, 2) + ' V、NML = ' + d(VIH - VIL, 2) + ' V'],
              'NMH = VOH(min) − VIH(min) = ' + d(NMH, 2) + ' V；NML = VIL(max) − VOL(max) = ' + d(NML, 2) + ' V。'];
          } },
          { t: 'CMOS 功率', g: function (R) {
            var kv = R.pick([0.5, 2, 1.5]), kf = R.pick([2, 3, 4, 0.5]), r = kv * kv * kf;
            return ['CMOS 電路電源電壓變為原來的 ' + kv + ' 倍、切換頻率變為原來的 ' + kf + ' 倍（負載電容不變），動態功率變為原來的幾倍？', [d(r, 3) + ' 倍', d(kv * kf, 3) + ' 倍', d(kv * kv / kf, 3) + ' 倍', d(kv * kf * kf, 3) + ' 倍'],
              'P = C·VDD²·f → ' + kv + '² × ' + kf + ' = ' + d(r, 3) + ' 倍。電壓影響是平方。'];
          } },
          { t: 'CMOS 功率', g: function (R) {
            var C = R.pick([10, 20, 50, 100]), V = R.pick([3, 5, 10]), f = R.pick([1, 2, 5, 10]), P = C * 1e-12 * V * V * f * 1e6;
            return ['CMOS 負載電容 ' + C + ' pF、VDD = ' + V + ' V、切換頻率 ' + f + ' MHz，動態功率為多少？', [H.si(P, 'W'), H.si(P / V, 'W'), H.si(P * 1000, 'W'), H.si(P / f, 'W')],
              'P = C·VDD²·f = ' + C + 'p × ' + V + '² × ' + f + 'M = ' + H.si(P, 'W') + '。'];
          } },
          { t: '積體電路分類', g: function (R) {
            var c = R.pick([[R.int(2, 11), 'SSI'], [R.int(12, 99), 'MSI'], [R.int(100, 999), 'LSI'], [R.int(1000, 50000), 'VLSI']]);
            return ['IC 內含 ' + c[0] + ' 個邏輯閘，屬於？', [c[1]].concat(['SSI', 'MSI', 'LSI', 'VLSI', 'ULSI'].filter(function (x) { return x !== c[1]; }).slice(0, 3)),
              'SSI < 12、MSI 12～99、LSI 100～999、VLSI 1000 以上、ULSI 10⁵ 以上。'];
          } }
        ]
      },
      {
        name: '基本邏輯閘',
        qs: [
          ['邏輯閘特性', '「輸入有 0，輸出就是 1」的是哪一種閘？', ['NAND', 'NOR', 'AND', 'XNOR'], 'NAND：有 0 就 1（全 1 才 0）；NOR：有 1 就 0（全 0 才 1）。'],
          ['邏輯閘特性', '「輸入全為 0 時輸出才是 1」的是哪一種閘？', ['NOR', 'NAND', 'OR', 'XOR'], 'NOR：全 0 才 1。'],
          ['邏輯閘特性', '可以當 1 位元加法「和」的閘是？', ['XOR', 'AND', 'OR', 'NAND'], 'XOR 是 1 位元加法的和（半加器）；AND 是進位。'],
          ['邏輯閘特性', '同位元產生／檢查器、比較器常用哪一類閘？', ['XOR、XNOR', 'AND、OR', 'NAND、NOR', 'NOT'], 'XOR、XNOR 可做同位元產生／檢查器、比較器、半加器。'],
          ['特殊接法', 'XOR 閘的一個輸入接 1（高電位），另一輸入為 A，輸出為？', ["A'（反相器）", 'A（緩衝器）', '0', '1'], 'XOR 一腳接 1 → 反相器；接 0 → 緩衝器。'],
          ['特殊接法', 'XNOR 閘的一個輸入接 VCC（1），輸出為？', ['A（緩衝器）', "A'（反相器）", '0', '1'], 'XNOR 一腳接 1 → 緩衝器；接 0 → 反相器。'],
          ['特殊接法', 'NAND 閘兩個輸入接在一起，功能相當於？', ['反相器', '緩衝器', 'AND 閘', 'OR 閘'], 'NAND、NOR 兩腳接一起 → 反相器；AND、OR 兩腳接一起 → 緩衝器。'],
          ['萬用閘', '只用 NAND 閘組成 OR 閘，至少需要幾個？', ['3 個', '2 個', '1 個', '4 個'], 'NAND 做 AND 要 2 個、做 OR 要 3 個；NOR 做 OR 要 2 個、做 AND 要 3 個。'],
          ['萬用閘', '只用 NOR 閘組成 AND 閘，至少需要幾個？', ['3 個', '2 個', '1 個', '4 個'], 'NOR 做 OR 要 2 個、做 AND 要 3 個。'],
          ['萬用閘', '下列哪一組是萬用閘？', ['NAND、NOR', 'AND、OR', 'XOR、XNOR', 'NOT、緩衝器'], 'NAND、NOR 是萬用閘，可以組出所有邏輯閘。'],
          ['萬用閘', '下列哪一種閘「不」適用結合律？', ['NAND', 'AND', 'OR', 'XOR'], 'NAND、NOR 不適用結合律，例：((AB)\'C)\' ≠ (A(BC)\')\'。'],
          ['二極體邏輯', '二極體陽極接在一起、經電阻接 VCC，輸入接在陰極，構成什麼閘？', ['AND', 'OR', 'NAND', 'NOR'], '陽極接一起經電阻接 VCC → AND；陰極接一起經電阻接地 → OR。'],
          ['二極體邏輯', '二極體陰極接在一起、經電阻接地，輸入接在陽極，構成什麼閘？', ['OR', 'AND', 'NOR', 'XOR'], '任一輸入為高，二極體導通使輸出為高 → OR。'],
          { t: '邏輯閘特性', g: function (R) {
            var n = R.pick([2, 3]), v = []; for (var i = 0; i < n; i++) v.push(R.int(0, 1));
            var names = Object.keys(GATES), one = names.filter(function (g) { return GATES[g](v) === 1; }), zero = names.filter(function (g) { return GATES[g](v) === 0; });
            var ans = R.pick(one);
            return [n + ' 輸入邏輯閘，輸入為 ' + v.join('、') + ' 時，下列哪一種閘的輸出為 1？', [ans].concat(shuffle(zero).slice(0, 3)),
              '輸入 ' + v.join('') + '：' + names.map(function (g) { return g + ' = ' + GATES[g](v); }).join('、') + '。'];
          } },
          { t: '邏輯閘特性', g: function (R) {
            var n = R.pick([2, 3]), v = []; for (var i = 0; i < n; i++) v.push(R.int(0, 1));
            var names = Object.keys(GATES), one = names.filter(function (g) { return GATES[g](v) === 1; }), zero = names.filter(function (g) { return GATES[g](v) === 0; });
            var ans = R.pick(zero);
            return [n + ' 輸入邏輯閘，輸入為 ' + v.join('、') + ' 時，下列哪一種閘的輸出為 0？', [ans].concat(shuffle(one).slice(0, 3)),
              '輸入 ' + v.join('') + '：' + names.map(function (g) { return g + ' = ' + GATES[g](v); }).join('、') + '。'];
          } },
          { t: '正負邏輯', g: function (R) {
            var g = R.pick(Object.keys(DUAL));
            return ['正邏輯的 ' + g + ' 閘，以負邏輯來看相當於什麼閘？', [DUAL[g]].concat(Object.keys(GATES).filter(function (x) { return x !== DUAL[g] && x !== g; }).slice(0, 2), g),
              '正邏輯換成負邏輯：AND ⇔ OR、NAND ⇔ NOR、XOR ⇔ XNOR。'];
          } },
          { t: '邏輯閘機率', g: function (R) {
            var n = R.pick([2, 3, 4]), g = R.pick([['NAND', 0], ['NOR', 1], ['AND', 1], ['OR', 0]]), k = Math.pow(2, n);
            return [n + ' 輸入 ' + g[0] + ' 閘，輸入任意組合時，輸出為 ' + g[1] + ' 的機率為多少？', ['1/' + k, (k - 1) + '/' + k, '1/' + n, '1/2'],
              g[0] + ' 輸出為 ' + g[1] + ' 只有「全部輸入為 ' + (g[0] === 'NAND' || g[0] === 'AND' ? '1' : '0') + '」一種組合，共 2^' + n + ' = ' + k + ' 種 → 1/' + k + '。'];
          } }
        ]
      },
      {
        name: '布林代數及第摩根定理',
        qs: [
          ['基本定理', 'A + 1 = ？', ['1', 'A', '0', "A'"], 'A + 1 = 1；A·0 = 0；A + 0 = A；A·1 = A。'],
          ['基本定理', "A·A' = ？", ['0', '1', 'A', "A'"], "補數定理：A + A' = 1；A·A' = 0。"],
          ['基本定理', 'A + A = ？', ['A', '2A', '1', '0'], '自身定理：A + A = A；A·A = A。'],
          ['吸收律', 'A + AB = ？', ['A', 'AB', 'B', 'A + B'], '吸收律：A + AB = A(1 + B) = A。'],
          ['吸收律', "A + A'B = ？", ['A + B', 'A', 'B', "A'B"], "A + A'B = (A + A')(A + B) = A + B。"],
          ['吸收律', 'A(A + B) = ？', ['A', 'AB', 'A + B', 'B'], '吸收律：A(A + B) = A。'],
          ['基本定理', 'A + BC = ？', ['(A + B)(A + C)', 'AB + AC', '(A + B)C', 'A(B + C)'], '布林代數特有的分配律：A + BC = (A + B)(A + C)。'],
          ['第摩根定理', '(A + B)\' = ？', ["A'·B'", "A' + B'", 'AB', "(AB)'"], "第摩根：(A + B)' = A'B'；(AB)' = A' + B'。口訣「斷線變號」。"],
          ['第摩根定理', "(AB)' = ？", ["A' + B'", "A'·B'", 'A + B', "(A + B)'"], "(AB)' = A' + B'。"],
          ['第摩根定理', "(A'B)' = ？", ["A + B'", "A' + B", "AB'", "A'B'"], "斷線變號：(A'B)' = (A')' + B' = A + B'。"],
          ['第摩根定理', "((A + B)'C)' = ？", ["A + B + C'", "A'B' + C'", "(A + B)C'", "A'B'C'"], "外層：((A + B)')' + C' = A + B + C'。多層橫線要一層一層拆。"],
          ['XOR 表示式', 'A ⊕ B 等於下列何者？', ["A'B + AB'", "AB + A'B'", "A'B' + AB'", 'AB + A + B'], "XOR：A ⊕ B = A'B + AB' = (A + B)(A' + B')；XNOR：AB + A'B'。"],
          ['XOR 表示式', 'XNOR（A ⊕ B）\' 等於？', ["AB + A'B'", "A'B + AB'", "(A + B)(A' + B')", "A' + B'"], "XNOR = AB + A'B'（兩輸入相同為 1）。"],
          ['對偶式', "A + A'B 的對偶式為？", ["A(A' + B)", "A'(A + B')", "A + AB'", "A'·A + B"], '對偶式：AND ↔ OR、0 ↔ 1 互換，變數不取補數。'],
          ['對偶式', 'A·1 = A 的對偶式為？', ['A + 0 = A', 'A + 1 = A', "A'·0 = A'", 'A·0 = 0'], '· ↔ +、1 ↔ 0：A + 0 = A。'],
          { t: '布林式求值', g: function (R) {
            var e = R.pick(EXPR), ms = mins(e[1]), zeros = [], ones = ms;
            for (var m = 0; m < 8; m++) if (ones.indexOf(m) < 0) zeros.push(m);
            var want = ones.length >= 1 && zeros.length >= 3 ? (zeros.length >= 1 && ones.length >= 3 && Math.random() < 0.4 ? 0 : 1) : 0;
            var A = want ? ones : zeros, B = want ? zeros : ones;
            var ans = R.pick(A), others = shuffle(B).slice(0, 3);
            return ['F = ' + e[0] + '，下列哪一組輸入 ABC 會使 F = ' + want + '？', [bits3(ans)].concat(others.map(bits3)),
              'F = 1 的組合（ABC）：' + ones.map(bits3).join('、') + '。代入 ' + bits3(ans) + '：A = ' + bits3(ans)[0] + '、B = ' + bits3(ans)[1] + '、C = ' + bits3(ans)[2] + ' → F = ' + want + '。'];
          } }
        ]
      },
      {
        name: '布林代數化簡',
        qs: [
          ['標準式', '最小項（SOP）Σm 是取真值表中輸出為多少的組合？', ['1', '0', '隨意項', '全部'], 'Σm 取輸出為 1 的組合；ΠM 取輸出為 0 的組合。'],
          ['標準式', "把 XY 展開成三變數（X、Y、Z）標準積之和，結果為？", ["XYZ + XYZ'", 'XYZ', "XY + Z", "XYZ'"], "缺哪個變數就乘 (Z + Z')：XY = XYZ + XYZ'。"],
          ['卡諾圖', '卡諾圖的變數排列順序為？', ['00、01、11、10', '00、01、10、11', '00、10、01、11', '11、10、01、00'], '用格雷碼排列，相鄰兩格只差一個位元。'],
          ['卡諾圖', '卡諾圖每一圈內的格數必須是？', ['2 的次方（1、2、4、8）', '偶數即可', '3 的倍數', '任意數'], '每圈個數必須是 2 的次方，越大越好、圈數越少越好。'],
          ['卡諾圖', '關於卡諾圖的隨意項（don\'t care），下列何者正確？', ['有助圈大就當 1，不必全部圈', '一定要全部圈進去', '一定要當 0', '不能出現在卡諾圖上'], '隨意項可以當 1 也可以當 0，有幫助才用。'],
          ['卡諾圖', '四變數卡諾圖中，下列哪些位置互相相鄰？', ['四個角落', '對角線兩端', '中間四格與四個角落', '同一列不連續的格'], '四角、上下、左右邊緣都相鄰。'],
          ['常用化簡', "AB + A'C + BC 化簡為？", ["AB + A'C", 'AB + BC', "A'C + BC", "AB + A'C + BC 已最簡"], "共識定理：BC 是多餘的共識項，可刪去。"],
          ['常用化簡', "AB + AB' = ？", ['A', 'B', 'AB', '1'], "AB + AB' = A(B + B') = A。"],
          { t: '標準式轉換', g: function (R) {
            var all = [0, 1, 2, 3, 4, 5, 6, 7], k = R.int(2, 5), list = shuffle(all).slice(0, k).sort(function (a, b) { return a - b; });
            var comp = all.filter(function (m) { return list.indexOf(m) < 0; });
            var j = list.join(', '), c = comp.join(', ');
            return ['F(A, B, C) = Σm(' + j + ')，也可以寫成？', ['ΠM(' + c + ')', 'ΠM(' + j + ')', "Σm(" + c + ")", 'ΠM(' + comp.map(function (m) { return 7 - m; }).sort(function (a, b) { return a - b; }).join(', ') + ')'],
              'Σm 與 ΠM 的編號互補（合起來是 0～7）：ΠM(' + c + ')。'];
          } },
          { t: '標準式轉換', g: function (R) {
            var k = R.int(2, 4), list = shuffle([0, 1, 2, 3, 4, 5, 6, 7]).slice(0, k).sort(function (a, b) { return a - b; });
            var wrong1 = list.map(function (m) { return parseInt(bits3(m).split('').reverse().join(''), 2); }).sort(function (a, b) { return a - b; });
            var wrong2 = list.map(function (m) { return 7 - m; }).sort(function (a, b) { return a - b; });
            return ['真值表中 ABC = ' + list.map(bits3).join('、') + ' 時 F = 1，其餘為 0，F 的最小項表示為？', ['Σm(' + list.join(', ') + ')', 'Σm(' + wrong1.join(', ') + ')', 'Σm(' + wrong2.join(', ') + ')', 'ΠM(' + list.join(', ') + ')'],
              '把 ABC 當二進位數換成十進位（A 為最高位）：' + list.map(function (m) { return bits3(m) + ' = ' + m; }).join('、') + '。'];
          } },
          { t: '布林化簡', g: function (R) {
            var s = R.pick(SIMP), ms = mins(s[1]);
            var others = shuffle(SIMP.filter(function (x) { return x !== s && mins(x[1]).join() !== ms.join(); })).slice(0, 3).map(function (x) { return x[0]; });
            return ['F(A, B, C) = Σm(' + ms.join(', ') + ')，化簡成最簡 SOP 為？', [s[0]].concat(others),
              '把 Σm(' + ms.join(', ') + ') 畫在卡諾圖上圈最大的圈 → F = ' + s[0] + '。也可把選項代 0、1 檢查真值。'];
          } },
          { t: '布林化簡', g: function (R) {
            var T = [["A'B'", [0]], ["A'B", [1]], ["AB'", [2]], ['AB', [3]], ["A'", [0, 1]], ['A', [2, 3]], ["B'", [0, 2]], ['B', [1, 3]],
              ["A'B' + AB", [0, 3]], ["A'B + AB'", [1, 2]], ["A' + B'", [0, 1, 2]], ["A' + B", [0, 1, 3]], ["A + B'", [0, 2, 3]], ['A + B', [1, 2, 3]]];
            var t = R.pick(T), others = shuffle(T.filter(function (x) { return x !== t; })).slice(0, 3).map(function (x) { return x[0]; });
            return ['F(A, B) = Σm(' + t[1].join(', ') + ')，化簡後為？', [t[0]].concat(others),
              'm = 2A + B：' + t[1].map(function (m) { return 'm' + m + ' = ' + ((m >> 1) & 1) + (m & 1); }).join('、') + ' → F = ' + t[0] + '。'];
          } },
          { t: '布林化簡', g: function (R) {
            var c = R.pick([
              ["AB + AB'C", 'AB + AC', ["A + C", 'AB', "AB'C"]],
              ["A'B + AB + AB'", 'A + B', ['B', "A + B'", 'AB']],
              ["A(A' + B)", 'AB', ['A', 'B', 'A + B']],
              ["(A + B)(A + B')", 'A', ['B', 'A + B', 'AB']],
              ["AB + A'C + BC", "AB + A'C", ['AB + BC', "A'C + BC", "AB + C"]],
              ["A + A'B + AB'", 'A + B', ['A', "A + AB'", 'B']],
              ["ABC + ABC' + A'B", 'B', ['AB', "A'B", 'AB + C']]
            ]);
            return [c[0] + ' 化簡後為？', [c[1]].concat(c[2]), '用吸收律、共識定理、A + A\'B = A + B 化簡，或代 0、1 檢查真值。正解：' + c[1] + '。'];
          } }
        ]
      }
    ]
  });
})();
