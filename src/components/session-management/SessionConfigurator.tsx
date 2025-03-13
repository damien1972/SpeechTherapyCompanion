import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ActivityConfig {
  id: string;
  name: string;
  type: string;
  duration: number;
  targets?: string[];
  difficulty?: number;
  content?: any;
}

interface SessionConfiguratorProps {
  onConfigComplete: (sessionConfig: SessionConfig) => void;
  savedTemplates?: SessionConfig[];
  patientProfile?: PatientProfile;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface SessionConfig {
  id: string;
  name: string;
  duration: number;
  activities: ActivityConfig[];
  speechTargets: string[];
  behaviorFocus: string[];
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface PatientProfile {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  interests: string[];
  colorPreferences: string[];
  speechTargets: string[];
  behaviorConsiderations: string[];
}

const SessionConfigurator: React.FC<SessionConfiguratorProps> = ({
  onConfigComplete,
  savedTemplates = [],
  patientProfile,
  theme,
  colorScheme,
}) => {
  // Default session configuration
  const defaultConfig: SessionConfig = {
    id: `session-${Date.now()}`,
    name: 'New Session',
    duration: 45, // Default 45 minutes
    activities: [],
    speechTargets: patientProfile?.speechTargets || [],
    behaviorFocus: patientProfile?.behaviorConsiderations || [],
    theme: theme,
    colorScheme: colorScheme,
  };

  // State for session configuration
  const [sessionConfig, setSessionConfig] = useState<SessionConfig>(defaultConfig);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [sessionName, setSessionName] = useState<string>('Dragon Kingdom Adventure');
  const [sessionDuration, setSessionDuration] = useState<number>(45);
  
  // Available activities
  const [availableActivities, setAvailableActivities] = useState<ActivityConfig[]>([
    { id: 'greeting', name: 'Dragon Greeting', type: 'speech', duration: 5 },
    { id: 'speech-quest', name: 'Speech Quest', type: 'speech', duration: 10 },
    { id: 'expert-role', name: 'Expert Role-Play', type: 'expert', duration: 8 },
    { id: 'movement', name: 'Movement Break', type: 'movement', duration: 3 },
    { id: 'dragons-den', name: "Dragon's Den", type: 'break', duration: 3 },
    { id: 'token-exchange', name: 'Token Exchange', type: 'reward', duration: 5 },
  ]);
  
  // Selected activities for the session
  const [selectedActivities, setSelectedActivities] = useState<ActivityConfig[]>([]);
  
  // Speech targets and behavior focus
  const [speechTargets, setSpeechTargets] = useState<string[]>(patientProfile?.speechTargets || []);
  const [behaviorFocus, setBehaviorFocus] = useState<string[]>(patientProfile?.behaviorConsiderations || []);
  
  // Available speech targets and behavior focus options
  const speechTargetOptions = [
    'Initial Consonants',
    'Final Consonants',
    'Consonant Blends',
    'Vowels',
    'Prosody',
    'Sentence Structure',
    'Narrative Skills',
  ];
  
  const behaviorFocusOptions = [
    'Engagement',
    'Boundaries',
    'Turn-taking',
    'Attention',
    'Frustration Management',
    'Transition Support',
  ];
  
  // Load template
  const loadTemplate = (templateId: string) => {
    const template = savedTemplates.find(t => t.id === templateId);
    if (template) {
      setSessionConfig(template);
      setSessionName(template.name);
      setSessionDuration(template.duration);
      setSelectedActivities(template.activities);
      setSpeechTargets(template.speechTargets);
      setBehaviorFocus(template.behaviorFocus);
    }
  };
  
  // Update session duration when activities change
  useEffect(() => {
    const totalDuration = selectedActivities.reduce((total, activity) => total + activity.duration, 0);
    setSessionDuration(totalDuration);
    
    // Update session config
    setSessionConfig(prev => ({
      ...prev,
      duration: totalDuration,
      activities: selectedActivities,
      name: sessionName,
      speechTargets: speechTargets,
      behaviorFocus: behaviorFocus,
    }));
  }, [selectedActivities, sessionName, speechTargets, behaviorFocus]);
  
  // Add activity to session
  const addActivity = (activity: ActivityConfig) => {
    setSelectedActivities(prev => [...prev, { ...activity, id: `${activity.id}-${Date.now()}` }]);
  };
  
  // Remove activity from session
  const removeActivity = (index: number) => {
    setSelectedActivities(prev => prev.filter((_, i) => i !== index));
  };
  
  // Move activity up in the list
  const moveActivityUp = (index: number) => {
    if (index === 0) return;
    const newActivities = [...selectedActivities];
    const temp = newActivities[index];
    newActivities[index] = newActivities[index - 1];
    newActivities[index - 1] = temp;
    setSelectedActivities(newActivities);
  };
  
  // Move activity down in the list
  const moveActivityDown = (index: number) => {
    if (index === selectedActivities.length - 1) return;
    const newActivities = [...selectedActivities];
    const temp = newActivities[index];
    newActivities[index] = newActivities[index + 1];
    newActivities[index + 1] = temp;
    setSelectedActivities(newActivities);
  };
  
  // Toggle speech target
  const toggleSpeechTarget = (target: string) => {
    setSpeechTargets(prev => 
      prev.includes(target) 
        ? prev.filter(t => t !== target) 
        : [...prev, target]
    );
  };
  
  // Toggle behavior focus
  const toggleBehaviorFocus = (focus: string) => {
    setBehaviorFocus(prev => 
      prev.includes(focus) 
        ? prev.filter(f => f !== focus) 
        : [...prev, focus]
    );
  };
  
  // Handle session start
  const handleStartSession = () => {
    onConfigComplete(sessionConfig);
  };
  
  return (
    <div className="session-configurator bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Kingdom Setup' : 'Dinosaur Adventure Setup'}
      </h1>
      
      {/* Templates Section */}
      {savedTemplates.length > 0 && (
        <div className="templates-section mb-6">
          <h2 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
            Saved Templates
          </h2>
          <select 
            className="w-full p-2 border rounded-md"
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
              loadTemplate(e.target.value);
            }}
          >
            <option value="">-- Select a template --</option>
            {savedTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.duration} min)
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Session Configuration */}
      <div className="session-config-section mb-6">
        <h2 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
          Session Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="session-name">
            <label className="block text-sm font-medium mb-1">Session Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
          </div>
          
          <div className="session-duration">
            <label className="block text-sm font-medium mb-1">Estimated Duration</label>
            <div className="flex items-center">
              <input 
                type="number" 
                className="w-20 p-2 border rounded-md"
                value={sessionDuration}
                readOnly
              />
              <span className="ml-2">minutes</span>
            </div>
          </div>
        </div>
        
        <div className="theme-selection mt-4">
          <label className="block text-sm font-medium mb-1">Theme</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="theme" 
                value="dragon" 
                checked={theme === 'dragon'}
                onChange={() => setSessionConfig(prev => ({ ...prev, theme: 'dragon' }))}
                className="mr-2"
              />
              Dragon Kingdom
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="theme" 
                value="dinosaur" 
                checked={theme === 'dinosaur'}
                onChange={() => setSessionConfig(prev => ({ ...prev, theme: 'dinosaur' }))}
                className="mr-2"
              />
              Dinosaur Adventure
            </label>
          </div>
        </div>
        
        <div className="color-scheme mt-4">
          <label className="block text-sm font-medium mb-1">Color Scheme</label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={colorScheme.primary.includes('pink') || colorScheme.secondary.includes('pink')}
                className="mr-2"
              />
              Pink
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={colorScheme.primary.includes('purple') || colorScheme.secondary.includes('purple')}
                className="mr-2"
              />
              Purple
            </label>
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={true}
                className="mr-2"
              />
              White
            </label>
          </div>
        </div>
      </div>
      
      {/* Activity Selection */}
      <div className="activity-selection-section mb-6">
        <h2 className="text-lg font-bold mb-2" style={{ color: colorScheme.secondary }}>
          Activity Selection
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="available-activities">
            <h3 className="text-md font-medium mb-2">Available Activities</h3>
            <div className="activity-list border rounded-md p-2 h-64 overflow-y-auto">
              {availableActivities.map(activity => (
                <div 
                  key={activity.id} 
                  className="activity-item p-2 mb-2 border rounded-md cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                  onClick={() => addActivity(activity)}
                >
                  <div>
                    <div className="activity-name font-medium">{activity.name}</div>
                    <div className="activity-details text-xs text-gray-500">
                      {activity.type} • {activity.duration} min
                    </div>
                  </div>
                  <button 
                    className="add-button w-6 h-6 rounded-full flex items-center justify-center text-white"
                    style={{ backgroundColor: colorScheme.primary }}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="selected-activities">
            <h3 className="text-md font-medium mb-2">Selected Activities</h3>
            <div className="activity-list border rounded-md p-2 h-64 overflow-y-auto">
              {selectedActivities.length === 0 ? (
                <div className="empty-message text-center text-gray-500 p-4">
                  No activities selected. Click on activities to add them to your session.
                </div>
              ) : (
                selectedActivities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="activity-item p-2 mb-2 border rounded-md flex justify-between items-center"
                  >
                    <div className="activity-order font-bold w-6 h-6 rounded-full flex items-center justify-center text-white"
                         style={{ backgroundColor: colorScheme.secondary }}>
                      {index + 1}
                    </div>
                    <div className="activity-info flex-grow px-2">
                      <div className="activity-name font-medium">{activity.name}</div>
                      <div className="activity-details text-xs text-gray-500">
                        {activity.type} • {activity.duration} min
                      </div>
                    </div>
                    <div className="activity-controls flex space-x-1">
                      <button 
                        className="move-up-button w-6 h-6 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: index > 0 ? colorScheme.primary : '#ccc' }}
                        onClick={() => moveActivityUp(index)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button 
                        className="move-down-button w-6 h-6 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: index < selectedActivities.length - 1 ? colorScheme.primary : '#ccc' }}
                        onClick={() => moveActivityDown(index)}
                        disabled={index === selectedActivities.length - 1}
                      >
                        ↓
                      </button>
                      <button 
                        className="remove-button w-6 h-6 rounded-full flex items-center justify-center text-white bg-red-500"
                        onClick={() => removeActivity(index)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Speech Targets and Behavior Focus */}
      <div className="targets-section mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="speech-targets">
            <h3 className="text-md font-medium mb-2">Speech Targets</h3>
            <div className="targets-list border rounded-md p-3">
              {speechTargetOptions.map(target => (
                <label key={target} className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    checked={speechTargets.includes(target)}
                    onChange={() => toggleSpeechTarget(target)}
                    className="mr-2"
                  />
                  {target}
                </label>
              ))}
            </div>
          </div>
          
          <div className="behavior-focus">
            <h3 className="text-md font-medium mb-2">Behavior Focus</h3>
            <div className="focus-list border rounded-md p-3">
              {behaviorFocusOptions.map(focus => (
                <label key={focus} className="flex items-center mb-2">
                  <input 
                    type="checkbox" 
                    checked={behaviorFocus.includes(focus)}
                    onChange={() => toggleBehaviorFocus(focus)}
                    className="mr-2"
                  />
                  {focus}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="action-buttons flex justify-between">
        <div className="left-buttons">
          <button 
            className="save-template-button px-4 py-2 rounded-md border"
            style={{ borderColor: colorScheme.secondary, color: colorScheme.secondary }}
          >
            Save as Template
          </button>
        </div>
        
        <div className="right-buttons flex space-x-3">
          <button 
            className="cancel-button px-4 py-2 rounded-md border"
          >
            Cancel
          </button>
          <button 
            className="start-session-button px-6 py-2 rounded-md text-white"
            style={{ backgroundColor: colorScheme.primary }}
            onClick={handleStartSession}
            disabled={selectedActivities.length === 0}
          >
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionConfigurator;
