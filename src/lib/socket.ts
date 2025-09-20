import { io, Socket } from 'socket.io-client';

// TODO: Configure based on actual backend socket implementation
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001';
const MOCK_SOCKET = import.meta.env.VITE_MOCK_API === 'true';

class SocketManager {
  private socket: Socket | null = null;
  private mockInterval: NodeJS.Timeout | null = null;
  private eventListeners: Map<string, Function[]> = new Map();

  connect(token?: string) {
    if (MOCK_SOCKET) {
      this.setupMockSocket();
      return;
    }

    this.socket = io(SOCKET_URL, {
      auth: {
        token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Set up game-specific event listeners
    this.setupGameEvents();
  }

  private setupMockSocket() {
    console.log('Using mock socket for development');
    
    // Simulate periodic events
    this.mockInterval = setInterval(() => {
      // Mock leaderboard updates
      this.emit('leaderboard:update', {
        type: 'position_change',
        data: {
          userId: 'user123',
          newRank: Math.floor(Math.random() * 10) + 1,
          xpGained: Math.floor(Math.random() * 50) + 10
        }
      });

      // Occasional mock achievements
      if (Math.random() < 0.1) {
        this.emit('achievement:unlocked', {
          id: 'mock_achievement',
          title: 'Mock Achievement',
          description: 'You unlocked a mock achievement!',
          xpReward: 100
        });
      }

      // Mock mission updates
      if (Math.random() < 0.2) {
        this.emit('mission:update', {
          type: 'new_mission',
          mission: {
            id: `mock_${Date.now()}`,
            title: 'New Challenge Available!',
            xpReward: 75
          }
        });
      }
    }, 30000); // Every 30 seconds
  }

  private setupGameEvents() {
    if (!this.socket && !MOCK_SOCKET) return;

    // Leaderboard events
    this.on('leaderboard:update', (data) => {
      console.log('Leaderboard updated:', data);
    });

    // Achievement events
    this.on('achievement:unlocked', (data) => {
      console.log('Achievement unlocked:', data);
    });

    // Mission events
    this.on('mission:update', (data) => {
      console.log('Mission update:', data);
    });

    // Notification events
    this.on('notification:new', (data) => {
      console.log('New notification:', data);
    });

    // Real-time quiz events
    this.on('quiz:participant_joined', (data) => {
      console.log('Quiz participant joined:', data);
    });

    this.on('quiz:time_warning', (data) => {
      console.log('Quiz time warning:', data);
    });
  }

  on(event: string, callback: Function) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)?.push(callback);

    if (this.socket) {
      this.socket.on(event, callback as any);
    }
  }

  off(event: string, callback?: Function) {
    if (callback) {
      const listeners = this.eventListeners.get(event) || [];
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      
      if (this.socket) {
        this.socket.off(event, callback as any);
      }
    } else {
      this.eventListeners.delete(event);
      if (this.socket) {
        this.socket.off(event);
      }
    }
  }

  emit(event: string, data?: any) {
    // For mock mode, trigger local listeners
    if (MOCK_SOCKET) {
      const listeners = this.eventListeners.get(event) || [];
      listeners.forEach(callback => callback(data));
      return;
    }

    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  disconnect() {
    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }

    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }

    this.eventListeners.clear();
  }

  isConnected(): boolean {
    if (MOCK_SOCKET) return true;
    return this.socket?.connected || false;
  }

  // Game-specific methods
  joinLeaderboard(timeframe: string = 'weekly') {
    this.emit('leaderboard:join', { timeframe });
  }

  leaveLeaderboard() {
    this.emit('leaderboard:leave');
  }

  joinQuiz(quizId: string) {
    this.emit('quiz:join', { quizId });
  }

  leaveQuiz(quizId: string) {
    this.emit('quiz:leave', { quizId });
  }

  submitQuizAnswer(quizId: string, questionId: string, answer: number) {
    this.emit('quiz:answer', { quizId, questionId, answer });
  }
}

// Singleton instance
const socketManager = new SocketManager();

export default socketManager;

// Helper hooks for React components
export const useSocket = () => {
  return {
    connect: socketManager.connect.bind(socketManager),
    disconnect: socketManager.disconnect.bind(socketManager),
    on: socketManager.on.bind(socketManager),
    off: socketManager.off.bind(socketManager),
    emit: socketManager.emit.bind(socketManager),
    isConnected: socketManager.isConnected.bind(socketManager)
  };
};