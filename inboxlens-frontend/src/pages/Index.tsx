import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

const Index = ({ onContactClick }: { onContactClick: () => void }) => {
  usePageTitle();
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation onContactClick={onContactClick} />
      <HeroSection />
      <div className="flex flex-col flex-1">
        <AboutSection />
      </div>
      <Footer onContactClick={onContactClick} />
    </div>
  );
};

export default Index;
