import React, { useState, useEffect } from 'react';
import { usePWAInstall, isPWAInstalled } from '../../utils/pwaUtils';
import Icons from './Icons';

interface PWAInstallBannerProps {
  onClose?: () => void;
  className?: string;
}

const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ 
  onClose, 
  className = '' 
}) => {
  const { canInstall, isInstalled, isOnline } = usePWAInstall();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner should be shown
    const shouldShow = canInstall && !isInstalled && isOnline && !isDismissed;
    setIsVisible(shouldShow);

    // Check if user has previously dismissed the banner
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, [canInstall, isInstalled, isOnline, isDismissed]);

  const handleInstall = async () => {
    try {
      // Trigger install prompt
      const event = new CustomEvent('pwa-install-requested');
      window.dispatchEvent(event);
      
      // The actual installation is handled by the PWA utils
      setIsVisible(false);
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
    onClose?.();
  };

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-300 ${className}`}>
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Icons name="download" size={24} color="white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Install JapJap</h3>
              <p className="text-sm opacity-90">
                Get the full app experience with offline access and faster loading
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstall}
              className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
            >
              <Icons name="download" size={16} color="#DC2626" />
              <span>Install</span>
            </button>
            
            <button
              onClick={handleDismiss}
              className="text-white opacity-70 hover:opacity-100 transition-opacity duration-200 p-2"
              title="Don't show again"
            >
              <Icons name="close" size={20} color="white" />
            </button>
            
            <button
              onClick={handleClose}
              className="text-white opacity-70 hover:opacity-100 transition-opacity duration-200 p-2"
              title="Close"
            >
              <Icons name="x" size={20} color="white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner; 