import React, { useState, useEffect } from 'react';
import { useStore, useUser } from '../../store/useStore';
import VoiceDebugger from '../ui/VoiceDebugger';

const HomeScreen: React.FC = () => {
  const user = useUser();
  const { setCurrentSection, setMascotAnimation, addXP, incrementStreak } = useStore();
  const [showIntro, setShowIntro] = useState(true);
  const [showVoiceDebugger, setShowVoiceDebugger] = useState(false);

  useEffect(() => {
    // Auto-switch mascots every 3 seconds
    const interval = setInterval(() => {
      // setLocalMascotAnimation(prev => prev === 'maneki-neko' ? 'penguin' : 'maneki-neko');
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStartLearning = () => {
    setMascotAnimation('celebration');
    addXP(10);
    incrementStreak();
    setCurrentSection('hiragana');
  };

  const handleSectionClick = (section: string) => {
    setMascotAnimation('happy');
    setCurrentSection(section as any);
  };

  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
          <div className="absolute top-20 left-20 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
          {/* Intro Animation */}
          <div className="mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row justify-center space-y-8 sm:space-y-0 sm:space-x-8 lg:space-x-12 mb-8 sm:mb-12">
              {/* Maneki Neko Mascot */}
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 glass-card rounded-full flex items-center justify-center mb-4 sm:mb-6 float">
                  <span className="text-4xl sm:text-6xl lg:text-8xl mascot-bounce">🐱</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gradient mb-2">Maneki Neko</h3>
                <p className="text-gray-600 text-sm sm:text-base">Your lucky learning companion</p>
              </div>
              
              {/* Penguin in Kimono Mascot */}
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 glass-card rounded-full flex items-center justify-center mb-4 sm:mb-6 float" style={{ animationDelay: '1s' }}>
                  <span className="text-4xl sm:text-6xl lg:text-8xl mascot-bounce">🐧</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gradient mb-2">Penguin Sensei</h3>
                <p className="text-gray-600 text-sm sm:text-base">Your wise teacher</p>
              </div>
            </div>
          </div>

          {/* Welcome Message */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 sm:mb-8 text-gradient">
              ようこそ！Welcome to JapJap!
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Your comprehensive Japanese learning journey starts here. 
              Learn hiragana, katakana, kanji, and grammar with interactive exercises and fun mascots!
            </p>

            {/* Learning Structure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
              <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 card-hover">
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-japanese-red">あ</div>
                <h3 className="font-bold text-japanese-red mb-2 sm:mb-3 text-base sm:text-lg">Hiragana</h3>
                <p className="text-xs sm:text-sm text-gray-600">46 basic characters + variations</p>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 card-hover">
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-japanese-blue">ア</div>
                <h3 className="font-bold text-japanese-blue mb-2 sm:mb-3 text-base sm:text-lg">Katakana</h3>
                <p className="text-xs sm:text-sm text-gray-600">46 characters for foreign words</p>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 card-hover">
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-japanese-green">水</div>
                <h3 className="font-bold text-japanese-green mb-2 sm:mb-3 text-base sm:text-lg">Kanji</h3>
                <p className="text-xs sm:text-sm text-gray-600">300+ basic characters</p>
              </div>
              <div className="glass-card rounded-2xl p-4 sm:p-6 lg:p-8 card-hover">
                <div className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-japanese-purple">は</div>
                <h3 className="font-bold text-japanese-purple mb-2 sm:mb-3 text-base sm:text-lg">Grammar</h3>
                <p className="text-xs sm:text-sm text-gray-600">Particles and sentence structure</p>
              </div>
            </div>

            {/* Start Learning Button */}
            <button
              onClick={handleStartLearning}
              className="btn-modern text-lg sm:text-xl lg:text-2xl px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 pulse-glow"
            >
              🎌 Start Learning Journey
            </button>

            {/* Skip Intro Button */}
            <button
              onClick={() => setShowIntro(false)}
              className="block mx-auto mt-6 sm:mt-8 text-gray-500 hover:text-gray-700 transition-colors text-base sm:text-lg"
            >
              Skip intro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="absolute top-10 left-10 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header with User Info */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 gradient-red rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg">
                {user?.avatar === 'maneki-neko' ? '🐱' : '🐧'}
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.username}!</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 lg:space-x-6 text-sm sm:text-base lg:text-lg text-gray-600">
                  <span className="flex items-center">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-japanese-red rounded-full mr-2"></span>
                    Level {user?.level}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-japanese-blue rounded-full mr-2"></span>
                    XP: {user?.xp}
                  </span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 sm:w-3 sm:h-3 bg-japanese-gold rounded-full mr-2"></span>
                    🔥 {user?.streak} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowVoiceDebugger(true)}
                className="glass-card p-3 sm:p-4 rounded-full hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-japanese-red focus:ring-opacity-50"
                title="Voice Debugger"
                aria-label="Voice Debugger"
              >
                🔊
              </button>
              <button
                onClick={() => setCurrentSection('profile')}
                className="glass-card p-3 sm:p-4 rounded-full hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-japanese-blue focus:ring-opacity-50"
                title="Settings"
                aria-label="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Use Backspace to navigate between sections</p>
          </div>
        </div>

        {/* Learning Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-8">
          {/* Hiragana Section */}
          <div 
            onClick={() => handleSectionClick('hiragana')}
            className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 card-hover group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('hiragana')}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-japanese-red group-hover:scale-110 transition-transform duration-300">あ</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-japanese-red mb-2 sm:mb-4">Hiragana</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">Master the basic Japanese syllabary</p>
              <div className="gradient-red text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                46 characters
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-japanese-red text-sm font-medium">Click to start →</span>
              </div>
            </div>
          </div>

          {/* Katakana Section */}
          <div 
            onClick={() => handleSectionClick('katakana')}
            className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 card-hover group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('katakana')}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-japanese-blue group-hover:scale-110 transition-transform duration-300">ア</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-japanese-blue mb-2 sm:mb-4">Katakana</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">Learn characters for foreign words</p>
              <div className="gradient-blue text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                46 characters
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-japanese-blue text-sm font-medium">Click to start →</span>
              </div>
            </div>
          </div>

          {/* Kanji Section */}
          <div 
            onClick={() => handleSectionClick('kanji')}
            className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 card-hover group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('kanji')}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-japanese-green group-hover:scale-110 transition-transform duration-300">水</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-japanese-green mb-2 sm:mb-4">Kanji</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">Master Chinese characters</p>
              <div className="gradient-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                300+ characters
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-japanese-green text-sm font-medium">Click to start →</span>
              </div>
            </div>
          </div>

          {/* Kanji Flashcards Section */}
          <div 
            onClick={() => handleSectionClick('kanji-flashcards')}
            className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 card-hover group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('kanji-flashcards')}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-japanese-green group-hover:scale-110 transition-transform duration-300">📚</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-japanese-green mb-2 sm:mb-4">Kanji Flashcards</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">Study with flashcards</p>
              <div className="gradient-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                Interactive study
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-japanese-green text-sm font-medium">Click to study →</span>
              </div>
            </div>
          </div>

          {/* Grammar Section */}
          <div 
            onClick={() => handleSectionClick('grammar')}
            className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 card-hover group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('grammar')}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-japanese-purple group-hover:scale-110 transition-transform duration-300">は</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-japanese-purple mb-2 sm:mb-4">Grammar</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">Learn particles and structure</p>
              <div className="gradient-purple text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                Particles & Patterns
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-japanese-purple text-sm font-medium">Click to start →</span>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          <div 
            onClick={() => handleSectionClick('quiz')}
            className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 card-hover group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('quiz')}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-japanese-gold group-hover:scale-110 transition-transform duration-300">🧠</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-japanese-gold mb-2 sm:mb-4">Quiz</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">Test your knowledge</p>
              <div className="gradient-gold text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                Mixed exercises
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-japanese-gold text-sm font-medium">Click to start →</span>
              </div>
            </div>
          </div>

          {/* Practice Tracker */}
          <div 
            onClick={() => handleSectionClick('tracker')}
            className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8 card-hover group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('tracker')}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 text-japanese-gold group-hover:scale-110 transition-transform duration-300">📊</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-japanese-gold mb-2 sm:mb-4">Progress Tracker</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">View detailed statistics</p>
              <div className="gradient-gold text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                Track progress
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-japanese-gold text-sm font-medium">Click to view →</span>
              </div>
            </div>
          </div>

          {/* Daily Challenge */}
          <div 
            className="gradient-red text-white rounded-3xl p-4 sm:p-6 lg:p-8 card-hover group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95"
            role="button"
            tabIndex={0}
            onClick={() => handleSectionClick('quiz')}
            onKeyDown={(e) => e.key === 'Enter' && handleSectionClick('quiz')}
          >
            <div className="text-center">
              <div className="text-4xl sm:text-6xl lg:text-8xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">🎯</div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">Daily Challenge</h2>
              <p className="mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg opacity-90">Complete today's 5-minute practice</p>
              <div className="bg-white bg-opacity-20 px-4 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-medium">
                {user?.streak} day streak
              </div>
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white text-sm font-medium">Start challenge →</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card rounded-3xl p-4 sm:p-6 lg:p-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">Your Progress</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-colors duration-200 cursor-pointer">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-japanese-red mb-1 sm:mb-2">{user?.level}</div>
              <div className="text-gray-600 text-sm sm:text-base">Level</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-colors duration-200 cursor-pointer">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-japanese-blue mb-1 sm:mb-2">{user?.xp}</div>
              <div className="text-gray-600 text-sm sm:text-base">Total XP</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-colors duration-200 cursor-pointer">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-japanese-green mb-1 sm:mb-2">{user?.streak}</div>
              <div className="text-gray-600 text-sm sm:text-base">Day Streak</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-2xl hover:bg-white hover:bg-opacity-10 transition-colors duration-200 cursor-pointer">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-japanese-purple mb-1 sm:mb-2">0</div>
              <div className="text-gray-600 text-sm sm:text-base">Badges</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Voice Debugger Modal */}
      <VoiceDebugger 
        isVisible={showVoiceDebugger} 
        onClose={() => setShowVoiceDebugger(false)} 
      />
    </div>
  );
};

export default HomeScreen; 