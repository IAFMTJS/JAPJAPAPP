import React, { useState } from 'react';
import { useStore, useUser, useAudioSettings } from '../../store/useStore';

const ProfileScreen: React.FC = () => {
  const user = useUser();
  const audioSettings = useAudioSettings();
  const { setUser, updateAudioSettings, setCurrentSection } = useStore();
  
  const [selectedAvatar, setSelectedAvatar] = useState<'maneki-neko' | 'penguin-kimono'>(user?.avatar || 'maneki-neko');
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'nl'>(user?.language || 'en');
  const [selectedTheme, setSelectedTheme] = useState(user?.theme || 'light');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>(user?.difficulty || 'beginner');

  const handleSaveSettings = () => {
    setUser({
      ...user!,
      avatar: selectedAvatar,
      language: selectedLanguage,
      theme: selectedTheme,
      difficulty
    });
    
    // Show success message
    alert('Settings saved successfully! 🎉');
  };

  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setUser({
        ...user!,
        level: 1,
        xp: 0,
        streak: 0
      });
      // Reset progress in the store
      // Note: This would need to be implemented in the store if needed
      alert('Progress reset successfully! 🔄');
    }
  };

  return (
    <div className="min-h-screen p-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="absolute top-10 left-10 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gradient">Profile & Settings</h1>
            <button
              onClick={() => setCurrentSection('home')}
              className="glass-card p-3 rounded-full hover:scale-110 transition-transform"
            >
              🏠
            </button>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 gradient-red rounded-full flex items-center justify-center text-white text-5xl shadow-lg">
              {selectedAvatar === 'maneki-neko' ? '🐱' : '🐧'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{user?.username}</h2>
              <div className="flex items-center space-x-4 text-gray-600">
                <span>Level {user?.level}</span>
                <span>•</span>
                <span>{user?.xp} XP</span>
                <span>•</span>
                <span>🔥 {user?.streak} day streak</span>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Avatar Selection */}
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Choose Your Mascot</h3>
            <div className="grid grid-cols-2 gap-4">
              <div 
                onClick={() => setSelectedAvatar('maneki-neko')}
                className={`glass-card rounded-2xl p-6 cursor-pointer transition-all ${
                  selectedAvatar === 'maneki-neko' ? 'ring-4 ring-japanese-red' : 'hover:scale-105'
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🐱</div>
                  <h4 className="font-bold text-japanese-red">Maneki Neko</h4>
                  <p className="text-sm text-gray-600 mt-2">Lucky learning companion</p>
                </div>
              </div>
              
              <div 
                onClick={() => setSelectedAvatar('penguin-kimono')}
                className={`glass-card rounded-2xl p-6 cursor-pointer transition-all ${
                  selectedAvatar === 'penguin-kimono' ? 'ring-4 ring-japanese-blue' : 'hover:scale-105'
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🐧</div>
                  <h4 className="font-bold text-japanese-blue">Penguin Sensei</h4>
                  <p className="text-sm text-gray-600 mt-2">Wise teacher</p>
                </div>
              </div>
            </div>
          </div>

          {/* Language & Theme */}
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Preferences</h3>
            
            <div className="space-y-6">
              {/* Language */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Language</label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'nl')}
                  className="input-modern w-full"
                >
                  <option value="en">English</option>
                  <option value="nl">Nederlands</option>
                </select>
              </div>

              {/* Theme */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={() => setSelectedTheme('light')}
                    className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                      selectedTheme === 'light' ? 'ring-4 ring-japanese-gold' : 'hover:scale-105'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">☀️</div>
                      <span className="font-medium">Light</span>
                    </div>
                  </div>
                  
                  <div 
                    onClick={() => setSelectedTheme('dark')}
                    className={`glass-card rounded-xl p-4 cursor-pointer transition-all ${
                      selectedTheme === 'dark' ? 'ring-4 ring-japanese-purple' : 'hover:scale-105'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">🌙</div>
                      <span className="font-medium">Dark</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-lg font-medium text-gray-700 mb-3">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="input-modern w-full"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Audio Settings</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">Audio Enabled</h4>
                  <p className="text-sm text-gray-600">Enable sound effects</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={audioSettings.enabled}
                    onChange={(e) => updateAudioSettings({ ...audioSettings, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-japanese-red rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-japanese-red"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-700">Voice</h4>
                  <p className="text-sm text-gray-600">Speech synthesis voice</p>
                </div>
                <select 
                  value={audioSettings.voice}
                  onChange={(e) => updateAudioSettings({ ...audioSettings, voice: e.target.value })}
                  className="input-modern"
                >
                  <option value="ja-JP">Japanese</option>
                  <option value="en-US">English</option>
                                 </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.1"
                  value={audioSettings.speed}
                  onChange={(e) => updateAudioSettings({ ...audioSettings, speed: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Slow</span>
                  <span>{audioSettings.speed}x</span>
                  <span>Fast</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="glass-card rounded-3xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Account</h3>
            
            <div className="space-y-4">
              <button
                onClick={handleSaveSettings}
                className="w-full btn-modern text-lg py-4"
              >
                💾 Save Settings
              </button>
              
              <button
                onClick={handleResetProgress}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-105"
              >
                🔄 Reset Progress
              </button>
              
              <div className="text-center text-sm text-gray-500 mt-6">
                <p>JapJap v1.0.0</p>
                <p>Made with ❤️ for Japanese learners</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen; 