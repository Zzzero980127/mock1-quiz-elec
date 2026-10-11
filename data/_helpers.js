/* 出題用的小工具（給 data/*.js 的類題產生器用） */
// 困難版題目掛到既有單元上：addHard('math', 0, [...])。只能往後加，不要插隊或刪題（id 依順序）。
window.addHard = function (subjId, unitIndex, items) {
  var s = (window.QUIZ_DATA || []).filter(function (x) { return x.id === subjId; })[0];
  if (!s || !s.units[unitIndex]) return;
  var u = s.units[unitIndex];
  u.hard = (u.hard || []).concat(items);
};
window.QH = (function () {
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a || 1; }
  // 負號用全形「−」比較好讀
  function n(x) { return x < 0 ? '−' + Math.abs(x) : String(x); }
  function frac(p, q) {
    if (q < 0) { p = -p; q = -q; }
    var g = gcd(p, q); p /= g; q /= g;
    return q === 1 ? n(p) : (p < 0 ? '−' : '') + Math.abs(p) + '/' + q;
  }
  // π 的係數：piFrac(2,3) → 2π/3
  function piFrac(p, q) {
    var g = gcd(p, q); p /= g; q /= g;
    var s = p < 0 ? '−' : ''; p = Math.abs(p);
    if (p === 0) return '0';
    return s + (p === 1 ? '' : p) + 'π' + (q === 1 ? '' : '/' + q);
  }
  // √n 化簡 → k√m
  function sqrtS(x) {
    if (x === 0) return '0';
    var k = 1, m = x;
    for (var i = Math.floor(Math.sqrt(x)); i > 1; i--) { if (x % (i * i) === 0) { k = i; m = x / (i * i); break; } }
    if (m === 1) return String(k);
    return (k === 1 ? '' : k) + '√' + m;
  }
  // x − a 的寫法
  function lin(a, v) { v = v || 'x'; return a === 0 ? v : (a > 0 ? v + ' − ' + a : v + ' + ' + (-a)); }
  function pt(x, y, z) { return '(' + n(x) + ', ' + n(y) + (z === undefined ? '' : ', ' + n(z)) + ')'; }
  // 數字取到 d 位小數，去掉多餘的 0
  function dec(x, d) { var p = Math.pow(10, d === undefined ? 2 : d); var v = Math.round(x * p) / p; if (Object.is(v, -0)) v = 0; return n(v); }
  // 組選項：第一個是正解，其餘去重複；不夠時用 more() 補
  function opts(ans, cands, more) {
    var out = [String(ans)], seen = {}; seen[String(ans)] = 1;
    cands.forEach(function (c) { c = String(c); if (!seen[c] && out.length < 4) { seen[c] = 1; out.push(c); } });
    var guard = 0;
    while (out.length < 4 && more && guard++ < 50) { var c = String(more(guard)); if (!seen[c]) { seen[c] = 1; out.push(c); } }
    return out;
  }
  // 浮點數誤差（220.00000000000003、0.30000000000000004）四捨五入到 4 位小數
  function clean(s) {
    // 只處理「小數中段連續 6 個以上 0 或 9、後面還有數字」的誤差，像 0.0000116 這種正常數值不動
    return s.replace(/\d+\.\d*?[1-9]?(?:0{6,}|9{6,})\d+/g, function (x) {
      var dec = (x.split('.')[1].match(/^\d*?(?=0{6,}|9{6,})/) || [''])[0].length;
      return String(parseFloat(parseFloat(x).toFixed(dec)));
    });
  }
  // 選項去重複；不足 4 個時，把正解裡的數字微調做出干擾選項
  function fill(list) {
    var out = [], seen = {};
    list.forEach(function (o) { o = clean(String(o)).replace(/(^|[\s(,])-(?=\d)/g, '$1−'); if (!seen[o]) { seen[o] = 1; out.push(o); } });
    var deltas = [1, -1, 2, -2, 3, -3, 5, -5, 10, -10];
    for (var s = 0; s < out.length && out.length < 4; s++) {
      var src = out[s], m = src.match(/\d+(\.\d+)?/);
      if (!m) continue;
      var d = (m[1] || '').length - (m[1] ? 1 : 0), unit = d ? Math.pow(10, -d) : 1;
      for (var i = 0; i < deltas.length && out.length < 4; i++) {
        var v = parseFloat(m[0]) + deltas[i] * unit; if (v < 0) continue;
        var c = src.slice(0, m.index) + v.toFixed(d) + src.slice(m.index + m[0].length);
        if (!seen[c]) { seen[c] = 1; out.push(c); }
      }
    }
    return out;
  }
  // 加上 SI 詞首：si(0.0025, 'A') → 2.5 mA（取 3 位有效數字）
  var PRE = [[1e9, 'G'], [1e6, 'M'], [1e3, 'k'], [1, ''], [1e-3, 'm'], [1e-6, 'μ'], [1e-9, 'n'], [1e-12, 'p']];
  function si(x, u, sig) {
    if (!x) return '0 ' + u;
    var ax = Math.abs(x), p = PRE[PRE.length - 1];
    for (var i = 0; i < PRE.length; i++) { if (ax >= PRE[i][0] * 0.99995) { p = PRE[i]; break; } }
    var v = parseFloat((x / p[0]).toPrecision(sig || 3));
    return n(v) + ' ' + p[1] + u;
  }
  return { gcd: gcd, n: n, frac: frac, piFrac: piFrac, sqrtS: sqrtS, lin: lin, pt: pt, dec: dec, opts: opts, fill: fill, clean: clean, si: si };
})();
