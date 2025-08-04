import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import Icons from './Icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t, ready } = useTranslation();
  const { user, setUser } = useStore();

  // Don't render until i18n is ready
  if (!ready) {
    return (
      <div className="flex items-center space-x-2 px-3 py-2 text-gray-700 rounded-xl">
        <span className="text-lg">🌐</span>
        <span className="hidden sm:inline">Loading...</span>
      </div>
    );
  }

  const languages: Array<{ code: 'en' | 'ja' | 'es' | 'fr' | 'de' | 'zh' | 'ko'; name: string; flag: string }> = [
    { code: 'en', name: t('languages.en', 'English'), flag: '🇺🇸' },
    { code: 'ja', name: t('languages.ja', '日本語'), flag: '🇯🇵' },
    { code: 'es', name: t('languages.es', 'Español'), flag: '🇪🇸' },
    { code: 'fr', name: t('languages.fr', 'Français'), flag: '🇫🇷' },
    { code: 'de', name: t('languages.de', 'Deutsch'), flag: '🇩🇪' },
    { code: 'zh', name: t('languages.zh', '中文'), flag: '🇨🇳' },
    { code: 'ko', name: t('languages.ko', '한국어'), flag: '🇰🇷' },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: 'en' | 'ja' | 'es' | 'fr' | 'de' | 'zh' | 'ko') => {
    i18n.changeLanguage(languageCode);
    
    // Update user language preference in store
    if (user) {
      setUser({
        ...user,
        language: languageCode,
      });
    }
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200">
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <Icons name="chevron-down" size={16} color="currentColor" />
      </button>
      
      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-2">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                i18n.language === language.code ? 'bg-red-50 text-red-600' : 'text-gray-700'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="flex-1">{language.name}</span>
              {i18n.language === language.code && (
                <Icons name="check" size={16} color="#DC2626" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 