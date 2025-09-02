import { usePageTitle } from "@/hooks/usePageTitle";

import ContactModal from "@/components/ContactModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";


const NotFound = () => {
  usePageTitle();
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative">
      <main className="flex flex-col items-center justify-center flex-1 relative z-10 px-4">
        <div className="text-center bg-black/80 rounded-xl shadow p-8">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-primary poppins-bold">404</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 poppins-regular">Oops! Page not found</p>
          <Button asChild size="lg" className="px-8 py-4">
            <a href="/">Return to Home</a>
          </Button>
        </div>
      </main>
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
};

export default NotFound;
