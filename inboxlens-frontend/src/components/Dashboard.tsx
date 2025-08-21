import Footer from "@/components/Footer";
import ContactModal from "@/components/ContactModal";
import GeometricBackground from "@/components/GeometricBackground";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import DashboardNavigation from "@/components/DashboardNavigation";
import React, { useEffect, useState, createContext, useContext } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

// Custom hook for Gmail access status and user info, stale-while-revalidate
function useGmailAccessStatus(loggedIn: boolean | null) {
  const [accessGranted, setAccessGranted] = useState<boolean | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { authFetch } = useAuth();
  useEffect(() => {
    if (!loggedIn) {
      setAccessGranted(null);
      setUserInfo(null);
      sessionStorage.removeItem('dashboardUserInfo');
      sessionStorage.removeItem('dashboardGmailAccess');
      return;
    }
    // Show cache immediately if available
    const cachedUser = sessionStorage.getItem('dashboardUserInfo');
    const cachedAccess = sessionStorage.getItem('dashboardGmailAccess');
    if (cachedUser && cachedAccess) {
      setUserInfo(JSON.parse(cachedUser));
      setAccessGranted(cachedAccess === 'true');
    }
    // Always revalidate in background
    Promise.all([
      authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/profile/me`).then(res => res.json()),
      authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/gmail/inbox-access-granted`).then(res => res.text())
    ]).then(([user, access]) => {
      setUserInfo(user);
      setAccessGranted(access.trim() === 'true');
      sessionStorage.setItem('dashboardUserInfo', JSON.stringify(user));
      sessionStorage.setItem('dashboardGmailAccess', access.trim() === 'true' ? 'true' : 'false');
    }).catch(() => {
      setUserInfo(null);
      setAccessGranted(false);
    });
  }, [loggedIn]);
  return { accessGranted, setAccessGranted, userInfo };
}

// Context for Gmail inbox access
type GmailAccessContextType = { accessGranted: boolean | null; setAccessGranted: (v: boolean) => void; userInfo: any };
const GmailAccessContext = createContext<GmailAccessContextType | undefined>(undefined);

export const useGmailAccess = (): GmailAccessContextType => {
  const ctx = useContext(GmailAccessContext);
  if (!ctx) throw new Error("useGmailAccess must be used within GmailAccessProvider");
  return ctx;
};

export const GmailAccessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loggedIn } = useAuth();
  const { accessGranted, setAccessGranted, userInfo } = useGmailAccessStatus(loggedIn);
  return (
    <GmailAccessContext.Provider value={{ accessGranted, setAccessGranted, userInfo }}>
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


const Dashboard = ({ onContactClick }: { onContactClick: () => void }) => {
  const { loggedIn, authFetch, refreshAuth } = useAuth();
  const location = useLocation();
  usePageTitle();

  // Show toast if preferredTime was just set
  useEffect(() => {
    if (location.state && location.state.preferredTime) {
      toast({
        title: "Preferred Time Set!",
        description: `Your preferred time is now set to ${location.state.preferredTime}.`,
        variant: "default"
      });
      // Remove state so it doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  const { accessGranted, userInfo } = useGmailAccess();

  // Strict login check: GET /me, if fails refresh, if refresh fails logout, if second /me fails logout
  const strictLoginCheck = async () => {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    let res = await fetch(`${baseUrl}/api/profile/me`, { credentials: "include" });
    let data = await res.json().catch(() => ({}));
    if (res.status === 401 || data.success === false) {
      // Try refresh
      const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, { method: "POST", credentials: "include" });
      if (refreshRes.status === 401) {
        // Logout
        await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
        return false;
      }
      // Try /me again
      res = await fetch(`${baseUrl}/api/profile/me`, { credentials: "include" });
      data = await res.json().catch(() => ({}));
      if (res.status === 401 || data.success === false) {
        await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
        return false;
      }
    }
    return true;
  };

  // For resource access (e.g. on mount or before rendering sensitive UI)
  // You can call strictLoginCheck() and redirect or show login if false

  // For sensitive actions: always refresh first, logout if fails
  const requireFreshLogin = async (action: () => void | Promise<void>, failMsg = "You must be logged in.") => {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, { method: "POST", credentials: "include" });
    if (refreshRes.status === 401) {
      await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
      alert(failMsg);
      return;
    }
    await action();
  };

  const handleConnectGmail = () => {
    requireFreshLogin(() => {
      window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/api/gmail/auth-url`;
    }, "You must be logged in to connect your Gmail inbox.");
  };

  // Remove redirect logic from Dashboard, now handled by ProtectedRoute

  // Adjust this value to match the height of your MAIN navigation bar (e.g., 64 for 4rem)
  const mainNavHeight = 64;
  const [summarizeStatus, setSummarizeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSummarize = () => {
    requireFreshLogin(async () => {
      setSummarizeStatus("loading");
      try {
        const res = await authFetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/gmail/summarize-emails`);
        if (res.status === 401) {
          setSummarizeStatus("error");
          return;
        }
        if (!res.ok) {
          setSummarizeStatus("error");
        } else {
          setSummarizeStatus("success");
        }
      } catch {
        setSummarizeStatus("error");
      }
    }, "You must be logged in to summarize.");
  };

  if (loggedIn === null || accessGranted === null || userInfo === null) {
    // Only show spinner, no nav or footer
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mb-4" aria-label="Loading dashboard"></div>
        <div className="text-lg text-muted-foreground poppins-regular">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-background to-secondary/30">
      <GeometricBackground topOffset={mainNavHeight} />
      <DashboardNavigation user={userInfo ?? { name: "", avatar: "", email: "" }} />
      <main className="container mx-auto px-4 pt-24 relative z-10 flex-1">
        <h1 className="text-4xl font-bold mb-2 text-foreground">
          Welcome back{userInfo && userInfo.name ? `, ${userInfo.name}!` : "!"}
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
              onClick={handleSummarize}
              disabled={summarizeStatus === "loading"}
              aria-label="Summarize"
            >
              {summarizeStatus === "loading" ? (
                <span className="flex items-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid mr-2"></span>
                  Summarizing...
                </span>
              ) : (
                "Summarize"
              )}
            </button>
            {summarizeStatus === "success" && (
              <div className="text-green-600 mb-2">Summarization Mail sent.</div>
            )}
            {summarizeStatus === "error" && (
              <div className="text-red-500 mb-2">error</div>
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
      <Footer onContactClick={onContactClick} />
    </div>
  );
};

export default Dashboard;