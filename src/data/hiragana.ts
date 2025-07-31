import { HiraganaCharacter } from '../types';

export const hiraganaData: HiraganaCharacter[] = [
  // Basic Hiragana (46 characters)
  { character: 'あ', romaji: 'a', audio: 'a', category: 'basic' },
  { character: 'い', romaji: 'i', audio: 'i', category: 'basic' },
  { character: 'う', romaji: 'u', audio: 'u', category: 'basic' },
  { character: 'え', romaji: 'e', audio: 'e', category: 'basic' },
  { character: 'お', romaji: 'o', audio: 'o', category: 'basic' },
  
  { character: 'か', romaji: 'ka', audio: 'ka', category: 'basic' },
  { character: 'き', romaji: 'ki', audio: 'ki', category: 'basic' },
  { character: 'く', romaji: 'ku', audio: 'ku', category: 'basic' },
  { character: 'け', romaji: 'ke', audio: 'ke', category: 'basic' },
  { character: 'こ', romaji: 'ko', audio: 'ko', category: 'basic' },
  
  { character: 'さ', romaji: 'sa', audio: 'sa', category: 'basic' },
  { character: 'し', romaji: 'shi', audio: 'shi', category: 'basic' },
  { character: 'す', romaji: 'su', audio: 'su', category: 'basic' },
  { character: 'せ', romaji: 'se', audio: 'se', category: 'basic' },
  { character: 'そ', romaji: 'so', audio: 'so', category: 'basic' },
  
  { character: 'た', romaji: 'ta', audio: 'ta', category: 'basic' },
  { character: 'ち', romaji: 'chi', audio: 'chi', category: 'basic' },
  { character: 'つ', romaji: 'tsu', audio: 'tsu', category: 'basic' },
  { character: 'て', romaji: 'te', audio: 'te', category: 'basic' },
  { character: 'と', romaji: 'to', audio: 'to', category: 'basic' },
  
  { character: 'な', romaji: 'na', audio: 'na', category: 'basic' },
  { character: 'に', romaji: 'ni', audio: 'ni', category: 'basic' },
  { character: 'ぬ', romaji: 'nu', audio: 'nu', category: 'basic' },
  { character: 'ね', romaji: 'ne', audio: 'ne', category: 'basic' },
  { character: 'の', romaji: 'no', audio: 'no', category: 'basic' },
  
  { character: 'は', romaji: 'ha', audio: 'ha', category: 'basic' },
  { character: 'ひ', romaji: 'hi', audio: 'hi', category: 'basic' },
  { character: 'ふ', romaji: 'fu', audio: 'fu', category: 'basic' },
  { character: 'へ', romaji: 'he', audio: 'he', category: 'basic' },
  { character: 'ほ', romaji: 'ho', audio: 'ho', category: 'basic' },
  
  { character: 'ま', romaji: 'ma', audio: 'ma', category: 'basic' },
  { character: 'み', romaji: 'mi', audio: 'mi', category: 'basic' },
  { character: 'む', romaji: 'mu', audio: 'mu', category: 'basic' },
  { character: 'め', romaji: 'me', audio: 'me', category: 'basic' },
  { character: 'も', romaji: 'mo', audio: 'mo', category: 'basic' },
  
  { character: 'や', romaji: 'ya', audio: 'ya', category: 'basic' },
  { character: 'ゆ', romaji: 'yu', audio: 'yu', category: 'basic' },
  { character: 'よ', romaji: 'yo', audio: 'yo', category: 'basic' },
  
  { character: 'ら', romaji: 'ra', audio: 'ra', category: 'basic' },
  { character: 'り', romaji: 'ri', audio: 'ri', category: 'basic' },
  { character: 'る', romaji: 'ru', audio: 'ru', category: 'basic' },
  { character: 'れ', romaji: 're', audio: 're', category: 'basic' },
  { character: 'ろ', romaji: 'ro', audio: 'ro', category: 'basic' },
  
  { character: 'わ', romaji: 'wa', audio: 'wa', category: 'basic' },
  { character: 'を', romaji: 'wo', audio: 'wo', category: 'basic' },
  { character: 'ん', romaji: 'n', audio: 'n', category: 'basic' },
  
  // Dakuten (濁点) - Voiced sounds
  { character: 'が', romaji: 'ga', audio: 'ga', category: 'dakuten' },
  { character: 'ぎ', romaji: 'gi', audio: 'gi', category: 'dakuten' },
  { character: 'ぐ', romaji: 'gu', audio: 'gu', category: 'dakuten' },
  { character: 'げ', romaji: 'ge', audio: 'ge', category: 'dakuten' },
  { character: 'ご', romaji: 'go', audio: 'go', category: 'dakuten' },
  
  { character: 'ざ', romaji: 'za', audio: 'za', category: 'dakuten' },
  { character: 'じ', romaji: 'ji', audio: 'ji', category: 'dakuten' },
  { character: 'ず', romaji: 'zu', audio: 'zu', category: 'dakuten' },
  { character: 'ぜ', romaji: 'ze', audio: 'ze', category: 'dakuten' },
  { character: 'ぞ', romaji: 'zo', audio: 'zo', category: 'dakuten' },
  
  { character: 'だ', romaji: 'da', audio: 'da', category: 'dakuten' },
  { character: 'ぢ', romaji: 'ji', audio: 'ji', category: 'dakuten' },
  { character: 'づ', romaji: 'zu', audio: 'zu', category: 'dakuten' },
  { character: 'で', romaji: 'de', audio: 'de', category: 'dakuten' },
  { character: 'ど', romaji: 'do', audio: 'do', category: 'dakuten' },
  
  { character: 'ば', romaji: 'ba', audio: 'ba', category: 'dakuten' },
  { character: 'び', romaji: 'bi', audio: 'bi', category: 'dakuten' },
  { character: 'ぶ', romaji: 'bu', audio: 'bu', category: 'dakuten' },
  { character: 'べ', romaji: 'be', audio: 'be', category: 'dakuten' },
  { character: 'ぼ', romaji: 'bo', audio: 'bo', category: 'dakuten' },
  
  // Handakuten (半濁点) - Semi-voiced sounds
  { character: 'ぱ', romaji: 'pa', audio: 'pa', category: 'handakuten' },
  { character: 'ぴ', romaji: 'pi', audio: 'pi', category: 'handakuten' },
  { character: 'ぷ', romaji: 'pu', audio: 'pu', category: 'handakuten' },
  { character: 'ぺ', romaji: 'pe', audio: 'pe', category: 'handakuten' },
  { character: 'ぽ', romaji: 'po', audio: 'po', category: 'handakuten' },
  
  // Yoon (拗音) - Contracted sounds
  { character: 'きゃ', romaji: 'kya', audio: 'kya', category: 'yoon' },
  { character: 'きゅ', romaji: 'kyu', audio: 'kyu', category: 'yoon' },
  { character: 'きょ', romaji: 'kyo', audio: 'kyo', category: 'yoon' },
  
  { character: 'しゃ', romaji: 'sha', audio: 'sha', category: 'yoon' },
  { character: 'しゅ', romaji: 'shu', audio: 'shu', category: 'yoon' },
  { character: 'しょ', romaji: 'sho', audio: 'sho', category: 'yoon' },
  
  { character: 'ちゃ', romaji: 'cha', audio: 'cha', category: 'yoon' },
  { character: 'ちゅ', romaji: 'chu', audio: 'chu', category: 'yoon' },
  { character: 'ちょ', romaji: 'cho', audio: 'cho', category: 'yoon' },
  
  { character: 'にゃ', romaji: 'nya', audio: 'nya', category: 'yoon' },
  { character: 'にゅ', romaji: 'nyu', audio: 'nyu', category: 'yoon' },
  { character: 'にょ', romaji: 'nyo', audio: 'nyo', category: 'yoon' },
  
  { character: 'ひゃ', romaji: 'hya', audio: 'hya', category: 'yoon' },
  { character: 'ひゅ', romaji: 'hyu', audio: 'hyu', category: 'yoon' },
  { character: 'ひょ', romaji: 'hyo', audio: 'hyo', category: 'yoon' },
  
  { character: 'みゃ', romaji: 'mya', audio: 'mya', category: 'yoon' },
  { character: 'みゅ', romaji: 'myu', audio: 'myu', category: 'yoon' },
  { character: 'みょ', romaji: 'myo', audio: 'myo', category: 'yoon' },
  
  { character: 'りゃ', romaji: 'rya', audio: 'rya', category: 'yoon' },
  { character: 'りゅ', romaji: 'ryu', audio: 'ryu', category: 'yoon' },
  { character: 'りょ', romaji: 'ryo', audio: 'ryo', category: 'yoon' },
  
  { character: 'ぎゃ', romaji: 'gya', audio: 'gya', category: 'yoon' },
  { character: 'ぎゅ', romaji: 'gyu', audio: 'gyu', category: 'yoon' },
  { character: 'ぎょ', romaji: 'gyo', audio: 'gyo', category: 'yoon' },
  
  { character: 'じゃ', romaji: 'ja', audio: 'ja', category: 'yoon' },
  { character: 'じゅ', romaji: 'ju', audio: 'ju', category: 'yoon' },
  { character: 'じょ', romaji: 'jo', audio: 'jo', category: 'yoon' },
  
  { character: 'びゃ', romaji: 'bya', audio: 'bya', category: 'yoon' },
  { character: 'びゅ', romaji: 'byu', audio: 'byu', category: 'yoon' },
  { character: 'びょ', romaji: 'byo', audio: 'byo', category: 'yoon' },
  
  { character: 'ぴゃ', romaji: 'pya', audio: 'pya', category: 'yoon' },
  { character: 'ぴゅ', romaji: 'pyu', audio: 'pyu', category: 'yoon' },
  { character: 'ぴょ', romaji: 'pyo', audio: 'pyo', category: 'yoon' },
];

export const getHiraganaByCategory = (category: 'basic' | 'dakuten' | 'handakuten' | 'yoon') => {
  return hiraganaData.filter(char => char.category === category);
};

export const getBasicHiragana = () => getHiraganaByCategory('basic');
export const getDakutenHiragana = () => getHiraganaByCategory('dakuten');
export const getHandakutenHiragana = () => getHiraganaByCategory('handakuten');
export const getYoonHiragana = () => getHiraganaByCategory('yoon'); 