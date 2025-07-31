/**
 * Japanese Speech Synthesis Utility
 * Provides consistent Japanese pronunciation across the app
 * Optimized for iOS compatibility
 */

// iOS-specific voice preferences and fallbacks
const IOS_JAPANESE_VOICES = [
  'Kyoko', // iOS Japanese voice
  'Siri', // iOS Siri voice (sometimes works for Japanese)
  'Google 日本語', // Chrome on iOS
  'Microsoft Haruka', // Edge on iOS
  'Alex', // Sometimes works for Japanese on iOS
  'Samantha', // Sometimes works for Japanese on iOS
];

const DESKTOP_JAPANESE_VOICES = [
  'Google 日本語',
  'Microsoft Haruka',
  'Kyoko',
  'Sakura',
  'Takumi',
];

export const speakJapanese = (text: string) => {
  if (!text || !isSpeechSynthesisSupported()) {
    return;
  }

  // Stop any currently speaking
  speechSynthesis.cancel();

  // iOS-specific: Ensure we're in a user interaction context
  if (isIOS()) {
    // On iOS, speech synthesis often requires user interaction
    // We'll add a small delay and retry mechanism
    setTimeout(() => {
      attemptSpeechSynthesis(text, 0);
    }, 50);
  } else {
    // Desktop: immediate attempt
    attemptSpeechSynthesis(text, 0);
  }
};

const attemptSpeechSynthesis = (text: string, attemptCount: number) => {
  if (attemptCount > 3) {
    console.warn('Speech synthesis failed after 3 attempts');
    return;
  }

  // Wait a bit for iOS to properly load voices
  setTimeout(() => {
    const voices = speechSynthesis.getVoices();
    const japaneseVoice = getBestJapaneseVoice(voices);
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // iOS-specific optimizations
    if (isIOS()) {
      // iOS often works better with these settings
      utterance.lang = 'ja-JP';
      utterance.rate = 0.8; // Slightly faster on iOS
      utterance.volume = 1.0; // Full volume on iOS
      utterance.pitch = 1.1; // Slightly higher pitch for clarity
    } else {
      // Desktop settings
      utterance.lang = 'ja-JP';
      utterance.rate = 0.7;
      utterance.volume = 0.9;
      utterance.pitch = 1.0;
    }
    
    // Use Japanese voice if available
    if (japaneseVoice) {
      utterance.voice = japaneseVoice;
      console.log('Using Japanese voice:', japaneseVoice.name);
    } else {
      console.warn('No Japanese voice found, using default');
    }
    
    // Enhanced error handling for iOS
    utterance.onerror = (event) => {
      console.warn('Speech synthesis error:', event.error);
      
      // On iOS, retry with different settings or delay
      if (isIOS()) {
        console.log(`Retrying speech synthesis (attempt ${attemptCount + 1})...`);
        setTimeout(() => {
          attemptSpeechSynthesis(text, attemptCount + 1);
        }, 200 * (attemptCount + 1)); // Exponential backoff
      }
    };
    
    utterance.onend = () => {
      console.log('Speech synthesis completed for:', text);
    };
    
    utterance.onstart = () => {
      console.log('Speech synthesis started for:', text);
    };
    
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis speak() error:', error);
      // Retry on error
      if (attemptCount < 3) {
        setTimeout(() => {
          attemptSpeechSynthesis(text, attemptCount + 1);
        }, 200);
      }
    }
  }, 100 + (attemptCount * 50)); // Increasing delay for retries
};

/**
 * Get the best available Japanese voice with platform-specific preferences
 */
export const getBestJapaneseVoice = (voices: SpeechSynthesisVoice[]) => {
  if (!voices || voices.length === 0) {
    return null;
  }
  
  const isIOSDevice = isIOS();
  const preferredVoices = isIOSDevice ? IOS_JAPANESE_VOICES : DESKTOP_JAPANESE_VOICES;
  
  // First, try to find exact matches from our preferred list
  for (const preferredVoice of preferredVoices) {
    const exactMatch = voices.find(voice => 
      voice.name === preferredVoice ||
      voice.name.toLowerCase().includes(preferredVoice.toLowerCase())
    );
    if (exactMatch) {
      return exactMatch;
    }
  }
  
  // Fallback: find any Japanese voice
  const japaneseVoice = voices.find(voice => 
    voice.lang.startsWith('ja') || 
    voice.name.toLowerCase().includes('japanese') ||
    voice.name.toLowerCase().includes('ja')
  );
  
  return japaneseVoice || null;
};

/**
 * Retry speech synthesis with fallback settings for iOS
 */
const retryWithFallbackSettings = (text: string) => {
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // Faster rate
    utterance.volume = 0.8; // Lower volume
    utterance.pitch = 0.9; // Lower pitch
    
    utterance.onerror = (event) => {
      console.warn('Fallback speech synthesis also failed:', event.error);
    };
    
    speechSynthesis.speak(utterance);
  }, 200);
};

/**
 * Get the best available Japanese voice (legacy function)
 */
export const getJapaneseVoice = () => {
  if ('speechSynthesis' in window) {
    const voices = speechSynthesis.getVoices();
    return getBestJapaneseVoice(voices);
  }
  return null;
};

/**
 * Check if speech synthesis is available
 */
export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};

/**
 * Detect if running on iOS
 */
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

/**
 * Get available voices for debugging
 */
export const getAvailableVoices = () => {
  if ('speechSynthesis' in window) {
    return speechSynthesis.getVoices();
  }
  return [];
};

/**
 * Log available voices for debugging
 */
export const logAvailableVoices = () => {
  const voices = getAvailableVoices();
  console.log('Available voices:', voices.map(v => ({
    name: v.name,
    lang: v.lang,
    default: v.default
  })));
};

/**
 * Preload voices for iOS (call this on app initialization)
 */
export const preloadVoices = () => {
  if (!isSpeechSynthesisSupported()) {
    return;
  }

  // On iOS, voices may not be immediately available
  if (isIOS()) {
    // Try to load voices multiple times
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      if (voices.length === 0) {
        // Try again after a delay
        setTimeout(loadVoices, 100);
      } else {
        console.log(`Loaded ${voices.length} voices on iOS`);
        logAvailableVoices();
      }
    };
    
    // Initial load attempt
    loadVoices();
    
    // Also try after a longer delay
    setTimeout(loadVoices, 1000);
  } else {
    // Desktop: immediate load
    logAvailableVoices();
  }
};

/**
 * Initialize speech synthesis (call this when the app starts)
 */
export const initializeSpeechSynthesis = () => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis not supported');
    return;
  }

  // Preload voices
  preloadVoices();
  
  // Set up voice loading event listener
  if ('onvoiceschanged' in speechSynthesis) {
    speechSynthesis.onvoiceschanged = () => {
      console.log('Voices changed event fired');
      logAvailableVoices();
    };
  }
};

/**
 * Test different voice configurations for iOS
 */
export const testVoiceConfigurations = (text: string = 'こんにちは') => {
  if (!isSpeechSynthesisSupported()) {
    console.warn('Speech synthesis not supported');
    return;
  }

  const voices = getAvailableVoices();
  const japaneseVoices = voices.filter(voice => 
    voice.lang.startsWith('ja') || 
    voice.name.toLowerCase().includes('japanese') ||
    voice.name.toLowerCase().includes('ja')
  );

  console.log('Testing voice configurations for:', text);
  console.log('Available Japanese voices:', japaneseVoices.map(v => v.name));

  // Test configurations
  const configs = [
    { name: 'iOS Optimized', rate: 0.8, volume: 1.0, pitch: 1.1 },
    { name: 'Slower Rate', rate: 0.6, volume: 1.0, pitch: 1.0 },
    { name: 'Lower Pitch', rate: 0.8, volume: 1.0, pitch: 0.9 },
    { name: 'Higher Pitch', rate: 0.8, volume: 1.0, pitch: 1.2 },
    { name: 'Lower Volume', rate: 0.8, volume: 0.8, pitch: 1.1 },
  ];

  configs.forEach((config, index) => {
    setTimeout(() => {
      console.log(`Testing config: ${config.name}`);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = config.rate;
      utterance.volume = config.volume;
      utterance.pitch = config.pitch;
      
      if (japaneseVoices.length > 0) {
        utterance.voice = japaneseVoices[0];
      }
      
      utterance.onend = () => {
        console.log(`Completed: ${config.name}`);
      };
      
      utterance.onerror = (event) => {
        console.warn(`Error in ${config.name}:`, event.error);
      };
      
      speechSynthesis.speak(utterance);
    }, index * 3000); // 3 second intervals
  });
}; 