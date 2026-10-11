/* 數學C 困難版：仿歷屆一模多步驟題（每次換數字） */
(function () {
  var H = QH, n = H.n, O = H.opts;
  function isSq(x) { var r = Math.round(Math.sqrt(x)); return x >= 0 && r * r === x; }

  addHard('math', 0, [
    { t: '絕對值計數', g: function (R) {
      var c = R.int(-6, 8), m = R.int(3, 10), k = R.int(4, 14), nn = m + k;
      var ans = 2 * k;
      return ['設 a 為整數，數線上 A(a)、B(' + n(c) + ') 兩點的距離「不小於 ' + m + ' 但小於 ' + nn + '」，則所有可能的 a 共有幾個？', O(ans, [2 * k + 2, k, 2 * k - 1, 2 * (k + 1) + 1]),
        m + ' ≤ |a − (' + n(c) + ')| < ' + nn + '：右側 ' + n(c + m) + ' ≤ a ≤ ' + n(c + nn - 1) + ' 有 ' + k + ' 個，左側 ' + n(c - nn + 1) + ' ≤ a ≤ ' + n(c - m) + ' 也有 ' + k + ' 個，共 ' + ans + ' 個。注意「不小於」含等號、「小於」不含。'];
    } },
    { t: '垂直平分線', g: function (R) {
      var a, xr, yr, p1, q1, q2, p2, K, u, v, tries = 0;
      do {
        a = R.int(-5, 8); xr = R.int(-3, 6); yr = R.int(-3, 6); p1 = R.int(-4, 4); q1 = R.int(-4, 6); q2 = R.int(-4, 4);
        u = p1 - xr; v = q2 - yr;
        K = 2 * (u - v) * a - v * v + u * u + (q1 - yr) * (q1 - yr);
        tries++;
      } while ((u === v || !isSq(K)) && tries < 500);
      if (!isSq(K) || u === v) { a = 3; xr = 5; yr = 4; p1 = 0; q1 = 3; q2 = 0; u = -5; v = -4; K = 2 * (-1) * 3 - 16 + 25 + 1; }
      p2 = xr + Math.round(Math.sqrt(K));
      var P = '(a ' + (p1 >= 0 ? '+ ' + p1 : '− ' + (-p1)) + ', ' + n(q1) + ')', Q = '(' + n(p2) + ', a ' + (q2 >= 0 ? '+ ' + q2 : '− ' + (-q2)) + ')';
      return ['坐標平面上 P' + P.replace('a + 0', 'a') + '、Q' + Q.replace('a + 0', 'a') + '，若 R(' + n(xr) + ', ' + n(yr) + ') 在 PQ 的垂直平分線上，則 a = ？', O(a, [a + 1, a - 1, -a, a + 2]),
        '垂直平分線上的點到兩端等距：RP² = RQ²，展開後 a² 會消掉，得到一次方程式，解得 a = ' + n(a) + '。'];
    } },
    { t: '等速運動分點', g: function (R) {
      var t1 = R.int(1, 3), t2 = R.int(2, 5), dx = R.nz(-3, 3), dy = R.nz(-3, 3), bx = R.int(-5, 5), by = R.int(-5, 8);
      var cx = bx + t2 * dx, cy = by + t2 * dy, px = bx - t1 * dx, py = by - t1 * dy;
      return ['小育從點 A(p, q) 沿直線等速前進，' + t1 + ' 小時後經過 B(' + n(bx) + ', ' + n(by) + ')，再過 ' + t2 + ' 小時到達 C(' + n(cx) + ', ' + n(cy) + ')，則 p + q = ？', O(px + py, [bx + t1 * dx + by + t1 * dy, px - py, cx + cy - (px + py) === px + py ? px + py + 2 : cx + cy, px + py + dx]),
        '等速 → AB : BC = ' + t1 + ' : ' + t2 + '。每小時位移 = (C − B) ÷ ' + t2 + ' = ' + H.pt(dx, dy) + '，A = B − ' + t1 + ' × ' + H.pt(dx, dy) + ' = ' + H.pt(px, py) + '，p + q = ' + n(px + py) + '。'];
    } },
    { t: '拋物線應用', g: function (R) {
      var D = R.pick([10, 20, 30, 40]), k = R.int(2, 9), h = 100 - k * k, x = D * k / 10;
      return ['無人機在地面干擾器正上方 100 公尺處失去動力，沿拋物線落在距干擾器 ' + D + ' 公尺的地面。掉落過程中離地 ' + h + ' 公尺時，距干擾器水平距離多少公尺？', O(x, [D - x, D * k / 100 * 10 + 1, Math.round(D * (100 - h) / 100), x + D / 10]),
        '設 y = 100 − a·x²，過 (' + D + ', 0) → a = 100/' + D * D + '。y = ' + h + '：x² = (100 − ' + h + ') × ' + D * D + '/100 = ' + x * x + ' → x = ' + x + '。', QF.drone(D, h)];
    } },
    { t: '函數代換', g: function (R) {
      var a = R.pick([2, 3]), b = R.int(-3, 3), c = R.int(-4, 4), d = R.int(-5, 5), x0 = R.int(-3, 4), v = a * x0 + b;
      var val = x0 * x0 + c * x0 + d;
      var inner = (a === 1 ? '' : a) + 'x' + (b ? (b > 0 ? ' + ' + b : ' − ' + (-b)) : '');
      var rhs = 'x²' + (c ? (c > 0 ? ' + ' + c : ' − ' + (-c)) + 'x' : '') + (d ? (d > 0 ? ' + ' + d : ' − ' + (-d)) : '');
      return ['已知 f(' + inner + ') = ' + rhs + '，則 f(' + n(v) + ') = ？', O(val, [v * v + c * v + d, val + a, x0 * x0 - c * x0 + d]),
        '令 ' + inner + ' = ' + n(v) + ' → x = ' + n(x0) + '，代入右式：' + n(x0) + '² + ' + n(c) + '×' + n(x0) + ' + ' + n(d) + ' = ' + n(val) + '。'];
    } },
    { t: '二次不等式求參數', g: function (R) {
      var p = R.int(2, 8), sign = R.sign();
      return ['設 k 為整數，若一元二次不等式 kx² ' + (sign > 0 ? '+ ' : '− ') + 2 * p + 'x + k < 0 無實數解，則 k 的最小值為何？', O(p, [-p, p + 1, 2 * p, p - 1]),
        '「< 0 無解」⇔ kx² ± ' + 2 * p + 'x + k ≥ 0 恆成立 ⇔ k > 0 且 D = ' + 4 * p * p + ' − 4k² ≤ 0 → k ≥ ' + p + '，最小值 ' + p + '。'];
    } },
    { t: '算幾應用', g: function (R) {
      var m = R.int(3, 15), L = 4 * m;
      return ['用長 ' + L + ' 公尺的圍籬，靠著一面牆圍出矩形花圃（靠牆那邊不用圍籬），花圃的最大面積為多少平方公尺？', O(2 * m * m, [m * m, L * L / 16, 4 * m * m]),
        '設垂直牆的邊為 x、平行牆的邊為 y：2x + y = ' + L + '。算幾：(2x + y)/2 ≥ √(2xy) → xy ≤ ' + L * L / 8 + '；等號在 2x = y = ' + L / 2 + '，面積 ' + 2 * m * m + '。'];
    } }
  ]);

  // 三角函數值為有理數的角
  var SINR = { 30: [1, 2], 150: [1, 2], 210: [-1, 2], 330: [-1, 2], 90: [1, 1], 270: [-1, 1] };
  var COSR = { 60: [1, 2], 300: [1, 2], 120: [-1, 2], 240: [-1, 2], 0: [1, 1], 180: [-1, 1] };
  var TANR = { 45: [1, 1], 225: [1, 1], 135: [-1, 1], 315: [-1, 1] };
  addHard('math', 1, [
    { t: '廣義角綜合計算', g: function (R) {
      var A = R.pick(Object.keys(SINR)), B = R.pick(Object.keys(COSR)), C = R.pick(Object.keys(TANR));
      var s = SINR[A], c = COSR[B], t = TANR[C];
      var num = s[0] * c[0] * t[1] + t[0] * s[1] * c[1], den = s[1] * c[1] * t[1];
      return ['sin' + A + '° × cos' + B + '° + tan' + C + '° = ？', O(H.frac(num, den), [H.frac(-num, den), H.frac(s[0] * c[0] * t[1] - t[0] * s[1] * c[1], den), H.frac(num + den, den)]),
        'sin' + A + '° = ' + H.frac(s[0], s[1]) + '、cos' + B + '° = ' + H.frac(c[0], c[1]) + '、tan' + C + '° = ' + H.frac(t[0], t[1]) + '（先判斷象限的正負）。'];
    } },
    { t: 'sinθ + cosθ 進階', g: function (R) {
      var k = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]), a = k[0], b = k[1];
      var num = a * (3 * b * b - a * a), den = 2 * b * b * b;
      return ['若 sinθ + cosθ = ' + H.frac(a, b) + '，則 sin³θ + cos³θ = ？', O(H.frac(num, den), [H.frac(a * a * a, b * b * b), H.frac(a * (b * b + a * a), den), H.frac(a * a - b * b, 2 * b * b)]),
        '先求 sinθcosθ = (k² − 1)/2 = ' + H.frac(a * a - b * b, 2 * b * b) + '；sin³θ + cos³θ = (sinθ + cosθ)(1 − sinθcosθ) = ' + H.frac(num, den) + '。'];
    } },
    { t: '扇形應用', g: function (R) {
      var Rr = R.int(5, 12) * 3, r = R.int(2, Math.floor(Rr / 3) - 1) * 3, th = R.pick([[2, 3], [1, 2], [5, 6], [1, 3]]);
      var A = H.piFrac((Rr * Rr - r * r) * th[0], 2 * th[1]);
      return ['摺扇展開為圓心角 ' + H.piFrac(th[0], th[1]) + ' 的扇形，扇骨長 ' + Rr + ' cm，扇面（紙的部分）從距圓心 ' + r + ' cm 處開始。扇面面積為多少 cm²？', O(A, [H.piFrac(Rr * Rr * th[0], 2 * th[1]), H.piFrac((Rr - r) * (Rr - r) * th[0], 2 * th[1]), H.piFrac((Rr * Rr - r * r) * th[0], th[1])]),
        '扇面 = 大扇形 − 小扇形 = ½θ(R² − r²) = ½ × ' + H.piFrac(th[0], th[1]) + ' × (' + Rr * Rr + ' − ' + r * r + ') = ' + A + '。', QF.fan(Rr, r, th[0], th[1])];
    } },
    { t: '三角形邊角綜合', g: function (R) {
      var is60 = Math.random() < 0.5, T = R.pick(is60 ? [[3, 8, 7], [5, 8, 7], [8, 15, 13], [7, 15, 13]] : [[3, 5, 7], [7, 8, 13], [5, 16, 19]]);
      var bc = T[0] * T[1], ask = R.int(0, 1);
      var area = (bc % 4 === 0 ? bc / 4 : H.frac(bc, 4)) + '√3';
      if (ask === 0) return ['△ABC 中，b = ' + T[0] + '、c = ' + T[1] + '、∠A = ' + (is60 ? 60 : 120) + '°，則 △ABC 的面積為何？', O(area, [H.frac(bc, 2) + '√3', String(bc / 2), H.frac(bc, 4)]), '面積 = ½·bc·sinA = ½ × ' + bc + ' × √3/2 = ' + area + '（sin60° = sin120° = √3/2）。'];
      var Rr = H.frac(T[2], 1) + '/√3';
      return ['△ABC 中，b = ' + T[0] + '、c = ' + T[1] + '、∠A = ' + (is60 ? 60 : 120) + '°，則 a + b + c = ？', O(T[0] + T[1] + T[2], [T[0] + T[1] + T[2] + 1, T[0] + T[1] + Math.round(Math.sqrt(T[0] * T[0] + T[1] * T[1])), 2 * T[2]]), '餘弦定理：a² = ' + T[0] * T[0] + ' + ' + T[1] * T[1] + (is60 ? ' − ' : ' + ') + bc + ' = ' + T[2] * T[2] + ' → a = ' + T[2] + '，周長 ' + (T[0] + T[1] + T[2]) + '。'];
    } },
    { t: '仰角兩次觀測', g: function (R) {
      var d = 2 * R.int(5, 40);
      return ['在 A 點測得塔頂仰角 30°，朝塔前進 ' + d + ' 公尺到 B 點，測得仰角 60°，塔高為多少公尺？（眼高不計）', O((d / 2) + '√3', [d + '√3', String(d), (d / 2) + '', (d / 3) + '√3']),
        '∠ATB = 60° − 30° = 30°，所以 △ABT 為等腰，BT = AB = ' + d + '。塔高 = BT·sin60° = ' + d + ' × √3/2 = ' + (d / 2) + '√3。', QF.elevation(d)];
    } }
  ]);

  addHard('math', 2, [
    { t: '向量垂直求參數', g: function (R) {
      var b = R.pick([[3, 4], [4, 3], [1, 2], [2, 1], [1, 3]]), a = [R.int(-5, 6), R.int(-5, 6)];
      var bb = b[0] * b[0] + b[1] * b[1], ab = a[0] * b[0] + a[1] * b[1];
      if (ab === 0) a[0] += 1, ab = a[0] * b[0] + a[1] * b[1];
      return ['a→ = ' + H.pt(a[0], a[1]) + '、b→ = ' + H.pt(b[0], b[1]) + '，若 (a→ + t b→) ⊥ b→，則 t = ？', O(H.frac(-ab, bb), [H.frac(ab, bb), H.frac(-bb, ab), H.frac(-ab, bb * 2)]),
        '(a→ + t b→)·b→ = 0 → a→·b→ + t|b→|² = 0 → ' + n(ab) + ' + ' + bb + 't = 0 → t = ' + H.frac(-ab, bb) + '。'];
    } },
    { t: '向量長度綜合', g: function (R) {
      var a = R.int(2, 7), b = R.int(2, 7), d2, s2;
      do { d2 = R.int(1, 2 * (a * a + b * b) - 1); s2 = 2 * a * a + 2 * b * b - d2; } while (s2 <= 0 || !(Math.abs(a - b) ** 2 <= d2 && d2 <= (a + b) ** 2));
      return ['|a→| = ' + a + '、|b→| = ' + b + '、|a→ − b→| = ' + H.sqrtS(d2) + '，則 |a→ + b→| = ？', O(H.sqrtS(s2), [H.sqrtS(a * a + b * b), H.sqrtS(Math.abs(a * a + b * b - d2)) === H.sqrtS(s2) ? H.sqrtS(s2 + 1) : H.sqrtS(Math.abs(a * a + b * b - d2)), String(a + b)]),
        '|a→ + b→|² + |a→ − b→|² = 2(|a→|² + |b→|²)（平行四邊形定理）→ |a→ + b→|² = ' + 2 * (a * a + b * b) + ' − ' + d2 + ' = ' + s2 + '。'];
    } },
    { t: '夾角餘弦', g: function (R) {
      var p = R.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17]]), q = R.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10]]);
      var s1 = R.sign(), s2 = R.sign();
      var a = [p[0], s1 * p[1]], b = [q[0], s2 * q[1]], dot = a[0] * b[0] + a[1] * b[1];
      return ['a→ = ' + H.pt(a[0], a[1]) + '、b→ = ' + H.pt(b[0], b[1]) + '，兩向量夾角為 θ，cosθ = ？', O(H.frac(dot, p[2] * q[2]), [H.frac(-dot, p[2] * q[2]), H.frac(a[0] * b[1] - a[1] * b[0], p[2] * q[2]), H.frac(dot, p[2] + q[2])]),
        'cosθ = a→·b→ ÷ (|a→||b→|) = ' + n(dot) + ' ÷ (' + p[2] + ' × ' + q[2] + ')。'];
    } },
    { t: '正射影向量', g: function (R) {
      var b = R.pick([[3, 4], [4, 3], [3, -4]]), k, a;
      do { a = [R.int(-8, 8), R.int(-8, 8)]; k = (a[0] * b[0] + a[1] * b[1]); } while (k === 0 || k % 25 !== 0);
      var m = k / 25;
      return ['a→ = ' + H.pt(a[0], a[1]) + ' 在 b→ = ' + H.pt(b[0], b[1]) + ' 上的正射影向量為何？', O(H.pt(m * b[0], m * b[1]), [H.pt(-m * b[0], -m * b[1]), H.pt(m * b[1], m * b[0]), H.pt(k * b[0] / 5, k * b[1] / 5)]),
        '正射影 = (a→·b→ ÷ |b→|²) b→ = (' + n(k) + ' ÷ 25) b→ = ' + n(m) + ' b→。'];
    } },
    { t: '柯西求最小值', g: function (R) {
      var t = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10]]), c = t[2] * R.int(1, 4);
      var ans = (c / t[2]) * (c / t[2]);
      return ['實數 x、y 滿足 ' + t[0] + 'x + ' + t[1] + 'y = ' + c + '，則 x² + y² 的最小值為何？', O(ans, [c * c, c / t[2], ans * 2]),
        '柯西：(' + t[0] + '² + ' + t[1] + '²)(x² + y²) ≥ (' + t[0] + 'x + ' + t[1] + 'y)² = ' + c * c + ' → x² + y² ≥ ' + c * c + '/' + t[2] * t[2] + ' = ' + ans + '。'];
    } },
    { t: '三點求面積', g: function (R) {
      var A = [R.int(-5, 5), R.int(-5, 5)], B = [R.int(-5, 6), R.int(-5, 6)], C = [R.int(-5, 6), R.int(-5, 6)];
      var D = (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]);
      if (D === 0) { C[0] += 2; D = (B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1]); }
      if (D === 0) { A = [0, 0]; B = [4, 0]; C = [1, 3]; D = 12; }
      var ar = Math.abs(D) / 2;
      return ['A' + H.pt(A[0], A[1]) + '、B' + H.pt(B[0], B[1]) + '、C' + H.pt(C[0], C[1]) + '，△ABC 面積為何？', O(ar, [Math.abs(D), ar + 1, ar + 0.5]),
        'AB→ = ' + H.pt(B[0] - A[0], B[1] - A[1]) + '、AC→ = ' + H.pt(C[0] - A[0], C[1] - A[1]) + '，面積 = ½|x1y2 − x2y1| = ½ × ' + Math.abs(D) + ' = ' + ar + '。'];
    } }
  ]);
})();
