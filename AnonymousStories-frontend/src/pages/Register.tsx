// src/pages/Register.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI";
import { api } from "../services/api";

function FormBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[380px] max-w-[94vw] my-auto">
      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
        <defs>
          <filter id="form-sk-r">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="17" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <rect 
          x="4" 
          y="4" 
          width="calc(100% - 8px)" 
          height="calc(100% - 8px)" 
          rx="6"
          fill="rgba(255,254,248,0.97)" 
          stroke="#1a1208" 
          strokeWidth="2.5"
          filter="url(#form-sk-r)"
        />
      </svg>
      {/* Margem vermelha de folha de caderno */}
      <div className="absolute top-[8px] bottom-[8px] left-[26px] sm:left-[36px] w-[1px] bg-[rgba(220,80,60,0.18)] z-10" />
      <div className="relative z-20 px-3 py-3 sm:px-[28px] sm:py-[20px]">
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
            <line x1="1" y1="1" x2="23" y2="23"></line>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <div className="relative w-full min-h-[100dvh] overflow-y-auto py-3 pb-12 flex flex-col items-center justify-center bg-[#f7f3eb]">
      <Background fadeStrength="heavy" />

      {/* Doodles decorativos */}
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

      <div className="relative z-10 flex flex-col items-center w-full px-2 my-auto">
        {/* Logo superior compacta */}
        <button 
          onClick={() => navigate("/")} 
          className="bg-transparent border-none cursor-pointer mb-1 group touch-manipulation min-h-[38px] flex items-center justify-center"
        >
          <span className="font-['Caveat'] text-[22px] sm:text-[25px] font-bold text-[#1a1208] group-hover:opacity-80 transition-opacity">
            Histórias <span className="text-[#b07030]">Anônimas</span>
          </span>
        </button>

        <FormBox>
          <div className="text-center mb-0.5">
            <h2 className="font-['Caveat'] text-[22px] sm:text-[25px] font-bold text-[#1a1208] m-0 leading-none">
              Criar sua conta
            </h2>
            <p className="font-['Caveat'] text-[13px] sm:text-[15px] text-[#7a5a2a] mt-0.5">
              e comece a deixar sua marca
            </p>
          </div>

          <SketchDivider seed={17} />

          {/* Feedback de Erro ou Sucesso */}
          {error && (
            <p className="font-['Caveat'] text-[14px] text-[#b91c1c] text-center my-1">
              {error}
            </p>
          )}

          {successMessage ? (
            <div className="text-center my-2">
              <p className="font-['Caveat'] text-[17px] text-[#15803d] mb-2">
                {successMessage}
              </p>
              <SketchButton seed={52} variant="primary" onClick={() => navigate("/login")}>
                Ir para o Login
              </SketchButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-1 flex flex-col gap-1.5">
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
                  placeholder="mínimo de 8 caracteres"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  seed={43}
                  autoComplete="new-password"
                />
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

              <p className="font-['Caveat'] text-[13px] sm:text-[15px] text-[#5a4020] text-center leading-[1.1] my-1">
                ao criar uma conta você concorda em compartilhar
                suas histórias de forma anônima e respeitosa
              </p>

              {/* Botão de Cadastrar */}
              <div className="mt-1 transition-all duration-200 hover:opacity-90 active:scale-[0.98] touch-manipulation">
                <SketchButton seed={51} variant="primary" type="submit">
                  {loading ? "Criando..." : "Criar conta"}
                </SketchButton>
              </div>

              <div className="text-center mt-2 flex flex-col items-center gap-1">
                <div>
                  <span className="font-['Caveat'] text-[15px] sm:text-[17px] text-[#5a4020]">já tem uma conta?{" "}</span>
                  <button 
                    type="button" 
                    onClick={() => navigate("/login")} 
                    className="bg-transparent border-none cursor-pointer font-['Caveat'] text-[15px] sm:text-[17px] text-[#b07030] hover:text-[#4169E1] active:text-[#4169E1] underline p-0 transition-colors touch-manipulation inline"
                  >
                    entrar
                  </button>
                </div>

                {/* Botão de Voltar diretamente colado abaixo do Login */}
                <button 
                  type="button" 
                  onClick={() => navigate("/")} 
                  className="bg-transparent border-none cursor-pointer font-['Caveat'] text-[15px] sm:text-[17px] text-[#7a5a2a] hover:text-[#1a1208] active:text-[#1a1208] underline transition-colors touch-manipulation min-h-[38px] flex items-center justify-center mt-1"
                >
                voltar para o início
                </button>
              </div>
            </form>
          )}
        </FormBox>
      </div>
    </div>
  );
}