import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

type User = {
  name: string;
  email: string;
  avatar: string;
};

const DashboardNavigation = ({ user }: { user: User }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  // removed refreshUser, not needed
  const { loggedIn, authFetch } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <button
          className="flex items-center gap-2 font-bold text-2xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent focus:outline-none"
          onClick={() => navigate("/")}
          aria-label="Go to homepage"
        >
          <img src="/favicon.ico" alt="InboxLens logo" className="h-7 w-7" />
          InboxLens
        </button>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {loggedIn && (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 focus:outline-none"
                onClick={() => setOpen((v) => !v)}
                aria-label="Open profile menu"
                type="button"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="h-8 w-8 rounded-full" />
                ) : (
                  <FaUserCircle className="h-8 w-8 text-primary" />
                )}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  <a
                    href="/dashboard"
                    className={`block px-4 py-2 text-foreground hover:bg-secondary transition-colors ${location.pathname === '/dashboard' ? 'bg-secondary font-bold' : ''}`}
                  >
                    Dashboard
                  </a>
                  <a
                    href="/settings"
                    className={`block px-4 py-2 text-foreground hover:bg-secondary transition-colors ${location.pathname === '/settings' ? 'bg-secondary font-bold' : ''}`}
                  >
                    Settings
                  </a>
                  <button
                    className="block w-full text-left px-4 py-2 text-foreground hover:bg-secondary transition-colors"
                    onClick={() => {
                      authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/auth/logout`, { method: "POST" })
                        .then(() => {
                          localStorage.clear();
                          window.location.href = "/";
                        });
                    }}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavigation;