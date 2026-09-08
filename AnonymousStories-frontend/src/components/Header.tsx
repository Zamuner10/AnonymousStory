import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SketchButton } from "./SketchUI";

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  if (loading) {
    return <div style={{ height: 32 }} />;
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {isAuthenticated ? (
        <>
          {/* Oculta a saudacao em telas menores que 640px para nao apertar o cabeçalho no celular */}
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: 16,
              color: "#7a5a2a",
              whiteSpace: "nowrap",
            }}
          >
            Olá, {user?.name}
          </span>
          <div style={{ minWidth: 70 }}>
            <SketchButton seed={91} variant="ghost" onClick={handleLogout}>
              Sair
            </SketchButton>
          </div>
        </>
      ) : (
        <div style={{ minWidth: 80 }}>
          <SketchButton seed={92} variant="primary" onClick={() => navigate("/login")}>
            Entrar
          </SketchButton>
        </div>
      )}
    </div>
  );
}