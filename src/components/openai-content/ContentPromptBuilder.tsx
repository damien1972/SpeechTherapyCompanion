import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContentPromptBuilderProps {
  onPromptGenerated: (prompt: string) => void;
  onPromptSaved: (promptId: string, prompt: string) => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  category: 'story' | 'activity' | 'character' | 'social';
}

const ContentPromptBuilder: React.FC<ContentPromptBuilderProps> = ({
  onPromptGenerated,
  onPromptSaved,
  theme,
  colorScheme,
}) => {
  // State for prompt building
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [finalPrompt, setFinalPrompt] = useState<string>('');
  const [savedPrompts, setSavedPrompts] = useState<{id: string, name: string}[]>([]);
  const [promptName, setPromptName] = useState<string>('');
  
  // Available prompt templates
  const [promptTemplates, setPromptTemplates] = useState<PromptTemplate[]>([
    {
      id: 'story-simple',
      name: 'Simple Dragon Story',
      template: 'Create a very simple story about a {color} dragon named {name} who {action}. The story should be 3-5 sentences long with simple subject-verb-object structure. Use concrete words and clear cause-effect relationships. Include one emotional state with a clear reason.',
      category: 'story',
    },
    {
      id: 'story-social',
      name: 'Social Situation Story',
      template: 'Create a very simple social story about a {color} dragon named {name} who learns about {social_skill}. The story should be 3-5 sentences long with simple subject-verb-object structure. Use concrete words and clear cause-effect relationships. Include one emotional state with a clear reason.',
      category: 'story',
    },
    {
      id: 'character-new',
      name: 'New Dragon Character',
      template: 'Create a simple description of a new {color} dragon character named {name} with {special_feature}. The description should be 3-4 sentences with simple vocabulary. Include what the dragon likes to do and one special ability.',
      category: 'character',
    },
    {
      id: 'activity-speech',
      name: 'Speech Practice Activity',
      template: 'Create a simple speech practice activity featuring a {color} dragon who practices the sound "{sound}". Create 5 simple words containing this sound that the dragon needs to say. Each word should be 1-2 syllables. Include a simple reward the dragon gets for practicing.',
      category: 'activity',
    },
    {
      id: 'activity-movement',
      name: 'Movement Activity',
      template: 'Create a simple movement activity where children pretend to be {color} dragons who {movement_type}. Include 3 simple movement instructions with accompanying dragon sounds or words to say while moving. Each instruction should be a single step.',
      category: 'activity',
    },
  ]);
  
  // Get selected template object
  const getSelectedTemplateObject = () => {
    return promptTemplates.find(template => template.id === selectedTemplate);
  };
  
  // Extract customization fields from template
  const extractCustomizationFields = (template: string) => {
    const matches = template.match(/\{([^}]+)\}/g);
    if (!matches) return [];
    
    return matches.map(match => match.slice(1, -1));
  };
  
  // Update customization when template changes
  useEffect(() => {
    const template = getSelectedTemplateObject();
    if (!template) {
      setCustomizations({});
      return;
    }
    
    const fields = extractCustomizationFields(template.template);
    const initialCustomizations: Record<string, string> = {};
    
    fields.forEach(field => {
      // Set default values based on field name
      if (field === 'color' && !customizations[field]) {
        initialCustomizations[field] = theme === 'dragon' ? 'purple' : 'green';
      } else if (field === 'name' && !customizations[field]) {
        initialCustomizations[field] = theme === 'dragon' ? 'Sparkle' : 'Rex';
      } else if (!customizations[field]) {
        initialCustomizations[field] = '';
      } else {
        initialCustomizations[field] = customizations[field];
      }
    });
    
    setCustomizations(initialCustomizations);
  }, [selectedTemplate, theme]);
  
  // Generate final prompt
  const generatePrompt = () => {
    const template = getSelectedTemplateObject();
    if (!template) return;
    
    let prompt = template.template;
    
    // Replace all customization fields
    Object.entries(customizations).forEach(([key, value]) => {
      prompt = prompt.replace(`{${key}}`, value || `[${key}]`);
    });
    
    // Add cognitive accessibility requirements
    prompt += ' IMPORTANT REQUIREMENTS: (1) Use only high-frequency, concrete words. (2) Keep sentences to 5-7 words maximum. (3) Use simple subject-verb-object structure. (4) Repeat key vocabulary for reinforcement. (5) Include clear visual descriptions that could be easily illustrated.';
    
    setFinalPrompt(prompt);
    onPromptGenerated(prompt);
  };
  
  // Save prompt for future use
  const savePrompt = () => {
    if (!finalPrompt || !promptName) return;
    
    const promptId = `saved-${Date.now()}`;
    setSavedPrompts([...savedPrompts, { id: promptId, name: promptName }]);
    onPromptSaved(promptId, finalPrompt);
    setPromptName('');
  };
  
  // Handle customization change
  const handleCustomizationChange = (field: string, value: string) => {
    setCustomizations({
      ...customizations,
      [field]: value,
    });
  };
  
  // Get field label from field name
  const getFieldLabel = (field: string) => {
    return field
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="content-prompt-builder bg-white rounded-lg shadow-md p-6 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Content Generator' : 'Dinosaur Content Generator'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Prompt Builder */}
        <div className="prompt-builder">
          <div className="bg-gray-50 rounded-lg p-4 border mb-4" style={{ borderColor: colorScheme.secondary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
              Select Template
            </h3>
            
            <div className="template-categories mb-4">
              <div className="grid grid-cols-2 gap-2">
                <button 
                  className="category-button px-3 py-1 rounded-md text-sm"
                  style={{ 
                    backgroundColor: colorScheme.primary + '20',
                    color: colorScheme.primary
                  }}
                  onClick={() => {
                    const storyTemplate = promptTemplates.find(t => t.category === 'story');
                    if (storyTemplate) setSelectedTemplate(storyTemplate.id);
                  }}
                >
                  Stories
                </button>
                <button 
                  className="category-button px-3 py-1 rounded-md text-sm"
                  style={{ 
                    backgroundColor: colorScheme.primary + '20',
                    color: colorScheme.primary
                  }}
                  onClick={() => {
                    const characterTemplate = promptTemplates.find(t => t.category === 'character');
                    if (characterTemplate) setSelectedTemplate(characterTemplate.id);
                  }}
                >
                  Characters
                </button>
                <button 
                  className="category-button px-3 py-1 rounded-md text-sm"
                  style={{ 
                    backgroundColor: colorScheme.primary + '20',
                    color: colorScheme.primary
                  }}
                  onClick={() => {
                    const activityTemplate = promptTemplates.find(t => t.category === 'activity');
                    if (activityTemplate) setSelectedTemplate(activityTemplate.id);
                  }}
                >
                  Activities
                </button>
                <button 
                  className="category-button px-3 py-1 rounded-md text-sm"
                  style={{ 
                    backgroundColor: colorScheme.primary + '20',
                    color: colorScheme.primary
                  }}
                  onClick={() => {
                    const socialTemplate = promptTemplates.find(t => t.category === 'social');
                    if (socialTemplate) setSelectedTemplate(socialTemplate.id);
                  }}
                >
                  Social Skills
                </button>
              </div>
            </div>
            
            <div className="template-select mb-4">
              <select 
                className="w-full p-2 border rounded-md"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                style={{ borderColor: colorScheme.secondary }}
              >
                <option value="">Select a template...</option>
                {promptTemplates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            
            {getSelectedTemplateObject() && (
              <div className="template-description mb-4 text-sm italic">
                {getSelectedTemplateObject()?.template}
              </div>
            )}
          </div>
          
          {/* Customization Fields */}
          {selectedTemplate && (
            <div className="bg-gray-50 rounded-lg p-4 border mb-4" style={{ borderColor: colorScheme.secondary }}>
              <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
                Customize Content
              </h3>
              
              <div className="customization-fields space-y-3">
                {Object.keys(customizations).map(field => (
                  <div key={field} className="field-group">
                    <label className="block text-sm font-medium mb-1">
                      {getFieldLabel(field)}:
                    </label>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={customizations[field]}
                      onChange={(e) => handleCustomizationChange(field, e.target.value)}
                      placeholder={`Enter ${field.replace('_', ' ')}...`}
                      style={{ borderColor: colorScheme.secondary + '50' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Generate Button */}
          <button 
            className="generate-button px-4 py-2 rounded-md text-white w-full mb-4"
            style={{ 
              backgroundColor: selectedTemplate ? colorScheme.primary : '#ccc',
              cursor: selectedTemplate ? 'pointer' : 'not-allowed'
            }}
            onClick={generatePrompt}
            disabled={!selectedTemplate}
          >
            Generate Content
          </button>
        </div>
        
        {/* Right Column - Generated Content */}
        <div className="generated-content">
          <div className="bg-gray-50 rounded-lg p-4 border mb-4" style={{ borderColor: colorScheme.primary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.primary }}>
              Generated Prompt
            </h3>
            
            <div className="prompt-display p-3 bg-white rounded-md border min-h-[150px] mb-4" style={{ borderColor: colorScheme.secondary + '50' }}>
              {finalPrompt ? (
                <p className="text-sm">{finalPrompt}</p>
              ) : (
                <p className="text-sm text-gray-500 italic">Generated prompt will appear here...</p>
              )}
            </div>
            
            {/* Save Prompt */}
            <div className="save-prompt-section">
              <div className="flex items-center mb-2">
                <input 
                  type="text"
                  className="flex-grow p-2 border rounded-l-md"
                  value={promptName}
                  onChange={(e) => setPromptName(e.target.value)}
                  placeholder="Name this prompt..."
                  style={{ borderColor: colorScheme.secondary + '50' }}
                />
                <button 
                  className="save-button px-4 py-2 rounded-r-md text-white"
                  style={{ 
                    backgroundColor: finalPrompt && promptName ? colorScheme.secondary : '#ccc',
                    cursor: finalPrompt && promptName ? 'pointer' : 'not-allowed'
                  }}
                  onClick={savePrompt}
                  disabled={!finalPrompt || !promptName}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          
          {/* Saved Prompts */}
          <div className="bg-gray-50 rounded-lg p-4 border" style={{ borderColor: colorScheme.primary }}>
            <h3 className="text-lg font-bold mb-2" style={{ color: colorScheme.primary }}>
              Saved Prompts
            </h3>
            
            {savedPrompts.length > 0 ? (
              <ul className="saved-prompts-list space-y-2">
                {savedPrompts.map(prompt => (
                  <li 
                    key={prompt.id}
                    className="saved-prompt p-2 bg-white rounded-md border flex items-center"
                    style={{ borderColor: colorScheme.secondary + '50' }}
                  >
                    <span className="prompt-icon mr-2">📝</span>
                    <span className="prompt-name">{prompt.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 italic">No saved prompts yet...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPromptBuilder;
