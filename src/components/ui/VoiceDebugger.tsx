import React, { useState, useEffect } from 'react';
import { speakJapanese, getAvailableVoices, logAvailableVoices, isIOS, testVoiceConfigurations } from '../../utils/speech';

interface VoiceDebuggerProps {
  isVisible: boolean;
  onClose: () => void;
}

const VoiceDebugger: React.FC<VoiceDebuggerProps> = ({ isVisible, onClose }) => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [testText, setTestText] = useState('こんにちは');
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [isIOSDevice, setIsIOSDevice] = useState(false);

  useEffect(() => {
    setIsIOSDevice(isIOS());
    loadVoices();
  }, []);

  const loadVoices = () => {
    // Wait for voices to load (especially important on iOS)
    setTimeout(() => {
      const availableVoices = getAvailableVoices();
      setVoices(availableVoices);
      logAvailableVoices();
    }, 500);
  };

  const testVoice = () => {
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        const utterance = new SpeechSynthesisUtterance(testText);
        utterance.voice = voice;
        utterance.lang = 'ja-JP';
        utterance.rate = 0.8;
        utterance.volume = 1.0;
        utterance.pitch = 1.1;
        
        utterance.onerror = (event) => {
          console.warn('Test voice error:', event.error);
        };
        
        utterance.onend = () => {
          console.log('Test voice completed');
        };
        
        speechSynthesis.speak(utterance);
      }
    } else {
      speakJapanese(testText);
    }
  };

  const testDefaultJapanese = () => {
    speakJapanese(testText);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Voice Debugger</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Platform: {isIOSDevice ? 'iOS' : 'Desktop/Android'}
          </p>
          <p className="text-sm text-gray-600">
            Available voices: {voices.length}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Test Text:</label>
          <input
            type="text"
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter Japanese text to test"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Voice (Optional):</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Use default Japanese voice</option>
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang}) {voice.default ? '(default)' : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 space-y-2">
          <button
            onClick={testDefaultJapanese}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Test Default Japanese Voice
          </button>
          <button
            onClick={testVoice}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Test Selected Voice
          </button>
          <button
            onClick={loadVoices}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Reload Voices
          </button>
          {isIOSDevice && (
            <button
              onClick={() => testVoiceConfigurations(testText)}
              className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600"
            >
              Test iOS Configurations
            </button>
          )}
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-2">Available Voices:</h3>
          <div className="max-h-40 overflow-y-auto border rounded p-2">
            {voices.length === 0 ? (
              <p className="text-gray-500">No voices loaded yet...</p>
            ) : (
              voices.map((voice) => (
                <div key={voice.name} className="text-sm py-1 border-b last:border-b-0">
                  <strong>{voice.name}</strong> - {voice.lang}
                  {voice.default && <span className="text-blue-600 ml-2">(default)</span>}
                  {(voice.lang.startsWith('ja') || voice.name.toLowerCase().includes('japanese')) && (
                    <span className="text-green-600 ml-2">(Japanese)</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-xs text-gray-500">
          <p>• iOS often requires a delay for voices to load properly</p>
          <p>• Some browsers may not have Japanese voices available</p>
          <p>• Check the console for detailed voice information</p>
        </div>
      </div>
    </div>
  );
};

export default VoiceDebugger; 