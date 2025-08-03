import React, { useState, useEffect, useCallback } from 'react';
import { useStore, useUser } from '../../store/useStore';

const Mascot: React.FC = () => {
  const user = useUser();
  const { mascotAnimation, setMascotAnimation } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Auto-switch to idle animation after 5 seconds of inactivity
    const timeout = setTimeout(() => {
      if (mascotAnimation !== 'idle') {
        setMascotAnimation('idle');
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [mascotAnimation, setMascotAnimation]);



  const handleMascotClick = useCallback(() => {
    const animations: Array<'idle' | 'happy' | 'sad' | 'thinking' | 'celebration' | 'bounce'> = ['happy', 'celebration', 'thinking', 'bounce'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    setMascotAnimation(randomAnimation);
    
    // Increment click count and show encouraging messages
    setClickCount(prev => prev + 1);
    
    const messages = [
      'がんばって！ (Keep it up!)',
      'すごい！ (Amazing!)',
      'よくできました！ (Well done!)',
      'お疲れ様！ (Good work!)',
      '頑張りましょう！ (Let\'s do our best!)',
      '素晴らしい！ (Wonderful!)',
      '完璧です！ (Perfect!)',
      '続けましょう！ (Keep going!)',
      'やったね！ (You did it!)',
      '感動的！ (Impressive!)'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    setMessage(randomMessage);
    setShowMessage(true);
    
    // Hide message after 3 seconds
    setTimeout(() => setShowMessage(false), 3000);

    // Add haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, [setMascotAnimation]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - 40, // Center the mascot
        y: e.clientY - 40
      });
    }
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const getMascotEmoji = () => {
    return user?.avatar === 'maneki-neko' ? '🐱' : '🐧';
  };

  const getAnimationClass = () => {
    switch (mascotAnimation) {
      case 'happy':
        return 'animate-bounce';
      case 'celebration':
        return 'animate-pulse-glow';
      case 'thinking':
        return 'animate-pulse';
      case 'bounce':
        return 'animate-bounce';
      case 'idle':
        return 'animate-float';
      default:
        return 'animate-float';
    }
  };

  const getMascotStyle = () => {
    const baseStyle = {
      background: 'rgba(255, 255, 255, 0.25)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      transition: isDragging ? 'none' : 'all 0.3s ease',
      cursor: isDragging ? 'grabbing' : 'grab',
      transform: isDragging ? 'scale(1.1)' : isHovered ? 'scale(1.05)' : 'scale(1)',
      position: 'fixed' as const,
      left: isDragging ? `${position.x}px` : '24px',
      bottom: isDragging ? `${position.y}px` : '24px',
      zIndex: isDragging ? 1000 : 50,
    };

    if (isHovered && !isDragging) {
      return {
        ...baseStyle,
        boxShadow: '0 12px 40px 0 rgba(31, 38, 135, 0.5)',
        background: 'rgba(255, 255, 255, 0.35)',
      };
    }

    return baseStyle;
  };

  return (
    <div className="fixed bottom-6 left-6 z-50" style={{ pointerEvents: 'none' }}>
      {/* Encouraging Message */}
      {showMessage && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 animate-fade-in" style={{ pointerEvents: 'auto' }}>
          <div className="glass-card rounded-2xl px-4 py-2 text-sm font-medium text-gray-800 whitespace-nowrap shadow-lg">
            {message}
          </div>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
        </div>
      )}

      {/* Mascot Container */}
      <div 
        onClick={handleMascotClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={handleMouseDown}
        className={`w-20 h-20 glass-card rounded-full flex items-center justify-center transition-all duration-300 ${getAnimationClass()}`}
        style={{ ...getMascotStyle(), pointerEvents: 'auto' }}
        title="Click me for encouragement! Drag me around!"
      >
        {/* Mascot Emoji */}
        <span className="text-4xl transition-transform duration-300 hover:scale-110 select-none">
          {getMascotEmoji()}
        </span>
        
        {/* Sparkle Effects */}
        {mascotAnimation === 'celebration' && (
          <>
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
          </>
        )}
        
        {/* Level Indicator */}
        <div className="absolute -top-1 -left-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
          {Math.floor((user?.level || 1) / 10) + 1}
        </div>

        {/* Drag indicator */}
        {isHovered && !isDragging && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium animate-fade-in">
            Drag me!
          </div>
        )}
      </div>

      {/* Click Counter (hidden after 10 clicks) */}
      {clickCount > 0 && clickCount <= 10 && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium animate-fade-in" style={{ pointerEvents: 'auto' }}>
          {clickCount} clicks
        </div>
      )}

      {/* Special Achievement Messages */}
      {clickCount === 5 && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 animate-scale-in" style={{ pointerEvents: 'auto' }}>
          <div className="glass-card rounded-2xl px-4 py-2 text-sm font-bold text-yellow-600 bg-yellow-100 shadow-lg">
            🎉 Mascot Lover! 🎉
          </div>
        </div>
      )}
      
      {clickCount === 10 && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 animate-scale-in" style={{ pointerEvents: 'auto' }}>
          <div className="glass-card rounded-2xl px-4 py-2 text-sm font-bold text-purple-600 bg-purple-100 shadow-lg">
            🌟 Mascot Master! 🌟
          </div>
        </div>
      )}

      {/* Special achievement for 20 clicks */}
      {clickCount === 20 && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 animate-scale-in" style={{ pointerEvents: 'auto' }}>
          <div className="glass-card rounded-2xl px-4 py-2 text-sm font-bold text-indigo-600 bg-indigo-100 shadow-lg">
            👑 Mascot Legend! 👑
          </div>
        </div>
      )}
    </div>
  );
};

export default Mascot; 