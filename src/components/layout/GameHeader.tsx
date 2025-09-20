import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useGame } from '@/contexts/GameContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import XPBar from '@/components/game/XPBar';
import { toast } from '@/hooks/use-toast';

const GameHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { gameState, markNotificationRead, clearAllNotifications } = useGame();
  const { ageGroup } = useTheme();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadNotifications = gameState.notifications.filter(n => !n.read);
  const recentNotifications = gameState.notifications.slice(0, 10);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markNotificationRead(notification.id);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'level_up':
        navigate('/profile');
        break;
      case 'achievement':
        navigate('/profile');
        break;
      case 'mission_complete':
        navigate('/missions');
        break;
      default:
        break;
    }
    
    setShowNotifications(false);
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'level_up': return '🎉';
      case 'achievement': return '🏆';
      case 'xp_gained': return '⭐';
      case 'mission_complete': return '✅';
      case 'streak_bonus': return '🔥';
      default: return '📢';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!user) return null;

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        {/* Sidebar Toggle */}
        <SidebarTrigger className="mr-4" />

        {/* Logo/Title */}
        <div className={`flex items-center space-x-3 ${getAgeGroupClasses()}`}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
          >
            {ageGroup === 'kids' && <span className="text-2xl">🎮</span>}
            {ageGroup === 'teen' && <span className="text-2xl">⚡</span>}
            {ageGroup === 'young-adult' && <span className="text-2xl">🎯</span>}
          </motion.div>
          <h1 className="font-bold text-lg hidden sm:block">
            {ageGroup === 'kids' && 'Adventure Quest'}
            {ageGroup === 'teen' && 'NEON ARENA'}
            {ageGroup === 'young-adult' && 'ELITE.SYSTEM'}
          </h1>
        </div>

        {/* XP Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <XPBar size="sm" showNumbers={false} />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* Notifications */}
          <Sheet open={showNotifications} onOpenChange={setShowNotifications}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                {unreadNotifications.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                    {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Notifications</SheetTitle>
                <SheetDescription>
                  Your latest game updates and achievements
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-4">
                {/* Clear All Button */}
                {unreadNotifications.length > 0 && (
                  <Button
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => {
                      clearAllNotifications();
                      toast({ title: "All notifications marked as read" });
                    }}
                  >
                    Mark All as Read
                  </Button>
                )}

                {/* Notifications List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <AnimatePresence>
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            notification.read 
                              ? 'bg-muted/50 border-border' 
                              : 'bg-card border-primary/20 shadow-sm'
                          }`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-lg">
                              {getNotificationIcon(notification.type)}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {notification.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatTimeAgo(notification.timestamp)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-3 h-3 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No notifications yet</p>
                        <p className="text-xs">Complete missions to earn rewards!</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm">
                  {user.avatarUrl || '🎮'}
                </div>
                <span className="hidden sm:inline font-medium">
                  {user.username}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2 border-b border-border">
                <p className="font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">
                  Level {user.level} • {user.xp.toLocaleString()} XP
                </p>
              </div>
              
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile XP Bar */}
      <div className="md:hidden px-4 pb-3">
        <XPBar size="sm" showLevel={false} showNumbers={true} />
      </div>
    </header>
  );
};

export default GameHeader;