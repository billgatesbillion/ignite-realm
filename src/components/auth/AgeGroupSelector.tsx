import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AgeGroup } from '@/contexts/ThemeContext';

interface AgeGroupOption {
  value: AgeGroup;
  title: string;
  description: string;
  emoji: string;
  features: string[];
  colors: string[];
}

const ageGroupOptions: AgeGroupOption[] = [
  {
    value: 'kids',
    title: 'Friendly Explorer',
    description: 'Perfect for young adventurers!',
    emoji: '🌟',
    features: ['Big, friendly buttons', 'Colorful animations', 'Encouraging messages', 'Fun sounds'],
    colors: ['#FFD166', '#06D6A0', '#118AB2']
  },
  {
    value: 'teen',
    title: 'Neon Warrior',
    description: 'Level up with style!',
    emoji: '⚡',
    features: ['Dynamic animations', 'Achievement badges', 'Streak tracking', 'Cool effects'],
    colors: ['#FF4D6D', '#4D8AFF', '#7B61FF']
  },
  {
    value: 'young-adult',
    title: 'Elite Gamer',
    description: 'Serious gaming experience',
    emoji: '🎯',
    features: ['Clean interface', 'Detailed stats', 'Advanced features', 'Professional look'],
    colors: ['#66FFCC', '#7B61FF', '#0B0F1A']
  }
];

interface AgeGroupSelectorProps {
  selectedAgeGroup: AgeGroup | null;
  onSelect: (ageGroup: AgeGroup) => void;
  title?: string;
  description?: string;
}

const AgeGroupSelector: React.FC<AgeGroupSelectorProps> = ({
  selectedAgeGroup,
  onSelect,
  title = "Choose Your Gaming Style",
  description = "Pick the experience that matches your vibe!"
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {ageGroupOptions.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                selectedAgeGroup === option.value 
                  ? 'ring-2 ring-primary ring-offset-2 shadow-lg' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => onSelect(option.value)}
            >
              <CardHeader className="text-center pb-3">
                <div className="text-4xl mb-2">{option.emoji}</div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Color Palette Preview */}
                <div className="flex justify-center space-x-2">
                  {option.colors.map((color, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Features List */}
                <ul className="space-y-1 text-xs text-muted-foreground">
                  {option.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Selection Indicator */}
                {selectedAgeGroup === option.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center justify-center space-x-2 text-primary font-semibold"
                  >
                    <span className="text-sm">✓ Selected</span>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedAgeGroup && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 bg-muted rounded-lg"
        >
          <p className="text-sm text-muted-foreground">
            Great choice! You've selected the{' '}
            <span className="font-semibold text-foreground">
              {ageGroupOptions.find(opt => opt.value === selectedAgeGroup)?.title}
            </span>{' '}
            experience. You can change this later in your profile.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AgeGroupSelector;