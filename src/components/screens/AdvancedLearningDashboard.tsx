import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import AdvancedExerciseSystem from '../exercises/AdvancedExerciseSystem';
import { Exercise } from '../../types';

interface AdvancedLearningDashboardProps {
  onNavigate: (section: string) => void;
}

const AdvancedLearningDashboard: React.FC<AdvancedLearningDashboardProps> = ({
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'exercises' | 'progress' | 'challenges' | 'social'>('exercises');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [selectedFocusArea, setSelectedFocusArea] = useState<'hiragana' | 'katakana' | 'kanji' | 'grammar'>('hiragana');
  const [showExerciseSystem, setShowExerciseSystem] = useState(false);
  const [dailyGoal] = useState(100);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [weeklyStreak, setWeeklyStreak] = useState(0);
  const [totalStudyTime, setTotalStudyTime] = useState(0);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  
  const { gameState, progress, updateProgress } = useStore();

  // Initialize dashboard data
  useEffect(() => {
    // Simulate loading user data
    setDailyProgress(45);
    setWeeklyStreak(5);
    setTotalStudyTime(120);
    
    // Mock achievements
    setAchievements([
      {
        id: 'first_lesson',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        unlocked: true,
        progress: 100
      },
      {
        id: 'streak_7',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlocked: false,
        progress: 71
      },
      {
        id: 'accuracy_90',
        name: 'Precision Master',
        description: 'Achieve 90% accuracy',
        icon: '🎯',
        unlocked: false,
        progress: 85
      }
    ]);

    // Mock challenges
    setChallenges([
      {
        id: 'daily_practice',
        name: 'Daily Practice',
        description: 'Practice for 15 minutes today',
        type: 'daily',
        target: 15,
        current: 8,
        reward: '50 XP',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      {
        id: 'character_mastery',
        name: 'Character Master',
        description: 'Master 10 new characters',
        type: 'weekly',
        target: 10,
        current: 6,
        reward: '200 XP',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    ]);

    // Mock leaderboard
    setLeaderboard([
      { rank: 1, username: 'JapanesePro', xp: 2500, avatar: '🐱' },
      { rank: 2, username: 'KanjiMaster', xp: 2200, avatar: '🐧' },
      { rank: 3, username: 'HiraganaHero', xp: 1900, avatar: '🐱' },
      { rank: 4, username: 'GrammarGuru', xp: 1600, avatar: '🐧' },
      { rank: 5, username: 'StudyBuddy', xp: 1400, avatar: '🐱' }
    ]);
  }, []);

  const handleExerciseComplete = useCallback((exercise: Exercise, result: any) => {
    console.log('Exercise completed:', exercise, result);
    
    // Update daily progress
    setDailyProgress(prev => Math.min(prev + result.xpEarned, dailyGoal));
    
    // Check for achievements
    if (result.streak >= 5) {
      // Unlock streak achievement
      setAchievements(prev => prev.map(ach => 
        ach.id === 'streak_7' ? { ...ach, progress: Math.min(ach.progress + 20, 100) } : ach
      ));
    }
    
    if (result.score >= 100) {
      // Unlock accuracy achievement
      setAchievements(prev => prev.map(ach => 
        ach.id === 'accuracy_90' ? { ...ach, progress: Math.min(ach.progress + 10, 100) } : ach
      ));
    }
  }, [dailyGoal]);

  const handleProgressUpdate = useCallback((progress: any) => {
    console.log('Progress updated:', progress);
    // The updateProgress function expects specific parameters, not a progress object
    // For now, we'll just log the progress update
    // TODO: Implement proper progress update logic based on the progress object structure
  }, []);

  const startExerciseSession = useCallback(() => {
    setShowExerciseSystem(true);
  }, []);

  const renderProgressTab = () => (
    <div className="space-y-6">
      {/* Daily Progress */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Daily Progress</h3>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg">{dailyProgress} / {dailyGoal} XP</span>
          <span className="text-lg">{Math.round((dailyProgress / dailyGoal) * 100)}%</span>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((dailyProgress / dailyGoal) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{weeklyStreak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalStudyTime}</div>
            <div className="text-sm text-gray-600">Minutes Studied</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-md">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{gameState?.currentLevel || 1}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
        </div>
      </div>

      {/* Learning Areas */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Learning Areas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['hiragana', 'katakana', 'kanji', 'grammar'].map((area) => (
            <div key={area} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold capitalize">{area}</span>
                <span className="text-sm text-gray-600">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChallengesTab = () => (
    <div className="space-y-6">
      {/* Active Challenges */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Active Challenges</h3>
        <div className="space-y-4">
          {challenges.map((challenge) => (
            <div key={challenge.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{challenge.name}</h4>
                <span className="text-sm text-blue-600">{challenge.reward}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{challenge.current} / {challenge.target}</span>
                    <span>{Math.round((challenge.current / challenge.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((challenge.current / challenge.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  Continue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{achievement.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          achievement.unlocked ? 'bg-green-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      {/* Leaderboard */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Leaderboard</h3>
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div key={user.rank} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-lg">{user.avatar}</span>
                <div>
                  <div className="font-semibold">{user.username}</div>
                  <div className="text-sm text-gray-600">Rank #{user.rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">{user.xp} XP</div>
                <div className="text-sm text-gray-600">Level {Math.floor(user.xp / 100) + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study Groups */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Study Groups</h3>
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Beginner Japanese Learners</h4>
            <p className="text-sm text-gray-600 mb-3">A group for beginners to practice together</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">15 members • 3 online</span>
              <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                Join Group
              </button>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">Kanji Study Club</h4>
            <p className="text-sm text-gray-600 mb-3">Advanced kanji study and practice</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">8 members • 1 online</span>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                Join Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExercisesTab = () => (
    <div className="space-y-6">
      {/* Exercise Settings */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Exercise Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Focus Area
            </label>
            <select
              value={selectedFocusArea}
              onChange={(e) => setSelectedFocusArea(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hiragana">Hiragana</option>
              <option value="katakana">Katakana</option>
              <option value="kanji">Kanji</option>
              <option value="grammar">Grammar</option>
            </select>
          </div>
        </div>
        <div className="mt-6">
          <button
            onClick={startExerciseSession}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 font-medium"
          >
            Start Advanced Exercise Session
          </button>
        </div>
      </div>

      {/* Exercise Types Preview */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-bold mb-4">Available Exercise Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'Memory Game', icon: '🧠', desc: 'Match characters' },
            { name: 'Pattern Recognition', icon: '🔍', desc: 'Remember sequences' },
            { name: 'Voice Practice', icon: '🎤', desc: 'Pronunciation training' },
            { name: 'Gesture Learning', icon: '👋', desc: 'Interactive gestures' },
            { name: 'Speed Challenge', icon: '⚡', desc: 'Quick responses' },
            { name: 'Cultural Context', icon: '🏯', desc: 'Learn culture' }
          ].map((exercise) => (
            <div key={exercise.name} className="border rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">{exercise.icon}</div>
              <h4 className="font-semibold">{exercise.name}</h4>
              <p className="text-sm text-gray-600">{exercise.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (showExerciseSystem) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Advanced Learning System</h2>
          <button
            onClick={() => setShowExerciseSystem(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
        <AdvancedExerciseSystem
          onExerciseComplete={handleExerciseComplete}
          onProgressUpdate={handleProgressUpdate}
                           userProgress={progress}
          difficulty={selectedDifficulty}
          focusArea={selectedFocusArea}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Advanced Learning Dashboard</h2>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Level</div>
            <div className="text-xl font-bold text-blue-600">{gameState?.currentLevel || 1}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">XP</div>
            <div className="text-xl font-bold text-green-600">{gameState?.currentXP || 0}</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="flex border-b">
          {[
            { id: 'exercises', label: 'Exercises', icon: '🎯' },
            { id: 'progress', label: 'Progress', icon: '📊' },
            { id: 'challenges', label: 'Challenges', icon: '🏆' },
            { id: 'social', label: 'Social', icon: '👥' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'exercises' && renderExercisesTab()}
          {activeTab === 'progress' && renderProgressTab()}
          {activeTab === 'challenges' && renderChallengesTab()}
          {activeTab === 'social' && renderSocialTab()}
        </div>
      </div>
    </div>
  );
};

export default AdvancedLearningDashboard; 