import React, { useState, useEffect } from 'react';
import Icons from './Icons';

const PWAUpdateNotification: React.FC = () => {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    const handleUpdateAvailable = () => {
      setShowUpdate(true);
    };

    window.addEventListener('pwa-update-available', handleUpdateAvailable);

    return () => {
      window.removeEventListener('pwa-update-available', handleUpdateAvailable);
    };
  }, []);

  const handleUpdate = () => {
    // Reload the page to apply the update
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Icons name="refresh" size={20} color="white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Update Available</h3>
            <p className="text-xs opacity-90 mt-1">
              A new version of JapJap is available. Update now for the latest features.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white opacity-70 hover:opacity-100 transition-opacity"
          >
            <Icons name="close" size={16} color="white" />
          </button>
        </div>
        
        <div className="flex space-x-2 mt-3">
          <button
            onClick={handleUpdate}
            className="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Update Now
          </button>
          <button
            onClick={handleDismiss}
            className="text-white opacity-70 hover:opacity-100 transition-opacity text-sm"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdateNotification; 