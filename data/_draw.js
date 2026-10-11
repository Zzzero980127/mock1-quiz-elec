/* 畫圖小工具：電路符號、邏輯閘、波形（輸出 SVG 字串，顏色跟著深色模式走） */
window.DR = (function () {
  function f(x) { return Math.round(x * 10) / 10; }
  function svg(w, h, body) {
    // 四周留白，避免邊緣的標籤被切掉
    return '<svg viewBox="-34 -6 ' + (w + 68) + ' ' + (h + 12) + '" width="' + (w + 68) + '" height="' + (h + 12) + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" font-size="13">' + body + '</svg>';
  }
  function line(x1, y1, x2, y2, extra) { return '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '"' + (extra || '') + '/>'; }
  function wire() { // wire([x,y],[x,y],...)
    var p = Array.prototype.slice.call(arguments);
    return '<polyline points="' + p.map(function (q) { return f(q[0]) + ',' + f(q[1]); }).join(' ') + '"/>';
  }
  function text(x, y, s, anchor, size) {
    return '<text x="' + f(x) + '" y="' + f(y) + '" text-anchor="' + (anchor || 'middle') + '" fill="currentColor" stroke="none"' + (size ? ' font-size="' + size + '"' : '') + '>' + s + '</text>';
  }
  function dot(x, y) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="2.6" fill="currentColor" stroke="none"/>'; }
  function term(x, y) { return '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="3.2" style="fill:var(--card)"/>'; }
  function gnd(x, y) { return line(x, y, x, y + 7) + line(x - 9, y + 7, x + 9, y + 7) + line(x - 5.5, y + 11, x + 5.5, y + 11) + line(x - 2, y + 15, x + 2, y + 15); }
  function arrowHead(x, y, ux, uy, s) {
    s = s || 7; var nx = -uy, ny = ux;
    return '<polygon points="' + f(x) + ',' + f(y) + ' ' + f(x - ux * s + nx * s * 0.45) + ',' + f(y - uy * s + ny * s * 0.45) + ' ' + f(x - ux * s - nx * s * 0.45) + ',' + f(y - uy * s - ny * s * 0.45) + '" fill="currentColor" stroke="none"/>';
  }
  function arrow(x1, y1, x2, y2) { var L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L; return line(x1, y1, x2 - ux * 4, y2 - uy * 4) + arrowHead(x2, y2, ux, uy); }

  // 兩端元件：a、b 為端點（水平或垂直），kind：R、V（電池）、I（電流源）、D（二極體，a→b 順向）、Z（稽納）、C（電容）、M（電表）
  // o：{ l: 標籤, side: 'l'|'r'|'a'|'b'（左右上下）, plus: 'a'|'b'（電池正端）, rev: 電流源箭頭反向, m: 電表字母 }
  function el(kind, a, b, o) {
    o = o || {};
    var dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
    var cx = (a[0] + b[0]) / 2, cy = (a[1] + b[1]) / 2, hs = { R: 16, V: 4, I: 13, D: 8, Z: 8, C: 4, M: 13 }[kind];
    var P = function (s, n) { return [cx + ux * s + nx * n, cy + uy * s + ny * n]; };
    var out = wire(a, P(-hs, 0)) + wire(P(hs, 0), b);
    if (kind === 'R') {
      var pts = [P(-16, 0)], k;
      for (k = 0; k < 6; k++) pts.push(P(-16 + 2.67 + k * 5.33, k % 2 ? -5 : 5));
      pts.push(P(16, 0));
      out += wire.apply(null, pts);
    } else if (kind === 'V') {
      var pa = o.plus === 'a', lp = pa ? -4 : 4, sp = -lp;
      out += wire(P(lp, -11), P(lp, 11)) + '<g stroke-width="3">' + wire(P(sp, -6), P(sp, 6)) + '</g>';
      var tp = P(lp * 3.2, 13); out += text(tp[0], tp[1] + 4, '+', 'middle', 12);
    } else if (kind === 'I') {
      out += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="13"/>';
      var s1 = o.rev ? 7 : -7; var p1 = P(s1, 0), p2 = P(-s1, 0);
      out += arrow(p1[0], p1[1], p2[0], p2[1]);
    } else if (kind === 'D' || kind === 'Z') {
      out += '<polygon points="' + [P(-8, -8), P(-8, 8), P(8, 0)].map(function (q) { return f(q[0]) + ',' + f(q[1]); }).join(' ') + '" fill="currentColor"/>';
      if (kind === 'D') out += wire(P(8, -8), P(8, 8));
      else out += wire(P(4, -11), P(8, -8), P(8, 8), P(12, 11));
    } else if (kind === 'C') {
      out += wire(P(-4, -11), P(-4, 11)) + wire(P(4, -11), P(4, 11));
    } else if (kind === 'M') {
      out += '<circle cx="' + f(cx) + '" cy="' + f(cy) + '" r="13"/>' + text(cx, cy + 4.5, o.m || 'V', 'middle', 13);
    }
    if (o.l) {
      var side = o.side || (Math.abs(ux) > 0.5 ? 'a' : 'r'), off = { R: 12, V: 16, I: 18, D: 13, Z: 15, C: 15, M: 18 }[kind];
      if (side === 'a') out += text(cx, cy - off - 2, o.l);
      else if (side === 'b') out += text(cx, cy + off + 11, o.l);
      else if (side === 'r') out += text(cx + off, cy + 4.5, o.l, 'start');
      else out += text(cx - off, cy + 4.5, o.l, 'end');
    }
    return out;
  }

  // NPN 電晶體：B 在 (x, y)，回傳 { s, B, C, E }
  function npn(x, y, pnp) {
    var bx = x + 16, s = line(x, y, bx, y) + '<g stroke-width="2.6">' + line(bx, y - 13, bx, y + 13) + '</g>';
    s += line(bx, y - 6, x + 32, y - 18) + line(x + 32, y - 18, x + 32, y - 32);
    s += line(bx, y + 6, x + 32, y + 18) + line(x + 32, y + 18, x + 32, y + 32);
    var ux = 16 / Math.hypot(16, 12), uy = 12 / Math.hypot(16, 12);
    s += pnp ? arrowHead(bx + 1, y + 6.8, -ux, -uy) : arrowHead(x + 31, y + 17.4, ux, uy);
    s += '<circle cx="' + (x + 22) + '" cy="' + y + '" r="19" stroke-width="1"/>';
    return { s: s, B: [x, y], C: [x + 32, y - 32], E: [x + 32, y + 32] };
  }

  // 邏輯閘：左上角 (x, y)，寬 50、高 40；回傳 { s, ins: [[x,y]...], out: [x,y] }
  function gate(type, x, y, n) {
    n = type === 'NOT' || type === 'BUF' ? 1 : (n || 2);
    var s = '', inv = /^(NAND|NOR|XNOR|NOT)$/.test(type), base = type.replace(/^N(?=AND|OR)/, '').replace(/^XN/, 'X');
    var ys = n === 1 ? [20] : n === 2 ? [10, 30] : n === 3 ? [8, 20, 32] : [6, 15.3, 24.6, 34];
    var curve = function (t) { return 30 * t * (1 - t); }, ins = [];
    if (base === 'AND') s += '<path d="M' + x + ' ' + y + 'H' + (x + 28) + 'A20 20 0 0 1 ' + (x + 28) + ' ' + (y + 40) + 'H' + x + 'Z"/>';
    if (base === 'OR' || base === 'XOR') s += '<path d="M' + x + ' ' + y + 'Q' + (x + 15) + ' ' + (y + 20) + ' ' + x + ' ' + (y + 40) + 'Q' + (x + 36) + ' ' + (y + 40) + ' ' + (x + 50) + ' ' + (y + 20) + 'Q' + (x + 36) + ' ' + y + ' ' + x + ' ' + y + 'Z"/>';
    if (base === 'XOR') s += '<path d="M' + (x - 7) + ' ' + y + 'Q' + (x + 8) + ' ' + (y + 20) + ' ' + (x - 7) + ' ' + (y + 40) + '"/>';
    if (type === 'NOT' || type === 'BUF') s += '<path d="M' + x + ' ' + y + 'L' + (x + 38) + ' ' + (y + 20) + 'L' + x + ' ' + (y + 40) + 'Z"/>';
    var ex = (type === 'NOT' || type === 'BUF') ? x + 38 : (base === 'AND' ? x + 48 : x + 50);
    if (inv) s += '<circle cx="' + (ex + 4) + '" cy="' + (y + 20) + '" r="4"/>';
    var ox = ex + (inv ? 8 : 0);
    ys.forEach(function (yo) {
      var t = yo / 40, endx = base === 'OR' ? x + curve(t) : base === 'XOR' ? x - 7 + curve(t) : x;
      s += line(x - 16, y + yo, endx, y + yo); ins.push([x - 16, y + yo]);
    });
    s += line(ox, y + 20, ox + 14, y + 20);
    return { s: s, ins: ins, out: [ox + 14, y + 20] };
  }

  // 方格背景
  function grid(x, y, cols, rows, d, faint) {
    var s = '<g stroke-width="' + (faint ? 0.6 : 0.8) + '" opacity="' + (faint ? 0.35 : 0.5) + '">';
    for (var i = 0; i <= cols; i++) s += line(x + i * d, y, x + i * d, y + rows * d);
    for (var j = 0; j <= rows; j++) s += line(x, y + j * d, x + cols * d, y + j * d);
    return s + '</g>';
  }
  // 示波器畫面：10 × 8 格，週期 per 格、峰對峰 vpp 格
  function scope(per, vpp) {
    var d = 22, x0 = 10, y0 = 10, W = 10 * d, H = 8 * d, cy = y0 + H / 2, pts = [];
    for (var i = 0; i <= 200; i++) { var xx = i / 200 * 10; pts.push([x0 + xx * d, cy - Math.sin(xx / per * 2 * Math.PI) * vpp / 2 * d]); }
    return svg(W + 20, H + 20, '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" rx="4"/>' + grid(x0, y0, 10, 8, d, true) +
      '<g stroke-width="0.9" opacity="0.6">' + line(x0, cy, x0 + W, cy) + line(x0 + W / 2, y0, x0 + W / 2, y0 + H) + '</g>' +
      '<g stroke-width="2.2">' + wire.apply(null, pts) + '</g>');
  }
  // 座標軸
  function axes(x0, y0, w, h, xl, yl) {
    return arrow(x0, y0, x0 + w, y0) + arrow(x0, y0, x0, y0 - h) + text(x0 + w + 3, y0 + 4, xl || 't', 'start') + text(x0 - 4, y0 - h + 4, yl || 'v', 'end');
  }
  // 時序圖：rows = [{ n: 'A', v: [0,1,...] }]，每格寬 w
  function timing(rows, w) {
    w = w || 26; var n = rows[0].v.length, H = 36, x0 = 34, s = '';
    s += '<g stroke-width="0.7" opacity="0.4" stroke-dasharray="3 3">';
    for (var i = 0; i <= n; i++) s += line(x0 + i * w, 6, x0 + i * w, rows.length * H + 4);
    s += '</g>';
    rows.forEach(function (r, k) {
      var yH = k * H + 12, yL = k * H + 32, pts = [];
      r.v.forEach(function (b, i) { var yy = b ? yH : yL; pts.push([x0 + i * w, yy], [x0 + (i + 1) * w, yy]); });
      s += text(x0 - 10, (yH + yL) / 2 + 5, r.n, 'end') + '<g stroke-width="2">' + wire.apply(null, pts) + '</g>';
    });
    return svg(x0 + n * w + 10, rows.length * H + 10, s);
  }
  // 垂直線圈（變壓器），right：向右鼓起
  function coil(x, y1, y2, right, n) {
    n = n || 4; var h = (y2 - y1) / n, s = '<path d="M' + x + ' ' + y1;
    for (var i = 0; i < n; i++) s += 'A' + f(h / 2) + ' ' + f(h / 2) + ' 0 0 ' + (right ? 1 : 0) + ' ' + x + ' ' + f(y1 + (i + 1) * h);
    return s + '"/>';
  }
  // 交流電源（圓內畫正弦）
  function ac(x, y1, y2, l, side) {
    var cy = (y1 + y2) / 2, s = line(x, y1, x, cy - 13) + line(x, cy + 13, x, y2) + '<circle cx="' + x + '" cy="' + cy + '" r="13"/>' +
      '<path d="M' + (x - 8) + ' ' + cy + 'Q' + (x - 4) + ' ' + (cy - 9) + ' ' + x + ' ' + cy + 'T' + (x + 8) + ' ' + cy + '"/>';
    if (l) s += side === 'r' ? text(x + 18, cy + 4, l, 'start') : text(x - 18, cy + 4, l, 'end');
    return s;
  }
  return { coil: coil, ac: ac, svg: svg, line: line, wire: wire, text: text, dot: dot, term: term, gnd: gnd, arrow: arrow, arrowHead: arrowHead, el: el, npn: npn, gate: gate, grid: grid, scope: scope, axes: axes, timing: timing };
})();
