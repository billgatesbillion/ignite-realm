import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';
import socketManager from '@/lib/socket';
import { toast } from '@/hooks/use-toast';
import gameConfig from '@/config/game.json';

interface GameState {
  currentXP: number;
  currentLevel: number;
  currentCoins: number;
  streak: number;
  dailyMissionsCompleted: number;
  weeklyMissionsCompleted: number;
  totalMissionsCompleted: number;
  achievements: Achievement[];
  notifications: GameNotification[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: string;
}

interface GameNotification {
  id: string;
  type: 'xp_gained' | 'level_up' | 'achievement' | 'mission_complete' | 'streak_bonus';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  metadata?: any;
}

interface GameContextType {
  gameState: GameState;
  addXP: (amount: number, source?: string) => void;
  addCoins: (amount: number, source?: string) => void;
  updateStreak: (increment?: boolean) => void;
  unlockAchievement: (achievementId: string) => void;
  markNotificationRead: (notificationId: string) => void;
  clearAllNotifications: () => void;
  getXPToNextLevel: () => number;
  getProgressToNextLevel: () => number;
  calculateLevel: (xp: number) => number;
  isLevelUp: boolean;
  setIsLevelUp: (value: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const { getAgeGroupConfig } = useTheme();
  const [isLevelUp, setIsLevelUp] = useState(false);
  
  const [gameState, setGameState] = useState<GameState>({
    currentXP: 0,
    currentLevel: 1,
    currentCoins: 0,
    streak: 0,
    dailyMissionsCompleted: 0,
    weeklyMissionsCompleted: 0,
    totalMissionsCompleted: 0,
    achievements: [],
    notifications: [],
  });

  // Sync with user data
  useEffect(() => {
    if (user) {
      setGameState(prev => ({
        ...prev,
        currentXP: user.xp,
        currentLevel: user.level,
        currentCoins: user.coins,
        streak: user.streak,
      }));
    }
  }, [user]);

  // Socket event listeners
  useEffect(() => {
    const handleAchievementUnlocked = (data: any) => {
      unlockAchievement(data.id);
    };

    const handleXPGained = (data: any) => {
      addXP(data.amount, data.source);
    };

    socketManager.on('achievement:unlocked', handleAchievementUnlocked);
    socketManager.on('xp:gained', handleXPGained);

    return () => {
      socketManager.off('achievement:unlocked', handleAchievementUnlocked);
      socketManager.off('xp:gained', handleXPGained);
    };
  }, []);

  const calculateLevel = (xp: number): number => {
    const thresholds = gameConfig.levels.thresholds;
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (xp >= thresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  };

  const getXPToNextLevel = (): number => {
    const thresholds = gameConfig.levels.thresholds;
    const currentLevel = gameState.currentLevel;
    
    if (currentLevel >= thresholds.length) {
      return 0; // Max level reached
    }
    
    return thresholds[currentLevel] - gameState.currentXP;
  };

  const getProgressToNextLevel = (): number => {
    const thresholds = gameConfig.levels.thresholds;
    const currentLevel = gameState.currentLevel;
    
    if (currentLevel >= thresholds.length) {
      return 100; // Max level reached
    }
    
    const currentLevelXP = thresholds[currentLevel - 1] || 0;
    const nextLevelXP = thresholds[currentLevel];
    const progress = gameState.currentXP - currentLevelXP;
    const required = nextLevelXP - currentLevelXP;
    
    return Math.min((progress / required) * 100, 100);
  };

  const addNotification = (notification: Omit<GameNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: GameNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    setGameState(prev => ({
      ...prev,
      notifications: [newNotification, ...prev.notifications.slice(0, 49)], // Keep last 50
    }));

    return newNotification;
  };

  const addXP = (amount: number, source = 'unknown') => {
    const oldXP = gameState.currentXP;
    const oldLevel = gameState.currentLevel;
    const newXP = oldXP + amount;
    const newLevel = calculateLevel(newXP);

    setGameState(prev => ({
      ...prev,
      currentXP: newXP,
      currentLevel: newLevel,
    }));

    // Add XP notification
    addNotification({
      type: 'xp_gained',
      title: `+${amount} XP`,
      description: `Gained from ${source}`,
      metadata: { amount, source }
    });

    // Check for level up
    if (newLevel > oldLevel) {
      setIsLevelUp(true);
      const config = getAgeGroupConfig();
      
      addNotification({
        type: 'level_up',
        title: `Level ${newLevel} Reached!`,
        description: config.messaging.levelUp,
        metadata: { oldLevel, newLevel }
      });

      // Level up bonus coins
      const bonusCoins = gameConfig.coins.levelUpBonus;
      addCoins(bonusCoins, 'level_up_bonus');

      toast({
        title: "🎉 LEVEL UP!",
        description: `You reached level ${newLevel}! +${bonusCoins} bonus coins!`,
      });
    }

    // Refresh user data
    refreshUser();
  };

  const addCoins = (amount: number, source = 'unknown') => {
    setGameState(prev => ({
      ...prev,
      currentCoins: prev.currentCoins + amount,
    }));

    if (source !== 'level_up_bonus') {
      addNotification({
        type: 'xp_gained', // Reusing type for simplicity
        title: `+${amount} Coins`,
        description: `Earned from ${source}`,
        metadata: { amount, source, type: 'coins' }
      });
    }

    refreshUser();
  };

  const updateStreak = (increment = true) => {
    const newStreak = increment ? gameState.streak + 1 : 0;
    
    setGameState(prev => ({
      ...prev,
      streak: newStreak,
    }));

    if (increment && newStreak > gameState.streak) {
      // Streak bonus XP
      const multiplier = gameConfig.xp.streakMultipliers[newStreak.toString() as keyof typeof gameConfig.xp.streakMultipliers] || 1;
      if (multiplier > 1) {
        const bonusXP = Math.floor(gameConfig.xp.baseReward * (multiplier - 1));
        addXP(bonusXP, 'streak_bonus');
        
        addNotification({
          type: 'streak_bonus',
          title: `${newStreak} Day Streak!`,
          description: `Bonus +${bonusXP} XP for your streak!`,
          metadata: { streak: newStreak, bonusXP }
        });
      }
    }

    refreshUser();
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = gameConfig.achievements.find(a => a.id === achievementId);
    if (!achievement) return;

    const alreadyUnlocked = gameState.achievements.some(a => a.id === achievementId && a.unlocked);
    if (alreadyUnlocked) return;

    const unlockedAchievement: Achievement = {
      ...achievement,
      rarity: achievement.rarity as 'common' | 'rare' | 'epic' | 'legendary',
      unlocked: true,
      unlockedAt: new Date().toISOString(),
    };

    setGameState(prev => ({
      ...prev,
      achievements: prev.achievements.map(a => 
        a.id === achievementId ? unlockedAchievement : a
      ),
    }));

    // Add XP reward
    addXP(achievement.xpReward, 'achievement');

    // Add notification
    const config = getAgeGroupConfig();
    addNotification({
      type: 'achievement',
      title: `🏆 ${achievement.title}`,
      description: config.messaging.achievement,
      metadata: { achievement }
    });

    toast({
      title: "🏆 Achievement Unlocked!",
      description: `${achievement.title} - +${achievement.xpReward} XP!`,
    });
  };

  const markNotificationRead = (notificationId: string) => {
    setGameState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  };

  const clearAllNotifications = () => {
    setGameState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true })),
    }));
  };

  const value: GameContextType = {
    gameState,
    addXP,
    addCoins,
    updateStreak,
    unlockAchievement,
    markNotificationRead,
    clearAllNotifications,
    getXPToNextLevel,
    getProgressToNextLevel,
    calculateLevel,
    isLevelUp,
    setIsLevelUp,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};