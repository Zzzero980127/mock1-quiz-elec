/* 英文：一模範圍 英文 I～II（單字自動出題 + 文法） */
(function () {
  // 課本單字：'英文|中文'
  var VOCAB = {
    'B1L1': 'exciting|令人興奮的；刺激的,excited|興奮的,proud|驕傲的,challenge|挑戰,nervous|緊張的,different|不同的,difference|差異,awesome|很棒的；令人驚歎的,surprised|驚訝的,interested|有興趣的,interesting|有趣的,decision|決定（n.）,upset|難過的,trust|相信；信任,perfect|完美的,certainly|必定,unforgettable|令人難忘的,memory|回憶；記憶,be in the same boat|處在相同困境,make a difference|帶來不同；造成影響,go for sth.|努力爭取某事物,give up|放棄,have one\'s back|支持某人,all the time|一直；總是',
    'B1L2': 'prepare|準備,consideration|考慮（n.）,guest|客人,host|主人；主辦,pleasant|令人愉快的,awkward|尷尬的,therefore|因此,assign|分配；指派,originally|起初地；原先地,unexpected|出乎意料的,expect|期待；預期,fair|市集；公平的,impress|使留下深刻印象,secret|祕密,enjoyable|（令人）愉快的,experience|經驗；經歷,invite sb. over|邀請某人到家裡,come up with|想出；想到,in fact|事實上,refer to|意指,date back to|追溯到,show up|出現',
    'B1L3': 'recover|康復（v.）,recovery|康復（n.）,surgery|外科手術,suffer|遭受；受苦,disease|（疾）病,realize|察覺；意識到,describe|描述,couple|情侶；夫妻,encourage|鼓勵,view|景觀；看待,imagine|想像（v.）,imagination|想像（n.）,remove|移除,reply|回答；回覆,return|返回；歸還,shocked|震驚的,blind|眼盲的,whisper|低語；耳語,turn away|轉頭不看,try one\'s best|盡己所能,day after day|日復一日,in detail|詳細地,turn around|轉身,pass away|過世,nothing but|只有；僅僅',
    'B1L4': 'alarm|鬧鐘,straight|直接地；直的,research|研究,oversleep|睡過頭,amazing|令人驚奇的,invent|發明,inventor|發明者,solve|解決（v.）,solution|解決辦法,regular|一般的,chase|追逐,promise|承諾,design|設計,position|位置；擺放,particular|特定的,create|創造,creative|有創造力的,encounter|遭遇；遇到,wake up|醒來,take action|採取行動,get out of|離開；走出,on time|準時,go off|（鬧鐘）發出聲響,in order to|為了……,in advance|事先',
    'B1L5': 'difficulty|困難（n.）,otherwise|否則；不然,aware|知道的；意識到的,eventually|終於；最後,confirm|確認,scared|害怕的,approach|靠近；接近,shelter|收容所；避難所,crowded|擁擠的,forever|永遠,terrified|受到驚嚇的,exhausted|精疲力竭的,awake|醒來；醒著的,adopt|領養,blessing|幸運的事,used to|過去經常……,take care of|照顧,at first|起初,not… anymore|不再,all of a sudden|突然,at last|最後,nod off|打瞌睡',
    'B1L6': 'bored|感到無聊的,boring|令人覺得無聊的,complain|抱怨,instead|反而,talent|天賦,recognize|認可,focus|集中（注意力）,period|一段時間,confident|有信心的,confidence|信心,patient|有耐心的,patience|耐心,determined|堅決的,image|圖像,unique|獨一無二的,customer|顧客,support|支持,success|成功（n.）,successful|成功的,inspire|激勵,turn out|結果是……,no longer|不再,be filled with|充滿,as a result|因此,in the end|最後,make the most of|充分利用',
    'B2L1': 'relationship|關係,connect|連接；建立關係,connection|關聯,communicate|溝通（v.）,communication|溝通（n.）,probably|很可能,introduce|介紹（v.）,introduction|介紹（n.）,knowledge|知識,completely|完全地,throughout|從頭到尾；遍及,message|訊息,romantic|浪漫的,ignore|忽視；忽略,attention|注意力,respond|回應（v.）,response|回應（n.）,disappointed|感到失望的,disappoint|使……失望,go through|仔細閱讀,in case|以防……,in addition|此外,hang out|一起消磨時間,turn to|轉向……求助,take… personally|認為……是針對個人的',
    'B2L2': 'journey|旅程,popular|受歡迎的,popularity|流行（n.）,develop|發展；培養,development|發展（n.）,fade|逐漸消失,delicious|美味的,allow|允許,occur|發生,struggle|掙扎；奮鬥,earn|賺得,unfortunately|不幸地,reject|拒絕接受,force|強迫；迫使,nevertheless|儘管如此,spread|傳開；散布,achieve|達成,fame|名聲,fortune|一大筆錢,be familiar with|熟悉,over time|逐漸地,in time|經過一段時間後；終於,pass by|經過,thanks to|幸虧；由於',
    'B2L3': 'flaw|缺點,flawed|有瑕疵的,cracked|有裂縫的,path|小徑,leak|滲漏,drip|滴出,ashamed|羞愧的,awful|很糟的,properly|適當地,fetch|（去）拿來,apologize|道歉（v.）,apology|道歉（n.）,emotion|情緒,honest|誠實的,actually|事實上,scatter|撒,indeed|的確,decorate|裝飾（v.）,decoration|裝飾（n.）,once upon a time|從前從前,as usual|照常,all along|一直,from time to time|偶爾,be good at|擅長',
    'B2L4': 'abroad|在／到國外,custom|習俗,local|當地的,praise|讚美；表揚,traditional|傳統的,society|社會,elder|長輩；長者,respect|尊敬；尊重,honor|向……致敬,meaningful|有意義的,satisfying|令人滿意的,shameful|丟臉的；可恥的,regard|看待；視為,reserve|保留,reservation|預約；預訂,avoid|避開；避免,situation|情況；形勢,appetite|胃口；食慾,when it comes to|談到,for instance|例如,on the other hand|另一方面,be likely to|可能,speaking of|說到,now that|既然,keep an eye out for|留意',
    'B2L5': 'environment|環境,environmental|環境的,daily|每天的,routine|例行公事,extremely|極端地,tend|傾向,prefer|偏好（v.）,preference|偏好（n.）,flavor|口味,float|飄浮；漂流,muscle|肌肉,cause|造成,gradually|逐漸地,shrink|縮小,maintain|維持,strength|力氣,weight|重量,lack|缺乏,terrific|很棒的,be close to|接近,due to|由於,come with|附有……,rather than|而不是……,bump into|撞到；巧遇',
    'B2L6': 'century|世紀,means|方式,transportation|運輸,contain|包含,ideal|理想的,produce|生產,product|產品,including|包括（prep.）,invitation|邀請,method|方法,bitter|苦的,profitable|有利潤的,profit|利潤,donate|捐贈（v.）,donation|捐贈（n.）,protection|保護（n.）,provide|提供,medical|醫療的,creature|生物,rescue|拯救,according to|根據,be made from|用……製成的,not… at all|一點也不……,turn… into…|把……變成……,at the same time|同時'
  };

  var LIST = [];
  Object.keys(VOCAB).forEach(function (L) {
    VOCAB[L].split(',').forEach(function (s) { var p = s.split('|'); LIST.push({ w: p[0], zh: p[1], L: L, book: L.slice(0, 2) }); });
  });

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  // 同冊、意思不重疊的干擾選項
  function distract(item, key) {
    var pool = shuffle(LIST.filter(function (x) { return x !== item && x.zh !== item.zh && x.w !== item.w && (x.w.indexOf(' ') >= 0) === (item.w.indexOf(' ') >= 0); }));
    var out = [], seen = {}; seen[item[key]] = 1;
    for (var i = 0; i < pool.length && out.length < 3; i++) { var v = pool[i][key]; if (!seen[v]) { seen[v] = 1; out.push(v); } }
    return out;
  }

  // 單字題：每個字兩種方向，每次出題干擾選項都會重抽
  function vocabUnit(book) {
    return LIST.filter(function (x) { return x.book === book; }).reduce(function (acc, it) {
      var tag = it.L + ' 單字';
      acc.push({ t: tag, g: function () { return ['「' + it.w + '」的中文意思是？', [it.zh].concat(distract(it, 'zh')), it.w + '：' + it.zh + '（' + it.L + '）']; } });
      acc.push({ t: tag, g: function () { return ['「' + it.zh + '」的英文是？', [it.w].concat(distract(it, 'w')), it.zh + '：' + it.w + '（' + it.L + '）']; } });
      return acc;
    }, []);
  }

  QUIZ_DATA.push({
    id: 'eng', name: '英文', desc: '英文 I～II',
    units: [
      { name: '英文 I 單字片語（B1）', qs: vocabUnit('B1') },
      { name: '英文 II 單字片語（B2）', qs: vocabUnit('B2') },
      {
        name: '詞性與易混字',
        qs: [
          ['-ing / -ed 形容詞', 'The movie was so ___ that I watched it twice.', ['exciting', 'excited', 'excite', 'excitement'], '-ing 形容「事物」讓人有感覺；-ed 形容「人」的感受。'],
          ['-ing / -ed 形容詞', 'I was ___ to hear that you passed the exam.', ['surprised', 'surprising', 'surprise', 'surprisingly'], '人的感受用 -ed。'],
          ['-ing / -ed 形容詞', 'The class was so ___ that many students fell asleep.', ['boring', 'bored', 'bore', 'boredom'], 'bored（人感到無聊）vs. boring（事物令人無聊）。'],
          ['-ing / -ed 形容詞', 'After running ten kilometers, Tom felt ___.', ['exhausted', 'exhausting', 'exhaust', 'exhaustion'], 'scared、terrified、exhausted 形容人的感受。'],
          ['-ing / -ed 形容詞', 'The meal was very ___; everyone enjoyed it.', ['satisfying', 'satisfied', 'satisfy', 'satisfaction'], 'satisfying（事物令人滿意）vs. satisfied（人感到滿意）。'],
          ['詞性變化', 'We need to find a ___ to this problem.', ['solution', 'solve', 'solved', 'solvable'], 'solve（v.）→ solution（n.）；a solution to …。'],
          ['詞性變化', 'He made an important ___ to study abroad.', ['decision', 'decide', 'decided', 'decisive'], 'decide（v.）→ decision（n.）；空格前有 an important，要名詞。'],
          ['詞性變化', 'She has great ___ in herself.', ['confidence', 'confident', 'confidently', 'confide'], 'confident（adj.）→ confidence（n.）。'],
          ['詞性變化', 'Learning a language takes time and ___.', ['patience', 'patient', 'patiently', 'patients'], 'patient（adj. 有耐心的）→ patience（n.）。'],
          ['詞性變化', 'Good ___ is the key to a healthy relationship.', ['communication', 'communicate', 'communicative', 'communicated'], 'communicate → communication。'],
          ['詞性變化', 'The ___ of smartphones has changed our lives.', ['popularity', 'popular', 'popularly', 'populate'], 'popular → popularity。'],
          ['詞性變化', 'He made an ___ for being late.', ['apology', 'apologize', 'apologetic', 'apologizing'], 'apologize（v.）→ apology（n.）。'],
          ['一字多義', '"He will host the party." 句中 host 的詞性與意思是？', ['vt. 主辦', 'n. 主人', 'n. 客人', 'adj. 熱情的'], 'host：主人（n.）／主辦（vt.）。'],
          ['一字多義', '"It\'s not fair!" 句中 fair 的意思是？', ['公平的', '市集', '美麗的', '頭髮'], 'fair：市集（n.）／公平的（adj.）。'],
          ['一字多義', '"Please return the book to the library." 的 return 意思是？', ['歸還', '返回', '回覆', '旋轉'], 'return：返回（vi.）／歸還（vt.，return sth. to sb.）。'],
          ['一字多義', '"It\'s a shame that you can\'t come." 的 shame 意思是？', ['可惜的事', '羞恥', '丟臉的', '責備'], 'a shame = 可惜的事；shame [U] = 羞恥。'],
          ['易混字', '"The food is terrific!" 的 terrific 意思是？', ['很棒的', '很糟的', '恐怖的', '辛辣的'], 'terrific = great，不是 terrible。'],
          ['易混字', 'This paper is made ___ elephant dung.（看不出原料）', ['from', 'of', 'by', 'in'], 'be made from（看不出原料）vs. be made of（看得出材料）。'],
          ['易混字', 'The table is made ___ wood.（看得出材料）', ['of', 'from', 'with', 'into'], ''],
          ['易混字', 'Walking is a cheap ___ of transportation.', ['means', 'mean', 'meaning', 'meant'], 'means 單複數同形：a means of transportation。'],
          ['易混字', 'The train arrived ___. It was exactly 8:00.（準時）', ['on time', 'in time', 'at time', 'by time'], 'on time 準時；in time 及時、終於。'],
          ['易混字', 'He ___ confidence in himself.', ['lacks', 'lacks of', 'is lack', 'lack of'], 'lack 是及物動詞，不加 of；名詞才用 a lack of。'],
          ['易混字', 'I prefer tea ___ coffee.', ['to', 'than', 'for', 'with'], 'prefer A to B（喜歡 A 勝過 B）。'],
          ['易混字', 'The game was canceled ___ the heavy rain.', ['due to', 'because', 'although', 'so that'], 'due to + N（由於）；because + 子句。']
        ]
      },
      {
        name: '文法',
        qs: [
          ['時態', 'I ___ here for ten years.', ['have lived', 'lived', 'live', 'am living'], 'for + 一段時間、從過去持續到現在 → 現在完成式。'],
          ['時態', 'When I arrived at the station, the train ___.', ['had left', 'has left', 'left', 'leaves'], '比另一個過去動作更早發生 → 過去完成式。'],
          ['時態', 'I will call you when I ___ home.', ['arrive', 'will arrive', 'arrived', 'have arrive'], '時間副詞子句用現在式代替未來式。'],
          ['時態', 'I don\'t know when he ___ back.', ['will come', 'comes', 'came', 'has came'], 'when 引導名詞子句（何時）當受詞 → 可用 will。'],
          ['時態', 'I don\'t know if it ___ tomorrow.', ['will rain', 'rains', 'rained', 'is rain'], 'if 引導名詞子句（是否）→ 可用 will。'],
          ['時態', 'By the time we got there, the movie ___.', ['had started', 'has started', 'starts', 'will start'], 'by the time + 過去式，主要子句用過去完成。'],
          ['時態', 'By the time you come back, I ___ the report.', ['will have finished', 'have finished', 'finished', 'had finished'], '未來的先發生 → 主要子句用未來完成；by the time 子句用現在式。'],
          ['時態', 'He ___ to Japan two years ago.', ['went', 'has gone', 'has been', 'goes'], '有 ago 明確過去時間 → 不能用現在完成式。'],
          ['時態', 'After he ___ his homework, he went out.', ['had finished', 'has finished', 'finishes', 'will finish'], 'after 子句先發生 → had p.p.。'],
          ['主動詞一致', 'The color of the flowers ___ beautiful.', ['is', 'are', 'were', 'be'], '真正主詞是 color（單數）。'],
          ['主動詞一致', 'Neither you nor he ___ wrong.', ['is', 'are', 'am', 'were'], '就近原則：動詞跟最近的主詞 he。'],
          ['主動詞一致', 'The teacher, as well as the students, ___ here.', ['is', 'are', 'were', 'have'], 'A as well as B → 跟前面的 A。'],
          ['主動詞一致', 'One of my friends ___ in Taipei.', ['lives', 'live', 'living', 'are living'], 'one of + 複數名詞 → 單數動詞。'],
          ['主動詞一致', 'Reading books ___ fun.', ['is', 'are', 'were', 'be'], '動名詞當主詞 → 單數。'],
          ['主動詞一致', 'He lied to me, which ___ me angry.', ['makes', 'make', 'making', 'are made'], 'which 指前面整句話 → 單數。'],
          ['主動詞一致', 'There ___ many night markets in the city.', ['are', 'is', 'has', 'have'], 'There is/are 跟後面的名詞一致。'],
          ['不定詞與動名詞', 'She avoided ___ junk food.', ['eating', 'to eat', 'eat', 'ate'], 'avoid、enjoy、finish、mind、keep、practice、consider 後接 Ving。'],
          ['不定詞與動名詞', 'They decided ___ to Tainan.', ['to move', 'moving', 'move', 'moved'], 'want、hope、decide、plan、expect、agree、refuse 後接 to V。'],
          ['不定詞與動名詞', 'My father stopped ___ last year. He is healthier now.（戒菸）', ['smoking', 'to smoke', 'smoke', 'smoked'], 'stop Ving 停止正在做的事；stop to V 停下來去做另一件事。'],
          ['不定詞與動名詞', 'Remember ___ the door when you leave.', ['to lock', 'locking', 'lock', 'locked'], 'remember to V 記得「要去」做；remember Ving 記得「已經」做過。'],
          ['不定詞與動名詞', 'I look forward to ___ you again.', ['seeing', 'see', 'saw', 'be seen'], 'look forward to 的 to 是介系詞 → Ving。'],
          ['不定詞與動名詞', 'The heavy rain kept us ___ out.', ['from going', 'to go', 'go', 'going to'], 'keep / prevent / stop + O + from Ving。'],
          ['不定詞與動名詞', 'I have trouble ___ at night.', ['sleeping', 'to sleep', 'sleep', 'slept'], 'have trouble (in) Ving。'],
          ['不定詞與動名詞', 'She is used to ___ up early.', ['getting', 'get', 'got', 'gets'], 'be used to + Ving（習慣於）；used to + VR（過去經常）。'],
          ['不定詞與動名詞', 'He ___ play soccer every day, but now he doesn\'t.', ['used to', 'is used to', 'uses to', 'was used to'], 'used to + VR 過去經常。'],
          ['不定詞與動名詞', 'When it comes to ___ English, practice is the key.', ['learning', 'learn', 'learned', 'be learned'], 'when it comes to + N / Ving。'],
          ['句子結構', 'He walked home, ___ very tired.', ['feeling', 'felt', 'feels', 'and feeling'], '一句只能有一個主要動詞，第二個動詞改成分詞。'],
          ['比較', 'The weather here is hotter than ___ in Taipei.', ['that', 'those', 'it', 'one'], '比較同類東西，用 that 代替前面的單數名詞。'],
          ['比較', 'This book is ___ better than that one.', ['much', 'very', 'more', 'so'], '修飾比較級用 much、far、even、a lot、still，不能用 very。'],
          ['比較', 'The more you practice, ___ you get.', ['the better', 'better', 'the best', 'more better'], 'the + 比較級…, the + 比較級…'],
          ['代名詞', 'I have two pens. One is red, and ___ is blue.', ['the other', 'another', 'other', 'others'], '兩個：one…, the other…'],
          ['代名詞', 'I lost my umbrella, so I bought a new ___.', ['one', 'it', 'that', 'them'], 'it 指同一個；one 指同類的另一個。'],
          ['代名詞', 'Some people like tea; ___ like coffee.', ['others', 'the other', 'another', 'other'], '不特定的其他人用 others。'],
          ['介系詞與連接詞', 'Everyone came to the party ___ Tom.（Tom 沒來）', ['except', 'besides', 'including', 'with'], 'except 不包含；besides 包含（除了…還有）。'],
          ['介系詞與連接詞', 'Smoking results ___ lung cancer.', ['in', 'from', 'of', 'to'], 'result in + 結果；result from + 原因。'],
          ['介系詞與連接詞', '___ it rained heavily, we still went hiking.', ['Although', 'Despite', 'Because', 'But'], 'although + 子句；despite + 名詞。although 和 but 不能同時用。'],
          ['介系詞與連接詞', '___ the rain, we still went hiking.', ['Despite', 'Although', 'Even though', 'Because'], 'despite / in spite of + 名詞。'],
          ['介系詞與連接詞', 'He didn\'t go to bed ___ midnight.', ['until', 'since', 'when', 'while'], 'not … until … 直到…才…'],
          ['介系詞與連接詞', 'Tom likes tea, ___ Amy likes coffee.', ['while', 'during', 'because', 'unless'], 'while 有「而；然而」表對比。during 是介系詞。'],
          ['介系詞與連接詞', 'She is not only smart ___ kind.', ['but also', 'and also', 'or', 'nor'], 'not only A but (also) B，前後詞性對稱。'],
          ['介系詞與連接詞', 'Take an umbrella ___ it rains.', ['in case', 'unless', 'although', 'until'], 'in case 以防；unless 除非 = if not。'],
          ['介系詞與連接詞', 'Many people came, ___ me.', ['including', 'included', 'include', 'includes'], 'including（介系詞）+ 名詞；included 放名詞後面（me included）。'],
          ['介系詞與連接詞', '"Nevertheless" 的意思最接近？', ['however', 'therefore', 'besides', 'otherwise'], 'nevertheless = however（儘管如此）。']
        ]
      }
    ]
  });
})();
