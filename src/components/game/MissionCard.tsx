import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { Clock, Star, Coins, Lock, CheckCircle, Play } from 'lucide-react';

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  ageGroup: 'kids' | 'teen' | 'young-adult';
  status: 'locked' | 'active' | 'completed' | 'in_progress';
  progress?: number;
  maxProgress?: number;
  timeLimit?: number; // in milliseconds
  timeRemaining?: number;
  image?: string;
  category?: string;
  requirements?: string[];
}

interface MissionCardProps {
  mission: Mission;
  onStart?: (missionId: string) => void;
  onContinue?: (missionId: string) => void;
  onView?: (missionId: string) => void;
  compact?: boolean;
}

const MissionCard: React.FC<MissionCardProps> = ({
  mission,
  onStart,
  onContinue,
  onView,
  compact = false
}) => {
  const { ageGroup } = useTheme();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = () => {
    switch (mission.status) {
      case 'locked': return <Lock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Play className="w-4 h-4 text-blue-500" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getAgeGroupClasses = () => {
    switch (ageGroup) {
      case 'kids':
        return 'font-nunito';
      case 'teen':
        return 'font-orbitron';
      case 'young-adult':
        return 'font-inter';
      default:
        return '';
    }
  };

  const getActionButton = () => {
    if (mission.status === 'locked') {
      return (
        <Button variant="outline" disabled className="w-full">
          <Lock className="w-4 h-4 mr-2" />
          Locked
        </Button>
      );
    }

    if (mission.status === 'completed') {
      return (
        <Button variant="outline" onClick={() => onView?.(mission.id)} className="w-full">
          <CheckCircle className="w-4 h-4 mr-2" />
          View Details
        </Button>
      );
    }

    if (mission.status === 'in_progress') {
      return (
        <Button onClick={() => onContinue?.(mission.id)} className="w-full btn-game">
          <Play className="w-4 h-4 mr-2" />
          Continue
        </Button>
      );
    }

    return (
      <Button onClick={() => onStart?.(mission.id)} className="w-full btn-game">
        <Star className="w-4 h-4 mr-2" />
        Start Mission
      </Button>
    );
  };

  const progressPercentage = mission.progress && mission.maxProgress 
    ? (mission.progress / mission.maxProgress) * 100 
    : 0;

  return (
    <motion.div
      whileHover={{ scale: mission.status !== 'locked' ? 1.02 : 1 }}
      whileTap={{ scale: mission.status !== 'locked' ? 0.98 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className={`mission-card ${compact ? 'h-48' : 'h-64'} ${mission.status === 'locked' ? 'opacity-60' : ''} ${getAgeGroupClasses()}`}>
        {/* Mission Image */}
        {mission.image && !compact && (
          <div className="relative h-32 overflow-hidden rounded-t-lg">
            <img 
              src={mission.image} 
              alt={mission.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2 flex space-x-1">
              <Badge className={`${getDifficultyColor(mission.difficulty)} text-white text-xs`}>
                {mission.difficulty.toUpperCase()}
              </Badge>
              {getStatusIcon()}
            </div>
          </div>
        )}

        <CardHeader className={compact ? 'pb-2' : 'pb-3'}>
          <div className="flex items-start justify-between">
            <CardTitle className={`${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
              {mission.title}
            </CardTitle>
            {compact && getStatusIcon()}
          </div>
          
          {!compact && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {mission.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Progress Bar (if in progress) */}
          {mission.status === 'in_progress' && mission.progress !== undefined && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{mission.progress}/{mission.maxProgress}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          {/* Time Remaining */}
          {mission.timeRemaining && mission.timeRemaining > 0 && (
            <div className="flex items-center space-x-1 text-xs text-orange-500">
              <Clock className="w-3 h-3" />
              <span>{Math.ceil(mission.timeRemaining / 60000)}m left</span>
            </div>
          )}

          {/* Rewards */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 text-game-xp">
                <Star className="w-3 h-3" />
                <span>{mission.xpReward} XP</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500">
                <Coins className="w-3 h-3" />
                <span>{mission.coinReward}</span>
              </div>
            </div>
            
            {compact && (
              <Badge className={`${getDifficultyColor(mission.difficulty)} text-white text-xs`}>
                {mission.difficulty[0].toUpperCase()}
              </Badge>
            )}
          </div>

          {/* Action Button */}
          {!compact && getActionButton()}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MissionCard;