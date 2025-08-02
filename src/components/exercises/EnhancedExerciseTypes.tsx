import React, { useState, useRef, useEffect } from 'react';
// Removed framer-motion import due to compatibility issues
import { useStore } from '../../store/useStore';
import { Exercise, ExerciseType } from '../../types';

interface EnhancedExerciseTypesProps {
  onExerciseComplete: (exercise: Exercise, result: any) => void;
  onProgressUpdate: (progress: any) => void;
}

const EnhancedExerciseTypes: React.FC<EnhancedExerciseTypesProps> = ({
  onExerciseComplete,
  onProgressUpdate,
}) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('multiple-choice');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string>('');
  const [sentenceParts, setSentenceParts] = useState<string[]>([]);
  const [availableParts, setAvailableParts] = useState<string[]>([]);
  const [contextText, setContextText] = useState<string>('');
  const [contextBlanks, setContextBlanks] = useState<string[]>([]);
  const [storyProgress, setStoryProgress] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const { updateGameState, addXP } = useStore();

  // Handwriting Recognition
  const initializeHandwriting = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastX = clientX - rect.left;
      lastY = clientY - rect.top;
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      e.preventDefault();

      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const currentX = clientX - rect.left;
      const currentY = clientY - rect.top;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(currentX, currentY);
      ctx.stroke();

      lastX = currentX;
      lastY = currentY;
    };

    const stopDrawing = () => {
      isDrawing = false;
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing);
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Voice Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      
      // Stop all tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  // Sentence Construction
  const initializeSentenceConstruction = () => {
    const sentence = '私は日本語を勉強しています';
    const parts = ['私は', '日本語を', '勉強して', 'います'];
    const shuffledParts = [...parts].sort(() => Math.random() - 0.5);
    
    setSentenceParts([]);
    setAvailableParts(shuffledParts);
  };

  const addToSentence = (part: string) => {
    setSentenceParts([...sentenceParts, part]);
    setAvailableParts(availableParts.filter(p => p !== part));
  };

  const removeFromSentence = (index: number) => {
    const removedPart = sentenceParts[index];
    setSentenceParts(sentenceParts.filter((_, i) => i !== index));
    setAvailableParts([...availableParts, removedPart]);
  };

  // Context-Based Learning
  const initializeContextLearning = () => {
    const context = '私は毎日日本語を勉強しています。今日は新しい漢字を習いました。';
    const blanks = ['毎日', '新しい', '習いました'];
    const options = ['毎日', '新しい', '習いました', '昨日', '古い', '教えました'];
    
    setContextText(context);
    setContextBlanks(blanks);
    setAvailableParts(options);
  };

  // Interactive Stories
  const initializeInteractiveStory = () => {
    setStoryProgress(0);
  };

  const nextStoryStep = () => {
    setStoryProgress(prev => Math.min(prev + 1, 5));
  };

  // Generate Exercise
  const generateExercise = () => {
    const exercises: Exercise[] = [
      {
        id: '1',
        type: 'multiple-choice',
        question: 'What does こんにちは mean?',
        options: ['Good morning', 'Good afternoon', 'Good evening', 'Goodbye'],
        correctAnswer: 'Good afternoon',
        explanation: 'こんにちは (konnichiwa) means "Good afternoon" in Japanese.',
        difficulty: 'easy',
        category: 'greetings',
        tags: ['basic', 'greetings'],
        hints: ['Think about the time of day'],
        points: 10,
        aiGenerated: false,
        userRating: 0,
        usageCount: 0,
        successRate: 0
      },
      {
        id: '2',
        type: 'handwriting',
        question: 'Write the hiragana character for "a"',
        correctAnswer: 'あ',
        explanation: 'あ (a) is the first hiragana character.',
        difficulty: 'easy',
        category: 'hiragana',
        tags: ['basic', 'hiragana'],
        hints: ['It looks like a person with arms'],
        points: 15,
        aiGenerated: false,
        userRating: 0,
        usageCount: 0,
        successRate: 0
      },
      {
        id: '3',
        type: 'sentence-construction',
        question: 'Construct the sentence: "I study Japanese"',
        correctAnswer: ['私は', '日本語を', '勉強して', 'います'],
        explanation: '私は日本語を勉強しています (Watashi wa nihongo o benkyou shite imasu)',
        difficulty: 'medium',
        category: 'grammar',
        tags: ['grammar', 'sentence'],
        hints: ['Start with the subject'],
        points: 20,
        aiGenerated: false,
        userRating: 0,
        usageCount: 0,
        successRate: 0
      }
    ];

    const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];
    setCurrentExercise(randomExercise);
    setExerciseType(randomExercise.type);
    setUserAnswer('');
    setIsCorrect(null);
    setShowFeedback(false);

    // Initialize specific exercise types
    if (randomExercise.type === 'handwriting') {
      setTimeout(initializeHandwriting, 100);
    } else if (randomExercise.type === 'sentence-construction') {
      initializeSentenceConstruction();
    } else if (randomExercise.type === 'context-cloze') {
      initializeContextLearning();
    }
  };

  // Check Answer
  const checkAnswer = () => {
    if (!currentExercise) return;

    let correct = false;
    
    switch (currentExercise.type) {
      case 'multiple-choice':
        correct = userAnswer === currentExercise.correctAnswer;
        break;
      case 'handwriting':
        // Simplified handwriting check - in real app would use ML
        correct = userAnswer.toLowerCase().includes('あ');
        break;
      case 'sentence-construction':
        correct = JSON.stringify(sentenceParts) === JSON.stringify(currentExercise.correctAnswer);
        break;
      case 'context-cloze':
        correct = contextBlanks.every(blank => userAnswer.includes(blank));
        break;
      default:
        correct = userAnswer === currentExercise.correctAnswer;
    }

    setIsCorrect(correct);
    setShowFeedback(true);

    // Award XP
    const xpEarned = correct ? currentExercise.points : Math.floor(currentExercise.points / 2);
    addXP(xpEarned);

    // Update progress
    onProgressUpdate({
      exerciseId: currentExercise.id,
      correct,
      xpEarned,
      timestamp: new Date()
    });

    // Call completion callback
    onExerciseComplete(currentExercise, {
      correct,
      userAnswer,
      xpEarned
    });

    setTimeout(() => {
      setShowFeedback(false);
      generateExercise();
    }, 2000);
  };

  useEffect(() => {
    generateExercise();
  }, []);

  const renderExerciseContent = () => {
    if (!currentExercise) return null;

    switch (exerciseType) {
      case 'multiple-choice':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{currentExercise.question}</h3>
            <div className="grid grid-cols-1 gap-3">
                             {currentExercise.options?.map((option, index) => (
                 <button
                   key={index}
                   className={`p-4 text-left rounded-lg border-2 transition-all hover:scale-102 active:scale-98 ${
                     userAnswer === option
                       ? 'border-blue-500 bg-blue-50'
                       : 'border-gray-300 hover:border-gray-400'
                   }`}
                   onClick={() => setUserAnswer(option)}
                 >
                                     {option}
                 </button>
              ))}
            </div>
          </div>
        );

      case 'handwriting':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{currentExercise.question}</h3>
            <div className="border-2 border-gray-300 rounded-lg p-4">
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="border border-gray-400 rounded cursor-crosshair"
              />
            </div>
            <div className="flex space-x-2">
              <button
                onClick={clearCanvas}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Clear
              </button>
              <input
                type="text"
                placeholder="Type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        );

      case 'sentence-construction':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{currentExercise.question}</h3>
            
            {/* Constructed Sentence */}
            <div className="min-h-[60px] border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="flex flex-wrap gap-2">
                               {sentenceParts.map((part, index) => (
                 <span
                   key={index}
                   className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 animate-scale-in"
                   style={{
                     animation: 'scaleIn 0.3s ease-out'
                   }}
                   onClick={() => removeFromSentence(index)}
                 >
                                       {part}
                 </span>
                ))}
              </div>
            </div>

            {/* Available Parts */}
            <div className="space-y-2">
              <h4 className="font-semibold">Available parts:</h4>
              <div className="flex flex-wrap gap-2">
                               {availableParts.map((part, index) => (
                 <button
                   key={index}
                   className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-transform hover:scale-105 active:scale-95"
                   onClick={() => addToSentence(part)}
                 >
                                       {part}
                 </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'context-cloze':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Fill in the blanks:</h3>
            <div className="text-lg leading-relaxed">
              {contextText.split(' ').map((word, index) => {
                if (contextBlanks.includes(word)) {
                  return (
                    <input
                      key={index}
                      type="text"
                      placeholder="___"
                      className="w-20 px-2 py-1 border-b-2 border-blue-500 text-center mx-1"
                      onChange={(e) => {
                        const newBlanks = [...contextBlanks];
                        const blankIndex = newBlanks.indexOf(word);
                        if (blankIndex !== -1) {
                          newBlanks[blankIndex] = e.target.value;
                          setContextBlanks(newBlanks);
                        }
                      }}
                    />
                  );
                }
                return <span key={index}>{word} </span>;
              })}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{currentExercise.question}</h3>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        );
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-lg p-6 animate-fade-in"
      style={{
        animation: 'fadeIn 0.5s ease-out'
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Enhanced Exercises</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Type:</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {exerciseType.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="mb-6">
        {renderExerciseContent()}
      </div>

      {/* Voice Recording Section */}
      {exerciseType === 'pronunciation-practice' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold mb-2">Pronunciation Practice</h4>
          <div className="flex items-center space-x-4">
            <button
              onClick={recording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-lg font-medium ${
                recording
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {recording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {audioURL && (
              <audio controls src={audioURL} className="flex-1" />
            )}
          </div>
        </div>
      )}

      {/* Interactive Story */}
      {exerciseType === 'reading-comprehension' && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg">
          <h4 className="font-semibold mb-2">Interactive Story</h4>
          <div className="space-y-4">
            <p className="text-gray-700">
              {storyProgress === 0 && "Once upon a time, there was a student learning Japanese..."}
              {storyProgress === 1 && "The student practiced every day and made great progress..."}
              {storyProgress === 2 && "One day, they met a native speaker and had their first conversation..."}
              {storyProgress === 3 && "The conversation went well, and they felt confident..."}
              {storyProgress === 4 && "They continued studying and eventually became fluent..."}
              {storyProgress === 5 && "The end! Keep practicing to write your own story!"}
            </p>
            {storyProgress < 5 && (
              <button
                onClick={nextStoryStep}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Continue Story
              </button>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={checkAnswer}
          disabled={!userAnswer && exerciseType !== 'sentence-construction'}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
        <button
          onClick={generateExercise}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          New Exercise
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`mt-4 p-4 rounded-lg animate-fade-in ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
          style={{
            animation: 'fadeIn 0.3s ease-out'
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
            <div>
              <p className="font-semibold">
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              <p className="text-sm">{currentExercise?.explanation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedExerciseTypes; 