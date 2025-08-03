// Storage utility functions for managing localStorage and handling quota errors

export const STORAGE_KEY = 'japjap-storage';

export interface StorageInfo {
  size: number;
  sizeInMB: number;
  isQuotaExceeded: boolean;
  canStore: boolean;
}

export const getStorageInfo = (): StorageInfo => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const size = data ? new Blob([data]).size : 0;
    const sizeInMB = size / (1024 * 1024);
    
    return {
      size,
      sizeInMB,
      isQuotaExceeded: sizeInMB > 4.5, // 5MB limit with buffer
      canStore: sizeInMB < 4
    };
  } catch (error) {
    console.error('Failed to get storage info:', error);
    return {
      size: 0,
      sizeInMB: 0,
      isQuotaExceeded: true,
      canStore: false
    };
  }
};

export const clearStorage = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear storage:', error);
    return false;
  }
};

export const cleanupStorage = (data: any): any => {
  const cleaned = { ...data };
  
  // Limit quiz results to last 100
  if (cleaned.quizResults && cleaned.quizResults.length > 100) {
    cleaned.quizResults = cleaned.quizResults.slice(-100);
  }
  
  // Limit practice sessions to last 50
  if (cleaned.progress?.practiceSessions && cleaned.progress.practiceSessions.length > 50) {
    cleaned.progress.practiceSessions = cleaned.progress.practiceSessions.slice(-50);
  }
  
  // Limit daily stats to last 30 days
  if (cleaned.progress?.dailyStats && cleaned.progress.dailyStats.length > 30) {
    cleaned.progress.dailyStats = cleaned.progress.dailyStats.slice(-30);
  }
  
  // Limit AI recommendations to last 20
  if (cleaned.aiRecommendations && cleaned.aiRecommendations.length > 20) {
    cleaned.aiRecommendations = cleaned.aiRecommendations.slice(-20);
  }
  
  // Limit achievements to last 50
  if (cleaned.achievements && cleaned.achievements.length > 50) {
    cleaned.achievements = cleaned.achievements.slice(-50);
  }
  
  return cleaned;
};

export const safeSetItem = (key: string, value: any): boolean => {
  try {
    const serialized = JSON.stringify(value);
    const size = new Blob([serialized]).size;
    const sizeInMB = size / (1024 * 1024);
    
    // If data is too large, clean it up first
    if (sizeInMB > 4) {
      console.warn('Data too large, cleaning up before storage...');
      const cleanedValue = cleanupStorage(value);
      const cleanedSerialized = JSON.stringify(cleanedValue);
      localStorage.setItem(key, cleanedSerialized);
      return true;
    }
    
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded:', error);
      return false;
    }
    console.error('Failed to set storage item:', error);
    return false;
  }
};

export const safeGetItem = (key: string): any => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get storage item:', error);
    return null;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getStorageQuota = async (): Promise<{ used: number; total: number } | null> => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        total: estimate.quota || 0
      };
    } catch (error) {
      console.error('Failed to get storage quota:', error);
    }
  }
  return null;
};

export const showStorageWarning = (message: string) => {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 12px 16px;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px; color: #92400e;">Storage Warning</div>
    <div style="font-size: 14px; color: #92400e; margin-bottom: 8px;">${message}</div>
    <button onclick="this.parentElement.remove()" style="
      background: #f59e0b;
      color: white;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    ">Dismiss</button>
  `;
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}; 