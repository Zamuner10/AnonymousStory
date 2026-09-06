import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { SketchButton } from "./SketchUI";

// CORRIGIDO: este componente tinha "position: absolute" próprio, pensado
// pra ser jogado solto em qualquer canto da tela. Isso funcionava OK no
// Home.tsx (que já envolve o Header numa div própria também absoluta),
// mas quebrava no ReadLetters.tsx — lá o Header fica dentro de uma barra
// que já existe (display: flex), e o posicionamento absoluto interno
// fazia ele "fugir" pro canto da página, ignorando que devia ficar do
// lado do botão "Escrever uma carta".
//
// Agora o Header é só um pedacinho de conteúdo comum (flex, sem se
// autoposicionar) — cada página decide onde ele entra:
// - Home.tsx: continua funcionando, já que lá o Header é envolvido por
//   uma div própria com "absolute top-4 right-6".
// - ReadLetters.tsx: agora pode ficar DENTRO do mesmo "display: flex"
//   que já tem o botão "Escrever uma carta", lado a lado de verdade.
//
// Os botões (Sair/Entrar) agora usam o SketchButton compartilhado, que
// já tem a borda "de lápis" (traço desenhado via SVG) — igual ao resto
// do site — em vez da borda reta simples de antes.
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
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {isAuthenticated ? (
        <>
          <span style={{ fontFamily: "Caveat, cursive", fontSize: 16, color: "#7a5a2a", whiteSpace: "nowrap" }}>
            Olá, {user?.name}
          </span>
          <div style={{ width: 90 }}>
            <SketchButton seed={91} variant="ghost" onClick={handleLogout}>
              Sair
            </SketchButton>
          </div>
        </>
      ) : (
        <div style={{ width: 100 }}>
          <SketchButton seed={92} variant="primary" onClick={() => navigate("/login")}>
            Entrar
          </SketchButton>
        </div>
      )}
    </div>
  );
}
