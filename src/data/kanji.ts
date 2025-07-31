import { KanjiCharacter } from '../types';
import { expandedKanjiData, getExpandedKanjiByCategory, getExpandedKanjiByGrade, getExpandedKanjiByStrokeCount, searchExpandedKanji } from './kanji-expanded';
import { additionalKanjiData, getAdditionalKanjiByCategory, getAdditionalKanjiByGrade, getAdditionalKanjiByStrokeCount, searchAdditionalKanji } from './kanji-additional';
import { moreKanjiData, getMoreKanjiByCategory, getMoreKanjiByGrade, getMoreKanjiByStrokeCount, searchMoreKanji } from './kanji-more';
import { finalKanjiData, getFinalKanjiByCategory, getFinalKanjiByGrade, getFinalKanjiByStrokeCount, searchFinalKanji } from './kanji-final';
import { advancedKanjiData, getAdvancedKanjiByCategory, getAdvancedKanjiByGrade, getAdvancedKanjiByStrokeCount, searchAdvancedKanji } from './kanji-advanced';

// Combine all kanji data
export const kanjiData: KanjiCharacter[] = [...expandedKanjiData, ...additionalKanjiData, ...moreKanjiData, ...finalKanjiData, ...advancedKanjiData];

// Helper functions
export const getKanjiByCategory = (category: string): KanjiCharacter[] => {
  const expanded = getExpandedKanjiByCategory(category);
  const additional = getAdditionalKanjiByCategory(category);
  const more = getMoreKanjiByCategory(category);
  const final = getFinalKanjiByCategory(category);
  const advanced = getAdvancedKanjiByCategory(category);
  return [...expanded, ...additional, ...more, ...final, ...advanced];
};

export const getKanjiByGrade = (grade: number): KanjiCharacter[] => {
  const expanded = getExpandedKanjiByGrade(grade);
  const additional = getAdditionalKanjiByGrade(grade);
  const more = getMoreKanjiByGrade(grade);
  const final = getFinalKanjiByGrade(grade);
  const advanced = getAdvancedKanjiByGrade(grade);
  return [...expanded, ...additional, ...more, ...final, ...advanced];
};

export const getKanjiByStrokeCount = (strokes: number): KanjiCharacter[] => {
  const expanded = getExpandedKanjiByStrokeCount(strokes);
  const additional = getAdditionalKanjiByStrokeCount(strokes);
  const more = getMoreKanjiByStrokeCount(strokes);
  const final = getFinalKanjiByStrokeCount(strokes);
  const advanced = getAdvancedKanjiByStrokeCount(strokes);
  return [...expanded, ...additional, ...more, ...final, ...advanced];
};

export const searchKanji = (query: string): KanjiCharacter[] => {
  const expanded = searchExpandedKanji(query);
  const additional = searchAdditionalKanji(query);
  const more = searchMoreKanji(query);
  const final = searchFinalKanji(query);
  const advanced = searchAdvancedKanji(query);
  return [...expanded, ...additional, ...more, ...final, ...advanced];
}; 