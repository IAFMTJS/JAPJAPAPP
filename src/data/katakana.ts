import { KatakanaCharacter } from '../types';

export const katakanaData: KatakanaCharacter[] = [
  // Basic Katakana (46 characters)
  { character: 'ア', romaji: 'a', audio: 'a', category: 'basic' },
  { character: 'イ', romaji: 'i', audio: 'i', category: 'basic' },
  { character: 'ウ', romaji: 'u', audio: 'u', category: 'basic' },
  { character: 'エ', romaji: 'e', audio: 'e', category: 'basic' },
  { character: 'オ', romaji: 'o', audio: 'o', category: 'basic' },
  
  { character: 'カ', romaji: 'ka', audio: 'ka', category: 'basic' },
  { character: 'キ', romaji: 'ki', audio: 'ki', category: 'basic' },
  { character: 'ク', romaji: 'ku', audio: 'ku', category: 'basic' },
  { character: 'ケ', romaji: 'ke', audio: 'ke', category: 'basic' },
  { character: 'コ', romaji: 'ko', audio: 'ko', category: 'basic' },
  
  { character: 'サ', romaji: 'sa', audio: 'sa', category: 'basic' },
  { character: 'シ', romaji: 'shi', audio: 'shi', category: 'basic' },
  { character: 'ス', romaji: 'su', audio: 'su', category: 'basic' },
  { character: 'セ', romaji: 'se', audio: 'se', category: 'basic' },
  { character: 'ソ', romaji: 'so', audio: 'so', category: 'basic' },
  
  { character: 'タ', romaji: 'ta', audio: 'ta', category: 'basic' },
  { character: 'チ', romaji: 'chi', audio: 'chi', category: 'basic' },
  { character: 'ツ', romaji: 'tsu', audio: 'tsu', category: 'basic' },
  { character: 'テ', romaji: 'te', audio: 'te', category: 'basic' },
  { character: 'ト', romaji: 'to', audio: 'to', category: 'basic' },
  
  { character: 'ナ', romaji: 'na', audio: 'na', category: 'basic' },
  { character: 'ニ', romaji: 'ni', audio: 'ni', category: 'basic' },
  { character: 'ヌ', romaji: 'nu', audio: 'nu', category: 'basic' },
  { character: 'ネ', romaji: 'ne', audio: 'ne', category: 'basic' },
  { character: 'ノ', romaji: 'no', audio: 'no', category: 'basic' },
  
  { character: 'ハ', romaji: 'ha', audio: 'ha', category: 'basic' },
  { character: 'ヒ', romaji: 'hi', audio: 'hi', category: 'basic' },
  { character: 'フ', romaji: 'fu', audio: 'fu', category: 'basic' },
  { character: 'ヘ', romaji: 'he', audio: 'he', category: 'basic' },
  { character: 'ホ', romaji: 'ho', audio: 'ho', category: 'basic' },
  
  { character: 'マ', romaji: 'ma', audio: 'ma', category: 'basic' },
  { character: 'ミ', romaji: 'mi', audio: 'mi', category: 'basic' },
  { character: 'ム', romaji: 'mu', audio: 'mu', category: 'basic' },
  { character: 'メ', romaji: 'me', audio: 'me', category: 'basic' },
  { character: 'モ', romaji: 'mo', audio: 'mo', category: 'basic' },
  
  { character: 'ヤ', romaji: 'ya', audio: 'ya', category: 'basic' },
  { character: 'ユ', romaji: 'yu', audio: 'yu', category: 'basic' },
  { character: 'ヨ', romaji: 'yo', audio: 'yo', category: 'basic' },
  
  { character: 'ラ', romaji: 'ra', audio: 'ra', category: 'basic' },
  { character: 'リ', romaji: 'ri', audio: 'ri', category: 'basic' },
  { character: 'ル', romaji: 'ru', audio: 'ru', category: 'basic' },
  { character: 'レ', romaji: 're', audio: 're', category: 'basic' },
  { character: 'ロ', romaji: 'ro', audio: 'ro', category: 'basic' },
  
  { character: 'ワ', romaji: 'wa', audio: 'wa', category: 'basic' },
  { character: 'ヲ', romaji: 'wo', audio: 'wo', category: 'basic' },
  { character: 'ン', romaji: 'n', audio: 'n', category: 'basic' },

  // Dakuten (Voiced sounds)
  { character: 'ガ', romaji: 'ga', audio: 'ga', category: 'dakuten' },
  { character: 'ギ', romaji: 'gi', audio: 'gi', category: 'dakuten' },
  { character: 'グ', romaji: 'gu', audio: 'gu', category: 'dakuten' },
  { character: 'ゲ', romaji: 'ge', audio: 'ge', category: 'dakuten' },
  { character: 'ゴ', romaji: 'go', audio: 'go', category: 'dakuten' },
  
  { character: 'ザ', romaji: 'za', audio: 'za', category: 'dakuten' },
  { character: 'ジ', romaji: 'ji', audio: 'ji', category: 'dakuten' },
  { character: 'ズ', romaji: 'zu', audio: 'zu', category: 'dakuten' },
  { character: 'ゼ', romaji: 'ze', audio: 'ze', category: 'dakuten' },
  { character: 'ゾ', romaji: 'zo', audio: 'zo', category: 'dakuten' },
  
  { character: 'ダ', romaji: 'da', audio: 'da', category: 'dakuten' },
  { character: 'ヂ', romaji: 'ji', audio: 'ji', category: 'dakuten' },
  { character: 'ヅ', romaji: 'zu', audio: 'zu', category: 'dakuten' },
  { character: 'デ', romaji: 'de', audio: 'de', category: 'dakuten' },
  { character: 'ド', romaji: 'do', audio: 'do', category: 'dakuten' },
  
  { character: 'バ', romaji: 'ba', audio: 'ba', category: 'dakuten' },
  { character: 'ビ', romaji: 'bi', audio: 'bi', category: 'dakuten' },
  { character: 'ブ', romaji: 'bu', audio: 'bu', category: 'dakuten' },
  { character: 'ベ', romaji: 'be', audio: 'be', category: 'dakuten' },
  { character: 'ボ', romaji: 'bo', audio: 'bo', category: 'dakuten' },

  // Handakuten (Half-voiced sounds)
  { character: 'パ', romaji: 'pa', audio: 'pa', category: 'handakuten' },
  { character: 'ピ', romaji: 'pi', audio: 'pi', category: 'handakuten' },
  { character: 'プ', romaji: 'pu', audio: 'pu', category: 'handakuten' },
  { character: 'ペ', romaji: 'pe', audio: 'pe', category: 'handakuten' },
  { character: 'ポ', romaji: 'po', audio: 'po', category: 'handakuten' },

  // Yoon (Combined sounds)
  { character: 'キャ', romaji: 'kya', audio: 'kya', category: 'yoon' },
  { character: 'キュ', romaji: 'kyu', audio: 'kyu', category: 'yoon' },
  { character: 'キョ', romaji: 'kyo', audio: 'kyo', category: 'yoon' },
  
  { character: 'シャ', romaji: 'sha', audio: 'sha', category: 'yoon' },
  { character: 'シュ', romaji: 'shu', audio: 'shu', category: 'yoon' },
  { character: 'ショ', romaji: 'sho', audio: 'sho', category: 'yoon' },
  
  { character: 'チャ', romaji: 'cha', audio: 'cha', category: 'yoon' },
  { character: 'チュ', romaji: 'chu', audio: 'chu', category: 'yoon' },
  { character: 'チョ', romaji: 'cho', audio: 'cho', category: 'yoon' },
  
  { character: 'ニャ', romaji: 'nya', audio: 'nya', category: 'yoon' },
  { character: 'ニュ', romaji: 'nyu', audio: 'nyu', category: 'yoon' },
  { character: 'ニョ', romaji: 'nyo', audio: 'nyo', category: 'yoon' },
  
  { character: 'ヒャ', romaji: 'hya', audio: 'hya', category: 'yoon' },
  { character: 'ヒュ', romaji: 'hyu', audio: 'hyu', category: 'yoon' },
  { character: 'ヒョ', romaji: 'hyo', audio: 'hyo', category: 'yoon' },
  
  { character: 'ミャ', romaji: 'mya', audio: 'mya', category: 'yoon' },
  { character: 'ミュ', romaji: 'myu', audio: 'myu', category: 'yoon' },
  { character: 'ミョ', romaji: 'myo', audio: 'myo', category: 'yoon' },
  
  { character: 'リャ', romaji: 'rya', audio: 'rya', category: 'yoon' },
  { character: 'リュ', romaji: 'ryu', audio: 'ryu', category: 'yoon' },
  { character: 'リョ', romaji: 'ryo', audio: 'ryo', category: 'yoon' },
  
  { character: 'ギャ', romaji: 'gya', audio: 'gya', category: 'yoon' },
  { character: 'ギュ', romaji: 'gyu', audio: 'gyu', category: 'yoon' },
  { character: 'ギョ', romaji: 'gyo', audio: 'gyo', category: 'yoon' },
  
  { character: 'ジャ', romaji: 'ja', audio: 'ja', category: 'yoon' },
  { character: 'ジュ', romaji: 'ju', audio: 'ju', category: 'yoon' },
  { character: 'ジョ', romaji: 'jo', audio: 'jo', category: 'yoon' },
  
  { character: 'ビャ', romaji: 'bya', audio: 'bya', category: 'yoon' },
  { character: 'ビュ', romaji: 'byu', audio: 'byu', category: 'yoon' },
  { character: 'ビョ', romaji: 'byo', audio: 'byo', category: 'yoon' },
  
  { character: 'ピャ', romaji: 'pya', audio: 'pya', category: 'yoon' },
  { character: 'ピュ', romaji: 'pyu', audio: 'pyu', category: 'yoon' },
  { character: 'ピョ', romaji: 'pyo', audio: 'pyo', category: 'yoon' },
];

export const getKatakanaByCategory = (category: string): KatakanaCharacter[] => {
  return katakanaData.filter(char => char.category === category);
};

export const getBasicKatakana = (): KatakanaCharacter[] => {
  return getKatakanaByCategory('basic');
};

export const getDakutenKatakana = (): KatakanaCharacter[] => {
  return getKatakanaByCategory('dakuten');
};

export const getHandakutenKatakana = (): KatakanaCharacter[] => {
  return getKatakanaByCategory('handakuten');
};

export const getYoonKatakana = (): KatakanaCharacter[] => {
  return getKatakanaByCategory('yoon');
}; 