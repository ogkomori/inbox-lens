import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  loggedIn: boolean | null;
  user: User | null;
  authFetch: (input: RequestInfo, init?: RequestInit, retry?: boolean) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: null,
  user: null,
  authFetch: async () => { throw new Error("authFetch not initialized") },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const fetchAuth = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
      // Always start with GET /me
  let res = await fetch(`${baseUrl}/api/dashboard/me`, { credentials: "include" });
      let data = await res.json();

      if (res.status === 401 || data.success === false) {
        // If /me fails, try refresh
        const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });
        const refreshData = await refreshRes.json().catch(() => ({}));

        if (refreshRes.status === 401) {
          // Call logout endpoint to clear any server-side session/cookies
          try {
            await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
          } catch (e) {
            // Ignore errors from logout
          }
          setLoggedIn(false);
          setUser(null);
          sessionStorage.removeItem("dashboardUserInfo");
          return;
        }
        // If refresh succeeds, try /me again
  res = await fetch(`${baseUrl}/api/dashboard/me`, { credentials: "include" });
        data = await res.json();

        if (res.status === 401 || data.success === false) {
          setLoggedIn(false);
          setUser(null);
          sessionStorage.removeItem("dashboardUserInfo");
          return;
        }
      }
      // Only set loggedIn/user if /me succeeds (either first or after refresh)
      if (res.status === 401 || data.success === false) {
        // Only set to false if both attempts failed
        setLoggedIn(false);
        setUser(null);
        sessionStorage.removeItem("dashboardUserInfo");
      } else {
        setLoggedIn(true);
        const userObj = {
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || ""
        };
        setUser(userObj);
        sessionStorage.setItem("dashboardUserInfo", JSON.stringify(userObj));
      }
    } catch (err) {

      setLoggedIn(false);
      setUser(null);
      sessionStorage.removeItem("dashboardUserInfo");
      toast({
        title: "Authentication Error",
        description: "Could not verify your session. Please log in.",
        variant: "destructive"
      });
    }
  };

  // Utility: fetch with auto-refresh if needed
  const authFetch = async (input: RequestInfo, init?: RequestInit, retry = true): Promise<Response> => {
    const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    let res = await fetch(input, { ...init, credentials: "include" });
    if (res.status === 401 && retry) {
      // Try to refresh
      const refreshRes = await fetch(`${baseUrl}/api/auth/refresh`, { method: "POST", credentials: "include" });
      if (refreshRes.status === 401) {
        // Session expired, log out
        try {
          await fetch(`${baseUrl}/api/auth/logout`, { method: "POST", credentials: "include" });
        } catch {}
        setLoggedIn(false);
        setUser(null);
        sessionStorage.removeItem("dashboardUserInfo");
        toast({
          title: "Session Expired",
          description: "Please log in.",
          variant: "destructive"
        });
        return res;
      }
      // Retry original request once after refresh
      res = await fetch(input, { ...init, credentials: "include" });
    }
    return res;
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  return (
  <AuthContext.Provider value={{ loggedIn, user, authFetch }}>
      {loggedIn === null ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid" aria-label="Loading authentication status"></div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
