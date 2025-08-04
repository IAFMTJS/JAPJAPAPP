import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import Icons from '../components/ui/Icons';

const HomePage: React.FC = () => {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  const { user, progress, setCurrentSection } = useStore();

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

  const features = [
    {
      id: 'hiragana',
      title: t('home.features.hiragana', 'Learn Hiragana'),
      description: t('hiragana.description', 'Learn the basic Japanese syllabary'),
      icon: 'hiragana',
      color: 'red',
      link: '/hiragana'
    },
    {
      id: 'katakana',
      title: t('home.features.katakana', 'Master Katakana'),
      description: t('katakana.description', 'Learn the katakana syllabary for foreign words'),
      icon: 'katakana',
      color: 'blue',
      link: '/katakana'
    },
    {
      id: 'kanji',
      title: t('home.features.kanji', 'Study Kanji'),
      description: t('kanji.description', 'Master Japanese kanji characters'),
      icon: 'kanji',
      color: 'green',
      link: '/kanji'
    },
    {
      id: 'grammar',
      title: t('home.features.grammar', 'Practice Grammar'),
      description: t('grammar.description', 'Learn Japanese grammar rules'),
      icon: 'grammar',
      color: 'purple',
      link: '/grammar'
    },
    {
      id: 'ai',
      title: t('home.features.ai', 'AI-Powered Learning'),
      description: t('aiTutor.description', 'Personalized learning recommendations'),
      icon: 'ai',
      color: 'purple',
      link: '/ai-tutor'
    },
    {
      id: 'gamification',
      title: t('home.features.gamification', 'Gamified Experience'),
      description: t('gamification.description', 'Earn points, badges, and achievements'),
      icon: 'gamification',
      color: 'green',
      link: '/gamification'
    }
  ];

  const stats = [
    {
      label: t('home.stats.charactersLearned', 'Characters Learned'),
      value: progress.hiragana.length + progress.katakana.length + progress.kanji.length,
      icon: 'characters',
      color: 'blue'
    },
    {
      label: t('home.stats.streak', 'Day Streak'),
      value: user?.streak || 0,
      icon: 'streak',
      color: 'orange'
    },
    {
      label: t('home.stats.accuracy', 'Accuracy'),
      value: `${Math.round(progress.overallAccuracy)}%`,
      icon: 'accuracy',
      color: 'green'
    },
    {
      label: t('home.stats.timeSpent', 'Time Spent'),
      value: `${Math.round(progress.totalPracticeTime / 60)}m`,
      icon: 'time',
      color: 'purple'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            {t('home.title', 'Welcome to JapJap')}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-6">
            {t('home.subtitle', 'Learn Japanese the fun way!')}
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
            {t('home.description', 'Master Japanese characters, grammar, and culture through interactive lessons and AI-powered learning.')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hiragana"
              onClick={() => setCurrentSection('hiragana')}
              className="inline-flex items-center justify-center px-8 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <Icons name="play" size={20} color="white" />
              <span className="ml-2">{t('home.startLearning', 'Start Learning')}</span>
            </Link>
            
            {(user?.streak || 0) > 0 && (
              <Link
                to="/progress"
                onClick={() => setCurrentSection('progress')}
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                <Icons name="continue" size={20} color="white" />
                <span className="ml-2">{t('home.continueLearning', 'Continue Learning')}</span>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <Icons name={stat.icon as any} size={24} color={`text-${stat.color}-600`} />
                <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.id}
              to={feature.link}
              onClick={() => setCurrentSection(feature.id)}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg bg-${feature.color}-100 group-hover:bg-${feature.color}-200 transition-colors duration-200`}>
                  <Icons name={feature.icon as any} size={32} color={`text-${feature.color}-600`} />
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-800 group-hover:text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 group-hover:text-gray-700">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-red-600 font-medium">
                <span>{t('app.next', 'Next')}</span>
                <Icons name="arrow-right" size={16} color="#DC2626" className="ml-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t('home.quickStart', 'Quick Start')}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/quiz"
              onClick={() => setCurrentSection('quiz')}
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors duration-200"
            >
              <Icons name="quiz" size={20} color="white" />
              <span className="ml-2">{t('navigation.quiz', 'Quiz')}</span>
            </Link>
            <Link
              to="/ai-tutor"
              onClick={() => setCurrentSection('ai-tutor')}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors duration-200"
            >
              <Icons name="ai" size={20} color="white" />
              <span className="ml-2">{t('navigation.aiTutor', 'AI Tutor')}</span>
            </Link>
            <Link
              to="/gamification"
              onClick={() => setCurrentSection('gamification')}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors duration-200"
            >
              <Icons name="gamification" size={20} color="white" />
              <span className="ml-2">{t('navigation.gamification', 'Gamification')}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 