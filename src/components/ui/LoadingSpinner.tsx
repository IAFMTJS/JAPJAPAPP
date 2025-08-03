import React from 'react';
import Icons from './Icons';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  text?: string;
  showText?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = '#DC2626',
  text = '読み込み中...',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        {/* Main spinner */}
        <div 
          className={`${sizeClasses[size]} border-2 border-gray-200 rounded-full animate-spin`}
          style={{
            borderTopColor: color,
            borderRightColor: color
          }}
        />
        
        {/* Inner glow effect */}
        <div 
          className={`${sizeClasses[size]} absolute inset-0 border-2 border-transparent rounded-full animate-pulse`}
          style={{
            borderTopColor: color,
            opacity: 0.3
          }}
        />
        
        {/* Center icon for larger sizes */}
        {(size === 'lg' || size === 'xl') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Icons name="japan" size={size === 'lg' ? 20 : 28} color={color} />
          </div>
        )}
      </div>
      
      {/* Loading text */}
      {showText && (
        <div className={`text-center ${textSizes[size]} text-gray-600 font-medium`}>
          <div className="flex items-center space-x-2">
            <span>{text}</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 