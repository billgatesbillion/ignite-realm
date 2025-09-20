# 🎮 Gamified Learning Platform

A complete, production-ready React frontend for a gamified educational application with age-specific theming and interactive game mechanics.

## ✨ Features

### 🎯 Age-Specific Theming
- **8-12 years (Kids)**: Friendly, bright colors, large buttons, encouraging animations
- **12-15 years (Teen)**: Neon colors, dynamic effects, energetic UI
- **15-20 years (Young Adult)**: Sleek design, glassmorphism, professional look

### 🎮 Game Mechanics
- **XP System**: Animated progress bars, level progression
- **Missions**: Interactive mission cards with progress tracking
- **Achievements**: Unlockable badges with celebration animations
- **Leaderboards**: Real-time rankings and competition
- **Streak System**: Daily engagement rewards
- **Virtual Currency**: Coins system for shop purchases

### 🚀 Technical Features
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Socket.io integration ready
- **Mock API**: Complete development environment
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Lazy loading, code splitting ready
- **Animations**: Framer Motion integration

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Animations**: Framer Motion
- **State Management**: React Context + React Query
- **API**: Axios with mock development server
- **Real-time**: Socket.io client
- **Sound**: Howler.js (ready for audio integration)
- **Routing**: React Router v6

## 📦 Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_SOCKET_URL=http://localhost:3001

# Development Features
VITE_MOCK_API=true
VITE_ENABLE_DEBUG_PANEL=true

# Game Configuration
VITE_DEFAULT_AGE_GROUP=teen
VITE_ENABLE_SOUNDS=true
VITE_ENABLE_ANIMATIONS=true
```

## 🎨 Age Group Themes

### Kids Theme (8-12 years)
- **Colors**: Sun Yellow (#FFD166), Mint Green (#06D6A0), Ocean Blue (#118AB2)
- **Font**: Nunito (rounded, friendly)
- **Style**: Large buttons, rounded corners, playful animations
- **Messaging**: Encouraging, simple language

### Teen Theme (12-15 years)
- **Colors**: Neon Pink (#FF4D6D), Electric Blue (#4D8AFF), Purple (#7B61FF)
- **Font**: Orbitron (futuristic)
- **Style**: Dynamic animations, bold effects, badges
- **Messaging**: Energetic, achievement-focused

### Young Adult Theme (15-20 years)
- **Colors**: Neon Teal (#66FFCC), Violet (#7B61FF), Dark (#0B0F1A)
- **Font**: Inter (clean, modern)
- **Style**: Glassmorphism, subtle animations, detailed stats
- **Messaging**: Professional, data-driven

## 📱 Pages & Components

### Core Pages
- **Dashboard**: Overview, stats, quick actions
- **Login/Signup**: Age group selection, avatar picker
- **Missions**: Interactive mission browser
- **Quizzes**: Timed quiz system
- **Leaderboard**: Rankings and competition
- **Profile**: User stats, achievements
- **Shop**: Virtual currency store

### Key Components
- **XPBar**: Animated progress visualization
- **MissionCard**: Interactive mission display
- **GameSidebar**: Navigation with user stats
- **GameHeader**: Notifications, user menu
- **AgeGroupSelector**: Theme selection interface

## 🔌 API Integration

The app includes a complete mock API layer that can be easily mapped to your backend:

### Auth Endpoints
```typescript
// Login user
POST /auth/login { email, password }

// Register user  
POST /auth/signup { email, password, username, ageGroup, avatarUrl }

// Get user profile
GET /user/profile
```

### Game Endpoints
```typescript
// Get missions
GET /missions

// Start mission
POST /missions/:id/start

// Submit mission
POST /missions/:id/submit { data }

// Get leaderboard
GET /leaderboard?timeframe=weekly
```

### Socket Events
```typescript
// Real-time events
'leaderboard:update' - Live ranking changes
'achievement:unlocked' - Achievement notifications
'mission:update' - New missions available
'notification:new' - System notifications
```

## 🎯 Backend Integration

To connect to your actual backend:

1. **Update API endpoints** in `src/lib/api.ts`
2. **Configure authentication** in `src/contexts/AuthContext.tsx`
3. **Map data models** to match your backend schema
4. **Set up Socket.io** in `src/lib/socket.ts`
5. **Update environment variables** for production

### Backend Requirements Checklist
- [ ] User authentication (JWT or sessions)
- [ ] Mission CRUD operations
- [ ] XP/level calculation system
- [ ] Leaderboard rankings
- [ ] Achievement tracking
- [ ] Real-time notifications (optional)

## 🚀 Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist` folder to your hosting platform.

## 🎮 Demo Account

Use these credentials to test the application:
- **Email**: demo@example.com
- **Password**: demo123

## 🔍 Development Features

### Mock API
The app includes a complete mock API for development, allowing you to:
- Test all user flows without a backend
- Simulate real API responses
- Develop offline

### Debug Panel
Enable debug features with `VITE_ENABLE_DEBUG_PANEL=true`:
- Trigger XP gains
- Unlock achievements
- Spawn test missions
- View API responses

### Sound System
Ready for audio integration with Howler.js:
- Age-appropriate sound themes
- Mutable audio controls
- Achievement sound effects
- Background music support

## 📄 License

This project is built with Lovable and follows standard web development practices.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Ready to level up your learning experience!** 🚀