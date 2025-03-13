import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface DragonsDenProps {
  isActive: boolean;
  duration: number;
  onBreakComplete: () => void;
  onBreakExtended: (seconds: number) => void;
  onBreakEnded: () => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const DragonsDen: React.FC<DragonsDenProps> = ({
  isActive,
  duration,
  onBreakComplete,
  onBreakExtended,
  onBreakEnded,
  theme,
  colorScheme,
}) => {
  // State for break timer and UI
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState(0);
  const [selectedActivity, setSelectedActivity] = useState<'breathing' | 'stretching' | 'quiet'>('breathing');
  const [selectedSensory, setSelectedSensory] = useState<'dim' | 'sound' | 'visual'>('dim');
  
  // Initialize timer when activated
  useEffect(() => {
    if (isActive) {
      setTimeRemaining(duration);
      setBreathCount(0);
    }
  }, [isActive, duration]);
  
  // Countdown timer
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onBreakComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, timeRemaining, onBreakComplete]);
  
  // Breathing animation cycle
  useEffect(() => {
    if (!isActive || selectedActivity !== 'breathing') return;
    
    const breathingCycle = () => {
      // Inhale for 4 seconds
      setBreathingPhase('inhale');
      
      setTimeout(() => {
        // Hold for 2 seconds
        setBreathingPhase('hold');
        
        setTimeout(() => {
          // Exhale for 4 seconds
          setBreathingPhase('exhale');
          
          setTimeout(() => {
            // Complete one breath
            setBreathCount(prev => prev + 1);
          }, 4000);
        }, 2000);
      }, 4000);
    };
    
    // Start breathing cycle
    const breathingInterval = setInterval(breathingCycle, 10000); // 10 seconds per complete cycle
    breathingCycle(); // Start immediately
    
    return () => clearInterval(breathingInterval);
  }, [isActive, selectedActivity]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle break extension
  const extendBreak = () => {
    const extensionTime = 30; // 30 seconds
    setTimeRemaining(prev => prev + extensionTime);
    onBreakExtended(extensionTime);
  };
  
  // Handle early break end
  const endBreakEarly = () => {
    setTimeRemaining(0);
    onBreakEnded();
  };
  
  // Get character based on theme
  const getCharacter = () => {
    return theme === 'dragon' ? '🐉' : '🦖';
  };
  
  // Calculate progress percentage
  const getProgressPercentage = () => {
    return ((duration - timeRemaining) / duration) * 100;
  };
  
  // Get background color based on sensory option
  const getBackgroundColor = () => {
    switch (selectedSensory) {
      case 'dim':
        return colorScheme.primary + '20';
      case 'sound':
        return colorScheme.secondary + '20';
      case 'visual':
        return colorScheme.accent + '20';
      default:
        return colorScheme.primary + '20';
    }
  };
  
  return (
    <div 
      className="dragons-den bg-white rounded-lg shadow-md p-6 border-2 transition-colors duration-500" 
      style={{ 
        borderColor: colorScheme.primary,
        backgroundColor: getBackgroundColor()
      }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon\'s Den' : 'Dino\'s Den'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Break Timer */}
        <div className="break-timer">
          <div className="bg-white rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Break Timer
            </h3>
            
            <div className="time-remaining mb-4 text-center">
              <div className="text-3xl font-bold" style={{ color: colorScheme.primary }}>
                {formatTime(timeRemaining)}
              </div>
              <div className="text-sm">Time Remaining</div>
            </div>
            
            <div className="timer-visualization mb-4">
              <div className="circular-timer relative w-32 h-32 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#e0e0e0" 
                    strokeWidth="8" 
                  />
                  
                  {/* Progress circle */}
                  <motion.circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke={colorScheme.primary} 
                    strokeWidth="8" 
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * getProgressPercentage() / 100)}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: 283 }}
                    animate={{ strokeDashoffset: 283 - (283 * getProgressPercentage() / 100) }}
                    transition={{ duration: 0.5 }}
                  />
                  
                  {/* Dragon icon in center */}
                  <foreignObject x="25" y="25" width="50" height="50">
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      {getCharacter()}
                    </div>
                  </foreignObject>
                </svg>
              </div>
            </div>
            
            <div className="break-type mb-2">
              <span className="font-medium">Break Type:</span>
              <div className="text-md" style={{ color: colorScheme.primary }}>
                Calming Break
              </div>
            </div>
          </div>
        </div>
        
        {/* Center Column - Calming Space */}
        <div className="calming-space col-span-1 md:col-span-2">
          <div className="bg-white rounded-lg p-6 border flex flex-col items-center justify-center" 
               style={{ borderColor: colorScheme.primary, minHeight: '300px' }}>
            
            {/* Breathing Dragon Animation */}
            {selectedActivity === 'breathing' && (
              <div className="breathing-guide mb-6 text-center">
                <motion.div 
                  className="breathing-dragon text-8xl mb-4"
                  animate={{ 
                    scale: breathingPhase === 'inhale' ? [1, 1.3] : 
                           breathingPhase === 'hold' ? 1.3 : 
                           [1.3, 1],
                    opacity: 1
                  }}
                  transition={{ 
                    duration: breathingPhase === 'inhale' ? 4 : 
                              breathingPhase === 'hold' ? 2 : 4,
                    ease: "easeInOut"
                  }}
                >
                  {getCharacter()}
                </motion.div>
                
                <div className="breathing-instruction text-xl font-medium mb-2" style={{ color: colorScheme.primary }}>
                  {breathingPhase === 'inhale' ? 'Breathe in...' : 
                   breathingPhase === 'hold' ? 'Hold...' : 
                   'Breathe out...'}
                </div>
                
                <div className="breath-counter text-sm">
                  Breaths: {breathCount}
                </div>
              </div>
            )}
            
            {/* Stretching Guide */}
            {selectedActivity === 'stretching' && (
              <div className="stretching-guide mb-6 text-center">
                <motion.div 
                  className="stretching-dragon text-8xl mb-4"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 5
                  }}
                >
                  {getCharacter()}
                </motion.div>
                
                <div className="stretching-instruction text-xl font-medium mb-2" style={{ color: colorScheme.primary }}>
                  Stretch your arms like dragon wings
                </div>
              </div>
            )}
            
            {/* Quiet Time */}
            {selectedActivity === 'quiet' && (
              <div className="quiet-time mb-6 text-center">
                <motion.div 
                  className="quiet-dragon text-8xl mb-4"
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ 
                    repeat: Infinity,
                    duration: 4
                  }}
                >
                  {getCharacter()}
                </motion.div>
                
                <div className="quiet-instruction text-xl font-medium mb-2" style={{ color: colorScheme.primary }}>
                  Quiet dragon time
                </div>
              </div>
            )}
            
            {/* Regulation Options */}
            <div className="regulation-options w-full mb-6">
              <h3 className="text-lg font-medium mb-2 text-center" style={{ color: colorScheme.secondary }}>
                Regulation Options
              </h3>
              
              <div className="break-activities grid grid-cols-3 gap-2 mb-4">
                <button 
                  className={`activity-button px-2 py-1 rounded-md text-sm ${selectedActivity === 'breathing' ? 'text-white' : 'text-gray-700'}`}
                  style={{ 
                    backgroundColor: selectedActivity === 'breathing' ? colorScheme.primary : '#f0f0f0'
                  }}
                  onClick={() => setSelectedActivity('breathing')}
                >
                  Deep Breathing
                </button>
                <button 
                  className={`activity-button px-2 py-1 rounded-md text-sm ${selectedActivity === 'stretching' ? 'text-white' : 'text-gray-700'}`}
                  style={{ 
                    backgroundColor: selectedActivity === 'stretching' ? colorScheme.primary : '#f0f0f0'
                  }}
                  onClick={() => setSelectedActivity('stretching')}
                >
                  Gentle Stretching
                </button>
                <button 
                  className={`activity-button px-2 py-1 rounded-md text-sm ${selectedActivity === 'quiet' ? 'text-white' : 'text-gray-700'}`}
                  style={{ 
                    backgroundColor: selectedActivity === 'quiet' ? colorScheme.primary : '#f0f0f0'
                  }}
                  onClick={() => setSelectedActivity('quiet')}
                >
                  Quiet Time
                </button>
              </div>
              
              <div className="sensory-options grid grid-cols-3 gap-2">
                <button 
                  className={`sensory-button px-2 py-1 rounded-md text-sm ${selectedSensory === 'dim' ? 'text-white' : 'text-gray-700'}`}
                  style={{ 
                    backgroundColor: selectedSensory === 'dim' ? colorScheme.secondary : '#f0f0f0'
                  }}
                  onClick={() => setSelectedSensory('dim')}
                >
                  Dim Lights
                </button>
                <button 
                  className={`sensory-button px-2 py-1 rounded-md text-sm ${selectedSensory === 'sound' ? 'text-white' : 'text-gray-700'}`}
                  style={{ 
                    backgroundColor: selectedSensory === 'sound' ? colorScheme.secondary : '#f0f0f0'
                  }}
                  onClick={() => setSelectedSensory('sound')}
                >
                  Soft Sounds
                </button>
                <button 
                  className={`sensory-button px-2 py-1 rounded-md text-sm ${selectedSensory === 'visual' ? 'text-white' : 'text-gray-700'}`}
                  style={{ 
                    backgroundColor: selectedSensory === 'visual' ? colorScheme.secondary : '#f0f0f0'
                  }}
                  onClick={() => setSelectedSensory('visual')}
                >
                  Visual Only
                </button>
              </div>
            </div>
            
            {/* Break Controls */}
            <div className="break-controls flex space-x-4">
              <button
                className="extend-break-button px-4 py-2 rounded-md border-2 font-medium"
                style={{ borderColor: colorScheme.secondary, color: colorScheme.secondary }}
                onClick={extendBreak}
              >
                Extend Break +30s
              </button>
              
              <button
                className="end-break-button px-4 py-2 rounded-md border-2 font-medium"
                style={{ borderColor: colorScheme.primary, color: colorScheme.primary }}
                onClick={endBreakEarly}
              >
                End Break Early
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragonsDen;
