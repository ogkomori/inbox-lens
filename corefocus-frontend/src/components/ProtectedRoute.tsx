import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (loggedIn === false) {
      // Show feedback before redirect
      const timer = setTimeout(() => {
        window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/oauth2/authorization/google`;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [loggedIn]);

  if (loggedIn === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mb-4" aria-label="Loading authentication status"></div>
        <div className="text-lg text-muted-foreground poppins-regular">Checking authentication...</div>
      </div>
    );
  }

  if (loggedIn === false) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mb-4" aria-label="Redirecting to login"></div>
        <div className="text-lg text-muted-foreground poppins-regular">You must be logged in to access this page. Redirecting...</div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
