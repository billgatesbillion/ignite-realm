import axios from 'axios';

// TODO: This API layer needs to be mapped to actual backend endpoints
// Update these endpoints based on your backend routes discovery

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const MOCK_API = import.meta.env.VITE_MOCK_API === 'true';

// Configure axios defaults
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // For cookie-based auth
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for development
const mockUsers = new Map();
const mockMissions = new Map();
const mockLeaderboard = new Map();
let currentUser = null;

// Generate mock data
const generateMockMissions = () => [
  {
    id: '1',
    title: 'Math Challenge',
    description: 'Solve 10 algebra problems',
    xpReward: 100,
    coinReward: 20,
    difficulty: 'medium',
    ageGroup: 'teen',
    status: 'active',
    progress: 3,
    maxProgress: 10,
    timeLimit: 1800000, // 30 minutes
    image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    title: 'Science Explorer',
    description: 'Complete chemistry lab simulation',
    xpReward: 150,
    coinReward: 30,
    difficulty: 'hard',
    ageGroup: 'teen',
    status: 'locked',
    progress: 0,
    maxProgress: 5,
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    title: 'Creative Writing',
    description: 'Write a short story (200 words)',
    xpReward: 75,
    coinReward: 15,
    difficulty: 'easy',
    ageGroup: 'teen',
    status: 'completed',
    progress: 1,
    maxProgress: 1,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'
  }
];

const generateMockLeaderboard = () => [
  { id: '1', username: 'GameMaster', xp: 2500, level: 8, rank: 1, avatarUrl: '🎮' },
  { id: '2', username: 'QuizWhiz', xp: 2100, level: 7, rank: 2, avatarUrl: '🧠' },
  { id: '3', username: 'MissionHero', xp: 1800, level: 6, rank: 3, avatarUrl: '🦸' },
  { id: '4', username: 'StudyPro', xp: 1500, level: 5, rank: 4, avatarUrl: '📚' },
  { id: '5', username: 'CodeNinja', xp: 1200, level: 4, rank: 5, avatarUrl: '👨‍💻' }
];

// Mock API functions
const mockApi = {
  // Auth endpoints
  login: async (credentials: { email: string; password: string }) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = {
      id: '1',
      email: credentials.email,
      username: 'TestUser',
      ageGroup: 'teen',
      xp: 750,
      level: 3,
      coins: 150,
      avatarUrl: '🎯',
      streak: 5
    };
    currentUser = user;
    localStorage.setItem('authToken', 'mock-jwt-token');
    return { data: { user, token: 'mock-jwt-token' } };
  },

  signup: async (userData: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const user = {
      id: Date.now().toString(),
      ...userData,
      xp: 0,
      level: 1,
      coins: 50,
      streak: 0
    };
    currentUser = user;
    localStorage.setItem('authToken', 'mock-jwt-token');
    return { data: { user, token: 'mock-jwt-token' } };
  },

  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    currentUser = null;
    localStorage.removeItem('authToken');
    return { data: { success: true } };
  },

  getProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (!currentUser) throw new Error('Not authenticated');
    return { data: currentUser };
  },

  // Mission endpoints
  getMissions: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { data: generateMockMissions() };
  },

  startMission: async (missionId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: { success: true, startedAt: new Date().toISOString() } };
  },

  submitMission: async (missionId: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const xpGained = Math.floor(Math.random() * 100) + 50;
    const coinsGained = Math.floor(xpGained / 5);
    return { data: { success: true, xpGained, coinsGained } };
  },

  // Quiz endpoints
  getQuiz: async (quizId: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      data: {
        id: quizId,
        title: 'Math Challenge Quiz',
        questions: [
          {
            id: '1',
            question: 'What is 15 + 27?',
            options: ['40', '42', '44', '46'],
            correctAnswer: 1,
            timeLimit: 30000
          },
          {
            id: '2',
            question: 'Solve: 3x + 5 = 14',
            options: ['x = 2', 'x = 3', 'x = 4', 'x = 5'],
            correctAnswer: 1,
            timeLimit: 45000
          }
        ]
      }
    };
  },

  submitQuiz: async (quizId: string, answers: number[]) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const correctAnswers = answers.filter((answer, index) => answer === [1, 1][index]).length;
    const score = Math.round((correctAnswers / 2) * 100);
    const xpGained = score * 2;
    return { data: { score, correctAnswers, totalQuestions: 2, xpGained } };
  },

  // Leaderboard endpoints
  getLeaderboard: async (timeframe = 'weekly') => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return { data: generateMockLeaderboard() };
  },

  // Achievement endpoints
  getAchievements: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [
        { id: '1', title: 'First Steps', description: 'Complete your first mission', unlocked: true, unlockedAt: '2024-01-15' },
        { id: '2', title: 'Quiz Master', description: 'Score 100% on a quiz', unlocked: false },
        { id: '3', title: 'Streak Champion', description: 'Maintain a 7-day streak', unlocked: false }
      ]
    };
  }
};

// Main API functions - will use mock or real API based on environment
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    MOCK_API ? mockApi.login(credentials) : api.post('/auth/login', credentials),
    
  signup: (userData: any) => 
    MOCK_API ? mockApi.signup(userData) : api.post('/auth/signup', userData),
    
  logout: () => 
    MOCK_API ? mockApi.logout() : api.post('/auth/logout'),
    
  getProfile: () => 
    MOCK_API ? mockApi.getProfile() : api.get('/user/profile'),
    
  updateProfile: (data: any) => 
    MOCK_API ? Promise.resolve({ data }) : api.put('/user/profile', data),
    
  refreshToken: () => 
    MOCK_API ? Promise.resolve({ data: { token: 'mock-jwt-token' } }) : api.post('/auth/refresh')
};

export const missionApi = {
  getMissions: () => 
    MOCK_API ? mockApi.getMissions() : api.get('/missions'),
    
  getMission: (id: string) => 
    MOCK_API ? Promise.resolve({ data: generateMockMissions().find(m => m.id === id) }) : api.get(`/missions/${id}`),
    
  startMission: (id: string) => 
    MOCK_API ? mockApi.startMission(id) : api.post(`/missions/${id}/start`),
    
  submitMission: (id: string, data: any) => 
    MOCK_API ? mockApi.submitMission(id, data) : api.post(`/missions/${id}/submit`, data)
};

export const quizApi = {
  getQuizzes: () => 
    MOCK_API ? Promise.resolve({ data: [] }) : api.get('/quizzes'),
    
  getQuiz: (id: string) => 
    MOCK_API ? mockApi.getQuiz(id) : api.get(`/quizzes/${id}`),
    
  submitQuiz: (id: string, answers: number[]) => 
    MOCK_API ? mockApi.submitQuiz(id, answers) : api.post(`/quizzes/${id}/submit`, { answers })
};

export const leaderboardApi = {
  getLeaderboard: (timeframe = 'weekly') => 
    MOCK_API ? mockApi.getLeaderboard(timeframe) : api.get(`/leaderboard?timeframe=${timeframe}`)
};

export const achievementApi = {
  getAchievements: () => 
    MOCK_API ? mockApi.getAchievements() : api.get('/achievements'),
    
  unlockAchievement: (id: string) => 
    MOCK_API ? Promise.resolve({ data: { success: true } }) : api.post(`/achievements/${id}/unlock`)
};

export default api;