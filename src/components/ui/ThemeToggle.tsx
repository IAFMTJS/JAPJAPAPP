import React, { useState, useEffect } from 'react';
import Icons from './Icons';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const [isDark, setIsDark] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('japjap-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsAnimating(true);
    
    setTimeout(() => {
      const newTheme = !isDark;
      setIsDark(newTheme);
      
      if (newTheme) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('japjap-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('japjap-theme', 'light');
      }
      
      setIsAnimating(false);
    }, 150);
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-12 h-6 glass-card rounded-full p-1 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      disabled={isAnimating}
    >
      {/* Background */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDark 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
          : 'bg-gradient-to-r from-yellow-400 to-orange-500'
      }`} />
      
      {/* Toggle Handle */}
      <div className={`relative w-4 h-4 bg-white rounded-full shadow-lg transition-all duration-300 transform ${
        isDark ? 'translate-x-6' : 'translate-x-0'
      } ${isAnimating ? 'scale-110' : 'scale-100'}`}>
        
        {/* Sun Icon */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`}>
          <Icons name="sun" size={12} color="#F59E0B" />
        </div>
        
        {/* Moon Icon */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
          isDark ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
        }`}>
          <Icons name="moon" size={12} color="#6366F1" />
        </div>
      </div>
      
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
        isDark 
          ? 'shadow-lg shadow-blue-500/25' 
          : 'shadow-lg shadow-yellow-500/25'
      }`} />
    </button>
  );
};

export default ThemeToggle; 