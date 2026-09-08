// src/components/Header.tsx
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
    return <div style={{ height: 44 }} />;
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {isAuthenticated ? (
        <>
          {/* Oculta a saudação em telas menores que 640px para não apertar o cabeçalho no celular */}
          <span
            className="hidden sm:inline"
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: 17,
              color: "#7a5a2a",
              whiteSpace: "nowrap",
            }}
          >
            Olá, {user?.name}
          </span>
          <div className="min-w-[65px] sm:min-w-[75px] touch-manipulation">
            <SketchButton seed={91} variant="ghost" onClick={handleLogout}>
              Sair
            </SketchButton>
          </div>
        </>
      ) : (
        <div className="min-w-[75px] sm:min-w-[85px] touch-manipulation">
          <SketchButton seed={92} variant="primary" onClick={() => navigate("/login")}>
            Entrar
          </SketchButton>
        </div>
      )}
    </div>
  );
}