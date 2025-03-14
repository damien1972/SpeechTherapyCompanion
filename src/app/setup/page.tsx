"use client"
import * as React from 'react';
import { motion } from 'framer-motion';
import SessionConfigurator from '/src/components/session-management/SessionConfigurator.tsx';

interface SetupProps {}

const Setup: React.FC<SetupProps> = () => {
  // Default color scheme using preferred colors
  const colorScheme = {
    primary: '#9c27b0', // Purple
    secondary: '#e91e63', // Pink
    accent: '#f48fb1', // Light Pink
  };

  // Handle session configuration completion
  const handleConfigComplete = (sessionConfig: any) => {
    console.log('Session configuration complete:', sessionConfig);
    // In a real implementation, this would navigate to the session view
    window.location.href = '/session';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Speech Therapy Session Setup</h1>
          <p className="text-pink-600">Configure your therapy session with dragon and dinosaur themes</p>
        </header>

        <SessionConfigurator
          onConfigComplete={handleConfigComplete}
          theme="dragon"
          colorScheme={colorScheme}
        />
      </motion.div>
    </div>
  );
};

export default Setup;
