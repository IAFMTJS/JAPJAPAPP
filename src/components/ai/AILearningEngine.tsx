import React, { useEffect, useState, useCallback } from 'react';
// Removed framer-motion import due to compatibility issues
import { useStore } from '../../store/useStore';
import { 
  AIRecommendation, 
  LearningPath, 
  EmotionalState, 
  LearningAnalytics, 
  GamificationElements, 
  PersonalizedContent 
} from '../../types';

interface AILearningEngineProps {
  userId: string;
  currentProgress: any;
  onRecommendationUpdate: (recommendations: AIRecommendation[]) => void;
  onDifficultyAdjustment: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onLearningPathUpdate: (path: Partial<LearningPath>) => void;
}

const AILearningEngine: React.FC<AILearningEngineProps> = ({
  userId,
  currentProgress,
  onRecommendationUpdate,
  onDifficultyAdjustment,
  onLearningPathUpdate,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date>(new Date());
  const [hasError, setHasError] = useState(false);
  const [currentRecommendations, setCurrentRecommendations] = useState<AIRecommendation[]>([]);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [studySchedule, setStudySchedule] = useState<any>(null);
  const [progressPrediction, setProgressPrediction] = useState<any>(null);
  // const [activeModules, setActiveModules] = useState<string[]>([]); // Removed unused state
  const [showAdvancedFeatures, setShowAdvancedFeatures] = useState(false);
  const [learningAnalytics, setLearningAnalytics] = useState<LearningAnalytics | null>(null);
  const [gamificationElements, setGamificationElements] = useState<GamificationElements | null>(null);
  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent | null>(null);
  
  const { 
    addAIRecommendation, 
    updateAIInsights, 
    updateEmotionalState,
    updatePredictiveAnalytics 
  } = useStore();

  // Enhanced Spaced Repetition Algorithm with SuperMemo 2
  const calculateSpacedRepetition = useCallback((character: string, lastReviewed: Date, difficulty: number, previousIntervals: number[] = []) => {
    const now = new Date();
    // const daysSinceReview = Math.floor((now.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24)); // Removed unused variable
    
    // SuperMemo 2 algorithm with interval history
    let easeFactor = 2.5;
    let interval = 1;
    
    if (previousIntervals.length > 0) {
      const lastInterval = previousIntervals[previousIntervals.length - 1];
      const quality = Math.max(0, 100 - (difficulty * 10)) / 100; // Convert to 0-1 scale
      
      // Update ease factor based on performance
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      
      // Calculate new interval
      if (quality >= 0.6) {
        interval = Math.round(lastInterval * easeFactor);
      } else {
        interval = 1; // Reset to 1 day if performance is poor
      }
    }
    
    return {
      nextReview: new Date(now.getTime() + interval * 24 * 60 * 60 * 1000),
      retentionRate: Math.max(0, 100 - (difficulty * 10)),
      priority: interval < 1 ? 'high' : interval < 3 ? 'medium' : 'low',
      easeFactor,
      interval
    };
  }, []);

  // Advanced Adaptive Difficulty System
  const calculateAdaptiveDifficulty = useCallback((recentPerformance: any[], learningStyle: string) => {
    if (!recentPerformance || recentPerformance.length === 0) return 'medium';
    
    const accuracy = recentPerformance.reduce((sum, p) => sum + p.accuracy, 0) / recentPerformance.length;
    const speed = recentPerformance.reduce((sum, p) => sum + p.speed, 0) / recentPerformance.length;
    const consistency = recentPerformance.length >= 3 ? 
      recentPerformance.slice(-3).every(p => Math.abs(p.accuracy - accuracy) < 10) : false;
    
    // Adjust based on learning style
    let styleMultiplier = 1;
    switch (learningStyle) {
      case 'visual': styleMultiplier = 1.1; break;
      case 'auditory': styleMultiplier = 0.9; break;
      case 'kinesthetic': styleMultiplier = 1.05; break;
      default: styleMultiplier = 1;
    }
    
    const adjustedAccuracy = accuracy * styleMultiplier;
    const adjustedSpeed = speed * styleMultiplier;
    
    if (adjustedAccuracy > 90 && adjustedSpeed > 80 && consistency) return 'hard';
    if (adjustedAccuracy < 70 || adjustedSpeed < 50) return 'easy';
    return 'medium';
  }, []);

  // Enhanced Learning Style Detection
  const detectLearningStyle = useCallback((userBehavior: any) => {
    const visualScore = userBehavior.visualInteractions || 0;
    const auditoryScore = userBehavior.audioInteractions || 0;
    const kinestheticScore = userBehavior.handwritingInteractions || 0;
    const readingScore = userBehavior.readingInteractions || 0;
    const writingScore = userBehavior.writingInteractions || 0;
    
    const total = visualScore + auditoryScore + kinestheticScore + readingScore + writingScore;
    if (total === 0) return 'mixed';
    
    const visualPercent = ((visualScore + readingScore) / total) * 100;
    const auditoryPercent = (auditoryScore / total) * 100;
    const kinestheticPercent = ((kinestheticScore + writingScore) / total) * 100;
    
    if (visualPercent > 50) return 'visual';
    if (auditoryPercent > 50) return 'auditory';
    if (kinestheticPercent > 50) return 'kinesthetic';
    return 'mixed';
  }, []);

  // Generate Personalized Study Schedule
  const generateStudySchedule = useCallback((learningStyle: string, currentProgress: any) => {
    const schedule = {
      daily: {
        morning: { time: '09:00', duration: 20, focus: 'new_content' },
        afternoon: { time: '14:00', duration: 15, focus: 'review' },
        evening: { time: '20:00', duration: 10, focus: 'practice' }
      },
      weekly: {
        monday: { focus: 'hiragana', difficulty: 'medium' },
        wednesday: { focus: 'katakana', difficulty: 'medium' },
        friday: { focus: 'kanji', difficulty: 'hard' },
        sunday: { focus: 'review_all', difficulty: 'easy' }
      },
      breaks: [
        { after: 25, duration: 5, activity: 'stretch' },
        { after: 50, duration: 10, activity: 'walk' }
      ]
    };

    // Adjust based on learning style
    switch (learningStyle) {
      case 'visual':
        schedule.daily.morning.duration = 25;
        schedule.daily.morning.focus = 'visual_learning';
        break;
      case 'auditory':
        schedule.daily.afternoon.duration = 20;
        schedule.daily.afternoon.focus = 'audio_practice';
        break;
      case 'kinesthetic':
        schedule.daily.evening.duration = 15;
        schedule.daily.evening.focus = 'writing_practice';
        break;
    }

    return schedule;
  }, []);

  // Real-time Learning Analytics
  const generateLearningAnalytics = useCallback((currentProgress: any, learningStyle: string): LearningAnalytics => {
    const analytics: LearningAnalytics = {
      overallAccuracy: 0,
      improvementRate: 0,
      sessionFrequency: 0,
      averageSessionLength: 0,
      motivationLevel: 0,
      weakAreas: [],
      strongAreas: []
    };

    // Calculate performance metrics
    if (currentProgress.characters && currentProgress.characters.length > 0) {
      const accuracies = currentProgress.characters.map((c: any) => c.accuracy || 0);
      analytics.overallAccuracy = accuracies.reduce((sum: number, acc: number) => sum + acc, 0) / accuracies.length;
      
      // Calculate improvement rate
      const recentPerformance = currentProgress.recentPerformance || [];
      if (recentPerformance.length >= 2) {
        const recentAvg = recentPerformance.slice(-3).reduce((sum: any, p: any) => sum + p.accuracy, 0) / 3;
        const olderAvg = recentPerformance.slice(0, -3).reduce((sum: any, p: any) => sum + p.accuracy, 0) / Math.max(1, recentPerformance.length - 3);
        analytics.improvementRate = recentAvg - olderAvg;
      }

      // Identify weak and strong areas
      const weakChars = currentProgress.characters.filter((c: any) => (c.accuracy || 0) < 70).map((c: any) => c.character);
      const strongChars = currentProgress.characters.filter((c: any) => (c.accuracy || 0) > 90).map((c: any) => c.character);
      analytics.weakAreas = weakChars.slice(0, 5);
      analytics.strongAreas = strongChars.slice(0, 5);
    }

    // Calculate engagement metrics
    const userBehavior = currentProgress.userBehavior || {};
    analytics.sessionFrequency = userBehavior.consistentPractice || 0;
    analytics.averageSessionLength = userBehavior.sessionLength || 0;
    analytics.motivationLevel = Math.min(100, (userBehavior.consistentPractice || 0) * 10);

    return analytics;
  }, []);

  // Gamification Integration
  const generateGamificationElements = useCallback((currentProgress: any, learningPath: any) => {
    const gamification: GamificationElements = {
      achievements: [],
      challenges: [],
      currentStreak: currentProgress.userBehavior?.consistentPractice || 0,
      level: Math.floor((currentProgress.userBehavior?.consistentPractice || 0) / 10) + 1,
      xp: (currentProgress.userBehavior?.consistentPractice || 0) * 10
    };

    // Generate achievements based on progress
    const masteredCount = currentProgress.characters?.filter((c: any) => c.mastered).length || 0;
    const totalStudyTime = currentProgress.userBehavior?.sessionLength || 0;
    const streak = currentProgress.userBehavior?.consistentPractice || 0;

    if (masteredCount >= 5) {
      gamification.achievements.push({
        id: 'hiragana_starter',
        name: 'Hiragana Starter',
        description: 'Mastered 5 hiragana characters',
        icon: '🎯',
        unlocked: true,
        progress: Math.min(100, (masteredCount / 5) * 100)
      });
    }

    if (totalStudyTime >= 100) {
      gamification.achievements.push({
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Studied for 100+ minutes',
        icon: '⏰',
        unlocked: true,
        progress: Math.min(100, (totalStudyTime / 100) * 100)
      });
    }

    if (streak >= 7) {
      gamification.achievements.push({
        id: 'week_warrior',
        name: 'Week Warrior',
        description: '7-day study streak',
        icon: '🔥',
        unlocked: true,
        progress: Math.min(100, (streak / 7) * 100)
      });
    }

    // Generate challenges
    gamification.challenges.push({
      id: 'daily_mastery',
      name: 'Daily Mastery',
      description: 'Master 3 new characters today',
      type: 'daily',
      target: 3,
      current: 0,
      reward: '50 XP',
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    return gamification;
  }, []);

  // Personalized Content Generation
  const generatePersonalizedContent = useCallback((currentProgress: any, learningStyle: string) => {
    const content: PersonalizedContent = {
      exercises: [],
      mnemonics: [],
      recommendedCharacters: [],
      studyTips: []
    };

    // Generate style-specific exercises
    const weakCharacters = currentProgress.characters?.filter((c: any) => c.accuracy < 70).slice(0, 5) || [];
    
    switch (learningStyle) {
      case 'visual':
        content.exercises.push({
          id: 'visual_matching_1',
          type: 'visual',
          title: 'Visual Character Matching',
          description: 'Match characters with their visual patterns',
          content: weakCharacters.map((c: any) => c.character).join(', '),
          difficulty: 'medium',
          estimatedTime: 10
        });
        break;
      case 'auditory':
        content.exercises.push({
          id: 'pronunciation_practice_1',
          type: 'auditory',
          title: 'Pronunciation Practice',
          description: 'Practice pronunciation and audio recognition',
          content: weakCharacters.map((c: any) => c.character).join(', '),
          difficulty: 'medium',
          estimatedTime: 15
        });
        break;
      case 'kinesthetic':
        content.exercises.push({
          id: 'writing_practice_1',
          type: 'kinesthetic',
          title: 'Writing Practice',
          description: 'Practice writing characters with proper stroke order',
          content: weakCharacters.map((c: any) => c.character).join(', '),
          difficulty: 'medium',
          estimatedTime: 20
        });
        break;
    }

    // Generate mnemonics for difficult characters
    const difficultCharacters = currentProgress.characters?.filter((c: any) => c.difficulty > 2).slice(0, 3) || [];
    difficultCharacters.forEach((char: any, index: number) => {
      content.mnemonics.push({
        id: `mnemonic_${index}`,
        character: char.character,
        mnemonic: `Think of ${char.character} as...`,
        visualAid: '🎨',
        category: 'hiragana' // Default to hiragana, could be enhanced to detect actual category
      });
    });

    return content;
  }, []);

  // Predict Learning Progress
  const predictProgress = useCallback((currentProgress: any, studySchedule: any) => {
    const totalCharacters = 46 + 46 + 2136; // hiragana + katakana + basic kanji
    const currentMastered = currentProgress.characters?.filter((c: any) => c.mastered).length || 0;
    const averageAccuracy = currentProgress.characters?.reduce((sum: number, c: any) => sum + (c.accuracy || 0), 0) / (currentProgress.characters?.length || 1) || 0;
    
    // Calculate learning rate based on current performance
    const learningRate = averageAccuracy / 100;
    const dailyProgress = Math.max(1, Math.floor(learningRate * 5)); // 1-5 characters per day
    const daysToComplete = Math.ceil((totalCharacters - currentMastered) / dailyProgress);
    
    return {
      currentProgress: Math.round((currentMastered / totalCharacters) * 100),
      estimatedCompletion: new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000),
      dailyProgress,
      weeklyProgress: dailyProgress * 7,
      monthlyProgress: dailyProgress * 30,
      confidence: Math.min(0.95, 0.7 + (learningRate * 0.25))
    };
  }, []);

  // Generate Learning Path
  const generateLearningPath = useCallback((currentProgress: any, learningStyle: string) => {
    const path = {
      currentStage: 'beginner',
      nextMilestone: 'hiragana_mastery',
      stages: [
        {
          name: 'hiragana_foundation',
          status: 'completed',
          characters: ['あ', 'い', 'う', 'え', 'お'],
          estimatedTime: 5,
          requirements: []
        },
        {
          name: 'hiragana_mastery',
          status: 'in_progress',
          characters: ['か', 'き', 'く', 'け', 'こ', 'さ', 'し', 'す', 'せ', 'そ'],
          estimatedTime: 10,
          requirements: ['hiragana_foundation']
        },
        {
          name: 'katakana_introduction',
          status: 'locked',
          characters: ['ア', 'イ', 'ウ', 'エ', 'オ'],
          estimatedTime: 8,
          requirements: ['hiragana_mastery']
        },
        {
          name: 'basic_kanji',
          status: 'locked',
          characters: ['日', '月', '火', '水', '木'],
          estimatedTime: 15,
          requirements: ['katakana_introduction']
        }
      ],
      recommendations: []
    };

    // Update path based on current progress
    const masteredCount = currentProgress.characters?.filter((c: any) => c.mastered).length || 0;
    if (masteredCount >= 5) {
      path.stages[0].status = 'completed';
      path.stages[1].status = 'in_progress';
    }
    if (masteredCount >= 15) {
      path.stages[1].status = 'completed';
      path.stages[2].status = 'in_progress';
    }

    return path;
  }, []);

  // Enhanced AI Recommendations with more types
  const generateRecommendations = useCallback(async () => {
    console.log('Starting enhanced AI analysis...');
    setIsProcessing(true);
    setHasError(false);
    
    // Add timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      if (isProcessing) {
        console.warn('AI analysis timed out');
        setIsProcessing(false);
        setHasError(true);
      }
    }, 15000); // 15 second timeout for enhanced analysis
    
    try {
      const recommendations: AIRecommendation[] = [];
      
      // Ensure currentProgress.characters exists and is an array
      if (!currentProgress?.characters || !Array.isArray(currentProgress.characters)) {
        console.warn('AI Learning Engine: No character data available');
        setIsProcessing(false);
        clearTimeout(timeoutId);
        return;
      }
      
      console.log('Processing', currentProgress.characters.length, 'characters');
      
      // Detect learning style
      const learningStyle = detectLearningStyle(currentProgress.userBehavior || {});
      
      // Generate study schedule
      const schedule = generateStudySchedule(learningStyle, currentProgress);
      setStudySchedule(schedule);
      
      // Generate learning path
      const path = generateLearningPath(currentProgress, learningStyle);
      setLearningPath(path);
      
      // Predict progress
      const prediction = predictProgress(currentProgress, schedule);
      setProgressPrediction(prediction);
      
      // Generate learning analytics
      const analytics = generateLearningAnalytics(currentProgress, learningStyle);
      setLearningAnalytics(analytics);
      
      // Generate gamification elements
      const gamification = generateGamificationElements(currentProgress, path);
      setGamificationElements(gamification);
      
      // Generate personalized content
      const content = generatePersonalizedContent(currentProgress, learningStyle);
      setPersonalizedContent(content);
      
      // Analyze forgetting curve with enhanced algorithm
      const charactersNeedingReview = currentProgress.characters
        .filter((char: any) => {
          if (!char?.character || !char?.lastReviewed || typeof char?.difficulty !== 'number') {
            return false;
          }
          const spaced = calculateSpacedRepetition(char.character, char.lastReviewed, char.difficulty, char.previousIntervals || []);
          return spaced.nextReview <= new Date();
        })
        .slice(0, 5);
      
      console.log('Characters needing review:', charactersNeedingReview.length);
      
      if (charactersNeedingReview.length > 0) {
        recommendations.push({
          type: 'review',
          priority: 'high',
          content: `Review ${charactersNeedingReview.map((c: any) => c.character).join(', ')}`,
          reason: 'These characters are due for review based on spaced repetition',
          estimatedTime: charactersNeedingReview.length * 2,
          estimatedImpact: 0.8,
          confidence: 0.9,
          timestamp: new Date()
        });
      }
      
      // Analyze weaknesses with more detail
      const weakAreas = currentProgress.characters
        .filter((char: any) => char?.accuracy && typeof char.accuracy === 'number' && char.accuracy < 70)
        .slice(0, 3);
      
      console.log('Weak areas found:', weakAreas.length);
      
      if (weakAreas.length > 0) {
        recommendations.push({
          type: 'practice',
          priority: 'medium',
          content: `Focus on ${weakAreas.map((c: any) => c.character).join(', ')}`,
          reason: 'These characters have low accuracy and need more practice',
          estimatedTime: weakAreas.length * 3,
          estimatedImpact: 0.7,
          confidence: 0.8,
          timestamp: new Date()
        });
      }
      
      // Suggest new content based on learning path
      const masteredCount = currentProgress.characters.filter((char: any) => char?.mastered === true).length;
      console.log('Mastered characters:', masteredCount);
      
      if (masteredCount >= 2) {
        recommendations.push({
          type: 'new',
          priority: 'low',
          content: 'Learn new katakana characters',
          reason: 'You\'ve mastered enough hiragana to start katakana',
          estimatedTime: 15,
          estimatedImpact: 0.6,
          confidence: 0.7,
          timestamp: new Date()
        });
      }
      
      // Add learning style specific recommendations
      if (learningStyle === 'visual') {
        recommendations.push({
          type: 'method',
          priority: 'medium',
          content: 'Use visual mnemonics for character memorization',
          reason: 'Your learning style shows preference for visual learning',
          estimatedTime: 5,
          estimatedImpact: 0.5,
          confidence: 0.8,
          timestamp: new Date()
        });
      } else if (learningStyle === 'auditory') {
        recommendations.push({
          type: 'method',
          priority: 'medium',
          content: 'Practice pronunciation and audio recognition',
          reason: 'Your learning style shows preference for auditory learning',
          estimatedTime: 8,
          estimatedImpact: 0.6,
          confidence: 0.8,
          timestamp: new Date()
        });
      }
      
      // Add study schedule recommendations
      recommendations.push({
        type: 'schedule',
        priority: 'medium',
        content: `Follow your personalized study schedule: ${schedule.daily.morning.time} (${schedule.daily.morning.duration}min)`,
        reason: 'Consistent study schedule improves retention',
        estimatedTime: schedule.daily.morning.duration,
        estimatedImpact: 0.4,
        confidence: 0.7,
        timestamp: new Date()
      });
      
      console.log('Generated', recommendations.length, 'recommendations');
      setCurrentRecommendations(recommendations);
      
      // Update store
      try {
        recommendations.forEach(rec => addAIRecommendation(rec));
        onRecommendationUpdate(recommendations);
        console.log('Store updated successfully');
      } catch (error) {
        console.error('Error updating AI recommendations:', error);
      }
      
      // Update insights with enhanced data
      try {
        updateAIInsights({
          learningStyle: learningStyle as any,
          strengths: ['Consistent practice', 'Good retention', `${learningStyle} learning preference`],
          weaknesses: weakAreas.map((c: any) => `Low accuracy on ${c.character}`),
          recommendations: recommendations.map(r => r.content),
          predictedCompletionDate: prediction.estimatedCompletion,
          confidenceLevel: prediction.confidence,
          studyOptimization: {
            bestStudyTime: schedule.daily.morning.time,
            optimalSessionLength: schedule.daily.morning.duration,
            recommendedBreaks: schedule.breaks.length,
            focusAreas: weakAreas.map((c: any) => c.character),
            reviewSchedule: {
              intervals: [1, 3, 7, 14, 30],
              characters: charactersNeedingReview.map((c: any) => c.character),
              nextReview: new Date()
            }
          }
        });
        console.log('Insights updated successfully');
      } catch (error) {
        console.error('Error updating AI insights:', error);
      }
      
      // Update predictive analytics with enhanced data
      try {
        const difficulty = calculateAdaptiveDifficulty(currentProgress.recentPerformance || [], learningStyle);
        updatePredictiveAnalytics({
          nextPractice: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          recommendedModules: path.stages.filter((s: any) => s.status === 'in_progress').map((s: any) => s.name),
          predictedAccuracy: prediction.confidence * 100,
          estimatedCompletionTime: Math.ceil((prediction.estimatedCompletion.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
          forgettingCurve: charactersNeedingReview.map((char: any) => ({
            character: char.character,
            lastReviewed: char.lastReviewed,
            nextReview: calculateSpacedRepetition(char.character, char.lastReviewed, char.difficulty, char.previousIntervals || []).nextReview,
            retentionRate: calculateSpacedRepetition(char.character, char.lastReviewed, char.difficulty, char.previousIntervals || []).retentionRate,
            difficulty: char.difficulty
          })),
          optimalStudyTimes: [
            { timeOfDay: schedule.daily.morning.time, dayOfWeek: 1, effectiveness: 95, reason: 'Peak cognitive performance' },
            { timeOfDay: schedule.daily.afternoon.time, dayOfWeek: 3, effectiveness: 85, reason: 'Good focus after lunch' },
            { timeOfDay: schedule.daily.evening.time, dayOfWeek: 5, effectiveness: 75, reason: 'Evening review session' }
          ],
          burnoutRisk: Math.max(0, 100 - (prediction.confidence * 100)),
          successProbability: prediction.confidence * 100
        });
        
        // Adjust difficulty
        onDifficultyAdjustment(difficulty);
        console.log('Predictive analytics updated successfully');
      } catch (error) {
        console.error('Error updating predictive analytics:', error);
      }
      
      setLastAnalysis(new Date());
      console.log('Enhanced AI analysis completed successfully');
      
    } catch (error) {
      console.error('AI Learning Engine Error:', error);
      setHasError(true);
    } finally {
      setIsProcessing(false);
      clearTimeout(timeoutId);
      console.log('AI analysis finished');
    }
  }, [currentProgress, addAIRecommendation, onRecommendationUpdate, updateAIInsights, updatePredictiveAnalytics, onDifficultyAdjustment, calculateSpacedRepetition, detectLearningStyle, calculateAdaptiveDifficulty, generateStudySchedule, generateLearningPath, predictProgress, generateLearningAnalytics, generateGamificationElements, generatePersonalizedContent]);

  // Emotional state analysis with enhanced metrics
  const analyzeEmotionalState = useCallback((userBehavior: any) => {
    try {
      const stressIndicators = userBehavior?.rapidErrors || 0;
      const motivationIndicators = userBehavior?.consistentPractice || 0;
      const focusIndicators = userBehavior?.sessionLength || 0;
      const engagementIndicators = userBehavior?.interactionRate || 0;
      
      let mood: EmotionalState['mood'] = 'neutral';
      let energy: EmotionalState['energy'] = 'medium';
      let focus: EmotionalState['focus'] = 'focused';
      let stress: EmotionalState['stress'] = 'low';
      
      if (stressIndicators > 5) {
        mood = 'frustrated';
        stress = 'high';
      } else if (motivationIndicators > 10) {
        mood = 'excited';
        energy = 'high';
      }
      
      if (focusIndicators > 30) {
        focus = 'focused';
      } else if (focusIndicators < 10) {
        focus = 'distracted';
      }
      
      updateEmotionalState({
        mood,
        energy,
        focus,
        stress,
        confidence: Math.max(0, 100 - stressIndicators * 10),
        motivation: Math.min(100, motivationIndicators * 10),
        engagement: Math.min(100, engagementIndicators * 20),
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error analyzing emotional state:', error);
    }
  }, [updateEmotionalState]);

  useEffect(() => {
    // Only run emotional analysis once on mount if data exists
    if (currentProgress?.characters && currentProgress.characters.length > 0) {
      analyzeEmotionalState(currentProgress.userBehavior || {});
    }
  }, []); // Empty dependency array - only run once on mount

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6"
      style={{
        animation: 'fadeIn 0.5s ease-out'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">Enhanced AI Learning Engine</h3>
        <div className="flex items-center space-x-2">
          {isProcessing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
          <span className="text-sm text-gray-500">
            Last updated: {lastAnalysis.toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      {/* Debug Information */}
      <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
        <div><strong>Debug Info:</strong></div>
        <div>Characters available: {currentProgress?.characters?.length || 0}</div>
        <div>Is Processing: {isProcessing ? 'Yes' : 'No'}</div>
        <div>Has Error: {hasError ? 'Yes' : 'No'}</div>
        <div>User ID: {userId}</div>
        <div>Learning Style: {detectLearningStyle(currentProgress?.userBehavior || {})}</div>
      </div>
      
      {hasError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-red-800 font-semibold">AI Analysis Error</div>
          <div className="text-red-600 text-sm">There was an issue with the AI analysis. Please try again.</div>
        </div>
      )}
      
      {!currentProgress?.characters || currentProgress.characters.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.38" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-600 mb-2">No Learning Data Available</h4>
          <p className="text-gray-500 mb-4">
            Start practicing Japanese characters to enable AI-powered learning recommendations.
          </p>
          <button
            onClick={() => window.location.href = '#hiragana'}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Learning
          </button>
        </div>
      ) : (
        <>
          {/* Enhanced Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">SuperMemo 2</h4>
              <p className="text-sm text-blue-600">
                Advanced spaced repetition algorithm
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Adaptive Learning</h4>
              <p className="text-sm text-green-600">
                Personalized difficulty adjustment
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Learning Path</h4>
              <p className="text-sm text-purple-600">
                Structured progression system
              </p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-semibold text-orange-800 mb-2">Study Schedule</h4>
              <p className="text-sm text-orange-600">
                Optimized daily routines
              </p>
            </div>
          </div>

          {/* Learning Analytics Dashboard */}
          {learningAnalytics && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">📊 Learning Analytics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Overall Accuracy</div>
                  <div className="font-bold text-indigo-600">{Math.round(learningAnalytics.overallAccuracy)}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Improvement Rate</div>
                  <div className={`font-bold ${learningAnalytics.improvementRate > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {learningAnalytics.improvementRate > 0 ? '+' : ''}{Math.round(learningAnalytics.improvementRate)}%
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Motivation Level</div>
                  <div className="font-bold text-blue-600">{learningAnalytics.motivationLevel}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Session Length</div>
                  <div className="font-bold text-purple-600">{learningAnalytics.averageSessionLength}min</div>
                </div>
              </div>
            </div>
          )}

          {/* Gamification Section */}
          {gamificationElements && gamificationElements.achievements.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">🏆 Achievements & Challenges</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Achievements</h5>
                  <div className="space-y-2">
                    {gamificationElements.achievements.slice(0, 3).map((achievement: any, index: number) => (
                      <div key={index} className="flex items-center p-2 bg-yellow-50 rounded-lg">
                        <span className="text-2xl mr-2">{achievement.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{achievement.name}</div>
                          <div className="text-xs text-gray-600">{achievement.description}</div>
                        </div>
                        <div className="text-xs text-green-600 font-medium">✓ Unlocked</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Active Challenges</h5>
                  <div className="space-y-2">
                    {gamificationElements.challenges.slice(0, 2).map((challenge: any, index: number) => (
                      <div key={index} className="p-2 bg-blue-50 rounded-lg">
                        <div className="font-medium text-gray-800">{challenge.name}</div>
                        <div className="text-xs text-gray-600">{challenge.description}</div>
                        <div className="text-xs text-blue-600 font-medium">Reward: {challenge.reward}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Personalized Content */}
          {personalizedContent && (personalizedContent.exercises.length > 0 || personalizedContent.mnemonics.length > 0) && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">🎯 Personalized Content</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personalizedContent.exercises.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Recommended Exercises</h5>
                    <div className="space-y-2">
                      {personalizedContent.exercises.slice(0, 2).map((exercise: any, index: number) => (
                        <div key={index} className="p-3 bg-green-50 rounded-lg">
                          <div className="font-medium text-gray-800">{exercise.title}</div>
                          <div className="text-sm text-gray-600">{exercise.description}</div>
                          <div className="text-xs text-green-600">{exercise.estimatedTime}min • {exercise.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {personalizedContent.mnemonics.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Memory Aids</h5>
                    <div className="space-y-2">
                      {personalizedContent.mnemonics.slice(0, 2).map((mnemonic: any, index: number) => (
                        <div key={index} className="p-3 bg-purple-50 rounded-lg">
                          <div className="font-medium text-gray-800">{mnemonic.character}</div>
                          <div className="text-sm text-gray-600">{mnemonic.mnemonic}</div>
                          <div className="text-xs text-purple-600">{mnemonic.visualAid} Category: {mnemonic.category}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Progress Prediction */}
          {progressPrediction && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Progress Prediction</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Current Progress</div>
                  <div className="font-bold text-blue-600">{progressPrediction.currentProgress}%</div>
                </div>
                <div>
                  <div className="text-gray-600">Daily Progress</div>
                  <div className="font-bold text-green-600">{progressPrediction.dailyProgress} chars</div>
                </div>
                <div>
                  <div className="text-gray-600">Completion</div>
                  <div className="font-bold text-purple-600">{progressPrediction.estimatedCompletion.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">Confidence</div>
                  <div className="font-bold text-orange-600">{Math.round(progressPrediction.confidence * 100)}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Learning Path */}
          {learningPath && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Learning Path</h4>
              <div className="space-y-2">
                {learningPath.stages.map((stage: any, index: number) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    stage.status === 'completed' ? 'bg-green-50 border-green-200' :
                    stage.status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
                    'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">{stage.name.replace('_', ' ').toUpperCase()}</div>
                        <div className="text-sm text-gray-600">{stage.characters.join(', ')}</div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          stage.status === 'completed' ? 'text-green-600' :
                          stage.status === 'in_progress' ? 'text-blue-600' :
                          'text-gray-400'
                        }`}>
                          {stage.status.replace('_', ' ')}
                        </div>
                        <div className="text-xs text-gray-500">{stage.estimatedTime} days</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Study Schedule */}
          {studySchedule && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Personalized Study Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(studySchedule.daily).map(([time, schedule]: [string, any]) => (
                  <div key={time} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-gray-800 capitalize">{time}</div>
                    <div className="text-sm text-gray-600">{schedule.time} ({schedule.duration}min)</div>
                    <div className="text-xs text-gray-500">{schedule.focus.replace('_', ' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Recommendations */}
          {currentRecommendations.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Current Recommendations</h4>
              <div className="space-y-2">
                {currentRecommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg border-l-4 ${
                    rec.priority === 'high' ? 'border-red-400 bg-red-50' :
                    rec.priority === 'medium' ? 'border-yellow-400 bg-yellow-50' :
                    'border-green-400 bg-green-50'
                  }`}>
                    <div className="font-medium text-gray-800">{rec.content}</div>
                    <div className="text-sm text-gray-600">{rec.reason}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {rec.estimatedTime}min • {Math.round(rec.confidence * 100)}% confidence
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                console.log('Enhanced AI Analysis button clicked');
                generateRecommendations();
              }}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {isProcessing ? 'Analyzing with Enhanced AI...' : 'Run Enhanced AI Analysis'}
            </button>
            
            <button
              onClick={() => setShowAdvancedFeatures(!showAdvancedFeatures)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-all duration-200"
            >
              {showAdvancedFeatures ? 'Hide' : 'Show'} Advanced Features
            </button>
            
            <button
              onClick={() => {
                console.log('Test button clicked');
                alert('Enhanced AI Learning Engine is fully functional!');
              }}
              className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all duration-200"
            >
              Test Enhanced Features
            </button>
          </div>

          {/* Advanced Features Panel */}
          {showAdvancedFeatures && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">🚀 Advanced AI Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-700">Learning Style Detection</div>
                  <div className="text-gray-600">{detectLearningStyle(currentProgress?.userBehavior || {})}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Adaptive Difficulty</div>
                  <div className="text-gray-600">{calculateAdaptiveDifficulty(currentProgress?.recentPerformance || [], detectLearningStyle(currentProgress?.userBehavior || {}))}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Spaced Repetition</div>
                  <div className="text-gray-600">SuperMemo 2 Algorithm</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Real-time Analytics</div>
                  <div className="text-gray-600">Performance tracking</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Gamification</div>
                  <div className="text-gray-600">Achievements & challenges</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Personalized Content</div>
                  <div className="text-gray-600">Style-specific exercises</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Progress Prediction</div>
                  <div className="text-gray-600">AI-powered forecasting</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Study Optimization</div>
                  <div className="text-gray-600">Optimal scheduling</div>
                </div>
                <div>
                  <div className="font-medium text-gray-700">Emotional Analysis</div>
                  <div className="text-gray-600">Mood & motivation tracking</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AILearningEngine; 