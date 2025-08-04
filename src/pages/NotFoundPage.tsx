import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Icons from '../components/ui/Icons';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Icons name="error" size={120} color="#DC2626" />
        </div>
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mb-4">
          {t('errors.notFound')}
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        <div className="space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors duration-200"
          >
            <Icons name="home" size={20} color="white" />
            <span className="ml-2">{t('navigation.home')}</span>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors duration-200"
          >
            <Icons name="arrow-left" size={20} color="white" />
            <span className="ml-2">{t('app.back')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 