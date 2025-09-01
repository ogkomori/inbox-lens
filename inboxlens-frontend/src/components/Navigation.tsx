import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { FaChrome } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

interface NavigationProps {
  onContactClick?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onContactClick }) => {
  const { loggedIn, authFetch } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          <img src="/favicon.ico" alt="InboxLens logo" className="h-7 w-7" />
          InboxLens
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/' ? 'font-bold underline' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="text-foreground hover:text-primary transition-colors"
          >
            About
          </button>
          <button 
            onClick={onContactClick}
            className={`text-foreground hover:text-primary transition-colors ${location.pathname === '/contact' ? 'font-bold underline' : ''}`}
            type="button"
          >
            Contact
          </button>
          <ThemeToggle />
          {loggedIn === null ? null : loggedIn ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="Open profile menu"
              >
                {/* Replace with user profile image if available */}
                <FaUserCircle className="h-8 w-8 text-primary" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-card rounded shadow-lg z-50 flex flex-col">
                  <a href="/dashboard" className={`px-4 py-2 hover:bg-muted text-left ${location.pathname === '/dashboard' ? 'font-bold underline' : ''}`}>Dashboard</a>
                  <a href="/settings" className={`px-4 py-2 hover:bg-muted text-left ${location.pathname === '/settings' ? 'font-bold underline' : ''}`}>Settings</a>
                  <button
                    className="px-4 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/logout`, { method: "POST" })
                        .then(() => {
                          window.location.href = "/";
                        });
                    }}
                  >Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="google"
              className="gap-2"
              onClick={() => {
                window.location.href = "https://auth.inboxlens.app/oauth2/start?rd=/api/auth/login";
              }}
            >
              <FaChrome className="h-4 w-4" />
              Sign in with Google
            </Button>
          )}
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          {loggedIn === null ? null : loggedIn ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setDropdownOpen((open) => !open)}
                aria-label="Open profile menu"
              >
                <FaUserCircle className="h-7 w-7 text-primary" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-card rounded shadow-lg z-50 flex flex-col">
                  <a href="/dashboard" className="px-4 py-2 hover:bg-muted text-left">Dashboard</a>
                  <a href="/settings" className="px-4 py-2 hover:bg-muted text-left">Settings</a>
                  <button
                    className="px-4 py-2 text-left hover:bg-muted"
                    onClick={() => {
                      authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/logout`, { method: "POST" })
                        .then(() => {
                          window.location.href = "/";
                        });
                    }}
                  >Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="google"
              size="sm"
              className="gap-2"
              onClick={() => {
                window.location.href = "https://auth.inboxlens.app/oauth2/start?rd=/api/auth/login";
              }}
            >
              <FaChrome className="h-4 w-4" />
              Google
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;