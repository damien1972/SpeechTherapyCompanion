import React from 'react';
import { motion } from 'framer-motion';
import SessionManager from '../components/session-management/SessionManager.tsx';

interface SessionProps {}

const Session: React.FC<SessionProps> = () => {
  // Default color scheme using preferred colors
  const colorScheme = {
    primary: '#9c27b0', // Purple
    secondary: '#e91e63', // Pink
    accent: '#f48fb1', // Light Pink
  };

  // Mock session configuration (in a real app, this would come from the setup page)
  const mockSessionConfig = {
    id: 'session-123',
    name: 'Dragon Kingdom Adventure',
    duration: 45,
    activities: [
      { id: 'greeting', name: 'Dragon Greeting', type: 'speech', duration: 5 },
      { id: 'speech-quest', name: 'Speech Quest', type: 'speech', duration: 10 },
      { id: 'movement', name: 'Movement Break', type: 'movement', duration: 3 },
      { id: 'expert-role', name: 'Expert Role-Play', type: 'expert', duration: 8 },
      { id: 'dragons-den', name: "Dragon's Den", type: 'break', duration: 3 },
      { id: 'speech-quest-2', name: 'Speech Quest 2', type: 'speech', duration: 10 },
      { id: 'token-exchange', name: 'Token Exchange', type: 'reward', duration: 5 },
    ],
    speechTargets: ['Final Consonants', 'Consonant Blends'],
    behaviorFocus: ['Engagement', 'Boundaries'],
    theme: 'dragon',
    colorScheme: colorScheme,
  };

  // Handle session completion
  const handleSessionComplete = (sessionData: any) => {
    console.log('Session completed:', sessionData);
    // In a real implementation, this would navigate to the review view
    window.location.href = '/review';
  };

  // Handle session pause
  const handleSessionPause = () => {
    console.log('Session paused');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <SessionManager
        sessionConfig={mockSessionConfig}
        onSessionComplete={handleSessionComplete}
        onSessionPause={handleSessionPause}
      />
    </div>
  );
};

export default Session;
