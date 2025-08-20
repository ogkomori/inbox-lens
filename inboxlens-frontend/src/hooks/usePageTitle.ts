import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLES: Record<string, string> = {
  "/": "InboxLens",
  "/dashboard": "Dashboard",
  "/applications": "Applications",
  "/settings": "Settings",
  "/preferred-time": "Preferred Time",
};

export function usePageTitle() {
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname;
    document.title = TITLES[path] || "InboxLens";
  }, [location.pathname]);
}
