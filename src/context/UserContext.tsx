import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthdate: string;
  image?: string;
  role: string;
  createAt?: string;
  deletedAt?: string | null;
  updatedAt?: string | null;
}

interface UserContextType {
  currentUser: User | null;
  token: string | null;
  setCurrentUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  fetchAndSetUser: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetUser = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setCurrentUser(data.user);
      } else {
        console.error("Error al obtener el usuario:", data.message);
        setCurrentUser(null);
        localStorage.removeItem("token");
        setToken(null);
      }
    } catch (error) {
      console.error("Error en fetchAndSetUser:", error);
      setCurrentUser(null);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetUser();
  }, [token]);

  return (
    <UserContext.Provider
      value={{ currentUser, token, setCurrentUser, setToken, fetchAndSetUser, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
