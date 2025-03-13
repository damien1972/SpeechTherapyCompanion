import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface MovementActivityProps {
  targetSounds: string[];
  targetWords: string[];
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

interface MovementAction {
  id: string;
  name: string;
  instruction: string;
  animation: string;
  targetWord: string;
  icon: string;
}

const MovementActivity: React.FC<MovementActivityProps> = ({
  targetSounds,
  targetWords,
  difficulty,
  onSuccess,
  onAttempt,
  onComplete,
  awardToken,
  theme,
  colorScheme,
}) => {
  // State for current movement and progress
  const [currentActionIndex, setCurrentActionIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);
  
  // State for activity flow
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Generate movement actions based on target words
  const [movementActions, setMovementActions] = useState<MovementAction[]>([]);
  
  // Initialize movement actions
  useEffect(() => {
    const actions: MovementAction[] = [];
    
    // Map target words to movement actions
    targetWords.forEach((word, index) => {
      let action: MovementAction;
      
      // Create different actions based on the word
      switch (word.toLowerCase()) {
        case 'jump':
          action = {
            id: `jump-${index}`,
            name: 'Jump',
            instruction: 'Jump like a dragon!',
            animation: 'jump',
            targetWord: word,
            icon: '⬆️',
          };
          break;
        case 'spin':
          action = {
            id: `spin-${index}`,
            name: 'Spin',
            instruction: 'Spin like a dragon!',
            animation: 'spin',
            targetWord: word,
            icon: '🔄',
          };
          break;
        case 'stomp':
          action = {
            id: `stomp-${index}`,
            name: 'Stomp',
            instruction: 'Stomp like a dragon!',
            animation: 'stomp',
            targetWord: word,
            icon: '👣',
          };
          break;
        case 'fly':
          action = {
            id: `fly-${index}`,
            name: 'Fly',
            instruction: 'Flap your wings like a dragon!',
            animation: 'fly',
            targetWord: word,
            icon: '🦋',
          };
          break;
        case 'roar':
          action = {
            id: `roar-${index}`,
            name: 'Roar',
            instruction: 'Roar like a dragon!',
            animation: 'roar',
            targetWord: word,
            icon: '🔊',
          };
          break;
        default:
          // For any other word, create a generic action
          action = {
            id: `action-${index}`,
            name: word,
            instruction: `Say "${word}" while moving!`,
            animation: 'generic',
            targetWord: word,
            icon: '🎯',
          };
      }
      
      actions.push(action);
    });
    
    // If no target words provided, use default actions
    if (actions.length === 0) {
      actions.push(
        {
          id: 'jump-default',
          name: 'Jump',
          instruction: 'Jump like a dragon!',
          animation: 'jump',
          targetWord: 'Jump',
          icon: '⬆️',
        },
        {
          id: 'spin-default',
          name: 'Spin',
          instruction: 'Spin like a dragon!',
          animation: 'spin',
          targetWord: 'Spin',
          icon: '🔄',
        },
        {
          id: 'stomp-default',
          name: 'Stomp',
          instruction: 'Stomp like a dragon!',
          animation: 'stomp',
          targetWord: 'Stomp',
          icon: '👣',
        }
      );
    }
    
    setMovementActions(actions);
  }, [targetWords]);
  
  // Current action
  const currentAction = movementActions[currentActionIndex];
  
  // Start action countdown
  const startActionCountdown = () => {
    setIsPerformingAction(true);
    setCountdownValue(3);
    
    // Start countdown
    const countdownInterval = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          performAction();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Perform the current action
  const performAction = () => {
    // In a real app, this would use device sensors or camera to detect movement
    // For now, we'll simulate success after a delay
    setTimeout(() => {
      completeAction(true);
    }, 3000);
  };
  
  // Complete the current action
  const completeAction = (success: boolean) => {
    setIsPerformingAction(false);
    onAttempt();
    setAttempts(prev => prev + 1);
    
    if (success) {
      setSuccesses(prev => prev + 1);
      setFeedbackMessage('Great job!');
      setShowFeedback(true);
      
      // Increase energy level
      const newEnergy = Math.min(energyLevel + (100 / movementActions.length), 100);
      setEnergyLevel(newEnergy);
      
      // Award token at certain thresholds
      if (Math.floor(newEnergy / 25) > Math.floor(energyLevel / 25)) {
        awardToken();
      }
      
      onSuccess(true);
    } else {
      setFeedbackMessage('Let\'s try again!');
      setShowFeedback(true);
      onSuccess(false);
    }
    
    // Hide feedback after delay
    setTimeout(() => {
      setShowFeedback(false);
    }, 2000);
  };
  
  // Move to next action
  const handleNextAction = () => {
    if (currentActionIndex < movementActions.length - 1) {
      setCurrentActionIndex(prev => prev + 1);
    } else {
      // Activity complete
      const successRate = (successes / Math.max(attempts, 1)) * 100;
      onComplete(successRate);
    }
  };
  
  // Get character based on theme
  const getCharacter = () => {
    return theme === 'dragon' ? '🐉' : '🦖';
  };
  
  // Get animation for current action
  const getActionAnimation = () => {
    if (!currentAction) return {};
    
    switch (currentAction.animation) {
      case 'jump':
        return {
          y: [0, -30, 0],
          transition: { repeat: 3, duration: 0.5 }
        };
      case 'spin':
        return {
          rotate: [0, 360],
          transition: { repeat: 2, duration: 1 }
        };
      case 'stomp':
        return {
          scale: [1, 1.2, 1],
          y: [0, 10, 0],
          transition: { repeat: 3, duration: 0.5 }
        };
      case 'fly':
        return {
          y: [0, -20, 0],
          x: [0, 20, 0, -20, 0],
          transition: { repeat: 2, duration: 1.5 }
        };
      case 'roar':
        return {
          scale: [1, 1.3, 1],
          transition: { repeat: 3, duration: 0.5 }
        };
      default:
        return {
          scale: [1, 1.1, 1],
          transition: { repeat: 3, duration: 0.7 }
        };
    }
  };
  
  return (
    <div className="movement-activity bg-white rounded-lg shadow-md p-6 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Movement Activity' : 'Dinosaur Movement Activity'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Activity Information */}
        <div className="activity-info">
          <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Movement Actions
            </h3>
            
            <ul className="action-list space-y-1 mb-4">
              {movementActions.map((action, index) => (
                <li 
                  key={action.id} 
                  className={`px-2 py-1 rounded flex items-center ${index === currentActionIndex ? 'font-bold' : ''}`}
                  style={{ 
                    backgroundColor: index === currentActionIndex ? colorScheme.accent + '30' : 'transparent',
                    color: index === currentActionIndex ? colorScheme.primary : 'inherit'
                  }}
                >
                  <span className="mr-2">{action.icon}</span>
                  <span>{action.name}</span>
                </li>
              ))}
            </ul>
            
            <div className="attempts-counter mb-1">
              <span className="font-medium">Attempts:</span> {attempts}
            </div>
            <div className="success-counter">
              <span className="font-medium">Successes:</span> {successes}
            </div>
          </div>
        </div>
        
        {/* Center Column - Main Activity */}
        <div className="main-activity col-span-1 md:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6 border flex flex-col items-center justify-center" 
               style={{ borderColor: colorScheme.primary, minHeight: '400px' }}>
            
            {/* Character Animation */}
            {currentAction && (
              <div className="character-container mb-6">
                <motion.div 
                  className="character text-8xl"
                  animate={isPerformingAction ? getActionAnimation() : { scale: 1 }}
                >
                  {getCharacter()}
                </motion.div>
              </div>
            )}
            
            {/* Action Instruction */}
            {currentAction && !isPerformingAction && (
              <div className="action-instruction mb-6 text-center">
                <h3 className="text-xl mb-2">Next Movement:</h3>
                <div 
                  className="instruction-display text-3xl font-bold px-8 py-3 rounded-lg"
                  style={{ 
                    backgroundColor: colorScheme.primary + '20',
                    color: colorScheme.primary
                  }}
                >
                  {currentAction.name.toUpperCase()}
                </div>
                <p className="mt-3 text-lg">{currentAction.instruction}</p>
                <p className="mt-2 text-md">Say "{currentAction.targetWord}" while you move!</p>
              </div>
            )}
            
            {/* Countdown Display */}
            {isPerformingAction && countdownValue > 0 && (
              <div className="countdown-display mb-6 text-center">
                <motion.div 
                  className="countdown-number text-7xl font-bold"
                  style={{ color: colorScheme.primary }}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  key={countdownValue}
                >
                  {countdownValue}
                </motion.div>
                <p className="text-lg mt-2">Get ready to {currentAction?.name.toLowerCase()}!</p>
              </div>
            )}
            
            {/* Action In Progress */}
            {isPerformingAction && countdownValue === 0 && (
              <div className="action-progress mb-6 text-center">
                <h3 className="text-2xl font-bold mb-2" style={{ color: colorScheme.primary }}>
                  {currentAction?.name.toUpperCase()} NOW!
                </h3>
                <p className="text-lg">Say "{currentAction?.targetWord}" while you {currentAction?.name.toLowerCase()}!</p>
                
                <motion.div 
                  className="progress-indicator mt-4 w-16 h-16 rounded-full"
                  style={{ backgroundColor: colorScheme.secondary }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.7, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              </div>
            )}
            
            {/* Energy Meter */}
            <div className="energy-container w-full mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Energy Level:</span>
                <span className="text-sm">{Math.round(energyLevel)}%</span>
              </div>
              <div className="energy-meter-bg h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="energy-meter-fill h-full rounded-full"
                  style={{ backgroundColor: colorScheme.accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${energyLevel}%` }}
                  transition={{ duration: 0.5 }}
                />
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
              {!isPerformingAction && (
                <>
                  <button
                    className="start-action-button px-6 py-2 rounded-full text-white font-bold"
                    style={{ backgroundColor: colorScheme.secondary }}
                    onClick={startActionCountdown}
                  >
                    Start Movement
                  </button>
                  
                  <button
                    className="next-action-button px-6 py-2 rounded-full text-white font-bold"
                    style={{ backgroundColor: colorScheme.primary }}
                    onClick={handleNextAction}
                  >
                    {currentActionIndex < movementActions.length - 1 ? 'Next Movement' : 'Complete Activity'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovementActivity;
