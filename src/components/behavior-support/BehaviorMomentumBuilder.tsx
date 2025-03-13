import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BehaviorMomentumBuilderProps {
  isActive: boolean;
  onMomentumBuilt: () => void;
  onActivityComplete: (successRate: number) => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface QuickWinActivity {
  id: string;
  name: string;
  instruction: string;
  difficulty: number;
  completed: boolean;
  icon: string;
}

const BehaviorMomentumBuilder: React.FC<BehaviorMomentumBuilderProps> = ({
  isActive,
  onMomentumBuilt,
  onActivityComplete,
  theme,
  colorScheme,
}) => {
  // State for momentum activities and progress
  const [quickWinActivities, setQuickWinActivities] = useState<QuickWinActivity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [momentumLevel, setMomentumLevel] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activityCompleted, setActivityCompleted] = useState(false);
  
  // Initialize quick win activities
  useEffect(() => {
    if (isActive) {
      // Generate 4 simple activities
      const activities: QuickWinActivity[] = [
        {
          id: 'quick-1',
          name: 'Dragon Clap',
          instruction: 'Clap your hands like a dragon!',
          difficulty: 1,
          completed: false,
          icon: '👏',
        },
        {
          id: 'quick-2',
          name: 'Dragon Roar',
          instruction: 'Make a small dragon roar!',
          difficulty: 1,
          completed: false,
          icon: '🔊',
        },
        {
          id: 'quick-3',
          name: 'Dragon Wings',
          instruction: 'Flap your arms like dragon wings!',
          difficulty: 1,
          completed: false,
          icon: '🦋',
        },
        {
          id: 'quick-4',
          name: 'Dragon Stomp',
          instruction: 'Stomp your feet like a dragon!',
          difficulty: 1,
          completed: false,
          icon: '👣',
        },
      ];
      
      setQuickWinActivities(activities);
      setCurrentActivityIndex(0);
      setMomentumLevel(0);
      setActivityCompleted(false);
    }
  }, [isActive]);
  
  // Current activity
  const currentActivity = quickWinActivities[currentActivityIndex];
  
  // Complete current activity
  const completeCurrentActivity = () => {
    if (!currentActivity || activityCompleted) return;
    
    // Update activity status
    const updatedActivities = [...quickWinActivities];
    updatedActivities[currentActivityIndex].completed = true;
    setQuickWinActivities(updatedActivities);
    
    // Show success feedback
    setShowSuccess(true);
    setSuccessMessage('Great job!');
    
    // Increase momentum
    const newMomentum = Math.min(momentumLevel + 25, 100);
    setMomentumLevel(newMomentum);
    
    // Hide success feedback after delay
    setTimeout(() => {
      setShowSuccess(false);
      
      // Move to next activity or complete sequence
      if (currentActivityIndex < quickWinActivities.length - 1) {
        setCurrentActivityIndex(prev => prev + 1);
      } else {
        // All activities completed
        setActivityCompleted(true);
        onMomentumBuilt();
        onActivityComplete(100); // 100% success rate for momentum builder
      }
    }, 1500);
  };
  
  // Skip current activity
  const skipCurrentActivity = () => {
    if (!currentActivity || activityCompleted) return;
    
    // Move to next activity or complete sequence
    if (currentActivityIndex < quickWinActivities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      // All activities completed
      setActivityCompleted(true);
      onMomentumBuilt();
      onActivityComplete(Math.round((momentumLevel / 100) * 100)); // Success rate based on momentum
    }
  };
  
  // Reset sequence
  const resetSequence = () => {
    // Reset all activities
    const resetActivities = quickWinActivities.map(activity => ({
      ...activity,
      completed: false,
    }));
    
    setQuickWinActivities(resetActivities);
    setCurrentActivityIndex(0);
    setMomentumLevel(0);
    setActivityCompleted(false);
  };
  
  // Get character based on theme
  const getCharacter = () => {
    return theme === 'dragon' ? '🐉' : '🦖';
  };
  
  return (
    <div className="behavior-momentum-builder bg-white rounded-lg shadow-md p-6 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Power-Up Sequence' : 'Dino Power-Up Sequence'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Activity List */}
        <div className="activity-list">
          <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Quick Win Activities
            </h3>
            
            <ul className="quick-wins space-y-2 mb-4">
              {quickWinActivities.map((activity, index) => (
                <li 
                  key={activity.id} 
                  className={`px-3 py-2 rounded-md flex items-center ${index === currentActivityIndex ? 'font-bold' : ''}`}
                  style={{ 
                    backgroundColor: activity.completed ? colorScheme.accent + '30' : 
                                    index === currentActivityIndex ? colorScheme.primary + '20' : 
                                    'transparent',
                    color: activity.completed ? colorScheme.accent : 
                           index === currentActivityIndex ? colorScheme.primary : 
                           'inherit'
                  }}
                >
                  <span className="activity-icon mr-2">{activity.icon}</span>
                  <span className="activity-name">{activity.name}</span>
                  {activity.completed && (
                    <span className="ml-auto">✓</span>
                  )}
                </li>
              ))}
            </ul>
            
            <div className="momentum-level">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Momentum:</span>
                <span className="text-sm">{momentumLevel}%</span>
              </div>
              <div className="momentum-meter-bg h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="momentum-meter-fill h-full rounded-full"
                  style={{ backgroundColor: colorScheme.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${momentumLevel}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Center Column - Current Activity */}
        <div className="current-activity col-span-1 md:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6 border flex flex-col items-center justify-center" 
               style={{ borderColor: colorScheme.primary, minHeight: '300px' }}>
            
            {!activityCompleted ? (
              <>
                {/* Character Animation */}
                <motion.div 
                  className="character-container mb-6"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: showSuccess ? [1, 1.2, 1] : 1
                  }}
                  transition={{ 
                    y: { repeat: Infinity, duration: 2 },
                    scale: { duration: 0.5 }
                  }}
                >
                  <div className="character text-8xl">
                    {getCharacter()}
                  </div>
                </motion.div>
                
                {/* Activity Instruction */}
                {currentActivity && (
                  <div className="activity-instruction mb-6 text-center">
                    <h3 className="text-xl mb-2">Let's do a quick win:</h3>
                    <div 
                      className="instruction-display text-2xl font-bold px-6 py-3 rounded-lg"
                      style={{ 
                        backgroundColor: colorScheme.primary + '20',
                        color: colorScheme.primary
                      }}
                    >
                      {currentActivity.instruction}
                    </div>
                  </div>
                )}
                
                {/* Success Message */}
                <motion.div
                  className="success-message text-center text-2xl font-bold mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: showSuccess ? 1 : 0,
                    y: showSuccess ? 0 : 20
                  }}
                  style={{ color: colorScheme.accent }}
                >
                  {successMessage}
                </motion.div>
                
                {/* Action Buttons */}
                <div className="action-buttons flex space-x-4">
                  <button
                    className="complete-button px-6 py-2 rounded-full text-white font-bold"
                    style={{ backgroundColor: colorScheme.primary }}
                    onClick={completeCurrentActivity}
                  >
                    Complete
                  </button>
                  
                  <button
                    className="skip-button px-6 py-2 rounded-full border-2 font-bold"
                    style={{ borderColor: colorScheme.secondary, color: colorScheme.secondary }}
                    onClick={skipCurrentActivity}
                  >
                    Skip
                  </button>
                </div>
              </>
            ) : (
              /* Sequence Completed */
              <div className="sequence-completed text-center">
                <motion.div 
                  className="completed-icon text-8xl mb-6"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0, -10, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  {momentumLevel >= 75 ? '🌟' : '✨'}
                </motion.div>
                
                <h3 className="text-2xl font-bold mb-4" style={{ color: colorScheme.primary }}>
                  {momentumLevel >= 75 ? 'Super Power-Up Complete!' : 'Power-Up Sequence Complete!'}
                </h3>
                
                <p className="text-lg mb-6">
                  {momentumLevel >= 75 
                    ? 'You\'ve built amazing momentum! Ready to continue your adventure?' 
                    : 'You\'ve built some momentum! Ready to continue?'}
                </p>
                
                <button
                  className="reset-button px-6 py-2 rounded-full text-white font-bold"
                  style={{ backgroundColor: colorScheme.primary }}
                  onClick={resetSequence}
                >
                  Reset Sequence
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorMomentumBuilder;
