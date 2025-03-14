"use client"
import * as React from 'react';

import { motion } from 'framer-motion';

interface IndexProps {}

const Index: React.FC<IndexProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-purple-700">
          Speech Therapy Companion
        </h1>
        <p className="text-xl text-pink-600 max-w-2xl mx-auto">
          An engaging therapy tool designed for speech pathologists working with children with Down syndrome
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl w-full"
      >
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold mb-4 text-purple-700">Dragon Kingdom Adventure</h2>
              <p className="mb-4 text-gray-700">
                Welcome to the Speech Therapy Companion Application! This tool helps speech therapists engage with children during therapy sessions using dragon and dinosaur themes.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">🔮</span>
                  <span>Maintain engagement throughout 45-minute sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">🔮</span>
                  <span>Prevent disengagement behaviors</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">🔮</span>
                  <span>Support speech intelligibility goals</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">🔮</span>
                  <span>Manage transitions between activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">🔮</span>
                  <span>Leverage special interests (dragons, dinosaurs)</span>
                </li>
              </ul>
              <motion.a
                href="/setup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
              >
                Start Therapy Session
              </motion.a>
            </div>
            <div className="md:w-1/2 flex items-center justify-center">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 2, 0, -2, 0]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 5,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="w-64 h-64 bg-pink-100 rounded-full absolute top-4 left-4 opacity-50"></div>
                <div className="w-64 h-64 bg-purple-100 rounded-full absolute top-0 left-0 opacity-50"></div>
                <div className="relative z-10 text-9xl">🐉</div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              Designed for speech therapists working with children with Down syndrome
            </p>
            <motion.a
              href="/about"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-white text-purple-600 font-bold py-2 px-4 rounded-full"
            >
              Learn More
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
