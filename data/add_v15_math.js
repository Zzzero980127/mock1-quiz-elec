/* 由土木版 data/add_v24.js（v2.7）複製：只有數學（math 0～2）的變化圖會掛上；力學、測量的科目電子科沒有，會自動略過。若沒有 addTc 則設為空函式。 */
window.addTc = window.addTc || function () {};
/* v2.4：各單元的「變化圖」題型——每次出題，圖的結構（角度、支承、載重位置、方向、象限…）都跟著換，不只是換數字。
 * 力學：吊掛繩角度、共點力合成、梁（簡支／外伸／懸臂＋集中／均佈）、彎桿力矩、空間對角線力、桁架
 * 測量：方位角／象限角、斜距改正、水準測量路線
 * 數學：直角三角形（任意旋轉翻轉）、標準位置角、方格向量、直線與拋物線圖形
 * 一律用 addEasy／addHard／addTc 往後接，不插隊、不刪題。GF 是公開的繪圖工具，之後的新檔可以直接用。
 */
window.GF = (function () {
  var uid = 0;
  function r1(x) { return Math.round(x * 10) / 10; }
  function rad(d) { return d * Math.PI / 180; }
  function svg(w, h, body) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" class="qfig">' +
      '<defs><marker id="gfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>' + body + '</svg>';
  }
  function L(x1, y1, x2, y2, c) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" class="' + (c || '') + '"/>'; }
  function A(x1, y1, x2, y2, c) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" class="' + (c || '') + '" marker-end="url(#gfa)"/>'; }
  function T(x, y, s, an, c) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (an || 'middle') + '" class="' + (c || '') + '">' + String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>'; }
  function Rc(x, y, w, h, c) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" class="' + (c || '') + '"/>'; }
  function C(x, y, r, c) { return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" class="' + (c || '') + '"/>'; }
  function P(d, c) { return '<path d="' + d + '" class="' + (c || '') + '"/>'; }
  function poly(pts, c) { return P('M' + pts.map(function (p) { return r1(p[0]) + ',' + r1(p[1]); }).join(' L'), c); }
  function hH(x1, x2, y, up) { var s = L(x1, y, x2, y, 'thick'); for (var x = x1; x < x2; x += 12) s += L(x, y, x - 8, up ? y - 8 : y + 8, 'thin'); return s; }
  function hV(x, y1, y2, dir) { var s = L(x, y1, x, y2, 'thick'); for (var y = y1; y < y2; y += 12) s += L(x, y, x + dir * 8, y + 8, 'thin'); return s; }
  function pin(x, y) { return P('M' + r1(x) + ',' + r1(y) + ' l-10,18 l20,0 z', '') + hH(x - 16, x + 18, y + 18); }
  function pinTop(x, y) { return P('M' + r1(x) + ',' + r1(y) + ' l-10,-18 l20,0 z', '') + hH(x - 16, x + 18, y - 18, true); }
  function roller(x, y) { return C(x, y + 8, 8, '') + hH(x - 16, x + 18, y + 16); }
  // 圓弧：角度用數學方向（逆時針為正，0° 向右），從 a1 掃到 a2
  function arc(cx, cy, r, a1, a2, c) { var pts = []; for (var i = 0; i <= 14; i++) { var a = rad(a1 + (a2 - a1) * i / 14); pts.push([cx + r * Math.cos(a), cy - r * Math.sin(a)]); } return poly(pts, c || 'thin'); }
  function lab(cx, cy, r, a, s, c) { return T(cx + r * Math.cos(rad(a)), cy - r * Math.sin(rad(a)) + 4, s, 'middle', c || 'small'); }
  function dim(x1, x2, y, s) { return L(x1, y, x2, y, 'thin') + L(x1, y - 5, x1, y + 5, 'thin') + L(x2, y - 5, x2, y + 5, 'thin') + T((x1 + x2) / 2, y + 14, s, 'middle', 'small'); }
  function dimV(x, y1, y2, s, side) { return L(x, y1, x, y2, 'thin') + L(x - 5, y1, x + 5, y1, 'thin') + L(x - 5, y2, x + 5, y2, 'thin') + T(x + side * 7, (y1 + y2) / 2 + 4, s, side > 0 ? 'start' : 'end', 'small'); }
  function clip(x, y, w, h, body) { var id = 'gfc' + (++uid) + Math.floor(Math.random() * 1e6); return '<clipPath id="' + id + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '"/></clipPath><g clip-path="url(#' + id + ')">' + body + '</g>'; }
  return { r1: r1, rad: rad, svg: svg, L: L, A: A, T: T, Rc: Rc, C: C, P: P, poly: poly, hH: hH, hV: hV, pin: pin, pinTop: pinTop, roller: roller, arc: arc, lab: lab, dim: dim, dimV: dimV, clip: clip };
})();

(function () {
  var H = QH, O = H.opts, D = H.dec, n = H.n, F = H.frac, G = GF, rad = G.rad;
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function sq(v) { return (v < 0 ? '(' + n(v) + ')' : v) + '²'; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // 常用角度 [sin, cos]
  var TG = { 0: [0, 1], 30: [0.5, 0.866], 37: [0.6, 0.8], 45: [0.707, 0.707], 53: [0.8, 0.6], 60: [0.866, 0.5], 90: [1, 0] };
  function trigTxt(list) {
    var seen = {}, out = [];
    list.forEach(function (a) { if (a && a !== 90 && !seen[a]) { seen[a] = 1; out.push(a === 45 ? 'sin45° = cos45° = 0.707' : 'sin' + a + '° = ' + TG[a][0] + '、cos' + a + '° = ' + TG[a][1]); } });
    return out.join('；');
  }
  function U(u) { return function (x) { return D(x, 2) + ' ' + u; }; }
  function more(f, ans) { return function (k) { return f(ans * (1 + (k % 2 ? 1 : -1) * 0.1 * Math.ceil(k / 2)) + (ans === 0 ? k : 0)); }; }
  // 方向角 th = base + 90k 的 [cos, sin]
  function dirCS(base, k) { var c = TG[base][1], s = TG[base][0]; return [[c, s], [-s, c], [-c, -s], [s, -c]][k]; }
  // 與 x 軸的銳角及量角起點
  function refX(th) { th = ((th % 360) + 360) % 360; if (th <= 90) return [0, th]; if (th <= 180) return [180, 180 - th]; if (th <= 270) return [180, th - 180]; return [360, 360 - th]; }

  /* ================= 力學 ================= */

  // 兩繩吊掛：角度任意組合，有時一條是水平繩接牆
  function hangFig(a, b, W) {
    var h = 105, dl, dr;
    for (var i = 0; i < 40; i++) { dl = a ? h / Math.tan(rad(a)) : 110; dr = b ? h / Math.tan(rad(b)) : 110; if (dl + dr <= 300) break; h -= 4; }
    var cy = 32 + h, cx = 30 + dl + (300 - dl - dr) / 2, ax = cx - dl, bx = cx + dr, ay = a ? 32 : cy, by = b ? 32 : cy, s = '';
    s += G.hH(a ? ax - 18 : ax, b ? bx + 18 : bx, 32, true);
    if (!a) s += G.hV(ax, 32, cy + 40, -1);
    if (!b) s += G.hV(bx, 32, cy + 40, 1);
    s += G.L(ax, ay, cx, cy, 'acc') + G.L(bx, by, cx, cy, 'acc') + G.C(cx, cy, 3, 'dot');
    s += G.L(cx, cy, cx, cy + 26) + G.Rc(cx - 30, cy + 26, 60, 30, 'fill2 acc') + G.T(cx, cy + 46, W + ' N');
    s += G.L(cx - 55, cy, cx + 55, cy, 'thin dash');
    if (a) s += G.arc(cx, cy, 26, 180, 180 - a) + G.lab(cx, cy, 40, 180 - a / 2, a + '°');
    if (b) s += G.arc(cx, cy, 26, 0, b) + G.lab(cx, cy, 40, b / 2, b + '°');
    s += a ? G.T(ax - 6, ay + 16, 'A', 'end') : G.T(ax + 6, ay - 6, 'A', 'start');
    s += b ? G.T(bx + 6, by + 16, 'B', 'start') : G.T(bx - 6, by - 6, 'B', 'end');
    s += G.T(cx + 10, cy + 18, 'C', 'start');
    return G.svg(360, cy + 66, s);
  }
  function hang() {
    var ks = [30, 37, 45, 53, 60], a = pick(ks), b = pick(ks), W = pick([60, 80, 100, 120, 150, 200]);
    if (Math.random() < 0.3) { if (Math.random() < 0.5) a = 0; else b = 0; }
    var sa = TG[a][0], ca = TG[a][1], sb = TG[b][0], cb = TG[b][1], den = sa * cb + ca * sb, T1 = W * cb / den, T2 = W * ca / den, askA = Math.random() < 0.5;
    var dA = a ? '與水平夾 ' + a + '°' : '為水平', dB = b ? '與水平夾 ' + b + '°' : '為水平', N = U('N'), ans = askA ? T1 : T2;
    return ['如圖，重 ' + W + ' N 的物體以繩 AC、BC 吊住，繩 AC ' + dA + '，繩 BC ' + dB + '，繩 ' + (askA ? 'AC' : 'BC') + ' 的張力為何？（' + trigTxt([a, b]) + '）',
      O(N(ans), [N(askA ? T2 : T1), N(W / 2), N(W * (askA ? ca : cb)), N(W)], more(N, ans)),
      '節點 C 平衡（水平繩的角度當 0°）：\n水平：T_AC × cos' + a + '° = T_BC × cos' + b + '°\n鉛直：T_AC × sin' + a + '° + T_BC × sin' + b + '° = ' + W + '\n解得 T_AC = ' + N(T1) + '、T_BC = ' + N(T2) + '。\n（拉密定理也可以：每條繩張力 ÷ 對角的 sin 相等。）', hangFig(a, b, W)];
  }

  // 共點力合成：2～3 個力，方向在任意象限
  function forces() {
    var nF = pick([2, 3, 3]), used = {}, fs = [], max = 0, guard = 0;
    while (fs.length < nF && guard++ < 100) {
      var base = pick([0, 30, 37, 45, 53, 60]), k = ri(0, 3), th = base + 90 * k;
      if (used[th]) continue; used[th] = 1;
      var cs = dirCS(base, k), m = pick([20, 30, 40, 50, 60, 80, 100]);
      fs.push({ th: th, c: cs[0], s: cs[1], m: m }); if (m > max) max = m;
    }
    var Rx = 0, Ry = 0, sum = 0, refs = [], Ox = 180, Oy = 125;
    var s = G.L(25, Oy, 335, Oy, 'thin') + G.L(Ox, 12, Ox, 238, 'thin') + G.T(340, Oy + 4, 'x', 'start') + G.T(Ox + 6, 16, 'y', 'start') + G.T(Ox - 6, Oy + 16, 'O', 'end');
    var ex = [];
    fs.forEach(function (f, i) {
      Rx += f.m * f.c; Ry += f.m * f.s; sum += f.m;
      var len = 40 + 62 * f.m / max, tx = Ox + len * f.c, ty = Oy - len * f.s;
      s += G.A(Ox, Oy, tx, ty, 'acc') + G.T(Ox + (len + 18) * f.c, Oy - (len + 18) * f.s + 4, 'F' + (i + 1) + ' = ' + f.m + ' N', 'middle', 'small');
      var rf = refX(f.th);
      if (rf[1] % 90) { refs.push(rf[1]); var r = 20 + i * 9; s += G.arc(Ox, Oy, r, rf[0], f.th) + G.lab(Ox, Oy, r + 11, (rf[0] + f.th) / 2, rf[1] + '°'); }
      ex.push('F' + (i + 1) + '：x 分量 ' + D(f.m * f.c, 2) + '、y 分量 ' + D(f.m * f.s, 2));
    });
    var R = Math.sqrt(Rx * Rx + Ry * Ry), ask = pick(['Rx', 'Ry', 'R', 'R']), N = U('N'), q, op;
    var base2 = '如圖，' + nF + ' 個力作用於 O 點（角度為各力與 x 軸的夾角），';
    if (ask === 'Rx') { q = base2 + '合力的 x 分量為何？'; op = O(N(Rx), [N(-Rx), N(Ry), N(-Ry), N(R)], more(N, Rx)); }
    else if (ask === 'Ry') { q = base2 + '合力的 y 分量為何？'; op = O(N(Ry), [N(-Ry), N(Rx), N(-Rx), N(R)], more(N, Ry)); }
    else { q = base2 + '合力的大小為何？'; op = O(N(R), [N(sum), N(Math.abs(Rx) + Math.abs(Ry)), N(Math.abs(Rx)), N(Math.abs(Ry))], more(N, R)); }
    var t = trigTxt(refs);
    return [q + (t ? '（' + t + '）' : ''), op, ex.join('\n') + '\nRx = ' + D(Rx, 2) + ' N、Ry = ' + D(Ry, 2) + ' N\nR = √(Rx² + Ry²) = ' + N(R) + '。\n（向右、向上為正，向左、向下為負。）', G.svg(360, 245, s)];
  }

  // 梁：簡支／外伸／懸臂（固定端在左或右），集中載重＋均佈載重，位置都隨機
  function beamFig(Lm, type, xA, xB, loads, udl, fixR) {
    var x0 = 40, x1 = 320, y = 118, sc = (x1 - x0) / Lm, X = function (m) { return x0 + m * sc; }, s = G.Rc(x0, y, x1 - x0, 9, 'fill2 acc');
    if (type === 'ca') { var wx = fixR ? x1 : x0; s += G.hV(wx, y - 48, y + 52, fixR ? 1 : -1) + G.T(fixR ? wx + 6 : wx - 6, y - 54, 'A', fixR ? 'start' : 'end'); }
    else s += G.pin(X(xA), y + 9) + G.roller(X(xB), y + 9) + G.T(X(xA) - 13, y + 26, 'A', 'end') + G.T(X(xB) + 13, y + 26, 'B', 'start');
    if (udl) {
      var xs = X(udl.s), xe = X(udl.e), k = Math.max(2, Math.round((xe - xs) / 18));
      s += G.L(xs, y - 24, xe, y - 24, 'thin');
      for (var i = 0; i <= k; i++) s += G.A(xs + (xe - xs) * i / k, y - 24, xs + (xe - xs) * i / k, y - 1, 'thin');
      s += G.T((xs + xe) / 2, y - 30, 'w = ' + udl.w + ' kN/m', 'middle', 'small');
    }
    var last = -99;
    loads.slice().sort(function (p, q) { return p.x - q.x; }).forEach(function (p, i) {
      var px = X(p.x), up = (px - last < 46 && i % 2) ? 14 : 0; last = px;
      s += G.A(px, y - 58, px, y - 2, 'acc') + G.T(px, y - 64 - up, p.P + ' kN');
    });
    var pts = [0, Lm].concat(loads.map(function (p) { return p.x; }));
    if (type !== 'ca') pts.push(xA, xB);
    if (udl) pts.push(udl.s, udl.e);
    pts = pts.filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(function (p, q) { return p - q; });
    for (var j = 0; j + 1 < pts.length; j++) { var w = (pts[j + 1] - pts[j]) * sc; s += G.dim(X(pts[j]), X(pts[j + 1]), y + 60, (pts[j + 1] - pts[j]) + (w > 34 ? ' m' : '')); }
    return G.svg(360, 205, s);
  }
  function beamGen(hard) {
    for (var tries = 0; tries < 80; tries++) {
      var type = hard ? pick(['ss', 'oh', 'oh', 'ca']) : pick(['ss', 'ss', 'ca']), Lm = ri(6, 12), xA = 0, xB = Lm, fixR = Math.random() < 0.4;
      if (type === 'oh') { var o1 = pick([0, 1, 2, 3]), o2 = pick([0, 1, 2, 3]); if (!o1 && !o2) o2 = 2; xA = o1; xB = Lm - o2; if (xB - xA < 4) continue; }
      var udl = null;
      if (Math.random() < (hard ? 0.55 : 0.25)) { var s0 = ri(0, Lm - 2); udl = { s: s0, e: ri(s0 + 2, Lm), w: pick([2, 3, 4, 5, 6]) }; if (!hard) { udl.s = 0; udl.e = Lm; } }
      var loads = [], used = {}, np = ri(udl ? 0 : 1, hard ? 3 : 2);
      for (var i = 0; i < np; i++) {
        var x = ri(1, Lm - 1); if (type === 'oh' && Math.random() < 0.5) x = pick([0, Lm]);
        if (used[x] || (type !== 'ca' && (x === xA || x === xB))) continue; used[x] = 1; loads.push({ x: x, P: pick([5, 10, 15, 20, 30, 40]) });
      }
      if (!loads.length && !udl) continue;
      var eq = loads.map(function (p) { return { P: p.P, x: p.x, t: p.P + ' kN' }; });
      if (udl) eq.push({ P: udl.w * (udl.e - udl.s), x: (udl.s + udl.e) / 2, t: '均佈 ' + udl.w + '×' + (udl.e - udl.s) + ' = ' + udl.w * (udl.e - udl.s) + ' kN' });
      var tot = 0; eq.forEach(function (p) { tot += p.P; });
      var fig = beamFig(Lm, type, xA, xB, loads, udl, fixR), N = U('kN'), M = U('kN·m');
      var udlTxt = udl ? '（均佈載重先換成集中力，作用在均佈範圍中點）' : '';
      if (type === 'ca') {
        var xf = fixR ? Lm : 0, Mm = 0, terms = [];
        eq.forEach(function (p) { var d = Math.abs(p.x - xf); Mm += p.P * d; terms.push(p.P + '×' + d); });
        if (Math.random() < 0.7) return ['如圖之懸臂梁（A 為固定端），固定端 A 的彎矩（反力矩）大小為何？', O(M(Mm), [M(tot * Lm), M(tot * Lm / 2), M(Mm / 2), M(Mm + tot)], more(M, Mm)),
          udlTxt + '\n對 A 取矩：M_A = ' + terms.join(' + ') + ' = ' + M(Mm) + '。\n每個力乘上它到固定端的水平距離。', fig];
        return ['如圖之懸臂梁（A 為固定端），固定端 A 的垂直反力為何？', O(N(tot), [N(tot / 2), N(Mm / Lm), N(tot * 2)], more(N, tot)), udlTxt + '\nΣFy = 0：R_A = 全部載重 = ' + eq.map(function (p) { return p.P; }).join(' + ') + ' = ' + N(tot) + '。', fig];
      }
      var span = xB - xA, mB = 0, tb = [];
      eq.forEach(function (p) { mB += p.P * (p.x - xA); tb.push(p.P + '×' + n(p.x - xA)); });
      var RB = mB / span, RA = tot - RB;
      if (RA <= 0.01 || RB <= 0.01) continue;
      var askA = Math.random() < 0.5, ans = askA ? RA : RB, nm = type === 'ss' ? '簡支梁' : '外伸梁';
      return ['如圖之' + nm + '（A 為鉸支承、B 為滾支承），支承 ' + (askA ? 'A' : 'B') + ' 的垂直反力為何？', O(N(ans), [N(askA ? RB : RA), N(tot / 2), N(tot), N(mB / Lm)], more(N, ans)),
        udlTxt + '\n對 A 取矩（A 右邊為正距離）：R_B × ' + span + ' = ' + tb.join(' + ') + ' = ' + D(mB, 2) + '\n→ R_B = ' + N(RB) + '；R_A = ' + D(tot, 2) + ' − ' + D(RB, 2) + ' = ' + N(RA) + '。', fig];
    }
    return beamGen(false);
  }

  // 彎桿力矩：O 為支點，A 點受斜向力，彎桿方向、力的方向都隨機
  function moment() {
    for (var t = 0; t < 50; t++) {
      var sx = pick([1, -1]), sy = pick([1, -1]), dx = ri(2, 5), dy = ri(1, 4), Fm = pick([10, 20, 30, 40, 50]), base = pick([0, 30, 37, 45, 53, 60]), k = ri(0, 3), th = base + 90 * k;
      var cs = dirCS(base, k), Fx = Fm * cs[0], Fy = Fm * cs[1], x = sx * dx, y = sy * dy, Mo = x * Fy - y * Fx;
      if (Math.abs(Mo) < 0.5) continue;
      var kx = 38, ky = 34, Ox = sx > 0 ? 80 : 280, Oy = sy > 0 ? 195 : 55, Ax = Ox + x * kx, Ay = Oy - y * ky;
      var dvx = cs[0], dvy = -cs[1], len = 62, tipx = Ax + dvx * len, tipy = Ay + dvy * len, pull = tipx > 15 && tipx < 345 && tipy > 12 && tipy < 235;
      var s = G.L(Ox, Oy, Ax, Oy, 'thick2 acc') + G.L(Ax, Oy, Ax, Ay, 'thick2 acc') + (sy > 0 ? G.pin(Ox, Oy + 3) : G.pinTop(Ox, Oy - 3)) + G.C(Ox, Oy, 3.5, 'dot') + G.C(Ax, Ay, 3, 'dot');
      s += G.T(Ox + (sx > 0 ? -16 : 16), Oy + 4, 'O', sx > 0 ? 'end' : 'start') + G.T(Ax + sx * 10, Ay + (sy > 0 ? -6 : 14), 'A', sx > 0 ? 'start' : 'end');
      var vis;
      if (pull) { s += G.A(Ax, Ay, tipx, tipy, 'acc'); vis = th; s += G.T(tipx + dvx * 12, tipy + dvy * 12 + 4, 'F = ' + Fm + ' kN', 'middle', 'small'); }
      else { var tx = Ax - dvx * len, ty = Ay - dvy * len; s += G.A(tx, ty, Ax - dvx * 3, Ay - dvy * 3, 'acc'); vis = th + 180; s += G.T(tx - dvx * 12, ty - dvy * 12 + 4, 'F = ' + Fm + ' kN', 'middle', 'small'); }
      vis = ((vis % 360) + 360) % 360;
      var rf = refX(vis);
      s += G.L(Ax - 40, Ay, Ax + 40, Ay, 'thin dash');
      if (rf[1] % 90) s += G.arc(Ax, Ay, 22, rf[0], vis) + G.lab(Ax, Ay, 34, (rf[0] + vis) / 2, rf[1] + '°');
      s += G.dim(Math.min(Ox, Ax), Math.max(Ox, Ax), Oy + (sy > 0 ? 28 : -34), dx + ' m') + G.dimV(Ax + sx * 26, Math.min(Oy, Ay), Math.max(Oy, Ay), dy + ' m', sx);
      var Mu = U('kN·m'), dir = function (v) { return D(Math.abs(v), 2) + ' kN·m（' + (v > 0 ? '逆' : '順') + '時針）'; };
      var t2 = trigTxt([rf[1]]);
      return ['如圖，彎桿以 O 為支點，A 點受力 F = ' + Fm + ' kN（方向如圖），F 對 O 點的力矩為何？' + (t2 ? '（' + t2 + '）' : ''),
        O(dir(Mo), [dir(-Mo), dir(x * Fy || 1), dir(-y * Fx || 1), Mu(Fm * Math.sqrt(dx * dx + dy * dy))], function (q) { return dir(Mo * (1 + 0.2 * q)); }),
        '以 O 為原點，A 的坐標 (' + n(x) + ', ' + n(y) + ') m。\nFx = ' + D(Fx, 2) + '、Fy = ' + D(Fy, 2) + ' kN（向右、向上為正）。\nM_O = x·Fy − y·Fx = (' + n(x) + ')(' + D(Fy, 2) + ') − (' + n(y) + ')(' + D(Fx, 2) + ') = ' + D(Mo, 2) + ' kN·m\n正值為逆時針、負值為順時針。', G.svg(360, 245, s)];
    }
    return moment();
  }

  // 空間力：沿長方體對角線，長寬高與要問的分量都隨機
  function space() {
    var Qs = [[1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [1, 4, 8, 9], [4, 4, 7, 9], [6, 6, 7, 11], [3, 4, 12, 13], [2, 2, 1, 3]];
    var q = pick(Qs), k = Math.max(...q.slice(0, 3)) <= 6 ? pick([1, 2]) : 1, idx = shuffle([0, 1, 2]), dm = idx.map(function (i) { return q[i] * k; }), d = q[3] * k, m = pick([2, 5, 10, 20]), Fm = m * q[3];
    var cm = dm.map(function (v) { return Fm * v / d; }), ax = ['x', 'y', 'z'];
    var X = dm[0], Y = dm[1], Z = dm[2], s0 = Math.min(170 / (Y + 0.55 * X), 150 / (Z + 0.42 * X)), Ox = 40 + 0.55 * X * s0, Oy = 48 + Z * s0;
    var P = function (x, y, z) { return [Ox + y * s0 - 0.55 * x * s0, Oy - z * s0 + 0.42 * x * s0]; };
    var s = '', E = function (p1, p2, c) { var a = P.apply(null, p1), b = P.apply(null, p2); return G.L(a[0], a[1], b[0], b[1], c); };
    var cn = [[0, 0, 0], [X, 0, 0], [0, Y, 0], [0, 0, Z], [X, Y, 0], [X, 0, Z], [0, Y, Z], [X, Y, Z]];
    var edges = [[1, 4], [1, 5], [2, 4], [2, 6], [3, 5], [3, 6], [4, 7], [5, 7], [6, 7]];
    edges.forEach(function (e) { s += E(cn[e[0]], cn[e[1]], 'thin'); });
    var o = P(0, 0, 0), px = P(X, 0, 0), py = P(0, Y, 0), pz = P(0, 0, Z), ex = [px[0] - 20, px[1] + 15], ey = [py[0] + 28, py[1]], ez = [pz[0], pz[1] - 24];
    s += G.L(o[0], o[1], px[0], px[1], 'thin dash') + G.L(o[0], o[1], py[0], py[1], 'thin dash') + G.L(o[0], o[1], pz[0], pz[1], 'thin dash');
    s += G.A(px[0], px[1], ex[0], ex[1], 'thin') + G.A(py[0], py[1], ey[0], ey[1], 'thin') + G.A(pz[0], pz[1], ez[0], ez[1], 'thin');
    s += G.T(ex[0] - 6, ex[1] + 6, 'x', 'end') + G.T(ey[0] + 6, ey[1] + 4, 'y', 'start') + G.T(ez[0] + 6, ez[1] + 4, 'z', 'start');
    var b = P(X, Y, Z); s += G.A(o[0], o[1], b[0], b[1], 'thick acc') + G.T(o[0] - 6, o[1] - 6, 'O', 'end') + G.T(b[0] + 6, b[1] - 4, 'B', 'start');
    var m1 = P(X, Y / 2, 0), m2 = P(X / 2, Y, 0), m3 = P(X, Y, Z / 2);
    s += G.T(m1[0], m1[1] + 16, Y + ' m', 'middle', 'small') + G.T(m2[0] + 8, m2[1] + 14, X + ' m', 'start', 'small') + G.T(m3[0] + 8, m3[1], Z + ' m', 'start', 'small');
    var ask = ri(0, 3), N = U('N'), fig = G.svg(360, Oy + 0.42 * X * s0 + 45, s);
    var ex1 = '對角線長 OB = √(' + X + '² + ' + Y + '² + ' + Z + '²) = ' + d + ' m。\n分量 = F × (該方向邊長 / 對角線長)：Fx = ' + Fm + '×' + X + '/' + d + ' = ' + D(cm[0], 2) + '、Fy = ' + D(cm[1], 2) + '、Fz = ' + D(cm[2], 2) + ' N。';
    if (ask === 3) {
      var a2 = ri(0, 2);
      return ['如圖，力 F = ' + Fm + ' N 由 O 點沿長方體對角線指向 B 點，F 與 ' + ax[a2] + ' 軸夾角 θ 的 cosθ 為何？', O(F(dm[a2], d), [F(dm[(a2 + 1) % 3], d), F(dm[(a2 + 2) % 3], d), F(dm[a2], dm[(a2 + 1) % 3] + dm[(a2 + 2) % 3])], function (k2) { return F(dm[a2] + k2, d); }),
        ex1 + '\n方向餘弦 cosθ' + ax[a2] + ' = ' + dm[a2] + '/' + d + '。', fig];
    }
    return ['如圖，力 F = ' + Fm + ' N 由 O 點沿長方體對角線指向 B 點，F 在 ' + ax[ask] + ' 方向的分量為何？', O(N(cm[ask]), [N(cm[(ask + 1) % 3]), N(cm[(ask + 2) % 3]), N(Fm / 3), N(Fm * dm[ask] / (X + Y + Z))], more(N, cm[ask])), ex1, fig];
  }

  // 桁架：三角形（頂點位置不對稱）或中柱桁架（載重在頂點或中柱下方）
  function truss() {
    var king = Math.random() < 0.45, h = pick([3, 4]), c, r;
    if (king) { c = r = pick([3, 4, 6]); } else { c = pick([3, 4, h]); r = pick([3, 4, 6]); if (c === r) r = c === 3 ? 4 : 3; }
    var Lm = c + r, Pm = pick([12, 18, 24, 30, 36, 48]), atD = king && Math.random() < 0.5;
    var LAC = Math.sqrt(c * c + h * h), LBC = Math.sqrt(r * r + h * h), RA = Pm * r / Lm, RB = Pm * c / Lm;
    var mem = { AC: [RA * LAC / h, '壓力'], BC: [RB * LBC / h, '壓力'], AB: [RA * c / h, '拉力'] };
    if (king) { mem = { AC: mem.AC, BC: mem.BC, AD: [RA * c / h, '拉力'], DB: [RB * r / h, '拉力'], CD: [atD ? Pm : 0, '拉力'] }; }
    var keys = Object.keys(mem), ask = king && Math.random() < 0.4 ? 'CD' : pick(keys), v = mem[ask];
    var f = function (val, ty) { return Math.abs(val) < 1e-9 ? '0（零力桿）' : D(val, 2) + ' kN（' + ty + '）'; };
    var cands = [f(v[0], v[1] === '拉力' ? '壓力' : '拉力')]; keys.forEach(function (k2) { if (k2 !== ask) cands.push(f(mem[k2][0], v[1])); }); cands.push(f(Pm / 2, v[1]), f(Pm, v[1]));
    // 圖
    var sc = Math.min(245 / Lm, 115 / h), Ax = 50, Ay = 175, Bx = Ax + Lm * sc, Cx = Ax + c * sc, Cy = Ay - h * sc, s = '';
    var ln = [[Ax, Ay, Cx, Cy], [Cx, Cy, Bx, Ay], [Ax, Ay, Bx, Ay]]; if (king) ln.push([Cx, Cy, Cx, Ay]);
    ln.forEach(function (p) { s += G.L(p[0], p[1], p[2], p[3], 'thick acc'); });
    s += G.pin(Ax, Ay + 4) + G.roller(Bx, Ay + 4) + G.C(Ax, Ay, 3.5, 'dot') + G.C(Bx, Ay, 3.5, 'dot') + G.C(Cx, Cy, 3.5, 'dot');
    s += G.T(Ax - 14, Ay + 4, 'A', 'end') + G.T(Bx + 14, Ay + 4, 'B', 'start') + G.T(Cx + (king ? 10 : 0), Cy - 10, 'C', king ? 'start' : 'middle');
    if (king) s += G.C(Cx, Ay, 3.5, 'dot') + G.T(Cx + 8, Ay + 16, 'D', 'start');
    if (atD) s += G.A(Cx, Ay + 4, Cx, Ay + 44, 'acc') + G.T(Cx + 8, Ay + 42, 'P = ' + Pm + ' kN', 'start', 'small');
    else s += G.A(Cx, Cy - 50, Cx, Cy - 4, 'acc') + G.T(Cx + 8, Cy - 42, 'P = ' + Pm + ' kN', 'start', 'small');
    s += G.dim(Ax, Cx, Ay + 60, c + ' m') + G.dim(Cx, Bx, Ay + 60, r + ' m') + G.dimV(Bx + 30, Cy, Ay, h + ' m', 1);
    var exp = '反力：R_A = P × ' + r + '/' + Lm + ' = ' + D(RA, 2) + ' kN、R_B = ' + D(RB, 2) + ' kN。\n節點 A：AC 的垂直分量 = R_A → AC = R_A × ' + D(LAC, 3) + '/' + h + ' = ' + D(mem.AC[0], 2) + ' kN（壓）；水平分量由 ' + (king ? 'AD' : 'AB') + ' 平衡 = ' + D(RA * c / h, 2) + ' kN（拉）。\n節點 B：BC = R_B × ' + D(LBC, 3) + '/' + h + ' = ' + D(mem.BC[0], 2) + ' kN（壓）。';
    if (king) exp += '\n節點 D：只有 AD、DB 在同一直線，CD 是唯一的垂直桿 → ' + (atD ? 'CD 要吊住 P，CD = ' + Pm + ' kN（拉）。' : 'D 點沒有外力，CD 為零力桿。');
    return ['如圖之桁架，P 作用於 ' + (atD ? 'D' : 'C') + ' 點，桿件 ' + ask + ' 的內力為何？', O(f(v[0], v[1]), cands, function (k2) { return f(v[0] + 3 * k2, v[1]); }), exp, G.svg(360, 255, s)];
  }

  /* ================= 測量 ================= */

  function fmAng(t) { t = ((t % 21600) + 21600) % 21600; var d = Math.floor(t / 60), m = t % 60; return d + '°' + (m < 10 ? '0' : '') + m + '′'; }
  function bearingOf(az) { az = ((az % 21600) + 21600) % 21600; if (az <= 5400) return ['N', az, 'E']; if (az <= 10800) return ['S', 10800 - az, 'E']; if (az <= 16200) return ['S', az - 10800, 'W']; return ['N', 21600 - az, 'W']; }
  function bTxt(b) { return b[0] + ' ' + fmAng(b[1]) + ' ' + b[2]; }
  function azFig(az, showB) {
    var Ox = 180, Oy = 122, s = G.A(Ox, Oy, Ox, 20, 'thin') + G.T(Ox, 15, 'N') + G.L(Ox, Oy, Ox, 222, 'thin dash') + G.T(Ox, 236, 'S') + G.L(80, Oy, 280, Oy, 'thin dash') + G.T(290, Oy + 4, 'E', 'start') + G.T(70, Oy + 4, 'W', 'end');
    var deg = az / 60, ex = Ox + 92 * Math.sin(rad(deg)), ey = Oy - 92 * Math.cos(rad(deg));
    s += G.L(Ox, Oy, ex, ey, 'thick acc') + G.C(Ox, Oy, 3, 'dot') + G.C(ex, ey, 3, 'dot') + G.T(Ox - 8, Oy + 16, 'O', 'end') + G.T(ex + 10 * Math.sin(rad(deg)), ey - 10 * Math.cos(rad(deg)) + 4, 'A');
    if (!showB) s += G.arc(Ox, Oy, 30, 90, 90 - deg) + G.lab(Ox, Oy, 50, 90 - deg / 2, fmAng(az), 'small');
    else {
      var b = bearingOf(az), bd = b[1] / 60, st = b[0] === 'N' ? 90 : 270, sg = (b[0] === 'N') === (b[2] === 'E') ? -1 : 1;
      s += G.arc(Ox, Oy, 30, st, st + sg * bd) + G.lab(Ox, Oy, 50, st + sg * bd / 2, fmAng(b[1]), 'small');
    }
    return G.svg(360, 245, s);
  }
  function azimuth() {
    var az = ri(0, 3) * 5400 + ri(8, 82) * 60 + ri(0, 59), b = bearingOf(az), ask = pick(['toB', 'toB', 'toAz', 'back']);
    var flipNS = function (x) { return x === 'N' ? 'S' : 'N'; }, flipEW = function (x) { return x === 'E' ? 'W' : 'E'; };
    if (ask === 'toB') return ['如圖，直線 OA 的方位角（由北順時針量）如圖所示，OA 的象限角為何？', O(bTxt(b), [bTxt([flipNS(b[0]), b[1], b[2]]), bTxt([b[0], b[1], flipEW(b[2])]), bTxt([b[0], 5400 - b[1], b[2]]), bTxt([flipNS(b[0]), b[1], flipEW(b[2])])]),
      '方位角 ' + fmAng(az) + ' 落在第 ' + (Math.floor(Math.min(az, 21599) / 5400) + 1) + ' 象限：\n0～90° → N θ E；90～180° → S (180° − θ) E；180～270° → S (θ − 180°) W；270～360° → N (360° − θ) W。\n所以象限角為 ' + bTxt(b) + '。', azFig(az, false)];
    if (ask === 'toAz') return ['如圖，直線 OA 的象限角為 ' + bTxt(b) + '，OA 的方位角為何？', O(fmAng(az), [fmAng(b[1]), fmAng(10800 - b[1]), fmAng(21600 - b[1]), fmAng(10800 + b[1]), fmAng(az + 10800)]),
      b[0] + '…' + b[2] + ' 象限：' + (b[0] === 'N' && b[2] === 'E' ? '方位角 = θ' : b[0] === 'S' && b[2] === 'E' ? '方位角 = 180° − θ' : b[0] === 'S' ? '方位角 = 180° + θ' : '方位角 = 360° − θ') + ' = ' + fmAng(az) + '。', azFig(az, true)];
    var back = az + 10800;
    return ['如圖，直線 OA 的方位角如圖所示，其反方位角（AO 的方位角）為何？', O(fmAng(back), [fmAng(21600 - az), fmAng(10800 - az), fmAng(az + 5400), fmAng(az)]),
      '反方位角 = 方位角 ± 180°（結果要落在 0°～360°）：' + fmAng(az) + (az < 10800 ? ' + ' : ' − ') + '180° = ' + fmAng(back) + '。', azFig(az, false)];
  }

  // 斜距改正：已知高差或傾斜角，坡向左右隨機
  function slope() {
    var S = ri(2500, 9500) / 100, mode = pick(['h', 'a']), right = Math.random() < 0.5, h, a, Hd, ask, q, op, ex, M = function (x) { return D(x, 3) + ' m'; };
    var Ax = right ? 40 : 320, Ay = 185, vis = mode === 'h' ? 16 : 0;
    if (mode === 'h') {
      h = ri(120, 900) / 100; Hd = Math.sqrt(S * S - h * h);
      q = '如圖，以捲尺沿斜坡量得 AB 斜距 S = ' + S.toFixed(2) + ' m，A、B 兩點高差 h = ' + h.toFixed(2) + ' m，AB 的水平距離為何？';
      op = O(M(Hd), [M(S - h), M(Math.sqrt(S * S + h * h)), M(S - h * h / S), M(S)]);
      ex = '水平距離 = √(S² − h²) = √(' + S.toFixed(2) + '² − ' + h.toFixed(2) + '²) = ' + M(Hd) + '。\n（近似式：傾斜改正 = −h²/(2S) = ' + D(-h * h / (2 * S), 4) + ' m，結果幾乎相同。）';
    } else {
      a = ri(3, 18); var ca = Math.cos(rad(a)), sa = Math.sin(rad(a)); ca = +ca.toFixed(4); sa = +sa.toFixed(4); vis = Math.max(14, a * 1.4); ask = pick(['H', 'V']);
      q = '如圖，AB 斜距 S = ' + S.toFixed(2) + ' m，傾斜角 α = ' + a + '°（sin' + a + '° = ' + sa + '、cos' + a + '° = ' + ca + '），AB 的' + (ask === 'H' ? '水平距離' : '高差') + '為何？';
      op = ask === 'H' ? O(M(S * ca), [M(S * sa), M(S / ca), M(S - S * sa), M(S)]) : O(M(S * sa), [M(S * ca), M(S / sa), M(S * sa / ca), M(S - S * ca)]);
      ex = ask === 'H' ? '水平距離 = S cosα = ' + S.toFixed(2) + ' × ' + ca + ' = ' + M(S * ca) + '。' : '高差 = S sinα = ' + S.toFixed(2) + ' × ' + sa + ' = ' + M(S * sa) + '。';
    }
    var len = 260, Bx = Ax + (right ? 1 : -1) * len * Math.cos(rad(vis)), By = Ay - len * Math.sin(rad(vis));
    var s = G.poly([[right ? 10 : 350, Ay + 6], [Ax, Ay], [Bx, By], [right ? 350 : 10, By - 4]], 'thick') + G.L(Ax, Ay, Bx, By, 'thick acc');
    s += G.L(Ax, Ay, Bx, Ay, 'thin dash') + G.L(Bx, By, Bx, Ay, 'thin dash') + G.C(Ax, Ay, 3, 'dot') + G.C(Bx, By, 3, 'dot');
    s += G.T(Ax + (right ? -8 : 8), Ay + 4, 'A', right ? 'end' : 'start') + G.T(Bx + (right ? 8 : -8), By - 6, 'B', right ? 'start' : 'end');
    var mx = (Ax + Bx) / 2, my = (Ay + By) / 2;
    s += G.T(mx + (right ? -10 : 10), my - 10, 'S = ' + S.toFixed(2) + ' m', right ? 'end' : 'start', 'small');
    if (mode === 'h') s += G.T(Bx + (right ? -8 : 8), (By + Ay) / 2 + 4, 'h = ' + h.toFixed(2) + ' m', right ? 'end' : 'start', 'small');
    else s += (right ? G.arc(Ax, Ay, 40, 0, vis) : G.arc(Ax, Ay, 40, 180, 180 - vis)) + G.lab(Ax, Ay, 56, right ? vis / 2 : 180 - vis / 2, 'α = ' + a + '°');
    s += G.T(180, 222, '（示意圖，未依比例）', 'middle', 'small');
    return [q, op, ex, G.svg(360, 230, s)];
  }

  // 水準測量：已知點 A 經 0～2 個轉點到 B，地形起伏隨機
  function leveling() {
    var nTP = ri(0, 2), seg = nTP + 1, HA = ri(20000, 90000) / 1000, bs = [], fs = [], Hs = [HA], names = ['A'];
    for (var i = 0; i < seg; i++) { bs.push(ri(600, 3700) / 1000); fs.push(ri(600, 3700) / 1000); Hs.push(Hs[i] + bs[i] - fs[i]); if (i < nTP) names.push('TP' + (i + 1)); }
    names.push('B');
    var sb = 0, sf = 0; bs.forEach(function (v) { sb += v; }); fs.forEach(function (v) { sf += v; });
    if (Math.abs(sb - sf) < 0.05) return leveling();
    var hb = Hs[seg], M = function (x) { return D(x, 3) + ' m'; };
    var mx = Math.max.apply(null, Hs), mn = Math.min.apply(null, Hs), vs = Math.min(18, 70 / ((mx - mn) || 1)), mid = (mx + mn) / 2;
    var xs = Hs.map(function (h, k) { return 35 + k * 290 / seg; }), gy = Hs.map(function (h) { return 168 - (h - mid) * vs; });
    var s = G.poly([[8, gy[0]]].concat(xs.map(function (x, k) { return [x, gy[k]]; })).concat([[352, gy[seg]]]), 'thick');
    var tops = gy.map(function (g) { return g; });
    for (var j = 0; j < seg; j++) {
      var ys = gy[j] - bs[j] * vs, xm = (xs[j] + xs[j + 1]) / 2, gm = (gy[j] + gy[j + 1]) / 2;
      tops[j] = Math.min(tops[j], ys); tops[j + 1] = Math.min(tops[j + 1], ys);
      s += G.L(xm, ys + 5, xm - 10, gm, 'thin') + G.L(xm, ys + 5, xm + 10, gm, 'thin') + G.Rc(xm - 10, ys - 5, 20, 9, 'fill');
      s += G.L(xs[j] + 4, ys, xm - 10, ys, 'thin dash') + G.L(xm + 10, ys, xs[j + 1] - 4, ys, 'thin dash');
      s += G.T(xs[j] + 6, ys - 5, '後 ' + bs[j].toFixed(3), 'start', 'small') + G.T(xs[j + 1] - 6, ys - 5, '前 ' + fs[j].toFixed(3), 'end', 'small');
    }
    xs.forEach(function (x, k) { s += G.Rc(x - 3, tops[k] - 14, 6, gy[k] - tops[k] + 14, 'fill2 acc') + G.T(x, gy[k] + 18, names[k]); });
    s += G.T(xs[0], gy[0] + 32, '（BM）', 'middle', 'small');
    var fig = G.svg(360, Math.max.apply(null, gy) + 42, s), ask = nTP ? pick(['B', 'B', 'dH', 'TP']) : pick(['B', 'B', 'dH']);
    var chain = []; for (var k = 0; k < seg; k++) chain.push('H_' + names[k + 1] + ' = ' + D(Hs[k], 3) + ' + ' + bs[k].toFixed(3) + ' − ' + fs[k].toFixed(3) + ' = ' + D(Hs[k + 1], 3));
    var ex = '高程 = 前一點高程 + 後視 − 前視：\n' + chain.join('\n') + '\n檢核：ΣBS − ΣFS = ' + D(sb, 3) + ' − ' + D(sf, 3) + ' = ' + D(sb - sf, 3) + ' m = B 與 A 的高差。';
    var q0 = '如圖為由水準點 A（高程 ' + HA.toFixed(3) + ' m）到 B 點的水準測量，圖中「後」為後視、「前」為前視讀數（單位 m），';
    if (ask === 'dH') return [q0 + 'B 點比 A 點高多少？（負值表示較低）', O(M(sb - sf), [M(sf - sb), M(sb + sf), M(sb), M(sf)]), ex, fig];
    if (ask === 'TP') return [q0 + 'TP1 的高程為何？', O(M(Hs[1]), [M(HA - bs[0] + fs[0]), M(HA + bs[0]), M(HA + bs[0] + fs[0]), M(hb)]), ex, fig];
    return [q0 + 'B 點的高程為何？', O(M(hb), [M(HA - sb + sf), M(HA + sb), M(HA + sb + sf), M(HA - sf)]), ex, fig];
  }

  /* ================= 數學 ================= */

  // 直角三角形：邊長、θ 的位置、旋轉翻轉都隨機
  function rtTri() {
    var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29], [9, 40, 41]]), a = t[0], b = t[1], c = t[2];
    if (Math.random() < 0.5) { a = t[1]; b = t[0]; }
    var atB = Math.random() < 0.5, opp = atB ? b : a, adj = atB ? a : b, unk = pick(['a', 'b', 'c']), ask = pick(['sin', 'cos', 'tan', 'x']);
    var sideV = { a: a, b: b, c: c }, sc = 150 / Math.max(a, b), rot = rad(ri(0, 11) * 30 + ri(-8, 8)), flip = Math.random() < 0.5 ? -1 : 1;
    var loc = { C: [0, 0], B: [a * sc, 0], A: [0, b * sc] }, pt = {};
    Object.keys(loc).forEach(function (k) { var x = loc[k][0] * flip, y = loc[k][1]; pt[k] = [x * Math.cos(rot) - y * Math.sin(rot), -(x * Math.sin(rot) + y * Math.cos(rot))]; });
    var xs = [pt.A[0], pt.B[0], pt.C[0]], ys = [pt.A[1], pt.B[1], pt.C[1]], dx = 170 - (Math.max.apply(null, xs) + Math.min.apply(null, xs)) / 2, dy = 120 - (Math.max.apply(null, ys) + Math.min.apply(null, ys)) / 2;
    Object.keys(pt).forEach(function (k) { pt[k] = [pt[k][0] + dx, pt[k][1] + dy]; });
    var gx = (pt.A[0] + pt.B[0] + pt.C[0]) / 3, gyy = (pt.A[1] + pt.B[1] + pt.C[1]) / 3;
    var out = function (p, d) { var vx = p[0] - gx, vy = p[1] - gyy, l = Math.sqrt(vx * vx + vy * vy) || 1; return [p[0] + vx / l * d, p[1] + vy / l * d]; };
    var s = G.poly([pt.A, pt.B, pt.C, pt.A], 'thick acc');
    var u = function (p, q2) { var vx = q2[0] - p[0], vy = q2[1] - p[1], l = Math.sqrt(vx * vx + vy * vy); return [vx / l, vy / l]; };
    var ub = u(pt.C, pt.B), ua = u(pt.C, pt.A);
    s += G.poly([[pt.C[0] + ub[0] * 12, pt.C[1] + ub[1] * 12], [pt.C[0] + ub[0] * 12 + ua[0] * 12, pt.C[1] + ub[1] * 12 + ua[1] * 12], [pt.C[0] + ua[0] * 12, pt.C[1] + ua[1] * 12]], 'thin');
    ['A', 'B', 'C'].forEach(function (k) { var p = out(pt[k], 13); s += G.T(p[0], p[1] + 4, k); });
    var sides = { a: ['B', 'C'], b: ['A', 'C'], c: ['A', 'B'] };
    Object.keys(sides).forEach(function (k) { var p1 = pt[sides[k][0]], p2 = pt[sides[k][1]], m = out([(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2], 14); s += G.T(m[0], m[1] + 4, k === unk ? 'x' : String(sideV[k])); });
    var V = atB ? pt.B : pt.A, o1 = atB ? pt.A : pt.B, ang = function (p) { return Math.atan2(-(p[1] - V[1]), p[0] - V[0]) * 180 / Math.PI; };
    var a1 = ang(pt.C), a2 = ang(o1), df = ((a2 - a1 + 540) % 360) - 180;
    s += G.arc(V[0], V[1], 24, a1, a1 + df) + G.lab(V[0], V[1], 36, a1 + df / 2, 'θ', '');
    var fig = G.svg(340, 240, s), sName = { a: 'BC', b: 'AC', c: 'AB' };
    var ex = '∠C = 90°，θ 在 ' + (atB ? 'B' : 'A') + ' 點：對邊 = ' + (atB ? 'AC' : 'BC') + ' = ' + opp + '、鄰邊 = ' + (atB ? 'BC' : 'AC') + ' = ' + adj + '、斜邊 AB = ' + c + '。' + '\n未知邊 x = ' + sName[unk] + '，用畢氏定理求得 x = ' + sideV[unk] + '。';
    if (ask === 'x') return ['如圖，△ABC 中 ∠C = 90°，x 的值為何？', O(String(sideV[unk]), [String(unk === 'c' ? a + b : c + (unk === 'a' ? b : a)), String(unk === 'c' ? Math.abs(b - a) : c - (unk === 'a' ? b : a)), H.sqrtS(unk === 'c' ? Math.abs(a * a - b * b) : c * c + (unk === 'a' ? b * b : a * a))], function (k) { return String(sideV[unk] + k); }), ex + '\n' + (unk === 'c' ? 'x² = ' + a + '² + ' + b + '²' : 'x² = ' + c + '² − ' + (unk === 'a' ? b : a) + '²') + ' → x = ' + sideV[unk] + '。', fig];
    var val = { sin: F(opp, c), cos: F(adj, c), tan: F(opp, adj) }[ask];
    return ['如圖，△ABC 中 ∠C = 90°，' + ask + 'θ 的值為何？', O(val, [F(adj, c), F(opp, c), F(opp, adj), F(adj, opp), F(c, opp)]), ex + '\nsinθ = 對/斜 = ' + F(opp, c) + '、cosθ = 鄰/斜 = ' + F(adj, c) + '、tanθ = 對/鄰 = ' + F(opp, adj) + '。', fig];
  }

  // 標準位置角：終邊上一點 P 落在任意象限
  function stdAngle() {
    var t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [7, 24, 25]]), sw = Math.random() < 0.5, x = (sw ? t[1] : t[0]) * pick([1, -1]), y = (sw ? t[0] : t[1]) * pick([1, -1]), r = t[2];
    var ask = pick(['sin', 'cos', 'tan']), Ox = 160, Oy = 125, sc = 85 / Math.max(Math.abs(x), Math.abs(y)), px = Ox + x * sc, py = Oy - y * sc;
    var th = Math.atan2(y, x) * 180 / Math.PI; if (th < 0) th += 360;
    var s = G.A(25, Oy, 300, Oy, 'thin') + G.A(Ox, 235, Ox, 15, 'thin') + G.T(305, Oy + 4, 'x', 'start') + G.T(Ox + 6, 18, 'y', 'start') + G.T(Ox - 6, Oy + 16, 'O', 'end');
    s += G.L(Ox, Oy, px, py, 'thick acc') + G.L(px, py, px, Oy, 'thin dash') + G.C(px, py, 3.5, 'dot') + G.T(px + (x > 0 ? 8 : -8), py + (y > 0 ? -8 : 16), 'P(' + n(x) + ', ' + n(y) + ')', x > 0 ? 'start' : 'end');
    s += G.arc(Ox, Oy, 22, 0, th) + G.lab(Ox, Oy, 36, th / 2, 'θ', '');
    var val = { sin: F(y, r), cos: F(x, r), tan: F(y, x) }[ask];
    return ['如圖，角 θ 為標準位置角，終邊通過 P(' + n(x) + ', ' + n(y) + ')，' + ask + 'θ 的值為何？', O(val, [F(-({ sin: y, cos: x, tan: y }[ask]), { sin: r, cos: r, tan: x }[ask]), F(y, r), F(x, r), F(y, x), F(x, y)]),
      'r = OP = √(' + sq(x) + ' + ' + sq(y) + ') = ' + r + '。\nsinθ = y/r = ' + F(y, r) + '、cosθ = x/r = ' + F(x, r) + '、tanθ = y/x = ' + F(y, x) + '。\nP 在第 ' + (x > 0 ? (y > 0 ? '一' : '四') : (y > 0 ? '二' : '三')) + ' 象限，注意正負號。', G.svg(320, 245, s)];
  }

  // 方格上的向量：兩向量的起點、方向都隨機
  function vecGrid() {
    var rc = function () { var v; do { v = [ri(-4, 4), ri(-4, 4)]; } while (!v[0] && !v[1]); return v; }, a = rc(), b = rc();
    while (a[0] === b[0] && a[1] === b[1]) b = rc();
    var cs = 28, ox = 20, oy = 222, Wn = 10, Hn = 7;
    var st = function (v) { return [ri(Math.max(0, -v[0]), Math.min(Wn, Wn - v[0])), ri(Math.max(0, -v[1]), Math.min(Hn, Hn - v[1]))]; }, sa = st(a), sb = st(b);
    var P = function (p) { return [ox + p[0] * cs, oy - p[1] * cs]; }, s = '';
    for (var i = 0; i <= Wn; i++) s += G.L(ox + i * cs, oy, ox + i * cs, oy - Hn * cs, 'thin');
    for (var j = 0; j <= Hn; j++) s += G.L(ox, oy - j * cs, ox + Wn * cs, oy - j * cs, 'thin');
    [[a, sa, 'a', 'thick acc'], [b, sb, 'b', 'thick']].forEach(function (e) {
      var p1 = P(e[1]), p2 = P([e[1][0] + e[0][0], e[1][1] + e[0][1]]), mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2, l = Math.sqrt(e[0][0] * e[0][0] + e[0][1] * e[0][1]);
      s += G.A(p1[0], p1[1], p2[0], p2[1], e[3]) + G.C(p1[0], p1[1], 2.5, 'dot') + G.T(mx - e[0][1] / l * 12, my - e[0][0] / l * 12 + 4, e[2]);
    });
    var fig = G.svg(320, 240, s), pt = function (x, y) { return '(' + n(x) + ', ' + n(y) + ')'; }, ask = pick(['sum', 'diff', 'lin', 'dot', 'len']);
    var ex = '由方格讀出：a→ = ' + pt(a[0], a[1]) + '、b→ = ' + pt(b[0], b[1]) + '（終點 − 起點，向右、向上為正）。';
    if (ask === 'sum') return ['如圖，方格每格邊長 1，a→ + b→ = ？', O(pt(a[0] + b[0], a[1] + b[1]), [pt(a[0] - b[0], a[1] - b[1]), pt(a[1] + b[1], a[0] + b[0]), pt(-(a[0] + b[0]), a[1] + b[1]), pt(a[0] + b[0], -(a[1] + b[1]))], function (k) { return pt(a[0] + b[0] + k, a[1] + b[1]); }), ex + '\na→ + b→ = ' + pt(a[0] + b[0], a[1] + b[1]) + '。', fig];
    if (ask === 'diff') return ['如圖，方格每格邊長 1，a→ − b→ = ？', O(pt(a[0] - b[0], a[1] - b[1]), [pt(b[0] - a[0], b[1] - a[1]), pt(a[0] + b[0], a[1] + b[1]), pt(a[1] - b[1], a[0] - b[0])], function (k) { return pt(a[0] - b[0] + k, a[1] - b[1]); }), ex + '\na→ − b→ = ' + pt(a[0] - b[0], a[1] - b[1]) + '。', fig];
    if (ask === 'lin') {
      var cf = pick([[2, 1], [2, -1], [1, 2], [1, -2], [3, -1], [-1, 2]]), p = cf[0], q = cf[1], rx = p * a[0] + q * b[0], ry = p * a[1] + q * b[1];
      var tx = (p === 1 ? '' : p === -1 ? '−' : p) + 'a→ ' + (q < 0 ? '− ' : '+ ') + (Math.abs(q) === 1 ? '' : Math.abs(q)) + 'b→';
      return ['如圖，方格每格邊長 1，' + tx + ' = ？', O(pt(rx, ry), [pt(p * a[0] - q * b[0], p * a[1] - q * b[1]), pt(a[0] + b[0], a[1] + b[1]), pt(q * a[0] + p * b[0], q * a[1] + p * b[1]), pt(-rx, ry)], function (k) { return pt(rx + k, ry - k); }), ex + '\n' + tx + ' = ' + pt(rx, ry) + '。', fig];
    }
    if (ask === 'dot') { var dt = a[0] * b[0] + a[1] * b[1]; return ['如圖，方格每格邊長 1，內積 a→·b→ = ？', O(n(dt), [n(a[0] * b[1] + a[1] * b[0]), n(-dt), n(a[0] * b[0] - a[1] * b[1]), n(Math.abs(a[0] * b[0]) + Math.abs(a[1] * b[1]))], function (k) { return n(dt + k); }), ex + '\na→·b→ = (' + n(a[0]) + ')(' + n(b[0]) + ') + (' + n(a[1]) + ')(' + n(b[1]) + ') = ' + n(dt) + '。', fig]; }
    var sx = a[0] + b[0], sy = a[1] + b[1], L2 = sx * sx + sy * sy, dx = a[0] - b[0], dy = a[1] - b[1];
    return ['如圖，方格每格邊長 1，|a→ + b→| = ？', O(H.sqrtS(L2), [H.sqrtS(dx * dx + dy * dy || 1), H.sqrtS(L2 + 2), String(Math.abs(sx) + Math.abs(sy)), H.sqrtS(a[0] * a[0] + a[1] * a[1] + b[0] * b[0] + b[1] * b[1])], function (k) { return H.sqrtS(L2 + k * 3); }), ex + '\na→ + b→ = ' + pt(sx, sy) + '，長度 = √(' + sq(sx) + ' + ' + sq(sy) + ') = ' + H.sqrtS(L2) + '。', fig];
  }

  // 直線／拋物線圖形：在方格坐標上讀圖
  function gridAxes() {
    var cs = 22, o = 140, s = '';
    for (var i = -5; i <= 5; i++) { s += G.L(o + i * cs, o - 5 * cs, o + i * cs, o + 5 * cs, 'thin') + G.L(o - 5 * cs, o + i * cs, o + 5 * cs, o + i * cs, 'thin'); if (i) s += G.T(o + i * cs, o + 13, n(i), 'middle', 'small') + G.T(o - 5, o - i * cs + 4, n(i), 'end', 'small'); }
    s += G.A(o - 5 * cs - 6, o, o + 5 * cs + 10, o, 'thick') + G.A(o, o + 5 * cs + 6, o, o - 5 * cs - 10, 'thick') + G.T(o + 5 * cs + 12, o + 4, 'x', 'start') + G.T(o + 6, o - 5 * cs - 8, 'y', 'start');
    return { s: s, P: function (x, y) { return [o + x * cs, o - y * cs]; } };
  }
  function lineGraph() {
    var x1, y1, x2, y2;
    do { x1 = ri(-4, 4); y1 = ri(-4, 4); x2 = ri(-4, 4); y2 = ri(-4, 4); } while (x1 === x2 || y1 === y2 || Math.abs(x1 - x2) + Math.abs(y1 - y2) < 3);
    var g = gridAxes(), dx = x2 - x1, dy = y2 - y1, e1 = g.P(x1 - dx * 6, y1 - dy * 6), e2 = g.P(x1 + dx * 6, y1 + dy * 6), p1 = g.P(x1, y1), p2 = g.P(x2, y2);
    var s = g.s + G.clip(30, 30, 220, 220, G.L(e1[0], e1[1], e2[0], e2[1], 'thick acc')) + G.C(p1[0], p1[1], 3.5, 'dot') + G.C(p2[0], p2[1], 3.5, 'dot');
    s += G.T(p1[0] + 6, p1[1] - 6, '(' + n(x1) + ', ' + n(y1) + ')', 'start', 'small') + G.T(p2[0] + 6, p2[1] - 6, '(' + n(x2) + ', ' + n(y2) + ')', 'start', 'small');
    var fig = G.svg(290, 290, s), m = F(dy, dx), bN = y1 * dx - dy * x1, bI = F(bN, dx), xI = F(-bN, dy), ask = pick(['m', 'm', 'b', 'xi']);
    var ex = '斜率 m = (' + n(y2) + ' − ' + n(y1) + ')/(' + n(x2) + ' − ' + n(x1) + ') = ' + m + '。\ny 截距：y − ' + n(y1) + ' = m(x − ' + n(x1) + ')，代 x = 0 得 ' + bI + '；x 截距：代 y = 0 得 ' + xI + '。';
    if (ask === 'm') return ['如圖，直線通過圖上兩點，其斜率為何？', O(m, [F(dx, dy), F(-dy, dx), F(-dx, dy), F(dy, dx + 1)], function (k) { return F(dy + k, dx); }), ex, fig];
    if (ask === 'b') return ['如圖，直線通過圖上兩點，其 y 截距為何？', O(bI, [xI, F(-bN, dx), m, F(bN + dx, dx)], function (k) { return F(bN + k, dx); }), ex, fig];
    return ['如圖，直線通過圖上兩點，其 x 截距為何？', O(xI, [bI, F(bN, dy), F(dx, dy), F(-bN + dy, dy)], function (k) { return F(-bN + k, dy); }), ex, fig];
  }
  function parabola() {
    var a = pick([1, -1, 2, -2]), h = ri(-3, 3), k = ri(-3, 3);
    if (a > 0 && k > 2) k = 2; if (a < 0 && k < -2) k = -2;
    var g = gridAxes(), pts = [];
    for (var x = -5.6; x <= 5.6; x += 0.1) { var y = a * (x - h) * (x - h) + k; if (y > -8 && y < 8) pts.push(g.P(x, y)); }
    var v = g.P(h, k), w = g.P(h + 1, k + a);
    var s = g.s + G.clip(30, 30, 220, 220, G.poly(pts, 'thick acc')) + G.C(v[0], v[1], 3.5, 'dot') + G.C(w[0], w[1], 3.5, 'dot');
    s += G.T(v[0] - 6, v[1] + (a > 0 ? 16 : -8), '(' + n(h) + ', ' + n(k) + ')', 'end', 'small') + G.T(w[0] + 6, w[1] + 4, '(' + n(h + 1) + ', ' + n(k + a) + ')', 'start', 'small');
    var eq = function (A2, h2, k2) { var c = A2 === 1 ? '' : A2 === -1 ? '−' : n(A2), core = h2 === 0 ? 'x²' : '(' + H.lin(h2) + ')²'; return 'y = ' + c + core + (k2 > 0 ? ' + ' + k2 : k2 < 0 ? ' − ' + (-k2) : ''); };
    var fig = G.svg(290, 290, s), ask = pick(['eq', 'eq', 'yi']), yi = a * h * h + k;
    var ex = '頂點 (' + n(h) + ', ' + n(k) + ') → y = a(x − h)² + k；代入另一點 (' + n(h + 1) + ', ' + n(k + a) + ')：' + n(k + a) + ' = a × 1 + ' + n(k) + ' → a = ' + n(a) + '。\n' + eq(a, h, k) + '，開口向' + (a > 0 ? '上' : '下') + '。';
    if (ask === 'eq') return ['如圖之拋物線（標出頂點與另一點），其方程式為何？', O(eq(a, h, k), [eq(a, -h, k), eq(a, h, -k), eq(-a, h, k), eq(a * 2, h, k), eq(a, -h, -k)], function (q) { return eq(a, h, k + q * (k >= 0 ? 1 : -1) * 2); }), ex, fig];
    return ['如圖之拋物線（標出頂點與另一點），它與 y 軸交點的 y 坐標為何？', O(n(yi), [n(k), n(a * h * h - k), n(-yi), n(a * h + k)], function (q) { return n(yi + q); }), ex + '\n代 x = 0：y = ' + n(a) + ' × ' + n(h) + '² ' + (k < 0 ? '− ' + (-k) : '+ ' + k) + ' = ' + n(yi) + '。', fig];
  }

  /* ================= 掛到各單元 ================= */
  var hard = function (f) { return function () { return f(true); }; }, easy = function (f) { return function () { return f(false); }; };
  var sets = [
    ['mech', 1, [['吊掛繩張力（角度變化）', hang], ['共點力合成（方向變化）', forces]]],
    ['mech', 3, [['彎桿力矩（方向變化）', moment]]],
    ['mech', 4, [['空間對角線分力', space]]],
    ['mech', 5, [['桁架內力（形狀變化）', truss]]],
    ['surv', 0, [['方位角與象限角（看圖）', azimuth]]],
    ['surv', 2, [['斜距改正（看圖）', slope]]],
    ['surv', 5, [['水準測量路線（看圖）', leveling]]],
    ['math', 0, [['看圖求直線', lineGraph], ['看圖求拋物線', parabola]]],
    ['math', 1, [['直角三角形三角比（任意擺放）', rtTri], ['標準位置角（看圖）', stdAngle]]],
    ['math', 2, [['方格向量運算', vecGrid]]]
  ];
  function items(list) { return list.map(function (e) { return { t: e[0], g: function () { return e[1](); } }; }); }
  sets.forEach(function (st) { addEasy(st[0], st[1], items(st[2])); addHard(st[0], st[1], items(st[2])); addTc(st[0], st[1], items(st[2])); });
  // 梁：簡單版只出簡支／懸臂，困難版與統測區加入外伸梁、局部均佈
  addEasy('mech', 2, [{ t: '梁的反力（支承與載重變化）', g: easy(beamGen) }]);
  addHard('mech', 2, [{ t: '梁的反力（支承與載重變化）', g: hard(beamGen) }]);
  addTc('mech', 2, [{ t: '梁的反力（支承與載重變化）', g: hard(beamGen) }]);
})();
