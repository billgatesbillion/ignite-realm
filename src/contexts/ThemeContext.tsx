import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type AgeGroup = 'kids' | 'teen' | 'young-adult';

interface ThemeContextType {
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  themeClass: string;
  getAgeGroupConfig: () => AgeGroupConfig;
}

interface AgeGroupConfig {
  name: string;
  colors: string[];
  animations: string;
  sounds: string;
  fontSize: string;
  borderRadius: string;
  messaging: {
    welcome: string;
    levelUp: string;
    achievement: string;
  };
}

const ageGroupConfigs: Record<AgeGroup, AgeGroupConfig> = {
  kids: {
    name: 'Friendly Explorer',
    colors: ['#FFD166', '#06D6A0', '#118AB2'],
    animations: 'bouncy',
    sounds: 'playful',
    fontSize: 'text-lg',
    borderRadius: 'rounded-xl',
    messaging: {
      welcome: "Awesome job! You're doing great!",
      levelUp: "Wow! You leveled up! Your pet dragon is so proud!",
      achievement: "You did it! Here's a shiny new badge!"
    }
  },
  teen: {
    name: 'Neon Warrior',
    colors: ['#FF4D6D', '#4D8AFF', '#7B61FF'],
    animations: 'dynamic',
    sounds: 'energetic',
    fontSize: 'text-base',
    borderRadius: 'rounded-lg',
    messaging: {
      welcome: "Ready to dominate? Let's crush these challenges!",
      levelUp: "LEVEL UP! You're on fire! Keep that streak alive!",
      achievement: "Epic achievement unlocked! You're a legend!"
    }
  },
  'young-adult': {
    name: 'Elite Gamer',
    colors: ['#66FFCC', '#7B61FF', '#0B0F1A'],
    animations: 'smooth',
    sounds: 'subtle',
    fontSize: 'text-sm',
    borderRadius: 'rounded-md',
    messaging: {
      welcome: "System ready. Initiating next challenge sequence.",
      levelUp: "Level threshold exceeded. Unlocking advanced features.",
      achievement: "Achievement protocol completed. View detailed stats in profile."
    }
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [ageGroup, setAgeGroupState] = useState<AgeGroup>('teen');

  // Sync with user's age group preference
  useEffect(() => {
    if (user?.ageGroup) {
      setAgeGroupState(user.ageGroup);
    } else {
      // Default age group from env or fallback
      const defaultAgeGroup = (import.meta.env.VITE_DEFAULT_AGE_GROUP as AgeGroup) || 'teen';
      setAgeGroupState(defaultAgeGroup);
    }
  }, [user]);

  // Apply theme class to document
  useEffect(() => {
    const themeClass = `theme-${ageGroup}`;
    document.documentElement.className = themeClass;
    
    // Store in localStorage for persistence
    localStorage.setItem('selectedAgeGroup', ageGroup);
  }, [ageGroup]);

  // Load saved theme on mount
  useEffect(() => {
    const savedAgeGroup = localStorage.getItem('selectedAgeGroup') as AgeGroup;
    if (savedAgeGroup && savedAgeGroup !== ageGroup && !user) {
      setAgeGroupState(savedAgeGroup);
    }
  }, []);

  const setAgeGroup = (newAgeGroup: AgeGroup) => {
    setAgeGroupState(newAgeGroup);
    localStorage.setItem('selectedAgeGroup', newAgeGroup);
  };

  const getAgeGroupConfig = () => ageGroupConfigs[ageGroup];

  const value: ThemeContextType = {
    ageGroup,
    setAgeGroup,
    themeClass: `theme-${ageGroup}`,
    getAgeGroupConfig,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Helper hook for age-appropriate messaging
export const useAgeAppropriateText = () => {
  const { getAgeGroupConfig } = useTheme();
  
  return {
    getWelcomeMessage: () => getAgeGroupConfig().messaging.welcome,
    getLevelUpMessage: () => getAgeGroupConfig().messaging.levelUp,
    getAchievementMessage: () => getAgeGroupConfig().messaging.achievement,
  };
};

// Helper hook for age-appropriate styling
export const useAgeAppropriateStyle = () => {
  const { getAgeGroupConfig } = useTheme();
  
  return {
    fontSize: getAgeGroupConfig().fontSize,
    borderRadius: getAgeGroupConfig().borderRadius,
    animations: getAgeGroupConfig().animations,
  };
};