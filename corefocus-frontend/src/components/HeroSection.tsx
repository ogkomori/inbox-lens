import { Button } from "@/components/ui/button";
import GeometricBackground from "@/components/GeometricBackground";

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 relative">
      <GeometricBackground />
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-8xl md:text-10xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          CoreFocus
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Streamline your workflow and enhance productivity with our powerful web application. 
          CoreFocus helps you stay organized, focused, and achieve your goals efficiently.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4">
            Get Started
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-lg px-8 py-4"
          >
            <a href="#about">Learn More</a>
          </Button>
        </div>
      </div>
      
      {/* Section divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </section>
  );
};

export default HeroSection;