/* 數學C：一模範圍 第一～三單元 */
(function () {
  var H = QH, n = H.n, O = H.opts;

  // 特殊角三角函數值
  var VALS = ['0', '1/2', '−1/2', '√2/2', '−√2/2', '√3/2', '−√3/2', '1', '−1', '√3', '−√3', '√3/3', '−√3/3'];
  var NUM = { '0': 0, '1/2': .5, '−1/2': -.5, '√2/2': Math.SQRT2 / 2, '−√2/2': -Math.SQRT2 / 2, '√3/2': Math.sqrt(3) / 2, '−√3/2': -Math.sqrt(3) / 2, '1': 1, '−1': -1, '√3': Math.sqrt(3), '−√3': -Math.sqrt(3), '√3/3': Math.sqrt(3) / 3, '−√3/3': -Math.sqrt(3) / 3 };
  function toStr(v) { for (var k in NUM) if (Math.abs(NUM[k] - v) < 1e-9) return k; return null; }
  function others(ans, R) { var c = VALS.filter(function (v) { return v !== ans; }); var out = []; while (out.length < 3) { var p = R.pick(c); if (out.indexOf(p) < 0) out.push(p); } return out; }

  // 餘弦定理整數三角形：[b, c, a]，A=60° 時 a² = b² + c² − bc；A=120° 時 a² = b² + c² + bc
  var T60 = [[3, 8, 7], [5, 8, 7], [8, 15, 13], [7, 15, 13], [5, 21, 19]];
  var T120 = [[3, 5, 7], [7, 8, 13], [5, 16, 19], [6, 10, 14]];
  var TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]];

  QUIZ_DATA.push({
    id: 'math', name: '數學C', desc: '第一～三單元',
    units: [
      {
        name: '坐標系與函數圖形',
        qs: [
          { t: '絕對值不等式', g: function (R) {
            var a = R.nz(-6, 6), r = R.int(1, 8), le = Math.random() < 0.6;
            var inside = n(a - r) + ' ≤ x ≤ ' + n(a + r), out = 'x ≤ ' + n(a - r) + ' 或 x ≥ ' + n(a + r);
            return ['|' + H.lin(a) + '| ' + (le ? '≤' : '≥') + ' ' + r + ' 的解為何？',
              O(le ? inside : out, [le ? out : inside, n(-a - r) + ' ≤ x ≤ ' + n(-a + r), 'x ≤ ' + n(-a - r) + ' 或 x ≥ ' + n(-a + r), n(a) + ' ≤ x ≤ ' + n(r)]),
              '|x − a| ≤ r ⇔ a − r ≤ x ≤ a + r；|x − a| ≥ r ⇔ x ≤ a − r 或 x ≥ a + r。中心 a = ' + n(a) + '，距離 r = ' + r + '。'];
          } },
          { t: '絕對值不等式', g: function (R) {
            var a = R.int(-5, 5), b = a + R.int(2, 10);
            return ['數線上 A(' + n(a) + ')、B(' + n(b) + ') 兩點的距離為何？', O(b - a, [b + a, Math.abs(a) + Math.abs(b) === b - a ? b - a + 2 : Math.abs(a) + Math.abs(b), b - a - 1]),
              '數線上兩點距離 = |a − b| = |' + n(a) + ' − ' + n(b) + '| = ' + (b - a) + '。'];
          } },
          { t: '距離與中點', g: function (R) {
            var t = R.pick(TRI), x1 = R.int(-5, 5), y1 = R.int(-5, 5), sx = R.sign(), sy = R.sign();
            var sw = Math.random() < 0.5, dx = sw ? t[1] : t[0], dy = sw ? t[0] : t[1];
            return ['A' + H.pt(x1, y1) + '、B' + H.pt(x1 + sx * dx, y1 + sy * dy) + '，AB 的長度為何？', O(t[2], [dx + dy, t[2] + 1, t[2] - 1]),
              'AB = √[(Δx)² + (Δy)²] = √(' + dx + '² + ' + dy + '²) = ' + t[2] + '。'];
          } },
          { t: '距離與中點', g: function (R) {
            var x1 = R.int(-6, 6), y1 = R.int(-6, 6), x2 = x1 + 2 * R.int(-4, 4), y2 = y1 + 2 * R.nz(-4, 4);
            var mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
            return ['A' + H.pt(x1, y1) + '、B' + H.pt(x2, y2) + '，AB 中點坐標為何？', O(H.pt(mx, my), [H.pt(x2 - x1, y2 - y1), H.pt(my, mx), H.pt(x1 + x2, y1 + y2), H.pt(-mx, my)]),
              '中點 = ((x1 + x2)/2, (y1 + y2)/2) = ' + H.pt(mx, my) + '。'];
          } },
          { t: '內分點', g: function (R) {
            var r = R.pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2]]), m = r[0], k = r[1], s = m + k;
            var ax = R.int(-5, 5), ay = R.int(-5, 5), dx = R.nz(-3, 3), dy = R.nz(-3, 3);
            var bx = ax + s * dx, by = ay + s * dy;
            return ['A' + H.pt(ax, ay) + '、B' + H.pt(bx, by) + '，P 在 AB 上且 AP : PB = ' + m + ' : ' + k + '，P 點坐標為何？',
              O(H.pt(ax + m * dx, ay + m * dy), [H.pt(ax + k * dx, ay + k * dy), H.pt(bx + m * dx, by + m * dy), H.pt(ax + m * dx, ay - m * dy), H.pt(ax - m * dx, ay + m * dy)]),
              '內分點 P = (n·A + m·B) ÷ (m + n)，m = ' + m + '、n = ' + k + '。也可想成從 A 走 AB 的 ' + m + '/' + s + '。注意比例不要對調。'];
          } },
          { t: '重心', g: function (R) {
            var gx = R.int(-4, 4), gy = R.int(-4, 4), x1 = R.int(-6, 6), y1 = R.int(-6, 6), x2 = R.int(-6, 6), y2 = R.int(-6, 6);
            var x3 = 3 * gx - x1 - x2, y3 = 3 * gy - y1 - y2;
            return ['三角形三頂點 ' + H.pt(x1, y1) + '、' + H.pt(x2, y2) + '、' + H.pt(x3, y3) + '，重心坐標為何？', O(H.pt(gx, gy), [H.pt(3 * gx, 3 * gy), H.pt(gy, gx), H.pt(gx + 1, gy - 1), H.pt(-gx, gy + 1)]),
              '重心 = ((x1 + x2 + x3)/3, (y1 + y2 + y3)/3) = (' + n(3 * gx) + '/3, ' + n(3 * gy) + '/3) = ' + H.pt(gx, gy) + '。'];
          } },
          { t: '象限判斷', g: function (R) {
            var q = R.int(1, 4), sg = [[1, 1], [-1, 1], [-1, -1], [1, -1]][q - 1];
            var mode = R.int(0, 2), names = ['第一象限', '第二象限', '第三象限', '第四象限'];
            // 若 (a, b) 在第 q 象限，求 (b, a)、(−a, b) 或 (ab, a) 的象限
            var a = sg[0], b = sg[1], x, y, expr;
            if (mode === 0) { x = b; y = a; expr = '(b, a)'; } else if (mode === 1) { x = -a; y = b; expr = '(−a, b)'; } else { x = a * b; y = -b; expr = '(ab, −b)'; }
            var ans = x > 0 ? (y > 0 ? 0 : 3) : (y > 0 ? 1 : 2);
            return ['若點 (a, b) 在' + names[q - 1] + '，則點 ' + expr + ' 在第幾象限？', O(names[ans], names),
              '(a, b) 在' + names[q - 1] + ' → a ' + (a > 0 ? '> 0' : '< 0') + '、b ' + (b > 0 ? '> 0' : '< 0') + '。代入得 ' + expr + ' 的符號為 (' + (x > 0 ? '+' : '−') + ', ' + (y > 0 ? '+' : '−') + ')。象限：一(+,+) 二(−,+) 三(−,−) 四(+,−)。'];
          } },
          ['函數定義', '下列關於「函數」的敘述，何者正確？', ['每一個 x 只能對應到一個 y', '每一個 y 只能對應到一個 x', '圖形畫水平線最多只交一點', '圓 x² + y² = 1 是 y 對 x 的函數'], '函數：每個 x 只能對應一個 y（畫「垂直線」最多只交一點）。圓用垂直線會交兩點，不是函數。'],
          ['函數定義', '下列哪一個圖形「不是」y 對 x 的函數圖形？', ['x = y²', 'y = x²', 'y = |x|', 'y = 2x + 1'], 'x = y² 時，x = 4 對應 y = 2 和 −2，一個 x 對到兩個 y，不是函數。'],
          { t: '二次函數頂點', g: function (R) {
            var a = R.pick([1, 2, -1, -2, 3]), h = R.int(-4, 4), k = R.int(-6, 6), b = -2 * a * h, c = a * h * h + k;
            var poly = (a === 1 ? '' : a === -1 ? '−' : n(a)) + 'x²' + (b ? (b > 0 ? ' + ' + b : ' − ' + (-b)) + 'x' : '') + (c ? (c > 0 ? ' + ' + c : ' − ' + (-c)) : '');
            return ['y = ' + poly + ' 的頂點坐標為何？', O(H.pt(h, k), [H.pt(-h, k), H.pt(h, -k), H.pt(k, h), H.pt(-h, -k)], function (i) { return H.pt(h + i, k); }),
              '頂點 x = −b/2a = ' + n(-b) + '/' + n(2 * a) + ' = ' + n(h) + '，代回得 y = ' + n(k) + '。或配方成 y = ' + n(a) + '(' + H.lin(h) + ')² ' + (k >= 0 ? '+ ' + k : '− ' + (-k)) + '。'];
          } },
          { t: '二次函數最值', g: function (R) {
            var a = R.pick([1, 2, 3, -1, -2]), h = R.int(-4, 4), k = R.int(-8, 8), b = -2 * a * h, c = a * h * h + k;
            var poly = (a === 1 ? '' : a === -1 ? '−' : n(a)) + 'x²' + (b ? (b > 0 ? ' + ' + b : ' − ' + (-b)) + 'x' : '') + (c ? (c > 0 ? ' + ' + c : ' − ' + (-c)) : '');
            var word = a > 0 ? '最小值' : '最大值';
            return ['y = ' + poly + ' 的' + word + '為何？', O(k, [c, -k, k + a, h], function (i) { return k + i + 1; }),
              'a ' + (a > 0 ? '> 0 開口向上，有最小值' : '< 0 開口向下，有最大值') + '；頂點 x = −b/2a = ' + n(h) + '，代入得 ' + n(k) + '。'];
          } },
          { t: '判別式應用', g: function (R) {
            var c = R.int(1, 6);
            return ['若 x² + kx + ' + c * c + ' > 0 對所有實數 x 都成立，k 的範圍為何？', O('−' + 2 * c + ' < k < ' + 2 * c, ['k < −' + 2 * c + ' 或 k > ' + 2 * c, '−' + c + ' < k < ' + c, 'k > ' + 2 * c, '−' + 4 * c + ' < k < ' + 4 * c]),
              '恆正 ⇔ a > 0 且 D < 0：k² − 4·' + c * c + ' < 0 → k² < ' + 4 * c * c + ' → −' + 2 * c + ' < k < ' + 2 * c + '。'];
          } },
          { t: '判別式應用', g: function (R) {
            var p = R.nz(-5, 5);
            return ['拋物線 y = x² ' + (p > 0 ? '+ ' + 2 * p : '− ' + (-2 * p)) + 'x + k 與 x 軸相切，k = ？', O(p * p, [-p * p, 2 * p, 4 * p * p], function (i) { return p * p + i; }),
              '相切 ⇔ D = 0：(' + n(2 * p) + ')² − 4k = 0 → k = ' + p * p + '。'];
          } },
          { t: '二次不等式', g: function (R) {
            var al = R.int(-5, 3), be = al + R.int(1, 6), s = al + be, p = al * be, lt = Math.random() < 0.6;
            var poly = 'x²' + (s ? (s > 0 ? ' − ' + s : ' + ' + (-s)) + 'x' : '') + (p ? (p > 0 ? ' + ' + p : ' − ' + (-p)) : '');
            var inn = n(al) + ' < x < ' + n(be), outt = 'x < ' + n(al) + ' 或 x > ' + n(be);
            return [poly + (lt ? ' < 0' : ' > 0') + ' 的解為何？', O(lt ? inn : outt, [lt ? outt : inn, n(-be) + ' < x < ' + n(-al), 'x < ' + n(-be) + ' 或 x > ' + n(-al)]),
              '因式分解 (' + H.lin(al) + ')(' + H.lin(be) + ')' + (lt ? ' < 0 → 在兩根之間' : ' > 0 → 在兩根之外') + '。'];
          } },
          { t: '算幾不等式', g: function (R) {
            var p = R.int(1, 4), q = R.int(1, 5), m = R.int(1, 3), S = 2 * p * q * m;
            return ['a、b > 0 且 ' + (p === 1 ? '' : p) + 'a + ' + (q === 1 ? '' : q) + 'b = ' + S + '，ab 的最大值為何？', O(p * q * m * m, [S * S / 4, p * q * m, 2 * p * q * m * m]),
              '算幾：(' + p + 'a + ' + q + 'b)/2 ≥ √(' + p * q + 'ab) → ' + S / 2 + ' ≥ √(' + p * q + 'ab) → ab ≤ ' + (S / 2) * (S / 2) + '/' + p * q + ' = ' + p * q * m * m + '；等號在 ' + p + 'a = ' + q + 'b = ' + S / 2 + '。'];
          } },
          ['算幾不等式', '使用算幾不等式 (a + b)/2 ≥ √(ab) 前，一定要確認什麼？', ['a、b 都是正數', 'a、b 都是整數', 'a > b', 'a + b 是偶數'], '算幾不等式只對正數成立；等號在 a = b 時成立。和固定 → 積最大；積固定 → 和最小。'],
          ['數與根式', '循環小數 0.3535…（35 循環）化成分數為何？', ['35/99', '35/100', '7/20', '32/90'], '純循環：循環節 35 兩位 → 35/99。0.3555… 才是 (35 − 3)/90。'],
          ['數與根式', '循環小數 0.3555…（5 循環）化成分數為何？', ['32/90', '35/99', '35/90', '3/9'], '混循環：(35 − 3)/90 = 32/90 = 16/45。'],
          ['數與根式', '1 ÷ (√3 − √2) 分母有理化後為何？', ['√3 + √2', '√3 − √2', '(√3 + √2)/5', '1'], '上下同乘 (√3 + √2)：分母 3 − 2 = 1，所以 = √3 + √2。']
        ]
      },
      {
        name: '三角函數',
        qs: [
          { t: '角度與弧度', g: function (R) {
            var d = R.pick([30, 45, 60, 120, 135, 150, 210, 225, 240, 270, 300, 315, 330]);
            var f = function (x) { return H.piFrac(x, 180); };
            return [d + '° 等於多少弳？', O(f(d), [f(180 - d), f(d / 2), f(360 - d), f(d + 30)]), 'π 弳 = 180°，所以 ' + d + '° = ' + d + '/180 π = ' + f(d) + '。'];
          } },
          { t: '弧長與扇形', g: function (R) {
            var r = R.int(2, 12), th = R.pick([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3], [3, 4], [5, 6]]), area = Math.random() < 0.5;
            var thS = H.piFrac(th[0], th[1]);
            if (!area) return ['半徑 ' + r + '、圓心角 ' + thS + ' 的扇形，弧長為何？', O(H.piFrac(r * th[0], th[1]), [H.piFrac(r * r * th[0], 2 * th[1]), H.piFrac(2 * r * th[0], th[1]), H.piFrac(r * th[0], 2 * th[1])], function (i) { return H.piFrac(r * th[0] + i, th[1]); }), '弧長 s = rθ = ' + r + ' × ' + thS + ' = ' + H.piFrac(r * th[0], th[1]) + '（θ 要用弳）。'];
            return ['半徑 ' + r + '、圓心角 ' + thS + ' 的扇形，面積為何？', O(H.piFrac(r * r * th[0], 2 * th[1]), [H.piFrac(r * th[0], th[1]), H.piFrac(r * r * th[0], th[1]), H.piFrac(r * th[0], 2 * th[1])], function (i) { return H.piFrac(r * r * th[0] + i, 2 * th[1]); }), '扇形面積 A = ½r²θ = ½ × ' + r * r + ' × ' + thS + ' = ' + H.piFrac(r * r * th[0], 2 * th[1]) + '。'];
          } },
          { t: '同界角', g: function (R) {
            var th; do { th = R.int(-100, 100) * 10; } while (th % 360 === 0);
            var a = ((th % 360) + 360) % 360;
            return [th + '° 的最小正同界角為何？', O(a + '°', [(360 - a) + '°', ((a + 180) % 360) + '°', (Math.abs(th) % 360) + '°'], function (i) { return ((a + 10 * i) % 360) + '°'; }),
              '同界角 = θ + 360°·k，加減 360° 直到落在 0°～360°：' + th + '° → ' + a + '°。'];
          } },
          { t: '三角函數定義', g: function (R) {
            var t = R.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [8, 15, 17]]), sx = R.sign(), sy = R.sign();
            var x = sx * t[0], y = sy * t[1], r = t[2], f = R.pick(['sin', 'cos', 'tan']);
            var val = f === 'sin' ? H.frac(y, r) : f === 'cos' ? H.frac(x, r) : H.frac(y, x);
            return ['角 θ 的終邊通過點 ' + H.pt(x, y) + '，' + f + 'θ = ？', O(val, [H.frac(y, r), H.frac(x, r), H.frac(y, x), H.frac(x, y), H.frac(-y, r), H.frac(-x, r)]),
              'r = √(' + x + '² + ' + y + '²) = ' + r + '；sinθ = y/r、cosθ = x/r、tanθ = y/x。'];
          } },
          { t: '特殊角與廣義角', g: function (R) {
            var d, f, v, s;
            do { d = R.pick([0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]); f = R.pick(['sin', 'cos', 'tan']);
              var rad = d * Math.PI / 180; v = f === 'sin' ? Math.sin(rad) : f === 'cos' ? Math.cos(rad) : (Math.abs(Math.cos(rad)) < 1e-9 ? null : Math.tan(rad)); s = v === null ? null : toStr(v);
            } while (s === null);
            return [f + ' ' + d + '° = ？', [s].concat(others(s, R)), '先看 ' + d + '° 在哪個象限決定正負（一全正、二 sin、三 tan、四 cos），再用參考角的值。'];
          } },
          ['象限與正負', '若 sinθ < 0 且 tanθ > 0，θ 在第幾象限？', ['第三象限', '第二象限', '第四象限', '第一象限'], '各象限為正：一全正、二 sin、三 tan、四 cos。sin 負、tan 正 → 第三象限。'],
          ['象限與正負', '若 cosθ < 0 且 sinθ > 0，θ 在第幾象限？', ['第二象限', '第三象限', '第四象限', '第一象限'], '第二象限只有 sin（csc）為正。'],
          ['象限與正負', '若 tanθ < 0 且 cosθ > 0，θ 在第幾象限？', ['第四象限', '第二象限', '第三象限', '第一象限'], '第四象限只有 cos（sec）為正，tan 為負。'],
          ['廣義角化簡', 'cos(90° + θ) = ？（θ 為銳角）', ['−sinθ', 'sinθ', '−cosθ', 'cosθ'], '90° ± θ → 名稱互換（cos→sin）；90° + θ 在第二象限，cos 為負 → −sinθ。'],
          ['廣義角化簡', 'sin(180° + θ) = ？（θ 為銳角）', ['−sinθ', 'sinθ', 'cosθ', '−cosθ'], '180° ± θ → 名稱不變；180° + θ 在第三象限，sin 為負。'],
          ['廣義角化簡', 'tan(180° − θ) = ？（θ 為銳角）', ['−tanθ', 'tanθ', 'cotθ', '−cotθ'], '名稱不變；180° − θ 在第二象限，tan 為負。'],
          ['廣義角化簡', 'cos(270° − θ) = ？（θ 為銳角）', ['−sinθ', 'sinθ', 'cosθ', '−cosθ'], '270° ± θ → 名稱互換；270° − θ 在第三象限，cos 為負 → −sinθ。'],
          ['廣義角化簡', 'sin(270° + θ) = ？（θ 為銳角）', ['−cosθ', 'cosθ', 'sinθ', '−sinθ'], '名稱互換（sin→cos）；270° + θ 在第四象限，sin 為負 → −cosθ。'],
          ['三角恆等式', '下列哪一個恆等式正確？', ['1 + tan²θ = sec²θ', '1 + tan²θ = csc²θ', 'sin²θ − cos²θ = 1', '1 + cot²θ = sec²θ'], '平方關係：sin²θ + cos²θ = 1；1 + tan²θ = sec²θ；1 + cot²θ = csc²θ。'],
          { t: 'sinθ + cosθ 型', g: function (R) {
            var k = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [-1, 2], [-1, 3]]), p = k[0], q = k[1];
            return ['若 sinθ + cosθ = ' + H.frac(p, q) + '，則 sinθcosθ = ？', O(H.frac(p * p - q * q, 2 * q * q), [H.frac(q * q - p * p, 2 * q * q), H.frac(p * p + q * q, 2 * q * q), H.frac(p * p - q * q, q * q)]),
              '兩邊平方：1 + 2sinθcosθ = k² → sinθcosθ = (k² − 1)/2 = (' + H.frac(p * p, q * q) + ' − 1)/2 = ' + H.frac(p * p - q * q, 2 * q * q) + '。'];
          } },
          { t: '圖形週期振幅', g: function (R) {
            var a = R.nz(-5, 5), b = R.int(1, 4), d = R.int(-3, 3), mode = R.int(0, 2);
            var fn = 'y = ' + (a === 1 ? '' : a === -1 ? '−' : n(a)) + 'sin(' + (b === 1 ? '' : b) + 'x)' + (d ? (d > 0 ? ' + ' + d : ' − ' + (-d)) : '');
            if (mode === 0) return [fn + ' 的週期為何？', O(H.piFrac(2, b), [H.piFrac(1, b), H.piFrac(2 * b, 1), H.piFrac(4, b)]), '週期 = 2π/|b| = 2π/' + b + ' = ' + H.piFrac(2, b) + '。'];
            if (mode === 1) return [fn + ' 的最大值為何？', O(d + Math.abs(a), [d - Math.abs(a), Math.abs(a), a + d === d + Math.abs(a) ? -a + d : a + d], function (i) { return d + Math.abs(a) + i; }), '最大值 = d + |a| = ' + n(d) + ' + ' + Math.abs(a) + ' = ' + n(d + Math.abs(a)) + '。'];
            return [fn + ' 的最小值為何？', O(d - Math.abs(a), [d + Math.abs(a), -Math.abs(a), d], function (i) { return d - Math.abs(a) - i; }), '最小值 = d − |a| = ' + n(d) + ' − ' + Math.abs(a) + ' = ' + n(d - Math.abs(a)) + '。'];
          } },
          { t: '圖形週期振幅', g: function (R) {
            var b = R.int(1, 5);
            return ['y = tan(' + (b === 1 ? '' : b) + 'x) 的週期為何？', O(H.piFrac(1, b), [H.piFrac(2, b), H.piFrac(b, 1), H.piFrac(1, 2 * b)]), 'tan 的週期是 π/|b|（sin、cos 才是 2π/|b|）。'];
          } },
          ['圖形週期振幅', 'sin1 和 cos1（1 是弳）的大小關係為何？', ['sin1 > cos1', 'sin1 < cos1', 'sin1 = cos1', '無法比較'], '1 弳 ≈ 57.3° > 45°，所以 sin1 > cos1。'],
          { t: '三角函數最值', g: function (R) {
            var p = R.int(-3, 5), q = R.int(1, 6), mx = Math.random() < 0.5;
            return ['y = ' + n(p) + ' − ' + (q === 1 ? '' : q) + 'sinx 的' + (mx ? '最大值' : '最小值') + '為何？', O(mx ? p + q : p - q, [mx ? p - q : p + q, p, q], function (i) { return (mx ? p + q : p - q) + i; }),
              'sinx 範圍 −1～1。sinx = −1 時 y 最大 = ' + (p + q) + '；sinx = 1 時 y 最小 = ' + (p - q) + '。'];
          } },
          { t: '三角函數最值', g: function (R) {
            var c = R.int(-3, 4), mx = Math.random() < 0.5;
            return ['y = sin²x − 2sinx ' + (c >= 0 ? '+ ' + c : '− ' + (-c)) + ' 的' + (mx ? '最大值' : '最小值') + '為何？', O(mx ? c + 3 : c - 1, [mx ? c - 1 : c + 3, c, c + 1, c - 2]),
              '令 t = sinx（−1 ≤ t ≤ 1），y = (t − 1)² + ' + n(c - 1) + '。t = 1 時最小 ' + n(c - 1) + '；t = −1 時最大 4 + ' + n(c - 1) + ' = ' + n(c + 3) + '。記得 t 只能在 −1～1。'];
          } },
          { t: '餘弦定理', g: function (R) {
            var is60 = Math.random() < 0.5, t = R.pick(is60 ? T60 : T120);
            return ['△ABC 中，b = ' + t[0] + '、c = ' + t[1] + '、∠A = ' + (is60 ? 60 : 120) + '°，a = ？', O(t[2], [t[2] + 1, t[2] - 1, t[0] + t[1], is60 ? Math.round(Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[0] * t[1])) : Math.round(Math.sqrt(t[0] * t[0] + t[1] * t[1] - t[0] * t[1]))]),
              'a² = b² + c² − 2bc·cosA = ' + t[0] * t[0] + ' + ' + t[1] * t[1] + (is60 ? ' − ' : ' + ') + t[0] * t[1] + ' = ' + t[2] * t[2] + ' → a = ' + t[2] + '。'];
          } },
          { t: '三角形面積', g: function (R) {
            var C = R.pick([30, 150, 90, 60]), a = 2 * R.int(1, 6), b = 2 * R.int(1, 6), ans, ex;
            if (C === 90) { ans = String(a * b / 2); } else if (C === 60) { ans = (a * b / 4 === 1 ? '' : a * b / 4) + '√3'; } else { ans = String(a * b / 4); }
            ex = '面積 = ½·ab·sinC = ½ × ' + a + ' × ' + b + ' × sin' + C + '°。sin30° = sin150° = 1/2、sin60° = √3/2、sin90° = 1。';
            return ['△ABC 中，a = ' + a + '、b = ' + b + '、∠C = ' + C + '°，面積為何？', O(ans, [String(a * b / 2), String(a * b), (a * b / 4) + '√3', String(a * b / 4)]), ex];
          } },
          ['三角形面積', '三邊長 5、5、6 的三角形面積為何？（海龍公式）', ['12', '15', '24', '10'], 's = (5 + 5 + 6)/2 = 8；面積 = √[8·3·3·2] = √144 = 12。'],
          ['三角形面積', '三邊長 3、4、5 的三角形面積為何？', ['6', '12', '7.5', '10'], '3-4-5 是直角三角形，面積 = ½ × 3 × 4 = 6（海龍公式 s = 6，√(6·3·2·1) = 6）。'],
          { t: '正弦定理', g: function (R) {
            var A = R.pick([30, 150, 90, 45, 60]), k = R.int(2, 9), a, ans;
            if (A === 30 || A === 150) { a = String(k); ans = k; } else if (A === 90) { a = String(2 * k); ans = k; } else if (A === 45) { a = k + '√2'; ans = k; } else { a = k + '√3'; ans = k; }
            return ['△ABC 中，a = ' + a + '、∠A = ' + A + '°，外接圓半徑 R = ？', O(ans, [2 * ans, ans / 2 === Math.floor(ans / 2) ? ans / 2 : ans + 2, ans + 1]),
              '正弦定理 a/sinA = 2R → 2R = ' + a + ' ÷ sin' + A + '° = ' + 2 * ans + ' → R = ' + ans + '。'];
          } },
          ['正弦定理', '已知兩邊和其中一邊的對角（SSA），可以作出幾個三角形？', ['可能 0、1 或 2 個', '一定恰 1 個', '一定 2 個', '一定無解'], 'SSA 不是全等條件，可能無解、一解或兩解，要檢查。'],
          { t: '仰角測量', g: function (R) {
            var ang = R.pick([30, 45, 60]), d = 3 * R.int(2, 15), ans;
            ans = ang === 45 ? String(d) : ang === 60 ? d + '√3' : (d / 3) + '√3';
            return ['站在離塔底 ' + d + ' 公尺處，測得塔頂仰角 ' + ang + '°，塔高為何？（眼高不計）', O(ans + ' 公尺', [d + ' 公尺', d + '√3 公尺', (d / 3) + '√3 公尺', 2 * d + ' 公尺']),
              '塔高 = 距離 × tan(仰角) = ' + d + ' × tan' + ang + '°（tan30° = √3/3、tan45° = 1、tan60° = √3）。'];
          } }
        ]
      },
      {
        name: '平面向量',
        qs: [
          { t: '向量坐標與長度', g: function (R) {
            var t = R.pick(TRI), ax = R.int(-5, 5), ay = R.int(-5, 5), sx = R.sign(), sy = R.sign();
            var bx = ax + sx * t[0], by = ay + sy * t[1];
            return ['A' + H.pt(ax, ay) + '、B' + H.pt(bx, by) + '，|AB→| = ？', O(t[2], [t[0] + t[1], t[2] + 2, Math.abs(bx + ax) + Math.abs(by + ay)]),
              'AB→ = (x2 − x1, y2 − y1) = ' + H.pt(bx - ax, by - ay) + '，長度 = √(' + t[0] + '² + ' + t[1] + '²) = ' + t[2] + '。'];
          } },
          { t: '向量坐標與長度', g: function (R) {
            var t = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10]]), sx = R.sign(), sy = R.sign();
            return ['v→ = ' + H.pt(sx * t[0], sy * t[1]) + ' 的單位向量為何？', O('(' + H.frac(sx * t[0], t[2]) + ', ' + H.frac(sy * t[1], t[2]) + ')', ['(' + H.frac(sy * t[1], t[2]) + ', ' + H.frac(sx * t[0], t[2]) + ')', '(' + H.frac(-sx * t[0], t[2]) + ', ' + H.frac(-sy * t[1], t[2]) + ')', H.pt(sx * t[0], sy * t[1])]),
              '單位向量 = v→ ÷ |v→|，|v→| = ' + t[2] + '。'];
          } },
          { t: '內積計算', g: function (R) {
            var a = [R.int(-6, 6), R.int(-6, 6)], b = [R.int(-6, 6), R.int(-6, 6)], d = a[0] * b[0] + a[1] * b[1];
            return ['a→ = ' + H.pt(a[0], a[1]) + '、b→ = ' + H.pt(b[0], b[1]) + '，a→·b→ = ？', O(d, [a[0] * b[1] - a[1] * b[0], a[0] * b[0] - a[1] * b[1], -d], function (i) { return d + i; }),
              'a→·b→ = x1x2 + y1y2 = ' + n(a[0] * b[0]) + ' + ' + n(a[1] * b[1]) + ' = ' + n(d) + '。內積是「數」不是向量。'];
          } },
          { t: '平行與垂直', g: function (R) {
            var q = R.nz(-4, 4), r = R.nz(-5, 5), m = R.nz(-3, 3);
            return ['a→ = ' + H.pt(m * q, 'k') .replace("'k'", 'k') + '、b→ = ' + H.pt(q, r) + '，若 a→ ∥ b→，k = ？', O(m * r, [-m * r, r, m * q * r], function (i) { return m * r + i; }),
              '平行 ⇔ x1y2 − x2y1 = 0：' + n(m * q) + '·' + n(r) + ' − ' + n(q) + '·k = 0 → k = ' + n(m * r) + '。'];
          } },
          { t: '平行與垂直', g: function (R) {
            var y2 = R.pick([1, 2, 3, -1, -2, -3]), x1 = R.nz(-6, 6), x2 = y2 * R.nz(-3, 3), k = -x1 * x2 / y2;
            return ['a→ = (' + n(x1) + ', k)、b→ = ' + H.pt(x2, y2) + '，若 a→ ⊥ b→，k = ？', O(k, [-k, x1 * y2, k + 1]),
              '垂直 ⇔ a→·b→ = 0：' + n(x1) + '·' + n(x2) + ' + k·' + n(y2) + ' = 0 → k = ' + n(k) + '。'];
          } },
          { t: '內積與夾角', g: function (R) {
            var a = R.int(1, 6), b = 2 * R.int(1, 4), th = R.pick([60, 120, 90, 0]);
            var d = th === 60 ? a * b / 2 : th === 120 ? -a * b / 2 : th === 90 ? 0 : a * b;
            return ['|a→| = ' + a + '、|b→| = ' + b + '，兩向量夾角 ' + th + '°，a→·b→ = ？', O(d, [a * b, -d, a * b / 2 === Math.abs(d) ? a + b : a * b / 2], function (i) { return d + i; }),
              'a→·b→ = |a→||b→|cosθ = ' + a + ' × ' + b + ' × cos' + th + '° = ' + n(d) + '。'];
          } },
          { t: '內積與夾角', g: function (R) {
            var a = R.int(1, 6), b = 2 * R.int(1, 4), plus = Math.random() < 0.5, th = R.pick([60, 120]);
            var dot = th === 60 ? a * b / 2 : -a * b / 2, sq = a * a + b * b + (plus ? 2 : -2) * dot;
            return ['|a→| = ' + a + '、|b→| = ' + b + '、夾角 ' + th + '°，|a→ ' + (plus ? '+' : '−') + ' b→| = ？', O(H.sqrtS(sq), [H.sqrtS(a * a + b * b), H.sqrtS(a * a + b * b - (plus ? 2 : -2) * dot), String(plus ? a + b : Math.abs(a - b))]),
              '|a→ ± b→|² = |a→|² ± 2a→·b→ + |b→|² = ' + a * a + ' ' + (plus ? '+' : '−') + ' 2(' + n(dot) + ') + ' + b * b + ' = ' + sq + '，開根號 = ' + H.sqrtS(sq) + '。'];
          } },
          { t: '正射影', g: function (R) {
            var b = R.pick([[3, 4], [4, 3], [0, 5], [5, 0]]), x, y, d;
            do { x = R.int(-6, 6); y = R.int(-6, 6); d = x * b[0] + y * b[1]; } while (d % 5 !== 0 || d === 0);
            return ['a→ = ' + H.pt(x, y) + ' 在 b→ = ' + H.pt(b[0], b[1]) + ' 上的正射影長為何？', O(Math.abs(d) / 5, [Math.abs(d), Math.abs(d) / 25 === Math.floor(Math.abs(d) / 25) ? Math.abs(d) / 25 + 1 : Math.abs(d) / 5 + 2, Math.abs(d) / 5 + 1]),
              '正射影長 = |a→·b→| ÷ |b→| = |' + n(d) + '| ÷ 5 = ' + Math.abs(d) / 5 + '。正射影（向量）= (a→·b→ ÷ |b→|²)·b→。'];
          } },
          ['正射影', '下列敘述何者正確？', ['正射影是向量，正射影長是數', '內積的結果是向量', '正射影長可以是負數', '兩向量內積為 1 表示垂直'], '內積是數；正射影是向量、正射影長是數（取絕對值）；垂直 ⇔ 內積 = 0。'],
          { t: '向量求面積', g: function (R) {
            var a = [R.int(-5, 6), R.int(-5, 6)], b = [R.int(-5, 6), R.int(-5, 6)], D = a[0] * b[1] - a[1] * b[0];
            if (D === 0) { b[0] += 1; D = a[0] * b[1] - a[1] * b[0]; }
            if (D === 0) { a = [3, 1]; b = [1, 4]; D = 11; }
            var ar = Math.abs(D) / 2;
            return ['AB→ = ' + H.pt(a[0], a[1]) + '、AC→ = ' + H.pt(b[0], b[1]) + '，△ABC 面積為何？', O(ar, [Math.abs(D), Math.abs(a[0] * b[0] + a[1] * b[1]) / 2 === ar ? ar + 1 : Math.abs(a[0] * b[0] + a[1] * b[1]) / 2, ar + 0.5]),
              '面積 = ½|x1y2 − x2y1| = ½|' + n(a[0] * b[1]) + ' − ' + n(a[1] * b[0]) + '| = ' + ar + '。'];
          } },
          { t: '柯西不等式', g: function (R) {
            var t = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [1, 1, 0], [1, 2, 0], [2, 3, 0]]), r = R.int(1, 5);
            var q = t[0] * t[0] + t[1] * t[1], ans = t[2] ? String(r * t[2]) : (r === 1 ? '' : r) + '√' + q;
            return ['x² + y² = ' + r * r + '，' + (t[0] === 1 ? '' : t[0]) + 'x + ' + (t[1] === 1 ? '' : t[1]) + 'y 的最大值為何？', O(ans, [String(r * (t[0] + t[1])), String(r * r * q), t[2] ? String(r * r * t[2]) : (r * r) + '√' + q]),
              '柯西：(' + t[0] + '² + ' + t[1] + '²)(x² + y²) ≥ (' + t[0] + 'x + ' + t[1] + 'y)² → 最大值 = √' + q + ' × ' + r + ' = ' + ans + '。'];
          } },
          { t: '向量旋轉', g: function (R) {
            var a = R.nz(-6, 6), b = R.nz(-6, 6), ccw = Math.random() < 0.5;
            return ['向量 ' + H.pt(a, b) + ' ' + (ccw ? '逆時針（左轉）' : '順時針（右轉）') + '旋轉 90° 後為何？', O(ccw ? H.pt(-b, a) : H.pt(b, -a), [ccw ? H.pt(b, -a) : H.pt(-b, a), H.pt(-a, -b), H.pt(b, a)]),
              '逆時針 90°：(a, b) → (−b, a)；順時針 90°：(a, b) → (b, −a)。'];
          } }
        ]
      }
    ]
  });
})();
