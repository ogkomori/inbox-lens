import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import { usePageTitle } from "@/hooks/usePageTitle";

const Index = ({ onContactClick }: { onContactClick: () => void }) => {
  usePageTitle();
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <div className="flex flex-col flex-1">
        <AboutSection />
      </div>
    </div>
  );
};

export default Index;
