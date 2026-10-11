/* 電子學 困難版：仿統測／歷屆一模（多步驟計算、何者正確／錯誤；附電路圖、波形） */
(function () {
  var H = QH, si = H.si, d = H.dec, D = DR, el = D.el, w = D.wire, T = D.text, L = D.line, E = DR.elec, PI = Math.PI;
  function dash(x1, y1, x2, y2) { return L(x1, y1, x2, y2, ' stroke-dasharray="4 3" stroke-width="1"'); }
  // 有正負的電流波形（每段 1 s）
  function figWave(vals, unit) {
    var x0 = 40, u = 40, top = Math.max.apply(null, vals.concat([0])), bot = Math.min.apply(null, vals.concat([0])), k = 90 / Math.max(top - bot, 1);
    var y0 = 20 + top * k, pts = [[x0, y0]], s = '';
    vals.forEach(function (v, i) { pts.push([x0 + i * u, y0 - v * k], [x0 + (i + 1) * u, y0 - v * k]); });
    pts.push([x0 + vals.length * u, y0]);
    s += D.arrow(x0, y0, x0 + vals.length * u + 30, y0) + D.arrow(x0, 125, x0, 8) + T(x0 - 6, 14, unit, 'end') + T(x0 + vals.length * u + 34, y0 + 4, 't (s)', 'start');
    s += '<g stroke-width="2.2">' + w.apply(null, pts) + '</g>';
    vals.forEach(function (v, i) { s += T(x0 + (i + 1) * u, y0 + 15, String(i + 1), 'middle', 11); });
    var seen = {}; vals.forEach(function (v) { if (v && !seen[v]) { seen[v] = 1; s += dash(x0, y0 - v * k, x0 + 6, y0 - v * k) + T(x0 - 6, y0 - v * k + 4, H.n(v), 'end', 11); } });
    return D.svg(vals.length * u + 90, 135, s);
  }
  // 兩個電源經二極體到同一電阻（含順向電阻）
  function figTwoD(V1, V2, Rl) { return E.figTwoDiode(V1, V2, Rl); }
  // 電晶體輸出特性曲線 + 固定偏壓電路
  function figCurve(Vcc, RB, RC, ibs) {
    var q = D.npn(110, 100), s = q.s + w([30, 20], [190, 20]) + T(30, 12, Vcc, 'start') + el('R', [60, 20], [60, 100], { l: RB, side: 'l' }) + w([60, 100], q.B) + D.dot(60, 20) +
      el('R', [142, 20], q.C, { l: RC }) + D.dot(142, 20) + D.gnd(q.E[0], q.E[1]) + T(165, 72, 'VC', 'start') + D.dot(q.C[0], q.C[1] - 4);
    var x0 = 230, y0 = 150, gx = 170, gy = 120;
    s += D.arrow(x0, y0, x0 + gx + 10, y0) + D.arrow(x0, y0, x0, y0 - gy - 10) + T(x0 + gx + 12, y0 + 4, 'VCE', 'start', 11) + T(x0 - 4, y0 - gy - 12, 'IC(mA)', 'start', 11);
    ibs.forEach(function (ib, i) {
      var yy = y0 - (i + 1) * 35;
      s += '<path d="M' + x0 + ' ' + y0 + 'Q' + (x0 + 10) + ' ' + yy + ' ' + (x0 + 30) + ' ' + yy + 'L' + (x0 + gx) + ' ' + (yy - 4) + '"/>' + T(x0 + gx + 4, yy - 2, 'IB = ' + ib[0] + ' μA', 'start', 11) +
        dash(x0, yy, x0 + 30, yy) + T(x0 - 4, yy + 4, String(ib[1]), 'end', 11);
    });
    return D.svg(470, 175, s);
  }
  // VBB 經 RB 推動、射極電阻的電路
  function figVbb(Vcc, RC, RE) {
    var q = D.npn(110, 90), s = q.s + w([142, 15], [142, 20]) + T(152, 16, Vcc, 'start') + D.term(142, 12) + el('R', [142, 15], q.C, { l: RC }) + el('R', q.E, [142, 175], { l: RE }) + D.gnd(142, 175) +
      w(q.B, [40, 90]) + D.term(37, 90) + T(30, 95, 'VBB', 'end');
    return D.svg(240, 200, s);
  }

  addHard('elec', 0, [
    { t: '波形時間差', g: function (R) {
      var w0 = R.pick([314, 377, 628, 100 * PI]), f = w0 / (2 * PI), a = R.pick([0, 15, 30]), sinFirst = Math.random() < 0.5;
      var dt = 90 / 360 / f * 1000;
      return [(sinFirst ? 'v(t) = 20 sin(' + d(w0, 0) + 't + ' + a + '°) V、i(t) = 10 cos(' + d(w0, 0) + 't + ' + a + '°) A' : 'i(t) = 10 cos(' + d(w0, 0) + 't + ' + a + '°) A、v(t) = 20 sin(' + d(w0, 0) + 't + ' + a + '°) V') + '，兩波形的時間差約為多少？',
        [d(dt, 2) + ' ms', d(dt * 2, 2) + ' ms', d(dt * 4, 2) + ' ms', d(dt / 2, 2) + ' ms'],
        'cos(θ) = sin(θ + 90°)，所以 i 超前 v 90°。f = ω ÷ 2π = ' + d(f, 1) + ' Hz、T = ' + d(1000 / f, 2) + ' ms；時間差 = 90°/360° × T = ' + d(dt, 2) + ' ms。'];
    } },
    { t: '正弦波綜合判斷', g: function (R) {
      var Vm = R.pick([10, 20, 100]), w0 = R.pick([100, 200, 314, 628]), f = w0 / (2 * PI);
      var good = R.pick(['F.F. 約 1.11', 'Vrms ≈ ' + d(Vm * 0.707, 2) + ' V', 'Vav（半週）≈ ' + d(Vm * 0.636, 2) + ' V', 'f ≈ ' + d(f, 2) + ' Hz']);
      var bad = ['F.F. 約 1.414', 'Vrms ≈ ' + d(Vm * 0.636, 2) + ' V', 'Vav（半週）≈ ' + d(Vm, 2) + ' V', 'f = ' + w0 + ' Hz', 'C.F. 約 1.11'];
      return ['正弦波 v(t) = ' + Vm + ' sin ' + w0 + 't V，下列敘述何者正確？', [good].concat(bad.sort(function () { return Math.random() - 0.5; }).slice(0, 3)),
        'F.F. = 1.11、C.F. = 1.414；Vrms = 0.707Vm = ' + d(Vm * 0.707, 2) + ' V；Vav = 0.636Vm = ' + d(Vm * 0.636, 2) + ' V；f = ω ÷ 2π = ' + d(f, 2) + ' Hz（不是 ' + w0 + ' Hz）。'];
    } },
    { t: '電流波形平均功率', g: function (R) {
      var a = R.pick([2, 3]), b = R.pick([1, 2]), c = R.pick([-1, -2]), r1 = R.pick([4, 6, 12]), r2 = R.pick([4, 12, 6]);
      var vals = [a, c, b, a, c, b], Rp = r1 * r2 / (r1 + r2), I2 = (a * a + c * c + b * b) / 3, P = I2 * Rp;
      return ['如圖所示的電流源 i(t)（週期 3 s，重複）推動 ' + r1 + ' Ω 與 ' + r2 + ' Ω 的並聯電阻，' + r2 + ' Ω 電阻的平均功率為多少？',
        [d(I2 * Math.pow(r1 / (r1 + r2), 2) * r2, 3) + ' W', d(Math.pow((a + b + c) / 3, 2) * Rp, 3) + ' W', d(P, 3) + ' W', d(I2 * r2, 3) + ' W'],
        'Irms² = (' + a + '² + (' + H.n(c) + ')² + ' + b + '²) ÷ 3 = ' + d(I2, 3) + '；流到 ' + r2 + ' Ω 的比例 = ' + r1 + '/' + (r1 + r2) + '；P = Irms² × (' + r1 + '/' + (r1 + r2) + ')² × ' + r2 + ' = ' + d(I2 * Math.pow(r1 / (r1 + r2), 2) * r2, 3) + ' W。負電流平方後也是正的，不能用平均電流算。',
        figWave(vals, 'i(A)')];
    } },
    { t: '工作週期情境', g: function (R) {
      var mins = R.pick([10, 20, 30, 60]), n = R.pick([2, 4, 5]), on = R.pick([1, 2]);
      if (n * on * 2 > mins) { n = 2; on = 1; }
      var Dp = n * on / mins * 100;
      return ['以訊號產生器的矩形波控制電晶體當開關，要在 ' + mins + ' 分鐘內開、關各 ' + n + ' 次，且每次開 ' + on + ' 分鐘，工作週期應設多少？電晶體工作在哪兩區？',
        ['D% = ' + d(Dp, 2) + '%，飽和區及截止區', 'D% = ' + d(Dp, 2) + '%，主動區及截止區', 'D% = ' + d(Dp * 2, 2) + '%，飽和區及截止區', 'D% = ' + d(100 - Dp, 2) + '%，主動區及飽和區'],
        '週期 T = ' + mins + ' ÷ ' + n + ' = ' + d(mins / n, 2) + ' 分，tH = ' + on + ' 分 → D% = ' + d(Dp, 2) + '%。電晶體當開關：導通 = 飽和、斷開 = 截止。'];
    } },
    ['積體電路', '下列有關積體電路與波形的敘述，何者錯誤？', ['方波的有效值為峰值的 0.707 倍', '1100 個邏輯閘的 IC 屬於 VLSI', 'IC 不易做進電感元件', '脈波的上升時間是由 10% 上升到 90% 的時間'], '方波 Vrms = Vm（F.F. = C.F. = 1）；0.707Vm 是正弦波。']
  ]);

  addHard('elec', 1, [
    { t: '二極體含順向電阻', g: function (R) {
      var V = R.pick([10.7, 5.7, 12.7]), rd = R.pick([10, 20]), RL = R.pick([20, 40, 50]);
      // 兩顆相同電壓的二極體並聯 → 等效 rd/2
      var I = (V - 0.7) / (rd / 2 + RL);
      return ['兩個 ' + V + ' V 電源分別經二極體 D₁、D₂（障壁電壓 0.7 V、順向電阻 ' + rd + ' Ω）接到同一節點，再經 ' + RL + ' Ω 接地，流過 ' + RL + ' Ω 的電流為多少？',
        [si(I, 'A'), si((V - 0.7) / (rd + RL), 'A'), si((V - 0.7) / RL, 'A'), si(2 * (V - 0.7) / (rd + RL), 'A')],
        '兩個電源電壓相同，兩顆二極體都導通、並聯 → 等效順向電阻 ' + rd + '/2 = ' + rd / 2 + ' Ω。I = (' + V + ' − 0.7) ÷ (' + rd / 2 + ' + ' + RL + ') = ' + si(I, 'A') + '。',
        E.figTwoDiode(V + ' V', V + ' V', RL + ' Ω')];
    } },
    { t: '橋式整流綜合判斷', g: function (R) {
      var Vm = R.pick([10, 12, 20, 15]);
      var good = R.pick(['Vo 的平均值約 ' + d(2 * Vm / PI, 2) + ' V', '二極體 PIV 約為 ' + Vm + ' V', 'Vo 的有效值約 ' + d(Vm * 0.707, 2) + ' V', '漣波頻率為輸入頻率的 2 倍']);
      var bad = ['Vo 的平均值約 ' + d(Vm / PI, 2) + ' V', 'Vo 的峰值為 ' + d(Vm / 2, 1) + ' V', '二極體 PIV 為 ' + 2 * Vm + ' V', 'Vo 的有效值約 ' + d(2 * Vm / PI, 2) + ' V'];
      return ['如圖所示的橋式整流電路，vi(t) = ' + Vm + ' sin ωt V，二極體理想，下列何者正確？', [good].concat(bad.sort(function () { return Math.random() - 0.5; }).slice(0, 3)),
        '橋式全波：Vdc = 2Vm/π = ' + d(2 * Vm / PI, 2) + ' V；峰值 = Vm = ' + Vm + ' V；有效值 = 0.707Vm（全波的有效值和原正弦波相同）；PIV = Vm；漣波頻率 2f。',
        E.figRect('bridge', 'vi')];
    } },
    { t: '橋式燒毀一顆', g: function (R) {
      var Vin = R.pick([110, 120]), Vdc = R.pick([16, 20, 24]), Vg = 0.7;
      var Vm = (Vdc * PI / 2) + 2 * Vg, half = (Vm - Vg) / PI;
      return ['橋式整流電路（二極體切入電壓 0.7 V），正常時 RL 上的 Vo(dc) = ' + Vdc + ' V。若其中一顆二極體燒毀開路，輸出平均值約為多少？',
        [d(half, 2) + ' V', d(Vdc / 2, 2) + ' V', d(Vdc, 2) + ' V', '0 V'],
        '正常橋式：Vdc = 2(Vm − 2×0.7)/π → Vm = ' + d(Vm, 2) + ' V。燒一顆變半波，導通路徑只剩 1 顆二極體：Vdc = (Vm − 0.7)/π ≈ ' + d(half, 2) + ' V（略大於一半）。',
        E.figRect('bridge', Vin + ' V')];
    } },
    { t: '鋸齒漣波百分比', g: function (R) {
      var lo = R.pick([4, 8, 10, 12]), pp = R.pick([1, 2, 4]), hi = lo + pp, Vdc = (hi + lo) / 2, rms = pp / (2 * Math.sqrt(3));
      return ['某濾波器輸出近似如圖的鋸齒波，最高 ' + hi + ' V、最低 ' + lo + ' V，其漣波百分比約為多少？',
        [d(rms / Vdc * 100, 2) + '%', d(pp / Vdc * 100, 2) + '%', d(rms / hi * 100, 2) + '%', d(pp / Math.SQRT2 / Vdc * 100, 2) + '%'],
        'Vdc = (' + hi + ' + ' + lo + ') ÷ 2 = ' + d(Vdc, 2) + ' V；Vr(p-p) = ' + pp + ' V；Vr(rms) = ' + pp + ' ÷ 2√3 = ' + d(rms, 3) + ' V；r% = ' + d(rms, 3) + ' ÷ ' + d(Vdc, 2) + ' × 100% = ' + d(rms / Vdc * 100, 2) + '%。',
        E.figSaw(hi + ' V', lo + ' V')];
    } },
    { t: '稽納穩壓設計', g: function (R) {
      var Vz = R.pick([5, 6, 9]), Vmin = Vz + R.pick([4, 5]), Vmax = Vmin + 2, ILmax = R.pick([200, 300, 500]);
      var Rmax = (Vmin - Vz) / (ILmax / 1000), Izmax = (Vmax - Vz) / Rmax, Pz = Vz * Izmax;
      return ['稽納穩壓電路如圖，輸入電壓在 ' + Vmin + '～' + Vmax + ' V 之間變動，希望輸出維持 ' + Vz + ' V，負載電流可在 0～' + ILmax + ' mA 間調整（稽納視為理想），稽納二極體至少要能承受多大功率？限流電阻 R 最大可為多少？',
        [d(Pz, 2) + ' W、' + d(Rmax, 2) + ' Ω', d(Vz * ILmax / 1000, 2) + ' W、' + d(Rmax, 2) + ' Ω', d(Pz, 2) + ' W、' + d((Vmax - Vz) / (ILmax / 1000), 2) + ' Ω', d(Vz * ILmax / 1000, 2) + ' W、' + d((Vmax - Vz) / (ILmax / 1000), 2) + ' Ω'],
        '最差情況一：輸入最低 ' + Vmin + ' V、負載最大 ' + ILmax + ' mA 時仍要穩壓 → R ≤ (' + Vmin + ' − ' + Vz + ') ÷ ' + ILmax / 1000 + ' = ' + d(Rmax, 2) + ' Ω。最差情況二：輸入最高 ' + Vmax + ' V、負載 0 → IZ = (' + Vmax + ' − ' + Vz + ') ÷ ' + d(Rmax, 2) + ' = ' + d(Izmax, 3) + ' A，PZ = ' + Vz + ' × ' + d(Izmax, 3) + ' = ' + d(Pz, 2) + ' W。',
        E.figZener('Vs', 'R', 'VZ = ' + Vz + ' V', 'IL')];
    } },
    { t: '濾波電容與匝數比', g: function (R) {
      var Vo = R.pick([20, 30]), Io = R.pick([0.1, 0.2, 0.5]), Vr = R.pick([0.4, 0.5, 1]), Vp = R.pick([110, 120]);
      var C = Io / (120 * Vr), Vsec = Vo, n = Vp * Math.SQRT2 / Vsec;
      return ['中間抽頭全波濾波電路，一次側 ' + Vp + ' V（有效值）、60 Hz，二極體理想，負載 Vo(dc) ≈ ' + Vo + ' V、Io(dc) = ' + Io + ' A，要求 Vr(p-p) = ' + Vr + ' V。所需電容 C 約為多少？每半邊二次側峰值約為多少？',
        [d(C * 1000, 2) + ' mF、' + Vo + ' V', d(Io / (60 * Vr) * 1000, 2) + ' mF、' + Vo + ' V', d(C * 1000, 2) + ' mF、' + 2 * Vo + ' V', d(Io / (60 * Vr) * 1000, 2) + ' mF、' + 2 * Vo + ' V'],
        '全波 fr = 120 Hz：C = Idc ÷ (fr × Vr) = ' + Io + ' ÷ (120 × ' + Vr + ') = ' + d(C * 1000, 2) + ' mF。電容濾波輸出約等於峰值，每半邊峰值 ≈ ' + Vo + ' V，一次側峰值 ' + d(Vp * Math.SQRT2, 1) + ' V → 匝數比（一次：半邊）≈ ' + d(n, 2) + '。',
        E.figRect('ct', Vp + ' V')];
    } },
    ['半導體', '有關半導體的敘述，下列何者錯誤？', ['本質半導體的共價鍵由 6 個電子形成', 'P 型半導體整體呈電中性', 'N 型半導體可添加磷元素形成', '本質半導體是負溫度電阻係數'], '共價鍵由 8 個電子（每個鍵 2 個）組成。']
  ]);

  addHard('elec', 2, [
    { t: '分壓偏壓（精確）', g: function (R) {
      var Vcc = R.pick([12, 15, 18]), r1 = R.pick([6, 10, 20]), r2 = R.pick([3, 5, 10]), RC = R.pick([1, 2]), RE = R.pick([0.5, 1]), beta = R.pick([99, 49]);
      var Vth = Vcc * r2 / (r1 + r2), Rth = r1 * r2 / (r1 + r2), IB = (Vth - 0.7) / (Rth + (beta + 1) * RE), IC = beta * IB, IE = (beta + 1) * IB, VCE = Vcc - IC * RC - IE * RE;
      if (VCE < 0.3) { RC = 1; RE = 0.5; IB = (Vth - 0.7) / (Rth + (beta + 1) * RE); IC = beta * IB; IE = IC + IB; VCE = Vcc - IC * RC - IE * RE; }
      var sat = VCE < 0.2;
      var ans = sat ? '0.2 V' : d(VCE, 2) + ' V';
      return ['如圖所示（β = ' + beta + '、VBE = 0.7 V、VCE(sat) = 0.2 V），以戴維寧等效精確計算，VCE 約為多少？',
        [ans, d(Vcc - (Vth - 0.7) / RE * (RC + RE), 2) + ' V', d(Vcc - IC * RC, 2) + ' V', d(Vcc - Vth, 2) + ' V'],
        'VTH = ' + Vcc + ' × ' + r2 + '/' + (r1 + r2) + ' = ' + d(Vth, 3) + ' V、RTH = ' + d(Rth, 3) + ' kΩ；IB = (VTH − 0.7) ÷ [RTH + (1+β)RE] = ' + d(IB * 1000, 2) + ' μA；IC = ' + d(IC, 3) + ' mA；VCE = VCC − ICRC − IERE = ' + d(VCE, 2) + ' V' + (sat ? ' < 0.2 V → 飽和，VCE = 0.2 V' : '') + '。',
        E.figBias({ V: 'VCC = ' + Vcc + ' V', R1: r1 + ' kΩ', R2: r2 + ' kΩ', RC: RC + ' kΩ', RE: RE + ' kΩ' })];
    } },
    { t: 'VBB 工作範圍', g: function (R) {
      var Vcc = R.pick([9, 10, 12]), RC = R.pick([1, 2]), RE = R.pick([1, 2]);
      var IC = (Vcc - 0.2) / (RC + RE), Vmax = 0.7 + IC * RE;
      return ['如圖所示，矽電晶體 β 極大、VBE = 0.7 V、VCE(sat) = 0.2 V（基極電流可忽略），要讓電晶體工作在主動區，VBB 的範圍為何？',
        ['0.7 V < VBB ≤ ' + d(Vmax, 2) + ' V', '0.2 V < VBB ≤ ' + d(Vmax, 2) + ' V', '0.7 V < VBB ≤ ' + Vcc + ' V', '0.7 V < VBB ≤ ' + d(0.7 + (Vcc - 0.2) / RC * RE, 2) + ' V'],
        'VBB > 0.7 V 才導通。剛好飽和時 IC = (VCC − 0.2) ÷ (RC + RE) = ' + d(IC, 3) + ' mA，VE = IC·RE = ' + d(IC * RE, 2) + ' V，VBB = VE + 0.7 = ' + d(Vmax, 2) + ' V；超過就進入飽和。',
        figVbb(Vcc + ' V', RC + ' kΩ', RE + ' kΩ')];
    } },
    { t: '特性曲線求 VC', g: function (R) {
      var Vcc = R.pick([10.7, 12.7, 20.7]), RB = R.pick([500, 1000, 2000]), RC = R.pick([1, 2]);
      var IB = (Vcc - 0.7) / RB * 1000; // μA
      var ibs = [[10, 1], [20, 2], [30, 3]];
      var hit = ibs.filter(function (x) { return Math.abs(x[0] - IB) < 0.01; })[0];
      if (!hit) { RB = (Vcc - 0.7) / 20 * 1000; IB = 20; hit = ibs[1]; }
      var VC = Vcc - hit[1] * RC;
      return ['如圖所示的固定偏壓電路與電晶體輸出特性曲線，VC 為多少？',
        [d(VC, 2) + ' V', d(Vcc - (hit[1] + 1) * RC, 2) + ' V', d(hit[1] * RC, 2) + ' V', d(Vcc - 0.7, 2) + ' V'],
        'IB = (VCC − 0.7) ÷ RB = ' + d(Vcc - 0.7, 1) + ' ÷ ' + d(RB, 0) + ' kΩ = ' + d(IB, 1) + ' μA；從曲線讀 IB = ' + hit[0] + ' μA 時 IC = ' + hit[1] + ' mA；VC = VCC − IC·RC = ' + d(VC, 2) + ' V。',
        figCurve('VCC = ' + Vcc + ' V', d(RB, 0) + ' kΩ', RC + ' kΩ', ibs)];
    } },
    ['BJT 結構', '有關 BJT 電晶體特性的敘述，下列何者正確？', ['同一接面加逆向偏壓時，空乏區比順向偏壓時大', '摻雜濃度高低為基極 > 集極 > 射極', '用於小信號放大時需設計於飽和區', 'BJT 為單載子元件'], '摻雜：射極 > 基極 > 集極；放大要在主動區；BJT 是雙載子元件（電子、電洞都參與）。'],
    ['BJT 結構', '有關電晶體的敘述，下列何者錯誤？', ['空乏區寬度：B-C 接面 < B-E 接面', '飽和時基極電流越大，集極電流也無法無限制變大', '操作速度 NPN 優於 PNP', '射極與集極不可對調使用'], '集極摻雜最淡、BC 接面在主動區逆偏，所以 B-C 接面空乏區較寬。']
  ]);

  addHard('elec', 3, [
    { t: 'CE 放大器增益（含負載）', g: function (R) {
      var IC = R.pick([1, 2, 2.5]), beta = R.pick([100, 150]), RC = R.pick([4, 6]), RL = R.pick([4, 12, 6]), VT = 25;
      var rpi = beta * VT / IC / 1000, Rac = RC * RL / (RC + RL), Av = -beta * Rac / rpi;
      return ['CE 放大器（射極完全旁路），IC = ' + IC + ' mA、β = ' + beta + '、VT = 25 mV、RC = ' + RC + ' kΩ，輸出端接負載 RL = ' + RL + ' kΩ，電壓增益約為多少？',
        [H.n(-+d(-Av, 1)), H.n(-+d(beta * RC / rpi, 1)), H.n(+d(-Av, 1)), H.n(-+d(beta * Rac / (rpi * beta), 2))],
        'rπ = βVT ÷ IC = ' + d(rpi, 3) + ' kΩ；交流負載 RC ∥ RL = ' + d(Rac, 3) + ' kΩ；Av = −β(RC∥RL) ÷ rπ = ' + H.n(-+d(-Av, 1)) + '（負號表示反相）。',
        E.figBias({ V: 'VCC', R1: 'R₁', R2: 'R₂', RC: 'RC = ' + RC + ' kΩ', RE: 'RE', ce: true, ac: true })];
    } },
    { t: '共集極綜合', g: function (R) {
      var beta = R.pick([99, 49]), RE = R.pick([1, 2]), rpi = R.pick([1, 2.5]), RB = R.pick([100, 200]);
      var Rin = rpi + (beta + 1) * RE, Zi = RB * Rin / (RB + Rin), Av = (beta + 1) * RE / Rin;
      return ['共集極（射極隨耦器）放大器：β = ' + beta + '、rπ = ' + rpi + ' kΩ、RE = ' + RE + ' kΩ、RB = ' + RB + ' kΩ，下列何者正確？',
        ['Zi ≈ ' + d(Zi, 2) + ' kΩ，Av ≈ ' + d(Av, 3), 'Zi ≈ ' + d(Rin, 2) + ' kΩ，Av ≈ ' + d(-Av, 3), 'Zi ≈ ' + d(Zi, 2) + ' kΩ，Av ≈ ' + d(beta * RE / rpi, 1), 'Zi ≈ ' + d(rpi, 2) + ' kΩ，Av ≈ 1'],
        'Zi = RB ∥ [rπ + (1+β)RE] = ' + RB + ' ∥ ' + d(Rin, 1) + ' = ' + d(Zi, 2) + ' kΩ；Av = (1+β)RE ÷ [rπ + (1+β)RE] = ' + d(Av, 3) + '（略小於 1、同相）。'];
    } },
    ['三種組態', '有關 BJT 三種放大組態的比較，下列何者錯誤？', ['共基極的電流增益最大', '共射極的功率增益最大', '共集極的輸出阻抗最低', '共基極的輸入阻抗最低'], '共基極電流增益 α ≈ 1（最小）；電流增益大的是 CE 與 CC。'],
    ['三種組態', '要提高 CE 放大器的電壓增益，下列做法何者無效？', ['在射極加入未旁路的電阻', '把 RC 調大', '把 RB 調小使 IC 增大', '射極電阻並聯旁路電容'], '未旁路的射極電阻會降低增益（但較穩定）。']
  ]);
})();
