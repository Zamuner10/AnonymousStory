import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Background from "./Background";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-[#f7f3eb]">
        <Background fadeStrength="heavy" />
        <p className="relative z-10 font-['Caveat'] text-3xl text-[#1a1208]">
          Verificando autenticação...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}