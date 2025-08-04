import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { hiraganaData, getHiraganaByCategory } from '../../data/hiragana';
import { speakJapanese } from '../../utils/speech';

const HiraganaScreen: React.FC = () => {
  const { t, ready } = useTranslation();
  const { setCurrentSection, setMascotAnimation, addXP, updateProgress } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<'basic' | 'dakuten' | 'handakuten' | 'yoon'>('basic');
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  // Don't render until i18n is ready
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentCharacters = getHiraganaByCategory(selectedCategory);
  const currentCharacter = currentCharacters[currentCharacterIndex];

  const handleCharacterClick = (character: string) => {
    setMascotAnimation('happy');
    addXP(5);
    updateProgress('hiragana', character, true);
  };

  const playAudio = (text: string) => {
    speakJapanese(text);
  };

  const categories = [
    { id: 'basic', name: t('hiragana.categories.basic', 'Basic'), count: 46, color: 'japanese-red' },
    { id: 'dakuten', name: t('hiragana.categories.dakuten', 'Dakuten'), count: 20, color: 'japanese-blue' },
    { id: 'handakuten', name: t('hiragana.categories.handakuten', 'Handakuten'), count: 5, color: 'japanese-green' },
    { id: 'yoon', name: t('hiragana.categories.yoon', 'Yoon'), count: 33, color: 'japanese-purple' },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-japanese-red mb-2">{t('hiragana.title', 'Hiragana Learning')}</h1>
              <p className="text-gray-600">{t('hiragana.description', 'Master the basic Japanese syllabary')}</p>
            </div>
                          <button
                onClick={() => setCurrentSection('home')}
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded-full transition-colors"
              >
                ← {t('app.back', 'Back')}
              </button>
          </div>
        </div>

        {/* Category Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id as any);
                setCurrentCharacterIndex(0);
              }}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedCategory === category.id
                  ? `bg-${category.color} text-white shadow-lg`
                  : 'bg-white hover:bg-gray-50 shadow-md'
              }`}
            >
              <div className="text-2xl font-bold mb-1">{category.name}</div>
                              <div className="text-sm opacity-75">{category.count} {t('hiragana.characters', 'chars')}</div>
            </button>
          ))}
        </div>

        {/* Exercise Mode Toggle */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
                          <h2 className="text-2xl font-bold">
                {categories.find(c => c.id === selectedCategory)?.name} {t('hiragana.title', 'Hiragana')}
              </h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowRomaji(!showRomaji)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  showRomaji 
                    ? 'bg-japanese-red text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {showRomaji ? t('app.hide', 'Hide') : t('app.show', 'Show')} {t('hiragana.romaji', 'Romaji')}
              </button>
              <button
                onClick={() => setShowAudio(!showAudio)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  showAudio 
                    ? 'bg-japanese-red text-white' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                🔊 Audio
              </button>
              <button
                onClick={() => setCurrentSection('quiz')}
                className="px-4 py-2 bg-japanese-red text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors"
              >
                🧠 {t('hiragana.practiceQuiz', 'Practice Quiz')}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {currentCharacters.map((char, index) => (
              <button
                key={char.character}
                onClick={() => handleCharacterClick(char.character)}
                className="aspect-square bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex flex-col items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 border-transparent hover:border-japanese-red relative"
              >
                <div className="text-3xl md:text-4xl font-bold text-japanese-red mb-1">
                  {char.character}
                </div>
                {showRomaji && (
                  <div className="text-xs text-gray-600">{char.romaji}</div>
                )}
                {showAudio && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playAudio(char.character);
                    }}
                    className="absolute top-1 right-1 text-lg hover:scale-110 transition-transform"
                  >
                    🔊
                  </button>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Practice Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-4">Quick Practice</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setCurrentSection('quiz')}
              className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">🃏</div>
              <div className="font-bold text-japanese-red">Flashcards</div>
              <div className="text-sm text-gray-600">Learn with visual cards</div>
            </button>
            <button
              onClick={() => setCurrentSection('quiz')}
              className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">☑️</div>
              <div className="font-bold text-japanese-red">Multiple Choice</div>
              <div className="text-sm text-gray-600">Choose the correct answer</div>
            </button>
            <button
              onClick={() => setCurrentSection('quiz')}
              className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl text-center hover:shadow-lg transition-all"
            >
              <div className="text-2xl mb-2">🔊</div>
              <div className="font-bold text-japanese-red">Sound Matching</div>
              <div className="text-sm text-gray-600">Match audio to characters</div>
            </button>
          </div>
        </div>

        {/* Current Character Focus */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h3 className="text-xl font-bold mb-6 text-center">Practice Current Character</h3>
          
          <div className="text-center mb-6">
            <div className="text-8xl font-bold text-japanese-red mb-4">
              {currentCharacter?.character}
            </div>
            
            {showRomaji && (
              <div className="text-2xl text-gray-600 mb-4">
                {currentCharacter?.romaji}
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowRomaji(!showRomaji)}
                className="bg-blue-100 text-japanese-blue px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
              >
                {showRomaji ? 'Hide' : 'Show'} Romaji
              </button>
              
              <button
                onClick={() => playAudio(currentCharacter?.character || '')}
                className="bg-green-100 text-japanese-green px-4 py-2 rounded-lg hover:bg-green-200 transition-colors"
              >
                🔊 Play Audio
              </button>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setCurrentCharacterIndex(Math.max(0, currentCharacterIndex - 1))}
              disabled={currentCharacterIndex === 0}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              ← Previous
            </button>
            
            <span className="px-4 py-2 text-gray-600">
              {currentCharacterIndex + 1} / {currentCharacters.length}
            </span>
            
            <button
              onClick={() => setCurrentCharacterIndex(Math.min(currentCharacters.length - 1, currentCharacterIndex + 1))}
              disabled={currentCharacterIndex === currentCharacters.length - 1}
              className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4">Your Hiragana Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-japanese-red">
                {hiraganaData.length}
              </div>
              <div className="text-sm text-gray-600">Total Characters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-japanese-blue">0</div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-japanese-green">0%</div>
              <div className="text-sm text-gray-600">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-japanese-purple">0</div>
              <div className="text-sm text-gray-600">Practice Sessions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HiraganaScreen; 