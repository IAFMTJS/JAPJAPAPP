import React, { useState, useEffect, useCallback } from 'react';
// Removed framer-motion import due to compatibility issues
import { useStore } from '../../store/useStore';
import { Achievement, Badge, Challenge, Reward } from '../../types';

interface AdvancedGamificationSystemProps {
  userId: string;
  onLevelUp: (newLevel: number) => void;
  onAchievementUnlocked: (achievement: Achievement) => void;
  onBadgeEarned: (badge: Badge) => void;
  onChallengeCompleted: (challenge: Challenge) => void;
}

const AdvancedGamificationSystem: React.FC<AdvancedGamificationSystemProps> = ({
  userId,
  onLevelUp,
  onAchievementUnlocked,
  onBadgeEarned,
  onChallengeCompleted,
}) => {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [currentBadge, setCurrentBadge] = useState<Badge | null>(null);
  
  const { 
    gameState, 
    achievements, 
    challenges,
    updateGameState, 
    addAchievement, 
    addBadge, 
    addChallenge,
    completeChallenge 
  } = useStore();

  // XP and Leveling System
  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  // const calculateXPForNextLevel = (currentLevel: number) => {
  //   return currentLevel * 100;
  // };

  const addXP = (amount: number) => {
    const currentXP = gameState.currentXP;
    const newXP = currentXP + amount;
    const currentLevel = calculateLevel(currentXP);
    const newLevel = calculateLevel(newXP);
    
    updateGameState({ currentXP: newXP });
    
    if (newLevel > currentLevel) {
      setShowLevelUp(true);
      onLevelUp(newLevel);
      
      // Level up rewards
      const rewards: Reward[] = [
        { type: 'coins', value: newLevel * 50, description: `Level ${newLevel} bonus!` },
        { type: 'gems', value: newLevel * 5, description: 'Rare gems earned!' },
        { type: 'streak_protection', value: 1, description: 'Streak protection item!' }
      ];
      
      // Add rewards to inventory
      updateGameState({
        coins: (gameState.coins || 0) + (rewards[0].value as number),
        gems: (gameState.gems || 0) + (rewards[1].value as number),
        streakProtectionItems: (gameState.streakProtectionItems || 0) + (rewards[2].value as number)
      });
      
      setTimeout(() => setShowLevelUp(false), 3000);
    }
  };

  // Achievement System
  const checkAchievements = useCallback((action: string, value: number) => {
    const achievementDefinitions: Achievement[] = [
      {
        id: 'first-lesson',
        name: 'First Steps',
        description: 'Complete your first lesson',
        xpReward: 50,
        unlocked: false,
        rarity: 'common',
        category: 'learning',
        requirements: [{ type: 'lessons', target: 1, current: 0, completed: false, description: 'Complete 1 lesson' }],
        icon: '🎯',
        animation: 'bounce',
        social: false
      },
      {
        id: 'streak-7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day study streak',
        xpReward: 200,
        unlocked: false,
        rarity: 'rare',
        category: 'streak',
        requirements: [{ type: 'streak', target: 7, current: 0, completed: false, description: 'Maintain 7-day streak' }],
        icon: '🔥',
        animation: 'pulse',
        social: true
      },
      {
        id: 'accuracy-90',
        name: 'Precision Master',
        description: 'Achieve 90% accuracy in a session',
        xpReward: 150,
        unlocked: false,
        rarity: 'rare',
        category: 'performance',
        requirements: [{ type: 'accuracy', target: 90, current: 0, completed: false, description: 'Achieve 90% accuracy' }],
        icon: '🎯',
        animation: 'spin',
        social: false
      },
      {
        id: 'kanji-master',
        name: 'Kanji Master',
        description: 'Master 100 kanji characters',
        xpReward: 500,
        unlocked: false,
        rarity: 'epic',
        category: 'learning',
        requirements: [{ type: 'characters', target: 100, current: 0, completed: false, description: 'Master 100 kanji' }],
        icon: '🗾',
        animation: 'glow',
        social: true
      }
    ];

    achievementDefinitions.forEach(achievement => {
      if (!achievement.unlocked) {
        const requirement = achievement.requirements[0];
        if (requirement.type === action) {
          requirement.current = value;
          requirement.completed = value >= requirement.target;
          
          if (requirement.completed) {
            achievement.unlocked = true;
            achievement.unlockedAt = new Date();
            
            addAchievement(achievement);
            addXP(achievement.xpReward);
            
            setCurrentAchievement(achievement);
            setShowAchievement(true);
            onAchievementUnlocked(achievement);
            
            setTimeout(() => setShowAchievement(false), 4000);
          }
        }
      }
    });
  }, [addAchievement, addXP, onAchievementUnlocked]);

  // Badge System
  const checkBadges = useCallback((action: string, value: number) => {
    const badgeDefinitions: Badge[] = [
      {
        id: 'speed-demon',
        name: 'Speed Demon',
        description: 'Complete exercises quickly',
        icon: '⚡',
        unlocked: false,
        rarity: 'rare',
        category: 'performance',
        requirements: [{ type: 'accuracy', target: 80, current: 0, completed: false }],
        xpReward: 100,
        animation: 'flash'
      },
      {
        id: 'persistent-learner',
        name: 'Persistent Learner',
        description: 'Study for 30 days in a row',
        icon: '💪',
        unlocked: false,
        rarity: 'epic',
        category: 'dedication',
        requirements: [{ type: 'streak', target: 30, current: 0, completed: false }],
        xpReward: 300,
        animation: 'shake'
      }
    ];

    badgeDefinitions.forEach(badge => {
      if (!badge.unlocked) {
        const requirement = badge.requirements[0];
        if (requirement.type === action) {
          requirement.current = value;
          requirement.completed = value >= requirement.target;
          
          if (requirement.completed) {
            badge.unlocked = true;
            badge.unlockedAt = new Date();
            
            addBadge(badge);
            addXP(badge.xpReward);
            
            setCurrentBadge(badge);
            setShowBadge(true);
            onBadgeEarned(badge);
            
            setTimeout(() => setShowBadge(false), 4000);
          }
        }
      }
    });
  }, [addBadge, addXP, onBadgeEarned]);

  // Challenge System
  const generateDailyChallenges = useCallback(() => {
    const dailyChallenges: Challenge[] = [
      {
        id: 'daily-practice-15',
        type: 'daily',
        title: '15-Minute Practice',
        description: 'Practice for at least 15 minutes today',
        requirements: [{ type: 'practice_time', target: 15, current: 0, completed: false }],
        rewards: [{ type: 'xp', value: 100, description: '100 XP' }],
        participants: [],
        leaderboard: [],
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        completed: false
      },
      {
        id: 'daily-accuracy-85',
        type: 'daily',
        title: 'High Accuracy',
        description: 'Achieve 85% accuracy in any session',
        requirements: [{ type: 'accuracy', target: 85, current: 0, completed: false }],
        rewards: [{ type: 'coins', value: 50, description: '50 coins' }],
        participants: [],
        leaderboard: [],
        startDate: new Date(),
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        completed: false
      }
    ];

    dailyChallenges.forEach(challenge => {
      if (!challenges.find(c => c.id === challenge.id)) {
        addChallenge(challenge);
      }
    });
  }, [challenges, addChallenge]);

  // Streak Protection
  // const useStreakProtection = () => {
  //   if (gameState.streakProtectionItems && gameState.streakProtectionItems > 0) {
  //     updateGameState({
  //       streakProtectionItems: gameState.streakProtectionItems - 1,
  //       streakProtected: true
  //     });
  //     return true;
  //   }
  //   return false;
  // };

  // Virtual Economy
  // const spendCoins = (amount: number) => {
  //   if (gameState.coins && gameState.coins >= amount) {
  //     updateGameState({ coins: gameState.coins - amount });
  //     return true;
  //   }
  //   return false;
  // };

  // const spendGems = (amount: number) => {
  //   if (gameState.gems && gameState.gems >= amount) {
  //     updateGameState({ gems: gameState.gems - amount });
  //     return true;
  //   }
  //   return false;
  // };

  useEffect(() => {
    // Generate daily challenges
    generateDailyChallenges();
    
    // Check for achievements and badges based on current progress
    checkAchievements('lessons', gameState.lessonsCompleted || 0);
    checkAchievements('streak', gameState.streak || 0);
    checkBadges('consecutive_days', gameState.streak || 0);
  }, [generateDailyChallenges, checkAchievements, checkBadges, gameState.lessonsCompleted, gameState.streak]);

  return (
    <div className="space-y-6">
      {/* Level and XP Display */}
      <div
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white animate-fade-in"
        style={{
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold">Level {calculateLevel(gameState.currentXP)}</h3>
            <p className="text-purple-100">Keep learning to level up!</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">{gameState.currentXP}</p>
            <p className="text-purple-100">Total XP</p>
          </div>
        </div>
        
                 <div className="w-full bg-purple-300 rounded-full h-3">
           <div
             className="bg-white h-3 rounded-full transition-all duration-1000"
             style={{ width: `${(gameState.currentXP % 100)}%` }}
           />
         </div>
        <p className="text-sm text-purple-100 mt-2">
          {gameState.currentXP % 100} / 100 XP to next level
        </p>
      </div>

      {/* Virtual Economy */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
        style={{
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Virtual Economy</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">🪙</div>
            <p className="text-lg font-semibold">{gameState.coins || 0}</p>
            <p className="text-sm text-gray-600">Coins</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">💎</div>
            <p className="text-lg font-semibold">{gameState.gems || 0}</p>
            <p className="text-sm text-gray-600">Gems</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">🛡️</div>
            <p className="text-lg font-semibold">{gameState.streakProtectionItems || 0}</p>
            <p className="text-sm text-gray-600">Protection</p>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
        style={{
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Achievements</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     {achievements.slice(0, 8).map((achievement) => (
             <div
               key={achievement.id}
               className={`text-center p-4 rounded-lg border-2 transition-transform hover:scale-105 ${
                 achievement.unlocked 
                   ? 'border-green-500 bg-green-50' 
                   : 'border-gray-300 bg-gray-50'
               }`}
             >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="font-semibold text-sm">{achievement.name}</p>
              <p className="text-xs text-gray-600">{achievement.xpReward} XP</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Challenges */}
      <div
        className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
        style={{
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4">Daily Challenges</h3>
        <div className="space-y-4">
                     {challenges.filter(c => c.type === 'daily').map((challenge) => (
             <div
               key={challenge.id}
               className={`p-4 rounded-lg border-2 transition-transform hover:scale-102 ${
                 challenge.completed 
                   ? 'border-green-500 bg-green-50' 
                   : 'border-blue-300 bg-blue-50'
               }`}
             >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{challenge.title}</h4>
                  <p className="text-sm text-gray-600">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">
                    {challenge.requirements[0].current} / {challenge.requirements[0].target}
                  </p>
                  <p className="text-xs text-gray-500">
                    {challenge.rewards[0].value} {challenge.rewards[0].type}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Level Up Animation */}
      {showLevelUp && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0" />
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-8 rounded-lg text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold mb-2">Level Up!</h2>
            <p className="text-xl">Congratulations on reaching level {calculateLevel(gameState.currentXP)}!</p>
          </div>
        </div>
      )}

      {/* Achievement Unlocked Animation */}
      {showAchievement && currentAchievement && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{currentAchievement.icon}</div>
            <div>
              <h3 className="font-bold">Achievement Unlocked!</h3>
              <p className="text-sm">{currentAchievement.name}</p>
              <p className="text-xs">+{currentAchievement.xpReward} XP</p>
            </div>
          </div>
        </div>
      )}

      {/* Badge Earned Animation */}
      {showBadge && currentBadge && (
        <div className="fixed top-20 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{currentBadge.icon}</div>
            <div>
              <h3 className="font-bold">Badge Earned!</h3>
              <p className="text-sm">{currentBadge.name}</p>
              <p className="text-xs">+{currentBadge.xpReward} XP</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedGamificationSystem; 