import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ExpertRolePlayProps {
  topics: string[];
  initialTopic?: string;
  difficulty: number;
  onSuccess: (success: boolean) => void;
  onAttempt: () => void;
  onComplete: (successRate: number) => void;
  awardToken: () => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface TopicFact {
  id: string;
  fact: string;
  difficulty: number;
  visualSupport?: string;
}

const ExpertRolePlay: React.FC<ExpertRolePlayProps> = ({
  topics,
  initialTopic,
  difficulty,
  onSuccess,
  onAttempt,
  onComplete,
  awardToken,
  theme,
  colorScheme,
}) => {
  // State for current topic and facts
  const [currentTopic, setCurrentTopic] = useState(initialTopic || topics[0] || 'Dragon Colors');
  const [expertLevel, setExpertLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  
  // State for clarity feedback
  const [clarityLevel, setClarityLevel] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Topic facts database (in a real app, this would come from an API or database)
  const [topicFacts, setTopicFacts] = useState<Record<string, TopicFact[]>>({
    'Dragon Colors': [
      { id: 'dc1', fact: 'Red dragons breathe fire', difficulty: 1, visualSupport: '🔥' },
      { id: 'dc2', fact: 'Blue dragons control lightning', difficulty: 2, visualSupport: '⚡' },
      { id: 'dc3', fact: 'Green dragons have poison breath', difficulty: 3, visualSupport: '☠️' },
      { id: 'dc4', fact: 'Purple dragons have magic powers', difficulty: 4, visualSupport: '✨' },
      { id: 'dc5', fact: 'Pink dragons are very rare and special', difficulty: 2, visualSupport: '💖' },
    ],
    'Dragon Food': [
      { id: 'df1', fact: 'Dragons eat fish', difficulty: 1, visualSupport: '🐟' },
      { id: 'df2', fact: 'Dragons like berries', difficulty: 1, visualSupport: '🍓' },
      { id: 'df3', fact: 'Dragons drink water from lakes', difficulty: 2, visualSupport: '💧' },
      { id: 'df4', fact: 'Dragons roast their food with fire', difficulty: 3, visualSupport: '🔥' },
      { id: 'df5', fact: 'Baby dragons drink milk', difficulty: 2, visualSupport: '🥛' },
    ],
    'Dragon Homes': [
      { id: 'dh1', fact: 'Dragons live in caves', difficulty: 1, visualSupport: '🏔️' },
      { id: 'dh2', fact: 'Dragons sleep on gold', difficulty: 2, visualSupport: '💰' },
      { id: 'dh3', fact: 'Dragons build nests for eggs', difficulty: 3, visualSupport: '🥚' },
      { id: 'dh4', fact: 'Dragon caves are very warm', difficulty: 2, visualSupport: '🔥' },
      { id: 'dh5', fact: 'Some dragons live in volcanoes', difficulty: 4, visualSupport: '🌋' },
    ],
    'Dragon Friends': [
      { id: 'dfr1', fact: 'Dragons can be friends with humans', difficulty: 1, visualSupport: '👧' },
      { id: 'dfr2', fact: 'Dragons protect their friends', difficulty: 2, visualSupport: '🛡️' },
      { id: 'dfr3', fact: 'Dragons give rides to their friends', difficulty: 2, visualSupport: '🧙‍♂️' },
      { id: 'dfr4', fact: 'Dragons share treasures with friends', difficulty: 3, visualSupport: '💎' },
      { id: 'dfr5', fact: 'Dragons teach friends to fly', difficulty: 4, visualSupport: '🦅' },
    ],
  });
  
  // Current facts for the selected topic
  const [currentFacts, setCurrentFacts] = useState<TopicFact[]>([]);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  
  // Update current facts when topic changes
  useEffect(() => {
    if (topicFacts[currentTopic]) {
      // Filter facts based on difficulty
      const filteredFacts = topicFacts[currentTopic].filter(fact => fact.difficulty <= difficulty + 2);
      setCurrentFacts(filteredFacts);
      setCurrentFactIndex(0);
    }
  }, [currentTopic, difficulty, topicFacts]);
  
  // Handle topic change
  const handleTopicChange = (topic: string) => {
    if (topics.includes(topic)) {
      setCurrentTopic(topic);
      // Reset progress for new topic
      setCurrentFactIndex(0);
    }
  };
  
  // Mark speech as clear
  const markClearSpeech = (level: number) => {
    setClarityLevel(level);
    onAttempt();
    setAttempts(prev => prev + 1);
    
    if (level >= 3) {
      // Success
      setSuccesses(prev => prev + 1);
      setFeedbackMessage('I understood that clearly!');
      setShowFeedback(true);
      
      // Increase expert level
      const newLevel = Math.min(expertLevel + (100 / (currentFacts.length * 2)), 100);
      setExpertLevel(newLevel);
      
      // Award token at certain thresholds
      if (Math.floor(newLevel / 25) > Math.floor(expertLevel / 25)) {
        awardToken();
      }
      
      onSuccess(true);
    } else {
      // Partial success or failure
      setFeedbackMessage(level === 2 ? 'I almost understood that.' : 'Can you explain again?');
      setShowFeedback(true);
      onSuccess(false);
    }
    
    // Hide feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };
  
  // Move to next fact
  const handleNextFact = () => {
    if (currentFactIndex < currentFacts.length - 1) {
      setCurrentFactIndex(prev => prev + 1);
    } else {
      // Topic complete, calculate success rate
      const successRate = (successes / Math.max(attempts, 1)) * 100;
      onComplete(successRate);
    }
  };
  
  // Generate a new fact (in a real app, this would use the OpenAI API)
  const generateNewFact = () => {
    // For now, just add a placeholder fact
    const newFact: TopicFact = {
      id: `new-${Date.now()}`,
      fact: `New fact about ${currentTopic.toLowerCase()}`,
      difficulty: Math.min(difficulty, 5),
      visualSupport: '🔍',
    };
    
    setTopicFacts(prev => ({
      ...prev,
      [currentTopic]: [...(prev[currentTopic] || []), newFact],
    }));
    
    // Update current facts
    setCurrentFacts(prev => [...prev, newFact]);
  };
  
  // Get character based on theme
  const getCharacter = () => {
    return theme === 'dragon' ? '🐉' : '🦖';
  };
  
  // Get student character
  const getStudentCharacter = () => {
    return theme === 'dragon' ? '🐲' : '🦕';
  };
  
  // Current fact
  const currentFact = currentFacts[currentFactIndex];
  
  return (
    <div className="expert-role-play bg-white rounded-lg shadow-md p-6 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Expert Role-Play' : 'Dinosaur Expert Role-Play'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Expert Topics */}
        <div className="expert-topics">
          <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Expert Topics
            </h3>
            
            <div className="available-topics mb-4">
              <span className="font-medium">Available Topics:</span>
              <ul className="topic-list space-y-1 mt-1">
                {topics.map(topic => (
                  <li 
                    key={topic} 
                    className={`px-2 py-1 rounded cursor-pointer ${topic === currentTopic ? 'font-bold' : ''}`}
                    style={{ 
                      backgroundColor: topic === currentTopic ? colorScheme.accent + '30' : 'transparent',
                      color: topic === currentTopic ? colorScheme.primary : 'inherit'
                    }}
                    onClick={() => handleTopicChange(topic)}
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="current-topic mb-4">
              <span className="font-medium">Current Topic:</span>
              <div className="text-md" style={{ color: colorScheme.primary }}>
                {currentTopic}
              </div>
            </div>
            
            <div className="expert-level mb-1">
              <span className="font-medium">Expert Level:</span>
              <div className="level-meter-bg h-4 bg-gray-200 rounded-full overflow-hidden mt-1">
                <motion.div 
                  className="level-meter-fill h-full rounded-full"
                  style={{ backgroundColor: colorScheme.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${expertLevel}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Center Column - Teaching Zone */}
        <div className="teaching-zone col-span-1 md:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6 border flex flex-col items-center justify-center" 
               style={{ borderColor: colorScheme.primary, minHeight: '400px' }}>
            
            {/* Student Character */}
            <div className="student-container mb-6 flex items-center justify-center">
              <motion.div 
                className="student-character text-7xl"
                animate={{ 
                  y: [0, -5, 0],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 4
                }}
              >
                {getStudentCharacter()}
              </motion.div>
            </div>
            
            {/* Question Prompt */}
            <div className="question-prompt mb-6 text-center">
              <div className="speech-bubble bg-white p-4 rounded-lg shadow-md relative mb-4">
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
                <p className="text-lg">
                  {currentFact ? `Tell me about ${currentFact.fact}` : `Tell me about ${currentTopic}`}
                </p>
              </div>
            </div>
            
            {/* Expert Badge */}
            <div className="expert-badge mb-6">
              <div className="badge-container bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full p-1 inline-block">
                <div className="badge-inner bg-white rounded-full p-2 flex items-center justify-center">
                  <span className="text-2xl mr-2">👩‍🏫</span>
                  <span className="font-bold text-yellow-700">EXPERT</span>
                </div>
              </div>
            </div>
            
            {/* Teaching Points */}
            {difficulty <= 5 && currentFact && (
              <div className="teaching-points mb-6">
                <h4 className="text-md font-medium mb-2 text-center">Teaching Points:</h4>
                <ul className="points-list space-y-2">
                  {/* Generate some simple points based on the current fact */}
                  <li className="flex items-center">
                    <span className="mr-2">{currentFact.visualSupport || '•'}</span>
                    <span>{currentFact.fact}</span>
                  </li>
                  {currentFact.fact.split(' ').length > 4 && (
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      <span>{currentFact.fact.split(' ').slice(0, 4).join(' ')}</span>
                    </li>
                  )}
                  {currentTopic === 'Dragon Colors' && (
                    <li className="flex items-center">
                      <span className="mr-2">🎨</span>
                      <span>Dragons come in many colors</span>
                    </li>
                  )}
                  {currentTopic === 'Dragon Food' && (
                    <li className="flex items-center">
                      <span className="mr-2">🍽️</span>
                      <span>Dragons eat different foods</span>
                    </li>
                  )}
                  {currentTopic === 'Dragon Homes' && (
                    <li className="flex items-center">
                      <span className="mr-2">🏠</span>
                      <span>Dragons need safe homes</span>
                    </li>
                  )}
                  {currentTopic === 'Dragon Friends' && (
                    <li className="flex items-center">
                      <span className="mr-2">👫</span>
                      <span>Friends help each other</span>
                    </li>
                  )}
                </ul>
              </div>
            )}
            
            {/* Clarity Meter */}
            <div className="clarity-meter mb-6 w-full">
              <h4 className="text-md font-medium mb-2 text-center">Clarity Meter:</h4>
              <div className="meter-container flex justify-between items-center">
                <button 
                  className="clarity-button px-3 py-2 rounded-md text-white"
                  style={{ backgroundColor: '#ef4444' }}
                  onClick={() => markClearSpeech(1)}
                >
                  Not Clear
                </button>
                <button 
                  className="clarity-button px-3 py-2 rounded-md text-white"
                  style={{ backgroundColor: '#f59e0b' }}
                  onClick={() => markClearSpeech(2)}
                >
                  Somewhat Clear
                </button>
                <button 
                  className="clarity-button px-3 py-2 rounded-md text-white"
                  style={{ backgroundColor: '#10b981' }}
                  onClick={() => markClearSpeech(3)}
                >
                  Very Clear
                </button>
                <button 
                  className="clarity-button px-3 py-2 rounded-md text-white"
                  style={{ backgroundColor: '#3b82f6' }}
                  onClick={() => markClearSpeech(4)}
                >
                  Perfect!
                </button>
              </div>
            </div>
            
            {/* Feedback Message */}
            <motion.div
              className="feedback-message text-center text-lg font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: showFeedback ? 1 : 0,
                y: showFeedback ? 0 : 20
              }}
              style={{ color: colorScheme.primary }}
            >
              {feedbackMessage}
            </motion.div>
            
            {/* Action Buttons */}
            <div className="action-buttons flex space-x-4">
              <button
                className="next-fact-button px-6 py-2 rounded-full text-white font-bold"
                style={{ backgroundColor: colorScheme.primary }}
                onClick={handleNextFact}
              >
                {currentFactIndex < currentFacts.length - 1 ? 'Next Fact' : 'Complete Activity'}
              </button>
              
              <button
                className="generate-fact-button px-6 py-2 rounded-full text-white font-bold"
                style={{ backgroundColor: colorScheme.secondary }}
                onClick={generateNewFact}
              >
                Generate Fact
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertRolePlay;
