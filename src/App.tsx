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
import { initializeSpeechSynthesis } from './utils/speech';
import './App.css';

function App() {
  const currentSection = useCurrentSection();
  const { setCurrentSection } = useStore();

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
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 font-japanese">
      {/* Seigaiha pattern background */}
      <div className="fixed inset-0 bg-seigaiha opacity-5 pointer-events-none"></div>
      
      {/* Main content */}
      <div className="relative z-10">
        {renderCurrentScreen()}
      </div>
      
      {/* Floating mascot */}
      <div className="fixed bottom-4 right-4 z-20">
        <Mascot />
      </div>
    </div>
  );
}

export default App;
