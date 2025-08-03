import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from '../../store/useStore';
import { Exercise, ExerciseType, Progress } from '../../types';

interface AdvancedExerciseSystemProps {
  onExerciseComplete: (exercise: Exercise, result: any) => void;
  onProgressUpdate: (progress: any) => void;
  userProgress?: Progress;
  difficulty?: 'easy' | 'medium' | 'hard';
  focusArea?: 'hiragana' | 'katakana' | 'kanji' | 'grammar';
}

const AdvancedExerciseSystem: React.FC<AdvancedExerciseSystemProps> = ({
  onExerciseComplete,
  onProgressUpdate,
  userProgress,
  difficulty = 'medium',
  focusArea = 'hiragana'
}) => {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [exerciseType, setExerciseType] = useState<ExerciseType>('multiple-choice');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [xpEarned, setXpEarned] = useState(0);
  
  // Memory game state
  const [memoryCards, setMemoryCards] = useState<any[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  
  // Pattern recognition state
  const [patternSequence, setPatternSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [showingPattern, setShowingPattern] = useState(false);
  
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);
  
  // Gesture recognition state
  const [currentGesture, setCurrentGesture] = useState<string>('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const {
    startLearningSession,
    endLearningSession,
    trackExerciseCompletion,
    trackAIInteraction
  } = useStore();

  // Start learning session when component mounts
  useEffect(() => {
    startLearningSession();
    
    // End session when component unmounts
    return () => {
      endLearningSession();
    };
  }, [startLearningSession, endLearningSession]);

  // Initialize voice recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'ja-JP';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        setUserAnswer(transcript);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // Initialize gesture recognition
  const initializeGestureRecognition = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Simple gesture detection (in a real app, you'd use ML libraries)
      // setGestureMode(true); // TODO: Implement gesture mode
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  }, []);

  // Memory game functions
  const initializeMemoryGame = useCallback(() => {
    const characters = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ'];
    const selectedChars = characters.slice(0, 6);
    const cards = [...selectedChars, ...selectedChars]
      .sort(() => Math.random() - 0.5)
      .map((char, index) => ({
        id: index,
        character: char,
        isFlipped: false,
        isMatched: false
      }));
    
    setMemoryCards(cards);
    setFlippedCards([]);
    setMatchedPairs([]);
  }, []);

  const handleCardClick = useCallback((cardId: number) => {
    if (flippedCards.length === 2 || memoryCards[cardId].isMatched) return;
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      if (memoryCards[first].character === memoryCards[second].character) {
        setMatchedPairs(prev => [...prev, first, second]);
        setScore(prev => prev + 20);
        setStreak(prev => prev + 1);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setStreak(0);
        }, 1000);
      }
    }
  }, [flippedCards, memoryCards]);

  // Pattern recognition functions
  const initializePatternRecognition = useCallback(() => {
    const patterns = ['あ', 'い', 'う', 'え', 'お'];
    const sequence = [];
    for (let i = 0; i < 4; i++) {
      sequence.push(patterns[Math.floor(Math.random() * patterns.length)]);
    }
    setPatternSequence(sequence);
    setUserSequence([]);
    setShowingPattern(true);
    
    // Show pattern to user
    setTimeout(() => {
      setShowingPattern(false);
    }, 3000);
  }, []);

  const addToUserSequence = useCallback((character: string) => {
    if (showingPattern) return;
    
    const newSequence = [...userSequence, character];
    setUserSequence(newSequence);
    
    // Check if sequence is correct so far
    const isCorrectSoFar = newSequence.every((char, index) => char === patternSequence[index]);
    
    if (!isCorrectSoFar) {
      // Wrong sequence
      setScore(prev => Math.max(0, prev - 10));
      setStreak(0);
      setTimeout(() => {
        setUserSequence([]);
        initializePatternRecognition();
      }, 1000);
    } else if (newSequence.length === patternSequence.length) {
      // Complete sequence
      setScore(prev => prev + 30);
      setStreak(prev => prev + 1);
      setTimeout(() => {
        setUserSequence([]);
        initializePatternRecognition();
      }, 1000);
    }
  }, [userSequence, patternSequence, showingPattern, initializePatternRecognition]);

  // Voice recognition functions
  const startListening = useCallback(() => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  // Timer functions
  const startTimer = useCallback(() => {
    setTimeRemaining(30);
    setIsTimerActive(true);
  }, []);

  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    setStreak(0);
    // Handle time up logic
  }, []);

  // Generate advanced exercises
  const generateAdvancedExercise = useCallback(() => {
    const exerciseTypes: ExerciseType[] = [
      'memory-game',
      'pattern-recognition',
      'voice-practice',
      'gesture-learning',
      'cultural-context',
      'speed-challenge',
      'combo-exercise'
    ] as ExerciseType[];

    const randomType = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    
    const exercise: Exercise = {
      id: Date.now().toString(),
      type: randomType,
      question: `Practice ${randomType.replace('-', ' ')}`,
      correctAnswer: 'correct',
      explanation: 'Great job!',
      difficulty,
      category: focusArea,
      tags: [focusArea, randomType],
      hints: ['Take your time', 'Focus on accuracy'],
      points: 15,
      aiGenerated: true,
      userRating: 0,
      usageCount: 0,
      successRate: 0
    };

    setCurrentExercise(exercise);
    setExerciseType(randomType);
    setUserAnswer('');
    setIsCorrect(null);
    setShowFeedback(false);

    // Initialize specific exercise types
    switch (randomType) {
      case 'memory-game':
        initializeMemoryGame();
        break;
      case 'pattern-recognition':
        initializePatternRecognition();
        break;
      case 'voice-practice':
        startListening();
        break;
      case 'gesture-learning':
        initializeGestureRecognition();
        break;
      case 'speed-challenge':
        startTimer();
        break;
    }
  }, [difficulty, focusArea, initializeMemoryGame, initializePatternRecognition, startListening, initializeGestureRecognition, startTimer]);

  // Check answer with enhanced logic
  const checkAnswer = useCallback((userAnswer: string | string[]) => {
    if (!currentExercise) return;

    let correct = false;
    let xpGained = 0;
    const startTime = Date.now();

    switch (currentExercise.type) {
      case 'multiple-choice':
      case 'fill-blank':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 15 : 5;
        break;
      case 'drag-drop':
      case 'match-sound':
        correct = Array.isArray(userAnswer) && 
                 Array.isArray(currentExercise.correctAnswer) &&
                 userAnswer.length === currentExercise.correctAnswer.length &&
                 userAnswer.every((ans, index) => ans === currentExercise.correctAnswer[index]);
        xpGained = correct ? 20 : 5;
        break;
      case 'listen-type':
      case 'speak-repeat':
        correct = typeof userAnswer === 'string' && typeof currentExercise.correctAnswer === 'string' && userAnswer.toLowerCase() === currentExercise.correctAnswer.toLowerCase();
        xpGained = correct ? 25 : 5;
        break;
      case 'handwriting':
        correct = typeof userAnswer === 'string' && typeof currentExercise.correctAnswer === 'string' && userAnswer.toLowerCase() === currentExercise.correctAnswer.toLowerCase();
        xpGained = correct ? 30 : 5;
        break;
      case 'sentence-construction':
        correct = typeof userAnswer === 'string' && typeof currentExercise.correctAnswer === 'string' && userAnswer.toLowerCase() === currentExercise.correctAnswer.toLowerCase();
        xpGained = correct ? 35 : 5;
        break;
      case 'translation':
        correct = typeof userAnswer === 'string' && typeof currentExercise.correctAnswer === 'string' && userAnswer.toLowerCase() === currentExercise.correctAnswer.toLowerCase();
        xpGained = correct ? 40 : 5;
        break;
      case 'context-cloze':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 25 : 5;
        break;
      case 'grammar-correction':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 30 : 5;
        break;
      case 'pronunciation-practice':
        correct = typeof userAnswer === 'string' && typeof currentExercise.correctAnswer === 'string' && userAnswer.toLowerCase() === currentExercise.correctAnswer.toLowerCase();
        xpGained = correct ? 35 : 5;
        break;
      case 'listening-comprehension':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 40 : 5;
        break;
      case 'reading-comprehension':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 45 : 5;
        break;
      case 'memory-game':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 50 : 10;
        break;
      case 'pattern-recognition':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 55 : 10;
        break;
      case 'voice-practice':
        const correctAnswer = Array.isArray(currentExercise.correctAnswer)
          ? currentExercise.correctAnswer[0]
          : currentExercise.correctAnswer;
        correct = typeof userAnswer === 'string' && typeof correctAnswer === 'string' && userAnswer.toLowerCase().includes(correctAnswer.toLowerCase());
        xpGained = correct ? 60 : 10;
        break;
      case 'gesture-learning':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 65 : 10;
        break;
      case 'cultural-context':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 70 : 10;
        break;
      case 'speed-challenge':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 75 : 15;
        break;
      case 'combo-exercise':
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 80 : 15;
        break;
      default:
        correct = userAnswer === currentExercise.correctAnswer;
        xpGained = correct ? 10 : 5;
    }

    const timeSpent = Math.round((Date.now() - startTime) / 1000); // seconds

    // Track exercise completion
    trackExerciseCompletion(
      currentExercise,
      {
        correct,
        xpGained,
        timeSpent,
        characters: 'characters' in currentExercise ? (currentExercise as any).characters : [],
        difficulty,
        focusArea
      },
      timeSpent
    );

    // Track AI interaction if this was an AI-generated exercise
    if (currentExercise.aiGenerated) {
      trackAIInteraction({
        type: 'exercise_completion',
        exercise: currentExercise,
        result: { correct, xpGained, timeSpent }
      });
    }

    setScore(prev => prev + xpGained);
    setStreak(prev => correct ? prev + 1 : 0);
    // setExerciseHistory(prev => [...prev, { ...currentExercise, userAnswer, correct, timeSpent }]); // This state doesn't exist

    // Call the callback
    onExerciseComplete?.(currentExercise, { correct, xpGained, timeSpent });

    // Show result
    // setShowResult(true); // This state doesn't exist
    // setResult({ correct, xpGained, message: correct ? 'Excellent!' : 'Keep trying!' }); // This state doesn't exist

    // Auto-advance after delay
    setTimeout(() => {
      // setShowResult(false); // This state doesn't exist
      generateAdvancedExercise();
    }, 2000);
  }, [currentExercise, onExerciseComplete, trackExerciseCompletion, trackAIInteraction, difficulty, focusArea]);

  // Render exercise content based on type
  const renderExerciseContent = () => {
    if (!currentExercise) return null;

    switch (exerciseType) {
      case 'memory-game':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Memory Game - Match the Characters</h3>
            <div className="grid grid-cols-3 gap-4">
              {memoryCards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`h-20 w-20 rounded-lg border-2 text-2xl font-bold transition-all ${
                    card.isMatched
                      ? 'bg-green-500 text-white border-green-600'
                      : flippedCards.includes(card.id)
                      ? 'bg-blue-500 text-white border-blue-600'
                      : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                  }`}
                  disabled={card.isMatched}
                >
                  {card.isMatched || flippedCards.includes(card.id) ? card.character : '?'}
                </button>
              ))}
            </div>
            <div className="text-center">
              <p className="text-lg">Score: {score}</p>
              <p className="text-lg">Streak: {streak}</p>
            </div>
          </div>
        );

      case 'pattern-recognition':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Pattern Recognition</h3>
            {showingPattern ? (
              <div className="text-center">
                <p className="text-lg mb-4">Watch the pattern:</p>
                <div className="flex justify-center space-x-4">
                  {patternSequence.map((char, index) => (
                    <div
                      key={index}
                      className="h-16 w-16 bg-blue-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold"
                    >
                      {char}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg mb-4">Repeat the pattern:</p>
                <div className="flex justify-center space-x-4 mb-4">
                  {userSequence.map((char, index) => (
                    <div
                      key={index}
                      className="h-16 w-16 bg-green-500 text-white rounded-lg flex items-center justify-center text-2xl font-bold"
                    >
                      {char}
                    </div>
                  ))}
                </div>
                <div className="flex justify-center space-x-2">
                  {['あ', 'い', 'う', 'え', 'お'].map((char) => (
                    <button
                      key={char}
                      onClick={() => addToUserSequence(char)}
                      className="h-12 w-12 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xl font-bold"
                    >
                      {char}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'voice-practice':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Voice Practice</h3>
            <div className="text-center">
              <button
                onClick={isListening ? stopListening : startListening}
                className={`px-6 py-3 rounded-lg font-medium ${
                  isListening
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isListening ? 'Stop Listening' : 'Start Listening'}
              </button>
              {transcript && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-lg">You said: {transcript}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'gesture-learning':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Gesture Learning</h3>
            <div className="text-center">
              <video
                ref={videoRef}
                className="w-full max-w-md mx-auto border rounded-lg"
                autoPlay
                muted
              />
              <p className="mt-2 text-gray-600">Make gestures to interact with characters</p>
            </div>
          </div>
        );

      case 'speed-challenge':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Speed Challenge</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-500 mb-4">
                {timeRemaining}s
              </div>
              <p className="text-lg">Answer as many questions as you can!</p>
              <div className="mt-4">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      checkAnswer(userAnswer);
                    }
                  }}
                />
              </div>
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

  useEffect(() => {
    generateAdvancedExercise();
  }, [generateAdvancedExercise]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Advanced Learning System</h2>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-sm text-gray-600">Level</div>
            <div className="text-xl font-bold text-blue-600">{currentLevel}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-xl font-bold text-green-600">{score}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Streak</div>
            <div className="text-xl font-bold text-orange-600">{streak}</div>
          </div>
        </div>
      </div>

      {/* Exercise Content */}
      <div className="mb-6">
        {renderExerciseContent()}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={() => checkAnswer(userAnswer)}
          disabled={!userAnswer && !['memory-game', 'pattern-recognition', 'voice-practice', 'gesture-learning'].includes(exerciseType)}
          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
        <button
          onClick={generateAdvancedExercise}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          New Exercise
        </button>
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
            <div>
              <p className="font-semibold">
                {isCorrect ? 'Excellent!' : 'Keep trying!'}
              </p>
              <p className="text-sm">XP Earned: {xpEarned}</p>
              <p className="text-sm">{currentExercise?.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Stats */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Learning Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Current Streak</div>
            <div className="font-bold text-orange-600">{streak}</div>
          </div>
          <div>
            <div className="text-gray-600">Total Score</div>
            <div className="font-bold text-green-600">{score}</div>
          </div>
          <div>
            <div className="text-gray-600">Level</div>
            <div className="font-bold text-blue-600">{currentLevel}</div>
          </div>
          <div>
            <div className="text-gray-600">XP Today</div>
            <div className="font-bold text-purple-600">{xpEarned}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedExerciseSystem; 