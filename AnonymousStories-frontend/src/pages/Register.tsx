// src/pages/Register.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI";
import { api } from "../services/api";

function FormBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[380px] max-w-[92vw]">
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <defs>
          <filter id="form-sk-r">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="17" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <rect 
          x="5" 
          y="5" 
          width="calc(100% - 10px)" 
          height="calc(100% - 10px)" 
          rx="6"
          fill="rgba(255,254,248,0.97)" 
          stroke="#1a1208" 
          strokeWidth="2.5"
          filter="url(#form-sk-r)"
        />
      </svg>
      {/* Margem vermelha de folha de caderno */}
      <div className="absolute top-[10px] bottom-[10px] left-[32px] sm:left-[45px] w-[1px] bg-[rgba(220,80,60,0.18)] z-10" />
      <div className="relative z-20 px-3 py-4 sm:px-[30px] sm:pt-[20px] sm:pb-[18px]">
        {children}
      </div>
    </div>
  );
}

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

export function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!name || !email || !password || !confirmPassword || age === "") {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (Number(age) < 13) {
      setError("Você precisa ter pelo menos 13 anos.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users", {
        name,
        email,
        password,
        confirmPassword,
        age: Number(age),
      });

      setSuccessMessage("Conta criada com sucesso! Verifique seu e-mail para confirmar seu cadastro.");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro ao realizar cadastro.");
      } else {
        setError("Ocorreu um erro inesperado ao conectar ao servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Wrapper com min-h-[100dvh], pb-28 (espaço gigante de respiro para rolar o botão no celular) */
    <div className="relative w-full min-h-[100dvh] overflow-y-auto py-4 pb-28 flex flex-col items-center justify-start bg-[#f7f3eb]">
      <Background fadeStrength="heavy" />

      {/* Doodles decorativos nos cantos */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 700" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="d3">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" seed="19" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <text x="90" y="160" fontSize="18" fill="#1a1208" opacity="0.11" filter="url(#d3)" fontFamily="serif">✦</text>
        <text x="1090" y="550" fontSize="14" fill="#1a1208" opacity="0.1" filter="url(#d3)" fontFamily="serif">✦</text>
      </svg>

      <div className="relative z-10 flex flex-col items-center w-full px-2 mt-2">
        {/* Logo superior */}
        <button 
          onClick={() => navigate("/")} 
          className="bg-transparent border-none cursor-pointer mb-3 group touch-manipulation min-h-[44px] flex items-center justify-center"
        >
          <span className="font-['Caveat'] text-[24px] sm:text-[26px] font-bold text-[#1a1208] group-hover:opacity-80 active:opacity-60 transition-opacity">
            Histórias <span className="text-[#b07030]">Anônimas</span>
          </span>
        </button>

        <FormBox>
          <div className="text-center mb-1">
            <h2 className="font-['Caveat'] text-[24px] sm:text-[26px] font-bold text-[#1a1208] m-0 leading-none">
              Criar sua conta
            </h2>
            <p className="font-['Caveat'] text-[15px] sm:text-[17px] text-[#7a5a2a] mt-1">
              e comece a deixar sua marca
            </p>
          </div>

          <SketchDivider seed={17} />

          {/* Feedback de Erro ou Sucesso */}
          {error && (
            <p className="font-['Caveat'] text-[15px] text-[#b91c1c] text-center mt-2">
              {error}
            </p>
          )}

          {successMessage ? (
            <div className="text-center mt-3">
              <p className="font-['Caveat'] text-[18px] text-[#15803d] mb-3">
                {successMessage}
              </p>
              <SketchButton seed={52} variant="primary" onClick={() => navigate("/login")}>
                Ir para o Login
              </SketchButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-2">
              <div>
                <Label>Como podemos te chamar?</Label>
                <SketchInput
                  type="text"
                  placeholder="seu nome ou apelido"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  seed={41}
                />
              </div>

              <div>
                <Label>Seu e-mail</Label>
                <SketchInput
                  type="email"
                  placeholder="nome@exemplo.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  seed={42}
                  autoComplete="email"
                />
              </div>

              <div>
                <Label>Sua idade</Label>
                <SketchInput
                  type="number"
                  placeholder="ex: 18"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  seed={44}
                />
              </div>

              <div>
                <Label>Crie uma senha</Label>
                <PasswordInputWithToggle
                  placeholder="mínimo de 6 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  seed={43}
                  autoComplete="new-password"
                />
                <p className="font-['Caveat'] text-[13px] text-[#7a5a2a] mt-0.5 ml-1">
                  * a senha deve conter pelo menos 6 caracteres
                </p>
              </div>

              <div>
                <Label>Confirme sua senha</Label>
                <PasswordInputWithToggle
                  placeholder="digite a senha novamente"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  seed={45}
                  autoComplete="new-password"
                />
              </div>

              <p className="font-['Caveat'] text-[15px] sm:text-[17px] text-[#5a4020] text-center leading-[1.2] mt-1">
                ao criar uma conta você concorda em compartilhar
                suas histórias de forma anônima e respeitosa
              </p>

              {/* Botão de Cadastrar */}
              <div className="mt-2 transition-all duration-200 hover:opacity-90 active:scale-[0.98] touch-manipulation">
                <SketchButton seed={51} variant="primary" type="submit">
                  {loading ? "Criando..." : "Criar conta"}
                </SketchButton>
              </div>

              <SketchDivider seed={18} />

              <div className="text-center">
                <span className="font-['Caveat'] text-[17px] sm:text-[19px] text-[#5a4020]">já tem uma conta?{" "}</span>
                <button 
                  type="button" 
                  onClick={() => navigate("/login")} 
                  className="bg-transparent border-none cursor-pointer font-['Caveat'] text-[17px] sm:text-[19px] text-[#b07030] hover:text-[#4169E1] active:text-[#4169E1] underline py-1 px-1 transition-colors touch-manipulation inline-flex items-center"
                >
                  entrar
                </button>
              </div>
            </form>
          )}
        </FormBox>

        {/* Botão de Voltar para o início visível abaixo do formulário */}
        <button 
          type="button" 
          onClick={() => navigate("/")} 
          className="mt-5 mb-8 px-6 py-2.5 min-h-[44px] bg-[#fffdfc]/90 border-2 border-[#1a1208] rounded-md cursor-pointer font-['Caveat'] text-[17px] font-bold text-[#1a1208] flex items-center justify-center gap-[6px] hover:bg-[#1a1208] hover:text-[#f7f3eb] active:bg-[#1a1208] active:text-[#f7f3eb] focus:bg-[#1a1208] focus:text-[#f7f3eb] transition-colors shadow-sm select-none touch-manipulation z-30"
        >
          voltar para o início
        </button>
      </div>
    </div>
  );
}