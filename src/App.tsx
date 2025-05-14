import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Leaderboards from "./pages/Leaderboards";
import Dashboard from "./pages/admin/Dashboard";
import Projects from "./pages/admin/Projects";
import ProjectDetail from "./pages/admin/ProjectDetail";
import Settings from "./pages/admin/Settings";
import Quests from "./pages/admin/Quests";
import Roadmaps from "./pages/admin/Roadmaps";
import Budgets from "./pages/admin/Budgets";
import Team from "./pages/admin/Team";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import HelpCenter from "./pages/HelpCenter";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Profile from "./pages/Profile";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { initializeAuthTracking, isAuthenticated, setupExpiryChecker } from "./utils/authUtils";

const queryClient = new QueryClient();

// Simple auth guard component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated with the improved auth utility
    setUserAuthenticated(isAuthenticated());
    setAuthChecked(true);
  }, []);

  if (!authChecked) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!userAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  // Initialize authentication tracking when app loads
  useEffect(() => {
    initializeAuthTracking();
    const intervalId = setupExpiryChecker();
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/leaderboards" element={<Leaderboards />} />

                {/* Protected admin routes */}
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/projects" 
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/projects/:projectId" 
                  element={
                    <ProtectedRoute>
                      <ProjectDetail />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/quests" 
                  element={
                    <ProtectedRoute>
                      <Quests />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/roadmaps" 
                  element={
                    <ProtectedRoute>
                      <Roadmaps />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/budgets" 
                  element={
                    <ProtectedRoute>
                      <Budgets />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/team" 
                  element={
                    <ProtectedRoute>
                      <Team />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/leaderboards" 
                  element={
                    <ProtectedRoute>
                      <Leaderboards />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Redirect /admin to dashboard */}
                <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />

                {/* Protected profile route */}
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Routes>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
