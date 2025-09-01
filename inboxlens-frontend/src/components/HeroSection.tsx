

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const HeroSection = () => {
  const { loggedIn } = useAuth();

  // Adjust this value to match the height of your MAIN navigation bar (e.g., 64px for 4rem)
  const mainNavHeight = 64; // px
  // Use inline style to ensure the hero section fills the remaining viewport height below the navbar
  return (
  <section
    id="home"
    style={{ minHeight: `calc(100vh - ${mainNavHeight}px)`, marginTop: `${mainNavHeight}px` }}
    className="flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 relative"
  >
  {/* GeometricBackground is now rendered globally */}
    <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center justify-center h-full relative z-10 -mt-16 gap-12">
      {/* Left: Text and buttons */}
      <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left mb-12 lg:mb-0 lg:pl-8 relative">
        {/* Decorative dots aura */}
  <span className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 -translate-y-8 w-3 h-3 rounded-full bg-primary/70 shadow-lg animate-pulse" style={{zIndex:2}} />
  <span className="hidden md:block absolute left-0 top-1/3 -translate-x-4 w-2 h-2 rounded-full bg-primary-glow/60 shadow-md" style={{zIndex:2}} />
  <span className="hidden md:block absolute right-0 top-1/4 translate-x-4 w-2.5 h-2.5 rounded-full bg-primary/60 shadow-md" style={{zIndex:2}} />
  <span className="hidden md:block absolute left-1/4 bottom-0 -translate-y-4 w-1.5 h-1.5 rounded-full bg-primary/50 shadow" style={{zIndex:2}} />
  <span className="hidden md:block absolute right-1/3 bottom-1/4 translate-x-2 w-2 h-2 rounded-full bg-primary-glow/50 shadow" style={{zIndex:2}} />
  {/* Extra subtle dots for balance */}
  <span className="hidden md:block absolute left-1/3 top-1/6 -translate-x-2 -translate-y-2 w-1.5 h-1.5 rounded-full bg-primary/40 shadow-sm" style={{zIndex:2}} />
  <span className="hidden md:block absolute right-1/4 top-1/3 translate-x-2 -translate-y-1 w-1.5 h-1.5 rounded-full bg-primary-glow/40 shadow-sm" style={{zIndex:2}} />
  <span className="hidden md:block absolute left-1/2 bottom-1/5 -translate-x-1/2 translate-y-2 w-1.5 h-1.5 rounded-full bg-primary/30 shadow-sm" style={{zIndex:2}} />
        <h1 className="text-8xl md:text-10xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          InboxLens
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
          See your inbox at a glance. Get actionable digests and stay effortlessly organized.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full">
          {loggedIn === null ? null : loggedIn ? (
            <Button asChild variant="hero" size="lg" className="text-lg px-8 py-4">
              <a href="/dashboard">View Dashboard</a>
            </Button>
          ) : (
            <Button
              variant="hero"
              size="lg"
              className="text-lg px-8 py-4"
              onClick={() => {
                window.location.href = "https://auth.inboxlens.app/oauth2/start?rd=/api/auth/login";
              }}
            >
              Get Started
            </Button>
          )}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-4 bg-white text-black border border-gray-200 hover:bg-gray-100 hover:text-black hover:shadow-md dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-neutral-900 dark:hover:text-white transition-colors"
          >
            <a href="#about">Learn More</a>
          </Button>
        </div>
      </div>
      {/* Right: Image */}
      <div className="flex-1 flex items-center justify-center w-full max-w-xl lg:pr-8">
        <img src="/hero-inbox-lens.jpg" alt="InboxLens illustration" className="w-full h-auto max-h-[400px] object-contain rounded-2xl shadow-2xl" />
      </div>
    </div>
    {/* Section divider */}
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
  </section>
  );
};

export default HeroSection;