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

// Exercise Types
export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  audio?: string;
}

export type ExerciseType = 
  | 'flashcard'
  | 'multiple-choice'
  | 'fill-blank'
  | 'drag-drop'
  | 'match-sound'
  | 'listen-type'
  | 'speak-repeat';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  type: 'hiragana' | 'katakana' | 'kanji' | 'grammar';
  characters: string[];
  exercises: Exercise[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Quiz and Assessment Types
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

// Audio and Speech Types
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

// UI and Animation Types
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
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: Date;
} 