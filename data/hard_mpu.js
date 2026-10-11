/* 微處理機 困難版：仿統測／歷屆一模（何者錯誤、程式追蹤、記憶體與解碼計算） */
(function () {
  var H = QH, d = H.dec, D = DR, T = D.text;
  function hex(n, w) { var s = (n >>> 0).toString(16).toUpperCase(); while (s.length < (w || 2)) s = '0' + s; return s + 'H'; }
  function b8(n) { return ('0000000' + (n & 255).toString(2)).slice(-8); }
  // 2 對 4 解碼器 + 致能（A15 反相、A14 接 AND）
  function figDec24() {
    var X = 230, s = '<rect x="' + X + '" y="30" width="80" height="130" rx="3"/>' + T(X + 40, 90, '2 × 4', 'middle') + T(X + 40, 108, '解碼器', 'middle');
    s += D.line(50, 50, X, 50) + T(44, 54, 'A12', 'end') + T(X + 6, 54, 'A', 'start', 11);
    s += D.line(50, 80, X, 80) + T(44, 84, 'A13', 'end') + T(X + 6, 84, 'B', 'start', 11);
    var g = D.gate('AND', 150, 110, 2), nb = D.gate('NOT', 66, 130, 1);
    s += g.s + D.line(g.out[0], g.out[1], X, g.out[1]) + T(X + 6, g.out[1] + 4, 'E', 'start', 11);
    s += D.line(50, g.ins[0][1], g.ins[0][0], g.ins[0][1]) + T(44, g.ins[0][1] + 4, 'A14', 'end');
    s += nb.s + T(nb.ins[0][0] - 6, nb.ins[0][1] + 4, 'A15', 'end') + D.wire(nb.out, [nb.out[0] + 6, nb.out[1]], [nb.out[0] + 6, g.ins[1][1]], g.ins[1]);
    for (var k = 0; k < 4; k++) { var y = 45 + k * 32; s += T(X + 74, y + 4, 'Y' + k, 'end', 11) + D.line(X + 80, y, X + 115, y) + T(X + 120, y + 4, '→ RAM' + k, 'start', 12); }
    return D.svg(400, 200, s + T(0, 196, 'B 為 MSB、A 為 LSB；E = 1 時才致能', 'start', 11));
  }

  addHard('mpu', 0, [
    { t: '效能比較', g: function (R) {
      var f1 = R.pick([2, 2.5, 3]), c1 = R.pick([2, 4]), f2 = R.pick([1.5, 2, 3.2]), c2 = R.pick([1, 2]);
      var m1 = f1 * 1000 / c1, m2 = f2 * 1000 / c2;
      if (m1 === m2) { f2 = 3.2; c2 = 1; m2 = 3200; }
      var big = m1 > m2 ? 'A' : 'B';
      return ['CPU A：' + f1 + ' GHz、平均每指令 ' + c1 + ' 個時脈；CPU B：' + f2 + ' GHz、平均每指令 ' + c2 + ' 個時脈。下列敘述何者正確？',
        [big + ' 效能較高，A 為 ' + d(m1, 0) + ' MIPS、B 為 ' + d(m2, 0) + ' MIPS', (big === 'A' ? 'B' : 'A') + ' 效能較高，A 為 ' + d(m1, 0) + ' MIPS、B 為 ' + d(m2, 0) + ' MIPS', '時脈較高的一定較快', '兩者效能相同'],
        'MIPS = 時脈 ÷ CPI ÷ 10⁶：A = ' + f1 + '×10⁹ ÷ ' + c1 + ' ÷ 10⁶ = ' + d(m1, 0) + '；B = ' + d(m2, 0) + '。時脈高不一定快，還要看 CPI。'];
    } },
    ['發展與分類', '有關摩爾定律（Moore\'s Law）的敘述，下列何者錯誤？', ['經過數十年發展，摩爾定律至 3 nm 以下仍未見放緩', '由戈登・摩爾於 1965 年提出', '是一種評估半導體技術進步速度的觀察與預測', '每 18～24 個月，相同面積晶片上的電晶體數量約增加一倍'], '摩爾定律是經驗觀察，近年製程逼近物理極限已明顯放緩。'],
    ['RISC 與 CISC', '有關精簡指令集（RISC）的敘述，下列何者錯誤？', ['定址模式多樣，一般為 5 個以上', '每條指令長度固定', '將運算都限制在暫存器之間執行', '使用硬體線路控制，解碼速度快'], '定址模式多樣（5 個以上）是 CISC 的特徵。'],
    ['發展與分類', '下列設備何者「不屬於」嵌入式系統？', ['可做天氣預測的超級電腦', '具備自動駕駛的電動車', '可連網播放影片的智慧電視', '有指紋或人臉辨識的電子門禁'], '嵌入式系統為特定功能設計；超級電腦是通用電腦。']
  ]);

  addHard('mpu', 1, [
    { t: '記憶體擴充', g: function (R) {
      var chip = R.pick([['2732', 12, 8], ['2764', 13, 8], ['6116', 11, 8], ['27128', 14, 8]]), tw = R.pick([['256K', 18], ['1M', 20], ['64K', 16]]), tb = R.pick([8, 16, 32]);
      var n = Math.pow(2, tw[1] - chip[1]) * (tb / chip[2]);
      return ['有一 IC 型號 ' + chip[0] + '，已知其位址線 ' + chip[1] + ' 條、資料線 ' + chip[2] + ' 條，若要組成 ' + tw[0] + ' × ' + tb + ' bits 的記憶體系統，至少需要幾顆？',
        [n + ' 顆', n * 2 + ' 顆', n / (tb / chip[2]) + ' 顆', n / 2 + ' 顆'],
        '單顆 = 2^' + chip[1] + ' × ' + chip[2] + '；字數倍數 = 2^' + tw[1] + ' ÷ 2^' + chip[1] + ' = ' + Math.pow(2, tw[1] - chip[1]) + '；位元倍數 = ' + tb + ' ÷ ' + chip[2] + ' = ' + tb / chip[2] + '；共 ' + n + ' 顆。'];
    } },
    { t: '位址解碼（致能）', g: function (R) {
      var a15 = R.int(0, 1), a14 = R.int(0, 1), a13 = R.int(0, 1), a12 = R.int(0, 1), low = R.int(0, 0xFFF);
      var addr = (a15 << 15) | (a14 << 14) | (a13 << 13) | (a12 << 12) | low;
      var en = a15 === 0 && a14 === 1, y = a13 * 2 + a12;
      var ans = en ? 'RAM' + y : '都不會選到';
      var opts = [ans].concat(['RAM0', 'RAM1', 'RAM2', 'RAM3', '都不會選到'].filter(function (x) { return x !== ans; }).sort(function () { return Math.random() - 0.5; }).slice(0, 3));
      return ['如圖所示，微處理器位址為「' + hex(addr, 4) + '」時，會對應到哪一個記憶體？', opts,
        hex(addr, 4) + ' = ' + b8(addr >> 8) + ' ' + b8(addr) + '：A15 = ' + a15 + '、A14 = ' + a14 + ' → E = A15\'·A14 = ' + (en ? 1 : 0) + (en ? '，致能；A13A12 = ' + a13 + a12 + ' = ' + y + ' → Y' + y + ' → RAM' + y + '。' : '，解碼器沒有致能，都不會選到。'),
        figDec24()];
    } },
    { t: '位址範圍', g: function (R) {
      var size = R.pick([0x400, 0x800, 0x1000]), start = R.int(0x1000, 0x9000) & 0xFFF0 | R.int(0, 15), end = start + size - 1;
      return ['某記憶體位址範圍為 ' + hex(start, 4) + '～' + hex(end, 4) + '，若每個位址存 1 Byte，此記憶體容量為多少？',
        [size / 1024 + ' KB', (size - 1) + ' Byte', size / 512 + ' KB', size / 1024 * 8 + ' KB'],
        '個數 = ' + hex(end, 4) + ' − ' + hex(start, 4) + ' + 1 = ' + hex(size, 1) + ' = ' + size + ' = ' + size / 1024 + ' KB。'];
    } },
    { t: '管線效益', g: function (R) {
      var k = R.pick([4, 5, 6]), n = R.pick([20, 50, 100]), Tn = R.pick([1, 2]);
      var non = k * n * Tn, pipe = (k + n - 1) * Tn;
      return [k + ' 級管線 CPU 執行 ' + n + ' 個指令（時脈週期 ' + Tn + ' ns，不考慮危障），與不使用管線相比，加速比約為多少？',
        [d(non / pipe, 2) + ' 倍', k + ' 倍', d(n / (k + n - 1), 2) + ' 倍', d(pipe / non * 10, 2) + ' 倍'],
        '不用管線：' + k + ' × ' + n + ' × ' + Tn + ' = ' + non + ' ns；管線：(' + k + ' + ' + n + ' − 1) × ' + Tn + ' = ' + pipe + ' ns；加速比 = ' + d(non / pipe, 2) + '（指令越多越接近 ' + k + ' 倍）。'];
    } },
    ['記憶體', '下列儲存元件依存取速度由慢至快排列，何者正確？（①主記憶體 ②輔助記憶體 ③快取 ④快閃記憶體 ⑤暫存器）', ['②④①③⑤', '①②③④⑤', '②①③④⑤', '②①④③⑤'], '硬碟等輔助記憶體最慢 → 快閃記憶體 → 主記憶體 → 快取 → 暫存器最快。'],
    ['I/O 定址', '有關 I/O 位址規劃的敘述，下列何者錯誤？', ['獨立式 I/O 與記憶體使用相同的指令', '記憶體對映 I/O 將 I/O 裝置視為記憶體的一部分', '記憶體對映 I/O 與記憶體控制線共用', '獨立式 I/O 與記憶體使用不同的位址空間'], '獨立式 I/O 用專用的 IN／OUT 指令。'],
    ['匯流排與架構', '有關范紐曼與哈佛架構的敘述，下列何者正確？', ['范紐曼架構可能因共用匯流排造成瓶頸', '范紐曼架構有獨立的記憶體分別儲存程式與資料', '哈佛架構中程式與資料記憶體共用同一條匯流排', '哈佛架構不允許 CPU 同時提取指令與存取資料'], '范紐曼：程式與資料同一記憶體、共用匯流排；哈佛：分開，可同時存取。']
  ]);

  addHard('mpu', 2, [
    { t: '指令格式規劃', g: function (R) {
      var L = R.pick([16, 24]), op = R.pick([6, 7, 8]), used = R.pick([33, 50, 99, 120]);
      if (used >= Math.pow(2, op)) used = Math.pow(2, op) - R.pick([10, 20]);
      return ['設計一個指令長 ' + L + ' 位元、只有運算碼與運算元兩欄的指令格式，運算碼用最高的 ' + op + ' 個位元，目前已設計 ' + used + ' 道指令，還可以再增加幾道？運算元欄可直接定址多少個位址？',
        [(Math.pow(2, op) - used) + ' 道、' + Math.pow(2, L - op) + ' 個', (Math.pow(2, op) - used) + ' 道、' + Math.pow(2, L) + ' 個', (op * 16 - used) + ' 道、' + Math.pow(2, L - op) + ' 個', (Math.pow(2, L - op) - used) + ' 道、' + Math.pow(2, op) + ' 個'],
        op + ' 位元運算碼 → 2^' + op + ' = ' + Math.pow(2, op) + ' 道，再加 ' + (Math.pow(2, op) - used) + ' 道；運算元 ' + (L - op) + ' 位元 → 2^' + (L - op) + ' = ' + Math.pow(2, L - op) + ' 個位址。'];
    } },
    { t: '程式追蹤綜合', g: function (R) {
      var a = R.int(1, 15), sl = R.int(1, 3), bv = R.int(0x10, 0xF0) & 0xF0, sr = R.int(1, 3), op = R.pick(['XOR', 'OR', 'AND']);
      var A = (a << sl) & 255, Bv = bv >> sr, res = op === 'XOR' ? A ^ Bv : op === 'OR' ? A | Bv : A & Bv;
      var alt = [A ^ Bv, A | Bv, A & Bv, (a >> sl) ^ (bv << sr) & 255, A + Bv & 255].filter(function (x) { return x !== res; });
      return ['執行下列程式後，AL 的值為何？\nORG 00H\nMOV AL, ' + hex(a) + '\nSHL AL, ' + sl + '\nMOV BL, ' + hex(bv) + '\nSHR BL, ' + sr + '\n' + op + ' AL, BL\nEND\n（SHL：左移，最低位補 0；SHR：右移，最高位補 0）',
        [hex(res)].concat(alt.map(function (x) { return hex(x); })).filter(function (x, i, arr) { return arr.indexOf(x) === i; }).slice(0, 4),
        'AL = ' + hex(a) + ' 左移 ' + sl + ' 位 = ' + b8(A) + ' = ' + hex(A) + '；BL = ' + hex(bv) + ' 右移 ' + sr + ' 位 = ' + b8(Bv) + ' = ' + hex(Bv) + '；' + op + ' → ' + b8(res) + ' = ' + hex(res) + '。'];
    } },
    ['語言與翻譯', '有關組譯器、編譯器與直譯器的差異，下列敘述何者正確？', ['組譯器和編譯器會產生目的檔（.obj），直譯器不會', '直譯器只能用於低階語言', '組譯器為逐行翻譯，編譯器與直譯器為一次性翻譯', '組譯器執行效率慢，編譯器和直譯器快'], '組譯器、編譯器整份翻譯成目的檔；直譯器逐行翻譯並執行，不產生目的檔。'],
    ['組合語言指令', '下列哪一組程式「無法」將暫存器 AX 和 BX 的資料對調？', ['MOV BX, AX → MOV AX, BX', 'XCHG AX, BX', 'MOV CX, AX → MOV AX, BX → MOV BX, CX', 'PUSH AX → PUSH BX → POP AX → POP BX'], '只用兩次 MOV 會先覆蓋 BX，兩者最後都變成原本的 AX。堆疊先進後出，PUSH AX、PUSH BX 後 POP AX 取到的是 BX，可以對調。'],
    ['定址模式', '「MOV AL, 02H」與下列哪一個指令的定址方式相同？', ['ADD AL, 05H', 'MOV AL, [2000H]', 'MOV AX, BX', 'MOV A, @B'], 'MOV AL, 02H 是立即定址；ADD AL, 05H 也是立即值。[2000H] 直接定址、MOV AX, BX 暫存器定址、@B 暫存器間接定址。']
  ]);
})();
