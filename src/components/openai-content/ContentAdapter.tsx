import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContentAdapterProps {
  rawContent: string;
  onContentAdapted: (adaptedContent: AdaptedContent) => void;
  cognitiveLevel: number; // 1-10 scale, where lower means more adaptation
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface AdaptedContent {
  text: string;
  visualSupports: VisualSupport[];
  simplifiedText: string;
  keyVocabulary: string[];
}

interface VisualSupport {
  id: string;
  type: 'image' | 'icon' | 'symbol';
  description: string;
  position: 'before' | 'after' | 'inline';
  relatedText: string;
}

const ContentAdapter: React.FC<ContentAdapterProps> = ({
  rawContent,
  onContentAdapted,
  cognitiveLevel,
  theme,
  colorScheme,
}) => {
  // State for adapted content
  const [adaptedContent, setAdaptedContent] = useState<AdaptedContent>({
    text: '',
    visualSupports: [],
    simplifiedText: '',
    keyVocabulary: [],
  });
  
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptationComplete, setAdaptationComplete] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Adapt content when raw content changes
  useEffect(() => {
    if (!rawContent) {
      setAdaptedContent({
        text: '',
        visualSupports: [],
        simplifiedText: '',
        keyVocabulary: [],
      });
      setAdaptationComplete(false);
      return;
    }
    
    // In a real app, this would call the OpenAI API
    // For now, we'll simulate the adaptation process
    const adaptContent = async () => {
      setIsAdapting(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create adapted content based on cognitive level
      const adapted = simulateContentAdaptation(rawContent, cognitiveLevel);
      
      setAdaptedContent(adapted);
      setIsAdapting(false);
      setAdaptationComplete(true);
      onContentAdapted(adapted);
    };
    
    adaptContent();
  }, [rawContent, cognitiveLevel]);
  
  // Simulate content adaptation (in a real app, this would use OpenAI)
  const simulateContentAdaptation = (content: string, level: number): AdaptedContent => {
    // Extract key vocabulary (simple simulation)
    const words = content.split(/\s+/);
    const keyWords = words
      .filter(word => word.length > 3)
      .filter(word => !['and', 'the', 'that', 'with', 'from', 'this', 'have'].includes(word.toLowerCase()))
      .slice(0, 5);
    
    // Create simplified text based on cognitive level
    let simplified = content;
    if (level <= 3) {
      // Very simplified
      simplified = content
        .split('.')
        .slice(0, 3)
        .map(sentence => sentence.split(' ').slice(0, 6).join(' '))
        .join('. ');
      simplified += '.';
    } else if (level <= 6) {
      // Moderately simplified
      simplified = content
        .split('.')
        .slice(0, 4)
        .map(sentence => sentence.split(' ').slice(0, 8).join(' '))
        .join('. ');
      simplified += '.';
    } else {
      // Slightly simplified
      simplified = content
        .split('.')
        .slice(0, 5)
        .join('. ');
      simplified += '.';
    }
    
    // Create visual supports
    const visualSupports: VisualSupport[] = [];
    
    // Add dragon/dinosaur visual
    visualSupports.push({
      id: 'vs-1',
      type: 'icon',
      description: theme === 'dragon' ? 'Dragon character' : 'Dinosaur character',
      position: 'before',
      relatedText: 'character',
    });
    
    // Add emotion visual if content contains emotion words
    const emotionWords = ['happy', 'sad', 'angry', 'scared', 'excited'];
    const foundEmotion = emotionWords.find(emotion => content.toLowerCase().includes(emotion));
    if (foundEmotion) {
      visualSupports.push({
        id: 'vs-2',
        type: 'icon',
        description: `${foundEmotion} emotion`,
        position: 'inline',
        relatedText: foundEmotion,
      });
    }
    
    // Add action visual
    const actionWords = ['fly', 'run', 'jump', 'swim', 'eat', 'sleep'];
    const foundAction = actionWords.find(action => content.toLowerCase().includes(action));
    if (foundAction) {
      visualSupports.push({
        id: 'vs-3',
        type: 'icon',
        description: `${foundAction} action`,
        position: 'inline',
        relatedText: foundAction,
      });
    }
    
    return {
      text: content,
      visualSupports,
      simplifiedText: simplified,
      keyVocabulary: keyWords,
    };
  };
  
  // Get icon for visual support
  const getVisualSupportIcon = (support: VisualSupport) => {
    if (support.description.includes('Dragon character') || support.description.includes('Dinosaur character')) {
      return theme === 'dragon' ? '🐉' : '🦖';
    }
    
    if (support.description.includes('happy')) return '😊';
    if (support.description.includes('sad')) return '😢';
    if (support.description.includes('angry')) return '😠';
    if (support.description.includes('scared')) return '😨';
    if (support.description.includes('excited')) return '😃';
    
    if (support.description.includes('fly')) return '🦋';
    if (support.description.includes('run')) return '🏃';
    if (support.description.includes('jump')) return '⬆️';
    if (support.description.includes('swim')) return '🏊';
    if (support.description.includes('eat')) return '🍽️';
    if (support.description.includes('sleep')) return '😴';
    
    return '📌';
  };
  
  // Toggle preview
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  return (
    <div className="content-adapter bg-white rounded-lg shadow-md p-6 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: colorScheme.primary }}>
        Content Adapter
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Adaptation Controls */}
        <div className="adaptation-controls">
          <div className="bg-gray-50 rounded-lg p-4 border mb-4" style={{ borderColor: colorScheme.secondary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Cognitive Accessibility
            </h3>
            
            <div className="cognitive-level-slider mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm">Adaptation Level:</span>
                <span className="text-sm font-bold">{cognitiveLevel}/10</span>
              </div>
              <div className="slider-visualization h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full"
                  style={{ 
                    width: `${(cognitiveLevel / 10) * 100}%`,
                    backgroundColor: colorScheme.primary
                  }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span>More Adaptation</span>
                <span>Less Adaptation</span>
              </div>
            </div>
            
            <div className="adaptation-features mb-4">
              <h4 className="text-md font-medium mb-2">Adaptation Features:</h4>
              <ul className="features-list space-y-1 text-sm">
                <li className="flex items-center">
                  <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colorScheme.primary }}></span>
                  <span>Simplified vocabulary</span>
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colorScheme.primary }}></span>
                  <span>Shorter sentences (5-7 words)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colorScheme.primary }}></span>
                  <span>Visual supports for key concepts</span>
                </li>
                <li className="flex items-center">
                  <span className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: colorScheme.primary }}></span>
                  <span>Repeated vocabulary for reinforcement</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Key Vocabulary */}
          <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Key Vocabulary
            </h3>
            
            {isAdapting ? (
              <div className="loading-state flex justify-center items-center py-4">
                <motion.div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: colorScheme.primary }}
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
              </div>
            ) : adaptationComplete ? (
              <div className="vocabulary-list">
                <div className="grid grid-cols-2 gap-2">
                  {adaptedContent.keyVocabulary.map((word, index) => (
                    <div 
                      key={index}
                      className="vocabulary-item px-3 py-2 rounded-md text-center"
                      style={{ 
                        backgroundColor: colorScheme.primary + '20',
                        color: colorScheme.primary
                      }}
                    >
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No content to adapt yet...</p>
            )}
          </div>
        </div>
        
        {/* Right Column - Adapted Content */}
        <div className="adapted-content">
          <div className="bg-gray-50 rounded-lg p-4 border mb-4" style={{ borderColor: colorScheme.primary }}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold" style={{ color: colorScheme.primary }}>
                {showPreview ? 'Visual Preview' : 'Adapted Content'}
              </h3>
              
              <button 
                className="toggle-view-button px-3 py-1 rounded-md text-sm"
                style={{ 
                  backgroundColor: colorScheme.secondary,
                  color: 'white'
                }}
                onClick={togglePreview}
                disabled={!adaptationComplete}
              >
                {showPreview ? 'Show Text' : 'Show Preview'}
              </button>
            </div>
            
            {isAdapting ? (
              <div className="loading-state flex justify-center items-center py-8">
                <div className="text-center">
                  <motion.div
                    className="w-12 h-12 rounded-full mx-auto mb-4"
                    style={{ backgroundColor: colorScheme.primary }}
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  <p className="text-sm">Adapting content...</p>
                </div>
              </div>
            ) : adaptationComplete ? (
              showPreview ? (
                <div className="visual-preview p-4 bg-white rounded-md border" style={{ borderColor: colorScheme.secondary + '50', minHeight: '200px' }}>
                  <div className="preview-content">
                    {/* Visual supports at the beginning */}
                    <div className="visual-supports-top flex mb-4">
                      {adaptedContent.visualSupports
                        .filter(support => support.position === 'before')
                        .map(support => (
                          <div 
                            key={support.id}
                            className="visual-support-item text-4xl mx-2"
                            title={support.description}
                          >
                            {getVisualSupportIcon(support)}
                          </div>
                        ))}
                    </div>
                    
                    {/* Simplified text with inline visuals */}
                    <div className="simplified-text text-lg mb-4">
                      {adaptedContent.simplifiedText.split(' ').map((word, index) => {
                        const matchingSupport = adaptedContent.visualSupports.find(
                          support => support.position === 'inline' && word.toLowerCase().includes(support.relatedText.toLowerCase())
                        );
                        
                        return (
                          <span key={index} className="word-with-visual">
                            {matchingSupport && (
                              <span 
                                className="inline-visual mx-1 text-xl"
                                title={matchingSupport.description}
                              >
                                {getVisualSupportIcon(matchingSupport)}
                              </span>
                            )}
                            <span className="mx-1">{word}</span>
                          </span>
                        );
                      })}
                    </div>
                    
                    {/* Visual supports at the end */}
                    <div className="visual-supports-bottom flex mt-4">
                      {adaptedContent.visualSupports
                        .filter(support => support.position === 'after')
                        .map(support => (
                          <div 
                            key={support.id}
                            className="visual-support-item text-4xl mx-2"
                            title={support.description}
                          >
                            {getVisualSupportIcon(support)}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="adapted-text-view p-4 bg-white rounded-md border" style={{ borderColor: colorScheme.secondary + '50', minHeight: '200px' }}>
                  <div className="original-text mb-4">
                    <h4 className="text-sm font-medium mb-1">Original Content:</h4>
                    <p className="text-sm">{adaptedContent.text}</p>
                  </div>
                  
                  <div className="simplified-text">
                    <h4 className="text-sm font-medium mb-1">Adapted Content:</h4>
                    <p className="text-md font-bold" style={{ color: colorScheme.primary }}>
                      {adaptedContent.simplifiedText}
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="empty-state p-4 bg-white rounded-md border text-center" style={{ borderColor: colorScheme.secondary + '50', minHeight: '200px' }}>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-5xl mb-4">{theme === 'dragon' ? '🐉' : '🦖'}</div>
                  <p className="text-sm text-gray-500 italic">Generate content first to see adaptation...</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Visual Support Legend */}
          <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.primary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.primary }}>
              Visual Supports
            </h3>
            
            {adaptationComplete && adaptedContent.visualSupports.length > 0 ? (
              <div className="visual-legend grid grid-cols-2 gap-2">
                {adaptedContent.visualSupports.map(support => (
                  <div 
                    key={support.id}
                    className="legend-item flex items-center p-2 bg-white rounded-md border"
                    style={{ borderColor: colorScheme.secondary + '30' }}
                  >
                    <span className="legend-icon text-2xl mr-2">
                      {getVisualSupportIcon(support)}
                    </span>
                    <span className="legend-description text-sm">
                      {support.description}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No visual supports generated yet...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentAdapter;
