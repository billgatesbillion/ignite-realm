import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Progress } from '@/components/ui/progress';

interface XPBarProps {
  showLevel?: boolean;
  showNumbers?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ 
  showLevel = true, 
  showNumbers = true, 
  size = 'md',
  animated = true 
}) => {
  const { gameState, getProgressToNextLevel, getXPToNextLevel } = useGame();
  const { ageGroup } = useTheme();
  const [displayXP, setDisplayXP] = useState(gameState.currentXP);
  const [displayLevel, setDisplayLevel] = useState(gameState.currentLevel);

  const progress = getProgressToNextLevel();
  const xpToNext = getXPToNextLevel();

  // Animated number counting
  useEffect(() => {
    if (!animated) {
      setDisplayXP(gameState.currentXP);
      setDisplayLevel(gameState.currentLevel);
      return;
    }

    const animateXP = () => {
      const start = displayXP;
      const end = gameState.currentXP;
      const duration = 1000;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);
        
        setDisplayXP(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    };

    const animateLevel = () => {
      if (displayLevel !== gameState.currentLevel) {
        setTimeout(() => setDisplayLevel(gameState.currentLevel), 500);
      }
    };

    animateXP();
    animateLevel();
  }, [gameState.currentXP, gameState.currentLevel, animated]);

  const sizeClasses = {
    sm: 'h-2 text-xs',
    md: 'h-3 text-sm',
    lg: 'h-4 text-base'
  };

  const getAgeGroupClasses = () => {
    switch (ageGroup) {
      case 'kids':
        return 'font-nunito font-bold';
      case 'teen':
        return 'font-orbitron font-bold';
      case 'young-adult':
        return 'font-inter font-semibold';
      default:
        return '';
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Level and XP Display */}
      {(showLevel || showNumbers) && (
        <div className="flex items-center justify-between">
          {showLevel && (
            <motion.div 
              className={`flex items-center space-x-2 ${getAgeGroupClasses()}`}
              animate={{ scale: displayLevel !== gameState.currentLevel ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-primary">
                {ageGroup === 'kids' ? '🌟' : ageGroup === 'teen' ? '⚡' : '🎯'}
              </span>
              <span className={`text-primary ${sizeClasses[size].split(' ')[1]}`}>
                Level {displayLevel}
              </span>
            </motion.div>
          )}
          
          {showNumbers && (
            <motion.div 
              className={`text-muted-foreground ${sizeClasses[size].split(' ')[1]} ${getAgeGroupClasses()}`}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {displayXP.toLocaleString()} XP
              {xpToNext > 0 && (
                <span className="ml-1 text-xs opacity-70">
                  (+{xpToNext.toLocaleString()} to next)
                </span>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative">
        <Progress 
          value={progress} 
          className={`xp-bar ${sizeClasses[size].split(' ')[0]} bg-muted`}
        />
        
        {/* Glow Effect */}
        {animated && progress > 0 && (
          <motion.div
            className={`xp-glow ${sizeClasses[size].split(' ')[0]} absolute inset-0`}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        {/* Progress Text Overlay */}
        {size === 'lg' && showNumbers && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground drop-shadow-sm">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      {/* Age-appropriate encouragement */}
      {progress > 80 && (
        <motion.p 
          className={`text-xs text-center text-muted-foreground ${getAgeGroupClasses()}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {ageGroup === 'kids' && "Almost there! You're doing amazing! 🌈"}
          {ageGroup === 'teen' && "So close to leveling up! Keep grinding! 🔥"}
          {ageGroup === 'young-adult' && "Level threshold approaching. Maintain momentum."}
        </motion.p>
      )}
    </div>
  );
};

export default XPBar;