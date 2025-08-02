import React, { useEffect } from 'react';
import { useStore, useCurrentSection } from './store/useStore';
import HomeScreen from './components/screens/HomeScreen';
import HiraganaScreen from './components/screens/HiraganaScreen';
import KatakanaScreen from './components/screens/KatakanaScreen';
import KanjiScreen from './components/screens/KanjiScreen';
import KanjiFlashcardScreen from './components/screens/KanjiFlashcardScreen';
import GrammarScreen from './components/screens/GrammarScreen';
import QuizScreen from './components/screens/QuizScreen';
import PracticeTrackerScreen from './components/screens/PracticeTrackerScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import Mascot from './components/ui/Mascot';
import AILearningEngine from './components/ai/AILearningEngine';
import AdvancedGamificationSystem from './components/gamification/AdvancedGamificationSystem';
import EnhancedExerciseTypes from './components/exercises/EnhancedExerciseTypes';
import { initializeSpeechSynthesis } from './utils/speech';
import './App.css';

function App() {
  const currentSection = useCurrentSection();
  const { setCurrentSection, gameState, aiRecommendations } = useStore();

  // Navigation history for backspace functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [navigationHistory, setNavigationHistory] = React.useState<string[]>(['home']);

  // iOS audio optimization - enable audio after user interaction
  useEffect(() => {
    const enableAudio = () => {
      document.body.classList.add('audio-enabled');
      // Create a silent audio context to unlock audio on iOS
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.001);
      
      // Initialize speech synthesis after user interaction
      initializeSpeechSynthesis();
      
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
    };

    document.addEventListener('touchstart', enableAudio, { once: true });
    document.addEventListener('click', enableAudio, { once: true });

    return () => {
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('click', enableAudio);
    };
  }, []);

  // Handle navigation history updates
  useEffect(() => {
    setNavigationHistory(prev => {
      // Don't add duplicate consecutive entries
      if (prev[prev.length - 1] !== currentSection) {
        return [...prev, currentSection];
      }
      return prev;
    });
  }, [currentSection]);

  // Custom backspace navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle backspace when not in input fields
      if (event.key === 'Backspace' && 
          !['INPUT', 'TEXTAREA', 'SELECT'].includes((event.target as HTMLElement).tagName)) {
        event.preventDefault();
        
        // Navigate to previous section in history
        setNavigationHistory(prev => {
          if (prev.length > 1) {
            const newHistory = prev.slice(0, -1);
            const previousSection = newHistory[newHistory.length - 1];
            setCurrentSection(previousSection as any);
            return newHistory;
          }
          return prev;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentSection]);

  const renderCurrentScreen = () => {
    switch (currentSection) {
      case 'home':
        return <HomeScreen />;
      case 'hiragana':
        return <HiraganaScreen />;
      case 'katakana':
        return <KatakanaScreen />;
      case 'kanji':
        return <KanjiScreen />;
      case 'kanji-flashcards':
        return <KanjiFlashcardScreen />;
      case 'grammar':
        return <GrammarScreen />;
      case 'quiz':
        return <QuizScreen />;
      case 'tracker':
        return <PracticeTrackerScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'ai-tutor':
        return (
          <div className="container mx-auto px-4 py-8">
            <AILearningEngine
              userId="default"
              currentProgress={{
                characters: [
                  { character: 'あ', lastReviewed: new Date(), difficulty: 1, accuracy: 85 },
                  { character: 'い', lastReviewed: new Date(), difficulty: 2, accuracy: 70 },
                  { character: 'う', lastReviewed: new Date(), difficulty: 3, accuracy: 60 }
                ],
                userBehavior: {
                  visualInteractions: 10,
                  audioInteractions: 5,
                  handwritingInteractions: 3
                },
                recentPerformance: [
                  { accuracy: 85, speed: 80 },
                  { accuracy: 70, speed: 60 },
                  { accuracy: 90, speed: 85 }
                ]
              }}
              onRecommendationUpdate={(recommendations) => console.log('AI Recommendations:', recommendations)}
              onDifficultyAdjustment={(difficulty) => console.log('Difficulty adjusted to:', difficulty)}
              onLearningPathUpdate={(path) => console.log('Learning path updated:', path)}
            />
          </div>
        );
      case 'gamification':
        return (
          <div className="container mx-auto px-4 py-8">
            <AdvancedGamificationSystem
              userId="default"
              onLevelUp={(newLevel) => console.log('Level up to:', newLevel)}
              onAchievementUnlocked={(achievement) => console.log('Achievement unlocked:', achievement)}
              onBadgeEarned={(badge) => console.log('Badge earned:', badge)}
              onChallengeCompleted={(challenge) => console.log('Challenge completed:', challenge)}
            />
          </div>
        );
      case 'exercises':
        return (
          <div className="container mx-auto px-4 py-8">
            <EnhancedExerciseTypes
              onExerciseComplete={(exercise, result) => console.log('Exercise completed:', exercise, result)}
              onProgressUpdate={(progress) => console.log('Progress updated:', progress)}
            />
          </div>
        );
      case 'social':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Social Learning Platform</h2>
              <p className="text-gray-600">Connect with other learners, join study groups, and compete on leaderboards!</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">Coming Soon!</h3>
                <p className="text-blue-600">Social features are being developed and will be available soon.</p>
              </div>
            </div>
          </div>
        );
      case 'vr':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">VR Japanese Immersion</h2>
              <p className="text-gray-600">Experience Japanese learning in virtual reality environments!</p>
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800">Coming Soon!</h3>
                <p className="text-purple-600">VR features are being developed and will be available soon.</p>
              </div>
            </div>
          </div>
        );
      case 'ar':
        return (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Augmented Reality Learning</h2>
              <p className="text-gray-600">Learn Japanese through augmented reality experiences!</p>
              <div className="mt-4 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">Coming Soon!</h3>
                <p className="text-green-600">AR features are being developed and will be available soon.</p>
              </div>
            </div>
          </div>
        );
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Enhanced Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentSection('home')}
                className="text-xl font-bold text-blue-600 hover:text-blue-700"
              >
                JapJap
              </button>
              
              {/* Main Navigation */}
              <div className="hidden md:flex space-x-4">
                <button
                  onClick={() => setCurrentSection('hiragana')}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Hiragana
                </button>
                <button
                  onClick={() => setCurrentSection('katakana')}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Katakana
                </button>
                <button
                  onClick={() => setCurrentSection('kanji')}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Kanji
                </button>
                <button
                  onClick={() => setCurrentSection('grammar')}
                  className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  Grammar
                </button>
              </div>
            </div>

            {/* Advanced Features Navigation */}
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => setCurrentSection('ai-tutor')}
                className="px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md flex items-center space-x-1"
              >
                <span>🤖</span>
                <span>AI Tutor</span>
              </button>
              <button
                onClick={() => setCurrentSection('gamification')}
                className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md flex items-center space-x-1"
              >
                <span>🎮</span>
                <span>Gamification</span>
              </button>
              <button
                onClick={() => setCurrentSection('exercises')}
                className="px-3 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-md flex items-center space-x-1"
              >
                <span>📝</span>
                <span>Exercises</span>
              </button>
              <button
                onClick={() => setCurrentSection('social')}
                className="px-3 py-2 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-md flex items-center space-x-1"
              >
                <span>👥</span>
                <span>Social</span>
              </button>
            </div>

            {/* User Stats */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Level {Math.floor(gameState.currentXP / 100) + 1}</div>
                <div className="text-xs text-gray-500">{gameState.currentXP} XP</div>
              </div>
              {aiRecommendations.length > 0 && (
                <div className="relative">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {aiRecommendations.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderCurrentScreen()}
      </main>

      {/* Floating Quick Access Menu */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => setCurrentSection('ai-tutor')}
            className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="AI Tutor"
          >
            🤖
          </button>
          <button
            onClick={() => setCurrentSection('gamification')}
            className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="Gamification"
          >
            🎮
          </button>
          <button
            onClick={() => setCurrentSection('exercises')}
            className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="Enhanced Exercises"
          >
            📝
          </button>
          <button
            onClick={() => setCurrentSection('social')}
            className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="Social Learning"
          >
            👥
          </button>
        </div>
      </div>

      {/* Mascot */}
      <Mascot />
    </div>
  );
}

export default App;
