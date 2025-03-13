import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VisualBoundarySystemProps {
  isActive: boolean;
  boundaryViolations: number;
  onBoundaryRespected: () => void;
  onBoundaryViolated: () => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const VisualBoundarySystem: React.FC<VisualBoundarySystemProps> = ({
  isActive,
  boundaryViolations,
  onBoundaryRespected,
  onBoundaryViolated,
  theme,
  colorScheme,
}) => {
  // State for boundary animation and feedback
  const [showBoundary, setShowBoundary] = useState(false);
  const [boundaryPulse, setBoundaryPulse] = useState(false);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMessage, setReminderMessage] = useState('');
  const [characterPosition, setCharacterPosition] = useState({ x: 50, y: 50 }); // Percentage values
  const [isWithinBoundary, setIsWithinBoundary] = useState(true);
  
  // Activate boundary visualization
  useEffect(() => {
    if (isActive) {
      setShowBoundary(true);
    } else {
      setShowBoundary(false);
      setShowReminder(false);
    }
  }, [isActive]);
  
  // Simulate boundary check (in a real app, this would use actual position data)
  useEffect(() => {
    if (!isActive) return;
    
    // Simulate random movement for demo purposes
    const movementInterval = setInterval(() => {
      const newX = Math.max(5, Math.min(95, characterPosition.x + (Math.random() * 20 - 10)));
      const newY = Math.max(5, Math.min(95, characterPosition.y + (Math.random() * 20 - 10)));
      
      setCharacterPosition({ x: newX, y: newY });
      
      // Check if within boundary (80% of container)
      const isWithin = newX >= 10 && newX <= 90 && newY >= 10 && newY <= 90;
      setIsWithinBoundary(isWithin);
      
      if (!isWithin && isWithinBoundary) {
        // Boundary violation
        handleBoundaryViolation();
      } else if (isWithin && !isWithinBoundary) {
        // Returned to boundary
        handleBoundaryRespected();
      }
    }, 3000);
    
    return () => clearInterval(movementInterval);
  }, [isActive, characterPosition, isWithinBoundary]);
  
  // Handle boundary violation
  const handleBoundaryViolation = () => {
    setBoundaryPulse(true);
    setShowReminder(true);
    setReminderMessage(getRandomReminder());
    onBoundaryViolated();
    
    // Reset pulse animation after delay
    setTimeout(() => {
      setBoundaryPulse(false);
    }, 1000);
    
    // Hide reminder after delay
    setTimeout(() => {
      setShowReminder(false);
    }, 3000);
  };
  
  // Handle boundary respected
  const handleBoundaryRespected = () => {
    onBoundaryRespected();
  };
  
  // Get random reminder message
  const getRandomReminder = () => {
    const reminders = [
      'Let\'s stay in our therapy space!',
      'Remember our dragon boundaries!',
      'Dragons stay in their special area!',
      'Let\'s keep our dragon power inside the lines!',
    ];
    
    return reminders[Math.floor(Math.random() * reminders.length)];
  };
  
  // Get character based on theme
  const getCharacter = () => {
    return theme === 'dragon' ? '🐉' : '🦖';
  };
  
  return (
    <div className="visual-boundary-system relative w-full h-64 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Boundary Visualization */}
      {showBoundary && (
        <motion.div 
          className="boundary absolute inset-0 border-4 rounded-lg"
          style={{ 
            borderColor: boundaryPulse ? colorScheme.secondary : colorScheme.primary,
            opacity: 0.5,
            margin: '10%'
          }}
          animate={{ 
            scale: boundaryPulse ? [1, 1.05, 1] : 1,
            borderColor: boundaryPulse ? [colorScheme.primary, colorScheme.secondary, colorScheme.primary] : colorScheme.primary
          }}
          transition={{ duration: 0.5 }}
        />
      )}
      
      {/* Background Pattern */}
      <div 
        className="background-pattern absolute inset-0"
        style={{ 
          backgroundImage: `radial-gradient(${colorScheme.accent}20 10%, transparent 10%)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Character */}
      <motion.div 
        className="character absolute text-4xl"
        style={{ 
          left: `${characterPosition.x}%`,
          top: `${characterPosition.y}%`,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{ 
          scale: isWithinBoundary ? 1 : [1, 0.8, 1],
          rotate: isWithinBoundary ? 0 : [0, -10, 10, 0]
        }}
        transition={{ duration: 0.5 }}
      >
        {getCharacter()}
      </motion.div>
      
      {/* Boundary Reminder */}
      {showReminder && (
        <motion.div 
          className="reminder absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-md"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{ 
            backgroundColor: colorScheme.primary,
            color: 'white'
          }}
        >
          <p className="text-sm font-medium">{reminderMessage}</p>
        </motion.div>
      )}
      
      {/* Boundary Status */}
      <div className="boundary-status absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md text-xs">
        <span className="font-medium">Boundary Violations:</span> {boundaryViolations}
      </div>
    </div>
  );
};

export default VisualBoundarySystem;
