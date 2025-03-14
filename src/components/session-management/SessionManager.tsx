"use client"
import React, { useState, useEffect } from 'react';
import VisualTimer from './VisualTimer';
import ActivitySequencer from './ActivitySequencer';
import ProgressTracker from './ProgressTracker';
// rest of your code
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

interface SessionManagerProps {
  sessionConfig: {
    id: string;
    name: string;
    duration: number;
    activities: Activity[];
    speechTargets: string[];
    behaviorFocus: string[];
    theme: 'dragon' | 'dinosaur';
    colorScheme: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
  onSessionComplete: (sessionData: any) => void;
  onSessionPause: () => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  sessionConfig,
  onSessionComplete,
  onSessionPause,
}) => {
  // Session state
  const [sessionActive, setSessionActive] = useState<boolean>(false);
  const [sessionPaused, setSessionPaused] = useState<boolean>(false);
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  
  // Activity state
  const [currentActivityIndex, setCurrentActivityIndex] = useState<number>(0);
  const [activityProgress, setActivityProgress] = useState<Array<{
    activityId: string;
    activityName: string;
    completionStatus: 'not-started' | 'in-progress' | 'completed';
    successRate?: number;
    tokensEarned?: number;
  }>>([]);
  
  // Token economy state
  const [tokenCount, setTokenCount] = useState<number>(0);
  const [maxTokens, setMaxTokens] = useState<number>(10);
  
  // Initialize session
  useEffect(() => {
    if (sessionConfig) {
      // Initialize activity progress
      const initialProgress = sessionConfig.activities.map(activity => ({
        activityId: activity.id,
        activityName: activity.name,
        completionStatus: 'not-started' as const,
      }));
      
      setActivityProgress(initialProgress);
      
      // Set first activity as in-progress
      if (initialProgress.length > 0) {
        const updatedProgress = [...initialProgress];
        updatedProgress[0].completionStatus = 'in-progress';
        setActivityProgress(updatedProgress);
      }
    }
  }, [sessionConfig]);
  
  // Start session timer
  useEffect(() => {
    if (sessionActive && !sessionPaused) {
      const interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - sessionStartTime) / 1000));
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [sessionActive, sessionPaused, sessionStartTime]);
  
  // Start session
  const startSession = () => {
    setSessionActive(true);
    setSessionStartTime(Date.now());
  };
  
  // Pause session
  const pauseSession = () => {
    setSessionPaused(true);
    onSessionPause();
  };
  
  // Resume session
  const resumeSession = () => {
    setSessionPaused(false);
    // Adjust start time to account for pause duration
    setSessionStartTime(Date.now() - (elapsedTime * 1000));
  };
  
  // End session
  const endSession = () => {
    setSessionActive(false);
    
    // Prepare session data for review
    const sessionData = {
      sessionId: sessionConfig.id,
      sessionName: sessionConfig.name,
      duration: elapsedTime,
      activities: activityProgress,
      tokensEarned: tokenCount,
      speechTargets: sessionConfig.speechTargets,
      behaviorFocus: sessionConfig.behaviorFocus,
      completionDate: new Date().toISOString(),
    };
    
    onSessionComplete(sessionData);
  };
  
  // Handle activity change
  const handleActivityChange = (activityIndex: number) => {
    // Mark previous activity as completed
    if (currentActivityIndex < activityIndex) {
      const updatedProgress = [...activityProgress];
      if (updatedProgress[currentActivityIndex]) {
        updatedProgress[currentActivityIndex].completionStatus = 'completed';
      }
      
      // Mark new activity as in-progress
      if (updatedProgress[activityIndex]) {
        updatedProgress[activityIndex].completionStatus = 'in-progress';
      }
      
      setActivityProgress(updatedProgress);
    }
    
    setCurrentActivityIndex(activityIndex);
  };
  
  // Award token
  const awardToken = () => {
    if (tokenCount < maxTokens) {
      setTokenCount(prev => prev + 1);
      
      // Update activity progress with token
      const updatedProgress = [...activityProgress];
      if (updatedProgress[currentActivityIndex]) {
        updatedProgress[currentActivityIndex].tokensEarned = 
          (updatedProgress[currentActivityIndex].tokensEarned || 0) + 1;
      }
      
      setActivityProgress(updatedProgress);
    }
  };
  
  // Update activity success rate
  const updateActivitySuccessRate = (activityIndex: number, successRate: number) => {
    const updatedProgress = [...activityProgress];
    if (updatedProgress[activityIndex]) {
      updatedProgress[activityIndex].successRate = successRate;
    }
    
    setActivityProgress(updatedProgress);
  };
  
  // Calculate session progress
  const sessionProgress = {
    totalActivities: sessionConfig.activities.length,
    completedActivities: activityProgress.filter(a => a.completionStatus === 'completed').length,
    currentActivityIndex,
  };
  
  // If session not started yet, show start button
  if (!sessionActive) {
    return (
      <div className="session-start-screen flex flex-col items-center justify-center h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="start-container text-center p-8 bg-white rounded-lg shadow-lg"
        >
          <h1 className="text-3xl font-bold mb-6" style={{ color: sessionConfig.colorScheme.primary }}>
            {sessionConfig.name}
          </h1>
          
          <div className="session-info mb-8">
            <p className="text-lg mb-2">
              Duration: {sessionConfig.duration} minutes
            </p>
            <p className="text-lg mb-4">
              Activities: {sessionConfig.activities.length}
            </p>
            
            <div className="speech-targets mb-2">
              <span className="font-medium">Speech Targets: </span>
              {sessionConfig.speechTargets.join(', ')}
            </div>
            
            <div className="behavior-focus">
              <span className="font-medium">Behavior Focus: </span>
              {sessionConfig.behaviorFocus.join(', ')}
            </div>
          </div>
          
          <motion.button
            className="start-button px-8 py-4 rounded-full text-white text-xl font-bold"
            style={{ backgroundColor: sessionConfig.colorScheme.primary }}
            onClick={startSession}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start {sessionConfig.theme === 'dragon' ? 'Dragon' : 'Dinosaur'} Adventure
          </motion.button>
        </motion.div>
      </div>
    );
  }
  
  return (
    <div className="session-manager">
      {/* Session Header */}
      <div className="session-header bg-white p-4 shadow-md flex justify-between items-center" 
           style={{ borderBottom: `3px solid ${sessionConfig.colorScheme.primary}` }}>
        <h1 className="text-xl font-bold" style={{ color: sessionConfig.colorScheme.primary }}>
          {sessionConfig.name}
        </h1>
        <div className="session-time text-lg font-medium">
          Session Time: {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="session-content grid grid-cols-12 gap-4 p-4">
        {/* Left Column - Timer and Progress */}
        <div className="left-column col-span-3 space-y-4">
          <VisualTimer 
            activities={sessionConfig.activities}
            currentActivityIndex={currentActivityIndex}
            sessionDuration={sessionConfig.duration}
            elapsedTime={elapsedTime}
            theme={sessionConfig.theme}
            colorScheme={sessionConfig.colorScheme}
          />
          
          <ProgressTracker 
            sessionProgress={sessionProgress}
            activityProgress={activityProgress}
            tokenCount={tokenCount}
            maxTokens={maxTokens}
            theme={sessionConfig.theme}
            colorScheme={sessionConfig.colorScheme}
          />
        </div>
        
        {/* Center Column - Current Activity */}
        <div className="center-column col-span-6">
          <div className="current-activity bg-white rounded-lg shadow-md p-4 h-full border-2" 
               style={{ borderColor: sessionConfig.colorScheme.primary }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: sessionConfig.colorScheme.primary }}>
              Current Activity: {sessionConfig.activities[currentActivityIndex]?.name || 'None'}
            </h2>
            
            <ActivitySequencer 
              activities={sessionConfig.activities}
              initialActivityIndex={currentActivityIndex}
              onActivityChange={handleActivityChange}
              theme={sessionConfig.theme}
              colorScheme={sessionConfig.colorScheme}
            />
          </div>
        </div>
        
        {/* Right Column - Therapist Controls */}
        <div className="right-column col-span-3 space-y-4">
          <div className="therapist-controls bg-white rounded-lg shadow-md p-4 border-2" 
               style={{ borderColor: sessionConfig.colorScheme.secondary }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: sessionConfig.colorScheme.secondary }}>
              Therapist Controls
            </h2>
            
            {/* Engagement Tools */}
            <div className="engagement-tools mb-4">
              <h3 className="text-md font-medium mb-2">Engagement Tools</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="tool-button p-2 rounded-md text-white text-sm"
                        style={{ backgroundColor: sessionConfig.colorScheme.primary }}>
                  Dragon Alert
                </button>
                <button className="tool-button p-2 rounded-md text-white text-sm"
                        style={{ backgroundColor: sessionConfig.colorScheme.primary }}>
                  Interest Boost
                </button>
                <button className="tool-button p-2 rounded-md text-white text-sm"
                        style={{ backgroundColor: sessionConfig.colorScheme.primary }}>
                  Success Moment
                </button>
                <button className="tool-button p-2 rounded-md text-white text-sm"
                        style={{ backgroundColor: sessionConfig.colorScheme.primary }}>
                  Movement Break
                </button>
              </div>
            </div>
            
            {/* Difficulty Controls */}
            <div className="difficulty-controls mb-4">
              <h3 className="text-md font-medium mb-2">Difficulty</h3>
              <div className="flex space-x-2 mb-2">
                <button className="difficulty-button px-3 py-1 rounded-md text-white text-sm"
                        style={{ backgroundColor: sessionConfig.colorScheme.secondary }}>
                  Easier
                </button>
                <button className="difficulty-button px-3 py-1 rounded-md text-white text-sm"
                        style={{ backgroundColor: sessionConfig.colorScheme.secondary }}>
                  Harder
                </button>
              </div>
              <div className="visual-support mb-1">
                <span className="text-xs">Visual Support:</span>
                <div className="slider-container h-2 bg-gray-200 rounded-full mt-1">
                  <div className="slider-value h-full rounded-full w-3/4" 
                       style={{ backgroundColor: sessionConfig.colorScheme.accent }}></div>
                </div>
              </div>
              <div className="repetitions flex justify-between items-center">
                <span className="text-xs">Repetitions:</span>
                <div className="repetition-controls flex items-center">
                  <button className="dec-button w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">-</button>
                  <span className="mx-2 text-sm">5</span>
                  <button className="inc-button w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">+</button>
                </div>
              </div>
            </div>
            
            {/* Token Economy */}
            <div className="token-economy mb-4">
              <h3 className="text-md font-medium mb-2">Token Economy</h3>
              <button 
                className="award-token-button w-full p-2 rounded-md text-white font-medium"
                style={{ backgroundColor: sessionConfig.colorScheme.accent }}
                onClick={awardToken}
              >
                Award Token
              </button>
            </div>
            
            {/* Session Controls */}
            <div className="session-controls grid grid-cols-2 gap-2">
              <button 
                className="dragons-den-button p-2 rounded-md border-2 font-medium"
                style={{ borderColor: sessionConfig.colorScheme.primary, color: sessionConfig.colorScheme.primary }}
              >
                Dragon's Den
              </button>
              <button 
                className="next-activity-button p-2 rounded-md border-2 font-medium"
                style={{ borderColor: sessionConfig.colorScheme.secondary, color: sessionConfig.colorScheme.secondary }}
                onClick={() => handleActivityChange(currentActivityIndex + 1)}
                disabled={currentActivityIndex >= sessionConfig.activities.length - 1}
              >
                Next Activity
              </button>
              <button 
                className="pause-button p-2 rounded-md border-2 font-medium"
                style={{ borderColor: '#666', color: '#666' }}
                onClick={sessionPaused ? resumeSession : pauseSession}
              >
                {sessionPaused ? 'Resume Session' : 'Pause Session'}
              </button>
              <button 
                className="end-button p-2 rounded-md bg-red-500 text-white font-medium"
                onClick={endSession}
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionManager;
