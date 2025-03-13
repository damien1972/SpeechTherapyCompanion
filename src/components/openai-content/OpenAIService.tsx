import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OpenAIServiceProps {
  apiKey: string;
  prompt: string;
  onContentGenerated: (content: string) => void;
  onError: (error: string) => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

const OpenAIService: React.FC<OpenAIServiceProps> = ({
  apiKey,
  prompt,
  onContentGenerated,
  onError,
  theme,
  colorScheme,
}) => {
  // State for API interaction
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [apiKeyValid, setApiKeyValid] = useState(false);
  const [apiKeyMasked, setApiKeyMasked] = useState('');
  
  // Validate and mask API key
  useEffect(() => {
    if (apiKey) {
      // Simple validation - check if it starts with "sk-" and has sufficient length
      const isValid = apiKey.startsWith('sk-') && apiKey.length > 20;
      setApiKeyValid(isValid);
      
      // Mask the API key for display
      const masked = apiKey.substring(0, 5) + '...' + apiKey.substring(apiKey.length - 4);
      setApiKeyMasked(masked);
    } else {
      setApiKeyValid(false);
      setApiKeyMasked('');
    }
  }, [apiKey]);
  
  // Generate content when prompt changes
  useEffect(() => {
    if (!prompt || !apiKeyValid) return;
    
    const generateContent = async () => {
      setIsLoading(true);
      setApiStatus('loading');
      
      try {
        // In a real app, this would call the OpenAI API
        // For now, we'll simulate the API call
        const content = await simulateOpenAICall(prompt, theme);
        
        setIsLoading(false);
        setApiStatus('success');
        onContentGenerated(content);
      } catch (error) {
        setIsLoading(false);
        setApiStatus('error');
        const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
        setErrorMessage(errorMsg);
        onError(errorMsg);
      }
    };
    
    generateContent();
  }, [prompt, apiKeyValid, theme]);
  
  // Simulate OpenAI API call (in a real app, this would use the actual API)
  const simulateOpenAICall = async (promptText: string, contentTheme: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if API key is valid (for simulation)
    if (!apiKeyValid) {
      throw new Error('Invalid API key');
    }
    
    // Generate content based on prompt and theme
    let generatedContent = '';
    
    if (promptText.includes('story')) {
      // Generate a simple story
      if (contentTheme === 'dragon') {
        generatedContent = 'The pink dragon named Sparkle likes to fly. She finds a shiny gem in the cave. The gem makes her happy. Sparkle shows the gem to her friends. They all play together with the gem.';
      } else {
        generatedContent = 'Rex the green dinosaur walks in the forest. He sees a big tree with fruit. Rex is hungry and eats the fruit. The fruit is sweet and good. Rex feels happy after eating.';
      }
    } else if (promptText.includes('character')) {
      // Generate a character description
      if (contentTheme === 'dragon') {
        generatedContent = 'Lily is a purple dragon with sparkly wings. She has a white star on her head. Lily likes to sing songs to flowers. Her special power is making flowers grow big.';
      } else {
        generatedContent = 'Stompy is a blue dinosaur with spiky plates. He has big friendly eyes. Stompy likes to jump in puddles. His special skill is finding hidden treasures.';
      }
    } else if (promptText.includes('activity')) {
      // Generate an activity
      if (contentTheme === 'dragon') {
        generatedContent = 'Dragon Sound Game: Say "roar" like a dragon. Say "whoosh" like flying wings. Say "crackle" like dragon fire. Say "stomp" like dragon feet. Say "snore" like a sleeping dragon.';
      } else {
        generatedContent = 'Dino Movement Game: Stomp like a big dinosaur. Stretch your neck up high. Swing your tail side to side. Chomp your arms like dino jaws. Curl up like a dino egg.';
      }
    } else {
      // Default content
      generatedContent = 'Once upon a time, there was a friendly ' + (contentTheme === 'dragon' ? 'dragon' : 'dinosaur') + '. They loved to play and have fun. Every day they would go on adventures. They made many friends along the way. They lived happily ever after.';
    }
    
    return generatedContent;
  };
  
  return (
    <div className="openai-service bg-white rounded-lg shadow-md p-6 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: colorScheme.primary }}>
        OpenAI Content Generator
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {/* API Status */}
        <div className="api-status bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
            API Connection Status
          </h3>
          
          <div className="status-indicator flex items-center mb-4">
            <div 
              className="status-dot w-4 h-4 rounded-full mr-2"
              style={{ 
                backgroundColor: apiStatus === 'idle' ? '#9ca3af' : 
                                apiStatus === 'loading' ? '#3b82f6' : 
                                apiStatus === 'success' ? '#10b981' : 
                                '#ef4444'
              }}
            />
            <span className="status-text">
              {apiStatus === 'idle' ? 'Ready' : 
               apiStatus === 'loading' ? 'Generating Content...' : 
               apiStatus === 'success' ? 'Content Generated Successfully' : 
               'Error: ' + errorMessage}
            </span>
          </div>
          
          <div className="api-key-status flex items-center justify-between">
            <div className="key-info">
              <span className="text-sm font-medium">API Key:</span>
              <span className="text-sm ml-2">
                {apiKeyMasked || 'Not provided'}
              </span>
            </div>
            
            <div className="key-validity">
              <span 
                className="text-sm px-2 py-1 rounded-md"
                style={{ 
                  backgroundColor: apiKeyValid ? '#10b98120' : '#ef444420',
                  color: apiKeyValid ? '#10b981' : '#ef4444'
                }}
              >
                {apiKeyValid ? 'Valid' : 'Invalid or Missing'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Generation Status */}
        <div className="generation-status bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.primary }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.primary }}>
            Content Generation
          </h3>
          
          {isLoading ? (
            <div className="loading-state flex flex-col items-center justify-center py-6">
              <motion.div 
                className="loading-animation mb-4"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              >
                <div className="w-16 h-16 border-4 border-t-4 rounded-full" 
                     style={{ 
                       borderColor: colorScheme.secondary + '40',
                       borderTopColor: colorScheme.secondary
                     }} 
                />
              </motion.div>
              
              <div className="loading-text text-center">
                <p className="text-lg font-medium mb-1" style={{ color: colorScheme.primary }}>
                  Generating {theme === 'dragon' ? 'Dragon' : 'Dinosaur'} Content
                </p>
                <p className="text-sm text-gray-500">
                  This may take a few moments...
                </p>
              </div>
            </div>
          ) : apiStatus === 'success' ? (
            <div className="success-state text-center py-6">
              <motion.div 
                className="success-icon text-5xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 1 }}
              >
                ✨
              </motion.div>
              
              <p className="text-lg font-medium" style={{ color: colorScheme.primary }}>
                Content Generated Successfully!
              </p>
            </div>
          ) : apiStatus === 'error' ? (
            <div className="error-state text-center py-6">
              <motion.div 
                className="error-icon text-5xl mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                ❌
              </motion.div>
              
              <p className="text-lg font-medium text-red-500 mb-2">
                Error Generating Content
              </p>
              
              <p className="text-sm text-gray-500">
                {errorMessage}
              </p>
            </div>
          ) : (
            <div className="idle-state text-center py-6">
              <div className="idle-icon text-5xl mb-4">
                {theme === 'dragon' ? '🐉' : '🦖'}
              </div>
              
              <p className="text-lg font-medium" style={{ color: colorScheme.primary }}>
                Ready to Generate Content
              </p>
              
              <p className="text-sm text-gray-500 mt-2">
                Create a prompt and provide a valid API key to begin
              </p>
            </div>
          )}
        </div>
        
        {/* Usage Information */}
        <div className="usage-info bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
            Usage Information
          </h3>
          
          <div className="usage-tips text-sm">
            <p className="mb-2">
              <span className="font-medium">Model:</span> GPT-4
            </p>
            <p className="mb-2">
              <span className="font-medium">Temperature:</span> 0.7 (balanced creativity and consistency)
            </p>
            <p className="mb-2">
              <span className="font-medium">Max Tokens:</span> 300 (suitable for short content)
            </p>
            <p>
              <span className="font-medium">Safety Filters:</span> Enabled (child-appropriate content only)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenAIService;
