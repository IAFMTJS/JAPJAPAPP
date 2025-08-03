import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { getStorageInfo, formatBytes } from '../../utils/storageUtils';

interface StorageManagerProps {
  className?: string;
}

const StorageManager: React.FC<StorageManagerProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [storageInfo, setStorageInfo] = useState(getStorageInfo());
  const { cleanupStorage, resetStorage } = useStore();

  useEffect(() => {
    const updateStorageInfo = () => {
      setStorageInfo(getStorageInfo());
    };

    // Update storage info every 30 seconds
    const interval = setInterval(updateStorageInfo, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleCleanup = () => {
    cleanupStorage();
    setStorageInfo(getStorageInfo());
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      resetStorage();
      setStorageInfo(getStorageInfo());
    }
  };

  const getStatusColor = () => {
    if (storageInfo.isQuotaExceeded) return 'text-red-500';
    if (storageInfo.sizeInMB > 3) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getStatusText = () => {
    if (storageInfo.isQuotaExceeded) return 'Critical';
    if (storageInfo.sizeInMB > 3) return 'Warning';
    return 'Normal';
  };

  return (
    <div className={`relative ${className}`}>
      {/* Storage indicator */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
          storageInfo.isQuotaExceeded
            ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
            : storageInfo.sizeInMB > 3
            ? 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100'
            : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
        }`}
        title="Storage Manager"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
        <span className="text-sm font-medium">
          {formatBytes(storageInfo.size)}
        </span>
        <span className={`text-xs ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </button>

      {/* Storage panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Storage Manager
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Storage info */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Size:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatBytes(storageInfo.size)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`text-sm font-medium ${getStatusColor()}`}>
                  {getStatusText()}
                </span>
              </div>
              {storageInfo.canStore !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Can Store:</span>
                  <span className={`text-sm font-medium ${storageInfo.canStore ? 'text-green-600' : 'text-red-600'}`}>
                    {storageInfo.canStore ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>Storage Usage</span>
                <span>{storageInfo.sizeInMB.toFixed(2)} MB</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    storageInfo.isQuotaExceeded
                      ? 'bg-red-500'
                      : storageInfo.sizeInMB > 3
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{
                    width: `${Math.min((storageInfo.sizeInMB / 5) * 100, 100)}%`
                  }}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <button
                onClick={handleCleanup}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Clean Up Old Data
              </button>
              <button
                onClick={handleReset}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Reset All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageManager; 