import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  name: string;
  type: string;
  duration: number;
  targets?: string[];
  difficulty?: number;
  content?: any;
}

interface ActivitySequencerProps {
  activities: Activity[];
  initialActivityIndex?: number;
  onActivityChange: (activityIndex: number) => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const ActivitySequencer: React.FC<ActivitySequencerProps> = ({
  activities,
  initialActivityIndex = 0,
  onActivityChange,
  theme,
  colorScheme,
}) => {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(initialActivityIndex);
  const [transitionActive, setTransitionActive] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev'>('next');

  // Handle activity transition
  const transitionToActivity = (index: number) => {
    if (index < 0 || index >= activities.length || index === currentActivityIndex) {
      return;
    }

    setTransitionDirection(index > currentActivityIndex ? 'next' : 'prev');
    setTransitionActive(true);
    
    // Delay the actual change to allow for animation
    setTimeout(() => {
      setCurrentActivityIndex(index);
      onActivityChange(index);
      
      // Reset transition state after animation completes
      setTimeout(() => {
        setTransitionActive(false);
      }, 500);
    }, 500);
  };

  const handleNext = () => {
    if (currentActivityIndex < activities.length - 1) {
      transitionToActivity(currentActivityIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentActivityIndex > 0) {
      transitionToActivity(currentActivityIndex - 1);
    }
  };

  const handleJumpTo = (index: number) => {
    transitionToActivity(index);
  };

  // Get current activity
  const currentActivity = activities[currentActivityIndex];

  return (
    <div className="activity-sequencer bg-white rounded-lg shadow-md p-4 border-2" style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Adventure' : 'Dinosaur Journey'}
      </h2>
      
      {/* Current Activity Display */}
      <div className="current-activity-container relative overflow-hidden h-64 mb-4 rounded-lg border" 
           style={{ borderColor: colorScheme.secondary }}>
        <motion.div
          className="activity-content flex items-center justify-center h-full w-full p-4 text-center"
          initial={{ opacity: 0, x: transitionDirection === 'next' ? 100 : -100 }}
          animate={{ 
            opacity: transitionActive ? 0 : 1, 
            x: transitionActive 
              ? (transitionDirection === 'next' ? -100 : 100) 
              : 0 
          }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.primary }}>
              {currentActivity?.name || 'No Activity'}
            </h3>
            <p className="text-sm mb-4">
              {currentActivity?.type || 'Unknown Type'}
            </p>
            {currentActivity?.targets && (
              <div className="targets mb-2">
                <span className="text-xs font-medium">Targets: </span>
                <span className="text-xs">
                  {currentActivity.targets.join(', ')}
                </span>
              </div>
            )}
            <div className="activity-icon text-4xl mb-2">
              {theme === 'dragon' 
                ? currentActivity?.type === 'speech' ? '🐉' 
                : currentActivity?.type === 'movement' ? '🏃‍♂️' 
                : currentActivity?.type === 'expert' ? '👩‍🏫' 
                : currentActivity?.type === 'break' ? '😌' 
                : '🎮'
                : currentActivity?.type === 'speech' ? '🦖' 
                : currentActivity?.type === 'movement' ? '🏃‍♂️' 
                : currentActivity?.type === 'expert' ? '👩‍🏫' 
                : currentActivity?.type === 'break' ? '😌' 
                : '🎮'
              }
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Activity Navigation */}
      <div className="activity-navigation flex justify-between items-center mb-4">
        <button 
          className="prev-button px-4 py-2 rounded-full text-white disabled:opacity-50"
          style={{ backgroundColor: currentActivityIndex > 0 ? colorScheme.secondary : '#ccc' }}
          onClick={handlePrevious}
          disabled={currentActivityIndex === 0 || transitionActive}
        >
          Previous
        </button>
        
        <span className="activity-counter text-sm">
          {currentActivityIndex + 1} of {activities.length}
        </span>
        
        <button 
          className="next-button px-4 py-2 rounded-full text-white disabled:opacity-50"
          style={{ backgroundColor: currentActivityIndex < activities.length - 1 ? colorScheme.primary : '#ccc' }}
          onClick={handleNext}
          disabled={currentActivityIndex === activities.length - 1 || transitionActive}
        >
          Next
        </button>
      </div>
      
      {/* Activity Quick Jump */}
      <div className="activity-quick-jump flex justify-center space-x-2">
        {activities.map((activity, index) => (
          <button
            key={activity.id}
            className="jump-button w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center"
            style={{ 
              backgroundColor: index === currentActivityIndex ? colorScheme.primary : '#f0f0f0',
              color: index === currentActivityIndex ? 'white' : '#666'
            }}
            onClick={() => handleJumpTo(index)}
            disabled={transitionActive}
          >
            {index + 1}
          </button>
        ))}
      </div>
      
      {/* Transition Guide Character */}
      {transitionActive && (
        <motion.div 
          className="transition-guide absolute bottom-4 right-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <div className="guide-character text-4xl">
            {theme === 'dragon' ? '🐉' : '🦖'}
          </div>
          <div className="guide-text text-xs text-center mt-1" style={{ color: colorScheme.primary }}>
            {transitionDirection === 'next' ? 'Let\'s go forward!' : 'Going back!'}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ActivitySequencer;
