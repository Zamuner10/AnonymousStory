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
    <div className="relative w-[380px] max-w-[92vw]">
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
      <div className="absolute top-[10px] bottom-[10px] left-[32px] sm:left-[52px] w-[1px] bg-[rgba(220,80,60,0.18)] z-10" />
      <div className="relative z-20 px-4 py-5 sm:px-[36px] sm:pt-[36px] sm:pb-[32px]">
        {children}
      </div>
    </div>
  );
}

{/* Subcomponente para o Campo de Senha com o Botão de Olho */}
function PasswordInputWithToggle({
  value,
  onChange,
  placeholder,
  seed,
  autoComplete,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  seed: number;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative flex items-center w-full">
      <SketchInput
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        seed={seed}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-2 bg-transparent border-none cursor-pointer p-1 text-[#7a5a2a] hover:text-[#1a1208] transition-colors touch-manipulation min-h-[36px] flex items-center justify-center z-10"
        title={show ? "Ocultar senha" : "Mostrar senha"}
      >
        {show ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
        )}
      </button>
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
  const [needsVerification, setNeedsVerification] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);
    setLoading(true);

    try {
      await api.post("/login", { email, password });
      await checkAuth();
      navigate("/stories");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || "E-mail ou senha incorretos.";
        setError(message);
        if (message.toLowerCase().includes("verific") || message.toLowerCase().includes("confirm")) {
          setNeedsVerification(true);
        }
      } else {
        setError("Ocorreu um erro inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] overflow-y-auto bg-[#f7f3eb]">
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
      </svg>

      <div className="relative z-10 flex flex-col items-center w-full px-2 pt-4 pb-28 my-auto">
        {/* Logotipo */}
        <button
          onClick={() => navigate("/")}
          className="bg-transparent border-none cursor-pointer mb-3 group touch-manipulation min-h-[44px] flex items-center justify-center"
        >
          <span className="font-['Caveat'] text-[26px] sm:text-[28px] font-bold text-[#1a1208] tracking-tight group-hover:opacity-80 active:opacity-60 transition-opacity">
            Histórias <span className="text-[#b07030]">Anônimas</span>
          </span>
        </button>

        <FormBox>
          <form onSubmit={handleSubmit}>
            {/* Cabeçalho */}
            <div className="text-center mb-3">
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none" className="mb-2 opacity-55 mx-auto">
                <defs>
                  <filter id="env-sk">
                    <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="3" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </defs>
                <rect x="1" y="1" width="34" height="26" rx="2" stroke="#1a1208" strokeWidth="1.8" filter="url(#env-sk)" />
                <polyline points="1,1 18,16 35,1" stroke="#1a1208" strokeWidth="1.8" fill="none" filter="url(#env-sk)" />
              </svg>
              <h2 className="font-['Caveat'] text-[26px] sm:text-[30px] font-bold text-[#1a1208] m-0 leading-none">
                Bem-vindo de volta
              </h2>
              <p className="font-['Caveat'] text-[15px] sm:text-[16px] text-[#7a5a2a] mt-1">
                entre para continuar sua história
              </p>
            </div>

            <SketchDivider seed={11} />

            {/* Erro de Login */}
            {error && (
              <div className="text-center mt-2">
                <p className="font-['Caveat'] text-[15px] text-[#c0392b] m-0">
                  {error}
                </p>
                {needsVerification && (
                  <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="mt-1 bg-transparent border-none cursor-pointer font-['Caveat'] text-[15px] text-[#b07030] underline hover:text-[#4169E1]"
                  >
                    Reenviar e-mail de confirmação
                  </button>
                )}
              </div>
            )}

            <div className="mt-3 flex flex-col gap-3">
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
                <PasswordInputWithToggle
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  seed={22}
                  autoComplete="current-password"
                />
              </div>

              <div className="text-right -mt-1">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="bg-transparent border-none cursor-pointer font-['Caveat'] text-[15px] text-[#b07030] hover:text-[#4169E1] active:text-[#4169E1] underline p-1 transition-colors touch-manipulation min-h-[36px] inline-flex items-center"
                >
                  esqueci minha senha
                </button>
              </div>

              {/* Botão Entrar */}
              <div className="mt-1 transition-all duration-200 hover:opacity-90 active:scale-[0.98] touch-manipulation">
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
                  className="bg-transparent border-none cursor-pointer font-['Caveat'] text-[16px] text-[#b07030] hover:text-[#4169E1] active:text-[#4169E1] underline py-1 px-1 transition-colors touch-manipulation inline-flex items-center"
                >
                  criar conta
                </button>
              </div>
            </div>
          </form>
        </FormBox>

        {/* Botão de Voltar */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-2.5 min-h-[48px] bg-[#fffdfc] border-2 border-[#1a1208] rounded-md cursor-pointer font-['Caveat'] text-[18px] font-bold text-[#1a1208] flex items-center justify-center gap-2 hover:bg-[#1a1208] hover:text-[#f7f3eb] active:bg-[#1a1208] active:text-[#f7f3eb] transition-colors shadow-sm touch-manipulation z-30"
        >
          voltar para o início
        </button>
      </div>
    </div>
  );
}