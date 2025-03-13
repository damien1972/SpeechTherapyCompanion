import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface DragonSpeechQuestProps {
  targetSounds: string[];
  targetWords: string[];
  difficulty: number;
  onSuccess: (success: boolean) => void;
  onAttempt: () => void;
  onComplete: (successRate: number) => void;
  awardToken: () => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const DragonSpeechQuest: React.FC<DragonSpeechQuestProps> = ({
  targetSounds,
  targetWords,
  difficulty,
  onSuccess,
  onAttempt,
  onComplete,
  awardToken,
  theme,
  colorScheme,
}) => {
  // State for current word and progress
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState(targetWords[0] || '');
  const [attempts, setAttempts] = useState(0);
  const [successes, setSuccesses] = useState(0);
  const [dragonPower, setDragonPower] = useState(0);
  
  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  
  // Visual feedback state
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Update current word when index changes
  useEffect(() => {
    if (targetWords[currentWordIndex]) {
      setCurrentWord(targetWords[currentWordIndex]);
    }
  }, [currentWordIndex, targetWords]);
  
  // Initialize audio recording
  useEffect(() => {
    let mounted = true;
    
    const initializeAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mounted) return;
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioBlob(audioBlob);
          setAudioUrl(audioUrl);
          audioChunksRef.current = [];
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };
    
    initializeAudio();
    
    return () => {
      mounted = false;
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, []);
  
  // Start recording
  const startRecording = () => {
    if (mediaRecorderRef.current && !isRecording) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      onAttempt();
      setAttempts(prev => prev + 1);
    }
  };
  
  // Play recorded audio
  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };
  
  // Mark attempt as successful
  const markSuccess = () => {
    setSuccesses(prev => prev + 1);
    setShowSuccess(true);
    setFeedbackMessage('Great job! Clear speech!');
    setShowFeedback(true);
    
    // Increase dragon power
    const newPower = Math.min(dragonPower + (100 / targetWords.length), 100);
    setDragonPower(newPower);
    
    // Award token if power reaches certain thresholds
    if (Math.floor(newPower / 25) > Math.floor(dragonPower / 25)) {
      awardToken();
    }
    
    onSuccess(true);
    
    // Hide success feedback after delay
    setTimeout(() => {
      setShowSuccess(false);
      setShowFeedback(false);
    }, 2000);
  };
  
  // Move to next word
  const handleNextWord = () => {
    if (currentWordIndex < targetWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Activity complete
      const successRate = (successes / attempts) * 100;
      onComplete(successRate);
    }
  };
  
  // Get character based on theme
  const getCharacter = () => {
    return theme === 'dragon' ? '🐉' : '🦖';
  };
  
  // Get visual support level based on difficulty
  const getVisualSupport = () => {
    if (difficulty <= 3) {
      // High visual support
      return (
        <div className="visual-support mb-4">
          <div className="word-image text-9xl mb-2">
            {currentWord === 'cat' ? '🐱' : 
             currentWord === 'dog' ? '🐶' : 
             currentWord === 'fish' ? '🐠' : 
             currentWord === 'bird' ? '🐦' : 
             currentWord === 'book' ? '📚' : 
             currentWord === 'ball' ? '⚽' : 
             currentWord === 'cup' ? '🥤' : 
             currentWord === 'hat' ? '👒' : '📦'}
          </div>
          <div className="word-letters flex justify-center space-x-2 mb-2">
            {currentWord.split('').map((letter, index) => (
              <div 
                key={index}
                className="letter-box w-12 h-12 flex items-center justify-center text-2xl font-bold rounded-md"
                style={{ 
                  backgroundColor: index === currentWord.length - 1 ? colorScheme.accent : colorScheme.secondary,
                  color: 'white'
                }}
              >
                {letter.toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (difficulty <= 6) {
      // Medium visual support
      return (
        <div className="visual-support mb-4">
          <div className="word-image text-7xl mb-2">
            {currentWord === 'cat' ? '🐱' : 
             currentWord === 'dog' ? '🐶' : 
             currentWord === 'fish' ? '🐠' : 
             currentWord === 'bird' ? '🐦' : 
             currentWord === 'book' ? '📚' : 
             currentWord === 'ball' ? '⚽' : 
             currentWord === 'cup' ? '🥤' : 
             currentWord === 'hat' ? '👒' : '📦'}
          </div>
        </div>
      );
    } else {
      // Low visual support
      return null;
    }
  };
  
  return (
    <div className="dragon-speech-quest bg-white rounded-lg shadow-md p-6 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-2xl font-bold mb-4 text-center" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Speech Quest' : 'Dinosaur Speech Challenge'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Target Information */}
        <div className="target-info">
          <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Target Sounds
            </h3>
            <div className="current-focus mb-4">
              <span className="font-medium">Current Focus:</span>
              <div className="text-md" style={{ color: colorScheme.primary }}>
                {targetSounds.join(', ')}
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Target Words
            </h3>
            <ul className="target-words space-y-1 mb-4">
              {targetWords.map((word, index) => (
                <li 
                  key={word} 
                  className={`px-2 py-1 rounded ${index === currentWordIndex ? 'font-bold' : ''}`}
                  style={{ 
                    backgroundColor: index === currentWordIndex ? colorScheme.accent + '30' : 'transparent',
                    color: index === currentWordIndex ? colorScheme.primary : 'inherit'
                  }}
                >
                  {word}
                </li>
              ))}
            </ul>
            
            <div className="attempts-counter mb-1">
              <span className="font-medium">Attempts:</span> {attempts}
            </div>
            <div className="success-counter">
              <span className="font-medium">Successes:</span> {successes}
            </div>
          </div>
        </div>
        
        {/* Center Column - Main Activity */}
        <div className="main-activity col-span-1 md:col-span-2">
          <div className="bg-gray-50 rounded-lg p-6 border flex flex-col items-center justify-center" 
               style={{ borderColor: colorScheme.primary, minHeight: '400px' }}>
            
            {/* Dragon Character */}
            <motion.div 
              className="character-container mb-4"
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
            
            {/* Visual Support */}
            {getVisualSupport()}
            
            {/* Current Word */}
            <div className="current-word mb-6">
              <h3 className="text-xl mb-2 text-center">Help me say:</h3>
              <div 
                className="word-display text-4xl font-bold px-8 py-3 rounded-lg"
                style={{ 
                  backgroundColor: colorScheme.primary + '20',
                  color: colorScheme.primary
                }}
              >
                {currentWord.toUpperCase()}
              </div>
            </div>
            
            {/* Recording Controls */}
            <div className="recording-controls flex space-x-4 mb-6">
              <button
                className={`record-button px-4 py-2 rounded-full text-white flex items-center ${isRecording ? 'bg-red-500' : ''}`}
                style={{ backgroundColor: isRecording ? '#ef4444' : colorScheme.secondary }}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <>
                    <span className="mr-2">⏹️</span>
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">🎤</span>
                    <span>Record</span>
                  </>
                )}
              </button>
              
              <button
                className="play-button px-4 py-2 rounded-full text-white flex items-center"
                style={{ 
                  backgroundColor: audioUrl ? colorScheme.primary : '#ccc',
                  cursor: audioUrl ? 'pointer' : 'not-allowed'
                }}
                onClick={playAudio}
                disabled={!audioUrl}
              >
                <span className="mr-2">▶️</span>
                <span>Play</span>
              </button>
              
              <button
                className="success-button px-4 py-2 rounded-full text-white flex items-center"
                style={{ backgroundColor: colorScheme.accent }}
                onClick={markSuccess}
                disabled={!audioUrl}
              >
                <span className="mr-2">✅</span>
                <span>Success</span>
              </button>
            </div>
            
            {/* Dragon Power Meter */}
            <div className="dragon-power-container w-full mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Dragon Power:</span>
                <span className="text-sm">{Math.round(dragonPower)}%</span>
              </div>
              <div className="power-meter-bg h-4 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="power-meter-fill h-full rounded-full"
                  style={{ backgroundColor: colorScheme.primary }}
                  initial={{ width: 0 }}
                  animate={{ width: `${dragonPower}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
            
            {/* Feedback Message */}
            <motion.div
              className="feedback-message text-center text-lg font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: showFeedback ? 1 : 0,
                y: showFeedback ? 0 : 20
              }}
              style={{ color: colorScheme.primary }}
            >
              {feedbackMessage}
            </motion.div>
            
            {/* Next Word Button */}
            <button
              className="next-word-button px-6 py-2 rounded-full text-white font-bold"
              style={{ backgroundColor: colorScheme.primary }}
              onClick={handleNextWord}
            >
              {currentWordIndex < targetWords.length - 1 ? 'Next Word' : 'Complete Activity'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragonSpeechQuest;
