import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, Progress, AudioSettings, QuizResult, PracticeSession, DailyStats,
  AIRecommendation, Achievement, Badge, GameState, LearningPath, AIInsights,
  EmotionalState, PredictiveAnalytics
} from '../types';

interface AppState {
  // User and Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // Learning Progress
  progress: Progress;
  
  // UI State
  currentSection: 'home' | 'hiragana' | 'katakana' | 'kanji' | 'kanji-flashcards' | 'grammar' | 'quiz' | 'tracker' | 'profile' | 'social' | 'vr' | 'ar' | 'ai-tutor' | 'gamification' | 'exercises';
  currentLesson: string | null;
  currentExercise: number;
  
  // Audio Settings
  audioSettings: AudioSettings;
  
  // Quiz State
  currentQuiz: string | null;
  quizResults: QuizResult[];
  
  // Mascot State
  mascotAnimation: 'idle' | 'happy' | 'sad' | 'thinking' | 'celebration';
  
  // AI Learning Engine
  aiRecommendations: AIRecommendation[];
  aiInsights: AIInsights;
  learningPath: LearningPath;
  emotionalState: EmotionalState;
  predictiveAnalytics: PredictiveAnalytics;
  
  // Gamification
  gameState: GameState;
  achievements: Achievement[];
  badges: Badge[];
  challenges: any[];
  
  // Actions
  migrateData: () => void;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  updateProgress: (type: 'hiragana' | 'katakana' | 'kanji' | 'grammar', characterId: string, mastered: boolean, correct?: boolean, timeSpent?: number) => void;
  addPracticeSession: (session: PracticeSession) => void;
  updateDailyStats: (stats: Partial<DailyStats>) => void;
  setCurrentSection: (section: AppState['currentSection']) => void;
  setCurrentLesson: (lessonId: string | null) => void;
  setCurrentExercise: (exerciseIndex: number) => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  setCurrentQuiz: (quizId: string | null) => void;
  addQuizResult: (result: QuizResult) => void;
  setMascotAnimation: (animation: AppState['mascotAnimation']) => void;
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  
  // AI Learning Engine Actions
  addAIRecommendation: (recommendation: AIRecommendation) => void;
  updateAIInsights: (insights: Partial<AIInsights>) => void;
  updateLearningPath: (path: Partial<LearningPath>) => void;
  updateEmotionalState: (state: Partial<EmotionalState>) => void;
  updatePredictiveAnalytics: (analytics: Partial<PredictiveAnalytics>) => void;
  
  // Gamification Actions
  addAchievement: (achievement: Achievement) => void;
  addBadge: (badge: Badge) => void;
  updateGameState: (gameState: Partial<GameState>) => void;
  addChallenge: (challenge: any) => void;
  completeChallenge: (challengeId: string) => void;
}

const defaultUser: User = {
  id: 'default',
  username: 'Learner',
  avatar: 'maneki-neko',
  level: 1,
  xp: 0,
  streak: 0,
  language: 'en',
  theme: 'light',
  difficulty: 'beginner',
};

const defaultProgress: Progress = {
  hiragana: [],
  katakana: [],
  kanji: [],
  grammar: [],
  practiceSessions: [],
  dailyStats: [],
  totalPracticeTime: 0,
  totalCharactersPracticed: 0,
  overallAccuracy: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastPracticeDate: '',
};

const defaultAudioSettings: AudioSettings = {
  enabled: true,
  volume: 0.8,
  speed: 1.0,
  voice: 'ja-JP',
};

const defaultAIInsights: AIInsights = {
  learningStyle: 'mixed',
  strengths: [],
  weaknesses: [],
  recommendations: [],
  predictedCompletionDate: new Date(),
  confidenceLevel: 0,
  studyOptimization: {
    bestStudyTime: '09:00',
    optimalSessionLength: 25,
    recommendedBreaks: 5,
    focusAreas: [],
    reviewSchedule: {
      intervals: [1, 3, 7, 14, 30],
      characters: [],
      nextReview: new Date()
    }
  }
};

const defaultLearningPath: LearningPath = {
  currentModule: 'hiragana',
  modules: ['hiragana', 'katakana', 'kanji', 'grammar'],
  completedModules: [],
  nextModule: 'hiragana',
};

const defaultEmotionalState: EmotionalState = {
  mood: 'neutral',
  energy: 'medium',
  focus: 'focused',
  stress: 'low',
  confidence: 50,
  motivation: 50,
  lastUpdated: new Date(),
};

const defaultPredictiveAnalytics: PredictiveAnalytics = {
  nextPractice: new Date().toISOString(),
  recommendedModules: [],
  predictedAccuracy: 0,
  estimatedCompletionTime: 0,
  forgettingCurve: [],
  optimalStudyTimes: [],
  burnoutRisk: 0,
  successProbability: 0,
};

const defaultGameState: GameState = {
  currentLevel: 1,
  currentXP: 0,
  streak: 0,
  achievementsUnlocked: [],
  badgesEarned: [],
  challengesCompleted: [],
  coins: 0,
  gems: 0,
  streakProtectionItems: 0,
  streakProtected: false,
  lessonsCompleted: 0,
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: defaultUser,
      isAuthenticated: false,
      progress: defaultProgress,
      currentSection: 'home',
      currentLesson: null,
      currentExercise: 0,
      audioSettings: defaultAudioSettings,
      currentQuiz: null,
      quizResults: [],
      mascotAnimation: 'idle',

      // AI Learning Engine State
      aiRecommendations: [],
      aiInsights: defaultAIInsights,
      learningPath: defaultLearningPath,
      emotionalState: defaultEmotionalState,
      predictiveAnalytics: defaultPredictiveAnalytics,

      // Gamification State
      gameState: defaultGameState,
      achievements: [],
      badges: [],
      challenges: [],

      // Migration function to fix corrupted data
      migrateData: () => {
        const state = get();
        let needsUpdate = false;
        const updatedProgress = { ...state.progress };

        // Fix practiceSessions if it's not an array
        if (!Array.isArray(updatedProgress.practiceSessions)) {
          updatedProgress.practiceSessions = [];
          needsUpdate = true;
        }

        // Fix dailyStats if it's not an array
        if (!Array.isArray(updatedProgress.dailyStats)) {
          updatedProgress.dailyStats = [];
          needsUpdate = true;
        }

        // Fix other progress arrays if they're not arrays
        ['hiragana', 'katakana', 'kanji', 'grammar'].forEach(type => {
          if (!Array.isArray(updatedProgress[type as keyof Progress])) {
            (updatedProgress as any)[type] = [];
            needsUpdate = true;
          }
        });

        if (needsUpdate) {
          set({ progress: updatedProgress });
        }
      },

      // Actions
      setUser: (user) => set({ user }),
      
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      updateProgress: (type, characterId, mastered, correct = true, timeSpent = 0) => {
        const currentProgress = get().progress[type];
        // Ensure currentProgress is always an array
        const safeProgress = Array.isArray(currentProgress) ? currentProgress : [];
        const existingIndex = safeProgress.findIndex(
          (item: any) => item.character === characterId || item.topic === characterId
        );
        
        if (existingIndex >= 0) {
          // Update existing progress
          const updatedProgress = [...safeProgress];
          const current = updatedProgress[existingIndex];
          const newTotalAttempts = current.totalAttempts + 1;
          const newCorrectAnswers = current.correctAnswers + (correct ? 1 : 0);
          const newAccuracy = (newCorrectAnswers / newTotalAttempts) * 100;
          
          updatedProgress[existingIndex] = {
            ...current,
            mastered,
            practiceCount: current.practiceCount + 1,
            lastPracticed: new Date(),
            correctAnswers: newCorrectAnswers,
            totalAttempts: newTotalAttempts,
            accuracy: newAccuracy,
            timeSpent: current.timeSpent + timeSpent,
          };
          
          set((state) => ({
            progress: {
              ...state.progress,
              [type]: updatedProgress,
            },
          }));
        } else {
          // Add new progress entry based on type
          let newProgress: any;
          
          if (type === 'grammar') {
            newProgress = {
              topic: characterId,
              mastered,
              practiceCount: 1,
              lastPracticed: new Date(),
              correctAnswers: correct ? 1 : 0,
              totalAttempts: 1,
              accuracy: correct ? 100 : 0,
              timeSpent,
              difficulty: 'easy',
              category: 'basic',
            };
          } else if (type === 'kanji') {
            newProgress = {
              character: characterId,
              mastered,
              practiceCount: 1,
              lastPracticed: new Date(),
              correctAnswers: correct ? 1 : 0,
              totalAttempts: 1,
              accuracy: correct ? 100 : 0,
              timeSpent,
              difficulty: 'easy',
              category: 'basic',
              strokeOrder: false,
              readings: false,
              meaning: false,
              strokeOrderAttempts: 0,
              readingAttempts: 0,
              meaningAttempts: 0,
              strokeOrderAccuracy: 0,
              readingAccuracy: 0,
              meaningAccuracy: 0,
            };
          } else {
            // hiragana and katakana
            newProgress = {
              character: characterId,
              mastered,
              practiceCount: 1,
              lastPracticed: new Date(),
              correctAnswers: correct ? 1 : 0,
              totalAttempts: 1,
              accuracy: correct ? 100 : 0,
              timeSpent,
              difficulty: 'easy',
              category: 'basic',
            };
          }
          
          set((state) => ({
            progress: {
              ...state.progress,
              [type]: [...safeProgress, newProgress],
            },
          }));
        }
      },
      
      addPracticeSession: (session) => {
        set((state) => {
          // Ensure practiceSessions is always an array
          const currentSessions = Array.isArray(state.progress.practiceSessions) 
            ? state.progress.practiceSessions 
            : [];
          
          return {
            progress: {
              ...state.progress,
              practiceSessions: [...currentSessions, session],
              totalPracticeTime: state.progress.totalPracticeTime + (session.duration / 60),
              totalCharactersPracticed: state.progress.totalCharactersPracticed + session.charactersPracticed.length,
            },
          };
        });
      },
      
      updateDailyStats: (stats) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          // Ensure dailyStats is always an array
          const currentStats = Array.isArray(state.progress.dailyStats) 
            ? state.progress.dailyStats 
            : [];
          
          const existingStatsIndex = currentStats.findIndex(s => s.date === today);
          const updatedStats = [...currentStats];
          
          if (existingStatsIndex >= 0) {
            updatedStats[existingStatsIndex] = { ...updatedStats[existingStatsIndex], ...stats };
          } else {
            updatedStats.push({
              date: today,
              totalPracticeTime: 0,
              charactersPracticed: 0,
              accuracy: 0,
              streak: 0,
              xpGained: 0,
              sessions: [],
              ...stats,
            });
          }
          
          return {
            progress: {
              ...state.progress,
              dailyStats: updatedStats,
              lastPracticeDate: today,
            },
          };
        });
      },
      
      setCurrentSection: (section) => set({ currentSection: section }),
      
      setCurrentLesson: (lessonId) => set({ currentLesson: lessonId }),
      
      setCurrentExercise: (exerciseIndex) => set({ currentExercise: exerciseIndex }),
      
      updateAudioSettings: (settings) => {
        set((state) => ({
          audioSettings: { ...state.audioSettings, ...settings },
        }));
      },
      
      setCurrentQuiz: (quizId) => set({ currentQuiz: quizId }),
      
      addQuizResult: (result) => {
        set((state) => ({
          quizResults: [...state.quizResults, result],
        }));
      },
      
      setMascotAnimation: (animation) => set({ mascotAnimation: animation }),
      
      addXP: (amount) => {
        set((state) => {
          if (!state.user) return state;
          
          const newXP = state.user.xp + amount;
          const newLevel = Math.floor(newXP / 100) + 1;
          
          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
            },
          };
        });
      },
      
      incrementStreak: () => {
        set((state) => {
          if (!state.user) return state;
          
          return {
            user: {
              ...state.user,
              streak: state.user.streak + 1,
            },
          };
        });
      },
      
      resetStreak: () => {
        set((state) => {
          if (!state.user) return state;
          
          return {
            user: {
              ...state.user,
              streak: 0,
            },
          };
        });
      },

      // AI Learning Engine Actions
      addAIRecommendation: (recommendation) => {
        set((state) => ({
          aiRecommendations: [...state.aiRecommendations, recommendation],
        }));
      },
      updateAIInsights: (insights) => {
        set((state) => ({
          aiInsights: { ...state.aiInsights, ...insights },
        }));
      },
      updateLearningPath: (path) => {
        set((state) => ({
          learningPath: { ...state.learningPath, ...path },
        }));
      },
      updateEmotionalState: (state) => {
        set((state) => ({
          emotionalState: { ...state.emotionalState, ...state },
        }));
      },
      updatePredictiveAnalytics: (analytics) => {
        set((state) => ({
          predictiveAnalytics: { ...state.predictiveAnalytics, ...analytics },
        }));
      },

      // Gamification Actions
      addAchievement: (achievement) => {
        set((state) => ({
          achievements: [...state.achievements, achievement],
        }));
      },
      addBadge: (badge) => {
        set((state) => ({
          badges: [...state.badges, badge],
        }));
      },
      updateGameState: (gameState) => {
        set((state) => ({
          gameState: { ...state.gameState, ...gameState },
        }));
      },
      addChallenge: (challenge) => {
        set((state) => ({
          challenges: [...state.challenges, challenge],
        }));
      },
      completeChallenge: (challengeId) => {
        set((state) => ({
          challenges: state.challenges.map(challenge => 
            challenge.id === challengeId ? { ...challenge, completed: true } : challenge
          ),
        }));
      },
    }),
    {
      name: 'japjap-storage',
      partialize: (state) => ({
        user: state.user,
        progress: state.progress,
        audioSettings: state.audioSettings,
        quizResults: state.quizResults,
        // AI Learning Engine
        aiRecommendations: state.aiRecommendations,
        aiInsights: state.aiInsights,
        learningPath: state.learningPath,
        emotionalState: state.emotionalState,
        predictiveAnalytics: state.predictiveAnalytics,
        // Gamification
        gameState: state.gameState,
        achievements: state.achievements,
        badges: state.badges,
        challenges: state.challenges,
      }),
      onRehydrateStorage: () => (state) => {
        // Run migration when store is rehydrated
        if (state) {
          state.migrateData();
        }
      },
    }
  )
);

// Selectors for easier access
export const useUser = () => useStore((state) => state.user);
export const useProgress = () => useStore((state) => state.progress);
export const useCurrentSection = () => useStore((state) => state.currentSection);
export const useAudioSettings = () => useStore((state) => state.audioSettings);
export const useMascotAnimation = () => useStore((state) => state.mascotAnimation); 