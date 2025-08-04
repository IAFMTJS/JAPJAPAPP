import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { ErrorBoundary } from './utils/performanceOptimizations';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { initializeSpeechSynthesis } from './utils/speech';
import i18n from './i18n/index';
import './App.css';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const HiraganaPage = React.lazy(() => import('./pages/HiraganaPage'));
const KatakanaPage = React.lazy(() => import('./pages/KatakanaPage'));
const KanjiPage = React.lazy(() => import('./pages/KanjiPage'));
const KanjiFlashcardPage = React.lazy(() => import('./pages/KanjiFlashcardPage'));
const GrammarPage = React.lazy(() => import('./pages/GrammarPage'));
const QuizPage = React.lazy(() => import('./pages/QuizPage'));
const ProgressPage = React.lazy(() => import('./pages/ProgressPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AITutorPage = React.lazy(() => import('./pages/AITutorPage'));
const GamificationPage = React.lazy(() => import('./pages/GamificationPage'));
const ExercisesPage = React.lazy(() => import('./pages/ExercisesPage'));
const AdvancedLearningPage = React.lazy(() => import('./pages/AdvancedLearningPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
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

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <Router>
          <Suspense fallback={<LoadingSpinner />}>
            <Layout>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                {/* Main Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/hiragana" element={<HiraganaPage />} />
                <Route path="/katakana" element={<KatakanaPage />} />
                <Route path="/kanji" element={<KanjiPage />} />
                <Route path="/kanji-flashcards" element={<KanjiFlashcardPage />} />
                <Route path="/grammar" element={<GrammarPage />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/ai-tutor" element={<AITutorPage />} />
                <Route path="/gamification" element={<GamificationPage />} />
                <Route path="/exercises" element={<ExercisesPage />} />
                <Route path="/advanced-learning" element={<AdvancedLearningPage />} />
                
                {/* Legacy route redirects */}
                <Route path="/tracker" element={<Navigate to="/progress" replace />} />
                
                {/* 404 Page */}
                <Route path="*" element={<NotFoundPage />} />
                            </Routes>
              </Suspense>
            </Layout>
          </Suspense>
        </Router>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;
