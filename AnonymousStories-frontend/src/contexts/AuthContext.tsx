import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function checkAuth() {
    try {
      const response = await api.get<User>("/users/me");
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

useEffect(() => {
  let ignore = false;

  async function runCheckAuth() {
    try {
      const response = await api.get<User>("/users/me");
      if (!ignore) setUser(response.data);
    } catch {
      if (!ignore) setUser(null);
    } finally {
      if (!ignore) setLoading(false);
    }
  }

  runCheckAuth();
  return () => {
    ignore = true;
  };
}, []);

  async function logout() {
    try {
      await api.post("/logout");
    } catch {
      // Ignora erro de rede durante o encerramento da sessão
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}