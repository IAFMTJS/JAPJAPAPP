import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import Icons from '../ui/Icons';
import { NavigationSection } from '../../types';

interface ProgressTrackingScreenProps {
  onNavigate: (section: NavigationSection) => void;
}

const ProgressTrackingScreen: React.FC<ProgressTrackingScreenProps> = ({
  onNavigate
}) => {
  const { ready } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'weekly' | 'mobile' | 'export'>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);

  const {
    progress,
    learningAnalytics,
    gameState,
    achievements,
    syncProgress,
    exportProgress,
    importProgress,
    updateMobileUsage
  } = useStore();

  // Auto-sync progress when component mounts
  useEffect(() => {
    const syncData = async () => {
      try {
        await syncProgress();
        // Update mobile usage stats
        updateMobileUsage({
          sessions: learningAnalytics.mobileUsage.sessions + 1,
          totalTime: learningAnalytics.mobileUsage.totalTime + (learningAnalytics.sessionData.duration || 0),
        });
      } catch (error) {
        console.error('Failed to sync progress:', error);
      }
    };

    syncData();
  }, [syncProgress, updateMobileUsage, learningAnalytics.sessionData.duration, learningAnalytics.mobileUsage]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const data = exportProgress();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `japjap-progress-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [exportProgress]);

  const handleImport = useCallback(async () => {
    if (!importData.trim()) return;
    
    setIsImporting(true);
    try {
      const success = importProgress(importData);
      if (success) {
        setShowImportModal(false);
        setImportData('');
        alert('Progress imported successfully!');
      } else {
        alert('Invalid import data format');
      }
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please check the data format.');
    } finally {
      setIsImporting(false);
    }
  }, [importProgress, importData]);

  // Don't render until i18n is ready
  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const calculateOverallProgress = () => {
    const hiragana = Array.isArray(progress.hiragana) ? progress.hiragana : [];
    const katakana = Array.isArray(progress.katakana) ? progress.katakana : [];
    const kanji = Array.isArray(progress.kanji) ? progress.kanji : [];
    const totalCharacters = hiragana.length + katakana.length + kanji.length;
    const masteredCharacters = hiragana.filter(p => p.mastered).length +
                              katakana.filter(p => p.mastered).length +
                              kanji.filter(p => p.mastered).length;
    
    return totalCharacters > 0 ? Math.round((masteredCharacters / totalCharacters) * 100) : 0;
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const weekKey = weekStart.toISOString().split('T')[0];
    
    return learningAnalytics.weeklyProgress[weekKey] || {
      totalTime: 0,
      averageAccuracy: 0,
      exercisesCompleted: 0,
      streakDays: 0,
      improvementRate: 0,
    };
  };

  const getDailyStats = () => {
    const today = new Date().toISOString().split('T')[0];
    return learningAnalytics.dailyProgress[today] || {
      totalTime: 0,
      exercisesCompleted: 0,
      accuracy: 0,
      streak: 0,
      achievements: [],
      focusAreas: [],
    };
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Overall Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500">{calculateOverallProgress()}%</div>
            <div className="text-sm text-gray-600">Mastery Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-500">{gameState.currentLevel}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-500">{gameState.streak}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Character Progress */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Character Progress</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { type: 'Hiragana', data: Array.isArray(progress.hiragana) ? (progress.hiragana as any[]) : [], color: 'bg-red-500' },
            { type: 'Katakana', data: Array.isArray(progress.katakana) ? (progress.katakana as any[]) : [], color: 'bg-blue-500' },
            { type: 'Kanji', data: Array.isArray(progress.kanji) ? (progress.kanji as any[]) : [], color: 'bg-green-500' },
            { type: 'Grammar', data: Array.isArray(progress.grammar) ? (progress.grammar as any[]) : [], color: 'bg-purple-500' },
          ].map(({ type, data, color }) => {
            const mastered = data.filter((p: any) => p.mastered).length;
            const total = data.length;
            const percentage = total > 0 ? Math.round((mastered / total) * 100) : 0;
            
            return (
              <div key={type} className="text-center">
                <div className={`w-16 h-16 ${color} rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold`}>
                  {mastered}
                </div>
                <div className="text-sm font-semibold text-gray-800">{type}</div>
                <div className="text-xs text-gray-600">{mastered}/{total} ({percentage}%)</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.slice(-6).map((achievement, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <Icons name="trophy" size={20} color="white" />
              </div>
              <div>
                <div className="font-semibold text-gray-800">{achievement.name || 'Achievement'}</div>
                <div className="text-sm text-gray-600">{achievement.description || ''}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDailyTab = () => {
    const dailyStats = getDailyStats();
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Today's Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{dailyStats.totalTime} min</div>
              <div className="text-sm text-gray-600">Study Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{dailyStats.exercisesCompleted}</div>
              <div className="text-sm text-gray-600">Exercises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{dailyStats.accuracy}%</div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{dailyStats.streak}</div>
              <div className="text-sm text-gray-600">Streak</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Focus Areas</h3>
          <div className="flex flex-wrap gap-2">
            {dailyStats.focusAreas.map((area: any, index: number) => (
              <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderWeeklyTab = () => {
    const weeklyStats = getWeeklyStats();
    
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">This Week's Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{weeklyStats.totalTime} min</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{weeklyStats.exercisesCompleted}</div>
              <div className="text-sm text-gray-600">Exercises</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{weeklyStats.averageAccuracy}%</div>
              <div className="text-sm text-gray-600">Avg Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{weeklyStats.streakDays}</div>
              <div className="text-sm text-gray-600">Active Days</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Improvement Rate</h3>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-500">{weeklyStats.improvementRate}%</div>
            <div className="text-sm text-gray-600">vs Last Week</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMobileTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Mobile Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{learningAnalytics.mobileUsage.sessions}</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{learningAnalytics.mobileUsage.totalTime} min</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">{learningAnalytics.mobileUsage.offlineUsage}</div>
            <div className="text-sm text-gray-600">Offline Usage</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Last Sync</h3>
        <div className="text-center">
          <div className="text-lg text-gray-800">
            {learningAnalytics.mobileUsage.lastSync 
              ? new Date(learningAnalytics.mobileUsage.lastSync).toLocaleString()
              : 'Never'
            }
          </div>
          <button
            onClick={() => syncProgress()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Sync Now
          </button>
        </div>
      </div>
    </div>
  );

  const renderExportTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Export Progress</h3>
        <p className="text-gray-600 mb-4">
          Download your learning progress as a JSON file. You can use this to backup your data or transfer it to another device.
        </p>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isExporting ? 'Exporting...' : 'Export Progress'}
        </button>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Import Progress</h3>
        <p className="text-gray-600 mb-4">
          Import previously exported progress data. This will overwrite your current progress.
        </p>
        <button
          onClick={() => setShowImportModal(true)}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Import Progress
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Progress Tracking</h1>
        <p className="text-gray-600">Monitor your learning journey and track your achievements</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: 'overview', label: 'Overview', icon: 'chart' },
          { id: 'daily', label: 'Daily', icon: 'calendar' },
          { id: 'weekly', label: 'Weekly', icon: 'chart-bar' },
          { id: 'mobile', label: 'Mobile', icon: 'mobile' },
          { id: 'export', label: 'Export/Import', icon: 'download' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Icons name={tab.icon as any} size={16} color="currentColor" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'daily' && renderDailyTab()}
        {activeTab === 'weekly' && renderWeeklyTab()}
        {activeTab === 'mobile' && renderMobileTab()}
        {activeTab === 'export' && renderExportTab()}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Import Progress</h3>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              placeholder="Paste your exported progress data here..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none"
            />
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleImport}
                disabled={isImporting || !importData.trim()}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                {isImporting ? 'Importing...' : 'Import'}
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportData('');
                }}
                className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTrackingScreen; 