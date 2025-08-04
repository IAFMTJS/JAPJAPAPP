import React from 'react';
import AILearningEngine from '../components/ai/AILearningEngine';

const AITutorPage: React.FC = () => {
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
};

export default AITutorPage; 