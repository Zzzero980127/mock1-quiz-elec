/* 題目示意圖（自繪 SVG，數字跟著類題一起變）
 * 產生器回傳 [題目, 選項, 解析, 圖] 的第 4 個元素放 QF.xxx(...) 的結果即可。
 * 顏色一律用 currentColor / CSS 變數，深淺色模式都看得清楚。
 */
window.QF = (function () {
  function svg(w, h, body) {
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" class="qfig">' +
      '<defs><marker id="qfa" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>' + body + '</svg>';
  }
  function L(x1, y1, x2, y2, cls) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" class="' + (cls || '') + '"/>'; }
  function A(x1, y1, x2, y2, cls) { return '<line x1="' + r1(x1) + '" y1="' + r1(y1) + '" x2="' + r1(x2) + '" y2="' + r1(y2) + '" class="arr ' + (cls || '') + '" marker-end="url(#qfa)"/>'; }
  function T(x, y, s, anchor, cls) { return '<text x="' + r1(x) + '" y="' + r1(y) + '" text-anchor="' + (anchor || 'middle') + '" class="' + (cls || '') + '">' + String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</text>'; }
  function Rect(x, y, w, h, cls) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" class="' + (cls || '') + '"/>'; }
  function C(x, y, r, cls) { return '<circle cx="' + r1(x) + '" cy="' + r1(y) + '" r="' + r1(r) + '" class="' + (cls || '') + '"/>'; }
  function P(d, cls) { return '<path d="' + d + '" class="' + (cls || '') + '"/>'; }
  function r1(x) { return Math.round(x * 10) / 10; }
  // 地面或牆面的斜線陰影
  function hatchH(x1, x2, y) { var s = L(x1, y, x2, y, 'thick'); for (var x = x1; x < x2; x += 12) s += L(x, y, x - 8, y + 8, 'thin'); return s; }
  function hatchV(x, y1, y2, left) { var s = L(x, y1, x, y2, 'thick'); for (var y = y1; y < y2; y += 12) s += L(x, y, x + (left ? -8 : 8), y + 8, 'thin'); return s; }
  function rad(d) { return d * Math.PI / 180; }

  return {
    // 兩繩吊掛：繩 1 與水平 30°、繩 2 與水平 60°
    ropes: function (W) {
      var px = 180, py = 120, top = 30, x1 = px - (py - top) / Math.tan(rad(30)), x2 = px + (py - top) / Math.tan(rad(60));
      var s = hatchH(10, 340, top).replace(/y2="(\d+)"/g, function (m, v) { return 'y2="' + (2 * top - v) + '"'; });
      s += L(px, py, x1, top, 'acc') + L(px, py, x2, top, 'acc') + L(px, py, px, 148);
      s += Rect(150, 148, 60, 34, 'fill') + T(180, 170, 'W = ' + W + ' N');
      s += T(x1 + 40, top + 18, '30°') + T(x2 - 22, top + 18, '60°') + T((px + x1) / 2 - 6, (py + top) / 2 + 16, '繩 1') + T((px + x2) / 2 + 22, (py + top) / 2 + 10, '繩 2');
      return svg(350, 195, s);
    },
    // 輪胎上台階
    wheel: function (r, h, W) {
      var R = 70, cx = 120, g = 215, hs = R * h / r, cy = g - R, dx = Math.sqrt(R * R - (R - hs) * (R - hs));
      var s = hatchH(10, cx + dx, g) + Rect(cx + dx, g - hs, 340 - cx - dx, hs, 'fill') + C(cx, cy, R, 'acc') + C(cx, cy, 3, 'dot');
      s += A(cx, cy, cx + 55, cy) + T(cx + 58, cy - 6, 'P', 'start') + A(cx, cy, cx, cy + 45) + T(cx + 8, cy + 42, 'W = ' + W + ' N', 'start');
      s += L(cx, cy, cx - R * 0.7, cy - R * 0.7, 'dash') + T(cx - 34, cy - 30, 'r = ' + r + ' cm');
      s += L(345, g - hs, 345, g, 'thin') + T(343, g - hs - 6, 'h = ' + h + ' cm', 'end');
      return svg(350, 230, s);
    },
    // 斜面＋定滑輪＋懸吊物 B
    inclinePulley: function (ang, W, mu) {
      var Hh = 150, base = Hh / Math.tan(rad(ang)), x0 = 250 - base, g = 205, top = g - Hh;
      var s = hatchH(10, 330, g) + P('M' + r1(x0) + ',' + g + ' L250,' + g + ' L250,' + top + ' z', 'fill');
      var mx = x0 + base * 0.45, my = g - Hh * 0.45;
      s += '<g transform="rotate(' + (-ang) + ' ' + r1(mx) + ' ' + r1(my) + ')">' + Rect(mx - 22, my - 26, 44, 26, 'acc fill2') + T(mx, my - 9, 'A') + '</g>';
      var bx = mx + Math.sin(rad(ang)) * 13, by = my - Math.cos(rad(ang)) * 13;
      s += C(258, top - 6, 8, 'acc') + L(bx, by, 252, top - 10) + L(266, top - 6, 266, top + 60) + Rect(254, top + 60, 24, 26, 'acc fill2') + T(266, top + 78, 'B');
      s += T(x0 + 34, g - 6, ang + '°') + T(mx - 40, my - 36, W + ' kgf', 'end') + T(290, g - 10, 'μs = ' + mu, 'middle');
      return svg(340, 220, s);
    },
    // 簡支梁：均佈載重 + 集中力
    beam: function (L0, w, a, Pf) {
      var x1 = 40, x2 = 300, y = 120, sx = (x2 - x1) / L0, px = x1 + a * sx;
      var s = Rect(x1, y, x2 - x1, 9, 'fill2 acc');
      s += P('M' + x1 + ',' + (y + 9) + ' l-10,18 l20,0 z', '') + hatchH(x1 - 16, x1 + 18, y + 27);
      s += C(x2, y + 17, 8, '') + hatchH(x2 - 16, x2 + 18, y + 25);
      if (w > 0) {
        s += Rect(x1, y - 26, x2 - x1, 18, 'thin');
        for (var i = 0; i <= 10; i++) s += A(x1 + i * (x2 - x1) / 10, y - 26, x1 + i * (x2 - x1) / 10, y - 2, 'thin');
        // w 的標示放在集中力的另一側，避免重疊
        s += px > (x1 + x2) / 2 ? T(x1, y - 32, 'w = ' + w + ' kN/m', 'start') : T(x2, y - 32, 'w = ' + w + ' kN/m', 'end');
      }
      s += A(px, y - 70, px, y - 28, 'acc') + T(px, y - 74, 'P = ' + Pf + ' kN');
      s += T(x1, y + 52, 'A') + T(x2, y + 52, 'B');
      s += L(x1, y + 62, px, y + 62, 'thin') + L(px, y + 56, px, y + 68, 'thin') + T((x1 + px) / 2, y + 76, a + ' m');
      s += L(px, y + 62, x2, y + 62, 'thin') + T((px + x2) / 2, y + 76, (L0 - a) + ' m');
      return svg(345, 205, s);
    },
    // 簡支梁：三角形載重（A 端 0 → B 端 w）
    triBeam: function (L0, w) {
      var x1 = 40, x2 = 300, y = 120;
      var s = Rect(x1, y, x2 - x1, 9, 'fill2 acc') + P('M' + x1 + ',' + (y + 9) + ' l-10,18 l20,0 z', '') + hatchH(x1 - 16, x1 + 18, y + 27) + C(x2, y + 17, 8, '') + hatchH(x2 - 16, x2 + 18, y + 25);
      s += P('M' + x1 + ',' + (y - 2) + ' L' + x2 + ',' + (y - 60) + ' L' + x2 + ',' + (y - 2) + ' z', 'thin');
      for (var i = 1; i <= 8; i++) { var x = x1 + i * (x2 - x1) / 8; s += A(x, y - 2 - 58 * i / 8, x, y - 2, 'thin'); }
      s += T(x2 - 4, y - 66, 'w = ' + w + ' kN/m', 'end') + T(x1, y + 52, 'A') + T(x2, y + 52, 'B') + L(x1, y + 62, x2, y + 62, 'thin') + T((x1 + x2) / 2, y + 76, 'L = ' + L0 + ' m');
      return svg(345, 205, s);
    },
    // 梯子靠牆
    ladder: function (b, hgt, W) {
      var g = 205, wx = 260, s0 = 160 / Math.max(b, hgt), fx = wx - b * s0, ty = g - hgt * s0;
      var s = hatchH(20, wx, g) + hatchV(wx, 20, g, false) + L(fx, g, wx, ty, 'acc thick2');
      s += A((fx + wx) / 2, (g + ty) / 2, (fx + wx) / 2, (g + ty) / 2 + 40) + T((fx + wx) / 2 - 8, (g + ty) / 2 + 40, 'W = ' + W + ' N', 'end');
      s += T((fx + wx) / 2, g + 16, b + ' m') + T(wx + 14, (g + ty) / 2, hgt + ' m', 'start') + T(wx + 14, 34, '光滑牆', 'start') + T(fx - 8, g - 8, '粗糙地面', 'end');
      return svg(345, 225, s);
    },
    // 疊放：A 綁在牆上，推 B
    stack: function (WA, WB) {
      var g = 200;
      var s = hatchV(30, 60, g, true) + hatchH(30, 330, g) + Rect(70, 150, 190, 50, 'fill2 acc') + Rect(100, 108, 120, 42, 'fill2 acc');
      s += L(30, 129, 100, 129) + T(160, 134, 'A  ' + WA + ' kgf') + T(165, 180, 'B  ' + WB + ' kgf') + A(325, 175, 263, 175, 'acc') + T(310, 166, 'P');
      return svg(345, 215, s);
    },
    // 箱子：頂端施水平力
    box: function (b, h, W) {
      var g = 205, sc = 150 / Math.max(b, h), bw = b * sc, bh = h * sc, x0 = 170 - bw / 2;
      var s = hatchH(20, 330, g) + Rect(x0, g - bh, bw, bh, 'fill2 acc') + A(x0 - 60, g - bh, x0 - 2, g - bh, 'acc') + T(x0 - 64, g - bh + 4, 'P', 'end');
      s += A(170, g - bh / 2, 170, g - bh / 2 + 30) + T(x0 + bw + 8, g - bh / 2 + 30, 'W = ' + W + ' N', 'start');
      s += T(170, g + 16, b + ' cm') + T(x0 + bw + 8, g - bh / 2 - 8, h + ' cm', 'start');
      return svg(345, 225, s);
    },
    // 兩次仰角觀測（30°、60°）
    elevation: function (d) {
      var g = 200, tx = 300, Hh = 140, bx = tx - Hh / Math.tan(rad(60)), ax = tx - Hh / Math.tan(rad(30));
      var s = hatchH(20, 330, g) + L(tx, g, tx, g - Hh, 'acc thick2') + L(ax, g, tx, g - Hh, 'dash') + L(bx, g, tx, g - Hh, 'dash');
      s += C(ax, g, 3, 'dot') + C(bx, g, 3, 'dot') + T(ax, g + 16, 'A') + T(bx, g + 16, 'B') + T(ax + 38, g - 6, '30°') + T(bx + 22, g - 6, '60°');
      s += T((ax + bx) / 2, g + 30, d + ' m') + T(tx, g - Hh - 8, '塔高 = ?', 'middle');
      return svg(350, 240, s);
    },
    // 摺扇（環狀扇形）
    fan: function (R0, r0, thP, thQ) {
      var cx = 175, cy = 205, Ro = 165, Ri = Ro * r0 / R0, th = Math.PI * thP / thQ, a1 = -Math.PI / 2 - th / 2, a2 = -Math.PI / 2 + th / 2;
      function pt(r, a) { return r1(cx + r * Math.cos(a)) + ',' + r1(cy + r * Math.sin(a)); }
      var big = th > Math.PI ? 1 : 0;
      var s = P('M' + pt(Ri, a1) + ' L' + pt(Ro, a1) + ' A' + Ro + ',' + Ro + ' 0 ' + big + ',1 ' + pt(Ro, a2) + ' L' + pt(Ri, a2) + ' A' + r1(Ri) + ',' + r1(Ri) + ' 0 ' + big + ',0 ' + pt(Ri, a1) + ' z', 'fill2 acc');
      s += L(cx, cy, cx + Ri * Math.cos(a1), cy + Ri * Math.sin(a1), 'thin') + L(cx, cy, cx + Ri * Math.cos(a2), cy + Ri * Math.sin(a2), 'thin') + C(cx, cy, 3, 'dot');
      s += T(cx + Ro * Math.cos(a2) * 0.55 + 18, cy + Ro * Math.sin(a2) * 0.55, R0 + ' cm', 'start') + T(cx, cy - Ri / 2, r0 + ' cm') + T(cx, cy + 16, '圓心角 ' + (thP === 1 ? '' : thP) + 'π' + (thQ === 1 ? '' : '/' + thQ));
      return svg(350, 230, s);
    },
    // 2 × 2 方格土方，九個格點挖深
    grid3: function (h, a) {
      var x0 = 70, y0 = 30, st = 100, s = '';
      for (var i = 0; i < 3; i++) { s += L(x0, y0 + i * st, x0 + 2 * st, y0 + i * st, 'acc') + L(x0 + i * st, y0, x0 + i * st, y0 + 2 * st, 'acc'); }
      for (var k = 0; k < 9; k++) { var cx = x0 + (k % 3) * st, cy = y0 + Math.floor(k / 3) * st; s += C(cx, cy, 4, 'dot') + T(cx + 7, cy - 6, h[k], 'start', 'small'); }
      s += T(x0 + st / 2, y0 + 2 * st + 20, a + ' m') + T(x0 + 2 * st + 22, y0 + st / 2, a + ' m', 'start');
      return svg(345, 255, s);
    },
    // 坐標法：依序連接的多邊形
    poly: function (pts) {
      var mx = Math.max.apply(null, pts.map(function (p) { return p[0]; })), my = Math.max.apply(null, pts.map(function (p) { return p[1]; }));
      var sc = Math.min(260 / mx, 170 / my), ox = 45, oy = 205;
      function X(e) { return ox + e * sc; } function Y(nn) { return oy - nn * sc; }
      var s = A(ox, oy, ox + 285, oy, 'thin') + A(ox, oy, ox, 15, 'thin') + T(ox + 290, oy + 4, 'E', 'start') + T(ox, 12, 'N');
      s += P('M' + pts.map(function (p) { return r1(X(p[0])) + ',' + r1(Y(p[1])); }).join(' L') + ' z', 'fill2 acc');
      pts.forEach(function (p, i) { var c = 'ABCDEF'.charAt(i); s +=C(X(p[0]), Y(p[1]), 3, 'dot') + T(X(p[0]) + 6, Y(p[1]) - 6, c + '(' + p[0] + ', ' + p[1] + ')', 'start', 'small'); });
      return svg(360, 225, s);
    },
    // 拋物線落下（無人機）
    drone: function (D0, hgt) {
      var g = 200, x0 = 60, top = 40, sc = 230 / D0, s = hatchH(20, 330, g) + L(x0, g, x0, top, 'dash');
      var d = 'M' + x0 + ',' + top;
      for (var i = 1; i <= 20; i++) { var x = D0 * i / 20, y = 100 - 100 * x * x / (D0 * D0); d += ' L' + r1(x0 + x * sc) + ',' + r1(g - y * 1.6); }
      s += P(d, 'acc thick2') + C(x0, top, 5, 'dot') + T(x0 - 6, top + 4, '100 m', 'end') + T(x0, g + 16, '干擾器') + T(x0 + D0 * sc, g + 16, D0 + ' m');
      var yy = g - hgt * 1.6; s += L(x0, yy, 330, yy, 'thin dash') + T(330, yy - 4, '離地 ' + hgt + ' m', 'end');
      return svg(345, 220, s);
    }
  };
})();
