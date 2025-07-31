import React from 'react';
import { useStore, useUser } from '../../store/useStore';

const Mascot: React.FC = () => {
  const user = useUser();
  const { mascotAnimation, setMascotAnimation } = useStore();

  const handleMascotClick = () => {
    const animations: Array<'happy' | 'celebration' | 'thinking'> = ['happy', 'celebration', 'thinking'];
    const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
    setMascotAnimation(randomAnimation);
  };

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
      case 'idle':
        return 'animate-float';
      default:
        return 'animate-float';
    }
  };

  return (
    <div 
      onClick={handleMascotClick}
      className={`w-20 h-20 glass-card rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 ${getAnimationClass()}`}
      style={{ 
        background: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)'
      }}
    >
      <span className="text-4xl">{getMascotEmoji()}</span>
    </div>
  );
};

export default Mascot; 