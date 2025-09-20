import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '@/lib/api';
import socketManager from '@/lib/socket';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  username: string;
  ageGroup: 'kids' | 'teen' | 'young-adult';
  xp: number;
  level: number;
  coins: number;
  avatarUrl: string;
  streak: number;
  createdAt?: string;
  lastLoginAt?: string;
  preferences?: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    notifications: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Silent auth check on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getProfile();
        setUser(response.data);
        
        // Connect socket with auth token
        socketManager.connect(token);
        
        toast({
          title: "Welcome back!",
          description: `Good to see you again, ${response.data.username}!`,
        });
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setLoading(true);
      const response = await authApi.login(credentials);
      const { user: userData, token } = response.data;
      
      setUser(userData);
      localStorage.setItem('authToken', token);
      
      // Connect socket
      socketManager.connect(token);
      
      toast({
        title: "Login successful!",
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: any) => {
    try {
      setLoading(true);
      const response = await authApi.signup(userData);
      const { user: newUser, token } = response.data;
      
      setUser(newUser);
      localStorage.setItem('authToken', token);
      
      // Connect socket
      socketManager.connect(token);
      
      toast({
        title: "Welcome to the game!",
        description: `Account created successfully! Welcome, ${newUser.username}!`,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Signup failed';
      toast({
        title: "Signup failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      socketManager.disconnect();
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const response = await authApi.updateProfile(data);
      setUser(response.data);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authApi.getProfile();
      setUser(response.data);
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};