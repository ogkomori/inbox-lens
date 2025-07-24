import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface UserContextType {
  user: User | null;
  refreshUser: () => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  refreshUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });

  const fetchUser = () => {
    fetch("http://localhost:8080/api/profile/me", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setUser({ name: data.name, email: data.email, avatar: data.avatar ?? "" });
        sessionStorage.setItem("userInfo", JSON.stringify({ name: data.name, email: data.email, avatar: data.avatar ?? "" }));
      })
      .catch(() => setUser({ name: "", email: "", avatar: "" }));
  };

  useEffect(() => {
    if (!user) fetchUser();
    // eslint-disable-next-line
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
