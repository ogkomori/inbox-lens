import GeometricBackground from "@/components/GeometricBackground";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DashboardNavigation from "@/components/DashboardNavigation";
import React, { useEffect, useState, createContext, useContext } from "react";

import { useAuth } from "@/context/AuthContext";

// Custom hook for Gmail access status
function useGmailAccessStatus(loggedIn: boolean | null) {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const prevLoggedIn = React.useRef<boolean | null>(null);
  const { authFetch } = useAuth();
  useEffect(() => {
    if (loggedIn && prevLoggedIn.current !== true) {
      authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/gmail/inbox-access-granted`)
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
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { authFetch } = useAuth();
  const handleGetLastMessage = async () => {
    setLoadingMessage(true);
    setErrorMessage(null);
    setLastMessage(null);
    try {
      const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/gmail/get-last-message`);
      if (!res.ok) throw new Error("Failed to fetch message");
      const text = await res.text();
      setLastMessage(text);
    } catch (err: any) {
      setErrorMessage(err.message || "Unknown error");
    } finally {
      setLoadingMessage(false);
    }
  };

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
          <div className="bg-background/80 rounded-xl shadow p-8 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-primary">Latest Updates</h2>
            <div className="text-muted-foreground text-lg mb-4">No new updates.</div>
            {/* Only show the button if Gmail is connected */}
            <button
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/80 transition mb-4 flex items-center justify-center"
              onClick={handleGetLastMessage}
              disabled={loadingMessage}
              aria-label="Get Last Gmail Message"
            >
              {loadingMessage ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid mr-2"></span>
                  Loading...
                </span>
              ) : (
                "Get Last Gmail Message"
              )}
            </button>
            {errorMessage && (
              <div className="text-red-500 mb-2">{errorMessage}</div>
            )}
            {loadingMessage && (
              <div className="flex items-center justify-center my-2">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-primary border-solid mr-2"></div>
                <span className="text-muted-foreground">Fetching message...</span>
              </div>
            )}
            {lastMessage && !loadingMessage && (
              <div className="w-full bg-secondary/30 rounded-lg p-4 mt-2 text-left shadow-inner">
                <span className="font-semibold">Response:</span>
                <div className="whitespace-pre-line mt-1 text-sm text-muted-foreground">{lastMessage}</div>
              </div>
            )}
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