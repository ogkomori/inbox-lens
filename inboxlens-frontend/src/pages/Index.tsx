import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import { usePageTitle } from "@/hooks/usePageTitle";

interface IndexProps {
  onContactClick: () => void;
}

const Index: React.FC<IndexProps> = ({ onContactClick }) => {
  usePageTitle();
  return (
    <div className="min-h-screen flex flex-col relative">
      <HeroSection onContactClick={onContactClick} />
      <div className="flex flex-col flex-1">
        <AboutSection />
      </div>
    </div>
  );
};

export default Index;
