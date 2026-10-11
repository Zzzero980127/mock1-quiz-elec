/* 電子學（專一）：一模範圍 第一～四單元（依一模全科筆記） */
(function () {
  var H = QH, si = H.si, d = H.dec, PI = Math.PI;

  // ---------- 電路圖、波形 ----------
  var D = DR, el = D.el, w = D.wire, T = D.text, L = D.line;
  function dash(x1, y1, x2, y2) { return L(x1, y1, x2, y2, ' stroke-dasharray="4 3" stroke-width="1"'); }
  function dim(x1, x2, y, s) { return D.arrow((x1 + x2) / 2, y, x1, y) + D.arrow((x1 + x2) / 2, y, x2, y) + T((x1 + x2) / 2, y - 5, s); }
  // 方波脈波：週期 T、高電位寬 tH（比例 r）
  function figPulse(Tl, tHl, Vml, r) {
    var x0 = 40, y0 = 140, P = 100, pts = [[x0, y0]];
    for (var k = 0; k < 3; k++) { var xs = x0 + 10 + k * P; pts.push([xs, y0], [xs, 50], [xs + r * P, 50], [xs + r * P, y0]); }
    pts.push([x0 + 10 + 3 * P, y0]);
    return D.svg(360, 175, D.axes(x0, y0, 320, 120, 't', 'v') + '<g stroke-width="2.2">' + w.apply(null, pts) + '</g>' + T(x0 - 6, 54, Vml, 'end') + dash(x0, 50, x0 + 10, 50) +
      dim(x0 + 10, x0 + 10 + r * P, 38, tHl) + dim(x0 + 10, x0 + 10 + P, 160, Tl) + dash(x0 + 10 + P, y0, x0 + 10 + P, 160) + T(x0 - 6, y0 + 4, '0', 'end'));
  }
  // 電流脈波：I1 持續 t1、0 持續 t2（單位 ms）
  function figCur(I1, t1, t2) {
    var x0 = 40, y0 = 130, u = 28, pts = [[x0, y0]], t = 0, hi = 50;
    for (var k = 0; k < 3; k++) { pts.push([x0 + t * u, hi], [x0 + (t + t1) * u, hi], [x0 + (t + t1) * u, y0], [x0 + (t + t1 + t2) * u, y0]); t += t1 + t2; }
    var s = D.axes(x0, y0, Math.min(t * u, 300) + 20, 110, 't (ms)', 'i (A)') + '<g stroke-width="2.2">' + w.apply(null, pts) + '</g>' + T(x0 - 6, hi + 4, String(I1), 'end') + dash(x0, hi, x0 + 4, hi);
    for (var i = 1; i <= t && i * u <= 320; i++) s += L(x0 + i * u, y0 - 3, x0 + i * u, y0 + 3) + T(x0 + i * u, y0 + 16, String(i), 'middle', 11);
    return D.svg(380, 160, s);
  }
  // 電源 + 電阻 + 二極體
  function figDiode(V, R1, dl) {
    return D.svg(280, 165, el('V', [40, 125], [40, 45], { plus: 'b', l: V, side: 'l' }) + w([40, 45], [40, 25]) + el('R', [40, 25], [200, 25], { l: R1 }) +
      w([200, 25], [220, 25], [220, 45]) + el('D', [220, 45], [220, 125], { l: dl }) + w([220, 125], [220, 145], [40, 145], [40, 125]) + D.arrow(120, 50, 160, 50) + T(140, 68, 'I'));
  }
  // 整流電路：half、ct（中間抽頭）、bridge
  function figRect(type, vl) {
    var s = D.ac(14, 40, 140, vl, 'l') + w([14, 40], [60, 40]) + w([14, 140], [60, 140]) + D.coil(60, 40, 140, true) + '<g stroke-width="1.2">' + L(78, 32, 78, 148) + L(83, 32, 83, 148) + '</g>';
    if (type === 'half') {
      s += D.coil(100, 40, 140, false) + el('D', [100, 40], [230, 40], { l: 'D' }) + el('R', [260, 40], [260, 140], { l: 'RL' }) + w([230, 40], [260, 40]) + w([260, 140], [100, 140]);
      return D.svg(320, 170, s);
    }
    if (type === 'ct') {
      s = D.ac(14, 50, 150, vl, 'l') + w([14, 50], [60, 50]) + w([14, 150], [60, 150]) + D.coil(60, 50, 150, true) + '<g stroke-width="1.2">' + L(78, 12, 78, 188) + L(83, 12, 83, 188) + '</g>';
      s += D.coil(100, 20, 100, false) + D.coil(100, 100, 180, false) + D.dot(100, 100) + el('D', [100, 20], [210, 20], { l: 'D₁' }) + w([210, 20], [300, 20]) +
        el('D', [100, 180], [210, 180], { l: 'D₂', side: 'b' }) + w([210, 180], [300, 180], [300, 20]) + D.dot(250, 20) + el('R', [250, 20], [250, 100], { l: 'RL', side: 'l' }) + w([250, 100], [100, 100]);
      return D.svg(320, 200, s);
    }
    var Lf = [160, 90], Rn = [260, 90], Tp = [210, 40], Bt = [210, 140];
    s += D.coil(100, 40, 140, false) + w([100, 40], [130, 40], [130, 90], Lf) + w([100, 140], [100, 172], [292, 172], [292, 90], Rn) +
      el('D', Lf, Tp) + el('D', Rn, Tp) + el('D', Bt, Lf) + el('D', Bt, Rn) + w(Tp, [210, 14], [340, 14]) + el('R', [340, 14], [340, 160], { l: 'RL' }) + w([340, 160], [210, 160], Bt) +
      D.dot(Lf[0], Lf[1]) + D.dot(Rn[0], Rn[1]) + D.dot(Tp[0], Tp[1]) + D.dot(Bt[0], Bt[1]);
    return D.svg(370, 185, s);
  }
  // 鋸齒狀漣波
  function figSaw(hi, lo) {
    var x0 = 40, y0 = 140, yh = 50, yl = 90, pts = [[x0, yh]];
    for (var k = 0; k < 5; k++) { var xs = x0 + k * 56; pts.push([xs + 46, yl], [xs + 56, yh]); }
    return D.svg(360, 165, D.axes(x0, y0, 320, 120, 't', 'v') + '<g stroke-width="2.2">' + w.apply(null, pts) + '</g>' + dash(x0, yl, x0 + 290, yl) + dash(x0, yh, x0 + 290, yh) +
      T(x0 - 6, yh + 4, hi, 'end') + T(x0 - 6, yl + 4, lo, 'end'));
  }
  // 稽納穩壓
  function figZener(Vi, Rs, Vz, IL) {
    return D.svg(320, 170, el('V', [40, 130], [40, 50], { plus: 'b', l: Vi, side: 'l' }) + w([40, 50], [40, 30]) + el('R', [40, 30], [170, 30], { l: Rs }) +
      D.dot(170, 30) + el('Z', [170, 150], [170, 30], { l: Vz, side: 'l' }) + w([170, 30], [260, 30]) + el('R', [260, 30], [260, 150], { l: 'RL' }) +
      D.arrow(215, 18, 250, 18) + T(232, 12, IL) + w([40, 130], [40, 150], [260, 150]) + D.dot(170, 150));
  }
  // 電晶體各腳電壓
  function figRegion(VB, VE, VC) {
    var q = D.npn(110, 85);
    return D.svg(250, 175, q.s + w(q.B, [60, 85]) + D.term(57, 85) + T(50, 90, 'B：' + VB, 'end') + w(q.C, [142, 18]) + D.term(142, 15) + T(152, 19, 'C：' + VC, 'start') +
      w(q.E, [142, 150]) + D.term(142, 153) + T(152, 157, 'E：' + VE, 'start'));
  }
  // 偏壓電路：o = { RB, RC, RE, R1, R2, V, ce（射極旁路電容）, ac（畫輸入輸出） }
  function figBias(o) {
    var by = 140, q = D.npn(120, by), C = q.C, E = q.E, s = q.s;
    s += w([40, 20], [C[0] + 40, 20]) + T(C[0] + 40, 12, o.V, 'end') + el('R', [C[0], 20], C, { l: o.RC, side: o.ac ? 'l' : 'r' });
    if (o.R1) {
      s += el('R', [60, 20], [60, by], { l: o.R1, side: 'l' }) + el('R', [60, by], [60, 250], { l: o.R2, side: 'l' }) + D.gnd(60, 250) + D.dot(60, 20) + D.dot(60, by) + w([60, by], q.B);
    } else {
      s += el('R', [60, 20], [60, by], { l: o.RB, side: 'l' }) + D.dot(60, 20) + w([60, by], q.B);
    }
    if (o.RE) {
      s += el('R', E, [E[0], 250], { l: o.RE, side: o.ce ? 'l' : 'r' }) + D.gnd(E[0], 250);
      if (o.ce) s += D.dot(E[0], E[1] + 8) + w([E[0], E[1] + 8], [E[0] + 40, E[1] + 8]) + el('C', [E[0] + 40, E[1] + 8], [E[0] + 40, 250], { l: 'CE' }) + w([E[0] + 40, 250], [E[0], 250]);
    } else s += D.gnd(E[0], E[1]);
    if (o.ac) s += el('C', [0, by], [60, by], { l: 'C₁' }) + D.term(-3, by) + T(-8, by + 18, 'vi', 'middle') + D.dot(C[0], C[1] - 12) +
      el('C', [C[0], C[1] - 12], [C[0] + 70, C[1] - 12], { l: 'C₂' }) + D.term(C[0] + 73, C[1] - 12) + T(C[0] + 73, C[1] + 6, 'vo');
    return D.svg(o.ac || o.ce ? 270 : 230, 270, s);
  }
  // 兩顆二極體接到同一電阻（OR 型）
  function figTwoDiode(V1, V2, Rl) {
    return D.svg(280, 175, D.term(27, 40) + T(20, 45, V1, 'end') + el('D', [30, 40], [130, 40], { l: 'D₁' }) + D.term(27, 100) + T(20, 105, V2, 'end') +
      el('D', [30, 100], [130, 100], { l: 'D₂', side: 'b' }) + w([130, 40], [150, 40], [150, 100], [130, 100]) + D.dot(150, 70) + w([150, 70], [210, 70]) +
      el('R', [210, 70], [210, 150], { l: Rl }) + D.gnd(210, 150) + D.arrow(222, 95, 222, 125) + T(230, 115, 'I', 'start'));
  }
  // 截波電路
  function figClip(vi, Rl, VB) {
    return D.svg(300, 180, D.term(20, 30) + T(12, 35, vi, 'end') + el('R', [23, 30], [150, 30], { l: Rl }) + D.dot(150, 30) + w([150, 30], [247, 30]) + D.term(250, 30) +
      el('D', [150, 30], [150, 95], { l: 'D' }) + el('V', [150, 155], [150, 95], { plus: 'b', l: VB }) + D.term(20, 155) + w([23, 155], [247, 155]) + D.term(250, 155) +
      D.dot(150, 155) + T(262, 97, 'vo', 'start') + T(250, 52, '+') + T(250, 145, '−'));
  }
  // 直流負載線
  function figLoad(Vcc, Isat) {
    var x0 = 50, y0 = 150, X = 230, Y = 110;
    return D.svg(340, 175, D.axes(x0, y0, 280, 135, 'VCE (V)', 'IC (mA)') + '<g stroke-width="2.2">' + L(x0, y0 - Y, x0 + X, y0) + '</g>' +
      T(x0 - 6, y0 - Y + 4, Isat, 'end') + T(x0 + X, y0 + 18, Vcc) + T(x0 - 6, y0 + 16, '0', 'end') + D.dot(x0, y0 - Y) + D.dot(x0 + X, y0));
  }

  QUIZ_DATA.push({
    id: 'elec', name: '電子學', desc: '專一・第一～四單元',
    units: [
      {
        name: '電子元件及波形基本概念',
        qs: [
          ['積體電路', '下列何者「不是」積體電路（IC）的優點？', ['可以承受大功率', '體積小', '省電、可靠度高', '大量生產成本低'], 'IC 缺點：不能承受大功率、電感不易做進 IC。'],
          ['積體電路', '下列哪一種元件最不容易做進 IC 裡？', ['電感', '電阻', '電晶體', '二極體'], '電感不易做進 IC。'],
          ['正弦波', '正弦波的波形因數（F.F.）與波峰因數（C.F.）約為？', ['1.11、1.414', '1.414、1.11', '1、1', '0.707、0.636'], 'F.F. = Vrms ÷ Vav ≈ 1.11；C.F. = Vm ÷ Vrms ≈ 1.414。'],
          ['正弦波', '方波的有效值與峰值的關係為？', ['Vrms = Vm', 'Vrms = Vm ÷ √2', 'Vrms = Vm ÷ √3', 'Vrms = 0.636Vm'], '方波：Vrms = Vav = Vm，F.F. = C.F. = 1。'],
          ['正弦波', '三角波（鋸齒波）的有效值為？', ['Vm ÷ √3', 'Vm ÷ √2', 'Vm', '2Vm ÷ π'], '三角波 Vrms = Vm ÷ √3。'],
          ['正弦波', '純交流正弦波「一個完整週期」的平均值為？', ['0', '0.636Vm', '0.707Vm', 'Vm'], '正負半週抵消，完整週期平均值為 0；題目說平均值通常指半週平均。'],
          ['脈波', '脈波的上升時間 tr 是指？', ['由 10% 上升到 90% 的時間', '由 0 上升到 100% 的時間', '由 50% 上升到 100% 的時間', '高電位維持的時間'], '上升時間 10% → 90%；下降時間 90% → 10%；脈波寬度量 50% 處。'],
          ['脈波', '電晶體當開關使用時，導通（ON）與斷開（OFF）分別工作在？', ['飽和區、截止區', '主動區、截止區', '截止區、飽和區', '主動區、飽和區'], '導通 = 飽和區、斷開 = 截止區。'],
          { t: '積體電路', g: function (R) {
            var c = R.pick([[R.int(2, 11), 'SSI'], [R.int(12, 99), 'MSI'], [R.int(100, 999), 'LSI'], [R.int(1000, 99999), 'VLSI']]);
            return ['一顆 IC 內含 ' + c[0] + ' 個邏輯閘，屬於哪一類？', [c[1]].concat(['SSI', 'MSI', 'LSI', 'VLSI', 'ULSI'].filter(function (x) { return x !== c[1]; }).slice(0, 3)),
              'SSI < 12、MSI 12～99、LSI 100～999、VLSI 1000～99999、ULSI ≥ 10⁵。'];
          } },
          { t: '正弦波', g: function (R) {
            var Vm = R.pick([10, 14.14, 20, 100, 141.4, 155.5, 311]), rms = Vm / Math.SQRT2, av = 2 * Vm / PI;
            var askRms = Math.random() < 0.5;
            return ['正弦波峰值 ' + Vm + ' V，其' + (askRms ? '有效值' : '半週平均值') + '約為多少？',
              askRms ? [d(rms, 2) + ' V', d(av, 2) + ' V', d(Vm * Math.SQRT2, 2) + ' V', d(Vm / Math.sqrt(3), 2) + ' V'] : [d(av, 2) + ' V', d(rms, 2) + ' V', d(Vm / PI, 2) + ' V', d(Vm / 2, 2) + ' V'],
              'Vrms = Vm ÷ √2 ≈ 0.707Vm = ' + d(rms, 2) + ' V；Vav = 2Vm ÷ π ≈ 0.636Vm = ' + d(av, 2) + ' V。'];
          } },
          { t: '正弦波', g: function (R) {
            var f = R.pick([50, 60, 100, 200, 500, 1000]), w = 2 * f, Vm = R.pick([5, 10, 20, 100]);
            var askT = Math.random() < 0.5;
            return ['v(t) = ' + Vm + ' sin(' + w + 'πt) V，其' + (askT ? '週期' : '頻率') + '為多少？',
              askT ? [si(1 / f, 's'), si(1 / w, 's'), si(2 / f, 's'), si(1 / (w * PI), 's')] : [f + ' Hz', w + ' Hz', d(w * PI, 1) + ' Hz', f / 2 + ' Hz'],
              'ω = ' + w + 'π = 2πf → f = ' + f + ' Hz；T = 1 ÷ f = ' + si(1 / f, 's') + '。'];
          } },
          { t: '正弦波', g: function (R) {
            var a = R.pick([0, 10, 20, 30, 45]), b = R.pick([0, 15, 30, 60]), f = R.pick([50, 60, 100]);
            var ph = (a + 90) - b; // v1 = cos(ωt + a) = sin(ωt + a + 90)
            return ['v1 = 10cos(ωt + ' + a + '°)、v2 = 10sin(ωt + ' + b + '°)，v1 與 v2 的相位關係為？', ['v1 超前 v2 ' + ph + '°', 'v1 落後 v2 ' + ph + '°', 'v1 超前 v2 ' + Math.abs(a - b) + '°', 'v1 落後 v2 ' + Math.abs(a - b + 180) + '°'],
              '先把 cos 換成 sin：cos(ωt + ' + a + '°) = sin(ωt + ' + (a + 90) + '°)；相位差 = ' + (a + 90) + '° − ' + b + '° = ' + ph + '°，v1 超前。'];
          } },
          { t: '脈波', g: function (R) {
            var T = R.pick([10, 20, 50, 100]), tH = T * R.pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75]), Vm = R.pick([5, 10, 12, 20]);
            var D = tH / T, Vav = Vm * D;
            return ['脈波週期 ' + T + ' ms、高電位時間 ' + d(tH, 1) + ' ms、振幅 ' + Vm + ' V（0 V～' + Vm + ' V），工作週期與平均值為？', [d(D * 100, 1) + '%、' + d(Vav, 2) + ' V', d(D * 100, 1) + '%、' + d(Vm, 2) + ' V', d(100 - D * 100, 1) + '%、' + d(Vm - Vav, 2) + ' V', d(D * 100, 1) + '%、' + d(Vm / 2, 2) + ' V'],
              'D% = tH ÷ T = ' + d(tH, 1) + ' ÷ ' + T + ' = ' + d(D * 100, 1) + '%；Vav = Vm × D% = ' + d(Vav, 2) + ' V。',
              figPulse('T = ' + T + ' ms', 'tH = ' + d(tH, 1) + ' ms', Vm + ' V', D)];
          } },
          { t: '脈波', g: function (R) {
            var D1 = R.pick([20, 21, 30, 40, 60]), V1 = R.pick([10, 12, 14, 15]), V2 = R.pick([6, 8, 9, 12]);
            var D2 = D1 * V2 / V1;
            return ['工作週期 ' + D1 + '% 時平均值為 ' + V1 + ' V，若要平均值變成 ' + V2 + ' V（振幅不變），工作週期應調為多少？', [d(D2, 2) + '%', d(D1 * V1 / V2, 2) + '%', d(D1 - (V1 - V2), 2) + '%', d(100 - D2, 2) + '%'],
              '平均值與工作週期成正比：' + D1 + '% × ' + V2 + ' ÷ ' + V1 + ' = ' + d(D2, 2) + '%。'];
          } },
          { t: '脈波', g: function (R) {
            var I1 = R.pick([2, 3, 4]), t1 = R.pick([1, 2, 3]), t2 = R.pick([1, 2, 3]), Rr = R.pick([5, 10]);
            var Irms2 = I1 * I1 * t1 / (t1 + t2), P = Irms2 * Rr;
            return ['電流為 ' + I1 + ' A 持續 ' + t1 + ' ms、0 A 持續 ' + t2 + ' ms 的重複脈波，流過 ' + Rr + ' Ω 電阻的平均功率為多少？', [d(P, 2) + ' W', d(I1 * I1 * Rr, 2) + ' W', d(Math.pow(I1 * t1 / (t1 + t2), 2) * Rr, 2) + ' W', d(P / 2, 2) + ' W'],
              'Irms² = I² × t1 ÷ T = ' + I1 * I1 + ' × ' + t1 + ' ÷ ' + (t1 + t2) + ' = ' + d(Irms2, 3) + '；P = Irms²R = ' + d(P, 2) + ' W。不能用平均電流算。',
              figCur(I1, t1, t2)];
          } }
        ]
      },
      {
        name: '二極體及應用電路',
        qs: [
          ['半導體', 'N 型半導體是在矽中加入幾價元素？多數載子為何？', ['5 價，電子', '3 價，電洞', '5 價，電洞', '3 價，電子'], 'N 型加 5 價（磷、砷、銻），多數載子電子；P 型加 3 價（硼、鎵、銦），多數載子電洞。'],
          ['半導體', '下列何者是 P 型半導體常用的摻雜（3 價）元素？', ['硼（B）', '磷（P）', '砷（As）', '銻（Sb）'], 'P 型：硼、鎵、銦（3 價）。'],
          ['半導體', 'P 型與 N 型半導體本身的電性為？', ['都呈電中性', 'P 型帶正電、N 型帶負電', 'P 型帶負電、N 型帶正電', '視摻雜量而定'], '摻雜的原子本身是電中性，所以 P、N 型半導體都呈電中性。'],
          ['半導體', '本質半導體（純矽）的溫度係數為？', ['負溫度係數（溫度升高電阻變小）', '正溫度係數', '零溫度係數', '視電壓而定'], '溫度升高產生更多電子電洞對，電阻變小。'],
          ['半導體', 'PN 接面的空乏區中，N 側帶什麼電荷的離子？', ['正離子，所以 N 側電位較高', '負離子，所以 N 側電位較低', '不帶電', '自由電子'], 'N 側失去電子留下正離子、P 側為負離子，所以 N 側電位較高。'],
          ['半導體', '二極體加順向偏壓時，空乏區會？', ['變窄', '變寬', '不變', '消失後再變寬'], '順偏空乏區變窄、逆偏變寬；摻雜越濃空乏區越窄。'],
          ['半導體', '矽、鍺的能隙約分別為？', ['1.1 eV、0.67 eV', '0.67 eV、1.1 eV', '3.4 eV、1.1 eV', '0.7 eV、0.3 eV'], '矽 1.1 eV、鍺 0.67 eV、GaN 3.4 eV；0.7 V、0.3 V 是切入電壓。'],
          ['二極體電路', '矽二極體與鍺二極體的切入電壓約為？', ['0.7 V、0.3 V', '0.3 V、0.7 V', '1.1 V、0.67 V', '0.5 V、0.2 V'], '定電壓模型：矽 0.7 V、鍺 0.3 V。'],
          ['整流與濾波', '橋式整流電路若燒斷一顆二極體（開路），輸出會變成？', ['半波整流，平均值減半', '沒有輸出', '輸出加倍', '不影響'], '橋式整流燒斷一顆 → 只剩半週導通，變成半波整流。'],
          ['整流與濾波', '半波、中間抽頭全波、橋式整流的二極體 PIV 分別為？', ['Vm、2Vm、Vm', 'Vm、Vm、2Vm', '2Vm、Vm、Vm', 'Vm、2Vm、2Vm'], 'PIV：半波 Vm；中間抽頭 2Vm；橋式 Vm。'],
          ['截波、箝位、稽納', '箝位電路的作用為？', ['把波形整體上移或下移，峰對峰值不變', '把波形截掉一部分', '把交流變成穩定直流', '放大信號'], '箝位：利用電容把波形整個上移或下移；截波：把輸出限制在某電壓。'],
          ['截波、箝位、稽納', '稽納二極體要穩壓時必須如何偏壓？', ['逆向偏壓', '順向偏壓', '不需偏壓', '交流偏壓'], '稽納要逆偏才穩壓；順偏時跟一般二極體一樣約 0.7 V。'],
          { t: '二極體電路', g: function (R) {
            var V = R.pick([5, 6, 10, 12, 15]), Rr = R.pick([0.5, 1, 2, 4.7, 10]), si_ = Math.random() < 0.7, Vg = si_ ? 0.7 : 0.3;
            var I = (V - Vg) / (Rr * 1000);
            return [V + ' V 電源串聯 ' + Rr + ' kΩ 與一顆順偏的' + (si_ ? '矽' : '鍺') + '二極體（定電壓模型），電流為多少？', [si(I, 'A'), si(V / (Rr * 1000), 'A'), si((V + Vg) / (Rr * 1000), 'A'), si((V - (si_ ? 0.3 : 0.7)) / (Rr * 1000), 'A')],
              'I = (V − Vγ) ÷ R = (' + V + ' − ' + Vg + ') ÷ ' + Rr + ' kΩ = ' + si(I, 'A') + '。',
              figDiode(V + ' V', Rr + ' kΩ', si_ ? '矽' : '鍺')];
          } },
          { t: '二極體電路', g: function (R) {
            var V = R.pick([5, 10, 12]), Rr = R.pick([100, 200, 500]), rd = R.pick([5, 10, 20]), I = (V - 0.7) / (Rr + rd);
            return [V + ' V 電源串 ' + Rr + ' Ω 與矽二極體（Vγ = 0.7 V、順向電阻 rd = ' + rd + ' Ω），電流為多少？', [si(I, 'A'), si((V - 0.7) / Rr, 'A'), si(V / (Rr + rd), 'A'), si((V - 0.7) / (Rr - rd), 'A')],
              'I = (V − Vγ) ÷ (R + rd) = ' + d(V - 0.7, 1) + ' ÷ ' + (Rr + rd) + ' = ' + si(I, 'A') + '。',
              figDiode(V + ' V', Rr + ' Ω', 'rd = ' + rd + ' Ω')];
          } },
          { t: '二極體方程式', g: function (R) {
            var k = R.pick([10, 100, 1000]), eta = R.pick([1, 2]), dv = eta * 26 * Math.log(k);
            return ['二極體（η = ' + eta + '、VT = 26 mV）電流增為原來的 ' + k + ' 倍，順向電壓約增加多少？', [d(dv, 1) + ' mV', d(eta * 26 * k, 0) + ' mV', d(eta * 26 * Math.log10(k), 1) + ' mV', d(dv / 2, 1) + ' mV'],
              'ΔVD = ηVT ln(ID2 ÷ ID1) = ' + eta + ' × 26 × ln' + k + ' ≈ ' + d(dv, 1) + ' mV（ln10 ≈ 2.3，每 10 倍約 60η mV）。'];
          } },
          { t: '能隙', g: function (R) {
            var e = R.pick([[1.1, '矽'], [0.67, '鍺'], [3.4, 'GaN']]);
            return [e[1] + '的能隙 ' + e[0] + ' eV 約等於多少焦耳？', [d(e[0] * 1.6, 3) + ' × 10⁻¹⁹ J', d(e[0] / 1.6, 3) + ' × 10⁻¹⁹ J', d(e[0] * 1.6, 3) + ' × 10¹⁹ J', e[0] + ' J'],
              '1 eV = 1.6 × 10⁻¹⁹ J；' + e[0] + ' eV = ' + d(e[0] * 1.6, 3) + ' × 10⁻¹⁹ J。'];
          } },
          { t: '整流與濾波', g: function (R) {
            var Vm = R.pick([10, 15.7, 20, 31.4, 100]), type = R.pick(['半波', '中間抽頭全波', '橋式全波']), full = type !== '半波';
            var Vdc = full ? 2 * Vm / PI : Vm / PI;
            return [type + '整流（理想二極體），二次側峰值 ' + Vm + ' V，輸出平均電壓約為多少？', [d(Vdc, 2) + ' V', d(full ? Vm / PI : 2 * Vm / PI, 2) + ' V', d(Vm / Math.SQRT2, 2) + ' V', d(Vm, 2) + ' V'],
              '半波 Vdc = Vm ÷ π；全波（中間抽頭、橋式）Vdc = 2Vm ÷ π。本題 = ' + d(Vdc, 2) + ' V。',
              figRect(type === '半波' ? 'half' : type === '中間抽頭全波' ? 'ct' : 'bridge', 'Vm = ' + Vm + ' V')];
          } },
          { t: '整流與濾波', g: function (R) {
            var Vm = R.pick([10, 12, 15, 20, 24]), type = R.pick([['半波', 1], ['中間抽頭全波', 2], ['橋式全波', 1]]);
            return [type[0] + '整流電路，變壓器二次側' + (type[0] === '中間抽頭全波' ? '（每半邊）' : '') + '峰值 ' + Vm + ' V，二極體的 PIV 至少為多少？', [type[1] * Vm + ' V', (type[1] === 2 ? Vm : 2 * Vm) + ' V', d(Vm / Math.SQRT2, 2) + ' V', d(Vm / 2, 1) + ' V'],
              'PIV：半波 Vm；中間抽頭全波 2Vm；橋式 Vm。',
              figRect(type[0] === '半波' ? 'half' : type[0] === '中間抽頭全波' ? 'ct' : 'bridge', '')];
          } },
          { t: '整流與濾波', g: function (R) {
            var Idc = R.pick([50, 100, 200, 500]), f = 60, full = Math.random() < 0.6, fr = full ? 120 : 60, C = R.pick([470, 1000, 2200]);
            var Vr = Idc / 1000 / (fr * C * 1e-6);
            return [(full ? '全波' : '半波') + '整流電容濾波，負載電流 ' + Idc + ' mA、C = ' + C + ' μF、電源 60 Hz，漣波峰對峰值約為多少？', [d(Vr, 2) + ' V', d(Idc / 1000 / ((full ? 60 : 120) * C * 1e-6), 2) + ' V', d(Vr / (2 * Math.sqrt(3)), 2) + ' V', d(Vr * 1000, 0) + ' V'],
              'Vr(p-p) ≈ Idc ÷ (fr·C)，' + (full ? '全波 fr = 2f = 120 Hz' : '半波 fr = f = 60 Hz') + '：' + Idc + ' mA ÷ (' + fr + ' × ' + C + ' μF) = ' + d(Vr, 2) + ' V。'];
          } },
          { t: '整流與濾波', g: function (R) {
            var Vpp = R.pick([1, 2, 3, 3.46, 6.93]), Vdc = R.pick([10, 12, 20]), rms = Vpp / (2 * Math.sqrt(3));
            return ['電容濾波輸出 Vdc = ' + Vdc + ' V，鋸齒狀漣波峰對峰值 ' + Vpp + ' V，漣波百分比約為多少？', [d(rms / Vdc * 100, 2) + '%', d(Vpp / Vdc * 100, 2) + '%', d(Vpp / Math.SQRT2 / Vdc * 100, 2) + '%', d(rms / Vdc * 10, 2) + '%'],
              'Vr(rms) = Vr(p-p) ÷ (2√3) = ' + d(rms, 3) + ' V；r% = ' + d(rms, 3) + ' ÷ ' + Vdc + ' × 100% = ' + d(rms / Vdc * 100, 2) + '%。',
              figSaw(d(Vdc + Vpp / 2, 2) + ' V', d(Vdc - Vpp / 2, 2) + ' V')];
          } },
          { t: '截波、箝位、稽納', g: function (R) {
            var Vz = R.pick([5, 6, 9, 10]), Vi = Vz + R.pick([6, 8, 10, 12]), Rs = R.pick([100, 200, 250, 500]), IL = R.pick([5, 10, 20]);
            var Is = (Vi - Vz) / Rs * 1000, Iz = Is - IL;
            if (Iz <= 0) { Rs = 100; Is = (Vi - Vz) / Rs * 1000; Iz = Is - IL; }
            return ['稽納穩壓電路 Vi = ' + Vi + ' V、VZ = ' + Vz + ' V、RS = ' + Rs + ' Ω，負載電流 ' + IL + ' mA，稽納電流 IZ 為多少？', [d(Iz, 2) + ' mA', d(Is, 2) + ' mA', d(Is + IL, 2) + ' mA', d(Vi / Rs * 1000 - IL, 2) + ' mA'],
              'IS = (Vi − VZ) ÷ RS = ' + (Vi - Vz) + ' ÷ ' + Rs + ' = ' + d(Is, 2) + ' mA；IZ = IS − IL = ' + d(Iz, 2) + ' mA。',
              figZener(Vi + ' V', 'RS = ' + Rs + ' Ω', 'VZ = ' + Vz + ' V', 'IL = ' + IL + ' mA')];
          } },
          { t: '截波、箝位、稽納', g: function (R) {
            var Vz = R.pick([5, 6.2, 10, 12]), dV = R.pick([0.01, 0.02, 0.05, 0.1]), dT = R.pick([10, 20, 25, 50]);
            var TC = dV / (Vz * dT) * 100;
            return ['稽納電壓 ' + Vz + ' V，溫度上升 ' + dT + ' °C 時 VZ 增加 ' + dV + ' V，溫度係數約為多少？', [d(TC, 4) + ' %/°C', d(dV / dT * 100, 3) + ' %/°C', d(dV / Vz * 100, 3) + ' %/°C', d(TC * 10, 3) + ' %/°C'],
              'TC = ΔVZ ÷ (VZ × ΔT) × 100% = ' + dV + ' ÷ (' + Vz + ' × ' + dT + ') × 100% = ' + d(TC, 4) + ' %/°C。'];
          } },
          { t: '看圖判斷二極體導通', g: function (R) {
            var V1 = R.pick([5, 8, 10, 12]), V2 = R.pick([3, 4, 6, 9]), Rl = R.pick([1, 2, 4.7, 10]), ideal = Math.random() < 0.5;
            if (V1 === V2) V2 = V1 - 2;
            var Vh = Math.max(V1, V2), Vo = ideal ? Vh : Vh - 0.7, I = Vo / Rl;
            return ['如圖所示，二極體' + (ideal ? '為理想' : '為矽二極體（導通壓降 0.7 V）') + '，流過 ' + Rl + ' kΩ 的電流 I 為多少？', [d(I, 3) + ' mA', d((V1 + V2 - (ideal ? 0 : 1.4)) / Rl, 3) + ' mA', d((Math.min(V1, V2) - (ideal ? 0 : 0.7)) / Rl, 3) + ' mA', d(ideal ? (Vh - 0.7) / Rl : Vh / Rl, 3) + ' mA'],
              '電壓較高的 ' + Vh + ' V 那顆先導通，使輸出 = ' + d(Vo, 2) + ' V，另一顆變成逆偏截止。I = ' + d(Vo, 2) + ' ÷ ' + Rl + ' kΩ = ' + d(I, 3) + ' mA。',
              figTwoDiode(V1 + ' V', V2 + ' V', Rl + ' kΩ')];
          } },
          { t: '看圖判斷截波', g: function (R) {
            var Vm = R.pick([10, 12, 15, 20]), VB = R.pick([2, 3, 4, 5]), ideal = Math.random() < 0.5, top = ideal ? VB : VB + 0.7;
            return ['如圖所示，vi = ' + Vm + ' sin ωt V，二極體' + (ideal ? '為理想' : '導通壓降 0.7 V') + '，輸出 vo 的範圍為？', [H.n(-Vm) + ' V ～ ' + d(top, 1) + ' V', H.n(-d(top, 1)) + ' V ～ ' + Vm + ' V', H.n(-Vm) + ' V ～ ' + Vm + ' V', '0 V ～ ' + d(top, 1) + ' V'],
              'vi 大於 ' + d(top, 1) + ' V 時二極體導通，輸出被限制在 VB' + (ideal ? '' : ' + 0.7') + ' = ' + d(top, 1) + ' V；負半週二極體逆偏開路，vo = vi，最低 ' + H.n(-Vm) + ' V。',
              figClip('vi', 'R', 'VB = ' + VB + ' V')];
          } }
        ]
      },
      {
        name: '雙極性接面電晶體',
        qs: [
          ['BJT 結構', 'BJT 三區的摻雜濃度大小順序為？', ['射極 > 基極 > 集極', '集極 > 基極 > 射極', '基極 > 射極 > 集極', '三區相同'], '摻雜：射極 > 基極 > 集極（集極最淡 → 提高接面逆向耐壓）。'],
          ['BJT 結構', 'BJT 三區的寬度大小順序為？', ['集極 > 射極 > 基極', '射極 > 集極 > 基極', '基極 > 集極 > 射極', '三區相同'], '寬度：集極 > 射極 > 基極（基極最薄）。'],
          ['BJT 結構', '為什麼 BJT 的射極與集極不可對調使用？', ['兩者摻雜濃度與寬度不同', '兩者材料不同', '射極沒有接腳', '集極不能加電壓'], '射極與集極摻雜、寬度不同，不可對調。'],
          ['BJT 結構', 'NPN 電晶體速度比 PNP 快的原因是？', ['主要載子是電子，移動速度比電洞快', 'NPN 摻雜較淡', 'NPN 基極較寬', 'NPN 電壓較高'], 'NPN 主要載子是電子，速度比 PNP（電洞）快。'],
          ['工作區', 'BJT 工作在主動區（放大）時，兩接面的偏壓為？', ['BE 順偏、BC 逆偏', 'BE 逆偏、BC 順偏', '兩接面都順偏', '兩接面都逆偏'], '主動區：BE 順偏、BC 逆偏；飽和：都順偏；截止：都逆偏。'],
          ['工作區', 'BJT 兩接面都順偏時，工作在？', ['飽和區', '主動區', '截止區', '崩潰區'], '飽和區：兩接面都順偏 → 開關 ON。'],
          ['直流偏壓', '固定偏壓電路中把 RB 調小，工作點會如何移動？', ['IB 變大，沿負載線往飽和方向移動', 'IB 變小，往截止方向移動', '負載線斜率改變', '負載線平移'], 'RB 變小 → IB 變大 → 工作點沿負載線往上（飽和方向）；RC 改變 → 斜率改變；VCC 改變 → 平移。'],
          ['直流偏壓', '工作點放在直流負載線的哪裡，可得最大不失真輸出？', ['中點', '靠近飽和端', '靠近截止端', '負載線外'], '工作點在負載線中點，上下擺幅最大。'],
          ['直流偏壓', 'PNP 電晶體在主動區時，下列何者正確？', ['VEB ≈ 0.7 V，VCB 為負值', 'VBE ≈ 0.7 V，VCB 為正值', 'VCE 為正值', '集極電位最高'], 'PNP 各電壓方向與 NPN 相反：VEB = 0.7 V，VCB 為負值。'],
          { t: '電流關係', g: function (R) {
            var beta = R.pick([49, 99, 79, 199, 149]), IB = R.pick([10, 20, 25, 40, 50]), IC = beta * IB / 1000, IE = (beta + 1) * IB / 1000;
            return ['β = ' + beta + ' 的電晶體，IB = ' + IB + ' μA，IC 與 IE 分別為多少？', [d(IC, 3) + ' mA、' + d(IE, 3) + ' mA', d(IE, 3) + ' mA、' + d(IC, 3) + ' mA', d(IC, 3) + ' mA、' + d(IC, 3) + ' mA', d(IC * 10, 3) + ' mA、' + d(IE * 10, 3) + ' mA'],
              'IC = βIB = ' + beta + ' × ' + IB + ' μA = ' + d(IC, 3) + ' mA；IE = (1 + β)IB = ' + d(IE, 3) + ' mA。'];
          } },
          { t: '電流關係', g: function (R) {
            var beta = R.pick([19, 49, 99, 199, 24]), a = beta / (beta + 1), toA = Math.random() < 0.5;
            return toA ? ['β = ' + beta + '，α 為多少？', [d(a, 4), d((beta + 1) / beta, 4), d(1 / beta, 4), d(beta + 1, 0)], 'α = β ÷ (1 + β) = ' + beta + ' ÷ ' + (beta + 1) + ' = ' + d(a, 4) + '。']
              : ['α = ' + d(a, 4) + '，β 為多少？', [String(beta), String(beta + 1), String(beta - 1), d(a / (1 + a), 4)], 'β = α ÷ (1 − α) = ' + beta + '。'];
          } },
          { t: '電流關係', g: function (R) {
            var beta = R.pick([49, 99, 199]), gamma = beta + 1;
            return ['β = ' + beta + ' 的電晶體，共集極電流增益 γ（IE ÷ IB）為多少？', [String(gamma), String(beta), d(beta / gamma, 3), String(gamma * 2)], 'γ = IE ÷ IB = 1 + β = ' + gamma + '。'];
          } },
          { t: '工作區', g: function (R) {
            var c = R.pick([
              [2.7, 2.0, 6.0, '主動區', 'VBE = 0.7 V 且 VC > VB'],
              [4.3, 3.5, 3.7, '飽和區', 'VBE = 0.8 V 且 VC < VB（VCE = 0.2 V）'],
              [1.7, 1.0, 1.2, '飽和區', 'VBE = 0.7 V 且 VC < VB（VCE = 0.2 V）'],
              [0.2, 0, 10, '截止區', 'VBE = 0.2 V < 0.5 V'],
              [3.7, 3.0, 8.0, '主動區', 'VBE = 0.7 V 且 VC > VB'],
              [1.0, 1.2, 5.0, '截止區', 'VBE 為負（BE 逆偏）']]);
            return ['NPN 矽電晶體量得 VB = ' + c[0] + ' V、VE = ' + c[1] + ' V、VC = ' + c[2] + ' V，工作在哪一區？', [c[3]].concat(['主動區', '飽和區', '截止區', '崩潰區'].filter(function (x) { return x !== c[3]; })),
              c[4] + ' → ' + c[3] + '。判斷：VBE ≈ 0.7 V 且 VC > VB → 主動；VC < VB → 飽和；VBE < 0.5 V → 截止。',
              figRegion(c[0] + ' V', c[1] + ' V', c[2] + ' V')];
          } },
          { t: '直流偏壓', g: function (R) {
            var Vcc = R.pick([10, 12, 15, 20]), RB = R.pick([200, 300, 470, 500, 1000]), RC = R.pick([1, 2, 2.2, 3]), beta = R.pick([50, 80, 100]);
            var IB = (Vcc - 0.7) / RB, IC = beta * IB, VCE = Vcc - IC * RC;
            var sat = VCE < 0.2;
            if (sat) { RB = 1000; IB = (Vcc - 0.7) / RB; IC = beta * IB; VCE = Vcc - IC * RC; }
            return ['固定偏壓：VCC = ' + Vcc + ' V、RB = ' + RB + ' kΩ、RC = ' + RC + ' kΩ、β = ' + beta + '（VBE = 0.7 V），IC 與 VCE 為何？',
              [d(IC, 3) + ' mA、' + d(VCE, 2) + ' V', d(Vcc / RB * beta, 3) + ' mA、' + d(Vcc - Vcc / RB * beta * RC, 2) + ' V', d(IB, 4) + ' mA、' + d(Vcc - IB * RC, 2) + ' V', d(IC, 3) + ' mA、' + d(IC * RC, 2) + ' V'],
              'IB = (VCC − VBE) ÷ RB = ' + d(Vcc - 0.7, 1) + ' ÷ ' + RB + 'k = ' + d(IB * 1000, 2) + ' μA；IC = βIB = ' + d(IC, 3) + ' mA；VCE = VCC − ICRC = ' + d(VCE, 2) + ' V。',
              figBias({ V: 'VCC = ' + Vcc + ' V', RB: 'RB = ' + RB + ' kΩ', RC: 'RC = ' + RC + ' kΩ' })];
          } },
          { t: '直流偏壓', g: function (R) {
            var Vcc = R.pick([10, 12, 15]), RB = R.pick([100, 200, 300]), RE = R.pick([0.5, 1, 2]), beta = R.pick([50, 99, 100]);
            var IB = (Vcc - 0.7) / (RB + (1 + beta) * RE), IC = beta * IB;
            return ['射極回授偏壓：VCC = ' + Vcc + ' V、RB = ' + RB + ' kΩ、RE = ' + RE + ' kΩ、β = ' + beta + '，IB 約為多少？', [d(IB * 1000, 2) + ' μA', d((Vcc - 0.7) / RB * 1000, 2) + ' μA', d((Vcc - 0.7) / (RB + RE) * 1000, 2) + ' μA', d((Vcc - 0.7) / (RB + beta * RE * 10) * 1000, 2) + ' μA'],
              'IB = (VCC − VBE) ÷ [RB + (1 + β)RE] = ' + d(Vcc - 0.7, 1) + ' ÷ [' + RB + ' + ' + (1 + beta) + ' × ' + RE + '] kΩ = ' + d(IB * 1000, 2) + ' μA；IC = βIB ≈ ' + d(IC, 3) + ' mA。',
              figBias({ V: 'VCC = ' + Vcc + ' V', RB: 'RB = ' + RB + ' kΩ', RC: 'RC', RE: 'RE = ' + RE + ' kΩ' })];
          } },
          { t: '直流偏壓', g: function (R) {
            var Vcc = R.pick([10, 12, 15, 18, 20]), p = R.pick([[40, 10], [30, 10], [20, 10], [56, 10], [47, 10]]), RE = R.pick([0.5, 1, 1.5, 2]);
            var VB = Vcc * p[1] / (p[0] + p[1]), IE = (VB - 0.7) / RE;
            if (IE <= 0) { Vcc = 20; VB = Vcc * p[1] / (p[0] + p[1]); IE = (VB - 0.7) / RE; }
            return ['分壓偏壓（β 很大）：VCC = ' + Vcc + ' V、R1 = ' + p[0] + ' kΩ、R2 = ' + p[1] + ' kΩ、RE = ' + RE + ' kΩ，IE 約為多少？', [d(IE, 3) + ' mA', d(VB / RE, 3) + ' mA', d((Vcc * p[0] / (p[0] + p[1]) - 0.7) / RE, 3) + ' mA', d((VB - 0.7) / (RE * 10), 3) + ' mA'],
              'VB = VCC × R2 ÷ (R1 + R2) = ' + d(VB, 3) + ' V；IE = (VB − VBE) ÷ RE = ' + d(VB - 0.7, 3) + ' ÷ ' + RE + ' = ' + d(IE, 3) + ' mA。',
              figBias({ V: 'VCC = ' + Vcc + ' V', R1: 'R₁ = ' + p[0] + ' kΩ', R2: 'R₂ = ' + p[1] + ' kΩ', RC: 'RC', RE: 'RE = ' + RE + ' kΩ' })];
          } },
          { t: '飽和判斷', g: function (R) {
            var Vcc = R.pick([5, 10, 12]), RC = R.pick([1, 2, 4.7]), beta = R.pick([50, 100]), IB = R.pick([20, 50, 100, 200]);
            var Isat = (Vcc - 0.2) / RC, bI = beta * IB / 1000, sat = bI > Isat;
            return ['VCC = ' + Vcc + ' V、RC = ' + RC + ' kΩ、β = ' + beta + '、IB = ' + IB + ' μA（VCE(sat) = 0.2 V），電晶體工作於？', [sat ? '飽和區' : '主動區', sat ? '主動區' : '飽和區', '截止區', '崩潰區'],
              'IC(sat) = (VCC − 0.2) ÷ RC = ' + d(Isat, 3) + ' mA；βIB = ' + d(bI, 3) + ' mA ' + (sat ? '> IC(sat) → 飽和。' : '< IC(sat) → 主動區。')];
          } },
          { t: '直流負載線', g: function (R) {
            var Vcc = R.pick([10, 12, 15, 20]), RC = R.pick([1, 2, 2.5, 4, 5]);
            return ['VCC = ' + Vcc + ' V、RC = ' + RC + ' kΩ（無 RE），直流負載線在兩軸的端點為？', ['(VCE, IC) = (' + Vcc + ' V, 0) 與 (0, ' + d(Vcc / RC, 2) + ' mA)', '(' + Vcc + ' V, 0) 與 (0, ' + d(Vcc * RC, 2) + ' mA)', '(' + d(Vcc / 2, 1) + ' V, 0) 與 (0, ' + d(Vcc / RC, 2) + ' mA)', '(0, ' + Vcc + ' V) 與 (' + d(Vcc / RC, 2) + ' mA, 0)'],
              '橫軸 VCE、縱軸 IC：截止端 (VCC, 0)、飽和端 (0, VCC ÷ RC) = (0, ' + d(Vcc / RC, 2) + ' mA)。'];
          } },
          { t: '看圖讀負載線', g: function (R) {
            var Vcc = R.pick([10, 12, 15, 20, 24]), RC = R.pick([1, 2, 2.5, 4, 5]), Is = Vcc / RC;
            return ['某固定偏壓電路（無 RE）的直流負載線如圖所示，則 VCC 與 RC 為何？', ['VCC = ' + Vcc + ' V、RC = ' + RC + ' kΩ', 'VCC = ' + Vcc + ' V、RC = ' + d(1 / RC, 2) + ' kΩ', 'VCC = ' + d(Is, 2) + ' V、RC = ' + RC + ' kΩ', 'VCC = ' + Vcc + ' V、RC = ' + d(Vcc * Is, 1) + ' kΩ'],
              '負載線與橫軸交點 = VCC = ' + Vcc + ' V；與縱軸交點 = VCC ÷ RC = ' + d(Is, 2) + ' mA → RC = ' + Vcc + ' ÷ ' + d(Is, 2) + ' = ' + RC + ' kΩ。',
              figLoad(Vcc + ' V', d(Is, 2) + ' mA')];
          } }
        ]
      },
      {
        name: '雙極性接面電晶體放大電路',
        qs: [
          ['三種組態', '電壓增益大且輸出與輸入反相、功率增益最大的組態是？', ['共射極（CE）', '共集極（CC）', '共基極（CB）', '三者相同'], 'CE：電壓增益大且反相、電流增益大、功率增益最大。'],
          ['三種組態', '射極隨耦器（共集極）的特性為？', ['電壓增益約 1、輸入阻抗高、輸出阻抗低', '電壓增益大、輸入阻抗低', '電流增益約 1、適合高頻', '輸出與輸入反相'], 'CC：Av ≈ 1（同相）、Zi 高、Zo 低 → 適合推動低電阻負載、當緩衝級。'],
          ['三種組態', '輸入阻抗很低、電流增益約為 1、適合高頻的組態是？', ['共基極（CB）', '共射極（CE）', '共集極（CC）', '達靈頓'], 'CB：Av 大（同相）、Ai ≈ α ≈ 1、Zi 很低、Zo 高 → 適合高頻。'],
          ['三種組態', '要推動低電阻負載（當緩衝級），最適合用哪一種組態？', ['共集極（CC）', '共射極（CE）', '共基極（CB）', '任何組態皆可'], '射極隨耦器輸出阻抗低，適合推動低電阻負載。'],
          ['三種組態', '下列何者「會降低」CE 放大器的電壓增益？', ['加入未旁路的射極電阻', '增大 RC', '增大 IC（RB 調小）', '射極電阻加旁路電容'], '未旁路的 RE 使增益降低（但較穩定）；其他三項都會提高增益。'],
          ['三種組態', 'CE 放大器 Av = −50，負號代表？', ['輸出與輸入反相', '增益小於 1', '衰減 50 倍', '電路故障'], '負號代表反相，比較增益大小時看絕對值。'],
          { t: '小信號參數', g: function (R) {
            var IC = R.pick([0.5, 1, 1.3, 2, 2.6, 5]), VT = R.pick([25, 26]), beta = R.pick([50, 100, 150]);
            var gm = IC / VT * 1000, rpi = beta * VT / IC;
            var ask = R.int(0, 1);
            return ask ? ['IC = ' + IC + ' mA、VT = ' + VT + ' mV，轉移電導 gm 為多少？', [d(gm, 2) + ' mA/V', d(VT / IC, 2) + ' mA/V', d(gm * beta, 0) + ' mA/V', d(gm / 1000, 4) + ' mA/V'], 'gm = IC ÷ VT = ' + IC + ' mA ÷ ' + VT + ' mV = ' + d(gm, 2) + ' mA/V。']
              : ['IC = ' + IC + ' mA、β = ' + beta + '、VT = ' + VT + ' mV，rπ 約為多少？', [si(rpi, 'Ω'), si(VT / IC, 'Ω'), si(rpi * 1000, 'Ω'), si(beta * IC / VT * 1000, 'Ω')], 'rπ = βVT ÷ IC = ' + beta + ' × ' + VT + ' mV ÷ ' + IC + ' mA = ' + si(rpi, 'Ω') + '。'];
          } },
          { t: '小信號參數', g: function (R) {
            var IE = R.pick([0.5, 1, 2, 2.5, 5]), VT = 25, re = VT / IE;
            return ['IE = ' + IE + ' mA（VT = 25 mV），射極交流電阻 re 為多少？', [d(re, 2) + ' Ω', d(re * 100, 0) + ' Ω', d(IE / VT, 3) + ' Ω', d(re / 2, 2) + ' Ω'], 're = VT ÷ IE = 25 mV ÷ ' + IE + ' mA = ' + d(re, 2) + ' Ω。'];
          } },
          { t: 'CE 電壓增益', g: function (R) {
            var IE = R.pick([1, 2, 2.5, 5]), RC = R.pick([2, 2.5, 4, 5, 10]), re = 25 / IE, Av = RC * 1000 / re;
            return ['CE 放大器（射極完全旁路），IE = ' + IE + ' mA（VT = 25 mV）、RC = ' + RC + ' kΩ，電壓增益 Av 約為多少？', [H.n(-Math.round(Av)), String(Math.round(Av)), H.n(-Math.round(Av / 10)), H.n(-Math.round(RC * 1000 / 25))],
              're = 25 ÷ ' + IE + ' = ' + d(re, 2) + ' Ω；Av = −RC ÷ re = −' + RC * 1000 + ' ÷ ' + d(re, 2) + ' = ' + H.n(-Math.round(Av)) + '（負號代表反相）。',
              figBias({ V: 'VCC', R1: 'R₁', R2: 'R₂', RC: 'RC = ' + RC + ' kΩ', RE: 'RE', ce: true, ac: true })];
          } },
          { t: 'CE 電壓增益', g: function (R) {
            var IE = R.pick([1, 2, 5]), RC = R.pick([4, 5, 10]), RE = R.pick([0.5, 1, 2]), re = 25 / IE;
            var Av = RC * 1000 / (re + RE * 1000);
            return ['CE 放大器射極電阻 RE = ' + RE + ' kΩ 未旁路，re = ' + d(re, 1) + ' Ω、RC = ' + RC + ' kΩ，Av 約為多少？', [H.n(-+d(Av, 2)), H.n(-+d(RC * 1000 / re, 0)), H.n(+d(Av, 2)), H.n(-+d(RC / (RE + RC), 2))],
              'Av ≈ −RC ÷ (re + RE) = −' + RC * 1000 + ' ÷ ' + d(re + RE * 1000, 1) + ' ≈ ' + H.n(-+d(Av, 2)) + '。加未旁路 RE 增益變小但較穩定。',
              figBias({ V: 'VCC', R1: 'R₁', R2: 'R₂', RC: 'RC = ' + RC + ' kΩ', RE: 'RE = ' + RE + ' kΩ', ac: true })];
          } },
          { t: '功率增益', g: function (R) {
            var Av = R.pick([20, 50, 80, 100, 150]), Ai = R.pick([10, 20, 40, 50]);
            return ['某放大器電壓增益 ' + Av + '、電流增益 ' + Ai + '，功率增益為多少？', [String(Av * Ai), String(Av + Ai), d(Av / Ai, 2), String(Av * Ai * 2)], 'AP = Av × Ai = ' + Av + ' × ' + Ai + ' = ' + Av * Ai + '。'];
          } },
          { t: '輸入阻抗', g: function (R) {
            var beta = R.pick([49, 99]), RE = R.pick([1, 2]), rpi = R.pick([1, 2.5]), RB = R.pick([100, 200]);
            var Rin = rpi + (1 + beta) * RE, Zi = RB * Rin / (RB + Rin);
            return ['共集極放大器：β = ' + beta + '、rπ = ' + rpi + ' kΩ、RE = ' + RE + ' kΩ、RB = ' + RB + ' kΩ，輸入阻抗 Zi 約為多少？', [d(Zi, 2) + ' kΩ', d(Rin, 2) + ' kΩ', d(RB * rpi / (RB + rpi), 2) + ' kΩ', d(RB, 2) + ' kΩ'],
              'Zi = RB ∥ [rπ + (1 + β)RE] = ' + RB + ' ∥ ' + d(Rin, 1) + ' = ' + d(Zi, 2) + ' kΩ。'];
          } }
        ]
      }
    ]
  });
})();
