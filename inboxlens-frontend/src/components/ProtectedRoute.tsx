import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn === false) {
      // Redirect to homepage if not logged in
      navigate('/', { replace: true });
    }
  }, [loggedIn, navigate]);


  if (loggedIn === null) {
    // Show loading spinner while authentication status is being checked
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary border-solid mb-4" aria-label="Loading authentication status"></div>
        <div className="text-lg text-muted-foreground poppins-regular">Checking authentication...</div>
      </div>
    );
  }

  if (loggedIn === false) {
    // Redirect handled by useEffect, render nothing
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
