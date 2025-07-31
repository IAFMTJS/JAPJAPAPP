import React, { useState } from 'react';
import { useStore, useProgress } from '../../store/useStore';

const PracticeTrackerScreen: React.FC = () => {
  const progress = useProgress();
  const { setCurrentSection } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'hiragana' | 'katakana' | 'kanji' | 'grammar'>('all');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const categories = [
    { id: 'all', name: 'All Categories', color: 'japanese-gold', icon: '📊' },
    { id: 'hiragana', name: 'Hiragana', color: 'japanese-red', icon: 'あ' },
    { id: 'katakana', name: 'Katakana', color: 'japanese-blue', icon: 'ア' },
    { id: 'kanji', name: 'Kanji', color: 'japanese-green', icon: '水' },
    { id: 'grammar', name: 'Grammar', color: 'japanese-purple', icon: 'は' }
  ];

  const getCategoryStats = (category: string) => {
    if (category === 'all') {
      return {
        total: progress.hiragana.length + progress.katakana.length + progress.kanji.length + progress.grammar.length,
        mastered: progress.hiragana.filter(p => p.mastered).length + 
                  progress.katakana.filter(p => p.mastered).length + 
                  progress.kanji.filter(p => p.mastered).length + 
                  progress.grammar.filter(p => p.mastered).length,
        accuracy: progress.overallAccuracy,
        practiceTime: progress.totalPracticeTime
      };
    }
    
    const categoryProgress = progress[category as keyof typeof progress] as any[];
    if (!Array.isArray(categoryProgress)) return { total: 0, mastered: 0, accuracy: 0, practiceTime: 0 };
    
    const total = categoryProgress.length;
    const mastered = categoryProgress.filter(p => p.mastered).length;
    const accuracy = total > 0 ? categoryProgress.reduce((sum, p) => sum + p.accuracy, 0) / total : 0;
    const practiceTime = categoryProgress.reduce((sum, p) => sum + p.timeSpent, 0) / 60;
    
    return { total, mastered, accuracy, practiceTime };
  };

  const getRecentSessions = () => {
    const filteredSessions = selectedCategory === 'all' 
      ? progress.practiceSessions
      : progress.practiceSessions.filter(s => s.type === selectedCategory);
    
    const now = new Date();
    const filteredByTime = filteredSessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      if (timeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return sessionDate >= weekAgo;
      } else if (timeRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return sessionDate >= monthAgo;
      }
      return true;
    });
    
    return filteredByTime.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
  };

  const getDailyStats = () => {
    const now = new Date();
    const filteredStats = progress.dailyStats.filter(stat => {
      const statDate = new Date(stat.date);
      if (timeRange === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return statDate >= weekAgo;
      } else if (timeRange === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return statDate >= monthAgo;
      }
      return true;
    });
    
    return filteredStats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProgressPercentage = (mastered: number, total: number) => {
    return total > 0 ? Math.round((mastered / total) * 100) : 0;
  };

  const recentSessions = getRecentSessions();
  const dailyStats = getDailyStats();
  const categoryStats = getCategoryStats(selectedCategory);

  return (
    <div className="min-h-screen p-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">Practice Tracker</h1>
              <p className="text-gray-600 text-lg">Track your learning progress and statistics</p>
            </div>
            <button
              onClick={() => setCurrentSection('home')}
              className="glass-card p-3 rounded-full hover:scale-110 transition-transform"
            >
              🏠
            </button>
          </div>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-gold mb-2">
                {formatTime(progress.totalPracticeTime)}
              </div>
              <div className="text-sm text-gray-600">Total Practice Time</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-blue mb-2">
                {progress.totalCharactersPracticed}
              </div>
              <div className="text-sm text-gray-600">Characters Practiced</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-green mb-2">
                {Math.round(progress.overallAccuracy)}%
              </div>
              <div className="text-sm text-gray-600">Overall Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-purple mb-2">
                {progress.currentStreak}
              </div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`glass-card rounded-2xl p-4 text-center transition-all ${
                  selectedCategory === category.id 
                    ? `ring-4 ring-${category.color} scale-105` 
                    : 'hover:scale-105'
                }`}
              >
                <div className={`text-3xl font-bold text-${category.color} mb-2`}>
                  {category.icon}
                </div>
                <div className="text-sm font-medium text-gray-700">{category.name}</div>
              </button>
            ))}
          </div>

          {/* Time Range Selection */}
          <div className="flex justify-center gap-4">
            {['week', 'month', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-japanese-gold text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Category Stats */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {categories.find(c => c.id === selectedCategory)?.name} Statistics
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-red mb-2">
                {categoryStats.total}
              </div>
              <div className="text-sm text-gray-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-blue mb-2">
                {categoryStats.mastered}
              </div>
              <div className="text-sm text-gray-600">Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-green mb-2">
                {Math.round(categoryStats.accuracy)}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-purple mb-2">
                {formatTime(categoryStats.practiceTime)}
              </div>
              <div className="text-sm text-gray-600">Practice Time</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Mastery Progress</span>
              <span className="text-sm text-gray-600">
                {categoryStats.mastered}/{categoryStats.total} ({getProgressPercentage(categoryStats.mastered, categoryStats.total)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="gradient-purple h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage(categoryStats.mastered, categoryStats.total)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Practice Sessions */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Recent Practice Sessions</h2>
          
          {recentSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600">No practice sessions found for the selected time range.</p>
              <p className="text-gray-500 text-sm mt-2">Start practicing to see your sessions here!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentSessions.slice(0, 10).map((session) => (
                <div key={session.id} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {session.type === 'hiragana' ? 'あ' : 
                         session.type === 'katakana' ? 'ア' : 
                         session.type === 'kanji' ? '水' : 'は'}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 capitalize">
                          {session.type} Practice
                        </div>
                        <div className="text-sm text-gray-600">
                          {formatDateTime(session.startTime)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">
                        {session.correctAnswers}/{session.totalQuestions} ({Math.round(session.accuracy)}%)
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round(session.duration / 60)}m • {session.charactersPracticed.length} characters
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Progress Chart */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Daily Progress</h2>
          
          {dailyStats.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📈</div>
              <p className="text-gray-600">No daily statistics available for the selected time range.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dailyStats.slice(0, 7).map((stat) => (
                <div key={stat.date} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-gray-800">
                        {formatDate(stat.date)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.sessions.length} practice sessions
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-800">
                        {formatTime(stat.totalPracticeTime)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {stat.charactersPracticed} characters • {Math.round(stat.accuracy)}% accuracy
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeTrackerScreen; 