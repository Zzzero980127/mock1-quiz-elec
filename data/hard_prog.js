/* 程式設計實習 困難版：仿統測／歷屆一模（程式追蹤、找錯、型態與輸出格式、情境題） */
(function () {
  var H = QH, d = H.dec;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  addHard('prog', 0, [
    ['程式應用', '學校工廠使用智慧門禁：使用者以手機 App 掃描 QR Code 即可進出，系統自動記錄時間與身分。此系統主要應用了哪一項技術？', ['程式設計與資料庫整合', '區塊鏈加密技術', '人工智慧機器學習', '虛擬實境模擬技術'], 'QR Code 辨識後由程式把進出資料寫進資料庫 → 程式設計＋資料庫（物聯網應用）。'],
    ['資訊安全', '同學發現電腦常出現奇怪的彈出視窗，甚至自己連上不明網站，應首先採取哪一種方式排除資安疑慮？', ['掃描惡意程式、更新防毒軟體並檢查背景程序', '關閉 Wi-Fi 就能防止所有駭客攻擊', '重新安裝瀏覽器，來路不明的連結只在無痕模式開啟', '刪除所有檔案與軟體避免資料外洩'], '先掃毒、更新防毒、檢查背景程式；無痕模式不能防毒，刪光檔案也不是正確處置。'],
    ['工場安全', '有關電腦教室安全與資訊倫理，下列何者錯誤？', ['使用者手冊應詳細列出程式原始碼與開發團隊歷史', '電腦教室火災屬 C 類，可用 CO₂ 或乾粉滅火', '應定期更新作業系統與防毒軟體', '不開啟來路不明的郵件附件'], '使用者手冊寫給使用者：安裝、操作、常見問題，不需要原始碼或開發歷史。']
  ]);

  addHard('prog', 1, [
    { t: '輸出行數', g: function (R) {
      var words = ['歡迎使用 C 語言！', '學習寫程式', '加油！', '成功就在前方', 'Hello', '一起努力'];
      var n = R.int(3, 5), lines = [], text = '';
      for (var i = 0; i < n; i++) {
        var pre = Math.random() < 0.3 ? '\\n' : '', post = Math.random() < 0.5 ? '\\n' : '';
        lines.push('printf("' + pre + words[i] + post + '");'); text += (pre ? '\n' : '') + words[i] + (post ? '\n' : '');
      }
      var cnt = text.split('\n').filter(function (x) { return x.length; }).length;
      return ['下列 C 程式片段一共會輸出幾行「有文字」的內容？\n' + lines.join('\n'), [cnt + ' 行', (cnt === n ? cnt - 1 : n) + ' 行', (cnt + 1) + ' 行', (cnt === 1 ? 2 : 1) + ' 行'],
        'printf 不會自動換行，只有 \\n 才換行。把字串接起來看：' + JSON.stringify(text).replace(/"/g, '') + ' → 共 ' + cnt + ' 行有文字。'];
    } },
    { t: '交換變數程式', g: function (R) {
      var a = R.int(1, 9), b = R.int(1, 9); if (a === b) b = a + 1;
      return ['下列程式（已修正語法錯誤）執行後輸出為何？\nint a = ' + a + ', b = ' + b + ';\nprintf("前: a=%d, b=%d\\n", a, b);\na = b;\nb = a;\nprintf("後: a=%d, b=%d\\n", a, b);',
        ['前: a=' + a + ', b=' + b + '；後: a=' + b + ', b=' + b, '前: a=' + a + ', b=' + b + '；後: a=' + b + ', b=' + a, '前: a=' + a + ', b=' + b + '；後: a=' + a + ', b=' + a, '前: a=' + b + ', b=' + a + '；後: a=' + a + ', b=' + b],
        'a = b 後 a 變成 ' + b + '，原本的 ' + a + ' 已被覆蓋；b = a 仍是 ' + b + '。要交換必須用暫存變數：t = a; a = b; b = t;。'];
    } },
    ['程式錯誤', '下列程式要交換兩變數卻無法編譯，共有幾處明顯的語法錯誤？\n#include <cstdio>\nmain()\n    int a = 7 , b = 8;\n    printf("a=%d, b=%d\\n", a, b)\n    a = b;\n    b = a;\n    printf("a=%d, b=%d\\n", a, b)\n    return 0;\n}', ['3 處', '2 處', '1 處', '0 處'], 'main() 後少了左大括號 {、兩個 printf 後面各少一個分號，共 3 處。a = b; b = a; 是邏輯錯誤，不是語法錯誤。'],
    ['程式語言分類', '有關程式語言的架構與分類，下列敘述何者正確？', ['標準流程圖中使用菱形符號代表條件判斷', '電腦可直接執行機器語言，但因為是二進位，執行效率較低', '組合語言屬於低階語言，經組譯器轉換後執行效率不如高階語言', 'C 語言屬於高階語言，不需要編譯即可逐行執行'], '機器語言效率最高；組合語言效率高於高階語言；C 要經編譯器編譯。'],
    ['程式錯誤', '下列何者「不是」常見的語法錯誤（syntax error）？', ['程式可正常執行但輸出非預期', '變數名稱未事先宣告', '括號左右個數不對稱', '宣告變數時把數字放在名稱的第一個字'], '可執行但結果不對是邏輯錯誤。']
  ]);

  addHard('prog', 2, [
    { t: 'const 程式判斷', g: function (R) {
      var a = R.int(5, 20), b = R.int(1, 9), c = R.pick(['const', 'none']);
      if (c === 'const') return ['試判斷下列程式的輸出：\nmain() {\n  const int a = ' + a + ';\n  const int b = ' + b + ';\n  a = a + b;\n  cout << a;\n}', ['無法通過編譯', String(a + b), String(a), String(b)],
        'a 宣告為 const，之後不能再被指定（a = a + b 會編譯錯誤）。'];
      return ['試判斷下列程式的輸出：\nmain() {\n  int a = ' + a + ';\n  const int b = ' + b + ';\n  a = a + b;\n  cout << a;\n}', [String(a + b), '無法通過編譯', String(a), String(b)],
        '只有 b 是 const；a 是一般變數可以修改：a = ' + a + ' + ' + b + ' = ' + (a + b) + '。'];
    } },
    ['常數', '下列哪一個 const 宣告是錯誤的？', ['const int x;', 'const double correctPi = 3.14;', 'const int a = 10;', "const char grade = 'A';"], 'const 宣告時就必須給初值，之後不能再改。'],
    ['識別字命名', '下列何者是合法的 C++ 整數變數宣告？', ['int score_2;', 'int 2score;', 'int double;', 'int score-2;'], '識別字只能用字母、數字、底線，不能以數字開頭，不能用關鍵字，不能有減號。'],
    { t: '#define 替換陷阱', g: function (R) {
      var a = R.int(2, 5), b = R.int(1, 4), x = R.int(2, 4);
      var real = x * a + b, naive = x * (a + b);
      return ['#define N ' + a + ' + ' + b + '\nint y = ' + x + ' * N;\n執行後 y 的值為？', [String(real), String(naive), String(x + a + b), String(x * a * b)],
        '#define 是「文字替換」：' + x + ' * N 變成 ' + x + ' * ' + a + ' + ' + b + '，先乘後加 = ' + real + '。要避免要寫成 #define N (' + a + ' + ' + b + ')。'];
    } }
  ]);

  addHard('prog', 3, [
    { t: '整數除法與轉型', g: function (R) {
      var y = R.pick([2, 4, 5, 8]), x = y * R.int(1, 5) + R.int(1, y - 1), real = x / y;
      return ['已宣告 int x = ' + x + ', y = ' + y + '; float z;，要讓 cout << z; 輸出 ' + d(real, 4) + '，應加入哪一行？', ['z = (float)x / y;', 'z = x / y;', 'z = (float)(x / y);', 'z = (float)y / x;'],
        '整數除整數會捨去小數：x / y = ' + Math.floor(real) + '；(float)(x / y) 是先除完才轉型，仍是 ' + Math.floor(real) + '；要先把 x 轉成 float 再除。'];
    } },
    { t: '最省空間型態', g: function (R) {
      var c = R.pick([[150, 'unsigned char', '年齡（最大約 150 歲）'], [60000, 'unsigned short', '體育館座位號碼（最大 60000）'], [-100, 'char', '溫度（−100～100 °C 的整數）'], [30000, 'short', '溫差（−30000～30000 的整數）']]);
      var all = ['unsigned char', 'char', 'unsigned short', 'short', 'int', 'long'];
      return ['要宣告變數儲存' + c[2] + '，下列哪一種型態最節省記憶體且符合需求？', [c[1]].concat(shuffle(all.filter(function (x) { return x !== c[1]; })).slice(0, 3)),
        'unsigned char 0～255、char −128～127、unsigned short 0～65535、short −32768～32767（各 1、1、2、2 Byte）。'];
    } },
    { t: '溢位與無號', g: function (R) {
      var t = R.pick([['unsigned char', 256, 0], ['unsigned short', 65536, 0], ['char', 256, 1], ['short', 65536, 1]]), max = t[2] ? t[1] / 2 - 1 : t[1] - 1, add = R.int(1, t[1] === 256 ? 50 : 3000);
      var v = max + add, wrap = v - t[1];
      return [t[0] + ' x = ' + max + ';\nx = x + ' + add + ';\nprintf("%d", x); 輸出為？', [H.n(wrap), String(v), String(max), H.n(-add)],
        t[0] + ' 最大 ' + max + '，超過會繞回：' + v + ' − ' + t[1] + ' = ' + H.n(wrap) + '。'];
    } },
    { t: '運算型態判斷', g: function (R) {
      var c = R.pick([['float', 'long', 'double', 'float'], ['int', 'char', 'float', 'int'], ['double', 'int', 'int', 'double'], ['char', 'char', 'int', 'int']]);
      return [c[0] + ' 型態的變數 a 與 ' + c[1] + ' 型態的變數 b 相乘，運算結果的型態為何？（不考慮存入的變數）', [c[3]].concat(shuffle(['char', 'int', 'long', 'float', 'double'].filter(function (x) { return x !== c[3]; })).slice(0, 3)),
        '運算時自動轉成兩者中較大的型態（char → int → long → float → double）；char 與 char 運算會先提升為 int。'];
    } },
    { t: 'printf 綜合輸出', g: function (R) {
      var v = R.int(100, 9999) / 100, w2 = R.pick([6, 8]), k = R.pick([1, 2]), s = v.toFixed(k), pad = Array(Math.max(w2 - s.length, 0) + 1).join('_');
      var milli = Math.round(v * 100);
      if (milli % 10 === 5) { v = (milli + 1) / 100; s = v.toFixed(k); pad = Array(Math.max(w2 - s.length, 0) + 1).join('_'); }
      return ['double v = ' + v + ';\nprintf("[%' + w2 + '.' + k + 'f]%%", v);\n輸出為何？（以 _ 表示空白）', ['[' + pad + s + ']%', '[' + s + pad + ']%', '[' + pad + s + ']', '[' + s + ']%'],
        '%' + w2 + '.' + k + 'f：總寬 ' + w2 + '、小數 ' + k + ' 位、靠右；%% 印出一個 %。'];
    } }
  ]);
})();
