import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Activity {
  id: string;
  name: string;
  duration: number;
  completed: boolean;
}

interface VisualTimerProps {
  activities: Activity[];
  currentActivityIndex: number;
  sessionDuration: number; // in minutes
  elapsedTime: number; // in seconds
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const VisualTimer: React.FC<VisualTimerProps> = ({
  activities,
  currentActivityIndex,
  sessionDuration,
  elapsedTime,
  theme,
  colorScheme,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60 - elapsedTime);
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(
    activities[currentActivityIndex] || null
  );
  const [nextActivity, setNextActivity] = useState<Activity | null>(
    activities[currentActivityIndex + 1] || null
  );

  // Update time remaining every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Update current and next activity when currentActivityIndex changes
  useEffect(() => {
    setCurrentActivity(activities[currentActivityIndex] || null);
    setNextActivity(activities[currentActivityIndex + 1] || null);
  }, [activities, currentActivityIndex]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for the session
  const sessionProgress = (elapsedTime / (sessionDuration * 60)) * 100;

  return (
    <div className="visual-timer bg-white rounded-lg shadow-md p-4 border-2" style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Path' : 'Dinosaur Trail'}
      </h2>
      
      {/* Activity Path Visualization */}
      <div className="activity-path relative mb-6 py-4">
        <div className="path-line absolute h-2 top-1/2 left-0 right-0 transform -translate-y-1/2 rounded-full" 
             style={{ backgroundColor: colorScheme.secondary }}>
        </div>
        
        <div className="activities-container flex justify-between relative z-10">
          {activities.map((activity, index) => (
            <div key={activity.id} className="activity-step flex flex-col items-center">
              <motion.div 
                className="step-indicator w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                style={{ 
                  backgroundColor: index < currentActivityIndex 
                    ? colorScheme.accent 
                    : index === currentActivityIndex 
                      ? colorScheme.primary 
                      : '#e0e0e0'
                }}
                animate={{ 
                  scale: index === currentActivityIndex ? [1, 1.1, 1] : 1,
                }}
                transition={{ 
                  repeat: index === currentActivityIndex ? Infinity : 0, 
                  duration: 2 
                }}
              >
                {index + 1}
              </motion.div>
              
              <span className="activity-name text-xs mt-2 text-center max-w-[60px]">
                {activity.name}
              </span>
              
              {/* Completed activity gem/icon */}
              {index < currentActivityIndex && (
                <motion.div 
                  className="completed-icon text-xs mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {theme === 'dragon' ? '🔮' : '💎'}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Current Activity Info */}
      <div className="current-activity mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Current:</span>
          <span className="text-sm font-bold" style={{ color: colorScheme.primary }}>
            {currentActivity?.name || 'None'}
          </span>
        </div>
        
        {nextActivity && (
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium">Next:</span>
            <span className="text-sm" style={{ color: colorScheme.secondary }}>
              {nextActivity.name}
            </span>
          </div>
        )}
      </div>
      
      {/* Time Remaining */}
      <div className="time-remaining mb-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Time remaining:</span>
          <span className="text-lg font-bold" style={{ color: colorScheme.primary }}>
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="progress-container h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className="progress-bar h-full rounded-full"
          style={{ backgroundColor: colorScheme.primary }}
          initial={{ width: 0 }}
          animate={{ width: `${sessionProgress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
};

export default VisualTimer;
