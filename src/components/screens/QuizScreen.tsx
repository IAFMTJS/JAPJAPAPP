import React, { useState, useEffect, useCallback } from 'react';
import { useStore, useProgress } from '../../store/useStore';
import { Exercise, ExerciseType } from '../../types';
import { hiraganaData } from '../../data/hiragana';
import { katakanaData } from '../../data/katakana';
import { kanjiData } from '../../data/kanji';
import { speakJapanese } from '../../utils/speech';

const QuizScreen: React.FC = () => {
  const progress = useProgress();
  const { setCurrentSection, addXP, addQuizResult, addPracticeSession } = useStore();
  
  const [selectedCategory, setSelectedCategory] = useState<'hiragana' | 'katakana' | 'kanji' | 'grammar' | 'mixed'>('hiragana');
  const [selectedExerciseType, setSelectedExerciseType] = useState<ExerciseType>('flashcard');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [mistakes, setMistakes] = useState<Array<{questionId: string, question: string, userAnswer: string, correctAnswer: string, explanation: string}>>([]);

  const exerciseTypes: { type: ExerciseType; name: string; description: string; icon: string }[] = [
    { type: 'flashcard', name: 'Flashcards', description: 'Learn with visual cards', icon: '🃏' },
    { type: 'multiple-choice', name: 'Multiple Choice', description: 'Choose the correct answer', icon: '☑️' },
    { type: 'fill-blank', name: 'Fill in the Blank', description: 'Complete missing parts', icon: '✏️' },
    { type: 'match-sound', name: 'Sound Matching', description: 'Match audio to characters', icon: '🔊' },
    { type: 'listen-type', name: 'Listen & Type', description: 'Type what you hear', icon: '⌨️' },
    { type: 'speak-repeat', name: 'Speak & Repeat', description: 'Practice pronunciation', icon: '🎤' }
  ];

  const categories = [
    { id: 'hiragana', name: 'Hiragana', color: 'japanese-red', icon: 'あ' },
    { id: 'katakana', name: 'Katakana', color: 'japanese-blue', icon: 'ア' },
    { id: 'kanji', name: 'Kanji', color: 'japanese-green', icon: '水' },
    { id: 'grammar', name: 'Grammar', color: 'japanese-purple', icon: 'は' },
    { id: 'mixed', name: 'Mixed', color: 'japanese-gold', icon: '🎯' }
  ];

  const generateExercise = (category: string, type: ExerciseType): Exercise => {
    switch (category) {
      case 'hiragana':
        return generateHiraganaExercise(type);
      case 'katakana':
        return generateKatakanaExercise(type);
      case 'kanji':
        return generateKanjiExercise(type);
      case 'grammar':
        return generateGrammarExercise(type);
      case 'mixed':
        return generateMixedExercise(type);
      default:
        return generateHiraganaExercise(type);
    }
  };

  const generateHiraganaExercise = (type: ExerciseType): Exercise => {
    const characters = hiraganaData;
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    
    switch (type) {
      case 'flashcard':
        return {
          id: `hiragana-${Date.now()}`,
          type: 'flashcard',
          question: `What is the romaji for ${randomChar.character}?`,
          correctAnswer: randomChar.romaji,
          explanation: `${randomChar.character} is pronounced "${randomChar.romaji}"`,
          audio: randomChar.audio
        };
      case 'multiple-choice':
        const options = [randomChar.romaji];
        while (options.length < 4) {
          const randomOption = characters[Math.floor(Math.random() * characters.length)].romaji;
          if (!options.includes(randomOption)) {
            options.push(randomOption);
          }
        }
        return {
          id: `hiragana-${Date.now()}`,
          type: 'multiple-choice',
          question: `What is the romaji for ${randomChar.character}?`,
          options: options.sort(() => Math.random() - 0.5),
          correctAnswer: randomChar.romaji,
          explanation: `${randomChar.character} is pronounced "${randomChar.romaji}"`,
          audio: randomChar.audio
        };
      default:
        return {
          id: `hiragana-${Date.now()}`,
          type: 'flashcard',
          question: `What is the romaji for ${randomChar.character}?`,
          correctAnswer: randomChar.romaji,
          explanation: `${randomChar.character} is pronounced "${randomChar.romaji}"`,
          audio: randomChar.audio
        };
    }
  };

  const generateKatakanaExercise = (type: ExerciseType): Exercise => {
    const characters = katakanaData;
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    
    switch (type) {
      case 'flashcard':
        return {
          id: `katakana-${Date.now()}`,
          type: 'flashcard',
          question: `What is the romaji for ${randomChar.character}?`,
          correctAnswer: randomChar.romaji,
          explanation: `${randomChar.character} is pronounced "${randomChar.romaji}"`,
          audio: randomChar.audio
        };
      case 'multiple-choice':
        const options = [randomChar.romaji];
        while (options.length < 4) {
          const randomOption = characters[Math.floor(Math.random() * characters.length)].romaji;
          if (!options.includes(randomOption)) {
            options.push(randomOption);
          }
        }
        return {
          id: `katakana-${Date.now()}`,
          type: 'multiple-choice',
          question: `What is the romaji for ${randomChar.character}?`,
          options: options.sort(() => Math.random() - 0.5),
          correctAnswer: randomChar.romaji,
          explanation: `${randomChar.character} is pronounced "${randomChar.romaji}"`,
          audio: randomChar.audio
        };
      default:
        return {
          id: `katakana-${Date.now()}`,
          type: 'flashcard',
          question: `What is the romaji for ${randomChar.character}?`,
          correctAnswer: randomChar.romaji,
          explanation: `${randomChar.character} is pronounced "${randomChar.romaji}"`,
          audio: randomChar.audio
        };
    }
  };

  const generateKanjiExercise = (type: ExerciseType): Exercise => {
    const characters = kanjiData;
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    
    switch (type) {
             case 'flashcard':
         return {
           id: `kanji-${Date.now()}`,
           type: 'flashcard',
           question: `What is the meaning of ${randomChar.character}?`,
           correctAnswer: randomChar.meaning,
           explanation: `${randomChar.character} means "${randomChar.meaning}" (${randomChar.onyomi}/${randomChar.kunyomi})`,
           audio: randomChar.onyomi
         };
      case 'multiple-choice':
        const meanings = ['one', 'two', 'three', 'mountain', 'water', 'fire', 'person', 'time', 'day', 'year'];
        const options = [randomChar.meaning];
        while (options.length < 4) {
          const randomMeaning = meanings[Math.floor(Math.random() * meanings.length)];
          if (!options.includes(randomMeaning)) {
            options.push(randomMeaning);
          }
        }
                 return {
           id: `kanji-${Date.now()}`,
           type: 'multiple-choice',
           question: `What is the meaning of ${randomChar.character}?`,
           options: options.sort(() => Math.random() - 0.5),
           correctAnswer: randomChar.meaning,
           explanation: `${randomChar.character} means "${randomChar.meaning}" (${randomChar.onyomi}/${randomChar.kunyomi})`,
           audio: randomChar.onyomi
         };
             default:
         return {
           id: `kanji-${Date.now()}`,
           type: 'flashcard',
           question: `What is the meaning of ${randomChar.character}?`,
           correctAnswer: randomChar.meaning,
           explanation: `${randomChar.character} means "${randomChar.meaning}" (${randomChar.onyomi}/${randomChar.kunyomi})`,
           audio: randomChar.onyomi
         };
    }
  };

  const generateGrammarExercise = (type: ExerciseType): Exercise => {
    const grammarQuestions = [
      {
        question: 'What particle marks the subject in Japanese?',
        correctAnswer: 'は',
        explanation: 'は (wa) is the topic marker particle'
      },
      {
        question: 'What particle marks the object of a verb?',
        correctAnswer: 'を',
        explanation: 'を (wo) marks the direct object'
      },
      {
        question: 'What particle indicates location?',
        correctAnswer: 'に',
        explanation: 'に (ni) indicates location or direction'
      }
    ];
    
    const randomQuestion = grammarQuestions[Math.floor(Math.random() * grammarQuestions.length)];
    
         return {
       id: `grammar-${Date.now()}`,
       type: 'multiple-choice',
       question: randomQuestion.question,
       options: ['は', 'を', 'に', 'で'].sort(() => Math.random() - 0.5),
       correctAnswer: randomQuestion.correctAnswer,
       explanation: randomQuestion.explanation,
       audio: randomQuestion.correctAnswer
     };
  };

  const generateMixedExercise = (type: ExerciseType): Exercise => {
    const categories = ['hiragana', 'katakana', 'kanji', 'grammar'];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    return generateExercise(randomCategory, type);
  };

  const startQuiz = () => {
    setIsQuizActive(true);
    setScore(0);
    setTotalQuestions(10);
    setCurrentQuestionIndex(0);
    setMistakes([]);
    setTimeLeft(300); // 5 minutes
    generateNextQuestion();
  };

  const generateNextQuestion = () => {
    const exercise = generateExercise(selectedCategory, selectedExerciseType);
    setCurrentExercise(exercise);
    setUserAnswer('');
    setShowAnswer(false);
  };

  const handleAnswer = (answer: string) => {
    setUserAnswer(answer);
    setShowAnswer(true);
    
    const isCorrect = currentExercise && (Array.isArray(currentExercise.correctAnswer) 
      ? currentExercise.correctAnswer.includes(answer)
      : answer.toLowerCase() === currentExercise.correctAnswer.toLowerCase());
    
    if (isCorrect) {
      setScore(score + 1);
      addXP(5);
    } else if (currentExercise) {
      const correctAnswerStr = Array.isArray(currentExercise.correctAnswer) 
        ? currentExercise.correctAnswer.join(', ')
        : currentExercise.correctAnswer;
      
      setMistakes([...mistakes, {
        questionId: currentExercise.id,
        question: currentExercise.question,
        userAnswer: answer,
        correctAnswer: correctAnswerStr,
        explanation: currentExercise.explanation
      }]);
    }

    // Update progress tracking
    if (currentExercise) {
      // Progress tracking commented out for now
      // let characterId = '';
      // if (currentExercise.question.includes('romaji')) {
      //   characterId = currentExercise.question.split(' ').pop()?.replace('?', '') || '';
      // } else if (currentExercise.question.includes('meaning of')) {
      //   characterId = currentExercise.question.split('meaning of ')[1]?.split('?')[0] || '';
      // } else if (currentExercise.question.includes('particle')) {
      //   characterId = Array.isArray(currentExercise.correctAnswer) 
      //     ? currentExercise.correctAnswer[0] 
      //     : currentExercise.correctAnswer;
      // }

      // const category = selectedCategory === 'mixed' ? 'hiragana' : selectedCategory;
      // const correct = !!isCorrect;
      // updateProgress(category as any, characterId, correct, correct, 30); // 30 seconds per question
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      generateNextQuestion();
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = useCallback(() => {
    const finalScore = (score / totalQuestions) * 100;
    const timeTaken = 300 - timeLeft;
    
    const quizResult = {
      quizId: `quiz-${Date.now()}`,
      score: finalScore,
      totalQuestions,
      correctAnswers: score,
      timeTaken,
      mistakes,
      completedAt: new Date()
    };
    
    // Create practice session
    const practiceSession = {
      id: `session-${Date.now()}`,
      type: selectedCategory === 'mixed' ? 'hiragana' : selectedCategory,
      startTime: new Date(Date.now() - timeTaken * 1000),
      endTime: new Date(),
      duration: timeTaken,
      totalQuestions,
      correctAnswers: score,
      accuracy: finalScore,
      charactersPracticed: currentExercise ? [currentExercise.question.split(' ').pop()?.replace('?', '') || ''] : [],
      mistakes: mistakes.map(m => m.questionId)
    };
    
    addQuizResult(quizResult);
    addPracticeSession(practiceSession);
    addXP(Math.floor(finalScore / 10));
    setIsQuizActive(false);
  }, [score, totalQuestions, timeLeft, mistakes, selectedCategory, currentExercise, addQuizResult, addPracticeSession, addXP, setIsQuizActive]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isQuizActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft <= 1) {
          finishQuiz();
        }
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isQuizActive, timeLeft, finishQuiz]);

  const speakCharacter = (text: string) => {
    speakJapanese(text);
  };

  const getAudioText = (exercise: Exercise): string => {
    if (exercise.audio) {
      return exercise.audio;
    }
    
    // For kanji exercises, speak the character itself
    if (exercise.question.includes('meaning of')) {
      const character = exercise.question.split('meaning of ')[1]?.split('?')[0];
      return character || '';
    }
    
    // For grammar exercises, speak the particle
    if (exercise.question.includes('particle')) {
      const particle = Array.isArray(exercise.correctAnswer) 
        ? exercise.correctAnswer[0] 
        : exercise.correctAnswer;
      return particle || '';
    }
    
    // For other cases, try to extract the character from the question
    const character = exercise.question.split(' ').pop()?.replace('?', '');
    return character || '';
  };

  if (isQuizActive) {
    return (
      <div className="min-h-screen p-8 relative">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-20 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-10 left-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Quiz Header */}
          <div className="glass-card rounded-3xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gradient">Quiz in Progress</h1>
                <p className="text-gray-600">Question {currentQuestionIndex + 1} of {totalQuestions}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-japanese-gold">{score}/{totalQuestions}</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="gradient-purple h-3 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              ></div>
            </div>
            
            {/* Timer */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                Time left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
              <button
                onClick={() => setIsQuizActive(false)}
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                End Quiz
              </button>
            </div>
          </div>

          {/* Current Question */}
          {currentExercise && (
            <div className="glass-card rounded-3xl p-8 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentExercise.question}</h2>
                
                {currentExercise.type === 'flashcard' && (
                  <div className="text-8xl font-bold text-japanese-purple mb-6">
                    {currentExercise.question.includes('romaji') ? 
                      currentExercise.question.split(' ').pop()?.replace('?', '') : 
                      currentExercise.question.split(' ').pop()?.replace('?', '')}
                  </div>
                )}
              </div>

              {!showAnswer ? (
                <div className="space-y-4">
                  {currentExercise.type === 'multiple-choice' && currentExercise.options ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentExercise.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(option)}
                          className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all duration-300"
                        >
                          <div className="text-xl font-bold text-gray-800">{option}</div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        className="input-modern w-full max-w-md text-center text-xl"
                        onKeyPress={(e) => e.key === 'Enter' && handleAnswer(userAnswer)}
                      />
                      <button
                        onClick={() => handleAnswer(userAnswer)}
                        className="btn-modern mt-4 px-8 py-3"
                        disabled={!userAnswer.trim()}
                      >
                        Submit Answer
                      </button>
                    </div>
                  )}
                  
                                     <div className="text-center mt-4">
                     {currentExercise.audio || getAudioText(currentExercise) ? (
                       <button
                         onClick={() => speakCharacter(getAudioText(currentExercise))}
                         className="text-3xl hover:scale-110 transition-transform"
                         title="Listen to pronunciation"
                       >
                         🔊
                       </button>
                     ) : (
                       <div className="text-gray-400 text-sm">
                         🔊 Audio not available for this exercise
                       </div>
                     )}
                   </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`text-4xl mb-4 ${Array.isArray(currentExercise.correctAnswer) 
                    ? currentExercise.correctAnswer.includes(userAnswer) ? 'text-green-500' : 'text-red-500'
                    : userAnswer.toLowerCase() === currentExercise.correctAnswer.toLowerCase() ? 'text-green-500' : 'text-red-500'}`}>
                    {Array.isArray(currentExercise.correctAnswer) 
                      ? currentExercise.correctAnswer.includes(userAnswer) ? '✅' : '❌'
                      : userAnswer.toLowerCase() === currentExercise.correctAnswer.toLowerCase() ? '✅' : '❌'}
                  </div>
                  <div className="text-xl font-bold text-gray-800 mb-2">
                    Correct Answer: {Array.isArray(currentExercise.correctAnswer) 
                      ? currentExercise.correctAnswer.join(', ')
                      : currentExercise.correctAnswer}
                  </div>
                  <div className="text-gray-600 mb-6">
                    {currentExercise.explanation}
                  </div>
                  <button
                    onClick={nextQuestion}
                    className="btn-modern px-8 py-3"
                  >
                    {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">Quiz & Exercises</h1>
              <p className="text-gray-600 text-lg">Test your Japanese knowledge with interactive exercises</p>
            </div>
            <button
              onClick={() => setCurrentSection('home')}
              className="glass-card p-3 rounded-full hover:scale-110 transition-transform"
            >
              🏠
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-red mb-2">
                {progress.hiragana.filter(p => p.mastered).length}/46
              </div>
              <div className="text-sm text-gray-600">Hiragana</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-blue mb-2">
                {progress.katakana.filter(p => p.mastered).length}/46
              </div>
              <div className="text-sm text-gray-600">Katakana</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-green mb-2">
                {progress.kanji.filter(p => p.mastered).length}/300
              </div>
              <div className="text-sm text-gray-600">Kanji</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-japanese-purple mb-2">
                {progress.grammar.filter(p => p.mastered).length}/50
              </div>
              <div className="text-sm text-gray-600">Grammar</div>
            </div>
          </div>
        </div>

        {/* Category Selection */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Learning Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`glass-card rounded-2xl p-6 text-center transition-all ${
                  selectedCategory === category.id 
                    ? `ring-4 ring-${category.color} scale-105` 
                    : 'hover:scale-105'
                }`}
              >
                <div className={`text-4xl font-bold text-${category.color} mb-2`}>
                  {category.icon}
                </div>
                <div className="text-sm font-medium text-gray-700">{category.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Exercise Type Selection */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Choose Exercise Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {exerciseTypes.map((exerciseType) => (
              <button
                key={exerciseType.type}
                onClick={() => setSelectedExerciseType(exerciseType.type)}
                className={`glass-card rounded-2xl p-6 text-center transition-all ${
                  selectedExerciseType === exerciseType.type 
                    ? 'ring-4 ring-japanese-gold scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                <div className="text-4xl mb-2">{exerciseType.icon}</div>
                <div className="font-bold text-gray-800 mb-1">{exerciseType.name}</div>
                <div className="text-xs text-gray-600">{exerciseType.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Quiz Button */}
        <div className="text-center">
          <button
            onClick={startQuiz}
            className="btn-modern text-2xl py-6 px-12"
          >
            🚀 Start {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Quiz
          </button>
          <p className="text-gray-600 mt-4">
            {selectedExerciseType} exercises • 10 questions • 5 minutes
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen; 