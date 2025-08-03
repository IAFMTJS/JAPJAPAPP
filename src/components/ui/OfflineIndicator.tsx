import React, { useState, useEffect } from 'react';
import { usePWAInstall } from '../../utils/pwaUtils';
import Icons from './Icons';

const OfflineIndicator: React.FC = () => {
  const { isOnline } = usePWAInstall();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowIndicator(true);
      // Hide indicator after 5 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setShowIndicator(false);
    }
  }, [isOnline]);

  if (!showIndicator || isOnline) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-bounce">
        <Icons name="wifi-off" size={16} color="white" />
        <span className="text-sm font-medium">You're offline</span>
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
      </div>
    </div>
  );
};

export default OfflineIndicator; 