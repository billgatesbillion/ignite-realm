import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { GameProvider } from "@/contexts/GameContext";
import GameSidebar from "@/components/layout/GameSidebar";
import GameHeader from "@/components/layout/GameHeader";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Game Layout Component
const GameLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <GameSidebar />
        <main className="flex-1">
          <GameHeader />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ThemeProvider>
          <GameProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <GameLayout>
                      <Dashboard />
                    </GameLayout>
                  </ProtectedRoute>
                } />
                
                {/* Placeholder protected routes */}
                <Route path="/missions" element={
                  <ProtectedRoute>
                    <GameLayout>
                      <div className="p-6"><h1 className="text-2xl font-bold">Missions Page - Coming Soon!</h1></div>
                    </GameLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/quizzes" element={
                  <ProtectedRoute>
                    <GameLayout>
                      <div className="p-6"><h1 className="text-2xl font-bold">Quizzes Page - Coming Soon!</h1></div>
                    </GameLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/leaderboard" element={
                  <ProtectedRoute>
                    <GameLayout>
                      <div className="p-6"><h1 className="text-2xl font-bold">Leaderboard Page - Coming Soon!</h1></div>
                    </GameLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <GameLayout>
                      <div className="p-6"><h1 className="text-2xl font-bold">Profile Page - Coming Soon!</h1></div>
                    </GameLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/shop" element={
                  <ProtectedRoute>
                    <GameLayout>
                      <div className="p-6"><h1 className="text-2xl font-bold">Shop Page - Coming Soon!</h1></div>
                    </GameLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <GameLayout>
                      <div className="p-6"><h1 className="text-2xl font-bold">Settings Page - Coming Soon!</h1></div>
                    </GameLayout>
                  </ProtectedRoute>
                } />

                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </GameProvider>
        </ThemeProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
