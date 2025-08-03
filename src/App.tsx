import React, { useEffect, useState } from 'react';
import { useStore, useCurrentSection } from './store/useStore';
import HomeScreen from './components/screens/HomeScreen';
import HiraganaScreen from './components/screens/HiraganaScreen';
import KatakanaScreen from './components/screens/KatakanaScreen';
import KanjiScreen from './components/screens/KanjiScreen';
import KanjiFlashcardScreen from './components/screens/KanjiFlashcardScreen';
import GrammarScreen from './components/screens/GrammarScreen';
import QuizScreen from './components/screens/QuizScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import AILearningEngine from './components/ai/AILearningEngine';
import AdvancedGamificationSystem from './components/gamification/AdvancedGamificationSystem';
import EnhancedExerciseTypes from './components/exercises/EnhancedExerciseTypes';
import ProgressTrackingScreen from './components/screens/ProgressTrackingScreen';
import AdvancedLearningDashboard from './components/screens/AdvancedLearningDashboard';
import Icons from './components/ui/Icons';
import { initializeSpeechSynthesis } from './utils/speech';
import './App.css';

function App() {
  const currentSection = useCurrentSection();
  const { setCurrentSection, gameState, aiRecommendations } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState<string[]>(['home']);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Swipe left - go to next section
      const sections = ['home', 'hiragana', 'katakana', 'kanji', 'grammar', 'quiz', 'tracker', 'ai-tutor', 'advanced-learning'];
      const currentIndex = sections.indexOf(currentSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      handleNavigation(sections[nextIndex]);
    } else if (isRightSwipe) {
      // Swipe right - go to previous section
      const sections = ['home', 'hiragana', 'katakana', 'kanji', 'grammar', 'quiz', 'tracker', 'ai-tutor', 'advanced-learning'];
      const currentIndex = sections.indexOf(currentSection);
      const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
      handleNavigation(sections[prevIndex]);
    }
  };

  // Navigation history for backspace functionality
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [navigationHistory, setNavigationHistory] = React.useState<string[]>(['home']);

  // Global error handler for storage quota errors
  useEffect(() => {
    const handleStorageError = (event: ErrorEvent) => {
      if (event.error && event.error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, attempting cleanup...');
        
        // Try to clean up storage first
        try {
          // cleanupStorage(); // This line was removed
          
          // Show user-friendly notification
          const notification = document.createElement('div');
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 12px 16px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          `;
          notification.innerHTML = `
            <div style="font-weight: 600; margin-bottom: 4px; color: #92400e;">Storage Warning</div>
            <div style="font-size: 14px; color: #92400e; margin-bottom: 8px;">
              Your storage is getting full. Old data has been cleaned up automatically.
            </div>
            <button onclick="this.parentElement.remove()" style="
              background: #f59e0b;
              color: white;
              border: none;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
              cursor: pointer;
            ">Dismiss</button>
          `;
          document.body.appendChild(notification);
          
          // Auto-remove after 5 seconds
          setTimeout(() => {
            if (notification.parentElement) {
              notification.remove();
            }
          }, 5000);
          
        } catch (cleanupError) {
          console.error('Cleanup failed, resetting storage:', cleanupError);
          // resetStorage(); // This line was removed
        }
      }
    };

    window.addEventListener('error', handleStorageError);
    return () => window.removeEventListener('error', handleStorageError);
  }, []); // Removed cleanupStorage and resetStorage from dependencies

  // Periodic storage cleanup to prevent quota issues
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      try {
        const data = localStorage.getItem('japjap-storage');
        if (data) {
          const size = new Blob([data]).size;
          const sizeInMB = size / (1024 * 1024);
          
          // If storage is getting large (>3MB), trigger cleanup
          if (sizeInMB > 3) {
            console.log('Storage getting large, performing periodic cleanup...');
            // cleanupStorage(); // This line was removed
          }
        }
      } catch (error) {
        console.error('Periodic cleanup check failed:', error);
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(cleanupInterval);
  }, []); // Removed cleanupStorage from dependencies

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
    
    // Update URL hash for bookmarking/sharing
    if (currentSection !== 'home') {
      window.location.hash = currentSection;
    } else {
      window.location.hash = '';
    }
  }, [currentSection]);

  // Handle URL hash changes on page load
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && hash !== currentSection) {
                   const validSections = ['home', 'hiragana', 'katakana', 'kanji', 'kanji-flashcards', 'grammar', 'quiz', 'tracker', 'profile', 'social', 'vr', 'ar', 'ai-tutor', 'gamification', 'exercises', 'advanced-learning'];
      if (validSections.includes(hash)) {
        setCurrentSection(hash as any);
      }
    }
  }, [currentSection, setCurrentSection]); // Add missing dependencies

  // Navigation handler with loading state
  const handleNavigation = (section: string) => {
    setIsLoading(true);
    setCurrentSection(section as any);
    // Short loading delay for smooth transition
    setTimeout(() => setIsLoading(false), 150);
  };

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
        return <ProgressTrackingScreen onNavigate={handleNavigation} />;
      case 'profile':
        return <ProfileScreen />;
      case 'ai-tutor':
        return (
          <div className="container mx-auto px-4 py-8">
            <AILearningEngine
              userId="default"
              currentProgress={{
                characters: [
                  { character: 'あ', lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), difficulty: 1, accuracy: 85, mastered: false },
                  { character: 'い', lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), difficulty: 2, accuracy: 70, mastered: false },
                  { character: 'う', lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), difficulty: 3, accuracy: 60, mastered: false },
                  { character: 'え', lastReviewed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), difficulty: 1, accuracy: 95, mastered: true },
                  { character: 'お', lastReviewed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), difficulty: 2, accuracy: 88, mastered: true }
                ],
                userBehavior: {
                  visualInteractions: 10,
                  audioInteractions: 5,
                  handwritingInteractions: 3,
                  rapidErrors: 2,
                  consistentPractice: 8,
                  sessionLength: 25
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
      case 'advanced-learning':
        return (
          <div className="container mx-auto px-4 py-8">
            <AdvancedLearningDashboard onNavigate={handleNavigation} />
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
    <div 
      className="App min-h-screen bg-gray-50"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Enhanced Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('home')}
                className="flex items-center space-x-2 text-xl font-bold text-gradient hover:scale-105 transition-transform duration-200"
              >
                <Icons name="japan" size={28} color="#DC2626" />
                <span className="hidden sm:inline">JapJap</span>
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Icons name={isMobileMenuOpen ? "close" : "menu"} size={24} color="#374151" />
              </button>
              
              {/* Main Navigation - Desktop */}
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => handleNavigation('hiragana')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Icons name="hiragana" size={20} color="currentColor" />
                  <span>Hiragana</span>
                </button>
                <button
                  onClick={() => handleNavigation('katakana')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Icons name="katakana" size={20} color="currentColor" />
                  <span>Katakana</span>
                </button>
                <button
                  onClick={() => handleNavigation('kanji')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Icons name="kanji" size={20} color="currentColor" />
                  <span>Kanji</span>
                </button>
                <button
                  onClick={() => handleNavigation('grammar')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Icons name="grammar" size={20} color="currentColor" />
                  <span>Grammar</span>
                </button>
                <button
                  onClick={() => handleNavigation('quiz')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Icons name="quiz" size={20} color="currentColor" />
                  <span>Quiz</span>
                </button>
                <button
                  onClick={() => handleNavigation('tracker')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Icons name="progress" size={20} color="currentColor" />
                  <span>Progress</span>
                </button>
                <button
                  onClick={() => handleNavigation('ai-tutor')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Icons name="ai" size={20} color="currentColor" />
                  <span>AI Tutor</span>
                </button>
                <button
                  onClick={() => handleNavigation('advanced-learning')}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-105"
                >
                  <Icons name="dashboard" size={20} color="currentColor" />
                  <span>Advanced Learning</span>
                </button>
              </div>
            </div>
            
            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => handleNavigation('profile')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <Icons name="user" size={20} color="currentColor" />
                <span>Profile</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Menu</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Icons name="close" size={24} color="#374151" />
                </button>
              </div>
              
              <div className="space-y-2">
                {[
                  { id: 'home', label: 'Home', icon: 'home' },
                  { id: 'hiragana', label: 'Hiragana', icon: 'hiragana' },
                  { id: 'katakana', label: 'Katakana', icon: 'katakana' },
                  { id: 'kanji', label: 'Kanji', icon: 'kanji' },
                  { id: 'grammar', label: 'Grammar', icon: 'grammar' },
                  { id: 'quiz', label: 'Quiz', icon: 'quiz' },
                  { id: 'tracker', label: 'Progress', icon: 'progress' },
                  { id: 'ai-tutor', label: 'AI Tutor', icon: 'ai' },
                  { id: 'advanced-learning', label: 'Advanced Learning', icon: 'dashboard' },
                  { id: 'profile', label: 'Profile', icon: 'user' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      handleNavigation(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      currentSection === item.id
                        ? 'bg-red-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icons name={item.icon as any} size={20} color="currentColor" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="loading-spinner rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <span className="ml-3 text-lg font-semibold text-gray-700">Loading...</span>
          </div>
        ) : (
          <div className="page-content">
            {renderCurrentScreen()}
          </div>
        )}
      </main>

      {/* Floating Quick Access Menu - Mobile Optimized */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => handleNavigation('ai-tutor')}
            className="group w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            title="AI Tutor"
          >
            <Icons name="ai" size={24} color="white" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => handleNavigation('gamification')}
            className="group w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            title="Gamification"
          >
            <Icons name="gamification" size={24} color="white" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => handleNavigation('exercises')}
            className="group w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            title="Exercises"
          >
            <Icons name="exercises" size={24} color="white" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
          <button
            onClick={() => handleNavigation('advanced-learning')}
            className="group w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            title="Advanced Learning"
          >
            <Icons name="dashboard" size={24} color="white" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>

      {/* Swipe Indicator - Mobile Only */}
      <div className="md:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
          <Icons name="arrow-left" size={16} color="white" />
          <span className="text-white text-xs">Swipe to navigate</span>
          <Icons name="arrow-right" size={16} color="white" />
        </div>
      </div>

      {/* Mascot */}
      {/* Assuming Mascot component is defined elsewhere or will be added */}
      {/* <Mascot /> */}
    </div>
  );
}

export default App;
