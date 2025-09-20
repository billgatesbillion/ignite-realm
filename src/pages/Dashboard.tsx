import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { useTheme, useAgeAppropriateText } from '@/contexts/ThemeContext';
import { missionApi, leaderboardApi } from '@/lib/api';
import XPBar from '@/components/game/XPBar';
import MissionCard, { Mission } from '@/components/game/MissionCard';
import { 
  Target, 
  Trophy, 
  Coins, 
  Calendar, 
  Timer, 
  Star,
  TrendingUp,
  Users,
  PlayCircle,
  BookOpen
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { gameState, addXP, addCoins } = useGame();
  const { ageGroup } = useTheme();
  const { getWelcomeMessage } = useAgeAppropriateText();
  const navigate = useNavigate();

  const [missions, setMissions] = useState<Mission[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyProgress, setDailyProgress] = useState(60); // Mock daily progress

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load missions and leaderboard data
        const [missionsResponse, leaderboardResponse] = await Promise.all([
          missionApi.getMissions(),
          leaderboardApi.getLeaderboard('weekly')
        ]);

        setMissions(missionsResponse.data.slice(0, 6)); // Show only first 6 missions
        setLeaderboardData(leaderboardResponse.data.slice(0, 5)); // Top 5 players
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        toast({
          title: "Loading failed",
          description: "Some dashboard data couldn't be loaded. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleMissionStart = async (missionId: string) => {
    try {
      await missionApi.startMission(missionId);
      navigate(`/missions/${missionId}`);
    } catch (error) {
      toast({
        title: "Failed to start mission",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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

  const getAgeGroupEmoji = () => {
    switch (ageGroup) {
      case 'kids': return '🌈';
      case 'teen': return '🔥';
      case 'young-adult': return '⚡';
      default: return '🎮';
    }
  };

  const activeMissions = missions.filter(m => m.status === 'active' || m.status === 'in_progress');
  const completedMissions = missions.filter(m => m.status === 'completed');
  const userRank = leaderboardData.findIndex(p => p.id === user?.id) + 1;

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-background p-6 ${getAgeGroupClasses()}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold flex items-center justify-center space-x-3">
            <span>{getGreeting()}, {user.username}!</span>
            <span className="text-4xl">{getAgeGroupEmoji()}</span>
          </h1>
          <p className="text-muted-foreground">
            {getWelcomeMessage()}
          </p>
        </motion.div>

        {/* XP Progress Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-primary">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <XPBar size="lg" showLevel showNumbers animated />
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Coins className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{user.coins}</p>
                    <p className="text-xs text-muted-foreground">Coins Earned</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-orange-500/10 rounded-full">
                    <Timer className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{user.streak}</p>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-green-500/10 rounded-full">
                    <Target className="w-6 h-6 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{completedMissions.length}</p>
                    <p className="text-xs text-muted-foreground">Missions Done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-500/10 rounded-full">
                    <Trophy className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">#{userRank || '-'}</p>
                    <p className="text-xs text-muted-foreground">Global Rank</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Missions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Daily Progress */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Daily Challenge Progress</span>
                  </CardTitle>
                  <CardDescription>
                    Complete daily challenges to earn bonus rewards!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{dailyProgress}% Complete</span>
                    </div>
                    <Progress value={dailyProgress} className="h-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        {Math.floor(dailyProgress/20)} of 5 tasks completed
                      </span>
                      {dailyProgress >= 100 && (
                        <Badge className="bg-green-500">
                          +100 Bonus XP Available!
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Active Missions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="w-5 h-5" />
                      <span>Active Missions</span>
                    </CardTitle>
                    <CardDescription>
                      Continue your adventure with these missions
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/missions')}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
                      ))}
                    </div>
                  ) : activeMissions.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeMissions.slice(0, 4).map((mission) => (
                        <MissionCard
                          key={mission.id}
                          mission={mission}
                          onStart={handleMissionStart}
                          onContinue={handleMissionStart}
                          compact
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No active missions</p>
                      <Button 
                        className="mt-3"
                        onClick={() => navigate('/missions')}
                      >
                        Explore Missions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Leaderboard & Quick Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full btn-game"
                    onClick={() => navigate('/quizzes')}
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Take a Quiz
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/missions')}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Mission
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/shop')}
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    Visit Shop
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5" />
                      <span>Leaderboard</span>
                    </CardTitle>
                    <CardDescription>Weekly rankings</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/leaderboard')}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaderboardData.slice(0, 5).map((player, index) => (
                      <motion.div
                        key={player.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`flex items-center space-x-3 p-2 rounded-lg ${
                          player.id === user.id ? 'bg-primary/10 border border-primary/20' : ''
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-muted'
                        }`}>
                          {index === 0 ? '👑' : index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{player.username}</p>
                          <p className="text-xs text-muted-foreground">
                            {player.xp.toLocaleString()} XP
                          </p>
                        </div>
                        <div className="text-lg">
                          {player.avatarUrl}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {gameState.notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="flex items-start space-x-3 text-sm">
                        <span className="text-lg">
                          {notification.type === 'level_up' && '🎉'}
                          {notification.type === 'achievement' && '🏆'}
                          {notification.type === 'xp_gained' && '⭐'}
                          {notification.type === 'mission_complete' && '✅'}
                        </span>
                        <div className="flex-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(notification.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {gameState.notifications.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-4">
                        Complete missions to see your activity here!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;