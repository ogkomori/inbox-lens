import GeometricBackground from "@/components/GeometricBackground";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DashboardNavigation from "@/components/DashboardNavigation";
import React, { useEffect, useState, createContext, useContext } from "react";

import { useAuth } from "@/context/AuthContext";

// Custom hook for Gmail access status
function useGmailAccessStatus(loggedIn: boolean | null) {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const prevLoggedIn = React.useRef<boolean | null>(null);
  useEffect(() => {
    if (loggedIn && prevLoggedIn.current !== true) {
      fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/gmail/inbox-access-granted`, { credentials: "include" })
        .then(res => res.text())
        .then(text => setAccessGranted(text.trim() === "true"))
        .catch(() => setAccessGranted(false));
    } else if (!loggedIn) {
      setAccessGranted(null);
    }
    prevLoggedIn.current = loggedIn;
  }, [loggedIn]);
  return { accessGranted, setAccessGranted };
}

// Context for Gmail inbox access
const GmailAccessContext = createContext<{ accessGranted: boolean | null; setAccessGranted: (v: boolean) => void } | undefined>(undefined);

export const useGmailAccess = () => {
  const ctx = useContext(GmailAccessContext);
  if (!ctx) throw new Error("useGmailAccess must be used within GmailAccessProvider");
  return ctx;
};

export const GmailAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loggedIn } = useAuth();
  const { accessGranted, setAccessGranted } = useGmailAccessStatus(loggedIn);
  return (
    <GmailAccessContext.Provider value={{ accessGranted, setAccessGranted }}>
      {children}
    </GmailAccessContext.Provider>
  );
};

const tiles = [
  {
    label: "Applications",
    href: "/applications",
    description: "and other trackable stuff..."
  },
  {
    label: "Daily Email Summary",
    href: "/email-summary",
    description: "Manage your daily AI-generated email summary. (coming soon)"
  },
  {
    label: "To-Do list",
    href: "/todo",
    description: "Track and manage your tasks. (coming soon)"
  }
];


const Dashboard = () => {
  const { user } = useAuth();
  const { accessGranted } = useGmailAccess();
  const { loggedIn } = useAuth();

  const handleConnectGmail = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/gmail/auth-url`;
  };

  // Remove redirect logic from Dashboard, now handled by ProtectedRoute

  // Adjust this value to match the height of your MAIN navigation bar (e.g., 64 for 4rem)
  const mainNavHeight = 64;
  if (loggedIn === null || accessGranted === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mb-4" aria-label="Loading dashboard"></div>
        <div className="text-lg text-muted-foreground poppins-regular">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-background to-secondary/30">
      <GeometricBackground topOffset={mainNavHeight} />
      <DashboardNavigation user={user ?? { name: "", avatar: "", email: "" }} />
      <main className="container mx-auto px-4 pt-24 relative z-10">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          Welcome back{user && user.name ? `, ${user.name}!` : "!"}
        </h1>
        <div className="text-lg text-muted-foreground mb-6 poppins-regular">What feature would you like to explore today?</div>
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {tiles.map((tile) => (
            <a
              key={tile.label}
              href={tile.href}
              className="group"
            >
              <Card className="text-center cursor-pointer transition-transform group-hover:scale-105 group-hover:shadow-lg">
                <CardContent className="p-8">
                  <CardTitle className="mb-2 text-2xl text-primary group-hover:underline">{tile.label}</CardTitle>
                  <div className="text-muted-foreground text-base">{tile.description}</div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
        {/* Latest Updates or Connect Gmail section */}
        {loggedIn && accessGranted ? (
          <div className="bg-background/80 rounded-xl shadow p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">Latest Updates</h2>
            <div className="text-muted-foreground text-lg">No new updates.</div>
          </div>
        ) : (
          <div className="bg-background/80 rounded-xl shadow p-8 flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4 text-primary">Connect your Gmail Inbox</h2>
            <button
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition"
              onClick={handleConnectGmail}
              aria-label="Connect to Gmail Inbox"
            >
              Connect to Gmail Inbox
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;