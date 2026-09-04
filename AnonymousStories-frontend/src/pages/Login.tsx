// src/pages/Login.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function FormBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[380px] max-w-[90vw]">
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <defs>
          <filter id="form-sk">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="11" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <rect
          x="5"
          y="5"
          width="calc(100% - 10px)"
          height="calc(100% - 10px)"
          rx="6"
          fill="rgba(255,254,248,0.96)"
          stroke="#1a1208"
          strokeWidth="2.5"
          filter="url(#form-sk)"
        />
        {/* Linhas pautadas de caderno */}
        <rect
          x="5"
          y="5"
          width="calc(100% - 10px)"
          height="calc(100% - 10px)"
          rx="6"
          fill="none"
          style={{
            backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(100,120,200,0.09) 27px, rgba(100,120,200,0.09) 28px)",
          }}
        />
      </svg>
      {/* Margem vermelha de folha */}
      <div className="absolute top-[10px] bottom-[10px] left-[52px] w-[1px] bg-[rgba(220,80,60,0.18)] z-10" />
      <div className="relative z-20 px-[36px] pt-[36px] pb-[32px]">
        {children}
      </div>
    </div>
  );
}

export function Login() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // MANTIDO CORRETO: POST /login (sem /auth)
      await api.post("/login", { email, password });

      // CORREÇÃO: depois do login dar certo, o cookie já está salvo no
      // navegador, mas o AuthContext ainda não sabe disso — ele só busca
      // "quem está logado" uma vez, quando o app carrega. Sem chamar
      // checkAuth() aqui e ESPERAR ele terminar (await), a tela /write
      // (protegida) checa isAuthenticated antes do contexto atualizar,
      // acha que ninguém está logado, e manda de volta pro /login — que
      // era exatamente o bug: login "funcionava" mas voltava pro login.
      await checkAuth();

      navigate("/write");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "E-mail ou senha incorretos.");
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-y-auto py-6 flex items-center justify-center bg-[#f7f3eb]">
      <Background fadeStrength="heavy" />

      {/* Ilustrações e Rabiscos nos cantos */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="d2">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="14" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <text x="80" y="140" fontSize="20" fill="#1a1208" opacity="0.12" filter="url(#d2)" fontFamily="serif">✦</text>
        <text x="1100" y="580" fontSize="16" fill="#1a1208" opacity="0.11" filter="url(#d2)" fontFamily="serif">✦</text>
        <g transform="translate(60, 580) rotate(-15)" opacity="0.12" filter="url(#d2)">
          <rect x="0" y="0" width="44" height="32" rx="2" stroke="#1a1208" strokeWidth="1.5" fill="none" />
          <polyline points="0,0 22,18 44,0" stroke="#1a1208" strokeWidth="1.5" fill="none" />
        </g>
        <g transform="translate(1090, 90) rotate(30)" opacity="0.12" filter="url(#d2)">
          <rect x="0" y="0" width="7" height="38" rx="1" stroke="#1a1208" strokeWidth="1.5" fill="none" />
          <path d="M 0 38 L 3.5 48 L 7 38" stroke="#1a1208" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          <line x1="0" y1="7" x2="7" y2="7" stroke="#1a1208" strokeWidth="1" />
        </g>
        <text x="1060" y="160" fontSize="14" fill="#1a1208" opacity="0.1" filter="url(#d2)" fontFamily="serif">✦</text>
        <text x="130" y="560" fontSize="18" fill="#1a1208" opacity="0.1" filter="url(#d2)" fontFamily="serif">✦</text>
      </svg>

      <div className="relative z-10 flex flex-col items-center my-auto">
        {/* Logotipo */}
        <button
          onClick={() => navigate("/")}
          className="bg-transparent border-none cursor-pointer mb-[28px] group touch-manipulation"
        >
          <span className="font-['Caveat'] text-[28px] font-bold text-[#1a1208] tracking-tight group-hover:opacity-80 active:opacity-60 transition-opacity">
            Histórias <span className="text-[#b07030]">Anônimas</span>
          </span>
        </button>

        <FormBox>
          <form onSubmit={handleSubmit}>
            {/* Cabeçalho */}
            <div className="text-center mb-[28px]">
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="mb-[10px] opacity-55 mx-auto">
                <defs>
                  <filter id="env-sk">
                    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="3" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </defs>
                <rect x="1" y="1" width="34" height="26" rx="2" stroke="#1a1208" strokeWidth="1.8" filter="url(#env-sk)" />
                <polyline points="1,1 18,16 35,1" stroke="#1a1208" strokeWidth="1.8" fill="none" filter="url(#env-sk)" />
              </svg>
              <h2 className="font-['Caveat'] text-[32px] font-bold text-[#1a1208] m-0 leading-none">
                Bem-vindo de volta
              </h2>
              <p className="font-['Caveat'] text-[16px] text-[#7a5a2a] mt-[6px]">
                entre para continuar sua história
              </p>
            </div>

            <SketchDivider seed={11} />

            {/* Erro de Login */}
            {error && (
              <p className="font-['Caveat'] text-[16px] text-[#c0392b] text-center mt-[12px]">
                {error}
              </p>
            )}

            <div className="mt-[18px] flex flex-col gap-[16px]">
              <div>
                <Label>seu e-mail</Label>
                <SketchInput
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  seed={21}
                  autoComplete="email"
                />
              </div>

              <div>
                <Label>senha</Label>
                <SketchInput
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  seed={22}
                  autoComplete="current-password"
                />
              </div>

              <div className="text-right -mt-[6px]">
                <button
                  type="button"
                  onClick={() => navigate("/forgot")}
                  className="bg-transparent border-none cursor-pointer font-['Caveat'] text-[15px] text-[#b07030] hover:text-[#4169E1] active:text-[#4169E1] underline p-0 transition-colors touch-manipulation"
                >
                  esqueci minha senha
                </button>
              </div>

              {/* Botão Entrar com estilo de hover e toque padronizados */}
              <div className="mt-[6px] transition-all duration-200 hover:opacity-90 active:scale-[0.98] touch-manipulation">
                <SketchButton seed={31} variant="primary" type="submit">
                  {loading ? "Entrando..." : "Entrar"}
                </SketchButton>
              </div>

              <SketchDivider seed={12} />

              <div className="text-center">
                <span className="font-['Caveat'] text-[16px] text-[#5a4020]">não tem uma conta?{" "}</span>
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="bg-transparent border-none cursor-pointer font-['Caveat'] text-[16px] text-[#b07030] hover:text-[#4169E1] active:text-[#4169E1] underline p-0 transition-colors touch-manipulation"
                >
                  criar conta
                </button>
              </div>
            </div>
          </form>
        </FormBox>

        {/* Botão de Voltar para o início */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-[20px] px-4 py-[6px] bg-[#fffdfc]/90 border-2 border-[#1a1208] rounded-md cursor-pointer font-['Caveat'] text-[18px] font-bold text-[#1a1208] flex items-center gap-[6px] hover:bg-[#1a1208] hover:text-[#f7f3eb] active:bg-[#1a1208] active:text-[#f7f3eb] focus:bg-[#1a1208] focus:text-[#f7f3eb] transition-colors shadow-sm select-none touch-manipulation"
        >
          voltar para o início
        </button>
      </div>
    </div>
  );
}
