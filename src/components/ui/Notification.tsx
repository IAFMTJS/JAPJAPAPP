import React, { useEffect, useState, useCallback } from 'react';
import Icons from './Icons';

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  show?: boolean;
}

const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  show = true
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    setIsVisible(show);
  }, [show]);

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, handleClose, isVisible]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50 border-green-200',
          icon: 'success',
          iconColor: '#10B981',
          textColor: 'text-green-800',
          titleColor: 'text-green-900'
        };
      case 'error':
        return {
          bg: 'bg-red-50 border-red-200',
          icon: 'error',
          iconColor: '#EF4444',
          textColor: 'text-red-800',
          titleColor: 'text-red-900'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 border-yellow-200',
          icon: 'warning',
          iconColor: '#F59E0B',
          textColor: 'text-yellow-800',
          titleColor: 'text-yellow-900'
        };
      case 'info':
        return {
          bg: 'bg-blue-50 border-blue-200',
          icon: 'info',
          iconColor: '#3B82F6',
          textColor: 'text-blue-800',
          titleColor: 'text-blue-900'
        };
      default:
        return {
          bg: 'bg-gray-50 border-gray-200',
          icon: 'info',
          iconColor: '#6B7280',
          textColor: 'text-gray-800',
          titleColor: 'text-gray-900'
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${isAnimating ? 'animate-slide-in-right' : 'animate-slide-in-left'}`}>
      <div className={`glass-card rounded-2xl border-l-4 ${styles.bg} shadow-lg backdrop-blur-md`}>
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${styles.iconColor}20` }}>
                <Icons name={styles.icon} size={20} color={styles.iconColor} />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold ${styles.titleColor}`}>
                {title}
              </h3>
              {message && (
                <p className={`text-sm mt-1 ${styles.textColor}`}>
                  {message}
                </p>
              )}
            </div>
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <Icons name="close" size={16} color="currentColor" />
            </button>
          </div>
        </div>
        
        {/* Progress bar */}
        {duration > 0 && (
          <div className="h-1 bg-gray-200 rounded-b-2xl overflow-hidden">
            <div 
              className="h-full transition-all duration-300 ease-linear"
              style={{
                backgroundColor: styles.iconColor,
                width: isAnimating ? '100%' : '0%',
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notification; 