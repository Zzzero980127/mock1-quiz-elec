/* v1.8：統測區（仿 111～115 學年度統測：電機與電子群資電類專一、專二，共同科目國文、英文、數學C）
 * 只收一模範圍內的單元。用 addTc（_helpers.js）掛到各單元的 u.tc，id = 科目-單元-t序號。
 * 之後再加題，請接在本檔各單元最後面或放到更後面載入的新檔，不要插隊或刪題。
 * 圖為自繪 SVG（DR、DR.bee、DR.elec、DR.dl 與本檔的小工具），數字跟著類題一起換。
 */
(function () {
  var H = QH, n = H.n, O = H.opts, D = H.dec;
  var Dw = DR, T = Dw.text, w = Dw.wire, L = Dw.line;
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function ri(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function par(a, b) { return a * b / (a + b); }
  function sci(x) { var e = Math.floor(Math.log10(Math.abs(x))), m = x / Math.pow(10, e); var sup = String(e).replace(/-/g, '⁻').replace(/\d/g, function (c) { return '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]; }); return D(m, 2) + ' × 10' + sup; }

  /* ---------- 本檔的圖 ---------- */
  // 共陽七段顯示器：位元 b7～b0 = dp g f e d c b a
  function fig7seg() {
    var x = 70, y = 20, s = '';
    function seg(x1, y1, x2, y2, nm, tx, ty) { return '<g stroke-width="6" stroke-linecap="round">' + L(x1, y1, x2, y2) + '</g>' + T(tx, ty, nm, 'middle', 13); }
    s += seg(x + 8, y, x + 52, y, 'a', x + 30, y - 6) + seg(x + 60, y + 8, x + 60, y + 52, 'b', x + 72, y + 34) + seg(x + 60, y + 68, x + 60, y + 112, 'c', x + 72, y + 94);
    s += seg(x + 8, y + 120, x + 52, y + 120, 'd', x + 30, y + 138) + seg(x, y + 68, x, y + 112, 'e', x - 12, y + 94) + seg(x, y + 8, x, y + 52, 'f', x - 12, y + 34) + seg(x + 8, y + 60, x + 52, y + 60, 'g', x + 30, y + 54);
    s += '<circle cx="' + (x + 72) + '" cy="' + (y + 120) + '" r="4" fill="currentColor"/>' + T(x + 86, y + 124, 'dp', 'start', 12);
    s += T(170, 50, 'PA7 … PA0', 'start', 13) + T(170, 72, '= dp g f e d c b a', 'start', 13) + T(170, 100, '共陽極：', 'start', 13) + T(170, 120, '輸出 0 → 該段亮', 'start', 13);
    return Dw.svg(330, 160, s);
  }
  // 四變數卡諾圖（含隨意項 X）
  function figKmapX(ms, dc) {
    var g = ['00', '01', '11', '10'], c = 38, x0 = 80, y0 = 40, s = T(x0 - 14, y0 - 12, 'CD＼AB', 'end', 12);
    for (var i = 0; i < 4; i++) { s += T(x0 + i * c + c / 2, y0 - 10, g[i], 'middle', 12) + T(x0 - 10, y0 + i * c + c / 2 + 4, g[i], 'end', 12); }
    for (var col = 0; col < 4; col++) for (var row = 0; row < 4; row++) {
      var m = parseInt(g[col] + g[row], 2), v = ms.indexOf(m) >= 0 ? '1' : dc.indexOf(m) >= 0 ? 'X' : '';
      s += '<rect x="' + (x0 + col * c) + '" y="' + (y0 + row * c) + '" width="' + c + '" height="' + c + '"/>' + (v ? T(x0 + col * c + c / 2, y0 + row * c + c / 2 + 5, v, 'middle', 15) : '');
    }
    return Dw.svg(250, 200, s);
  }
  // 二次函數圖形（數學C 用）
  function parab(a, b, c) {
    var sc = 22, ox = 175, oy = 120, s = Dw.arrow(20, oy, 330, oy) + Dw.arrow(ox, 225, ox, 12) + T(334, oy + 4, 'x', 'start', 13) + T(ox + 6, 16, 'y', 'start', 13) + T(ox - 6, oy + 14, 'O', 'end', 12);
    var pts = [], segs = [];
    for (var px = 25; px <= 325; px += 3) { var xx = (px - ox) / sc, yy = a * xx * xx + b * xx + c, py = oy - yy * sc / 2.2; if (py < 8 || py > 228) { if (pts.length > 1) segs.push(pts); pts = []; continue; } pts.push([px, Math.round(py * 10) / 10]); }
    if (pts.length > 1) segs.push(pts);
    return Dw.svg(350, 235, s + '<g stroke-width="2.2">' + segs.map(function (p) { return w.apply(null, p); }).join('') + '</g>');
  }

  /* ================= 基本電學 ================= */
  addTc('bee', 0, [
    ['原子結構', '（仿 115 統測）有關原子結構，下列敘述何者正確？', ['原子最外層軌道上的電子稱為價電子', '原子中的電子數等於質子數與中子數之和', '失去電子的原子稱為負離子', '原子核有質子，所以原子呈正電性'], '電中性原子：電子數 = 質子數；失去電子變正離子、得到電子變負離子；價電子決定導電性（導體價電子少於 4 個）。'],
    { t: '電阻溫度係數', g: function () {
      var R1 = pick([10, 20, 40, 50]), t1 = pick([0, 10, 16, 20]), dt = pick([40, 50, 100]), r = pick([0.2, 0.25, 0.4]), t2 = t1 + dt, R2 = R1 * (1 + r), t3 = t1 + pick([4, 5, 10, 20]);
      var k = (R2 - R1) / dt, R3 = R1 + k * (t3 - t1), a3 = k / R3;
      return ['（仿 115 統測）某金屬導體電阻與溫度成線性關係，' + t1 + ' °C 時為 ' + R1 + ' Ω，' + t2 + ' °C 時為 ' + D(R2, 2) + ' Ω，則此導體在 ' + t3 + ' °C 時的電阻溫度係數約為何？',
        O(D(a3, 5) + ' /°C', [D(k / R1, 5) + ' /°C', D(k / R2, 5) + ' /°C', D(a3 * 2, 5) + ' /°C']),
        '每升高 1 °C 電阻增加 ' + D(R2 - R1, 2) + '/' + dt + ' = ' + D(k, 4) + ' Ω。\n' + t3 + ' °C 時 R = ' + R1 + ' + ' + D(k, 4) + '×' + (t3 - t1) + ' = ' + D(R3, 3) + ' Ω。\nα = (ΔR/Δt) ÷ R(' + t3 + '°C) = ' + D(k, 4) + '/' + D(R3, 3) + ' ≈ ' + D(a3, 5) + ' /°C（要除以「該溫度」的電阻）。'];
    } },
    { t: '電能與電費', g: function () {
      var P = pick([800, 1000, 1200, 1500, 2000]), h = pick([2, 3, 4, 5]), d = 30, rate = pick([3, 4, 5]), kwh = P / 1000 * h * d;
      return ['（仿統測）一台 ' + P + ' W 的電器每天使用 ' + h + ' 小時，一個月（30 天）的電費約多少元？（每度 ' + rate + ' 元）', O(D(kwh * rate, 1) + ' 元', [D(kwh, 1) + ' 元', D(kwh * rate / 30, 1) + ' 元', D(P * h * d * rate / 100, 1) + ' 元']),
        '用電量 = ' + P / 1000 + ' kW × ' + h + ' h × 30 = ' + D(kwh, 1) + ' 度（kWh），電費 = ' + D(kwh, 1) + ' × ' + rate + ' = ' + D(kwh * rate, 1) + ' 元。'];
    } },
    { t: '電量與電子數', g: function () {
      var I = pick([0.8, 1.6, 3.2, 4.8]), t = pick([2, 5, 10]), Q = I * t, ne = Q / 1.6e-19;
      return ['（仿統測）導線中通過 ' + I + ' A 的電流 ' + t + ' 秒，流過某截面的電子數約為多少個？', O(sci(ne), [sci(ne * 10), sci(ne / 10), sci(Q * 1.6e-19 * 1e38)]),
        'Q = I·t = ' + D(Q, 2) + ' C；每個電子帶 1.6 × 10⁻¹⁹ C → 電子數 = ' + D(Q, 2) + ' ÷ (1.6 × 10⁻¹⁹) = ' + sci(ne) + ' 個。'];
    } }
  ]);
  var COL = ['黑', '棕', '紅', '橙', '黃', '綠', '藍', '紫', '灰', '白'];
  function code5(R) { // 五環：三位有效數字 + 乘數 + 誤差（紫 ±0.1%）
    var e = 0; while (R >= 1000) { R /= 10; e++; } while (R < 100) { R *= 10; e--; }
    var s = String(Math.round(R)); return COL[+s[0]] + COL[+s[1]] + COL[+s[2]] + COL[e] + '紫';
  }
  addTc('bee', 1, [
    { t: '五環色碼', g: function () {
      var R = pick([220, 330, 470, 560, 680, 1000, 1200, 2200, 4700]), tot = R / 2;
      return ['（仿 115 統測）兩個相同的五環色碼電阻並聯後總電阻為 ' + D(tot, 1) + ' Ω，則每個電阻的色環由第一環到第五環可能為何？',
        O(code5(R), [code5(tot), code5(R * 10), code5(R * 2)]),
        '兩個相同電阻並聯 R/2 = ' + D(tot, 1) + ' → R = ' + R + ' Ω。五環：前三環是有效數字、第四環是乘數、第五環是誤差（紫 ±0.1 %）。\n' + R + ' Ω → ' + code5(R) + '。'];
    } },
    { t: '導線拉長', g: function () {
      var R = pick([2, 4, 5, 10]), k = pick([2, 3, 4]);
      return ['（仿統測）一條電阻 ' + R + ' Ω 的均勻導線，在體積不變下均勻拉長為原來的 ' + k + ' 倍，則電阻變為多少？', O(R * k * k + ' Ω', [R * k + ' Ω', D(R / k, 2) + ' Ω', R * k * k * k + ' Ω']),
        '體積不變：長度 ×' + k + '，截面積 ÷' + k + '。R = ρL/A → R 變 ' + k + '² = ' + k * k + ' 倍 = ' + R * k * k + ' Ω。'];
    } },
    ['溫度係數', '（仿統測）下列哪一種材料的電阻溫度係數為「負值」（溫度升高電阻變小）？', ['碳', '銅', '鋁', '鎢'], '碳、半導體、絕緣體為負溫度係數；一般金屬（銅、鋁、鎢）為正溫度係數。']
  ]);
  addTc('bee', 2, [
    { t: '串聯分壓', g: function () {
      var r = [pick([2, 4, 6]), pick([3, 5, 8]), pick([4, 6, 10])], V = (r[0] + r[1] + r[2]) * pick([1, 2, 3]), I = V / (r[0] + r[1] + r[2]);
      return ['（仿統測）如圖之串聯電路，R₂ 兩端的電壓為何？', O(D(I * r[1], 2) + ' V', [D(I * r[0], 2) + ' V', D(I * r[2], 2) + ' V', D(I, 2) + ' V']),
        'R_T = ' + (r[0] + r[1] + r[2]) + ' Ω，I = ' + V + '/' + (r[0] + r[1] + r[2]) + ' = ' + D(I, 2) + ' A；V₂ = I·R₂ = ' + D(I * r[1], 2) + ' V（分壓：V₂ = V·R₂/R_T）。',
        DR.bee.figSeries(V + ' V', 'R₁=' + r[0] + 'Ω', 'R₂=' + r[1] + 'Ω', 'R₃=' + r[2] + 'Ω')];
    } },
    { t: '串並聯分流', g: function () {
      var p = pick([[6, 3], [12, 6], [20, 30], [10, 40], [30, 60]]), R1 = pick([2, 4, 8, 10]), Rp = par(p[0], p[1]), V = (R1 + Rp) * pick([1, 2]), It = V / (R1 + Rp), I3 = It * p[0] / (p[0] + p[1]);
      return ['（仿 115 統測）如圖電路，流過 R₃ 的電流為何？', O(D(I3, 2) + ' A', [D(It, 2) + ' A', D(It - I3, 2) + ' A', D(V / p[1], 2) + ' A']),
        'R₂ ∥ R₃ = ' + D(Rp, 2) + ' Ω，R_T = ' + D(R1 + Rp, 2) + ' Ω，I = ' + D(It, 2) + ' A。\n分流：I₃ = I × R₂/(R₂ + R₃) = ' + D(I3, 2) + ' A。',
        DR.bee.figMixed(V + ' V', 'R₁ = ' + R1 + ' Ω', 'R₂ = ' + p[0] + ' Ω', 'R₃ = ' + p[1] + ' Ω')];
    } },
    { t: '電橋平衡', g: function () {
      var R1 = pick([10, 20, 30]), R2 = pick([20, 40, 60]), R3 = pick([15, 30, 45]), R4 = R2 * R3 / R1;
      return ['（仿統測）如圖之惠斯登電橋，檢流計 G 指示為零時，R₄ 為多少？', O(D(R4, 2) + ' Ω', [D(R1 * R3 / R2, 2) + ' Ω', D(R1 * R2 / R3, 2) + ' Ω', D(R2 + R3 - R1, 2) + ' Ω']),
        '電橋平衡：對邊電阻乘積相等 R₁R₄ = R₂R₃ → R₄ = ' + R2 + '×' + R3 + '/' + R1 + ' = ' + D(R4, 2) + ' Ω。',
        DR.bee.figBridge('R₁ = ' + R1 + ' Ω', 'R₂ = ' + R2 + ' Ω', 'R₃ = ' + R3 + ' Ω', 'R₄ = ?')];
    } }
  ]);
  addTc('bee', 3, [
    { t: '最大功率轉移', g: function () {
      var r1 = pick([10, 20, 30, 60]), r2 = pick([20, 30, 60]), r3 = pick([5, 10, 15, 20]), E = pick([30, 60, 90, 120]);
      var Rth = par(r1, r2) + r3, Vth = E * r2 / (r1 + r2), Pm = Vth * Vth / (4 * Rth), ask = pick([0, 1]);
      var q = ask ? ['R_L 可獲得的最大功率約為何？', D(Pm, 2) + ' W', [D(Vth * Vth / Rth, 2) + ' W', D(E * E / (4 * Rth), 2) + ' W', D(Pm / 2, 2) + ' W']] : ['R_L 為多少時可獲得最大功率？', D(Rth, 2) + ' Ω', [D(r1 + r2 + r3, 2) + ' Ω', D(par(r1, r2), 2) + ' Ω', D(r2 + r3, 2) + ' Ω']];
      return ['（仿 115 統測）如圖電路的 a、b 兩端接負載 R_L，' + q[0], O(q[1], q[2]),
        '戴維寧等效：R_th = R₁ ∥ R₂ + R₃ = ' + D(Rth, 2) + ' Ω，V_th = E·R₂/(R₁ + R₂) = ' + D(Vth, 2) + ' V。\nR_L = R_th 時功率最大，P_max = V_th²/(4R_th) = ' + D(Pm, 2) + ' W（此時效率只有 50 %）。',
        DR.bee.figThev('E = ' + E + ' V', 'R₁ = ' + r1 + ' Ω', 'R₂ = ' + r2 + ' Ω', 'R₃ = ' + r3 + ' Ω')];
    } },
    { t: '節點電壓（密爾曼）', g: function () {
      var E1 = pick([12, 24, 36]), E2 = pick([6, 12, 18]), R1 = pick([2, 3, 6]), R2 = pick([3, 6]), R3 = pick([3, 6, 12]);
      var V = (E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2 + 1 / R3);
      return ['（仿統測）電壓源 E₁ = ' + E1 + ' V 串 R₁ = ' + R1 + ' Ω、E₂ = ' + E2 + ' V 串 R₂ = ' + R2 + ' Ω，兩支路並接到同一節點，節點再經 R₃ = ' + R3 + ' Ω 接地（兩電源負端皆接地），則節點電壓約為何？',
        O(D(V, 2) + ' V', [D((E1 + E2) / 2, 2) + ' V', D((E1 / R1 + E2 / R2) / (1 / R1 + 1 / R2), 2) + ' V', D(V * R3 / (R1 + R3), 2) + ' V']),
        '節點法（密爾曼）：V = (E₁/R₁ + E₂/R₂) ÷ (1/R₁ + 1/R₂ + 1/R₃) = ' + D(E1 / R1 + E2 / R2, 3) + ' ÷ ' + D(1 / R1 + 1 / R2 + 1 / R3, 3) + ' ≈ ' + D(V, 2) + ' V。'];
    } },
    ['電源轉換', '（仿統測）一個 12 V 電壓源串聯 4 Ω 內阻，轉換成等效電流源時應為：', ['3 A 電流源並聯 4 Ω', '3 A 電流源串聯 4 Ω', '48 A 電流源並聯 4 Ω', '3 A 電流源並聯 0.25 Ω'], '電壓源 E 串 R ⇔ 電流源 I = E/R 並 R：I = 12/4 = 3 A，並聯 4 Ω。']
  ]);

  /* ================= 基本電學實習 ================= */
  addTc('beel', 0, [
    ['急救', '（仿 115 統測）發現傷者心跳停止，下列處置何者正確？', ['立刻施行心肺復甦術（CPR），並請旁人求救、取 AED', '以酒精擦拭額頭', '等家屬來處理', '先餵傷者喝水'], '叫叫 CABD：確認意識、求救、胸外按壓（C）、暢通呼吸道（A）、人工呼吸（B）、電擊（D，AED）。觸電者要先切斷電源再救。'],
    ['電氣火災', '（仿統測）工場發生電氣設備火災時，下列處置何者錯誤？', ['立即以水柱滅火', '先切斷電源', '使用二氧化碳滅火器', '使用乾粉滅火器'], '電氣火災（C 類）帶電時不可用水，以免觸電；應先斷電，再用 CO₂ 或乾粉滅火器。'],
    ['漏電斷路器', '（仿統測）一般住宅浴室、廚房插座迴路裝設的漏電斷路器，其額定感度電流與動作時間通常為：', ['30 mA、0.1 秒以內', '300 mA、1 秒以內', '3 A、0.5 秒以內', '15 A、5 秒以內'], '高感度高速型：30 mA 以下、0.1 秒內跳脫，可保護人員避免觸電。']
  ]);
  addTc('beel', 1, [
    { t: '家電電流與保險絲', g: function () {
      var V = 110, P = pick([550, 880, 1100, 1320, 1650]), I = P / V;
      return ['（仿統測）一台 110 V、' + P + ' W 的電器，正常工作時電流約為多少？若此插座迴路另有 ' + D(15 - I, 1) + ' A 的負載，總電流約為何？', O(D(I, 2) + ' A；' + D(15, 1) + ' A', [D(I, 2) + ' A；' + D(15 - I, 1) + ' A', D(V / P, 3) + ' A；' + D(15, 1) + ' A', D(I * 2, 2) + ' A；' + D(15 + I, 1) + ' A']),
        'I = P/V = ' + P + '/110 = ' + D(I, 2) + ' A；並聯負載電流相加 = ' + D(I, 2) + ' + ' + D(15 - I, 2) + ' = 15 A。'];
    } },
    ['三用電表', '（仿統測）使用三用電表測量電阻時，下列敘述何者錯誤？', ['可在電路通電的狀態下直接測量', '每次換檔都要先做歐姆歸零（指針式）', '測量時手不要同時碰觸兩支測試棒的金屬部分', '測量在線電阻時，最好先將電阻一端拆離電路'], '量電阻時三用電表用內部電池供電，待測電路必須「斷電」，否則會燒表或讀數錯誤。'],
    ['電表接法', '（仿統測）用電表測量負載的電壓與電流時，電壓表與電流表應如何連接？', ['電壓表與負載並聯，電流表與負載串聯', '電壓表與負載串聯，電流表與負載並聯', '兩者都與負載並聯', '兩者都與負載串聯'], '電壓表內阻很大，並聯不影響電路；電流表內阻很小，必須串聯在電路中。']
  ]);
  addTc('beel', 2, [
    { t: '分流器', g: function () {
      var Im = pick([1, 2, 5]), Rm = pick([50, 100, 200]), I = pick([0.1, 0.5, 1]), Rs = Im / 1000 * Rm / (I - Im / 1000);
      return ['（仿統測）一個滿刻度 ' + Im + ' mA、內阻 ' + Rm + ' Ω 的電流表，要擴大為 ' + I + ' A 的電流表，需並聯多少的分流電阻？', O(D(Rs, 3) + ' Ω', [D(Rm * Im / 1000 / I, 3) + ' Ω', D(Rs * 10, 3) + ' Ω', D(I / (Im / 1000) * Rm, 1) + ' Ω']),
        '分流電阻承受 I − Im = ' + D(I - Im / 1000, 3) + ' A，兩端電壓 = Im·Rm = ' + D(Im * Rm / 1000, 3) + ' V。\nRs = ' + D(Im * Rm / 1000, 3) + ' ÷ ' + D(I - Im / 1000, 3) + ' ≈ ' + D(Rs, 3) + ' Ω。'];
    } },
    { t: '倍增器', g: function () {
      var Im = pick([1, 2, 5]), Rm = pick([50, 100, 200]), V = pick([10, 50, 100]), Rs = V / (Im / 1000) - Rm;
      return ['（仿統測）滿刻度 ' + Im + ' mA、內阻 ' + Rm + ' Ω 的電表，要改成 ' + V + ' V 的電壓表，需串聯多少電阻？', O(D(Rs / 1000, 3) + ' kΩ', [D(V / (Im / 1000) / 1000, 3) + ' kΩ', D((V / (Im / 1000) + Rm) / 1000, 3) + ' kΩ', D(Rs / 10000, 3) + ' kΩ']),
        '總電阻 = V/Im = ' + V + ' ÷ ' + Im / 1000 + ' = ' + D(V / (Im / 1000), 0) + ' Ω，倍增電阻 = 總電阻 − Rm = ' + D(Rs, 0) + ' Ω = ' + D(Rs / 1000, 3) + ' kΩ。'];
    } }
  ]);

  /* ================= 電子學 ================= */
  addTc('elec', 0, [
    { t: '波形因數', g: function () {
      var wv = pick([['正弦波', 1.11, 1.414], ['方波', 1, 1], ['三角波', 1.155, 1.732]]), ask = pick([0, 1]);
      return ['（仿 115 統測）' + wv[0] + '的' + (ask ? '峰值因數（波峰因數）' : '波形因數') + '約為何？', O(D(ask ? wv[2] : wv[1], 3), ['1.11', '1', '1.155', '1.414', '1.732', '0.707']),
        '波形因數 = 有效值/平均值、峰值因數 = 峰值/有效值。正弦波：1.11、1.414；方波：1、1；三角波：1.155、1.732。'];
    } },
    { t: '分貝與增益', g: function () {
      var a = pick([10, 20, 50, 100]), b = pick([10, 20, 100]), dB = 20 * Math.log10(a * b);
      return ['（仿 115 統測）兩級放大器的電壓增益分別為 ' + a + ' 倍與 ' + b + ' 倍，總電壓增益約為多少 dB？', O(D(dB, 1) + ' dB', [D(20 * Math.log10(a) + 20 * Math.log10(b) / 2, 1) + ' dB', D(10 * Math.log10(a * b), 1) + ' dB', D(a * b / 10, 1) + ' dB']),
        '串級總增益相乘 ' + a + '×' + b + ' = ' + a * b + ' 倍；dB 值相加：20 log ' + a * b + ' ≈ ' + D(dB, 1) + ' dB。'];
    } },
    { t: '共模拒斥比', g: function () {
      var Ad = pick([2e4, 1e5, 2e5]), k = pick([1, 2, 3]), Ac = Ad / Math.pow(10, k), dB = 20 * k;
      return ['（仿 115 統測）某運算放大器差模增益 A_d = ' + sci(Ad).replace('.00', '') + '，共模增益 A_c = ' + D(Ac, 2) + '，其 CMRR 為多少 dB？', O(dB + ' dB', [dB / 2 + ' dB', dB + 20 + ' dB', 10 * k + ' dB']),
        'CMRR = A_d/A_c = 10^' + k + '，以 dB 表示 = 20 log 10^' + k + ' = ' + dB + ' dB。'];
    } },
    ['分貝觀念', '（仿 115 統測）有關放大電路增益的 dB 值，下列敘述何者正確？', ['dB 值 < 0，表示輸出振幅小於輸入振幅', 'dB 值 > 0，表示輸出與輸入同相', 'dB 值 < 0，表示輸出與輸入反相', 'dB 值 = 0，表示輸出振幅為零'], 'dB 只表示大小比例：0 dB 表示輸出 = 輸入，負值表示衰減；相位要另外看（例如共射極反相）。'],
    { t: '脈波平均值', g: function () {
      var Vm = pick([5, 10, 12]), T0 = pick([10, 20]), on = pick([2, 4, 5, 8]);
      return ['（仿統測）一週期 ' + T0 + ' ms 的脈波，高準位 ' + Vm + ' V 持續 ' + on + ' ms、其餘為 0 V，則工作週期與平均值為何？', O(D(on / T0 * 100, 1) + ' %；' + D(Vm * on / T0, 2) + ' V', [D(on / T0 * 100, 1) + ' %；' + D(Vm / 2, 2) + ' V', D((T0 - on) / T0 * 100, 1) + ' %；' + D(Vm * (T0 - on) / T0, 2) + ' V', D(on / T0 * 100, 1) + ' %；' + D(Vm * Math.sqrt(on / T0), 2) + ' V']),
        '工作週期 D = 脈寬/週期 = ' + on + '/' + T0 + ' = ' + D(on / T0 * 100, 1) + ' %；平均值 = Vm × D = ' + D(Vm * on / T0, 2) + ' V（有效值 = Vm√D）。'];
    } }
  ]);
  addTc('elec', 1, [
    { t: '整流平均值與頻率', g: function () {
      var Vrms = pick([100, 110, 120]), f = 60, full = pick([true, false]), Vm = Vrms * Math.SQRT2, avg = full ? 2 * Vm / Math.PI : Vm / Math.PI;
      return ['（仿 115 統測）理想二極體' + (full ? '全波' : '半波') + '整流電路接純電阻負載，輸入 ' + Vrms + ' V（有效值）、60 Hz，則輸出電壓平均值與輸出波形頻率約為何？',
        O(D(avg, 1) + ' V；' + (full ? 120 : 60) + ' Hz', [D(avg, 1) + ' V；' + (full ? 60 : 120) + ' Hz', D(full ? Vm / Math.PI : 2 * Vm / Math.PI, 1) + ' V；' + (full ? 120 : 60) + ' Hz', D(Vrms * 0.9, 1) + ' V；' + (full ? 60 : 120) + ' Hz']),
        'Vm = ' + Vrms + '√2 ≈ ' + D(Vm, 1) + ' V。半波 V_av = Vm/π、頻率 = 輸入頻率；全波 V_av = 2Vm/π、頻率加倍。\n本題 V_av ≈ ' + D(avg, 1) + ' V，頻率 ' + (full ? 120 : 60) + ' Hz。', DR.elec.figRect(full ? 'bridge' : 'half', 'vi')];
    } },
    { t: '稽納限流電阻', g: function () {
      var Vz = pick([5, 6, 9, 12]), PZ = pick([60, 90, 120]), PL = pick([30, 60, 90]), Vi = Vz + pick([6, 8, 10, 12]), IZM = PZ / Vz, IL = PL / Vz, Rmin = (Vi - Vz) / (IZM + IL) * 1000;
      return ['（仿 115 統測）如圖之稽納穩壓電路，輸入 ' + Vi + ' V，稽納二極體 V_Z = ' + Vz + ' V、最大額定功率 ' + PZ + ' mW。若負載功率 P_L = ' + PL + ' mW 且維持穩壓，限流電阻 R_S 最小值約為何？',
        O(D(Rmin, 1) + ' Ω', [D((Vi - Vz) / IZM * 1000, 1) + ' Ω', D((Vi - Vz) / IL * 1000, 1) + ' Ω', D(Vi / (IZM + IL) * 1000, 1) + ' Ω']),
        'I_ZM = P_Z/V_Z = ' + D(IZM, 2) + ' mA，I_L = P_L/V_Z = ' + D(IL, 2) + ' mA。\nR_S 最小時流過稽納的電流最大：R_S(min) = (V_i − V_Z)/(I_ZM + I_L) = ' + (Vi - Vz) + ' ÷ ' + D(IZM + IL, 2) + ' mA ≈ ' + D(Rmin, 1) + ' Ω。',
        DR.elec.figZener(Vi + ' V', 'R_S', 'V_Z = ' + Vz + ' V', 'I_L')];
    } },
    { t: '二極體串聯電路', g: function () {
      var V = pick([5, 9, 12, 15]), R = pick([1, 2, 4.3]), n2 = pick([1, 2]), I = (V - 0.7 * n2) / R;
      return ['（仿統測）電源 ' + V + ' V 串接 ' + n2 + ' 個順偏矽二極體（V_D = 0.7 V）與 ' + R + ' kΩ 電阻，電流約為何？', O(D(I, 2) + ' mA', [D(V / R, 2) + ' mA', D((V - 0.7) / R, 2) + ' mA', D((V - 1.4 * n2) / R, 2) + ' mA']),
        'I = (V − ' + n2 + '×0.7)/R = (' + V + ' − ' + D(0.7 * n2, 1) + ')/' + R + ' kΩ ≈ ' + D(I, 2) + ' mA。'];
    } },
    ['峰值逆向電壓', '（仿統測）輸入峰值為 Vm 的整流電路，各二極體承受的峰值逆向電壓（PIV），下列何者正確？', ['中心抽頭全波整流為 2Vm，橋式整流為 Vm', '中心抽頭全波整流為 Vm，橋式整流為 2Vm', '兩者皆為 2Vm', '半波整流（無濾波電容）為 2Vm'], '半波（純電阻負載）PIV = Vm；中心抽頭全波 PIV = 2Vm；橋式 PIV = Vm（但用 4 顆二極體）。']
  ]);
  addTc('elec', 2, [
    { t: '基極偏壓含射極電阻', g: function () {
      var Vcc, RB, RC, RE, b, IB, IC, VCE;
      do { Vcc = pick([12, 15, 20]); RB = pick([300, 430, 470, 680]); RC = pick([2, 3, 4]); RE = pick([0.5, 1]); b = pick([99, 100, 149]);
        IB = (Vcc - 0.7) / (RB + (1 + b) * RE); IC = b * IB; VCE = Vcc - IC * RC - (IC + IB) * RE; } while (VCE < 1);
      return ['（仿 115 統測）如圖電路，β = ' + b + '、V_BE = 0.7 V，則 V_CE 約為何？', O(D(VCE, 2) + ' V', [D(Vcc - IC * RC, 2) + ' V', D(Vcc - (Vcc - 0.7) / RB * b * RC, 2) + ' V', D(VCE + (IC + IB) * RE * 2, 2) + ' V']),
        'I_B = (V_CC − 0.7)/(R_B + (1+β)R_E) = ' + D(Vcc - 0.7, 1) + ' ÷ (' + RB + ' + ' + (1 + b) + '×' + RE + ') kΩ ≈ ' + D(IB * 1000, 2) + ' μA。\nI_C = βI_B ≈ ' + D(IC, 3) + ' mA，I_E ≈ ' + D(IC + IB, 3) + ' mA。\nV_CE = V_CC − I_C R_C − I_E R_E ≈ ' + D(VCE, 2) + ' V（> 0.2 V，在主動區）。',
        DR.elec.figBias({ V: 'VCC = ' + Vcc + ' V', RB: 'RB = ' + RB + ' kΩ', RC: 'RC = ' + RC + ' kΩ', RE: 'RE = ' + RE + ' kΩ' })];
    } },
    { t: '分壓偏壓', g: function () {
      var Vcc = pick([12, 15, 18]), r = pick([[40, 10], [30, 10], [56, 12], [47, 10]]), RE = pick([1, 1.5, 2]), RC = pick([2, 3, 4]);
      var VB = Vcc * r[1] / (r[0] + r[1]), IE = (VB - 0.7) / RE, VC = Vcc - IE * RC;
      return ['（仿統測）如圖之分壓偏壓電路，β 很大（I_B 可忽略）、V_BE = 0.7 V，則集極電壓 V_C 約為何？', O(D(VC, 2) + ' V', [D(VB, 2) + ' V', D(VB - 0.7, 2) + ' V', D(Vcc - VB / RE * RC, 2) + ' V']),
        'V_B = V_CC·R₂/(R₁ + R₂) = ' + D(VB, 2) + ' V，V_E = ' + D(VB - 0.7, 2) + ' V，I_C ≈ I_E = ' + D(IE, 3) + ' mA。\nV_C = V_CC − I_C R_C ≈ ' + D(VC, 2) + ' V。',
        DR.elec.figBias({ V: 'VCC = ' + Vcc + ' V', R1: 'R₁ = ' + r[0] + ' kΩ', R2: 'R₂ = ' + r[1] + ' kΩ', RC: 'RC = ' + RC + ' kΩ', RE: 'RE = ' + RE + ' kΩ' })];
    } },
    { t: 'α 與 β', g: function () {
      var b = pick([49, 99, 199, 149]), a = b / (b + 1), IE = pick([2, 5, 10]);
      return ['（仿統測）某 BJT 的 β = ' + b + '，若 I_E = ' + IE + ' mA，則 α 與 I_B 分別約為何？', O(D(a, 3) + '；' + D(IE / (b + 1) * 1000, 1) + ' μA', [D(a, 3) + '；' + D(IE / b * 1000, 1) + ' μA', D(1 / a, 3) + '；' + D(IE / (b + 1) * 1000, 1) + ' μA', D(a, 3) + '；' + D(IE * a, 1) + ' μA']),
        'α = β/(β+1) = ' + b + '/' + (b + 1) + ' ≈ ' + D(a, 3) + '；I_B = I_E/(β+1) = ' + IE + '/' + (b + 1) + ' mA ≈ ' + D(IE / (b + 1) * 1000, 1) + ' μA。'];
    } },
    ['工作區', '（仿統測）NPN 電晶體工作於「主動區」時，兩個接面的偏壓狀態為何？', ['BE 接面順偏、BC 接面逆偏', 'BE 接面逆偏、BC 接面順偏', '兩接面都順偏', '兩接面都逆偏'], '主動區（放大）：BE 順、BC 逆；飽和區：兩者都順偏；截止區：兩者都逆偏（BE 至少未導通）。']
  ]);
  addTc('elec', 3, [
    { t: '小訊號參數', g: function () {
      var IC = pick([1, 1.3, 2, 2.6]), b = pick([100, 120, 150]), RC = pick([2, 3, 4]), RL = pick([4, 6, 12]), gm = IC / 26, rpi = b / gm, Av = -gm * par(RC, RL) * 1000 / 1000;
      return ['（仿 115 統測）共射極放大電路（射極電阻已被旁路）I_CQ = ' + IC + ' mA、β = ' + b + '、V_T = 26 mV，R_C = ' + RC + ' kΩ，負載 R_L = ' + RL + ' kΩ，則 r_π 與電壓增益 A_v 約為何？',
        O(D(rpi, 2) + ' kΩ；' + D(Av, 1), [D(rpi, 2) + ' kΩ；' + D(-Av, 1), D(rpi / 2, 2) + ' kΩ；' + D(Av, 1), D(rpi, 2) + ' kΩ；' + D(-gm * RC, 1)]),
        'g_m = I_C/V_T = ' + IC + '/26 ≈ ' + D(gm, 4) + ' A/V（= ' + D(gm * 1000, 1) + ' mA/V）；r_π = β/g_m ≈ ' + D(rpi, 2) + ' kΩ。\nA_v = −g_m (R_C ∥ R_L) = −' + D(gm * 1000, 1) + ' mA/V × ' + D(par(RC, RL), 2) + ' kΩ ≈ ' + D(Av, 1) + '（負號表示反相）。',
        DR.elec.figBias({ V: 'VCC', R1: 'R₁', R2: 'R₂', RC: 'RC = ' + RC + ' kΩ', RE: 'RE', ce: true, ac: true })];
    } },
    ['三種組態', '（仿 115 統測）BJT 三種基本放大組態的比較，下列何者正確？', ['共集極（射極隨耦器）電壓增益約為 1、輸出與輸入同相', '共射極輸出與輸入同相', '共基極輸入阻抗最高', '共集極的電壓增益最大'], '共射極：反相、電壓與電流增益都大；共集極：A_v ≈ 1、同相、輸入阻抗高輸出阻抗低（緩衝）；共基極：同相、輸入阻抗低、電流增益 ≈ 1。'],
    ['射極旁路電容', '（仿統測）共射極放大電路中，射極旁路電容 C_E 開路（損壞）時，對電路的影響為何？', ['電壓增益明顯下降，但直流工作點不變', '電壓增益變大', '直流工作點改變，電晶體進入飽和', '輸出波形變成與輸入同相'], 'C_E 只影響交流：開路後交流射極電阻變成 R_E，A_v ≈ −R_C/(r_e + R_E) 大幅下降；直流偏壓本來就不經電容，不變。']
  ]);

  /* ================= 電子學實習 ================= */
  addTc('elecl', 0, [
    ['焊接安全', '（仿統測）電子實習焊接時，下列作法何者錯誤？', ['烙鐵暫時不用時平放在桌面上', '保持通風、避免吸入助焊劑煙霧', '焊接後洗手', '烙鐵放在烙鐵架上'], '烙鐵頭溫度約 300 °C 以上，暫時不用要放回烙鐵架，平放桌面容易燙傷或引起火災。'],
    ['靜電防護', '（仿統測）拿取 MOSFET、CMOS IC 等元件時，為防止靜電損壞，下列作法何者正確？', ['配戴接地的靜電手環並使用防靜電袋保存', '用手直接搓揉接腳以除去氧化層', '放在塑膠袋中保存', '在地毯上作業'], 'MOS 元件閘極氧化層很薄，靜電容易擊穿；要接地防靜電，保存在導電泡棉或防靜電袋。']
  ]);
  addTc('elecl', 1, [
    { t: '示波器讀值', g: function () {
      var per = pick([2, 4, 5]), vpp = pick([4, 6]), vd = pick([0.5, 1, 2, 5]), td = pick([0.1, 0.2, 0.5, 1]), Vp = vpp * vd, f = 1 / (per * td) * 1000;
      return ['（仿統測）示波器顯示如圖（10 × 8 格），垂直檔位 ' + vd + ' V/DIV、水平檔位 ' + td + ' ms/DIV，此正弦波的峰對峰值與頻率為何？', O(D(Vp, 2) + ' V；' + D(f, 1) + ' Hz', [D(Vp / 2, 2) + ' V；' + D(f, 1) + ' Hz', D(Vp, 2) + ' V；' + D(f * 2, 1) + ' Hz', D(Vp / 2.828, 2) + ' V；' + D(f, 1) + ' Hz']),
        '峰對峰佔 ' + vpp + ' 格 × ' + vd + ' V = ' + D(Vp, 2) + ' V（有效值 ≈ ' + D(Vp / 2.828, 2) + ' V）；一週期 ' + per + ' 格 × ' + td + ' ms = ' + D(per * td, 2) + ' ms → f = ' + D(f, 1) + ' Hz。', Dw.scope(per, vpp)];
    } },
    ['耦合方式', '（仿 115 統測）示波器輸入耦合設定在 DC 檔位時，下列敘述何者正確？', ['可顯示含直流與交流成分的完整信號', '只能測量直流信號', '只能測量交流信號', '探棒與電路串聯可量電流'], 'DC 耦合直接輸入，直流準位與交流都會顯示；AC 耦合經電容隔直流，只看交流成分；GND 用來找 0 V 基準線。'],
    ['二極體檢測', '（仿統測）以指針式三用電表 R × 10 檔測量好的矽二極體，下列敘述何者正確？', ['黑棒接陽極、紅棒接陰極時電阻小（順偏）', '紅棒接陽極、黑棒接陰極時電阻小', '正反向電阻都很小', '正反向電阻都無限大'], '指針式電表歐姆檔的黑棒接內部電池「正極」，黑棒接陽極才是順偏、指針偏轉大（電阻小）；反向電阻極大。']
  ]);
  addTc('elecl', 2, [
    { t: '實測 β', g: function () {
      var RB = pick([100, 220, 470]), IB = pick([10, 20, 25]) / 1000, b = pick([80, 100, 120, 150]), RC = pick([1, 2]), VRB = IB * RB, VRC = b * IB * RC;
      return ['（仿 115 統測）BJT 直流實驗中，以電表量得基極電阻 R_B = ' + RB + ' kΩ 兩端電壓 ' + D(VRB, 2) + ' V、集極電阻 R_C = ' + RC + ' kΩ 兩端電壓 ' + D(VRC, 2) + ' V，則此電晶體 β 約為何？',
        O(String(b), [String(Math.round(b * 1.2)), String(Math.round(b / 1.25)), String(Math.round(VRC / VRB))]),
        'I_B = ' + D(VRB, 2) + ' V ÷ ' + RB + ' kΩ = ' + D(IB * 1000, 1) + ' μA；I_C = ' + D(VRC, 2) + ' V ÷ ' + RC + ' kΩ = ' + D(VRC / RC, 2) + ' mA；β = I_C/I_B = ' + b + '。'];
    } },
    ['電晶體檢測', '（仿統測）以指針式三用電表判斷電晶體：黑棒固定在某一腳，紅棒分別碰另外兩腳時指針都大幅偏轉，則：', ['黑棒所接的是基極，且為 NPN 型', '黑棒所接的是基極，且為 PNP 型', '黑棒所接的是集極', '電晶體已經損壞'], '指針式黑棒 = 內部電池正極。黑棒接 B 對 C、E 都導通，表示 B 為 P 型、兩邊為 N 型 → NPN。']
  ]);
  addTc('elecl', 3, [
    ['組態波形', '（仿 115 統測）示波器（AC 耦合、INV 關閉）同時觀察 BJT 放大電路的輸入與輸出，若輸出振幅明顯大於輸入且相位相反，此電路最可能為：', ['共射極放大電路', '共集極放大電路', '共基極放大電路', '射極隨耦器'], '共射極：放大且反相；共集極（射極隨耦器）：同相、振幅約相等；共基極：同相、電壓放大。'],
    { t: '實測增益', g: function () {
      var vi = pick([20, 50, 100]), Av = pick([10, 20, 50, 100]), vo = vi * Av / 1000;
      return ['（仿統測）放大電路實驗量得輸入峰對峰 ' + vi + ' mV、輸出峰對峰 ' + D(vo, 2) + ' V，則電壓增益約為多少 dB？', O(D(20 * Math.log10(Av), 1) + ' dB', [D(10 * Math.log10(Av), 1) + ' dB', D(Av, 1) + ' dB', D(20 * Math.log10(Av) + 6, 1) + ' dB']),
        'A_v = ' + D(vo, 2) + ' V ÷ ' + vi + ' mV = ' + Av + ' 倍，dB = 20 log ' + Av + ' ≈ ' + D(20 * Math.log10(Av), 1) + ' dB。'];
    } }
  ]);

  /* ================= 微處理機 ================= */
  addTc('mpu', 0, [
    ['ALU', '（仿 115 統測）微處理機中算術邏輯單元（ALU）的功能為何？', ['負責算術與邏輯運算', '當作程式計數器使用', '控制晶片對外部周邊的存取', '儲存程式碼'], 'CPU = ALU（運算）＋控制單元（解碼、時序）＋暫存器；程式計數器 PC 是暫存器，程式碼存在記憶體。'],
    ['管線', '（仿 115 統測）三級管線依序為「提取、解碼、執行」，循序執行且無衝突時，若第 n 行指令在執行階段，則：', ['第 n + 1 行在解碼、第 n + 2 行在提取', '第 n + 1 行在提取、第 n + 2 行在解碼', '第 n、n + 1、n + 2 行同時在提取', '第 n 行的解碼階段才提取第 n 行'], '管線像生產線：同一時間三條指令分別在不同階段，越後面的指令進度越前段。'],
    ['MCU 與 PC', '（仿 115 統測）有關個人電腦（PC）與微控制器（MCU），下列敘述何者正確？', ['MCU 內含 ALU、記憶體與周邊介面', 'MCU 與 PC 都需要 BIOS 開機', 'MCU 與 PC 間無法交換資料', 'PC 的 CPU 透過北橋控制 USB 埠'], 'MCU（單晶片）把 CPU、ROM/RAM、I/O、計時器等整合在一顆晶片；可用 UART/USB 與 PC 通訊；USB 由南橋（PCH）管理。'],
    ['GPU', '（仿 115 統測）有關 GPU 與 CPU，下列敘述何者正確？', ['GPU 內部的 ALU 數量通常遠多於 CPU', '伺服器內只有 GPU 沒有 CPU', 'GPU 會完全取代 CPU', 'GPU 內部只有一個 ALU'], 'GPU 有成千上萬個簡單運算核心，適合大量平行運算（圖形、AI）；CPU 核心少但擅長複雜控制流程。']
  ]);
  var SEG = [0x3F, 0x06, 0x5B, 0x4F, 0x66, 0x6D, 0x7D, 0x07, 0x7F, 0x6F]; // 共陰（1 = 亮），bit0 = a
  function hx(v) { return '0x' + (v & 255).toString(16).toUpperCase().padStart(2, '0'); }
  addTc('mpu', 1, [
    { t: '七段顯示器碼', g: function () {
      var d = ri(0, 9), cc = SEG[d], ca = (~cc) & 255;
      return ['（仿 115 統測）微處理機的輸出埠 PA 接共陽極七段顯示器（PA7～PA0 依序接 dp、g、f、e、d、c、b、a），要顯示數字「' + d + '」（小數點不亮），PA 應輸出的十六進位值為何？',
        O(hx(ca), [hx(cc), hx(ca & 0x7F), hx(((cc << 1) | 1) & 255 ^ 255)]),
        '「' + d + '」要亮的段：' + 'abcdefg'.split('').filter(function (c, i) { return cc >> i & 1; }).join('、') + '。共陰極碼（1 亮）= ' + hx(cc) + '；共陽極是「0 才亮」，取反相（dp 不亮 = 1）= ' + hx(ca) + '。', fig7seg()];
    } },
    { t: '位址線與容量', g: function () {
      var nA = pick([10, 12, 14, 16, 18, 20]), dw = pick([8, 16]), cap = Math.pow(2, nA), kb = cap / 1024;
      var cs = kb >= 1024 ? D(kb / 1024, 0) + ' M' : D(kb, 0) + ' K';
      return ['（仿統測）某記憶體有 ' + nA + ' 條位址線、' + dw + ' 條資料線，其容量為何？', O(cs + ' × ' + dw + ' 位元', [(kb >= 1024 ? D(kb / 2048, 1) + ' M' : D(kb / 2, 1) + ' K') + ' × ' + dw + ' 位元', (kb >= 1024 ? D(kb / 512, 0) + ' M' : D(kb * 2, 0) + ' K') + ' × ' + dw + ' 位元', D(nA * dw, 0) + ' K × 1 位元']),
        'n 條位址線可定址 2ⁿ 個位置：2^' + nA + ' = ' + cs + '；每個位置 ' + dw + ' 位元 → ' + cs + ' × ' + dw + ' 位元。'];
    } },
    ['記憶體種類', '（仿 115 統測）下列哪一組記憶體都具備「可重複寫入」的功能？', ['EEPROM、NOR Flash、SRAM', 'PROM、Mask ROM、SRAM', 'Mask ROM、EEPROM、DRAM', 'PROM、EPROM、NAND Flash'], 'Mask ROM 出廠固定、PROM 只能燒錄一次；EPROM（紫外線抹除）、EEPROM、Flash（NOR/NAND）、SRAM/DRAM 都能重複寫入。'],
    ['SPI', '（仿 115 統測）SPI 介面主機與從機連線，下列敘述何者正確？', ['SCLK 時脈由主機產生', 'MOSI 是從機送資料給主機', 'SS 可以代替 SCLK', 'MOSI 又稱 RX，用來接收資料'], 'MOSI = Master Out Slave In（主機送出），MISO = Master In Slave Out；SS 選擇從機；SCLK 一律由主機提供。'],
    ['DMA', '（仿統測）使用 DMA（直接記憶體存取）的主要好處為何？', ['周邊與記憶體可直接大量傳輸資料，不必每筆都經過 CPU', '可增加 CPU 的暫存器數量', '可讓 CPU 時脈變快', '可取代中斷功能'], 'DMA 控制器向 CPU 要求匯流排（HOLD/HLDA）後，直接在周邊與記憶體間搬資料，CPU 可去做別的事。'],
    ['UART', '（仿 115 統測）UART 非同步串列傳輸的一個資料框，下列敘述何者正確？', ['以一個低準位的起始位元開始，以高準位的停止位元結束', '不需要約定鮑率（baud rate）', '一定要有時脈線', '資料一律由最高位元先送'], 'UART 閒置為高準位；起始位元 0 → 資料位元（通常 LSB 先送，5～8 位）→（同位位元）→ 停止位元 1；雙方要設定相同鮑率，不需時脈線。']
  ]);
  addTc('mpu', 2, [
    ['IDE 功能', '（仿 115 統測）常見微處理機整合發展環境（IDE）不包含下列哪一項功能？', ['印刷電路板佈線', '程式碼編輯', '程式編譯', '程式除錯'], 'IDE 整合「編輯 → 編譯／組譯 → 連結 → 燒錄 → 除錯」；PCB 佈線是 EDA 電路設計軟體的工作。'],
    ['中斷點', '（仿 115 統測）在 IDE 中，程式執行到設定的中斷點（Break Point）時會怎樣？', ['微處理機暫停執行，可觀察暫存器與變數內容', '程式結束', '跳到中斷服務程式', '只是註解，沒有影響'], '除錯中斷點讓程式停在該行，方便單步執行、觀察暫存器與記憶體；和硬體中斷（ISR）不同。'],
    ['看門狗', '（仿 115 統測）MCU 致能看門狗計時器（WDT）後，程式在主迴圈中沒有定期清除 WDT，會發生什麼事？', ['WDT 逾時後 MCU 被重置', 'MCU 永遠不會重置', 'PWM 輸出頻率加倍', '程式編譯失敗'], 'WDT 要在逾時前「餵狗」（清除計數），否則判定當機而重置 MCU。']
  ]);

  /* ================= 數位邏輯設計 ================= */
  addTc('dl', 0, [
    { t: '進制轉換', g: function () {
      var v = ri(40, 250), base = pick([2, 8, 16]), s = v.toString(base).toUpperCase(), nm = { 2: '二進位', 8: '八進位', 16: '十六進位' }[base];
      return ['（仿 115 統測）十進位數 ' + v + ' 轉成' + nm + '為何？', O(s, [(v + 1).toString(base).toUpperCase(), (v - 2).toString(base).toUpperCase(), (v ^ (base === 2 ? 2 : base)).toString(base).toUpperCase()]),
        '連除以 ' + base + ' 取餘數，由下往上讀：' + v + '₁₀ = ' + s + (base === 2 ? '₂' : base === 8 ? '₈' : '₁₆') + '。'];
    } },
    { t: '2 的補數加法', g: function () {
      var a = pick([-1, 1]) * ri(20, 90), b = pick([-1, 1]) * ri(20, 90), s = a + b, ovf = s > 127 || s < -128, r = ((s % 256) + 256) % 256, rv = r > 127 ? r - 256 : r;
      return ['（仿 115 統測）以 8 位元 2 的補數表示，(' + n(a) + ') + (' + n(b) + ') 的運算結果為何？', O(n(rv) + '，' + (ovf ? '發生溢位' : '未發生溢位'), [n(rv) + '，' + (ovf ? '未發生溢位' : '發生溢位'), n(-rv) + '，' + (ovf ? '發生溢位' : '未發生溢位'), String(r) + '，' + (ovf ? '未發生溢位' : '發生溢位')]),
        '8 位元 2 的補數範圍 −128～+127。真正的和 = ' + n(s) + (ovf ? '，超出範圍 → 溢位，8 位元結果解讀為 ' + n(rv) + '。' : '，在範圍內，不溢位。') + '\n判斷：兩數同號相加、結果卻變號才會溢位；異號相加不會溢位。'];
    } },
    ['類比與數位', '（仿 115 統測）有關類比信號與數位信號，下列敘述何者正確？', ['類比信號連續變化；數位信號由高低準位組成', '類比信號完全不受雜訊干擾', '類比信號只能傳聲音、數位只能傳文字', '類比信號只有高低兩種電位'], '數位信號只判斷 0/1，抗雜訊能力強；類比信號連續，容易受雜訊影響。'],
    { t: 'BCD 碼', g: function () {
      var v = ri(10, 99), bcd = String(v).split('').map(function (c) { return (+c).toString(2).padStart(4, '0'); }).join(' ');
      return ['（仿統測）十進位 ' + v + ' 的 8421 BCD 碼為何？', O(bcd, [v.toString(2).padStart(8, '0').replace(/(\d{4})(\d{4})/, '$1 $2'), String(v + 1).split('').map(function (c) { return (+c).toString(2).padStart(4, '0'); }).join(' '), String(v).split('').reverse().map(function (c) { return (+c).toString(2).padStart(4, '0'); }).join(' ')]),
        'BCD 每一位十進位數字各用 4 位元表示：' + String(v).split('').join('、') + ' → ' + bcd + '（不是整個數轉二進位）。'];
    } }
  ]);
  addTc('dl', 1, [
    { t: '邏輯閘輸出', g: function () {
      var types = ['AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'], g = pick(types), k = pick([2, 3]), v = []; for (var i = 0; i < k; i++) v.push(ri(0, 1));
      var out = DR.dl.GATES[g](v), nm = { AND: '及閘', OR: '或閘', NAND: '反及閘', NOR: '反或閘', XOR: '互斥或閘', XNOR: '互斥反或閘' }[g];
      return ['（仿統測）如圖之' + nm + '（' + g + '），輸入如圖所示，輸出 F 為何？', ['F = ' + out, 'F = ' + (1 - out), '無法判斷', '輸出為高阻抗'],
        g + '：' + { AND: '全 1 才 1', OR: '有 1 就 1', NAND: '全 1 才 0', NOR: '有 1 就 0', XOR: '1 的個數為奇數時為 1', XNOR: '1 的個數為偶數時為 1' }[g] + '。輸入 ' + v.join('、') + ' → F = ' + out + '。', DR.dl.figGate(g, v)];
    } },
    { t: '兩級邏輯電路', g: function () {
      var g1 = pick(['AND', 'OR', 'NAND', 'NOR']), g2 = pick(['AND', 'OR', 'XOR', 'NOR']), A = ri(0, 1), B = ri(0, 1), C = ri(0, 1);
      var x = DR.dl.GATES[g1]([A, B]), F = DR.dl.GATES[g2]([x, C]);
      return ['（仿統測）如圖之組合邏輯電路，當 A = ' + A + '、B = ' + B + '、C = ' + C + ' 時，輸出 F 為何？', ['F = ' + F, 'F = ' + (1 - F), '無法判斷', 'F 隨時脈變化'],
        '第一級 ' + g1 + '(' + A + ', ' + B + ') = ' + x + '；第二級 ' + g2 + '(' + x + ', ' + C + ') = ' + F + '。', DR.dl.figTwoLevel(g1, g2)];
    } },
    ['萬用閘', '（仿統測）下列哪一種邏輯閘可單獨組成任何邏輯函數（萬用閘）？', ['NAND 閘', 'XOR 閘', 'AND 閘', 'OR 閘'], 'NAND 與 NOR 都是萬用閘：可以只用它們組出 NOT、AND、OR，進而實現任何布林函數。'],
    ['CMOS 反相器', '（仿 115 統測）CMOS 反相器輸入為邏輯 1（+V_DD）時，兩個 MOSFET 的狀態為何？', ['NMOS 導通、PMOS 截止，輸出為 0', 'PMOS 導通、NMOS 截止，輸出為 1', '兩者都導通', '兩者都截止'], 'CMOS：PMOS 接 V_DD（輸入 0 時導通）、NMOS 接地（輸入 1 時導通）；穩態時總有一顆截止，靜態功耗極低。']
  ]);
  addTc('dl', 2, [
    ['第摩根定理', '（仿統測）依第摩根定理，(A + B)′ 等於下列何者？', ["A′B′", "A′ + B′", "AB", "(AB)′"], "(A + B)′ = A′B′、(AB)′ = A′ + B′：「斷線變號」——上面的橫線斷開，＋與 · 互換。"],
    ['布林定理', '（仿統測）下列布林代數等式，何者錯誤？', ["A + A′B = A′ + B", "A + AB = A", "A(A + B) = A", "A + A′B = A + B"], "A + A′B = (A + A′)(A + B) = A + B，不是 A′ + B；吸收律 A + AB = A、A(A + B) = A。"],
    { t: '互斥或性質', g: function () {
      var c = pick([["A ⊕ A", '0'], ["A ⊕ 1", "A′"], ["A ⊕ 0", 'A'], ["A ⊕ A′", '1']]);
      return ['（仿統測）布林運算 ' + c[0] + ' 的結果為何？', O(c[1], ['0', '1', 'A', "A′"]), 'XOR：相同為 0、不同為 1。A⊕0 = A、A⊕1 = A′、A⊕A = 0、A⊕A′ = 1。'];
    } }
  ]);
  addTc('dl', 3, [
    { t: '卡諾圖含隨意項', g: function () {
      var all = [], ms, dc, best, bestT, bestK, wrong, i;
      function cov(t, m) { return ((m ^ t.v) & ~t.mask & 15) === 0; }
      function valid(ts) { for (var m = 0; m < 16; m++) { var c = ts.some(function (t) { return cov(t, m); }); if (ms.indexOf(m) >= 0 && !c) return false; if (c && ms.indexOf(m) < 0 && dc.indexOf(m) < 0) return false; } return true; }
      for (i = 0; i < 16; i++) all.push(i);
      do {
        var sh = all.slice().sort(function () { return Math.random() - 0.5; }); ms = sh.slice(0, ri(4, 6)).sort(function (a, b) { return a - b; }); dc = sh.slice(6, 6 + ri(2, 3)).sort(function (a, b) { return a - b; });
        best = null; bestK = 1e9;
        for (var m = 0; m < (1 << dc.length); m++) {
          var use = ms.concat(dc.filter(function (_, j) { return m >> j & 1; })).sort(function (a, b) { return a - b; }), t = DR.dlh.minSOP(4, use), s = DR.dlh.sopStr(4, t), k = s.replace(/[^A-D]/g, '').length * 10 + t.length;
          if (k < bestK) { bestK = k; best = s; bestT = t; }
        }
        var plain = DR.dlh.sopStr(4, DR.dlh.minSOP(4, ms));
        wrong = [];
        // 干擾選項：把最簡式的某一項少一個變數、改一個補數或拿掉一項，且一定「不符合」題目
        bestT.forEach(function (t, ti) {
          for (var bt = 0; bt < 4; bt++) {
            var alt = [];
            if (!(t.mask & (1 << bt))) { alt.push({ v: t.v ^ (1 << bt), mask: t.mask }); alt.push({ v: t.v & ~(1 << bt), mask: t.mask | (1 << bt) }); }
            alt.forEach(function (t2) { var ts = bestT.map(function (x, j) { return j === ti ? t2 : x; }); if (!valid(ts)) wrong.push(DR.dlh.sopStr(4, ts)); });
          }
          if (bestT.length > 1) { var ts = bestT.filter(function (_, j) { return j !== ti; }); if (!valid(ts)) wrong.push(DR.dlh.sopStr(4, ts)); }
        });
        wrong = wrong.filter(function (x, j) { return x !== best && wrong.indexOf(x) === j; }).sort(function () { return Math.random() - 0.5; });
      } while (plain === best || best.length > 22 || wrong.length < 3);
      return ['（仿 115 統測）F(A, B, C, D) = Σm(' + ms.join(', ') + ')，隨意項 d = Σm(' + dc.join(', ') + ')（A 為 MSB），以卡諾圖化簡的最簡 SOP 為何？', [best].concat(wrong.slice(0, 3)),
        '把隨意項 X 當成 1 或 0，以能圈出最大、最少的群為準。\n最簡結果：F = ' + best + '（若完全不用隨意項則為 ' + plain + '，較繁）。', figKmapX(ms, dc)];
    } },
    { t: '最簡項數', g: function () {
      var ms = pick([[0, 1, 2, 3], [0, 2, 8, 10], [1, 3, 5, 7], [4, 5, 6, 7, 12, 13, 14, 15], [0, 1, 4, 5, 8, 9, 12, 13]]), s = DR.dlh.sopStr(4, DR.dlh.minSOP(4, ms)), nv = s.replace(/[^A-D]/g, '').length;
      return ['（仿 115 統測）F(A, B, C, D) = Σm(' + ms.join(', ') + ')，化成最簡 SOP 後共包含幾個變數（字母）？', O(String(nv), ['0', '1', '2', '3', '4']),
        '畫卡諾圖圈群：F = ' + s + '，共 ' + nv + ' 個變數。', figKmapX(ms, [])];
    } }
  ]);

  /* ================= 程式設計實習 ================= */
  addTc('prog', 0, [
    ['編譯與直譯', '（仿統測）有關編譯式與直譯式語言，下列敘述何者正確？', ['C 語言需先編譯成機器碼再執行，執行效率較高', 'C 語言是一行一行直譯執行', '直譯式語言一定比編譯式快', '編譯後的執行檔不能在沒有原始碼時執行'], 'C/C++ 為編譯式：原始碼 → 編譯 → 連結 → 執行檔；Python 等直譯式由直譯器逐行執行。'],
    ['程式開發流程', '（仿統測）C 程式開發的一般順序為何？', ['編輯原始碼 → 編譯 → 連結 → 執行 → 除錯', '編譯 → 編輯 → 執行 → 連結', '連結 → 編譯 → 編輯 → 執行', '執行 → 編輯 → 編譯 → 連結'], '先寫原始碼（.c），編譯成目的檔（.obj），連結函式庫成執行檔（.exe），執行後依結果除錯修改。']
  ]);
  addTc('prog', 1, [
    { t: '迴圈追蹤', g: function () {
      var lim = pick([4, 5, 6]), st = pick([1, 2]), up = pick([4, 5, 6]), sum = 0, i = 0;
      while (i < lim) { sum += i; for (var j = i; j <= up; j++) sum += j; i += st; }
      var code = 'int i, j, sum;\ni = 0; sum = 0;\nwhile (i < ' + lim + ') {\n  sum = sum + i;\n  for (j = i; j <= ' + up + '; j++)\n    sum = sum + j;\n  i = i + ' + st + ';\n}';
      return ['（仿 115 統測）下列 C 程式片段執行後，sum 的值為何？\n\n' + code, O(String(sum), [String(sum - lim + 1), String(sum + up), String(sum - (lim - 1) * 2)]),
        '逐圈追蹤：每圈先加 i，再把 j = i～' + up + ' 全部加上，i 每次加 ' + st + '，i ≥ ' + lim + ' 時停止，結果 sum = ' + sum + '。'];
    } },
    { t: '遞迴計數', g: function () {
      var nn = pick([3, 4, 5, 6]);
      var code = '#include <stdio.h>\nint count = 0;\nvoid foo(int n) {\n  if (n != 1) {\n    ++count;\n    foo(n - 1);\n  }\n}\nint main() {\n  foo(' + nn + ');\n  printf("%d", ++count);\n}';
      return ['（仿 115 統測）下列 C 程式的輸出為何？\n\n' + code, O(String(nn), [String(nn - 1), String(nn + 1), String(nn * 2)]),
        'foo(' + nn + ') 會一路呼叫到 foo(1)，n ≠ 1 的有 ' + (nn - 1) + ' 次，count = ' + (nn - 1) + '；最後 ++count 先加再印 → ' + nn + '。'];
    } },
    ['程式結構', '（仿統測）有關 C 程式的基本結構，下列敘述何者錯誤？', ['程式由第一個被定義的函式開始執行', '#include <stdio.h> 由前置處理器處理', '每個敘述以分號結尾', '/* */ 與 // 都是註解'], 'C 程式一律從 main() 開始執行，與函式定義的先後順序無關。']
  ]);
  addTc('prog', 2, [
    { t: '位元運算', g: function () {
      var b = pick([127, 15, 60, 85, 170]), c = pick([128, 240, 51, 204]), op = pick(['&', '|', '^']);
      var v = op === '&' ? b & c : op === '|' ? b | c : b ^ c, cond = pick([0, 1]);
      var y = cond ? ((b & c) === 0 ? (b ^ c) : (b | c)) : v;
      var code = cond ? 'unsigned char b = ' + b + ', c = ' + c + ', y;\ny = (b & c) == 0 ? b ^ c : b | c;\nprintf("y=%d", y);' : 'unsigned char b = ' + b + ', c = ' + c + ', y;\ny = b ' + op + ' c;\nprintf("y=%d", y);';
      return ['（仿 115 統測）下列 C 程式片段的輸出為何？\n\n' + code, O('y=' + y, ['y=' + (b & c), 'y=' + (b | c), 'y=' + (b ^ c), 'y=' + ((~y) & 255), 'y=0']),
        b + ' = ' + b.toString(2).padStart(8, '0') + '，' + c + ' = ' + c.toString(2).padStart(8, '0') + '。\nb & c = ' + (b & c) + '、b | c = ' + (b | c) + '、b ^ c = ' + (b ^ c) + (cond ? '；(b & c) ' + ((b & c) === 0 ? '== 0 成立 → 取 b ^ c' : '≠ 0 → 取 b | c') : '') + '，所以 y = ' + y + '。'];
    } },
    ['常數定義', '（仿 115 統測）程式第 2 行 #define PI 3.14，若在 main() 中寫 PI = 3.14159265; 會發生什麼事？', ['編譯錯誤，因為 PI 被前置處理器替換成常數 3.14，不能被指定', '執行時 PI 變成 3.14159265', '只有警告，PI 仍為 3.14', 'PI 變成 0'], '#define 是文字替換，PI = 3.14159265; 會變成 3.14 = 3.14159265;，左邊不是變數，編譯錯誤。要用不同值應另取名稱或改用變數。'],
    ['變數命名', '（仿統測）下列哪一個是合法的 C 語言變數名稱？', ['_total2', '2total', 'int', 'my-score'], '識別字由英文字母、數字、底線組成，不能以數字開頭，不能用保留字（int），不能有減號等符號；大小寫有別。'],
    { t: '指標', g: function () {
      var a = ri(1, 5), b = ri(1, 5), k1 = ri(1, 3), k2 = ri(1, 3);
      var i1 = a, i2 = b; i2 = i1 + k1; i1 = i2 + k2;
      var code = 'int i1 = ' + a + ', i2 = ' + b + ';\nint *p1 = &i2, *p2 = &i1;\n*p1 = i1 + ' + k1 + ';\n*p2 = i2 + ' + k2 + ';';
      return ['（仿 115 統測）下列 C 程式片段執行後，何者正確？\n\n' + code, O('i1 = ' + i1 + '、i2 = ' + i2, ['i1 = ' + i2 + '、i2 = ' + i1, 'i1 = ' + (a + k1) + '、i2 = ' + (b + k2), 'i1 = ' + a + '、i2 = ' + (a + k1)]),
        'p1 指向 i2、p2 指向 i1。*p1 = i1 + ' + k1 + ' → i2 = ' + (a + k1) + '；*p2 = i2 + ' + k2 + ' → i1 = ' + i1 + '。'];
    } }
  ]);
  addTc('prog', 3, [
    { t: 'unsigned char 溢位', g: function () {
      var a = pick([200, 250, 255, 240]), b = pick([10, 20, 56, 100]), r = (a + b) % 256;
      return ['（仿 115 統測）下列程式片段的輸出為何？\n\nunsigned char x = ' + a + ';\nx = x + ' + b + ';\nprintf("%d", x);', O(String(r), [String(a + b), String(255), String(r - 1 < 0 ? 1 : r - 1)]),
        'unsigned char 為 8 位元，範圍 0～255；' + a + ' + ' + b + ' = ' + (a + b) + '，超過後取 mod 256 → ' + r + '。'];
    } },
    { t: '整數除法與轉型', g: function () {
      var a = pick([7, 9, 11, 13]), b = pick([2, 4]), cast = pick([0, 1]);
      var v = cast ? (a / b).toFixed(2) : Math.floor(a / b).toFixed(2);
      return ['（仿統測）下列程式片段的輸出為何？\n\nint a = ' + a + ', b = ' + b + ';\nfloat r = ' + (cast ? '(float)a / b' : 'a / b') + ';\nprintf("%.2f", r);', O(v, [cast ? Math.floor(a / b).toFixed(2) : (a / b).toFixed(2), String(Math.floor(a / b)), (a % b).toFixed(2)]),
        cast ? '(float)a 先轉成浮點數，再除以 b 是浮點除法 = ' + (a / b) + '，印出 ' + v + '。' : 'a / b 兩個都是 int，做整數除法（捨去小數）= ' + Math.floor(a / b) + '，再存進 float 變成 ' + v + '。'];
    } },
    { t: '字元運算', g: function () {
      var s = pick(['Alex', 'Bob', 'Cindy', 'Dave']), i = ri(1, s.length - 1), k = pick([1, 2]), c = String.fromCharCode(s.charCodeAt(i) + k);
      return ['（仿 115 統測）char name[8] = "' + s + '"; 執行 name[' + i + '] = name[' + i + '] + ' + k + '; 之後，name[' + i + '] 的字元為何？', O("'" + c + "'", ["'" + s[i] + "'", "'" + String.fromCharCode(s.charCodeAt(i) - k) + "'", "'" + String.fromCharCode(s.charCodeAt(i - 1) + k) + "'"]),
        '陣列索引從 0 開始：name[' + i + '] = \'' + s[i] + '\'（ASCII ' + s.charCodeAt(i) + '），加 ' + k + ' 得 ' + (s.charCodeAt(i) + k) + ' → \'' + c + '\'。'];
    } },
    ['資料型態大小', '（仿統測）在一般 32/64 位元 C 編譯器中，下列資料型態佔用的記憶體大小，何者正確？', ['char 1 位元組、double 8 位元組', 'char 2 位元組、double 4 位元組', 'int 1 位元組、float 8 位元組', 'short 8 位元組'], '常見大小：char 1、short 2、int 4、float 4、double 8 位元組（可用 sizeof 查詢）。'],
    ['結構', '（仿 115 統測）要記錄 100 隻寵物的「中文名字、出生年、性別、體重」，下列宣告何者最適合？', ['struct pet { char name[20]; int year; char gender; float weight; }; struct pet p[100];', 'char name[100]; int year[100]; char gender[100]; float weight[100];', 'int pet[100][4];', 'char pet[100];'], '每筆資料型態不同，用 struct 包在一起再宣告 100 個元素的陣列；char name[100] 只能存一個名字字串。']
  ]);

  /* ================= 數學C ================= */
  addTc('math', 0, [
    { t: '二次函數圖形判斷', g: function () {
      var a = pick([1, -1]) * pick([0.5, 1]), hx = pick([-2, -1.5, 1.5, 2]), k = pick([-3, -2, 2, 3]);
      var b = -2 * a * hx, c = a * hx * hx + k, abc = a * b * c, dsc = b * b - 4 * a * c;
      if (Math.abs(c) < 0.3) c += 1;
      abc = a * b * c; dsc = b * b - 4 * a * c;
      var qd = abc > 0 ? (dsc > 0 ? '第一象限' : '第四象限') : (dsc > 0 ? '第二象限' : '第三象限');
      return ['（仿 115 統測）若二次函數 y = ax² + bx + c 的圖形如圖，則點 (abc, b² − 4ac) 在第幾象限？',
        O(qd, ['第一象限', '第二象限', '第三象限', '第四象限']),
        '開口' + (a > 0 ? '向上 → a > 0' : '向下 → a < 0') + '；頂點 x = −b/2a ' + (hx > 0 ? '> 0' : '< 0') + ' → b 與 a ' + (hx > 0 ? '異號' : '同號') + '，b ' + (b > 0 ? '> 0' : '< 0') + '；y 截距 c ' + (c > 0 ? '> 0' : '< 0') + '。\nabc ' + (abc > 0 ? '> 0' : '< 0') + '；圖形與 x 軸' + (dsc > 0 ? '交兩點 → b² − 4ac > 0' : '不相交 → b² − 4ac < 0') + '，所以在' + qd + '。', parab(a, b, c)];
    } },
    { t: '兩點距離與中點', g: function () {
      var x1 = ri(-5, 5), y1 = ri(-5, 5), t = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10]]), sx = pick([1, -1]), sy = pick([1, -1]);
      var x2 = x1 + sx * t[0], y2 = y1 + sy * t[1];
      return ['（仿統測）坐標平面上 A' + H.pt(x1, y1) + '、B' + H.pt(x2, y2) + '，若 P 為 AB 中點，則 P 到 A 的距離為何？',
        O(D(t[2] / 2, 1), [String(t[2]), D(t[2] / 4, 2), String(t[0] + t[1])]),
        'AB = √(' + t[0] + '² + ' + t[1] + '²) = ' + t[2] + '，P 為中點 → PA = ' + D(t[2] / 2, 1) + '。'];
    } },
    { t: '直線斜率與截距', g: function () {
      var m = pick([2, -2, 3, -3, 0.5, -0.5]), k = pick([-4, -3, 3, 4]);
      var q = m > 0 && k > 0 ? '第四象限' : m > 0 && k < 0 ? '第二象限' : m < 0 && k > 0 ? '第三象限' : '第一象限';
      return ['（仿統測）直線 y = ' + n(m) + 'x ' + (k > 0 ? '+ ' + k : '− ' + (-k)) + ' 不經過第幾象限？', O(q, ['第一象限', '第二象限', '第三象限', '第四象限']),
        '斜率 ' + n(m) + (m > 0 ? '（右上斜）' : '（右下斜）') + '，y 截距 ' + n(k) + '。畫出來即可看出不經過' + q + '。'];
    } }
  ]);
  addTc('math', 1, [
    { t: '三角形面積（正弦）', g: function () {
      var a = pick([4, 6, 8]), b = pick([5, 6, 10]), C = pick([30, 45, 60, 120, 150]);
      var sv = { 30: ['1/2', 0.5], 45: ['√2/2', Math.SQRT1_2], 60: ['√3/2', Math.sqrt(3) / 2], 120: ['√3/2', Math.sqrt(3) / 2], 150: ['1/2', 0.5] }[C];
      var Ar = a * b * sv[1] / 2, coef = a * b / 4;
      var ans = sv[0] === '1/2' ? H.frac(a * b, 4) : sv[0] === '√2/2' ? H.frac(a * b, 4) + '√2' : H.frac(a * b, 4) + '√3';
      ans = ans.replace(/^1(?=√)/, '');
      return ['（仿 115 統測）△ABC 中，a = ' + a + '、b = ' + b + '、∠C = ' + C + '°，則 △ABC 面積為何？',
        O(ans, [H.frac(a * b, 2) + (sv[0] === '1/2' ? '' : sv[0] === '√2/2' ? '√2' : '√3'), String(a * b), H.frac(a * b, 4) + (sv[0] === '1/2' ? '√3' : '')]),
        '面積 = ½ab·sinC = ½ × ' + a + ' × ' + b + ' × sin' + C + '° = ½ × ' + a * b + ' × ' + sv[0] + ' ≈ ' + D(Ar, 2) + '。'];
    } },
    { t: '餘弦定理', g: function () {
      var t = pick([[3, 5, 120, 7], [5, 8, 60, 7], [3, 8, 60, 7], [7, 8, 120, 13], [5, 3, 120, 7], [8, 15, 60, 13]]);
      return ['（仿統測）△ABC 中，b = ' + t[0] + '、c = ' + t[1] + '、∠A = ' + t[2] + '°，則 a = ？', O(String(t[3]), [String(t[3] + 1), String(t[3] - 1), H.sqrtS(t[0] * t[0] + t[1] * t[1])]),
        'a² = b² + c² − 2bc·cosA = ' + t[0] * t[0] + ' + ' + t[1] * t[1] + ' − 2×' + t[0] + '×' + t[1] + '×(' + (t[2] === 60 ? '1/2' : '−1/2') + ') = ' + t[3] * t[3] + ' → a = ' + t[3] + '。'];
    } },
    { t: '正弦定理', g: function () {
      var A = pick([30, 45, 60]), B = pick([45, 60, 90].filter(function (v) { return v !== A; })), a = pick([4, 6, 8]);
      var s = function (d) { return Math.sin(d * Math.PI / 180); }, b = a * s(B) / s(A), R = a / s(A) / 2;
      return ['（仿 115 統測）△ABC 中，∠A = ' + A + '°、∠B = ' + B + '°、a = ' + a + '，則外接圓半徑 R 約為何？', O(D(R, 2), [D(2 * R, 2), D(b, 2), D(R / 2, 2)]),
        '正弦定理：a/sinA = 2R → 2R = ' + a + ' ÷ sin' + A + '° = ' + D(2 * R, 3) + '，R ≈ ' + D(R, 2) + '。'];
    } },
    { t: '扇形弧長面積', g: function () {
      var r = pick([3, 4, 6, 10]), th = pick([[1, 6], [1, 3], [1, 2], [2, 3], [3, 4]]);
      var Ar = r * r * th[0] / th[1] / 2;
      return ['（仿統測）半徑 ' + r + '、圓心角 ' + H.piFrac(th[0], th[1]) + ' 的扇形，其面積為何？', O(H.piFrac(r * r * th[0], 2 * th[1]), [H.piFrac(r * th[0], th[1]), H.piFrac(r * r * th[0], th[1]), H.piFrac(r * th[0], 2 * th[1])]),
        '扇形面積 = ½r²θ = ½ × ' + r * r + ' × ' + H.piFrac(th[0], th[1]) + ' = ' + H.piFrac(r * r * th[0], 2 * th[1]) + '；弧長 = rθ = ' + H.piFrac(r * th[0], th[1]) + '。'];
    } }
  ]);
  addTc('math', 2, [
    { t: '點到直線距離（向量）', g: function () {
      var d = pick([[1, 2], [2, 1], [1, -2], [3, 4]]), t = pick([2, 3]), p = [ri(-3, 5), ri(-2, 6)];
      var cr = Math.abs(p[0] * d[1] - p[1] * d[0]), len = Math.sqrt(d[0] * d[0] + d[1] * d[1]);
      if (cr === 0) p[0] += 1, cr = Math.abs(p[0] * d[1] - p[1] * d[0]);
      var ans = len % 1 === 0 ? H.frac(cr, len) : H.frac(cr, d[0] * d[0] + d[1] * d[1]) + '√' + (d[0] * d[0] + d[1] * d[1]);
      ans = ans.replace(/^1(?=√)/, '');
      return ['（仿 115 統測）列車由原點 O 沿方向向量 v = (' + d.join(', ') + ') 的直線軌道前進，某砲彈在第 ' + t + ' 秒時位於 P' + H.pt(p[0], p[1]) + '，則此時砲彈離軌道的距離為何？',
        O(ans, [String(cr), H.frac(Math.abs(p[0] * d[0] + p[1] * d[1]), 1) , String(Math.round(Math.sqrt(p[0] * p[0] + p[1] * p[1]) * 100) / 100)]),
        '距離 = |OP × v| / |v| = |' + p[0] + '×' + n(d[1]) + ' − ' + n(p[1]) + '×' + n(d[0]) + '| / √' + (d[0] * d[0] + d[1] * d[1]) + ' = ' + cr + '/√' + (d[0] * d[0] + d[1] * d[1]) + ' = ' + ans + '。'];
    } },
    { t: '平行四邊形面積', g: function () {
      var a = [ri(1, 5), ri(-3, 3)], b = [ri(-3, 3), ri(1, 5)], A = Math.abs(a[0] * b[1] - a[1] * b[0]);
      if (A === 0) { b[0] += 1; A = Math.abs(a[0] * b[1] - a[1] * b[0]); }
      return ['（仿 115 統測）由向量 a = (' + a.join(', ') + ')、b = (' + b.join(', ') + ') 為鄰邊所圍成的平行四邊形，面積為何？', O(String(A), [D(A / 2, 1), String(Math.abs(a[0] * b[0] + a[1] * b[1])), String(A + 2)]),
        '面積 = |a₁b₂ − a₂b₁| = |' + a[0] + '×' + n(b[1]) + ' − ' + n(a[1]) + '×' + n(b[0]) + '| = ' + A + '（三角形面積才要再除以 2）。'];
    } },
    { t: '向量垂直求未知數', g: function () {
      var a = [pick([1, 2, 3]), pick([-2, -1, 2, 4])], bx = pick([2, 4, 6]);
      var by = -(a[0] * bx) / a[1];
      if (by % 1 !== 0) { a = [2, -1]; by = 2 * bx; }
      return ['（仿統測）若向量 a = (' + a.join(', ') + ') 與 b = (' + bx + ', t) 互相垂直，則 t = ？', O(n(by), [n(-by), n(by * 2), n(bx)]),
        'a ⊥ b → a·b = 0：' + a[0] + '×' + bx + ' + ' + n(a[1]) + '·t = 0 → t = ' + n(by) + '。'];
    } },
    { t: '正射影長', g: function () {
      var a = [ri(1, 6), ri(-3, 5)], b = pick([[3, 4], [4, 3], [5, 12], [6, 8]]), L = Math.sqrt(b[0] * b[0] + b[1] * b[1]), dot = a[0] * b[0] + a[1] * b[1];
      return ['（仿統測）向量 a = (' + a.join(', ') + ') 在 b = (' + b.join(', ') + ') 上的正射影長為何？', O(D(Math.abs(dot) / L, 2), [String(Math.abs(dot)), D(Math.abs(dot) / (L * L), 3), D(Math.abs(dot) / L + 1, 2)]),
        '正射影長 = |a·b| / |b| = |' + dot + '| / ' + L + ' = ' + D(Math.abs(dot) / L, 2) + '。'];
    } }
  ]);

  /* ================= 國文 ================= */
  addTc('chi', 0, [
    ['字詞解釋', '（仿統測）下列「」內的詞語，何者古今意義「相同」？', ['〈桃花源記〉「芳草」鮮美，落英繽紛', '〈桃花源記〉阡陌「交通」，雞犬相聞', '〈桃花源記〉來此絕境，不復出焉，遂與外人間隔……乃不知有漢，「無論」魏晉', '〈桃花源記〉率「妻子」邑人來此絕境'], '芳草：古今都指香草、青草。交通：古＝交錯相通；無論：古＝更不必說；妻子：古＝妻子和子女。'],
    ['課文內容', '（仿統測）〈師說〉中韓愈寫作此文的直接緣由是：', ['讚許李蟠能行古道，不拘於時，作此文贈他', '回覆朝廷詢問選拔師儒的辦法', '自述從師求學的經過', '批評弟子不尊重老師'], '文末：「李氏子蟠，年十七，好古文……不拘於時，學於余。余嘉其能行古道，作〈師說〉以貽之。」'],
    ['成語出處', '（仿統測）下列成語何者「不是」出自國文 I 的選文？', ['先憂後樂', '青梅竹馬', '撲朔迷離', '世外桃源'], '先憂後樂出自范仲淹〈岳陽樓記〉（國文 II）；青梅竹馬出自李白〈長干行〉、撲朔迷離出自〈木蘭詩〉、世外桃源出自〈桃花源記〉。'],
    ['修辭', '（仿統測）〈上邪〉「山無陵，江水為竭，冬雷震震，夏雨雪，天地合，乃敢與君絕」主要運用何種手法表達情意？', ['連舉不可能發生的自然現象，表示愛情至死不渝', '以誇飾描寫戰爭的慘烈', '以對比寫出貧富懸殊', '以問答寫出離別的無奈'], '五種不可能的現象同時發生才「敢與君絕」，等於永遠不會分開，以反面設誓表達堅貞。'],
    ['抒情手法', '（仿統測）白居易〈賣炭翁〉「可憐身上衣正單，心憂炭賤願天寒」，表現了賣炭翁什麼樣的心理？', ['為了生計寧願忍受寒冷的矛盾心理', '對宮使強取豪奪的憤怒', '對自己年老體衰的感嘆', '對家人溫飽的滿足'], '身上衣單本應盼天暖，卻因擔心炭賣不到好價錢而希望天更冷，寫出底層百姓生活的困苦；全詩主旨「苦宮市也」。']
  ]);
  addTc('chi', 1, [
    ['課文內容', '（仿統測）魯迅〈孔乙己〉中，最能表現孔乙己「死要面子、自命讀書人」性格的是：', ['「竊書不能算偷……讀書人的事，能算偷麼？」', '「我前天親眼見你偷了何家的書，吊著打。」', '「溫一碗酒。」', '「大約孔乙己的確死了。」'], '孔乙己偷書被抓仍強辯「竊書不能算偷」，滿口之乎者也，正是迂腐又愛面子的形象。'],
    ['小說與文體', '（仿統測）〈孔乙己〉以咸亨酒店小伙計的視角敘事，這種寫法的效果是：', ['以旁觀者冷漠的眼光，更凸顯社會對孔乙己的麻木與涼薄', '讓讀者直接看見孔乙己的內心獨白', '以全知觀點交代每個角色的身世', '使故事帶有濃厚的浪漫色彩'], '第一人稱旁觀者（小伙計）只看到表面，連他也看不起孔乙己，更反襯出眾人的冷漠。'],
    ['字詞解釋', '（仿統測）〈孔乙己〉結尾「我到現在終於沒有見——大約孔乙己的確死了」，「大約」與「的確」並用的用意為何？', ['「大約」表示沒人確知，「的確」表示依情理推斷必死，透露孔乙己死得無聲無息、無人關心', '作者用詞前後矛盾，是筆誤', '表示孔乙己其實還活著', '強調小伙計非常關心孔乙己的下落'], '沒有人真正知道他的下落（大約），但依他當時的處境推想一定死了（的確），寫出社會的冷漠。']
  ]);
  addTc('chi', 2, [
    ['課文內容', '（仿統測）柳宗元〈種樹郭橐駝傳〉中，郭橐駝種樹的要領可以用哪一句概括？', ['順木之天，以致其性', '旦視而暮撫，已去而復顧', '爪其膚以驗其生枯', '早繰而緒，早織而縷'], '「能順木之天，以致其性焉爾」是種樹的根本；「旦視而暮撫」是其他種樹者過度關愛的錯誤；「早繰而緒」則是官吏擾民的號令。'],
    ['課文內容', '（仿統測）〈種樹郭橐駝傳〉藉種樹之道所要諷諭的是：', ['為官治民不可政令煩苛、擾民害民', '讀書求學要循序漸進', '人要懂得知足常樂', '交友要選擇賢能的人'], '文末「問者曰：以子之道，移之官理，可乎？」點出主旨：官吏「好煩其令」，名為愛民，實則害民。'],
    ['名句', '（仿統測）下列哪一句最能代表范仲淹〈岳陽樓記〉所揭示的「古仁人之心」？', ['不以物喜，不以己悲', '登斯樓也，則有去國懷鄉，憂讒畏譏', '浮光躍金，靜影沉璧', '銜遠山，吞長江'], '古仁人不因外物好壞或個人得失而悲喜，進而「先天下之憂而憂，後天下之樂而樂」。']
  ]);
  addTc('chi', 3, [
    ['新詩', '（仿統測）徐志摩〈再別康橋〉首段「輕輕的我走了，／正如我輕輕的來」與末段「悄悄的我走了，／正如我悄悄的來」，這種寫法稱為：', ['首尾呼應，形成迴環的音樂美', '以物擬人', '設問', '映襯'], '首尾句式相近、字詞稍作變化，前後呼應，營造輕柔的旋律與依依不捨的情緒。'],
    ['新詩', '（仿統測）紀弦〈狼之獨步〉「我乃曠野裡獨來獨往的一匹狼」，詩中的「狼」象徵：', ['不隨流俗、孤傲獨立的詩人', '殘暴貪婪的掠奪者', '被社會遺棄的弱者', '思念家鄉的遊子'], '以狼自喻，表現詩人特立獨行、不願與世俗妥協的孤高姿態。'],
    ['課文內容', '（仿統測）琦君〈髻〉以「髮髻」為線索，主要寫出了：', ['母親與姨娘的一生際遇，以及作者對人生無常的感悟', '作者學習梳頭的經過', '古代婦女髮型的演變', '理髮業的興衰'], '藉母親與姨娘髮髻的變化，寫兩人爭寵、衰老到相依為命，抒發「人生無常、愛恨皆空」的感慨。']
  ]);
  addTc('chi', 4, [
    ['課文內容', '（仿統測）劉鶚〈明湖居聽書〉以「彷彿由傲來峰西面攀登泰山的景象」形容王小玉的歌聲，這是用什麼手法？', ['以具體的山景比喻抽象的聲音高低轉折', '以聲音描寫聲音', '以誇飾寫聽眾人數之多', '以對比寫小玉與黑妞的不同'], '把越唱越高、一層比一層高的聲音，比作登泰山「愈翻愈險、愈險愈奇」，化聽覺為視覺。'],
    ['修辭', '（仿統測）「五臟六腑裡，像熨斗熨過，無一處不伏貼；三萬六千個毛孔，像吃了人參果，無一個毛孔不暢快」，主要描寫：', ['聽者聽到歌聲時的舒暢感受', '王小玉的外貌', '明湖居的擺設', '說書前的嘈雜'], '以觸覺、味覺的比喻寫聽覺感受（摹寫兼通感），從聽者反應側寫歌聲之美。']
  ]);

  /* ================= 英文 ================= */
  addTc('eng', 0, [
    ['單字題', '（仿統測）The museum is free of ______ on Sundays, so many families visit it on weekends.', ['charge', 'change', 'chance', 'charm'], 'free of charge 免費。change 改變／零錢；chance 機會；charm 魅力。'],
    ['單字題', '（仿統測）Please ______ the form carefully before you hand it in; any mistake may delay your application.', ['check', 'cheat', 'chase', 'cheer'], 'check 檢查。cheat 作弊；chase 追逐；cheer 歡呼。'],
    ['單字題', '（仿統測）The typhoon caused serious ______ to the farms in southern Taiwan.', ['damage', 'danger', 'dessert', 'diet'], 'cause damage to... 對……造成損害。'],
    ['單字題', '（仿統測）Taking a short walk after meals is a good ______ for staying healthy.', ['habit', 'hobby', 'harbor', 'hostel'], 'habit 習慣。hobby 嗜好；harbor 港口；hostel 青年旅館。']
  ]);
  addTc('eng', 1, [
    ['單字題', '（仿統測）The new bridge was designed to ______ strong earthquakes, so engineers used special steel.', ['withstand', 'withdraw', 'withhold', 'wither'], 'withstand 承受、抵擋。withdraw 撤回；withhold 扣留；wither 枯萎。'],
    ['單字題', '（仿統測）Workers must wear helmets on construction sites; it is a ______ rule for everyone\'s safety.', ['strict', 'stray', 'sticky', 'stale'], 'strict rule 嚴格的規定。'],
    ['單字題', '（仿統測）Green buildings use less energy and help ______ carbon emissions.', ['reduce', 'refuse', 'reveal', 'recite'], 'reduce emissions 減少排放。refuse 拒絕；reveal 揭露；recite 背誦。'],
    ['單字題', '（仿統測）The architect showed us a ______ of the new library before construction began.', ['model', 'medal', 'motto', 'menu'], 'model 模型。medal 獎牌；motto 座右銘；menu 菜單。']
  ]);
  addTc('eng', 2, [
    ['易混字', '（仿統測）The heavy rain had a great ______ on the progress of the project.', ['effect', 'affect', 'effort', 'afford'], 'have an effect on... 對……有影響（名詞）；affect 是動詞。'],
    ['詞性變化', '（仿統測）The engineer explained the problem ______, so everyone understood it at once.', ['clearly', 'clear', 'clearness', 'clearing'], '修飾動詞 explained 要用副詞 clearly。'],
    ['易混字', '（仿統測）Could you ______ me your ruler? I left mine at home.', ['lend', 'borrow', 'rent', 'loan to'], 'lend + 人 + 物 借（出）給某人；borrow 是向別人借入（borrow sth. from sb.）。']
  ]);
  addTc('eng', 3, [
    ['時態', '（仿統測）By the time the workers arrived, the concrete ______ already.', ['had set', 'has set', 'sets', 'is setting'], 'By the time + 過去式，主要子句用過去完成式（過去的過去）。'],
    ['不定詞與動名詞', '（仿統測）The manager suggested ______ the meeting until next Monday.', ['postponing', 'to postpone', 'postpone', 'postponed'], 'suggest 後面接動名詞（V-ing）。'],
    ['主動詞一致', '（仿統測）Each of the students ______ to hand in a drawing by Friday.', ['has', 'have', 'are', 'were'], 'Each of + 複數名詞，主詞是 each（單數），動詞用單數 has。'],
    ['介系詞與連接詞', '（仿統測）______ it was raining hard, the surveyors kept working outside.', ['Although', 'Because', 'Despite', 'Unless'], '前後語意相反用 Although（雖然）；Despite 是介系詞，後面要接名詞，不能接子句。'],
    ['-ing / -ed 形容詞', '（仿統測）We were ______ by the beautiful view from the top of the tower.', ['amazed', 'amazing', 'amaze', 'amazement'], '人「感到」驚訝用 p.p.（amazed）；使人驚訝的事物用 -ing（amazing）。']
  ]);
})();
