import { KanjiCharacter } from '../types';

// Import smaller data files directly (they're fast to load)
export { hiraganaData } from './hiragana';
export { katakanaData } from './katakana';
export { kanjiData as basicKanjiData } from './kanji';

// Lazy load functions for large kanji data files
export const getAdvancedKanjiData = (): Promise<KanjiCharacter[]> => {
  return import('./kanji-advanced').then(module => module.advancedKanjiData);
};

export const getExpandedKanjiData = (): Promise<KanjiCharacter[]> => {
  return import('./kanji-expanded').then(module => module.expandedKanjiData);
};

export const getFinalKanjiData = (): Promise<KanjiCharacter[]> => {
  return import('./kanji-final').then(module => module.finalKanjiData);
};

export const getAdditionalKanjiData = (): Promise<KanjiCharacter[]> => {
  return import('./kanji-additional').then(module => module.additionalKanjiData);
};

export const getMoreKanjiData = (): Promise<KanjiCharacter[]> => {
  return import('./kanji-more').then(module => module.moreKanjiData);
};

// Helper function to get all kanji data when needed
export const getAllKanjiData = async (): Promise<KanjiCharacter[]> => {
  // Import the basic kanji data
  const { kanjiData } = await import('./kanji');
  
  const [
    basic,
    advanced,
    expanded,
    final,
    additional,
    more
  ] = await Promise.all([
    Promise.resolve(kanjiData),
    getAdvancedKanjiData(),
    getExpandedKanjiData(),
    getFinalKanjiData(),
    getAdditionalKanjiData(),
    getMoreKanjiData()
  ]);

  return [
    ...basic,
    ...advanced,
    ...expanded,
    ...final,
    ...additional,
    ...more
  ];
}; 