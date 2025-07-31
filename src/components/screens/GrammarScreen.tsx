import React, { useState } from 'react';
import { useStore, useProgress } from '../../store/useStore';
import { GrammarTopic, GrammarParticle, GrammarPattern } from '../../types';
import { speakJapanese } from '../../utils/speech';

const GrammarScreen: React.FC = () => {
  const { setCurrentSection, addXP } = useStore();
  const progress = useProgress();
  
  const [selectedTopic, setSelectedTopic] = useState<string>('particles');
  const [selectedParticle, setSelectedParticle] = useState<GrammarParticle | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<GrammarPattern | null>(null);
  const [showExamples, setShowExamples] = useState(false);

  const grammarTopics: GrammarTopic[] = [
    {
      id: 'particles',
      title: 'Basic Particles',
      description: 'Learn essential Japanese particles',
      particles: [
        {
          particle: 'は (wa)',
          usage: 'Topic marker - indicates the topic of the sentence',
          examples: [
            '私は学生です。 (Watashi wa gakusei desu.) - I am a student.',
            'これは本です。 (Kore wa hon desu.) - This is a book.',
            '日本は美しい国です。 (Nihon wa utsukushii kuni desu.) - Japan is a beautiful country.'
          ]
        },
        {
          particle: 'を (wo)',
          usage: 'Direct object marker - marks the object of a verb',
          examples: [
            '本を読みます。 (Hon wo yomimasu.) - I read a book.',
            'ご飯を食べます。 (Gohan wo tabemasu.) - I eat rice.',
            '映画を見ます。 (Eiga wo mimasu.) - I watch a movie.'
          ]
        },
        {
          particle: 'に (ni)',
          usage: 'Location/direction marker - indicates where or when',
          examples: [
            '学校に行きます。 (Gakkou ni ikimasu.) - I go to school.',
            '7時に起きます。 (Shichi-ji ni okimasu.) - I wake up at 7.',
            '東京に住んでいます。 (Tokyo ni sunde imasu.) - I live in Tokyo.'
          ]
        },
        {
          particle: 'で (de)',
          usage: 'Location of action marker - indicates where an action takes place',
          examples: [
            'レストランで食べます。 (Resutoran de tabemasu.) - I eat at a restaurant.',
            '図書館で勉強します。 (Toshokan de benkyou shimasu.) - I study at the library.',
            '公園で遊びます。 (Kouen de asobimasu.) - I play at the park.'
          ]
        },
        {
          particle: 'の (no)',
          usage: 'Possession marker - indicates possession or connection',
          examples: [
            '私の本 (Watashi no hon) - My book',
            '日本の文化 (Nihon no bunka) - Japanese culture',
            '友達の家 (Tomodachi no ie) - Friend\'s house'
          ]
        }
      ],
      patterns: [],
      examples: []
    },
    {
      id: 'verb-conjugation',
      title: 'Verb Conjugation',
      description: 'Learn how to conjugate Japanese verbs',
      particles: [],
      patterns: [
        {
          pattern: 'Present Tense (ます form)',
          explanation: 'Polite form used in formal situations',
          examples: [
            '食べます (tabemasu) - eat',
            '行きます (ikimasu) - go',
            '見ます (mimasu) - see/watch'
          ]
        },
        {
          pattern: 'Past Tense (ました form)',
          explanation: 'Polite past tense',
          examples: [
            '食べました (tabemashita) - ate',
            '行きました (ikimashita) - went',
            '見ました (mimashita) - saw/watched'
          ]
        },
        {
          pattern: 'Negative (ません form)',
          explanation: 'Polite negative form',
          examples: [
            '食べません (tabemasen) - don\'t eat',
            '行きません (ikimasen) - don\'t go',
            '見ません (mimasen) - don\'t see/watch'
          ]
        }
      ],
      examples: []
    },
    {
      id: 'adjectives',
      title: 'Adjectives',
      description: 'Learn how to use Japanese adjectives',
      particles: [],
      patterns: [
        {
          pattern: 'い-Adjectives',
          explanation: 'Adjectives ending in い that can be conjugated',
          examples: [
            '大きい (ookii) - big',
            '小さい (chiisai) - small',
            '美しい (utsukushii) - beautiful'
          ]
        },
        {
          pattern: 'な-Adjectives',
          explanation: 'Adjectives that require な before nouns',
          examples: [
            '静か (shizuka) - quiet',
            '元気 (genki) - healthy/energetic',
            '有名 (yuumei) - famous'
          ]
        }
      ],
      examples: [
        {
          japanese: 'この本は大きいです。',
          romaji: 'Kono hon wa ookii desu.',
          english: 'This book is big.',
          explanation: 'い-adjective used in present tense'
        },
        {
          japanese: '静かな公園で勉強します。',
          romaji: 'Shizuka na kouen de benkyou shimasu.',
          english: 'I study at a quiet park.',
          explanation: 'な-adjective with な before noun'
        }
      ]
    }
  ];

  const currentTopic = grammarTopics.find(topic => topic.id === selectedTopic);

  const handleParticleClick = (particle: GrammarParticle) => {
    setSelectedParticle(particle);
    setSelectedPattern(null);
    setShowExamples(true);
    addXP(2);
  };

  const handlePatternClick = (pattern: GrammarPattern) => {
    setSelectedPattern(pattern);
    setSelectedParticle(null);
    setShowExamples(true);
    addXP(2);
  };

  const speakJapaneseText = (text: string) => {
    speakJapanese(text);
  };

  const getProgressPercentage = () => {
    const grammarProgress = progress.grammar || [];
    const completed = grammarProgress.filter(g => g.mastered).length;
    const total = 50; // Total grammar topics to learn
    return (completed / total) * 100;
  };

  return (
    <div className="min-h-screen p-8 relative">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="glass-card rounded-3xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gradient mb-2">文法 Grammar</h1>
              <p className="text-gray-600 text-lg">Master Japanese particles and sentence structure</p>
            </div>
            <button
              onClick={() => setCurrentSection('home')}
              className="glass-card p-3 rounded-full hover:scale-110 transition-transform"
            >
              🏠
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Grammar Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {(() => {
                  const grammarProgress = progress.grammar || [];
                  const completed = grammarProgress.filter(g => g.mastered).length;
                  return `${completed} / 50`;
                })()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="gradient-purple h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Topic Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {grammarTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`glass-card rounded-2xl p-6 text-center transition-all ${
                  selectedTopic === topic.id 
                    ? 'ring-4 ring-japanese-purple scale-105' 
                    : 'hover:scale-105'
                }`}
              >
                <div className="text-3xl font-bold text-japanese-purple mb-2">
                  {topic.id === 'particles' ? 'は' : topic.id === 'verb-conjugation' ? '行' : '美'}
                </div>
                <div className="font-bold text-gray-800 mb-1">{topic.title}</div>
                <div className="text-sm text-gray-600">{topic.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Content */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {currentTopic?.title}
              </h2>
              
              {currentTopic?.particles && currentTopic.particles.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">Particles</h3>
                  {currentTopic.particles.map((particle, index) => (
                    <div
                      key={index}
                      onClick={() => handleParticleClick(particle)}
                      className="glass-card rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl font-bold text-japanese-purple">
                          {particle.particle}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakJapaneseText(particle.particle.split(' ')[0]);
                          }}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          🔊
                        </button>
                      </div>
                      <div className="text-lg font-medium text-gray-800 mb-2">
                        {particle.usage}
                      </div>
                      <div className="text-sm text-gray-600">
                        Click to see examples
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentTopic?.patterns && currentTopic.patterns.length > 0 && (
                <div className="space-y-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">Patterns</h3>
                  {currentTopic.patterns.map((pattern, index) => (
                    <div
                      key={index}
                      onClick={() => handlePatternClick(pattern)}
                      className="glass-card rounded-2xl p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
                    >
                      <div className="text-xl font-bold text-japanese-purple mb-2">
                        {pattern.pattern}
                      </div>
                      <div className="text-gray-800 mb-3">
                        {pattern.explanation}
                      </div>
                      <div className="text-sm text-gray-600">
                        Click to see examples
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {currentTopic?.examples && currentTopic.examples.length > 0 && (
                <div className="space-y-6 mt-8">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">Examples</h3>
                  {currentTopic.examples.map((example, index) => (
                    <div key={index} className="glass-card rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-xl font-bold text-gray-800">
                          {example.japanese}
                        </div>
                        <button
                          onClick={() => speakJapaneseText(example.japanese)}
                          className="text-2xl hover:scale-110 transition-transform"
                        >
                          🔊
                        </button>
                      </div>
                      <div className="text-gray-600 mb-2">
                        {example.romaji}
                      </div>
                      <div className="text-gray-800 mb-2">
                        {example.english}
                      </div>
                      <div className="text-sm text-gray-500">
                        {example.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Focus Section */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-3xl p-8 sticky top-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Focus Practice</h3>
              
              {selectedParticle ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-japanese-purple mb-4">
                      {selectedParticle.particle}
                    </div>
                    <div className="text-lg font-medium text-gray-800 mb-4">
                      {selectedParticle.usage}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-700">Examples:</h4>
                    {selectedParticle.examples.map((example, index) => (
                      <div key={index} className="glass-card rounded-xl p-4">
                        <div className="text-sm font-medium text-gray-800 mb-1">
                          {example}
                        </div>
                        <button
                          onClick={() => speakJapaneseText(example.split(' ')[0])}
                          className="text-lg hover:scale-110 transition-transform"
                        >
                          🔊
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowExamples(false)}
                    className="w-full btn-modern text-lg py-3"
                  >
                    Practice This Particle
                  </button>
                </div>
              ) : selectedPattern ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-japanese-purple mb-4">
                      {selectedPattern.pattern}
                    </div>
                    <div className="text-gray-800 mb-4">
                      {selectedPattern.explanation}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-700">Examples:</h4>
                    {selectedPattern.examples.map((example, index) => (
                      <div key={index} className="glass-card rounded-xl p-4 text-center">
                        <div className="text-lg font-medium text-gray-800">
                          {example}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setShowExamples(false)}
                    className="w-full btn-modern text-lg py-3"
                  >
                    Practice This Pattern
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <div className="text-6xl mb-4">👆</div>
                  <p>Click on a particle or pattern to practice</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Practice */}
        <div className="glass-card rounded-3xl p-8 mt-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Quick Practice</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => setCurrentSection('quiz')}
              className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all"
            >
              <div className="text-4xl mb-4">🧠</div>
              <div className="font-bold text-gray-800 mb-2">Grammar Quiz</div>
              <div className="text-sm text-gray-600">Test your grammar knowledge</div>
            </button>
            
            <button
              onClick={() => setCurrentSection('quiz')}
              className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all"
            >
              <div className="text-4xl mb-4">✏️</div>
              <div className="font-bold text-gray-800 mb-2">Sentence Building</div>
              <div className="text-sm text-gray-600">Practice constructing sentences</div>
            </button>
            
            <button
              onClick={() => setCurrentSection('quiz')}
              className="glass-card rounded-2xl p-6 text-center hover:scale-105 transition-all"
            >
              <div className="text-4xl mb-4">🎯</div>
              <div className="font-bold text-gray-800 mb-2">Mixed Practice</div>
              <div className="text-sm text-gray-600">Combine all grammar concepts</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrammarScreen; 