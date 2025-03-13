import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TokenEconomyVisualizerProps {
  tokenCount: number;
  maxTokens: number;
  onTokenAdded: () => void;
  onRewardClaimed: (rewardId: string) => void;
  theme: 'dragon' | 'dinosaur';
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface Reward {
  id: string;
  name: string;
  description: string;
  tokenCost: number;
  icon: string;
}

const TokenEconomyVisualizer: React.FC<TokenEconomyVisualizerProps> = ({
  tokenCount,
  maxTokens,
  onTokenAdded,
  onRewardClaimed,
  theme,
  colorScheme,
}) => {
  // State for token animation and rewards
  const [showTokenAnimation, setShowTokenAnimation] = useState(false);
  const [animatingTokenIndex, setAnimatingTokenIndex] = useState(-1);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [showRewardDetails, setShowRewardDetails] = useState(false);
  
  // Available rewards
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([
    {
      id: 'reward-1',
      name: 'Special Dragon Story',
      description: 'Unlock a special dragon story to read together',
      tokenCost: 5,
      icon: '📚',
    },
    {
      id: 'reward-2',
      name: 'Dragon Dance Party',
      description: 'Have a 1-minute dragon dance party with music',
      tokenCost: 3,
      icon: '🎵',
    },
    {
      id: 'reward-3',
      name: 'Dragon Treasure',
      description: 'Receive a small dragon-themed prize',
      tokenCost: 10,
      icon: '💎',
    },
    {
      id: 'reward-4',
      name: 'Dragon Drawing',
      description: 'Create a special dragon drawing together',
      tokenCost: 7,
      icon: '🎨',
    },
  ]);
  
  // Trigger token animation when count changes
  useEffect(() => {
    if (tokenCount > 0) {
      setShowTokenAnimation(true);
      setAnimatingTokenIndex(tokenCount - 1);
      
      // Reset animation after delay
      setTimeout(() => {
        setShowTokenAnimation(false);
        setAnimatingTokenIndex(-1);
      }, 1500);
    }
  }, [tokenCount]);
  
  // Handle reward selection
  const handleRewardSelect = (rewardId: string) => {
    setSelectedReward(rewardId);
    setShowRewardDetails(true);
  };
  
  // Handle reward claim
  const handleRewardClaim = (reward: Reward) => {
    if (tokenCount >= reward.tokenCost) {
      onRewardClaimed(reward.id);
      setShowRewardDetails(false);
      
      // Show success message or animation here
    }
  };
  
  // Close reward details
  const closeRewardDetails = () => {
    setShowRewardDetails(false);
    setSelectedReward(null);
  };
  
  // Get token icon based on theme
  const getTokenIcon = () => {
    return theme === 'dragon' ? '🔮' : '💎';
  };
  
  // Get selected reward
  const getSelectedReward = () => {
    return availableRewards.find(reward => reward.id === selectedReward);
  };
  
  // Calculate reward progress percentage
  const getRewardProgress = (reward: Reward) => {
    return Math.min(100, (tokenCount / reward.tokenCost) * 100);
  };
  
  return (
    <div className="token-economy-visualizer bg-white rounded-lg shadow-md p-4 border-2" 
         style={{ borderColor: colorScheme.primary }}>
      <h2 className="text-xl font-bold mb-4" style={{ color: colorScheme.primary }}>
        {theme === 'dragon' ? 'Dragon Gems' : 'Dino Treasures'}
      </h2>
      
      {/* Token Display */}
      <div className="token-display mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Tokens Earned:</span>
          <span className="font-bold">{tokenCount} / {maxTokens}</span>
        </div>
        
        <div className="token-grid grid grid-cols-5 gap-2 mb-4">
          {Array.from({ length: maxTokens }).map((_, index) => (
            <motion.div
              key={index}
              className="token-slot w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{ 
                borderColor: colorScheme.secondary,
                backgroundColor: index < tokenCount ? colorScheme.secondary + '20' : 'transparent'
              }}
              animate={index === animatingTokenIndex && showTokenAnimation ? {
                scale: [1, 1.3, 1],
                borderColor: [colorScheme.secondary, colorScheme.primary, colorScheme.secondary]
              } : {}}
              transition={{ duration: 0.5 }}
            >
              {index < tokenCount ? (
                <motion.div
                  initial={index === animatingTokenIndex ? { scale: 0 } : { scale: 1 }}
                  animate={index === animatingTokenIndex ? { scale: 1 } : {}}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="token-icon text-xl"
                >
                  {getTokenIcon()}
                </motion.div>
              ) : null}
            </motion.div>
          ))}
        </div>
        
        {/* Token Progress Bar */}
        <div className="token-progress-bar h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full rounded-full"
            style={{ backgroundColor: colorScheme.primary }}
            initial={{ width: 0 }}
            animate={{ width: `${(tokenCount / maxTokens) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      
      {/* Available Rewards */}
      <div className="available-rewards mb-4">
        <h3 className="text-lg font-medium mb-2" style={{ color: colorScheme.secondary }}>
          Available Rewards
        </h3>
        
        <div className="rewards-grid grid grid-cols-2 gap-3">
          {availableRewards.map(reward => (
            <div 
              key={reward.id}
              className={`reward-item p-3 rounded-lg border-2 cursor-pointer ${tokenCount >= reward.tokenCost ? 'opacity-100' : 'opacity-70'}`}
              style={{ 
                borderColor: selectedReward === reward.id ? colorScheme.primary : colorScheme.secondary + '50',
                backgroundColor: selectedReward === reward.id ? colorScheme.primary + '10' : 'transparent'
              }}
              onClick={() => handleRewardSelect(reward.id)}
            >
              <div className="flex items-center mb-2">
                <span className="reward-icon text-2xl mr-2">{reward.icon}</span>
                <span className="reward-name font-medium text-sm">{reward.name}</span>
              </div>
              
              <div className="reward-cost flex items-center justify-between">
                <span className="text-xs">{reward.tokenCost} tokens</span>
                <div className="progress-indicator w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: colorScheme.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getRewardProgress(reward)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Reward Details Modal */}
      {showRewardDetails && getSelectedReward() && (
        <motion.div 
          className="reward-details-modal fixed inset-0 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <motion.div 
            className="modal-content bg-white rounded-lg p-6 max-w-md mx-4"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <div className="modal-header flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold" style={{ color: colorScheme.primary }}>
                {getSelectedReward()?.name}
              </h3>
              <button 
                className="close-button text-gray-500 hover:text-gray-700"
                onClick={closeRewardDetails}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body mb-6">
              <div className="reward-icon text-5xl mb-4 text-center">
                {getSelectedReward()?.icon}
              </div>
              
              <p className="reward-description mb-4">
                {getSelectedReward()?.description}
              </p>
              
              <div className="reward-cost flex items-center justify-between mb-2">
                <span className="font-medium">Cost:</span>
                <span className="font-bold">{getSelectedReward()?.tokenCost} tokens</span>
              </div>
              
              <div className="reward-progress mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Your progress:</span>
                  <span className="text-sm font-bold">{tokenCount} / {getSelectedReward()?.tokenCost}</span>
                </div>
                <div className="progress-bar h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: colorScheme.primary }}
                    initial={{ width: 0 }}
                    animate={{ width: `${getRewardProgress(getSelectedReward()!)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer flex justify-end">
              <button 
                className="cancel-button px-4 py-2 rounded-md border mr-2"
                onClick={closeRewardDetails}
              >
                Cancel
              </button>
              <button 
                className="claim-button px-4 py-2 rounded-md text-white"
                style={{ 
                  backgroundColor: tokenCount >= getSelectedReward()!.tokenCost ? colorScheme.primary : '#ccc',
                  cursor: tokenCount >= getSelectedReward()!.tokenCost ? 'pointer' : 'not-allowed'
                }}
                onClick={() => handleRewardClaim(getSelectedReward()!)}
                disabled={tokenCount < getSelectedReward()!.tokenCost}
              >
                Claim Reward
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Add Token Button (for testing) */}
      <button 
        className="add-token-button px-4 py-2 rounded-md text-white w-full"
        style={{ backgroundColor: colorScheme.secondary }}
        onClick={onTokenAdded}
        disabled={tokenCount >= maxTokens}
      >
        Add Token
      </button>
    </div>
  );
};

export default TokenEconomyVisualizer;
