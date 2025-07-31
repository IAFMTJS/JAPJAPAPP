import React, { useState } from 'react';
import { useStore, useProgress } from '../../store/useStore';
import { getKatakanaByCategory } from '../../data/katakana';
import { KatakanaCharacter } from '../../types';
import { speakJapanese } from '../../utils/speech';

const KatakanaScreen: React.FC = () => {
  const progress = useProgress();
  const { setCurrentSection, addXP } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [selectedCharacter, setSelectedCharacter] = useState<KatakanaCharacter | null>(null);
  const [showRomaji, setShowRomaji] = useState(false);
  const [showAudio, setShowAudio] = useState(false);

  const categories = [
    { id: 'basic', name: 'Basic', color: 'japanese-blue', count: 46 },
    { id: 'dakuten', name: 'Dakuten', color: 'japanese-green', count: 20 },
    { id: 'handakuten', name: 'Handakuten', color: 'japanese-purple', count: 5 },
    { id: 'yoon', name: 'Yoon', color: 'japanese-gold', count: 33 }
  ];

  const currentCharacters = getKatakanaByCategory(selectedCategory);

  const speakCharacter = (character: KatakanaCharacter) => {
    speakJapanese(character.character);
  };

  const handleCharacterClick = (character: KatakanaCharacter) => {
    setSelectedCharacter(character);
    speakCharacter(character);
    addXP(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedCharacter(null);
  };

  const getProgressPercentage = () => {
    const katakanaProgress = progress.katakana || [];
    const completed = katakanaProgress.filter(k => k.mastered).length;
    const total = 46; // Total katakana characters
    return (completed / total) * 100;
  };

  return (
    <div className="min-h-screen p-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">カタカナ Katakana</h1>
              <p className="text-gray-600 text-lg">Learn katakana characters for foreign words</p>
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
                  const katakanaProgress = progress.katakana || [];
                  const completed = katakanaProgress.filter(k => k.mastered).length;
                  return `${completed} / 46`;
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="gradient-blue h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          {/* Character Grid */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {categories.find(c => c.id === selectedCategory)?.name} Characters
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowRomaji(!showRomaji)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      showRomaji 
                        ? 'gradient-blue text-white' 
                        : 'glass-card hover:scale-105'
                    }`}
                  >
                    {showRomaji ? 'Hide' : 'Show'} Romaji
                  </button>
                  <button
                    onClick={() => setShowAudio(!showAudio)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      showAudio 
                        ? 'gradient-green text-white' 
                        : 'glass-card hover:scale-105'
                    }`}
                  >
                    🔊 Audio
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-8 gap-4">
                {currentCharacters.map((character, index) => (
                  <div
                    key={index}
                    onClick={() => handleCharacterClick(character)}
                    className="glass-card rounded-2xl p-4 text-center cursor-pointer transition-all hover:scale-110 hover:shadow-lg"
                  >
                    <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                      {character.character}
                    </div>
                    {showRomaji && (
                      <div className="text-sm text-gray-600 font-medium">
                        {character.romaji}
                      </div>
                    )}
                    {showAudio && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakCharacter(character);
                        }}
                        className="mt-2 text-lg hover:scale-110 transition-transform"
                      >
                        🔊
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Focus Section */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Focus Practice</h3>
              
              {selectedCharacter ? (
                <div className="text-center">
                  <div className="text-8xl font-bold text-japanese-blue mb-6">
                    {selectedCharacter.character}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="glass-card rounded-2xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Romaji</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {selectedCharacter.romaji}
                      </div>
                    </div>
                    
                    <div className="glass-card rounded-2xl p-4">
                      <div className="text-sm text-gray-600 mb-1">Category</div>
                      <div className="text-lg font-medium text-gray-800 capitalize">
                        {selectedCharacter.category}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => speakCharacter(selectedCharacter)}
                      className="w-full btn-modern text-lg py-4"
                    >
                      🔊 Hear Pronunciation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">👆</div>
                  <p>Click on a character to practice</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card rounded-3xl p-8 mt-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Your Katakana Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => {
              const categoryChars = getKatakanaByCategory(category.id);
              const completed = Math.floor(Math.random() * categoryChars.length); // Placeholder
              const percentage = (completed / categoryChars.length) * 100;
              
              return (
                <div key={category.id} className="text-center">
                  <div className={`text-4xl font-bold text-${category.color} mb-2`}>
                    {completed}/{categoryChars.length}
                  </div>
                  <div className="text-gray-600">{category.name}</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div 
                      className={`bg-${category.color} h-2 rounded-full transition-all duration-500`}
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

export default KatakanaScreen; 