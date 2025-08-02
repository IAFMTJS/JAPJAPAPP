// User and Progress Types
export interface User {
  id: string;
  username: string;
  avatar: 'maneki-neko' | 'penguin-kimono';
  level: number;
  xp: number;
  streak: number;
  language: 'nl' | 'en';
  theme: 'light' | 'dark';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// AI Learning Engine Types
export interface AIRecommendation {
  type: 'review' | 'practice' | 'new' | 'challenge';
  priority: 'high' | 'medium' | 'low';
  content: string;
  reason: string;
  estimatedTime: number;
  estimatedImpact: number;
  confidence: number;
  timestamp: Date;
}

export interface LearningPath {
  currentModule: string;
  modules: string[];
  completedModules: string[];
  nextModule: string;
}

export interface AIInsights {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  predictedCompletionDate: Date;
  confidenceLevel: number;
  studyOptimization: StudyOptimization;
}

export interface StudyOptimization {
  bestStudyTime: string;
  optimalSessionLength: number;
  recommendedBreaks: number;
  focusAreas: string[];
  reviewSchedule: ReviewSchedule;
}

export interface ReviewSchedule {
  intervals: number[];
  characters: string[];
  nextReview: Date;
}

export interface EmotionalState {
  mood: 'happy' | 'sad' | 'neutral' | 'excited' | 'frustrated' | 'focused' | 'tired';
  energy: 'high' | 'medium' | 'low';
  focus: 'focused' | 'distracted' | 'overwhelmed';
  stress: 'low' | 'medium' | 'high';
  confidence: number;
  motivation: number;
  lastUpdated: Date;
}

export interface PredictiveAnalytics {
  nextPractice: string;
  recommendedModules: string[];
  predictedAccuracy: number;
  estimatedCompletionTime: number;
  forgettingCurve: ForgettingCurveData[];
  optimalStudyTimes: OptimalStudyTime[];
  burnoutRisk: number;
  successProbability: number;
}

export interface ForgettingCurveData {
  character: string;
  lastReviewed: Date;
  nextReview: Date;
  retentionRate: number;
  difficulty: number;
}

export interface OptimalStudyTime {
  timeOfDay: string;
  dayOfWeek: number;
  effectiveness: number;
  reason: string;
}

// Gamification Types
export interface GameState {
  currentLevel: number;
  currentXP: number;
  streak: number;
  achievementsUnlocked: string[];
  badgesEarned: string[];
  challengesCompleted: string[];
  coins?: number;
  gems?: number;
  streakProtectionItems?: number;
  streakProtected?: boolean;
  lessonsCompleted?: number;
}

export interface Challenge {
  id: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  title: string;
  description: string;
  requirements: ChallengeRequirement[];
  rewards: Reward[];
  participants: string[];
  leaderboard: LeaderboardEntry[];
  startDate: Date;
  endDate: Date;
  completed: boolean;
}

export interface ChallengeRequirement {
  type: 'practice_time' | 'accuracy' | 'characters' | 'streak' | 'lessons';
  target: number;
  current: number;
  completed: boolean;
}

export interface Reward {
  type: 'xp' | 'badge' | 'achievement' | 'premium_feature' | 'custom' | 'coins' | 'gems' | 'streak_protection';
  value: number | string;
  description: string;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  score: number;
  rank: number;
  progress: number;
}

// Enhanced Exercise Types
export type ExerciseType = 
  | 'flashcard'
  | 'multiple-choice'
  | 'fill-blank'
  | 'drag-drop'
  | 'match-sound'
  | 'listen-type'
  | 'speak-repeat'
  | 'handwriting'
  | 'sentence-construction'
  | 'translation'
  | 'context-cloze'
  | 'grammar-correction'
  | 'pronunciation-practice'
  | 'listening-comprehension'
  | 'reading-comprehension';

export interface Progress {
  hiragana: CharacterProgress[];
  katakana: CharacterProgress[];
  kanji: KanjiProgress[];
  grammar: GrammarProgress[];
  practiceSessions: PracticeSession[];
  dailyStats: DailyStats[];
  totalPracticeTime: number; // in minutes
  totalCharactersPracticed: number;
  overallAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string; // YYYY-MM-DD format
}

export interface CharacterProgress {
  character: string;
  mastered: boolean;
  practiceCount: number;
  lastPracticed: Date;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  timeSpent: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface KanjiProgress extends CharacterProgress {
  strokeOrder: boolean;
  readings: boolean;
  meaning: boolean;
  strokeOrderAttempts: number;
  readingAttempts: number;
  meaningAttempts: number;
  strokeOrderAccuracy: number;
  readingAccuracy: number;
  meaningAccuracy: number;
}

export interface GrammarProgress {
  topic: string;
  mastered: boolean;
  practiceCount: number;
  lastPracticed: Date;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  timeSpent: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface PracticeSession {
  id: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'grammar';
  startTime: Date;
  endTime: Date;
  duration: number; // in seconds
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  charactersPracticed: string[];
  mistakes: string[];
}

export interface DailyStats {
  date: string; // YYYY-MM-DD format
  totalPracticeTime: number; // in minutes
  charactersPracticed: number;
  accuracy: number;
  streak: number;
  xpGained: number;
  sessions: PracticeSession[];
}

// Learning Content Types
export interface HiraganaCharacter {
  character: string;
  romaji: string;
  audio: string;
  category: 'basic' | 'dakuten' | 'handakuten' | 'yoon';
}

export interface KatakanaCharacter {
  character: string;
  romaji: string;
  audio: string;
  category: 'basic' | 'dakuten' | 'handakuten' | 'yoon';
}

export interface KanjiCharacter {
  character: string;
  meaning: string;
  onyomi: string;
  kunyomi: string;
  strokes: number;
  grade: number;
  category: string;
  examples: string[];
  strokeOrder: string[];
}

export interface KanjiExample {
  japanese: string;
  romaji: string;
  english: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  particles: GrammarParticle[];
  patterns: GrammarPattern[];
  examples: GrammarExample[];
}

export interface GrammarParticle {
  particle: string;
  usage: string;
  examples: string[];
}

export interface GrammarPattern {
  pattern: string;
  explanation: string;
  examples: string[];
}

export interface GrammarExample {
  japanese: string;
  romaji: string;
  english: string;
  explanation: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  audio?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  hints: string[];
  timeLimit?: number;
  points: number;
  aiGenerated: boolean;
  userRating: number;
  usageCount: number;
  successRate: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'grammar';
  characters: string[];
  exercises: Exercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Quiz {
  id: string;
  title: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'grammar' | 'mixed';
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank';
  options?: string[];
  correctAnswer: string;
  explanation: string;
  audio?: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
  mistakes: QuizMistake[];
  completedAt: Date;
}

export interface QuizMistake {
  questionId: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  explanation: string;
}

export interface AudioSettings {
  enabled: boolean;
  volume: number;
  speed: number;
  voice: string;
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  isFinal: boolean;
}

export interface MascotAnimation {
  type: 'idle' | 'happy' | 'sad' | 'thinking' | 'celebration';
  duration: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  requirements: BadgeRequirement[];
  xpReward: number;
  animation: string;
}

export interface BadgeRequirement {
  type: 'streak' | 'accuracy' | 'practice_time' | 'characters' | 'lessons' | 'quizzes';
  target: number;
  current: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  requirements: AchievementRequirement[];
  icon: string;
  animation: string;
  social: boolean;
}

export interface AchievementRequirement {
  type: 'streak' | 'accuracy' | 'practice_time' | 'characters' | 'lessons' | 'quizzes' | 'social';
  target: number;
  current: number;
  completed: boolean;
  description: string;
} 