import React, { useState, useEffect } from 'react';
import { useStore, useProgress } from '../../store/useStore';
import { basicKanjiData, getAllKanjiData } from '../../data';
import { KanjiCharacter } from '../../types';
import { speakJapanese } from '../../utils/speech';

const KanjiScreen: React.FC = () => {
  const progress = useProgress();
  const { setCurrentSection, addXP } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('numbers');
  const [selectedGrade, setSelectedGrade] = useState(1);
  const [selectedKanji, setSelectedKanji] = useState<KanjiCharacter | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStroke, setCurrentStroke] = useState(0);
  const [allKanjiData, setAllKanjiData] = useState<KanjiCharacter[]>(basicKanjiData);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'numbers', name: 'Numbers', color: 'japanese-red', count: 5 },
    { id: 'nature', name: 'Nature', color: 'japanese-green', count: 5 },
    { id: 'people', name: 'People', color: 'japanese-blue', count: 5 },
    { id: 'body', name: 'Body', color: 'japanese-purple', count: 5 },
    { id: 'food', name: 'Food', color: 'japanese-gold', count: 5 },
    { id: 'time', name: 'Time', color: 'japanese-red', count: 5 },
    { id: 'colors', name: 'Colors', color: 'japanese-green', count: 5 },
    { id: 'school', name: 'School', color: 'japanese-blue', count: 5 },
    { id: 'family', name: 'Family', color: 'japanese-purple', count: 5 },
    { id: 'animals', name: 'Animals', color: 'japanese-gold', count: 5 },
    { id: 'transportation', name: 'Transport', color: 'japanese-red', count: 5 },
    { id: 'buildings', name: 'Buildings', color: 'japanese-green', count: 5 }
  ];

  const grades = [1, 2, 3];

  // Helper functions for filtering kanji
  const getKanjiByCategory = (category: string): KanjiCharacter[] => {
    return allKanjiData.filter(kanji => kanji.category === category);
  };

  const getKanjiByGrade = (grade: number): KanjiCharacter[] => {
    return allKanjiData.filter(kanji => kanji.grade === grade);
  };

  const searchKanji = (query: string): KanjiCharacter[] => {
    const lowercaseQuery = query.toLowerCase();
    return allKanjiData.filter(kanji => 
      kanji.character.includes(query) ||
      kanji.meaning.toLowerCase().includes(lowercaseQuery) ||
      kanji.onyomi.includes(query) ||
      kanji.kunyomi.includes(query)
    );
  };

  const currentKanji = searchQuery 
    ? searchKanji(searchQuery)
    : getKanjiByCategory(selectedCategory);

  const speakKanji = (kanji: KanjiCharacter) => {
    speakJapanese(kanji.character);
  };

  const handleKanjiClick = (kanji: KanjiCharacter) => {
    setSelectedKanji(kanji);
    setCurrentStroke(0);
    speakKanji(kanji);
    addXP(2);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedKanji(null);
    setSearchQuery('');
  };

  const handleGradeChange = (grade: number) => {
    setSelectedGrade(grade);
    setSelectedKanji(null);
    setSearchQuery('');
  };

  const nextStroke = () => {
    if (selectedKanji && currentStroke < selectedKanji.strokes) {
      setCurrentStroke(currentStroke + 1);
    }
  };

  const resetStrokes = () => {
    setCurrentStroke(0);
  };

  const getProgressPercentage = () => {
    const kanjiProgress = progress.kanji || [];
    const completed = kanjiProgress.filter(k => k.mastered).length;
    const total = 300; // Total kanji to learn
    return (completed / total) * 100;
  };

  // Load full kanji data when component mounts
  useEffect(() => {
    const loadFullData = async () => {
      if (allKanjiData.length === basicKanjiData.length) {
        setIsLoading(true);
        try {
          const fullData = await getAllKanjiData();
          setAllKanjiData(fullData);
        } catch (error) {
          console.error('Failed to load full kanji data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadFullData();
  }, [allKanjiData.length]);

  return (
    <div className="min-h-screen p-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="absolute top-10 left-10 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">漢字 Kanji</h1>
              <p className="text-gray-600 text-lg">Master Chinese characters with stroke order</p>
            </div>
            <button
              onClick={() => setCurrentSection('home')}
              className="glass-card p-3 rounded-full hover:scale-110 transition-transform"
            >
              🏠
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {(() => {
                  const kanjiProgress = progress.kanji || [];
                  const completed = kanjiProgress.filter(k => k.mastered).length;
                  return `${completed} / 300`;
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="gradient-green h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search kanji by character, meaning, or reading..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-modern w-full text-lg"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-4 mb-6">
            {/* Grade Filter */}
            <div className="flex space-x-2">
              {grades.map((grade) => (
                <button
                  key={grade}
                  onClick={() => handleGradeChange(grade)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedGrade === grade 
                      ? 'gradient-green text-white' 
                      : 'glass-card hover:scale-105'
                  }`}
                >
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`glass-card rounded-2xl p-4 text-center transition-all ${
                  selectedCategory === category.id 
                    ? `ring-4 ring-${category.color} scale-105` 
                    : 'hover:scale-105'
                }`}
              >
                <div className={`text-2xl font-bold text-${category.color} mb-2`}>
                  {category.count}
                </div>
                <div className="text-sm font-medium text-gray-700">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kanji Grid */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchQuery ? 'Search Results' : categories.find(c => c.id === selectedCategory)?.name} Kanji
                </h2>
                <div className="text-sm text-gray-600">
                  {currentKanji.length} characters
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentKanji.map((kanji, index) => (
                  <div
                    key={index}
                    onClick={() => handleKanjiClick(kanji)}
                    className="glass-card rounded-2xl p-4 text-center cursor-pointer transition-all hover:scale-110 hover:shadow-lg"
                  >
                    <div className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                      {kanji.character}
                    </div>
                    <div className="text-sm text-gray-600 font-medium mb-1">
                      {kanji.meaning}
                    </div>
                    <div className="text-xs text-gray-500">
                      {kanji.strokes} strokes • Grade {kanji.grade}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Focus Section */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Focus Practice</h3>
              
              {selectedKanji ? (
                <div className="text-center">
                  <div className="text-8xl font-bold text-japanese-green mb-6">
                    {selectedKanji.character}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="glass-card rounded-2xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Meaning</div>
                      <div className="text-xl font-bold text-gray-800">
                        {selectedKanji.meaning}
                      </div>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Readings</div>
                      <div className="text-lg font-medium text-gray-800">
                        <div>音読み: {selectedKanji.onyomi}</div>
                        <div>訓読み: {selectedKanji.kunyomi}</div>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Stroke Order</div>
                                              <div className="text-2xl font-bold text-gray-800 mb-2">
                          {currentStroke} / {selectedKanji.strokes}
                        </div>
                      <div className="flex justify-center space-x-2 mb-4">
                        <button
                          onClick={resetStrokes}
                          className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                        >
                          Reset
                        </button>
                        <button
                          onClick={nextStroke}
                          disabled={currentStroke >= selectedKanji.strokes}
                          className="px-3 py-1 bg-japanese-green text-white rounded text-sm hover:bg-japanese-green-dark disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-japanese-green h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(currentStroke / selectedKanji.strokes) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4">
                      <div className="text-sm text-gray-600 mb-2">Examples</div>
                      <div className="text-sm text-gray-800 space-y-1">
                        {selectedKanji.examples.map((example, index) => (
                          <div key={index} className="text-left">
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => speakKanji(selectedKanji)}
                      className="w-full btn-modern text-lg py-4"
                    >
                      🔊 Hear Pronunciation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">👆</div>
                  <p>Click on a kanji to practice</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card rounded-3xl p-8 mt-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Kanji Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {grades.map((grade) => {
              const gradeKanji = getKanjiByGrade(grade);
              const completed = Math.floor(Math.random() * gradeKanji.length); // Placeholder
              const percentage = (completed / gradeKanji.length) * 100;
              
              return (
                <div key={grade} className="text-center">
                  <div className="text-4xl font-bold text-japanese-green mb-2">
                    {completed}/{gradeKanji.length}
                  </div>
                  <div className="text-gray-600">Grade {grade}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className="bg-japanese-green h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KanjiScreen; 