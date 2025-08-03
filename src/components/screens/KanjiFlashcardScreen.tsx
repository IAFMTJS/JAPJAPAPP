import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { basicKanjiData, getAllKanjiData } from '../../data';
import { KanjiCharacter } from '../../types';
import { speakJapanese } from '../../utils/speech';

const KanjiFlashcardScreen: React.FC = () => {
  const { setCurrentSection, addXP } = useStore();
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyMode, setStudyMode] = useState<'all' | 'category' | 'grade'>('all');
  const [selectedCategory, setSelectedCategory] = useState('numbers');
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [allKanjiData, setAllKanjiData] = useState<KanjiCharacter[]>(basicKanjiData);
  const [filteredKanji, setFilteredKanji] = useState<KanjiCharacter[]>(basicKanjiData);
  // const [isLoading, setIsLoading] = useState(false);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    total: 0,
    streak: 0,
  });

  // Helper functions for filtering kanji
  const getKanjiByCategory = useCallback((category: string): KanjiCharacter[] => {
    return allKanjiData.filter(kanji => kanji.category === category);
  }, [allKanjiData]);

  const getKanjiByGrade = useCallback((grade: number): KanjiCharacter[] => {
    return allKanjiData.filter(kanji => kanji.grade === grade);
  }, [allKanjiData]);

  const updateFilteredKanji = useCallback(() => {
    let filtered: KanjiCharacter[];
    switch (studyMode) {
      case 'category':
        filtered = getKanjiByCategory(selectedCategory);
        break;
      case 'grade':
        filtered = getKanjiByGrade(selectedGrade);
        break;
      default:
        filtered = allKanjiData;
    }
    setFilteredKanji(filtered);
    setCurrentKanjiIndex(0);
    setShowAnswer(false);
  }, [studyMode, selectedCategory, selectedGrade, allKanjiData, getKanjiByCategory, getKanjiByGrade]);

  // Load full kanji data when component mounts
  useEffect(() => {
    const loadFullData = async () => {
      if (allKanjiData.length === basicKanjiData.length) {
        // setIsLoading(true);
        try {
          const fullData = await getAllKanjiData();
          setAllKanjiData(fullData);
        } catch (error) {
          console.error('Failed to load full kanji data:', error);
        } finally {
          // setIsLoading(false);
        }
      }
    };

    loadFullData();
  }, [allKanjiData.length]);

  useEffect(() => {
    updateFilteredKanji();
  }, [updateFilteredKanji]);

  const currentKanji = filteredKanji[currentKanjiIndex];

  const nextKanji = () => {
    if (currentKanjiIndex < filteredKanji.length - 1) {
      setCurrentKanjiIndex(currentKanjiIndex + 1);
      setShowAnswer(false);
    }
  };

  const previousKanji = () => {
    if (currentKanjiIndex > 0) {
      setCurrentKanjiIndex(currentKanjiIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  const markAsCorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      correct: prev.correct + 1,
      total: prev.total + 1,
      streak: prev.streak + 1,
    }));
    addXP(5);
    nextKanji();
  };

  const markAsIncorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      total: prev.total + 1,
      streak: 0,
    }));
    nextKanji();
  };

  const speakKanji = () => {
    if (currentKanji) {
      speakJapanese(currentKanji.onyomi);
    }
  };

  const speakMeaning = () => {
    if (currentKanji) {
      speakJapanese(currentKanji.meaning);
    }
  };

  const resetStudy = () => {
    setCurrentKanjiIndex(0);
    setShowAnswer(false);
    setStudyStats({
      correct: 0,
      total: 0,
      streak: 0,
    });
  };

  if (!currentKanji) {
    return (
      <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
          <div className="absolute top-10 left-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">No Kanji Found</h1>
            <p className="text-gray-600 mb-8">No kanji match your current filter settings.</p>
            <button
              onClick={() => setStudyMode('all')}
              className="btn-modern px-6 py-3"
            >
              Study All Kanji
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentSection('home')}
                className="glass-card p-3 rounded-full hover:scale-110 transition-transform"
                title="Back to Home (or press Backspace)"
              >
                ←
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Kanji Flashcards</h1>
                <p className="text-sm text-gray-500 mt-1">Press Backspace to go back</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm sm:text-base">
              <span className="text-green-600">✓ {studyStats.correct}</span>
              <span className="text-gray-600">/ {studyStats.total}</span>
              <span className="text-blue-600">🔥 {studyStats.streak}</span>
            </div>
          </div>
        </div>

        {/* Study Mode Selector */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Study Mode</label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value as any)}
                className="w-full p-3 border rounded-lg bg-white bg-opacity-80"
              >
                <option value="all">All Kanji</option>
                <option value="category">By Category</option>
                <option value="grade">By Grade</option>
              </select>
            </div>
            
            {studyMode === 'category' && (
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-white bg-opacity-80"
                >
                  <option value="numbers">Numbers</option>
                  <option value="nature">Nature</option>
                  <option value="family">Family</option>
                  <option value="body">Body</option>
                  <option value="time">Time</option>
                  <option value="colors">Colors</option>
                  <option value="directions">Directions</option>
                </select>
              </div>
            )}
            
            {studyMode === 'grade' && (
              <div>
                <label className="block text-sm font-medium mb-2">Grade</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg bg-white bg-opacity-80"
                >
                  <option value={1}>Grade 1</option>
                  <option value={2}>Grade 2</option>
                  <option value={3}>Grade 3</option>
                  <option value={4}>Grade 4</option>
                  <option value={5}>Grade 5</option>
                  <option value={6}>Grade 6</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Flashcard */}
        <div className="glass-card rounded-3xl p-6 mb-6">
          <div className="text-center mb-6">
            <div className="text-sm text-gray-600 mb-2">
              {currentKanjiIndex + 1} of {filteredKanji.length} • Grade {currentKanji.grade} • {currentKanji.strokes} strokes
            </div>
            <div className="text-8xl sm:text-9xl mb-6 font-bold text-gray-800">
              {currentKanji.character}
            </div>
            
            {showAnswer && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="glass-card rounded-2xl p-4">
                    <h3 className="font-bold text-gray-800 mb-2">Meaning</h3>
                    <p className="text-lg">{currentKanji.meaning}</p>
                    <button
                      onClick={speakMeaning}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      🔊 Speak
                    </button>
                  </div>
                  <div className="glass-card rounded-2xl p-4">
                    <h3 className="font-bold text-gray-800 mb-2">Readings</h3>
                    <div className="space-y-1">
                      <p><span className="font-medium">On'yomi:</span> {currentKanji.onyomi}</p>
                      <p><span className="font-medium">Kun'yomi:</span> {currentKanji.kunyomi}</p>
                    </div>
                    <button
                      onClick={speakKanji}
                      className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                      🔊 Speak
                    </button>
                  </div>
                </div>
                
                <div className="glass-card rounded-2xl p-4">
                  <h3 className="font-bold text-gray-800 mb-2">Examples</h3>
                  <div className="space-y-2">
                    {currentKanji.examples.map((example, index) => (
                      <p key={index} className="text-sm">{example}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={previousKanji}
              disabled={currentKanjiIndex === 0}
              className="glass-card p-3 rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ←
            </button>
            <button
              onClick={toggleAnswer}
              className="btn-modern px-8 py-3"
            >
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
            <button
              onClick={nextKanji}
              disabled={currentKanjiIndex === filteredKanji.length - 1}
              className="glass-card p-3 rounded-full hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              →
            </button>
          </div>

          {/* Study Actions */}
          {showAnswer && (
            <div className="flex justify-center space-x-4">
              <button
                onClick={markAsIncorrect}
                className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors"
              >
                ❌ Incorrect
              </button>
              <button
                onClick={markAsCorrect}
                className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors"
              >
                ✅ Correct
              </button>
            </div>
          )}
        </div>

        {/* Progress and Reset */}
        <div className="glass-card rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-gray-600">Progress: {Math.round((currentKanjiIndex / filteredKanji.length) * 100)}%</p>
              <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentKanjiIndex / filteredKanji.length) * 100}%` }}
                ></div>
              </div>
            </div>
            <button
              onClick={resetStudy}
              className="glass-card px-6 py-3 rounded-full hover:scale-105 transition-transform"
            >
              🔄 Reset Study
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanjiFlashcardScreen; 