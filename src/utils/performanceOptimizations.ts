// Performance optimization utilities for the JAPJAP app
import React from 'react';

// Debounce function to limit function calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function to limit function execution frequency
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization helper for expensive calculations
export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  getKey?: (...args: Parameters<T>) => string
): T => {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Lazy loading helper for components
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType<any>
): React.LazyExoticComponent<T> => {
  return React.lazy(() => 
    importFunc().catch(() => {
      console.warn('Failed to load component, using fallback');
      return fallback ? { default: fallback } : { default: () => React.createElement('div', null, 'Loading...') };
    })
  ) as React.LazyExoticComponent<T>;
};

// Memory management utilities
export const cleanupMemory = () => {
  // Clear any cached data
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  // Force garbage collection if available
  if ('gc' in window) {
    (window as any).gc();
  }
};

// Error boundary for catching and handling errors gracefully
export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

    render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || (() => 
        React.createElement('div', { className: 'p-4 text-center' },
          React.createElement('h2', { className: 'text-lg font-semibold text-red-600' }, 'Something went wrong'),
          React.createElement('p', { className: 'text-gray-600' }, 'Please refresh the page to try again.'),
          React.createElement('button', {
            onClick: () => window.location.reload(),
            className: 'mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          }, 'Refresh Page')
        )
      );
      return React.createElement(FallbackComponent);
    }

    return this.props.children;
  }
}

// Performance monitoring
export const performanceMonitor = {
  start: (label: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-start`);
    }
  },
  
  end: (label: string) => {
    if (typeof performance !== 'undefined') {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
      
      const measure = performance.getEntriesByName(label)[0];
      if (measure && measure.duration > 100) {
        console.warn(`Slow operation detected: ${label} took ${measure.duration.toFixed(2)}ms`);
      }
    }
  }
};

// Resource preloading
export const preloadResources = (resources: string[]) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.js') ? 'script' : 'style';
    document.head.appendChild(link);
  });
};

// Batch updates for state changes
export const batchUpdate = <T>(
  updates: (() => void)[],
  delay: number = 16 // ~60fps
) => {
  let index = 0;
  
  const processNext = () => {
    if (index < updates.length) {
      updates[index]();
      index++;
      setTimeout(processNext, delay);
    }
  };
  
  processNext();
};

// Memory leak prevention for event listeners
export const createSafeEventListener = (
  element: EventTarget,
  event: string,
  handler: EventListener,
  options?: AddEventListenerOptions
) => {
  const safeHandler = (e: Event) => {
    try {
      handler(e);
    } catch (error) {
      console.error('Error in event handler:', error);
    }
  };
  
  element.addEventListener(event, safeHandler, options);
  
  return () => {
    element.removeEventListener(event, safeHandler, options);
  };
};

// Async operation with timeout
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string = 'Operation timed out'
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    })
  ]);
};

// Retry mechanism for failed operations
export const retry = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
}; 