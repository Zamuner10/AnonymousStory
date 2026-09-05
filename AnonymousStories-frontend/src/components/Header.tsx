import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Cabeçalho compartilhado — a peça que faltava desde que o AuthContext
// foi criado. Ele existe e funciona (checa se está logado, guarda o
// nome, tem uma função logout() pronta), mas até agora nenhuma tela
// realmente usava isso: não tinha botão de "Entrar" nem de "Sair" em
// lugar nenhum visível. Este componente resolve isso de um jeito só, e
// pode ser reaproveitado em qualquer página (Home, ReadLetters, etc.)
// sem duplicar a lógica.
export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, loading } = useAuth();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  // Enquanto o AuthContext ainda está checando se existe sessão válida
  // (GET /users/me ao carregar a página), não mostra nada — evita um
  // "pisca" de Entrar -> Sair assim que a página abre.
  if (loading) {
    return <div style={{ height: 32 }} />;
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        right: 24,
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      {isAuthenticated ? (
        <>
          <span
            style={{
              fontFamily: "Caveat, cursive",
              fontSize: 16,
              color: "#7a5a2a",
            }}
          >
            Olá, {user?.name}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: "transparent",
              border: "2px solid #1a1208",
              borderRadius: 6,
              padding: "6px 14px",
              cursor: "pointer",
              fontFamily: "Caveat, cursive",
              fontSize: 16,
              fontWeight: 700,
              color: "#1a1208",
            }}
          >
            Sair
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            background: "#1a1208",
            border: "2px solid #1a1208",
            borderRadius: 6,
            padding: "6px 16px",
            cursor: "pointer",
            fontFamily: "Caveat, cursive",
            fontSize: 16,
            fontWeight: 700,
            color: "#f7f3eb",
          }}
        >
          Entrar
        </button>
      )}
    </div>
  );
}
