import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import {
  Home,
  Target,
  BookOpen,
  Trophy,
  User,
  ShoppingBag,
  Settings,
  Bell,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const navigationItems = [
  { title: 'Dashboard', url: '/', icon: Home },
  { title: 'Missions', url: '/missions', icon: Target },
  { title: 'Quizzes', url: '/quizzes', icon: BookOpen },
  { title: 'Leaderboard', url: '/leaderboard', icon: Trophy },
  { title: 'Profile', url: '/profile', icon: User },
  { title: 'Shop', url: '/shop', icon: ShoppingBag },
  { title: 'Settings', url: '/settings', icon: Settings },
];

const GameSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { ageGroup } = useTheme();
  const { user } = useAuth();
  const { gameState } = useGame();
  const location = useLocation();

  const collapsed = state === "collapsed";

  const getNavClasses = (isActive: boolean) => {
    const baseClasses = "flex items-center space-x-3 transition-all duration-200";
    if (isActive) {
      return `${baseClasses} bg-primary text-primary-foreground font-semibold`;
    }
    return `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-muted/50`;
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

  const unreadNotifications = gameState.notifications.filter(n => !n.read).length;

  return (
    <Sidebar className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <SidebarContent className={getAgeGroupClasses()}>
        {/* User Info Section */}
        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border-b border-border"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-lg">
                {user.avatarUrl || '🎮'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{user.username}</p>
                <p className="text-xs text-muted-foreground">
                  Level {user.level} • {user.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-3 flex justify-between text-xs">
              <div className="text-center">
                <div className="font-semibold text-game-xp">{user.coins}</div>
                <div className="text-muted-foreground">Coins</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-orange-500">{user.streak}</div>
                <div className="text-muted-foreground">Streak</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-500">{gameState.totalMissionsCompleted}</div>
                <div className="text-muted-foreground">Done</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Collapsed User Avatar */}
        {collapsed && user && (
          <div className="p-3 flex justify-center border-b border-border">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
              {user.avatarUrl || '🎮'}
            </div>
          </div>
        )}

        {/* Navigation */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-muted-foreground font-semibold">
              {ageGroup === 'kids' && 'Adventure Menu 🌈'}
              {ageGroup === 'teen' && 'Command Center ⚡'}
              {ageGroup === 'young-adult' && 'Navigation'}
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item, index) => {
                const isActive = location.pathname === item.url;
                const Icon = item.icon;
                
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) => getNavClasses(isActive)}
                        >
                          <div className="relative">
                            <Icon className="w-5 h-5" />
                            {item.title === 'Profile' && unreadNotifications > 0 && (
                              <Badge 
                                className="absolute -top-2 -right-2 w-4 h-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs"
                              >
                                {unreadNotifications > 9 ? '9+' : unreadNotifications}
                              </Badge>
                            )}
                          </div>
                          {!collapsed && (
                            <span className="truncate">{item.title}</span>
                          )}
                          {!collapsed && item.title === 'Shop' && ageGroup === 'kids' && (
                            <span className="text-xs">🛍️</span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Age Group Indicator */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="text-xs text-center text-muted-foreground">
              <div className="font-semibold">
                {ageGroup === 'kids' && '🌟 Friendly Mode'}
                {ageGroup === 'teen' && '⚡ Neon Mode'}
                {ageGroup === 'young-adult' && '🎯 Elite Mode'}
              </div>
              <div className="mt-1 text-xs opacity-70">
                Change in Settings
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default GameSidebar;