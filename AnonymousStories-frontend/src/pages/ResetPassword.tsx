// src/pages/ResetPassword.tsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Background from "../components/Background";
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI";
import { api } from "../services/api";

function FormBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[380px] max-w-[92vw]">
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <defs>
          <filter id="form-sk-rp">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="28" result="n" />
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
          filter="url(#form-sk-rp)"
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

{/* Subcomponente de Senha com o Botão de Olho */}
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

export function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!token) {
      setError("Token de redefinição ausente ou inválido na URL.");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/users/reset-password", {
        token,
        newPassword,
      });

      setSuccessMessage(response.data.message || "Senha alterada com sucesso!");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro ao redefinir a senha. O token pode ter expirado.");
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
          <filter id="d-rp">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="16" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <text x="80" y="140" fontSize="20" fill="#1a1208" opacity="0.12" filter="url(#d-rp)" fontFamily="serif">✦</text>
        <text x="1100" y="580" fontSize="16" fill="#1a1208" opacity="0.11" filter="url(#d-rp)" fontFamily="serif">✦</text>
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
              Nova Senha
            </h2>
            <p className="font-['Caveat'] text-[15px] sm:text-[16px] text-[#7a5a2a] mt-1">
              Escolha uma nova senha para a sua conta
            </p>
          </div>

          <SketchDivider seed={28} />

          {/* Feedback de Sucesso */}
          {successMessage && (
            <div className="my-3 p-3 bg-[#e8f5e9] border border-[#a5d6a7] text-[#2e7d32] rounded font-['Caveat'] text-[17px] text-center">
              {successMessage} Redirecionando para o login...
            </div>
          )}

          {/* Feedback de Erro */}
          {error && (
            <div className="my-3 p-3 bg-[#ffebee] border border-[#ef9a9a] text-[#c62828] rounded font-['Caveat'] text-[17px] text-center">
              {error}
            </div>
          )}

          {!successMessage && (
            <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-3">
              <div>
                <Label>Nova Senha</Label>
                <PasswordInputWithToggle
                  placeholder="Mínimo de 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  seed={18}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <Label>Confirmar Nova Senha</Label>
                <PasswordInputWithToggle
                  placeholder="Digite a nova senha novamente"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  seed={24}
                  autoComplete="new-password"
                />
              </div>

              <div className="mt-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] touch-manipulation">
                <SketchButton seed={35} variant="primary" type="submit">
                  {loading ? "Redefinindo..." : "Redefinir Senha"}
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
              Voltar para o Login
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