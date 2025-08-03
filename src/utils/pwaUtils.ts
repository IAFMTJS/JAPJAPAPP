import React from 'react';

// PWA Utilities for JapJap App

export interface PWAInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAUtils {
  isInstalled: boolean;
  canInstall: boolean;
  isOnline: boolean;
  installApp: () => Promise<void>;
  registerServiceWorker: () => Promise<void>;
  checkForUpdates: () => Promise<boolean>;
  showInstallPrompt: () => void;
  syncData: () => Promise<void>;
}

class PWAUtilsImpl implements PWAUtils {
  private deferredPrompt: PWAInstallPromptEvent | null = null;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private updateAvailable = false;

  isInstalled = false;
  canInstall = false;
  isOnline = navigator.onLine;

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Check if app is installed
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.onOnline();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.onOffline();
    });

    // Listen for beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as PWAInstallPromptEvent;
      this.canInstall = true;
      this.onInstallPromptAvailable();
    });

    // Listen for appinstalled event
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.canInstall = false;
      this.onAppInstalled();
    });

    // Register service worker
    this.registerServiceWorker();
  }

  async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully:', this.serviceWorkerRegistration);

        // Listen for service worker updates
        this.serviceWorkerRegistration.addEventListener('updatefound', () => {
          const newWorker = this.serviceWorkerRegistration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.updateAvailable = true;
                this.onUpdateAvailable();
              }
            });
          }
        });

        // Listen for controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          this.onControllerChange();
        });

        // Listen for service worker messages
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.onServiceWorkerMessage(event);
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  async installApp(): Promise<void> {
    if (this.deferredPrompt) {
      try {
        await this.deferredPrompt.prompt();
        const choiceResult = await this.deferredPrompt.userChoice;
        
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          this.onInstallAccepted();
        } else {
          console.log('User dismissed the install prompt');
          this.onInstallDismissed();
        }
        
        this.deferredPrompt = null;
        this.canInstall = false;
      } catch (error) {
        console.error('Error during app installation:', error);
      }
    }
  }

  showInstallPrompt(): void {
    if (this.canInstall && !this.isInstalled) {
      this.installApp();
    }
  }

  async checkForUpdates(): Promise<boolean> {
    if (this.serviceWorkerRegistration) {
      try {
        await this.serviceWorkerRegistration.update();
        return this.updateAvailable;
      } catch (error) {
        console.error('Error checking for updates:', error);
        return false;
      }
    }
    return false;
  }

  async syncData(): Promise<void> {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        // Request background sync
        const registration = await navigator.serviceWorker.ready;
        if ('sync' in registration) {
          await (registration as any).sync.register('background-sync');
          console.log('Background sync registered');
        } else {
          console.log('Background sync not supported');
        }
      } catch (error) {
        console.error('Background sync failed:', error);
      }
    }
  }

  // Event handlers
  private onOnline(): void {
    console.log('App is online');
    // Sync any pending data
    this.syncData();
    
    // Notify app components
    window.dispatchEvent(new CustomEvent('pwa-online'));
  }

  private onOffline(): void {
    console.log('App is offline');
    window.dispatchEvent(new CustomEvent('pwa-offline'));
  }

  private onInstallPromptAvailable(): void {
    console.log('Install prompt available');
    window.dispatchEvent(new CustomEvent('pwa-install-available'));
  }

  private onAppInstalled(): void {
    console.log('App installed');
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  }

  private onInstallAccepted(): void {
    console.log('Install accepted');
    window.dispatchEvent(new CustomEvent('pwa-install-accepted'));
  }

  private onInstallDismissed(): void {
    console.log('Install dismissed');
    window.dispatchEvent(new CustomEvent('pwa-install-dismissed'));
  }

  private onUpdateAvailable(): void {
    console.log('Update available');
    window.dispatchEvent(new CustomEvent('pwa-update-available'));
  }

  private onControllerChange(): void {
    console.log('Service Worker controller changed');
    window.dispatchEvent(new CustomEvent('pwa-controller-change'));
  }

  private onServiceWorkerMessage(event: MessageEvent): void {
    console.log('Service Worker message:', event.data);
    
    if (event.data && event.data.type === 'SYNC_DATA') {
      // Handle sync data message
      window.dispatchEvent(new CustomEvent('pwa-sync-data', {
        detail: event.data
      }));
    }
  }
}

// Create singleton instance
export const pwaUtils = new PWAUtilsImpl();

// Utility functions
export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
};

export const isPWASupported = (): boolean => {
  return 'serviceWorker' in navigator && 'PushManager' in window;
};

export const getPWADisplayMode = (): string => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }
  if ((window.navigator as any).standalone === true) {
    return 'standalone';
  }
  return 'browser';
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if ('Notification' in window) {
    return await Notification.requestPermission();
  }
  return 'denied';
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

export const cacheData = async (url: string, data: any): Promise<void> => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_DATA',
      url,
      content: data
    });
  }
};

export const getCachedData = async (url: string): Promise<any> => {
  if ('caches' in window) {
    const cache = await caches.open('japjap-dynamic-v2.0.0');
    const response = await cache.match(url);
    if (response) {
      return await response.json();
    }
  }
  return null;
};

// PWA Installation Component Hook
export const usePWAInstall = () => {
  const [canInstall, setCanInstall] = React.useState(pwaUtils.canInstall);
  const [isInstalled, setIsInstalled] = React.useState(pwaUtils.isInstalled);
  const [isOnline, setIsOnline] = React.useState(pwaUtils.isOnline);

  React.useEffect(() => {
    const handleInstallAvailable = () => setCanInstall(true);
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('pwa-install-available', handleInstallAvailable);
    window.addEventListener('pwa-installed', handleAppInstalled);
    window.addEventListener('pwa-online', handleOnline);
    window.addEventListener('pwa-offline', handleOffline);

    return () => {
      window.removeEventListener('pwa-install-available', handleInstallAvailable);
      window.removeEventListener('pwa-installed', handleAppInstalled);
      window.removeEventListener('pwa-online', handleOnline);
      window.removeEventListener('pwa-offline', handleOffline);
    };
  }, []);

  return {
    canInstall,
    isInstalled,
    isOnline,
    installApp: pwaUtils.installApp.bind(pwaUtils),
    showInstallPrompt: pwaUtils.showInstallPrompt.bind(pwaUtils)
  };
};

 