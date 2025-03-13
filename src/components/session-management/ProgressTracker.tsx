import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ProgressData {
  activityId: string;
  activityName: string;
  completionStatus: 'not-started' | 'in-progress' | 'completed';
  successRate?: number;
  tokensEarned?: number;
}

interface ProgressTrackerProps {
  sessionProgress: {
    totalActivities: number;
    completedActivities: number;
    currentActivityIndex: number;
  };
  activityProgress: ProgressData[];
  tokenCount: number;
  maxTokens: number;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  sessionProgress,
  activityProgress,
  tokenCount,
  maxTokens,
  theme,
  colorScheme,
}) => {
  // Calculate overall session completion percentage
  const sessionCompletionPercentage = 
    (sessionProgress.completedActivities / sessionProgress.totalActivities) * 100;
  
  // Calculate reward progress percentage
  const rewardProgressPercentage = (tokenCount / maxTokens) * 100;

  return (
    <div className="progress-tracker bg-white rounded-lg shadow-md p-4 border-2" style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Quest Progress' : 'Dinosaur Adventure Progress'}
      </h2>
      
      {/* Session Progress Bar */}
      <div className="session-progress mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Session Progress:</span>
          <span className="text-sm font-bold">{Math.round(sessionCompletionPercentage)}%</span>
        </div>
        <div className="progress-container h-4 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="progress-bar h-full rounded-full"
            style={{ backgroundColor: colorScheme.primary }}
            initial={{ width: 0 }}
            animate={{ width: `${sessionCompletionPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Activity Progress List */}
      <div className="activity-progress mb-6">
        <h3 className="text-md font-bold mb-2" style={{ color: colorScheme.secondary }}>
          Activity Progress
        </h3>
        <div className="activity-list space-y-2">
          {activityProgress.map((activity, index) => (
            <div key={activity.activityId} className="activity-item flex items-center">
              <div 
                className="activity-status-indicator w-3 h-3 rounded-full mr-2"
                style={{ 
                  backgroundColor: 
                    activity.completionStatus === 'completed' ? colorScheme.accent :
                    activity.completionStatus === 'in-progress' ? colorScheme.primary : '#e0e0e0'
                }}
              />
              <span className="activity-name text-sm flex-grow truncate">
                {activity.activityName}
              </span>
              {activity.successRate !== undefined && (
                <span className="activity-success-rate text-xs px-2 py-1 rounded-full ml-2"
                      style={{ 
                        backgroundColor: 
                          activity.successRate >= 80 ? '#d1fae5' :
                          activity.successRate >= 60 ? '#fef3c7' : '#fee2e2',
                        color: 
                          activity.successRate >= 80 ? '#065f46' :
                          activity.successRate >= 60 ? '#92400e' : '#b91c1c'
                      }}>
                  {activity.successRate}%
                </span>
              )}
              {activity.tokensEarned !== undefined && activity.tokensEarned > 0 && (
                <span className="tokens-earned text-xs ml-2">
                  {theme === 'dragon' ? '🔮' : '💎'} {activity.tokensEarned}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Token Collection */}
      <div className="token-collection mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-bold" style={{ color: colorScheme.secondary }}>
            {theme === 'dragon' ? 'Dragon Gems' : 'Dino Treasures'}
          </h3>
          <span className="text-sm font-bold">
            {tokenCount} / {maxTokens}
          </span>
        </div>
        <div className="token-display flex flex-wrap gap-2 mb-2">
          {Array.from({ length: maxTokens }).map((_, index) => (
            <div 
              key={index}
              className="token w-6 h-6 flex items-center justify-center text-lg"
            >
              {index < tokenCount ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: index * 0.1 % 1 // Stagger effect but reset after 10 tokens
                  }}
                >
                  {theme === 'dragon' ? '🔮' : '💎'}
                </motion.div>
              ) : (
                <span className="text-gray-300">⚪</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Reward Progress */}
        <div className="reward-progress">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs">Reward Progress:</span>
            <span className="text-xs font-bold">{Math.round(rewardProgressPercentage)}%</span>
          </div>
          <div className="progress-container h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              className="progress-bar h-full rounded-full"
              style={{ backgroundColor: colorScheme.accent }}
              initial={{ width: 0 }}
              animate={{ width: `${rewardProgressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      
      {/* Achievement Badges */}
      <div className="achievements">
        <h3 className="text-md font-bold mb-2" style={{ color: colorScheme.secondary }}>
          Today's Achievements
        </h3>
        <div className="achievement-badges flex flex-wrap gap-2">
          {sessionCompletionPercentage >= 25 && (
            <motion.div 
              className="badge p-2 rounded-full"
              style={{ backgroundColor: '#f0f9ff' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-lg" title="Started Adventure">🚀</span>
            </motion.div>
          )}
          {tokenCount >= maxTokens / 2 && (
            <motion.div 
              className="badge p-2 rounded-full"
              style={{ backgroundColor: '#f0f9ff' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-lg" title="Treasure Hunter">💰</span>
            </motion.div>
          )}
          {activityProgress.some(a => a.successRate && a.successRate >= 80) && (
            <motion.div 
              className="badge p-2 rounded-full"
              style={{ backgroundColor: '#f0f9ff' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-lg" title="Speech Star">⭐</span>
            </motion.div>
          )}
          {sessionCompletionPercentage >= 100 && (
            <motion.div 
              className="badge p-2 rounded-full"
              style={{ backgroundColor: '#f0f9ff' }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="text-lg" title="Quest Complete">🏆</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
