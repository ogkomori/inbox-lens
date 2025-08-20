
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard, { GmailAccessProvider } from "@/components/Dashboard";
import Settings from "@/components/Settings";
import PreferredTime from "@/components/PreferredTime";
import Applications from "./pages/Applications";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import ContactModal from "@/components/ContactModal";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import React from "react";


const queryClient = new QueryClient();

const App: React.FC = () => {
  const [contactOpen, setContactOpen] = React.useState(false);
  const handleContactClick = () => setContactOpen(true);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <GmailAccessProvider>
              <BrowserRouter>
                <Navigation onContactClick={handleContactClick} />
                <div className="flex flex-col min-h-screen pt-16">{/* pt-16 for nav height */}
                  <div className="flex-1 flex flex-col">
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                      <Route path="/preferred-time" element={<PreferredTime />} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                      <Route path="/applications" element={<ProtectedRoute><Applications /></ProtectedRoute>} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <Footer onContactClick={handleContactClick} />
                </div>
                <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
              </BrowserRouter>
            </GmailAccessProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
