// src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Background from "../components/Background";
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI";
import { api } from "../services/api";

function FormBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[380px] max-w-[92vw]">
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <defs>
          <filter id="form-sk-fp">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="22" result="n" />
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
          filter="url(#form-sk-fp)"
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

export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Por favor, informe seu e-mail.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/forgot-password", { email });
      setMessage(response.data.message || "Se este e-mail estiver cadastrado, você receberá as instruções de redefinição.");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro ao solicitar redefinição. Tente novamente.");
      } else {
        setError("Ocorreu um erro inesperado ao conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] overflow-y-auto py-6 pb-20 flex items-center justify-center bg-[#f7f3eb]">
      <Background fadeStrength="heavy" />

      {/* Doodles decorativos nos cantos */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="d-fp">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="14" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <text x="80" y="140" fontSize="20" fill="#1a1208" opacity="0.12" filter="url(#d-fp)" fontFamily="serif">✦</text>
        <text x="1100" y="580" fontSize="16" fill="#1a1208" opacity="0.11" filter="url(#d-fp)" fontFamily="serif">✦</text>
      </svg>

      <div className="relative z-10 flex flex-col items-center my-4 sm:my-auto w-full px-2">
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
          <div className="text-center mb-3">
            <h2 className="font-['Caveat'] text-[26px] sm:text-[30px] font-bold text-[#1a1208] m-0 leading-none">
              Recuperar Senha
            </h2>
            <p className="font-['Caveat'] text-[15px] sm:text-[16px] text-[#7a5a2a] mt-1">
              Digite seu e-mail para receber o link de redefinição
            </p>
          </div>

          <SketchDivider seed={22} />

          {/* Mensagem de Sucesso */}
          {message && (
            <div className="my-3 p-3 bg-[#e8f5e9] border border-[#a5d6a7] text-[#2e7d32] rounded font-['Caveat'] text-[17px] text-center">
              {message}
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="my-3 p-3 bg-[#ffebee] border border-[#ef9a9a] text-[#c62828] rounded font-['Caveat'] text-[17px] text-center">
              {error}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
              <div>
                <Label>E-mail da Conta</Label>
                <SketchInput
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  seed={14}
                  autoComplete="email"
                />
              </div>

              <div className="mt-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] touch-manipulation">
                <SketchButton seed={30} variant="primary" type="submit">
                  {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                </SketchButton>
              </div>
            </form>
          )}

          <SketchDivider seed={12} />

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-transparent border-none text-[#b07030] hover:text-[#4169E1] font-['Caveat'] text-[16px] sm:text-[18px] cursor-pointer underline transition-colors min-h-[44px] inline-flex items-center justify-center p-1 touch-manipulation"
            >
              Lembrou sua senha? Voltar para o Login
            </button>
          </div>
        </FormBox>

        {/* Botão de Voltar para o início */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 px-5 py-2.5 min-h-[44px] bg-[#fffdfc]/90 border-2 border-[#1a1208] rounded-md cursor-pointer font-['Caveat'] text-[17px] font-bold text-[#1a1208] flex items-center justify-center gap-[6px] hover:bg-[#1a1208] hover:text-[#f7f3eb] active:bg-[#1a1208] active:text-[#f7f3eb] focus:bg-[#1a1208] focus:text-[#f7f3eb] transition-colors shadow-sm select-none touch-manipulation"
        >
          voltar para o início
        </button>
      </div>
    </div>
  );
}