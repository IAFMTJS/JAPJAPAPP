import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  User, Progress, AudioSettings, QuizResult, PracticeSession, DailyStats,
  AIRecommendation, Achievement, Badge, GameState, LearningPath, AIInsights,
  EmotionalState, PredictiveAnalytics
} from '../types';
import { cleanupStorage as cleanupStorageUtil, showStorageWarning } from '../utils/storageUtils';

interface AppState {
  // User and Authentication
  user: User | null;
  isAuthenticated: boolean;
  
  // Learning Progress
  progress: Progress;
  
  // Enhanced Progress Tracking
  learningAnalytics: {
    sessionData: {
      startTime: Date | null;
      endTime: Date | null;
      duration: number; // in minutes
      exercisesCompleted: number;
      accuracy: number;
      charactersPracticed: string[];
      focusAreas: string[];
    };
    dailyProgress: {
      [date: string]: {
        totalTime: number;
        exercisesCompleted: number;
        accuracy: number;
        streak: number;
        achievements: string[];
        focusAreas: string[];
      };
    };
    weeklyProgress: {
      [week: string]: {
        totalTime: number;
        averageAccuracy: number;
        exercisesCompleted: number;
        streakDays: number;
        improvementRate: number;
      };
    };
    mobileUsage: {
      sessions: number;
      totalTime: number;
      offlineUsage: number;
      lastSync: Date | null;
    };
  };
  
  // UI State
  currentSection: 'home' | 'hiragana' | 'katakana' | 'kanji' | 'kanji-flashcards' | 'grammar' | 'quiz' | 'tracker' | 'profile' | 'social' | 'vr' | 'ar' | 'ai-tutor' | 'gamification' | 'exercises' | 'advanced-learning';
  currentLesson: string | null;
  currentExercise: number;
  
  // Audio Settings
  audioSettings: AudioSettings;
  
  // Quiz State
  currentQuiz: string | null;
  quizResults: QuizResult[];
  
  // Mascot State
  mascotAnimation: 'idle' | 'happy' | 'sad' | 'thinking' | 'celebration' | 'bounce';
  
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
  
  // Enhanced Progress Tracking Actions
  startLearningSession: () => void;
  endLearningSession: () => void;
  trackExerciseCompletion: (exercise: any, result: any, timeSpent: number) => void;
  trackAIInteraction: (interaction: any) => void;
  updateMobileUsage: (data: Partial<AppState['learningAnalytics']['mobileUsage']>) => void;
  syncProgress: () => Promise<void>;
  exportProgress: () => string;
  importProgress: (data: string) => boolean;
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
  engagement: 50,
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

const defaultLearningAnalytics = {
  sessionData: {
    startTime: null,
    endTime: null,
    duration: 0,
    exercisesCompleted: 0,
    accuracy: 0,
    charactersPracticed: [],
    focusAreas: [],
  },
  dailyProgress: {},
  weeklyProgress: {},
  mobileUsage: {
    sessions: 0,
    totalTime: 0,
    offlineUsage: 0,
    lastSync: null,
  },
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: defaultUser,
      isAuthenticated: false,
      progress: defaultProgress,
      learningAnalytics: defaultLearningAnalytics,
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
        let hasChanges = false;

        // Ensure progress structure is correct
        if (!state.progress.hiragana || !Array.isArray(state.progress.hiragana)) {
          state.progress.hiragana = [];
          hasChanges = true;
        }
        if (!state.progress.katakana || !Array.isArray(state.progress.katakana)) {
          state.progress.katakana = [];
          hasChanges = true;
        }
        if (!state.progress.kanji || !Array.isArray(state.progress.kanji)) {
          state.progress.kanji = [];
          hasChanges = true;
        }
        if (!state.progress.grammar || !Array.isArray(state.progress.grammar)) {
          state.progress.grammar = [];
          hasChanges = true;
        }

        if (hasChanges) {
          set({ progress: state.progress });
        }
      },

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
          
          if (type === 'kanji') {
            newProgress = {
              character: characterId,
              mastered,
              practiceCount: 1,
              lastPracticed: new Date(),
              correctAnswers: correct ? 1 : 0,
              totalAttempts: 1,
              accuracy: correct ? 100 : 0,
              timeSpent,
              strokeOrder: [],
              readings: [],
              meanings: [],
            };
          } else if (type === 'grammar') {
            newProgress = {
              topic: characterId,
              mastered,
              practiceCount: 1,
              lastPracticed: new Date(),
              correctAnswers: correct ? 1 : 0,
              totalAttempts: 1,
              accuracy: correct ? 100 : 0,
              timeSpent,
              examples: [],
              rules: [],
            };
          } else {
            newProgress = {
              character: characterId,
              mastered,
              practiceCount: 1,
              lastPracticed: new Date(),
              correctAnswers: correct ? 1 : 0,
              totalAttempts: 1,
              accuracy: correct ? 100 : 0,
              timeSpent,
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
        set((state) => ({
          progress: {
            ...state.progress,
            practiceSessions: [...state.progress.practiceSessions, session],
          },
        }));
      },

      updateDailyStats: (stats) => {
        const today = new Date().toISOString().split('T')[0];
        set((state) => {
          const currentStats = state.progress.dailyStats.find(s => s.date === today);
          const updatedStats = currentStats 
            ? { 
                ...currentStats, 
                ...stats,
                totalPracticeTime: stats.totalPracticeTime ?? currentStats.totalPracticeTime,
                charactersPracticed: stats.charactersPracticed ?? currentStats.charactersPracticed,
                accuracy: stats.accuracy ?? currentStats.accuracy,
                streak: stats.streak ?? currentStats.streak,
                xpGained: stats.xpGained ?? currentStats.xpGained,
                sessions: stats.sessions ?? currentStats.sessions,
              }
            : { 
                date: today, 
                totalPracticeTime: stats.totalPracticeTime ?? 0,
                charactersPracticed: stats.charactersPracticed ?? 0,
                accuracy: stats.accuracy ?? 0,
                streak: stats.streak ?? 0,
                xpGained: stats.xpGained ?? 0,
                sessions: stats.sessions ?? [],
              };
          
          const otherStats = state.progress.dailyStats.filter(s => s.date !== today);
          return {
            progress: {
              ...state.progress,
              dailyStats: [...otherStats, updatedStats],
            },
          };
        });
      },

      setCurrentSection: (section) => set({ currentSection: section }),
      setCurrentLesson: (lessonId) => set({ currentLesson: lessonId }),

      // Enhanced Progress Tracking Actions
      startLearningSession: () => {
        set((state) => ({
          learningAnalytics: {
            ...state.learningAnalytics,
            sessionData: {
              ...state.learningAnalytics.sessionData,
              startTime: new Date(),
              exercisesCompleted: 0,
              accuracy: 0,
              charactersPracticed: [],
              focusAreas: [],
            },
          },
        }));
      },

      endLearningSession: () => {
        const state = get();
        const sessionData = state.learningAnalytics.sessionData;
        
        if (sessionData.startTime) {
          const endTime = new Date();
          const duration = Math.round((endTime.getTime() - sessionData.startTime.getTime()) / 60000); // minutes
          
          // Update session data
          set((state) => ({
            learningAnalytics: {
              ...state.learningAnalytics,
              sessionData: {
                ...sessionData,
                endTime,
                duration,
              },
            },
          }));

          // Update daily progress
          const today = new Date().toISOString().split('T')[0];
          const currentDaily = state.learningAnalytics.dailyProgress[today] || {
            totalTime: 0,
            exercisesCompleted: 0,
            accuracy: 0,
            streak: 0,
            achievements: [],
            focusAreas: [],
          };

          const updatedDaily = {
            ...currentDaily,
            totalTime: currentDaily.totalTime + duration,
            exercisesCompleted: currentDaily.exercisesCompleted + sessionData.exercisesCompleted,
            accuracy: sessionData.exercisesCompleted > 0 
              ? (currentDaily.accuracy + sessionData.accuracy) / 2 
              : currentDaily.accuracy,
            focusAreas: Array.from(new Set([...currentDaily.focusAreas, ...sessionData.focusAreas])),
          };

          set((state) => ({
            learningAnalytics: {
              ...state.learningAnalytics,
              dailyProgress: {
                ...state.learningAnalytics.dailyProgress,
                [today]: updatedDaily,
              },
            },
          }));
        }
      },

      trackExerciseCompletion: (exercise, result, timeSpent) => {
        const state = get();
        const sessionData = state.learningAnalytics.sessionData;
        
        set((state) => ({
          learningAnalytics: {
            ...state.learningAnalytics,
            sessionData: {
              ...sessionData,
              exercisesCompleted: sessionData.exercisesCompleted + 1,
              accuracy: sessionData.exercisesCompleted > 0 
                ? (sessionData.accuracy + (result.correct ? 100 : 0)) / (sessionData.exercisesCompleted + 1)
                : (result.correct ? 100 : 0),
              charactersPracticed: Array.from(new Set([...sessionData.charactersPracticed, ...(result.characters || [])])),
              focusAreas: Array.from(new Set([...sessionData.focusAreas, exercise.type || 'general'])),
            },
          },
        }));
      },

      trackAIInteraction: (interaction) => {
        // Track AI tutor interactions for analytics
        const state = get();
        const today = new Date().toISOString().split('T')[0];
        const currentDaily = state.learningAnalytics.dailyProgress[today] || {
          totalTime: 0,
          exercisesCompleted: 0,
          accuracy: 0,
          streak: 0,
          achievements: [],
          focusAreas: [],
        };

        set((state) => ({
          learningAnalytics: {
            ...state.learningAnalytics,
            dailyProgress: {
              ...state.learningAnalytics.dailyProgress,
              [today]: {
                ...currentDaily,
                focusAreas: Array.from(new Set([...currentDaily.focusAreas, 'ai-tutor'])),
              },
            },
          },
        }));
      },

      updateMobileUsage: (data) => {
        set((state) => ({
          learningAnalytics: {
            ...state.learningAnalytics,
            mobileUsage: {
              ...state.learningAnalytics.mobileUsage,
              ...data,
            },
          },
        }));
      },

      syncProgress: async () => {
        // Simulate syncing progress to cloud/backend
        const state = get();
        try {
          // In a real app, this would sync with a backend service
          console.log('Syncing progress...', state.learningAnalytics);
          
          set((state) => ({
            learningAnalytics: {
              ...state.learningAnalytics,
              mobileUsage: {
                ...state.learningAnalytics.mobileUsage,
                lastSync: new Date(),
              },
            },
          }));
          
          return Promise.resolve();
        } catch (error) {
          console.error('Failed to sync progress:', error);
          return Promise.reject(error);
        }
      },

      exportProgress: () => {
        const state = get();
        const exportData = {
          progress: state.progress,
          learningAnalytics: state.learningAnalytics,
          gameState: state.gameState,
          achievements: state.achievements,
          badges: state.badges,
          exportDate: new Date().toISOString(),
        };
        return JSON.stringify(exportData, null, 2);
      },

      importProgress: (data) => {
        try {
          const importData = JSON.parse(data);
          if (importData.progress && importData.learningAnalytics) {
            set((state) => ({
              progress: { ...state.progress, ...importData.progress },
              learningAnalytics: { ...state.learningAnalytics, ...importData.learningAnalytics },
              gameState: importData.gameState || state.gameState,
              achievements: importData.achievements || state.achievements,
              badges: importData.badges || state.badges,
            }));
            return true;
          }
          return false;
        } catch (error) {
          console.error('Failed to import progress:', error);
          return false;
        }
      },
    }),
    {
      name: 'japjap-storage',
      partialize: (state) => {
        const partialized = {
          user: state.user,
          progress: state.progress,
          learningAnalytics: state.learningAnalytics,
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
        };
        
        // Clean up data before storing
        return cleanupStorageUtil(partialized);
      },
      onRehydrateStorage: () => (state) => {
        // Run migration when store is rehydrated
        if (state) {
          state.migrateData();
        }
      },
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Selectors for easier access
export const useUser = () => useStore((state) => state.user);
export const useProgress = () => useStore((state) => state.progress);
export const useCurrentSection = () => useStore((state) => state.currentSection);
export const useSetCurrentSection = () => useStore((state) => state.setCurrentSection);
export const useAudioSettings = () => useStore((state) => state.audioSettings);
export const useMascotAnimation = () => useStore((state) => state.mascotAnimation); 