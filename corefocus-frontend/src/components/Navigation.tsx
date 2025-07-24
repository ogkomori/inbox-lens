import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { FaChrome } from "react-icons/fa";

const Navigation = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="font-bold text-2xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          CoreFocus
        </div>
        
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('home')}
            className="text-foreground hover:text-primary transition-colors"
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
            onClick={() => scrollToSection('contact')}
            className="text-foreground hover:text-primary transition-colors"
          >
            Contact
          </button>
          <ThemeToggle />
          <Button variant="google" className="gap-2">
            <FaChrome className="h-4 w-4" />
            <a href="http://localhost:8080/oauth2/authorization/google">Log in with Google</a>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Button variant="google" size="sm" className="gap-2">
            <FaChrome className="h-4 w-4" />
            Google
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;