import { Toaster } from "@/components/ui/toaster";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "@/components/Dashboard";
import { Preferences } from "./pages/Preferences";
import Settings from "@/components/Settings";
import TodoList from "./pages/TodoList";
import Trackables from "./pages/Trackables";
import Digests from "./pages/Digests";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ContactModal from "@/components/ContactModal";
import GeometricBackground from "@/components/GeometricBackground";
import Footer from "@/components/Footer";
import React from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import Navigation from "@/components/Navigation";
import DashboardNavigation from "@/components/DashboardNavigation";
import { useLocation } from "react-router-dom";


const queryClient = new QueryClient();

const AppContent: React.FC<{ handleContactClick: () => void; contactOpen: boolean; setContactOpen: (open: boolean) => void }> = ({ handleContactClick, contactOpen, setContactOpen }) => {
  const location = useLocation();
  const { loggedIn, user } = useAuth();
  // Determine which navbar to show
  const isHome = location.pathname === "/";
  const isPrivacyPolicy = location.pathname === "/privacy-policy";
  // Only Navigation or DashboardNavigation
  const showNavigation = isHome || isPrivacyPolicy;
  return (
    <div className="relative flex flex-col min-h-screen bg-background transition-colors">
      <GeometricBackground />
      {showNavigation ? (
        <Navigation onContactClick={handleContactClick} />
      ) : (
        <DashboardNavigation user={user ?? { name: "", email: "", avatar: "" }} />
      )}
      <div className="flex-1 flex flex-col relative z-10">
        <Routes>
          <Route path="/" element={<Index onContactClick={handleContactClick} />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/todo" element={<ProtectedRoute><TodoList /></ProtectedRoute>} />
          <Route path="/trackables" element={<ProtectedRoute><Trackables /></ProtectedRoute>} />
          <Route path="/digests" element={<ProtectedRoute><Digests /></ProtectedRoute>} />
          {/* <Route path="/preferred-time" element={<PreferredTime />} /> */}
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          {/* <Route path="/applications" element={<ProtectedRoute><Applications onContactClick={handleContactClick} /></ProtectedRoute>} /> */}
          <Route path="/preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {isHome ? <Footer /> : <Footer fixed />}
      <button
        className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground rounded-full shadow-lg p-4 hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}
        aria-label="Contact"
        onClick={handleContactClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 6.993V6.75" />
        </svg>
      </button>
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
};

const App: React.FC = () => {
  const [contactOpen, setContactOpen] = React.useState(false);
  const handleContactClick = () => setContactOpen(true);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
              <BrowserRouter>
                <AppContent handleContactClick={handleContactClick} contactOpen={contactOpen} setContactOpen={setContactOpen} />
              </BrowserRouter>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
