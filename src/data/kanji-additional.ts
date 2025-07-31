import { KanjiCharacter } from '../types';

export const additionalKanjiData: KanjiCharacter[] = [
  // Food
  {
    character: '米',
    meaning: 'rice',
    onyomi: 'べい',
    kunyomi: 'こめ',
    strokes: 6,
    grade: 2,
    category: 'food',
    examples: ['米国 (べいこく) - America', '白米 (はくまい) - white rice'],
    strokeOrder: ['米']
  },
  {
    character: '食',
    meaning: 'eat',
    onyomi: 'しょく',
    kunyomi: 'た',
    strokes: 9,
    grade: 2,
    category: 'food',
    examples: ['食事 (しょくじ) - meal', '食べ物 (たべもの) - food'],
    strokeOrder: ['食']
  },
  {
    character: '飲',
    meaning: 'drink',
    onyomi: 'いん',
    kunyomi: 'の',
    strokes: 12,
    grade: 3,
    category: 'food',
    examples: ['飲み物 (のみもの) - drink', '飲酒 (いんしゅ) - drinking alcohol'],
    strokeOrder: ['飲']
  },
  {
    character: '魚',
    meaning: 'fish',
    onyomi: 'ぎょ',
    kunyomi: 'さかな',
    strokes: 11,
    grade: 2,
    category: 'food',
    examples: ['魚屋 (さかなや) - fish shop', '金魚 (きんぎょ) - goldfish'],
    strokeOrder: ['魚']
  },
  {
    character: '肉',
    meaning: 'meat',
    onyomi: 'にく',
    kunyomi: '',
    strokes: 6,
    grade: 2,
    category: 'food',
    examples: ['牛肉 (ぎゅうにく) - beef', '肉屋 (にくや) - butcher'],
    strokeOrder: ['肉']
  },
  {
    character: '卵',
    meaning: 'egg',
    onyomi: 'らん',
    kunyomi: 'たまご',
    strokes: 7,
    grade: 2,
    category: 'food',
    examples: ['卵焼き (たまごやき) - omelette', '卵白 (らんぱく) - egg white'],
    strokeOrder: ['卵']
  },
  {
    character: '牛乳',
    meaning: 'milk',
    onyomi: 'ぎゅうにゅう',
    kunyomi: '',
    strokes: 10,
    grade: 2,
    category: 'food',
    examples: ['牛乳瓶 (ぎゅうにゅうびん) - milk bottle', '牛乳屋 (ぎゅうにゅうや) - milkman'],
    strokeOrder: ['牛', '乳']
  },
  {
    character: 'パン',
    meaning: 'bread',
    onyomi: 'パン',
    kunyomi: '',
    strokes: 3,
    grade: 2,
    category: 'food',
    examples: ['食パン (しょくパン) - bread loaf', 'パン屋 (パンや) - bakery'],
    strokeOrder: ['パ', 'ン']
  },
  {
    character: '野菜',
    meaning: 'vegetable',
    onyomi: 'やさい',
    kunyomi: '',
    strokes: 15,
    grade: 3,
    category: 'food',
    examples: ['野菜ジュース (やさいジュース) - vegetable juice', '野菜炒め (やさいいため) - stir-fried vegetables'],
    strokeOrder: ['野', '菜']
  },
  {
    character: '果物',
    meaning: 'fruit',
    onyomi: 'くだもの',
    kunyomi: '',
    strokes: 12,
    grade: 3,
    category: 'food',
    examples: ['果物屋 (くだものや) - fruit shop', '果物ジュース (くだものジュース) - fruit juice'],
    strokeOrder: ['果', '物']
  },

  // Animals
  {
    character: '犬',
    meaning: 'dog',
    onyomi: 'けん',
    kunyomi: 'いぬ',
    strokes: 4,
    grade: 1,
    category: 'animals',
    examples: ['犬小屋 (いぬごや) - doghouse', '野犬 (やけん) - stray dog'],
    strokeOrder: ['犬']
  },
  {
    character: '猫',
    meaning: 'cat',
    onyomi: 'びょう',
    kunyomi: 'ねこ',
    strokes: 11,
    grade: 2,
    category: 'animals',
    examples: ['猫好き (ねこずき) - cat lover', '子猫 (こねこ) - kitten'],
    strokeOrder: ['猫']
  },
  {
    character: '鳥',
    meaning: 'bird',
    onyomi: 'ちょう',
    kunyomi: 'とり',
    strokes: 11,
    grade: 2,
    category: 'animals',
    examples: ['小鳥 (ことり) - small bird', '鳥居 (とりい) - torii gate'],
    strokeOrder: ['鳥']
  },
  {
    character: '馬',
    meaning: 'horse',
    onyomi: 'ば',
    kunyomi: 'うま',
    strokes: 10,
    grade: 2,
    category: 'animals',
    examples: ['馬車 (ばしゃ) - carriage', '乗馬 (じょうば) - horseback riding'],
    strokeOrder: ['馬']
  },
  {
    character: '牛',
    meaning: 'cow',
    onyomi: 'ぎゅう',
    kunyomi: 'うし',
    strokes: 4,
    grade: 2,
    category: 'animals',
    examples: ['牛乳 (ぎゅうにゅう) - milk', '牛肉 (ぎゅうにく) - beef'],
    strokeOrder: ['牛']
  },
  {
    character: '羊',
    meaning: 'sheep',
    onyomi: 'よう',
    kunyomi: 'ひつじ',
    strokes: 6,
    grade: 3,
    category: 'animals',
    examples: ['羊飼い (ひつじかい) - shepherd', '羊毛 (ようもう) - wool'],
    strokeOrder: ['羊']
  },
  {
    character: '豚',
    meaning: 'pig',
    onyomi: 'とん',
    kunyomi: 'ぶた',
    strokes: 11,
    grade: 3,
    category: 'animals',
    examples: ['豚肉 (ぶたにく) - pork', '子豚 (こぶた) - piglet'],
    strokeOrder: ['豚']
  },
  {
    character: '鶏',
    meaning: 'chicken',
    onyomi: 'けい',
    kunyomi: 'にわとり',
    strokes: 19,
    grade: 4,
    category: 'animals',
    examples: ['鶏肉 (とりにく) - chicken meat', '鶏小屋 (にわとりごや) - chicken coop'],
    strokeOrder: ['鶏']
  },
  {
    character: '兎',
    meaning: 'rabbit',
    onyomi: 'と',
    kunyomi: 'うさぎ',
    strokes: 8,
    grade: 4,
    category: 'animals',
    examples: ['子兎 (こうさぎ) - baby rabbit', '兎小屋 (うさぎごや) - rabbit hutch'],
    strokeOrder: ['兎']
  },
  {
    character: '虎',
    meaning: 'tiger',
    onyomi: 'こ',
    kunyomi: 'とら',
    strokes: 8,
    grade: 4,
    category: 'animals',
    examples: ['虎の子 (とらのこ) - tiger cub', '虎穴 (こけつ) - tiger\'s den'],
    strokeOrder: ['虎']
  },

  // Transportation
  {
    character: '車',
    meaning: 'car',
    onyomi: 'しゃ',
    kunyomi: 'くるま',
    strokes: 7,
    grade: 1,
    category: 'transportation',
    examples: ['自動車 (じどうしゃ) - automobile', '車輪 (しゃりん) - wheel'],
    strokeOrder: ['車']
  },
  {
    character: '電',
    meaning: 'electricity',
    onyomi: 'でん',
    kunyomi: '',
    strokes: 13,
    grade: 2,
    category: 'transportation',
    examples: ['電車 (でんしゃ) - train', '電気 (でんき) - electricity'],
    strokeOrder: ['電']
  },
  {
    character: '自',
    meaning: 'self',
    onyomi: 'じ',
    kunyomi: '',
    strokes: 6,
    grade: 2,
    category: 'transportation',
    examples: ['自動車 (じどうしゃ) - automobile', '自分 (じぶん) - myself'],
    strokeOrder: ['自']
  },
  {
    character: '動',
    meaning: 'move',
    onyomi: 'どう',
    kunyomi: 'うご',
    strokes: 11,
    grade: 3,
    category: 'transportation',
    examples: ['自動車 (じどうしゃ) - automobile', '運動 (うんどう) - exercise'],
    strokeOrder: ['動']
  },
  {
    character: '船',
    meaning: 'ship',
    onyomi: 'せん',
    kunyomi: 'ふね',
    strokes: 11,
    grade: 2,
    category: 'transportation',
    examples: ['船乗り (ふなのり) - sailor', '船舶 (せんぱく) - vessel'],
    strokeOrder: ['船']
  },
  {
    character: '飛行機',
    meaning: 'airplane',
    onyomi: 'ひこうき',
    kunyomi: '',
    strokes: 9,
    grade: 3,
    category: 'transportation',
    examples: ['旅客機 (りょかっき) - passenger plane', '飛行場 (ひこうじょう) - airport'],
    strokeOrder: ['飛', '行', '機']
  },
  {
    character: '自転車',
    meaning: 'bicycle',
    onyomi: 'じてんしゃ',
    kunyomi: '',
    strokes: 13,
    grade: 3,
    category: 'transportation',
    examples: ['自転車道 (じてんしゃどう) - bicycle lane', '自転車屋 (じてんしゃや) - bicycle shop'],
    strokeOrder: ['自', '転', '車']
  },
  {
    character: 'バス',
    meaning: 'bus',
    onyomi: 'バス',
    kunyomi: '',
    strokes: 3,
    grade: 2,
    category: 'transportation',
    examples: ['バス停 (バスてい) - bus stop', 'バス乗り場 (バスのりば) - bus terminal'],
    strokeOrder: ['バ', 'ス']
  },
  {
    character: 'タクシー',
    meaning: 'taxi',
    onyomi: 'タクシー',
    kunyomi: '',
    strokes: 6,
    grade: 3,
    category: 'transportation',
    examples: ['タクシー乗り場 (タクシーのりば) - taxi stand', 'タクシー運転手 (タクシーうんてんしゅ) - taxi driver'],
    strokeOrder: ['タ', 'ク', 'シ', 'ー']
  },
  {
    character: '新幹線',
    meaning: 'bullet train',
    onyomi: 'しんかんせん',
    kunyomi: '',
    strokes: 13,
    grade: 4,
    category: 'transportation',
    examples: ['新幹線駅 (しんかんせんえき) - bullet train station', '新幹線チケット (しんかんせンチケット) - bullet train ticket'],
    strokeOrder: ['新', '幹', '線']
  },

  // Buildings
  {
    character: '家',
    meaning: 'house',
    onyomi: 'か',
    kunyomi: 'いえ',
    strokes: 10,
    grade: 2,
    category: 'buildings',
    examples: ['家族 (かぞく) - family', '家事 (かじ) - housework'],
    strokeOrder: ['家']
  },
  {
    character: '店',
    meaning: 'shop',
    onyomi: 'てん',
    kunyomi: 'みせ',
    strokes: 8,
    grade: 2,
    category: 'buildings',
    examples: ['店員 (てんいん) - shop clerk', '本店 (ほんてん) - main store'],
    strokeOrder: ['店']
  },
  {
    character: '病院',
    meaning: 'hospital',
    onyomi: 'びょういん',
    kunyomi: '',
    strokes: 20,
    grade: 3,
    category: 'buildings',
    examples: ['総合病院 (そうごうびょういん) - general hospital', '病院食 (びょういんしょく) - hospital food'],
    strokeOrder: ['病', '院']
  },
  {
    character: '学校',
    meaning: 'school',
    onyomi: 'がっこう',
    kunyomi: '',
    strokes: 18,
    grade: 1,
    category: 'buildings',
    examples: ['小学校 (しょうがっこう) - elementary school', '学校生活 (がっこうせいかつ) - school life'],
    strokeOrder: ['学', '校']
  },
  {
    character: '大学',
    meaning: 'university',
    onyomi: 'だいがく',
    kunyomi: '',
    strokes: 13,
    grade: 3,
    category: 'buildings',
    examples: ['大学生 (だいがくせい) - university student', '大学院 (だいがくいん) - graduate school'],
    strokeOrder: ['大', '学']
  },
  {
    character: '図書館',
    meaning: 'library',
    onyomi: 'としょかん',
    kunyomi: '',
    strokes: 23,
    grade: 3,
    category: 'buildings',
    examples: ['公共図書館 (こうきょうとしょかん) - public library', '図書館員 (としょかんいん) - librarian'],
    strokeOrder: ['図', '書', '館']
  },
  {
    character: '美術館',
    meaning: 'art museum',
    onyomi: 'びじゅつかん',
    kunyomi: '',
    strokes: 25,
    grade: 4,
    category: 'buildings',
    examples: ['現代美術館 (げんだいびじゅつかん) - modern art museum', '美術館見学 (びじゅつかんけんがく) - museum tour'],
    strokeOrder: ['美', '術', '館']
  },
  {
    character: '映画館',
    meaning: 'movie theater',
    onyomi: 'えいがかん',
    kunyomi: '',
    strokes: 22,
    grade: 4,
    category: 'buildings',
    examples: ['映画館チケット (えいがかんチケット) - movie ticket', '映画館見学 (えいがかんけんがく) - theater tour'],
    strokeOrder: ['映', '画', '館']
  },
  {
    character: '銀行',
    meaning: 'bank',
    onyomi: 'ぎんこう',
    kunyomi: '',
    strokes: 22,
    grade: 3,
    category: 'buildings',
    examples: ['銀行員 (ぎんこういん) - bank employee', '銀行口座 (ぎんこうこうざ) - bank account'],
    strokeOrder: ['銀', '行']
  },
  {
    character: '郵便局',
    meaning: 'post office',
    onyomi: 'ゆうびんきょく',
    kunyomi: '',
    strokes: 20,
    grade: 4,
    category: 'buildings',
    examples: ['郵便局員 (ゆうびんきょくいん) - postal worker', '郵便局長 (ゆうびんきょくちょう) - postmaster'],
    strokeOrder: ['郵', '便', '局']
  },

  // Emotions
  {
    character: '楽',
    meaning: 'fun',
    onyomi: 'らく',
    kunyomi: 'たの',
    strokes: 13,
    grade: 2,
    category: 'emotions',
    examples: ['楽しい (たのしい) - fun', '音楽 (おんがく) - music'],
    strokeOrder: ['楽']
  },
  {
    character: '悲',
    meaning: 'sad',
    onyomi: 'ひ',
    kunyomi: 'かな',
    strokes: 12,
    grade: 3,
    category: 'emotions',
    examples: ['悲しい (かなしい) - sad', '悲劇 (ひげき) - tragedy'],
    strokeOrder: ['悲']
  },
  {
    character: '怒',
    meaning: 'angry',
    onyomi: 'ど',
    kunyomi: 'いか',
    strokes: 9,
    grade: 4,
    category: 'emotions',
    examples: ['怒る (おこる) - to get angry', '怒声 (どせい) - angry voice'],
    strokeOrder: ['怒']
  },
  {
    character: '喜',
    meaning: 'happy',
    onyomi: 'き',
    kunyomi: 'よろこ',
    strokes: 12,
    grade: 4,
    category: 'emotions',
    examples: ['喜ぶ (よろこぶ) - to be happy', '喜劇 (きげき) - comedy'],
    strokeOrder: ['喜']
  },
  {
    character: '驚',
    meaning: 'surprised',
    onyomi: 'きょう',
    kunyomi: 'おどろ',
    strokes: 22,
    grade: 4,
    category: 'emotions',
    examples: ['驚く (おどろく) - to be surprised', '驚異 (きょうい) - wonder'],
    strokeOrder: ['驚']
  },
  {
    character: '怖',
    meaning: 'scared',
    onyomi: 'ふ',
    kunyomi: 'こわ',
    strokes: 8,
    grade: 4,
    category: 'emotions',
    examples: ['怖い (こわい) - scary', '恐怖 (きょうふ) - fear'],
    strokeOrder: ['怖']
  },
  {
    character: '恥',
    meaning: 'shame',
    onyomi: 'ち',
    kunyomi: 'はじ',
    strokes: 10,
    grade: 4,
    category: 'emotions',
    examples: ['恥ずかしい (はずかしい) - embarrassing', '恥辱 (ちじょく) - disgrace'],
    strokeOrder: ['恥']
  },
  {
    character: '寂',
    meaning: 'lonely',
    onyomi: 'せき',
    kunyomi: 'さび',
    strokes: 11,
    grade: 4,
    category: 'emotions',
    examples: ['寂しい (さびしい) - lonely', '静寂 (せいじゃく) - silence'],
    strokeOrder: ['寂']
  },
  {
    character: '安心',
    meaning: 'relief',
    onyomi: 'あんしん',
    kunyomi: '',
    strokes: 6,
    grade: 3,
    category: 'emotions',
    examples: ['安心感 (あんしんかん) - sense of security', '安心材料 (あんしんざいりょう) - reassuring factor'],
    strokeOrder: ['安', '心']
  },
  {
    character: '不安',
    meaning: 'anxiety',
    onyomi: 'ふあん',
    kunyomi: '',
    strokes: 7,
    grade: 4,
    category: 'emotions',
    examples: ['不安感 (ふあんかん) - feeling of anxiety', '不安定 (ふあんてい) - unstable'],
    strokeOrder: ['不', '安']
  },

  // Actions
  {
    character: '行',
    meaning: 'go',
    onyomi: 'こう',
    kunyomi: 'い',
    strokes: 6,
    grade: 2,
    category: 'actions',
    examples: ['行く (いく) - to go', '旅行 (りょこう) - travel'],
    strokeOrder: ['行']
  },
  {
    character: '来',
    meaning: 'come',
    onyomi: 'らい',
    kunyomi: 'く',
    strokes: 7,
    grade: 2,
    category: 'actions',
    examples: ['来る (くる) - to come', '未来 (みらい) - future'],
    strokeOrder: ['来']
  },
  {
    character: '見',
    meaning: 'see',
    onyomi: 'けん',
    kunyomi: 'み',
    strokes: 7,
    grade: 1,
    category: 'actions',
    examples: ['見る (みる) - to see', '見学 (けんがく) - field trip'],
    strokeOrder: ['見']
  },
  {
    character: '聞',
    meaning: 'hear',
    onyomi: 'ぶん',
    kunyomi: 'き',
    strokes: 14,
    grade: 2,
    category: 'actions',
    examples: ['聞く (きく) - to hear', '新聞 (しんぶん) - newspaper'],
    strokeOrder: ['聞']
  },
  {
    character: '話',
    meaning: 'talk',
    onyomi: 'わ',
    kunyomi: 'はな',
    strokes: 13,
    grade: 2,
    category: 'actions',
    examples: ['話す (はなす) - to talk', '会話 (かいわ) - conversation'],
    strokeOrder: ['話']
  },
  {
    character: '読',
    meaning: 'read',
    onyomi: 'どく',
    kunyomi: 'よ',
    strokes: 14,
    grade: 2,
    category: 'actions',
    examples: ['読む (よむ) - to read', '読書 (どくしょ) - reading'],
    strokeOrder: ['読']
  },
  {
    character: '書',
    meaning: 'write',
    onyomi: 'しょ',
    kunyomi: 'か',
    strokes: 10,
    grade: 2,
    category: 'actions',
    examples: ['書く (かく) - to write', '辞書 (じしょ) - dictionary'],
    strokeOrder: ['書']
  },
  {
    character: '買',
    meaning: 'buy',
    onyomi: 'ばい',
    kunyomi: 'か',
    strokes: 12,
    grade: 2,
    category: 'actions',
    examples: ['買う (かう) - to buy', '買い物 (かいもの) - shopping'],
    strokeOrder: ['買']
  },
  {
    character: '売',
    meaning: 'sell',
    onyomi: 'ばい',
    kunyomi: 'う',
    strokes: 7,
    grade: 2,
    category: 'actions',
    examples: ['売る (うる) - to sell', '販売 (はんばい) - sales'],
    strokeOrder: ['売']
  },
  {
    character: '作',
    meaning: 'make',
    onyomi: 'さく',
    kunyomi: 'つく',
    strokes: 7,
    grade: 2,
    category: 'actions',
    examples: ['作る (つくる) - to make', '作品 (さくひん) - work'],
    strokeOrder: ['作']
  }
];

// Helper functions
export const getAdditionalKanjiByCategory = (category: string): KanjiCharacter[] => {
  return additionalKanjiData.filter(kanji => kanji.category === category);
};

export const getAdditionalKanjiByGrade = (grade: number): KanjiCharacter[] => {
  return additionalKanjiData.filter(kanji => kanji.grade === grade);
};

export const getAdditionalKanjiByStrokeCount = (strokes: number): KanjiCharacter[] => {
  return additionalKanjiData.filter(kanji => kanji.strokes === strokes);
};

export const searchAdditionalKanji = (query: string): KanjiCharacter[] => {
  const lowercaseQuery = query.toLowerCase();
  return additionalKanjiData.filter(kanji => 
    kanji.character.includes(query) ||
    kanji.meaning.toLowerCase().includes(lowercaseQuery) ||
    kanji.onyomi.includes(query) ||
    kanji.kunyomi.includes(query)
  );
}; 