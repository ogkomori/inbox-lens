// import Navigation from "@/components/Navigation";
// import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
// import ContactModal from "@/components/ContactModal";
import React from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";



const Index = () => {
  const navigate = useNavigate();
  usePageTitle();
  // const [contactOpen, setContactOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation, Footer, and ContactModal are now handled globally in App.tsx */}
      <HeroSection />
      <div className="flex flex-col flex-1">
        <AboutSection />
      </div>
    </div>
  );
};

export default Index;
