import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import GeometricBackground from "@/components/GeometricBackground";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  usePageTitle();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background relative">
      <GeometricBackground />
      <Navigation />
      <main className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
  <div className="text-center bg-black/80 rounded-xl shadow p-8">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-primary poppins-bold">404</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 poppins-regular">Oops! Page not found</p>
          <Button asChild size="lg" className="px-8 py-4">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
