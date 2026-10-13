/* 計算區：可拖移、縮放的大畫布，筆／圖形（直線、箭頭、圓、三角形、矩形）／橡皮擦／復原，每題各自一份（存在 q.sketch，只在這次測驗中保留）
 * Scratch.open({ data: {strokes:[], view:{x,y,z}}, html: '題目 HTML', tool: 'pen'|'hand', onClose: fn })
 */
(function () {
  var css =
    '.scr{position:fixed;inset:0;z-index:40;background:var(--bg);display:flex;flex-direction:column}' +
    '.scr.hidden{display:none}' +
    '.scr-bar{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:8px 10px;background:var(--card);border-bottom:1px solid var(--line)}' +
    '.scr-bar button{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:9px;padding:6px 10px;font-size:.9rem;cursor:pointer;font-family:inherit;white-space:nowrap}' +
    '.scr-bar button.on{background:var(--accent);border-color:var(--accent);color:#fff}' +
    '.scr-bar .c{width:30px;height:30px;padding:0;border-radius:50%;border:3px solid var(--line)}' +
    '.scr-bar .c.on{border-color:var(--accent);box-shadow:0 0 0 2px var(--card) inset}' +
    '.scr-bar .sp{flex:1}' +
    '.scr-bar .close{background:var(--accent);border-color:var(--accent);color:#fff}' +
    '.scr-q{background:var(--card);border-bottom:1px solid var(--line);padding:4px 12px;max-height:32vh;overflow:auto;font-size:.92rem}' +
    '.scr-q summary{cursor:pointer;color:var(--muted);font-size:.85rem}' +
    '.scr-q .qq{white-space:pre-wrap;margin:4px 0}' +
    '.scr-q .figbox{max-width:300px}' +
    '.scr-wrap{flex:1;position:relative;overflow:hidden;background-color:var(--card)}' +
    '.scr-wrap canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none;cursor:crosshair}' +
    '.scr-wrap.hand canvas{cursor:grab}' +
    '.scr-shapes{display:flex;flex-wrap:wrap;gap:6px;width:100%}' +
    '.scr-shapes.hidden{display:none}' +
    '.scr-tip{position:absolute;right:10px;bottom:8px;font-size:.75rem;color:var(--muted);pointer-events:none}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var COLORS = { ink: null, red: '#e03131', blue: '#1c7ed6', green: '#2b8a3e' };
  var root = document.createElement('div');
  root.className = 'scr hidden';
  root.innerHTML =
    '<div class="scr-bar">' +
      '<button data-t="pen" class="on">✏️ 筆</button>' +
      '<button class="c" data-c="ink" title="黑"></button><button class="c" data-c="red" title="紅"></button>' +
      '<button class="c" data-c="blue" title="藍"></button><button class="c" data-c="green" title="綠"></button>' +
      '<button data-a="shapes">📐 圖形 ▾</button>' +
      '<button data-t="eraser">🧽 橡皮擦</button>' +
      '<button data-t="hand">✋ 拖移</button>' +
      '<button data-a="undo">↶ 復原</button>' +
      '<button data-a="clear">🗑 清空</button>' +
      '<button data-a="out">－</button><button data-a="in">＋</button><button data-a="fit">⌖ 看全部</button>' +
      '<span class="sp"></span><button class="close" data-a="close">✕ 關閉</button>' +
      '<div class="scr-shapes hidden">' +
        '<button data-t="line">╱ 直線</button><button data-t="arrow">↗ 箭頭</button>' +
        '<button data-t="circle">◯ 圓</button><button data-t="tri">△ 三角形</button>' +
        '<button data-t="rtri">◺ 直角三角形</button><button data-t="rect">▭ 矩形</button>' +
      '</div>' +
    '</div>' +
    '<details class="scr-q" open><summary>題目（點這裡收合）</summary><div class="qb"></div></details>' +
    '<div class="scr-wrap"><canvas></canvas><div class="scr-tip">雙指或滾輪拖移・Ctrl+滾輪或雙指縮放・畫圖形按住 Shift 可鎖角度／正形</div></div>';
  document.body.appendChild(root);

  var wrap = root.querySelector('.scr-wrap'), cv = wrap.querySelector('canvas'), ctx = cv.getContext('2d');
  var qb = root.querySelector('.qb'), shapesRow = root.querySelector('.scr-shapes'), shapesBtn = root.querySelector('[data-a="shapes"]');
  var SHAPES = { line: 1, arrow: 1, circle: 1, tri: 1, rtri: 1, rect: 1 };
  var data = null, view = null, tool = 'pen', color = 'ink', onClose = null;
  var dpr = 1, W = 0, H = 0, sawPen = false, clearArmed = false;

  root.querySelectorAll('.c').forEach(function (b) {
    var c = b.getAttribute('data-c');
    b.style.background = COLORS[c] || 'var(--ink)';
  });

  function inkColor() { return getComputedStyle(root).getPropertyValue('--ink').trim() || '#1d2433'; }
  function setTool(t) {
    tool = t;
    root.querySelectorAll('[data-t]').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-t') === t); });
    wrap.classList.toggle('hand', t === 'hand');
    shapesBtn.classList.toggle('on', !!SHAPES[t]);
    if (!SHAPES[t] && !shapesRow.classList.contains('hidden')) { shapesRow.classList.add('hidden'); if (data) resize(); }
  }
  function setColor(c) {
    color = c;
    root.querySelectorAll('.c').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-c') === c); });
    if (!SHAPES[tool] && tool !== 'pen') setTool('pen');
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    W = wrap.clientWidth; H = wrap.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    render();
  }

  function drawStroke(s, ink) {
    var p = s.p;
    ctx.globalCompositeOperation = s.e ? 'destination-out' : 'source-over';
    ctx.strokeStyle = ctx.fillStyle = s.e ? '#000' : (COLORS[s.c] || ink);
    ctx.lineWidth = s.w;
    if (s.s) { shapePath(s); ctx.stroke(); return; }
    if (p.length === 2) { ctx.beginPath(); ctx.arc(p[0], p[1], s.w / 2, 0, Math.PI * 2); ctx.fill(); return; }
    ctx.beginPath(); ctx.moveTo(p[0], p[1]);
    for (var i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i + 1]);
    ctx.stroke();
  }
  // 圖形：p = [起點x, 起點y, 終點x, 終點y]（圓是圓心→圓周上一點）
  function shapePath(s) {
    var p = s.p, x1 = p[0], y1 = p[1], x2 = p[2], y2 = p[3];
    ctx.beginPath();
    if (s.s === 'line' || s.s === 'arrow') {
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      if (s.s === 'arrow') {
        var a = Math.atan2(y2 - y1, x2 - x1), L = Math.min(s.w * 6, Math.hypot(x2 - x1, y2 - y1) * 0.5);
        ctx.moveTo(x2 - L * Math.cos(a - 0.45), y2 - L * Math.sin(a - 0.45)); ctx.lineTo(x2, y2);
        ctx.lineTo(x2 - L * Math.cos(a + 0.45), y2 - L * Math.sin(a + 0.45));
      }
    } else if (s.s === 'circle') {
      ctx.arc(x1, y1, Math.hypot(x2 - x1, y2 - y1), 0, Math.PI * 2);
    } else if (s.s === 'rect') {
      ctx.rect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
    } else if (s.s === 'tri') {
      ctx.moveTo((x1 + x2) / 2, y1); ctx.lineTo(x2, y2); ctx.lineTo(x1, y2); ctx.closePath();
    } else if (s.s === 'rtri') {
      ctx.moveTo(x1, y1); ctx.lineTo(x1, y2); ctx.lineTo(x2, y2); ctx.closePath();
    }
  }
  function shapeEnd(s, x, y, shift) {
    var x1 = s.p[0], y1 = s.p[1], dx = x - x1, dy = y - y1;
    if (shift) {
      if (s.s === 'line' || s.s === 'arrow') {
        // 鎖成 15° 的倍數
        var r = Math.hypot(dx, dy), a = Math.round(Math.atan2(dy, dx) / (Math.PI / 12)) * (Math.PI / 12);
        dx = r * Math.cos(a); dy = r * Math.sin(a);
      } else if (s.s !== 'circle') {
        // 正方形／等腰直角三角形；正三角形的高 = 底 × √3/2
        var m = Math.max(Math.abs(dx), Math.abs(dy));
        if (s.s === 'tri') { dx = (dx < 0 ? -1 : 1) * m; dy = (dy < 0 ? -1 : 1) * m * Math.sqrt(3) / 2; }
        else { dx = (dx < 0 ? -1 : 1) * m; dy = (dy < 0 ? -1 : 1) * m; }
      }
    }
    s.p[2] = x1 + dx; s.p[3] = y1 + dy;
  }
  function applyView() { ctx.setTransform(dpr * view.z, 0, 0, dpr * view.z, -dpr * view.x * view.z, -dpr * view.y * view.z); }
  function render() {
    if (!data) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    applyView(); ctx.lineCap = ctx.lineJoin = 'round';
    var ink = inkColor();
    data.strokes.forEach(function (s) { drawStroke(s, ink); });
    ctx.globalCompositeOperation = 'source-over';
    // 方格紙背景跟著拖移
    var g = 40 * view.z, ox = -view.x * view.z, oy = -view.y * view.z;
    wrap.style.backgroundImage = 'linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px)';
    wrap.style.backgroundSize = g + 'px ' + g + 'px';
    wrap.style.backgroundPosition = ox + 'px ' + oy + 'px';
  }

  function zoomAt(f, sx, sy) {
    var z = Math.min(4, Math.max(0.15, view.z * f));
    var wx = sx / view.z + view.x, wy = sy / view.z + view.y;
    view.z = z; view.x = wx - sx / z; view.y = wy - sy / z; render();
  }
  function fit() {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    data.strokes.forEach(function (s) {
      if (s.e) return;
      if (s.s === 'circle') {
        var r = Math.hypot(s.p[2] - s.p[0], s.p[3] - s.p[1]);
        minX = Math.min(minX, s.p[0] - r); maxX = Math.max(maxX, s.p[0] + r);
        minY = Math.min(minY, s.p[1] - r); maxY = Math.max(maxY, s.p[1] + r);
        return;
      }
      for (var i = 0; i < s.p.length; i += 2) {
        minX = Math.min(minX, s.p[i]); maxX = Math.max(maxX, s.p[i]);
        minY = Math.min(minY, s.p[i + 1]); maxY = Math.max(maxY, s.p[i + 1]);
      }
    });
    if (minX === Infinity) { view.x = 0; view.y = 0; view.z = 1; render(); return; }
    var pad = 30, bw = maxX - minX + pad * 2, bh = maxY - minY + pad * 2;
    var z = Math.min(1.5, Math.max(0.15, Math.min(W / bw, H / bh)));
    view.z = z; view.x = (minX + maxX) / 2 - W / 2 / z; view.y = (minY + maxY) / 2 - H / 2 / z; render();
  }

  // ---------- 指標（滑鼠、觸控、觸控筆） ----------
  var ptrs = {}, mode = null, cur = null, last = null, pinch = null;
  function pos(e) { var r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  function count() { return Object.keys(ptrs).length; }
  function startPinch() {
    var ids = Object.keys(ptrs), a = ptrs[ids[0]], b = ptrs[ids[1]];
    pinch = { mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, d: Math.hypot(a.x - b.x, a.y - b.y) || 1, z: view.z, vx: view.x, vy: view.y };
  }
  cv.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'pen') sawPen = true;
    cv.setPointerCapture(e.pointerId);
    var p = pos(e); ptrs[e.pointerId] = p;
    if (count() === 2) {
      // 第二根手指：取消剛開始的筆畫，改成雙指拖移／縮放
      if ((mode === 'draw' || mode === 'shape') && cur && e.pointerType === 'touch') { data.strokes.pop(); render(); }
      mode = 'pinch'; cur = null; startPinch(); return;
    }
    if (count() > 2) return;
    var pan = tool === 'hand' || e.button === 1 || e.button === 2 || (sawPen && e.pointerType === 'touch');
    last = p;
    if (pan) { mode = 'pan'; return; }
    if (SHAPES[tool]) {
      var wx = p.x / view.z + view.x, wy = p.y / view.z + view.y;
      mode = 'shape';
      cur = { s: tool, p: [wx, wy, wx, wy], w: 2.6 / view.z, e: 0, c: color };
      data.strokes.push(cur); data.prev = null;
      return;
    }
    mode = 'draw';
    var er = tool === 'eraser';
    cur = { p: [p.x / view.z + view.x, p.y / view.z + view.y], w: (er ? 26 : 2.6) / view.z, e: er ? 1 : 0, c: er ? undefined : color };
    data.strokes.push(cur); data.prev = null;
    applyView(); ctx.lineCap = ctx.lineJoin = 'round'; drawStroke(cur, inkColor());
  });
  cv.addEventListener('pointermove', function (e) {
    if (!ptrs[e.pointerId]) return;
    var p = pos(e); ptrs[e.pointerId] = p;
    if (mode === 'pinch' && count() >= 2) {
      var ids = Object.keys(ptrs), a = ptrs[ids[0]], b = ptrs[ids[1]];
      var mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      var z = Math.min(4, Math.max(0.15, pinch.z * d / pinch.d));
      var wx = pinch.mx / pinch.z + pinch.vx, wy = pinch.my / pinch.z + pinch.vy;
      view.z = z; view.x = wx - mx / z; view.y = wy - my / z; render();
    } else if (mode === 'pan') {
      view.x -= (p.x - last.x) / view.z; view.y -= (p.y - last.y) / view.z; last = p; render();
    } else if (mode === 'shape' && cur) {
      shapeEnd(cur, p.x / view.z + view.x, p.y / view.z + view.y, e.shiftKey); render();
    } else if (mode === 'draw' && cur) {
      var evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      if (!evs.length) evs = [e];
      evs.forEach(function (ev) { var q = pos(ev); cur.p.push(q.x / view.z + view.x, q.y / view.z + view.y); });
      applyView(); ctx.lineCap = ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = cur.e ? 'destination-out' : 'source-over';
      ctx.strokeStyle = cur.e ? '#000' : (COLORS[cur.c] || inkColor()); ctx.lineWidth = cur.w;
      var n = cur.p.length, k = Math.max(0, n - 2 - evs.length * 2);
      ctx.beginPath(); ctx.moveTo(cur.p[k], cur.p[k + 1]);
      for (var i = k + 2; i < n; i += 2) ctx.lineTo(cur.p[i], cur.p[i + 1]);
      ctx.stroke(); ctx.globalCompositeOperation = 'source-over';
    }
  });
  function up(e) {
    if (!ptrs[e.pointerId]) return;
    delete ptrs[e.pointerId];
    var n = count();
    if (mode === 'pinch') { if (n === 1) { mode = 'pan'; var id = Object.keys(ptrs)[0]; last = ptrs[id]; } else if (!n) mode = null; return; }
    if (!n) {
      // 只點一下沒拉開的圖形不留
      if (mode === 'shape' && cur && Math.hypot(cur.p[2] - cur.p[0], cur.p[3] - cur.p[1]) * view.z < 4) { data.strokes.pop(); render(); }
      mode = null; cur = null;
    }
  }
  cv.addEventListener('pointerup', up);
  cv.addEventListener('pointercancel', up);
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  cv.addEventListener('wheel', function (e) {
    e.preventDefault();
    var p = pos(e);
    if (e.ctrlKey || e.metaKey) zoomAt(Math.exp(-e.deltaY * 0.01), p.x, p.y);
    else { view.x += e.deltaX / view.z; view.y += e.deltaY / view.z; render(); }
  }, { passive: false });

  // ---------- 工具列 ----------
  root.querySelector('.scr-bar').addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var t = b.getAttribute('data-t'), c = b.getAttribute('data-c'), a = b.getAttribute('data-a');
    if (t) setTool(t);
    else if (c) setColor(c);
    else if (a === 'shapes') { shapesRow.classList.toggle('hidden'); resize(); }
    else if (a === 'undo') undo();
    else if (a === 'clear') {
      if (!data.strokes.length) return;
      if (!clearArmed) {
        clearArmed = true; b.textContent = '再按一次清空';
        setTimeout(function () { clearArmed = false; b.textContent = '🗑 清空'; }, 3000);
        return;
      }
      clearArmed = false; b.textContent = '🗑 清空';
      data.prev = data.strokes; data.strokes = []; render();
    }
    else if (a === 'in') zoomAt(1.25, W / 2, H / 2);
    else if (a === 'out') zoomAt(0.8, W / 2, H / 2);
    else if (a === 'fit') fit();
    else if (a === 'close') close();
  });
  function undo() {
    if (data.strokes.length) data.strokes.pop();
    else if (data.prev) { data.strokes = data.prev; data.prev = null; }
    render();
  }
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { close(); e.preventDefault(); }
    else if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) { undo(); e.preventDefault(); }
  });
  window.addEventListener('resize', function () { if (isOpen()) resize(); });
  // 圖形列展開／題目收合會改變畫布大小，要重新對齊，否則筆跡會和游標錯位
  if (window.ResizeObserver) new ResizeObserver(function () { if (isOpen()) resize(); }).observe(wrap);
  root.querySelector('.scr-q').addEventListener('toggle', function () { if (isOpen()) resize(); });

  function isOpen() { return !root.classList.contains('hidden'); }
  function open(o) {
    data = o.data; if (!data.strokes) data.strokes = [];
    if (!data.view) data.view = { x: 0, y: 0, z: 1 };
    view = data.view; onClose = o.onClose || null;
    qb.innerHTML = o.html || '';
    root.querySelector('.scr-q').style.display = o.html ? '' : 'none';
    setTool(o.tool || 'pen'); setColor(color); if (o.tool) setTool(o.tool);
    ptrs = {}; mode = null; cur = null;
    root.classList.remove('hidden');
    resize();
    if (o.fit) fit();
  }
  function close() {
    root.classList.add('hidden');
    var f = onClose; onClose = null; data = null;
    if (f) f();
  }
  function has(d) { return !!(d && d.strokes && d.strokes.some(function (s) { return !s.e; })); }

  window.Scratch = { open: open, close: close, isOpen: isOpen, has: has };
})();
