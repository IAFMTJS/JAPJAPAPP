import React, { useEffect, useState } from 'react';
// Removed framer-motion import due to compatibility issues
import { useStore } from '../../store/useStore';
import { AIRecommendation, LearningPath, EmotionalState, PredictiveAnalytics } from '../../types';

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
  const { 
    addAIRecommendation, 
    updateAIInsights, 
    updateLearningPath, 
    updateEmotionalState,
    updatePredictiveAnalytics 
  } = useStore();

  // Spaced Repetition Algorithm
  const calculateSpacedRepetition = (character: string, lastReviewed: Date, difficulty: number) => {
    const now = new Date();
    const daysSinceReview = Math.floor((now.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60 * 24));
    
    // SuperMemo 2 algorithm simplified
    const easeFactor = Math.max(1.3, 2.5 - 0.15 * difficulty);
    const interval = Math.floor(daysSinceReview * easeFactor);
    
    return {
      nextReview: new Date(now.getTime() + interval * 24 * 60 * 60 * 1000),
      retentionRate: Math.max(0, 100 - (difficulty * 10)),
      priority: interval < 1 ? 'high' : interval < 3 ? 'medium' : 'low'
    };
  };

  // Adaptive Difficulty System
  const calculateAdaptiveDifficulty = (recentPerformance: any[]) => {
    const accuracy = recentPerformance.reduce((sum, p) => sum + p.accuracy, 0) / recentPerformance.length;
    const speed = recentPerformance.reduce((sum, p) => sum + p.speed, 0) / recentPerformance.length;
    
    if (accuracy > 90 && speed > 80) return 'hard';
    if (accuracy < 70 || speed < 50) return 'easy';
    return 'medium';
  };

  // Learning Style Detection
  const detectLearningStyle = (userBehavior: any) => {
    const visualScore = userBehavior.visualInteractions || 0;
    const auditoryScore = userBehavior.audioInteractions || 0;
    const kinestheticScore = userBehavior.handwritingInteractions || 0;
    
    const total = visualScore + auditoryScore + kinestheticScore;
    if (total === 0) return 'mixed';
    
    const visualPercent = (visualScore / total) * 100;
    const auditoryPercent = (auditoryScore / total) * 100;
    const kinestheticPercent = (kinestheticScore / total) * 100;
    
    if (visualPercent > 50) return 'visual';
    if (auditoryPercent > 50) return 'auditory';
    if (kinestheticPercent > 50) return 'kinesthetic';
    return 'mixed';
  };

  // Generate AI Recommendations
  const generateRecommendations = async () => {
    setIsProcessing(true);
    
    try {
      const recommendations: AIRecommendation[] = [];
      
      // Analyze forgetting curve
      const charactersNeedingReview = currentProgress.characters
        .filter((char: any) => {
          const spaced = calculateSpacedRepetition(char.character, char.lastReviewed, char.difficulty);
          return spaced.nextReview <= new Date();
        })
        .slice(0, 5);
      
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
      
      // Analyze weaknesses
      const weakAreas = currentProgress.characters
        .filter((char: any) => char.accuracy < 70)
        .slice(0, 3);
      
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
      
      // Suggest new content
      const masteredCount = currentProgress.characters.filter((char: any) => char.mastered).length;
      if (masteredCount >= 10) {
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
      
      // Update store
      recommendations.forEach(rec => addAIRecommendation(rec));
      onRecommendationUpdate(recommendations);
      
      // Update insights
      const learningStyle = detectLearningStyle(currentProgress.userBehavior || {});
      updateAIInsights({
        learningStyle: learningStyle as any,
        strengths: ['Consistent practice', 'Good retention'],
        weaknesses: weakAreas.map((c: any) => `Low accuracy on ${c.character}`),
        recommendations: recommendations.map(r => r.content),
        predictedCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        confidenceLevel: 0.8,
        studyOptimization: {
          bestStudyTime: '09:00',
          optimalSessionLength: 25,
          recommendedBreaks: 5,
          focusAreas: weakAreas.map((c: any) => c.character),
          reviewSchedule: {
            intervals: [1, 3, 7, 14, 30],
            characters: charactersNeedingReview.map((c: any) => c.character),
            nextReview: new Date()
          }
        }
      });
      
      // Update predictive analytics
      const difficulty = calculateAdaptiveDifficulty(currentProgress.recentPerformance || []);
      updatePredictiveAnalytics({
        nextPractice: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        recommendedModules: ['hiragana', 'katakana'],
        predictedAccuracy: 85,
        estimatedCompletionTime: 120,
        forgettingCurve: charactersNeedingReview.map((char: any) => ({
          character: char.character,
          lastReviewed: char.lastReviewed,
          nextReview: calculateSpacedRepetition(char.character, char.lastReviewed, char.difficulty).nextReview,
          retentionRate: calculateSpacedRepetition(char.character, char.lastReviewed, char.difficulty).retentionRate,
          difficulty: char.difficulty
        })),
        optimalStudyTimes: [
          { timeOfDay: '09:00', dayOfWeek: 1, effectiveness: 95, reason: 'Peak cognitive performance' },
          { timeOfDay: '14:00', dayOfWeek: 3, effectiveness: 85, reason: 'Good focus after lunch' },
          { timeOfDay: '20:00', dayOfWeek: 5, effectiveness: 75, reason: 'Evening review session' }
        ],
        burnoutRisk: 15,
        successProbability: 88
      });
      
      // Adjust difficulty
      onDifficultyAdjustment(difficulty);
      
      setLastAnalysis(new Date());
      
    } catch (error) {
      console.error('AI Learning Engine Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Emotional state analysis
  const analyzeEmotionalState = (userBehavior: any) => {
    const stressIndicators = userBehavior.rapidErrors || 0;
    const motivationIndicators = userBehavior.consistentPractice || 0;
    const focusIndicators = userBehavior.sessionLength || 0;
    
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
      lastUpdated: new Date()
    });
  };

  useEffect(() => {
    // Run AI analysis every 5 minutes or when progress changes significantly
    const interval = setInterval(() => {
      generateRecommendations();
      analyzeEmotionalState(currentProgress.userBehavior || {});
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [currentProgress]);

  useEffect(() => {
    // Initial analysis
    generateRecommendations();
    analyzeEmotionalState(currentProgress.userBehavior || {});
  }, []);

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
      style={{
        animation: 'fadeIn 0.5s ease-out'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">AI Learning Engine</h3>
        <div className="flex items-center space-x-2">
          {isProcessing && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          )}
          <span className="text-sm text-gray-500">
            Last updated: {lastAnalysis.toLocaleTimeString()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">Spaced Repetition</h4>
          <p className="text-sm text-blue-600">
            Optimizing review schedule for maximum retention
          </p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <h4 className="font-semibold text-green-800 mb-2">Adaptive Difficulty</h4>
          <p className="text-sm text-green-600">
            Adjusting content based on your performance
          </p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4">
          <h4 className="font-semibold text-purple-800 mb-2">Learning Style</h4>
          <p className="text-sm text-purple-600">
            Personalizing content to your preferences
          </p>
        </div>
      </div>
      
      <button
        onClick={generateRecommendations}
        disabled={isProcessing}
        className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isProcessing ? 'Analyzing...' : 'Refresh AI Analysis'}
      </button>
    </div>
  );
};

export default AILearningEngine; 