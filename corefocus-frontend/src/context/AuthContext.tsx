import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface AuthContextType {
  loggedIn: boolean | null;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  loggedIn: null,
  refreshAuth: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const fetchAuth = () => {
    fetch("http://localhost:8080/api/auth/status", { credentials: "include" })
      .then(res => res.json())
      .then(data => setLoggedIn(data.loggedIn === "true" || data.loggedIn === true))
      .catch(() => setLoggedIn(false));
  };

  useEffect(() => {
    fetchAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, refreshAuth: fetchAuth }}>
      {loggedIn === null ? null : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
