import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VisualSupportGeneratorProps {
  content: string;
  onVisualsGenerated: (visuals: VisualSupport[]) => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface VisualSupport {
  id: string;
  type: 'character' | 'action' | 'emotion' | 'object' | 'setting';
  description: string;
  icon: string;
  relatedText: string;
}

const VisualSupportGenerator: React.FC<VisualSupportGeneratorProps> = ({
  content,
  onVisualsGenerated,
  theme,
  colorScheme,
}) => {
  // State for visual supports
  const [visuals, setVisuals] = useState<VisualSupport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [selectedVisuals, setSelectedVisuals] = useState<string[]>([]);
  
  // Generate visuals when content changes
  useEffect(() => {
    if (!content) {
      setVisuals([]);
      setGenerationComplete(false);
      setSelectedVisuals([]);
      return;
    }
    
    // In a real app, this would call the OpenAI API
    // For now, we'll simulate the generation process
    const generateVisuals = async () => {
      setIsGenerating(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate visual supports based on content
      const generatedVisuals = simulateVisualGeneration(content, theme);
      
      setVisuals(generatedVisuals);
      setIsGenerating(false);
      setGenerationComplete(true);
      
      // Auto-select all visuals by default
      const visualIds = generatedVisuals.map(visual => visual.id);
      setSelectedVisuals(visualIds);
      
      // Notify parent component
      onVisualsGenerated(generatedVisuals);
    };
    
    generateVisuals();
  }, [content, theme]);
  
  // Simulate visual generation (in a real app, this would use OpenAI)
  const simulateVisualGeneration = (text: string, contentTheme: string): VisualSupport[] => {
    const generatedVisuals: VisualSupport[] = [];
    
    // Add character visual
    generatedVisuals.push({
      id: `visual-character-${Date.now()}`,
      type: 'character',
      description: contentTheme === 'dragon' ? 'Friendly dragon' : 'Friendly dinosaur',
      icon: contentTheme === 'dragon' ? '🐉' : '🦖',
      relatedText: contentTheme === 'dragon' ? 'dragon' : 'dinosaur',
    });
    
    // Check for emotions in the text
    const emotions = [
      { word: 'happy', icon: '😊' },
      { word: 'sad', icon: '😢' },
      { word: 'angry', icon: '😠' },
      { word: 'scared', icon: '😨' },
      { word: 'excited', icon: '😃' },
    ];
    
    emotions.forEach(emotion => {
      if (text.toLowerCase().includes(emotion.word)) {
        generatedVisuals.push({
          id: `visual-emotion-${Date.now()}-${emotion.word}`,
          type: 'emotion',
          description: `${emotion.word} feeling`,
          icon: emotion.icon,
          relatedText: emotion.word,
        });
      }
    });
    
    // Check for actions in the text
    const actions = [
      { word: 'fly', icon: '🦋' },
      { word: 'run', icon: '🏃' },
      { word: 'jump', icon: '⬆️' },
      { word: 'swim', icon: '🏊' },
      { word: 'eat', icon: '🍽️' },
      { word: 'sleep', icon: '😴' },
    ];
    
    actions.forEach(action => {
      if (text.toLowerCase().includes(action.word)) {
        generatedVisuals.push({
          id: `visual-action-${Date.now()}-${action.word}`,
          type: 'action',
          description: `${action.word} action`,
          icon: action.icon,
          relatedText: action.word,
        });
      }
    });
    
    // Check for objects in the text
    const objects = [
      { word: 'gem', icon: '💎' },
      { word: 'treasure', icon: '💰' },
      { word: 'food', icon: '🍎' },
      { word: 'water', icon: '💧' },
      { word: 'fire', icon: '🔥' },
      { word: 'cave', icon: '🏔️' },
    ];
    
    objects.forEach(object => {
      if (text.toLowerCase().includes(object.word)) {
        generatedVisuals.push({
          id: `visual-object-${Date.now()}-${object.word}`,
          type: 'object',
          description: object.word,
          icon: object.icon,
          relatedText: object.word,
        });
      }
    });
    
    // Check for settings in the text
    const settings = [
      { word: 'forest', icon: '🌳' },
      { word: 'mountain', icon: '⛰️' },
      { word: 'lake', icon: '🏞️' },
      { word: 'castle', icon: '🏰' },
      { word: 'home', icon: '🏠' },
    ];
    
    settings.forEach(setting => {
      if (text.toLowerCase().includes(setting.word)) {
        generatedVisuals.push({
          id: `visual-setting-${Date.now()}-${setting.word}`,
          type: 'setting',
          description: `${setting.word} setting`,
          icon: setting.icon,
          relatedText: setting.word,
        });
      }
    });
    
    // If we don't have enough visuals, add some generic ones
    if (generatedVisuals.length < 3) {
      if (!generatedVisuals.some(v => v.type === 'emotion')) {
        generatedVisuals.push({
          id: `visual-emotion-${Date.now()}-happy`,
          type: 'emotion',
          description: 'happy feeling',
          icon: '😊',
          relatedText: 'happy',
        });
      }
      
      if (!generatedVisuals.some(v => v.type === 'action')) {
        generatedVisuals.push({
          id: `visual-action-${Date.now()}-fly`,
          type: 'action',
          description: 'fly action',
          icon: '🦋',
          relatedText: 'fly',
        });
      }
    }
    
    return generatedVisuals;
  };
  
  // Toggle visual selection
  const toggleVisualSelection = (visualId: string) => {
    if (selectedVisuals.includes(visualId)) {
      setSelectedVisuals(selectedVisuals.filter(id => id !== visualId));
    } else {
      setSelectedVisuals([...selectedVisuals, visualId]);
    }
  };
  
  // Apply selected visuals
  const applySelectedVisuals = () => {
    const filteredVisuals = visuals.filter(visual => selectedVisuals.includes(visual.id));
    onVisualsGenerated(filteredVisuals);
  };
  
  // Get color for visual type
  const getVisualTypeColor = (type: string) => {
    switch (type) {
      case 'character':
        return colorScheme.primary;
      case 'emotion':
        return '#f59e0b'; // Amber
      case 'action':
        return '#3b82f6'; // Blue
      case 'object':
        return '#10b981'; // Green
      case 'setting':
        return '#8b5cf6'; // Purple
      default:
        return colorScheme.secondary;
    }
  };
  
  return (
    <div className="visual-support-generator bg-white rounded-lg shadow-md p-6 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: colorScheme.primary }}>
        Visual Support Generator
      </h2>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Generation Status */}
        <div className="generation-status bg-gray-50 rounded-lg p-4 border mb-4" style={{ borderColor: colorScheme.secondary }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
            Visual Supports
          </h3>
          
          {isGenerating ? (
            <div className="loading-state flex justify-center items-center py-4">
              <div className="text-center">
                <motion.div
                  className="w-12 h-12 rounded-full mx-auto mb-4"
                  style={{ backgroundColor: colorScheme.primary }}
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
                <p className="text-sm">Generating visual supports...</p>
              </div>
            </div>
          ) : generationComplete ? (
            <div className="visuals-grid">
              {visuals.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {visuals.map(visual => (
                    <div 
                      key={visual.id}
                      className={`visual-item p-3 rounded-lg border-2 cursor-pointer ${selectedVisuals.includes(visual.id) ? 'border-opacity-100' : 'border-opacity-30'}`}
                      style={{ 
                        borderColor: getVisualTypeColor(visual.type),
                        backgroundColor: selectedVisuals.includes(visual.id) ? getVisualTypeColor(visual.type) + '15' : 'transparent'
                      }}
                      onClick={() => toggleVisualSelection(visual.id)}
                    >
                      <div className="flex items-center mb-2">
                        <span className="visual-icon text-3xl mr-2">{visual.icon}</span>
                        <span className="visual-type text-xs px-2 py-1 rounded-md text-white" style={{ backgroundColor: getVisualTypeColor(visual.type) }}>
                          {visual.type}
                        </span>
                      </div>
                      <div className="visual-description text-sm">
                        {visual.description}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-4">
                  No visual supports could be generated from the content.
                </p>
              )}
            </div>
          ) : (
            <div className="empty-state text-center py-4">
              <p className="text-sm text-gray-500 italic">
                Generate content first to create visual supports...
              </p>
            </div>
          )}
        </div>
        
        {/* Visual Support Preview */}
        {generationComplete && visuals.length > 0 && (
          <div className="visual-preview bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.primary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.primary }}>
              Visual Support Preview
            </h3>
            
            <div className="preview-container p-4 bg-white rounded-md border mb-4" style={{ borderColor: colorScheme.secondary + '50' }}>
              <div className="selected-visuals flex flex-wrap justify-center gap-3 mb-4">
                {visuals
                  .filter(visual => selectedVisuals.includes(visual.id))
                  .map(visual => (
                    <div 
                      key={visual.id}
                      className="visual-preview-item p-2 rounded-md"
                      style={{ backgroundColor: getVisualTypeColor(visual.type) + '20' }}
                    >
                      <div className="text-center">
                        <div className="visual-icon text-4xl mb-1">{visual.icon}</div>
                        <div className="visual-label text-xs">{visual.description}</div>
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="preview-instructions text-sm text-center">
                <p>These visual supports can be used alongside the adapted content to enhance comprehension.</p>
              </div>
            </div>
            
            <div className="preview-actions flex justify-end">
              <button 
                className="apply-visuals-button px-4 py-2 rounded-md text-white"
                style={{ backgroundColor: colorScheme.primary }}
                onClick={applySelectedVisuals}
              >
                Apply Selected Visuals
              </button>
            </div>
          </div>
        )}
        
        {/* Usage Tips */}
        <div className="usage-tips bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.secondary }}>
          <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
            Visual Support Tips
          </h3>
          
          <ul className="tips-list space-y-2 text-sm">
            <li className="flex items-start">
              <span className="tip-icon mr-2">💡</span>
              <span>Use visuals before, during, and after speech activities to reinforce concepts</span>
            </li>
            <li className="flex items-start">
              <span className="tip-icon mr-2">💡</span>
              <span>Pair each visual with consistent verbal cues</span>
            </li>
            <li className="flex items-start">
              <span className="tip-icon mr-2">💡</span>
              <span>Limit to 3-5 visuals per activity to avoid overwhelming the patient</span>
            </li>
            <li className="flex items-start">
              <span className="tip-icon mr-2">💡</span>
              <span>Use character visuals consistently across sessions to build familiarity</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default VisualSupportGenerator;
