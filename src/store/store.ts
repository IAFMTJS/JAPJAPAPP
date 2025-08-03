import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  User, Progress, AudioSettings, QuizResult, PracticeSession, DailyStats,
  AIRecommendation, Achievement, Badge, GameState, LearningPath, AIInsights,
  EmotionalState, PredictiveAnalytics, LearningAnalytics
} from '../types';

interface AppState {
  // Basic state
  user: User | null;
  progress: Progress;
  currentSection: string;
  audioSettings: AudioSettings;
  mascotAnimation: string;
  
  // AI Learning Engine
  aiRecommendations: AIRecommendation[];
  aiInsights: AIInsights;
  emotionalState: EmotionalState;
  predictiveAnalytics: PredictiveAnalytics;
  learningAnalytics: LearningAnalytics;
  
  // Gamification
  gameState: GameState;
  achievements: Achievement[];
  badges: Badge[];
  challenges: any[];
  
  // Actions
  setUser: (user: User | null) => void;
  updateProgress: (type: string, characterId: string, mastered: boolean) => void;
  setCurrentSection: (section: string) => void;
  
  // Enhanced Progress Tracking Actions
  startLearningSession: () => void;
  endLearningSession: () => void;
  trackExerciseCompletion: (exercise: any, result: any, timeSpent: number) => void;
  trackAIInteraction: (interaction: any) => void;
  updateMobileUsage: (data: any) => void;
  syncProgress: () => Promise<void>;
  exportProgress: () => string;
  importProgress: (data: string) => boolean;
  
  // AI Learning Engine actions
  addAIRecommendation: (recommendation: AIRecommendation) => void;
  updateAIInsights: (insights: Partial<AIInsights>) => void;
  updateEmotionalState: (state: Partial<EmotionalState>) => void;
  updatePredictiveAnalytics: (analytics: Partial<PredictiveAnalytics>) => void;
  
  // Gamification actions
  updateGameState: (gameState: Partial<GameState>) => void;
  addAchievement: (achievement: Achievement) => void;
  addBadge: (badge: Badge) => void;
  addChallenge: (challenge: any) => void;
  
  // Missing actions that components are using
  addXP: (amount: number) => void;
  setMascotAnimation: (animation: string) => void;
  incrementStreak: () => void;
  addQuizResult: (result: QuizResult) => void;
  addPracticeSession: (session: PracticeSession) => void;
  updateAudioSettings: (settings: Partial<AudioSettings>) => void;
  cleanupStorage: () => void;
  resetStorage: () => void;
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

const defaultLearningAnalytics: LearningAnalytics = {
  overallAccuracy: 0,
  improvementRate: 0,
  sessionFrequency: 0,
  averageSessionLength: 0,
  motivationLevel: 50,
  weakAreas: [],
  strongAreas: [],
  mobileUsage: {
    sessions: 0,
    totalTime: 0,
    offlineUsage: 0,
    lastSync: null,
  },
  sessionData: {
    duration: 0,
  },
  weeklyProgress: {},
  dailyProgress: {},
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      user: defaultUser,
      progress: defaultProgress,
      currentSection: 'home',
      audioSettings: defaultAudioSettings,
      mascotAnimation: 'idle',
      
      // AI Learning Engine State
      aiRecommendations: [],
      aiInsights: defaultAIInsights,
      emotionalState: defaultEmotionalState,
      predictiveAnalytics: defaultPredictiveAnalytics,
      learningAnalytics: defaultLearningAnalytics,
      
      // Gamification State
      gameState: defaultGameState,
      achievements: [],
      badges: [],
      challenges: [],
      
      // Actions
      setUser: (user) => set({ user }),
      
      updateProgress: (type, characterId, mastered) => {
        const currentProgress = get().progress[type as keyof Progress];
        if (Array.isArray(currentProgress)) {
          const existingIndex = currentProgress.findIndex(
            (item: any) => item.character === characterId || item.topic === characterId
          );
          
          if (existingIndex >= 0) {
            const updatedProgress = [...currentProgress];
            const currentItem = updatedProgress[existingIndex] as any;
            updatedProgress[existingIndex] = {
              ...currentItem,
              mastered,
              practiceCount: (currentItem.practiceCount || 0) + 1,
              lastPracticed: new Date(),
            };
            
            set((state) => ({
              progress: {
                ...state.progress,
                [type]: updatedProgress,
              },
            }));
          } else {
            const newProgress = {
              character: characterId,
              mastered,
              practiceCount: 1,
              lastPracticed: new Date(),
              correctAnswers: 0,
              totalAttempts: 0,
              accuracy: 0,
              timeSpent: 0,
            };
            
            set((state) => ({
              progress: {
                ...state.progress,
                [type]: [...currentProgress, newProgress],
              },
            }));
          }
        }
      },
      
      setCurrentSection: (section) => set({ currentSection: section }),
      
      // Enhanced Progress Tracking Actions
      startLearningSession: () => {
        console.log('Learning session started');
      },
      
      endLearningSession: () => {
        console.log('Learning session ended');
      },
      
      trackExerciseCompletion: (exercise, result, timeSpent) => {
        console.log('Exercise completed:', exercise, result, timeSpent);
      },
      
      trackAIInteraction: (interaction) => {
        console.log('AI interaction tracked:', interaction);
      },
      
      updateMobileUsage: (data) => {
        console.log('Mobile usage updated:', data);
      },
      
      syncProgress: async () => {
        console.log('Progress synced');
        return Promise.resolve();
      },
      
      exportProgress: () => {
        const state = get();
        return JSON.stringify(state, null, 2);
      },
      
      importProgress: (data) => {
        try {
          const importData = JSON.parse(data);
          set(importData);
          return true;
        } catch (error) {
          console.error('Failed to import progress:', error);
          return false;
        }
      },
      
      // AI Learning Engine actions
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
      
      updateEmotionalState: (emotionalState) => {
        set((state) => ({
          emotionalState: { ...state.emotionalState, ...emotionalState },
        }));
      },
      
      updatePredictiveAnalytics: (analytics) => {
        set((state) => ({
          predictiveAnalytics: { ...state.predictiveAnalytics, ...analytics },
        }));
      },
      
      // Gamification actions
      updateGameState: (gameState) => {
        set((state) => ({
          gameState: { ...state.gameState, ...gameState },
        }));
      },
      
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
      
      addChallenge: (challenge) => {
        console.log('Challenge added:', challenge);
      },
      
      // Missing actions that components are using
      addXP: (amount) => {
        set((state) => ({
          user: state.user ? { ...state.user, xp: state.user.xp + amount } : state.user,
          gameState: { ...state.gameState, currentXP: state.gameState.currentXP + amount },
        }));
      },
      
      setMascotAnimation: (animation) => set({ mascotAnimation: animation }),
      
      incrementStreak: () => {
        set((state) => ({
          user: state.user ? { ...state.user, streak: state.user.streak + 1 } : state.user,
          gameState: { ...state.gameState, streak: state.gameState.streak + 1 },
        }));
      },
      
      addQuizResult: (result) => {
        console.log('Quiz result added:', result);
      },
      
      addPracticeSession: (session) => {
        set((state) => ({
          progress: {
            ...state.progress,
            practiceSessions: [...state.progress.practiceSessions, session],
          },
        }));
      },
      
      updateAudioSettings: (settings) => {
        set((state) => ({
          audioSettings: { ...state.audioSettings, ...settings },
        }));
      },
      
      cleanupStorage: () => {
        console.log('Cleaning up storage');
      },
      
      resetStorage: () => {
        localStorage.removeItem('japjap-storage');
        window.location.reload();
      },
    }),
    {
      name: 'japjap-storage',
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