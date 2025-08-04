import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Icons from '../ui/Icons';
import LanguageSwitcher from '../ui/LanguageSwitcher';
import PWAInstallBanner from '../ui/PWAInstallBanner';
import OfflineIndicator from '../ui/OfflineIndicator';
import PWAUpdateNotification from '../ui/PWAUpdateNotification';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, ready } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setCurrentSection } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navigationItems = [
    { path: '/', label: t('navigation.home', 'Home'), icon: 'home' },
    { path: '/hiragana', label: t('navigation.hiragana', 'Hiragana'), icon: 'hiragana' },
    { path: '/katakana', label: t('navigation.katakana', 'Katakana'), icon: 'katakana' },
    { path: '/kanji', label: t('navigation.kanji', 'Kanji'), icon: 'kanji' },
    { path: '/grammar', label: t('navigation.grammar', 'Grammar'), icon: 'grammar' },
    { path: '/quiz', label: t('navigation.quiz', 'Quiz'), icon: 'quiz' },
    { path: '/progress', label: t('navigation.progress', 'Progress'), icon: 'progress' },
    { path: '/ai-tutor', label: t('navigation.aiTutor', 'AI Tutor'), icon: 'ai' },
    { path: '/advanced-learning', label: t('navigation.advancedLearning', 'Advanced Learning'), icon: 'dashboard' },
    { path: '/profile', label: t('navigation.profile', 'Profile'), icon: 'user' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    // Update the current section in the store based on the path
    const sectionMap: { [key: string]: string } = {
      '/': 'home',
      '/hiragana': 'hiragana',
      '/katakana': 'katakana',
      '/kanji': 'kanji',
      '/kanji-flashcards': 'kanji-flashcards',
      '/grammar': 'grammar',
      '/quiz': 'quiz',
      '/progress': 'progress',
      '/profile': 'profile',
      '/ai-tutor': 'ai-tutor',
      '/gamification': 'gamification',
      '/exercises': 'exercises',
      '/advanced-learning': 'advanced-learning'
    };
    
    const section = sectionMap[path] || 'home';
    setCurrentSection(section);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
                             <Link
                 to="/"
                 onClick={() => handleNavigation('/')}
                 className="flex items-center space-x-2 text-xl font-bold text-gradient hover:scale-105 transition-transform duration-200"
               >
                 <Icons name="japan" size={28} color="#DC2626" />
                 <span className="hidden sm:inline">{t('app.name', 'JapJap')}</span>
               </Link>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Icons name={isMobileMenuOpen ? "close" : "menu"} size={24} color="#374151" />
              </button>
              
              {/* Main Navigation - Desktop */}
              <div className="hidden md:flex space-x-2">
                                 {navigationItems.slice(1, 7).map((item) => (
                   <Link
                     key={item.path}
                     to={item.path}
                     onClick={() => handleNavigation(item.path)}
                     className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105 ${
                       isActive(item.path)
                         ? 'text-red-600 bg-red-50'
                         : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                     }`}
                   >
                     <Icons name={item.icon as any} size={20} color="currentColor" />
                     <span>{item.label}</span>
                   </Link>
                 ))}
              </div>
            </div>
            
            {/* User Menu - Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              <LanguageSwitcher />
              <Link
                to="/profile"
                onClick={() => handleNavigation('/profile')}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              >
                <Icons name="user" size={20} color="currentColor" />
                <span>{t('navigation.profile', 'Profile')}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">{t('navigation.menu', 'Menu')}</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <Icons name="close" size={24} color="#374151" />
                </button>
              </div>
              
              <div className="space-y-2 mb-6">
                <LanguageSwitcher />
              </div>
              
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => {
                      handleNavigation(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-red-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icons name={item.icon as any} size={20} color="currentColor" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Floating Quick Access Menu - Mobile Optimized */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col space-y-3">
          <Link
            to="/ai-tutor"
            onClick={() => handleNavigation('/ai-tutor')}
            className="group w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            title={t('navigation.aiTutor', 'AI Tutor')}
          >
            <Icons name="ai" size={24} color="white" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/gamification"
            onClick={() => handleNavigation('/gamification')}
            className="group w-14 h-14 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            title={t('navigation.gamification', 'Gamification')}
          >
            <Icons name="gamification" size={24} color="white" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/exercises"
            onClick={() => handleNavigation('/exercises')}
            className="group w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            title={t('navigation.exercises', 'Exercises')}
          >
            <Icons name="exercises" size={24} color="white" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/advanced-learning"
            onClick={() => handleNavigation('/advanced-learning')}
            className="group w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
            title={t('navigation.advancedLearning', 'Advanced Learning')}
          >
            <Icons name="dashboard" size={24} color="white" />
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Swipe Indicator - Mobile Only */}
      <div className="md:hidden fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
          <Icons name="arrow-left" size={16} color="white" />
          <span className="text-white text-xs">{t('navigation.swipeToNavigate', 'Swipe to navigate')}</span>
          <Icons name="arrow-right" size={16} color="white" />
        </div>
      </div>

      {/* PWA Components */}
      <PWAInstallBanner />
      <OfflineIndicator />
      <PWAUpdateNotification />
    </div>
  );
};

export default Layout; 