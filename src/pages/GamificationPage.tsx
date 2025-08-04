import React from 'react';
import AdvancedGamificationSystem from '../components/gamification/AdvancedGamificationSystem';

const GamificationPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <AdvancedGamificationSystem
        userId="default"
        onLevelUp={(newLevel) => console.log('Level up to:', newLevel)}
        onAchievementUnlocked={(achievement) => console.log('Achievement unlocked:', achievement)}
        onBadgeEarned={(badge) => console.log('Badge earned:', badge)}
        onChallengeCompleted={(challenge) => console.log('Challenge completed:', challenge)}
      />
    </div>
  );
};

export default GamificationPage; 