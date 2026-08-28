import React, { useState } from "react"
import axios from "axios"
import Background from "../components/Background"
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI"
import { api } from "../services/api"

interface RegisterProps {
  onNavigate: (page: string) => void
}

function FormBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[380px] max-w-[90vw]">
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
      <div className="absolute top-[10px] bottom-[10px] left-[45px] w-[1px] bg-[rgba(220,80,60,0.18)] z-10" />
      <div className="relative z-20 px-[24px] sm:px-[30px] pt-[20px] pb-[18px]">
        {children}
      </div>
    </div>
  )
}

export default function Register({ onNavigate }: RegisterProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [age, setAge] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")

    if (!name || !email || !password || !confirmPassword || age === "") {
      setError("Por favor, preencha todos os campos.")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!")
      return
    }

    if (Number(age) < 12) {
      setError("Você precisa ter pelo menos 12 anos.")
      return
    }

    setLoading(true)

    try {
      await api.post("/users", {
        name,
        email,
        password,
        confirmPassword,
        age: Number(age),
      })

      setSuccessMessage("Conta criada com sucesso! Verifique seu e-mail para confirmar seu cadastro.")
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro ao realizar cadastro.")
      } else {
        setError("Ocorreu um erro inesperado ao conectar ao servidor.")
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative w-full min-h-screen overflow-y-auto py-6 flex items-center justify-center bg-[#f7f3eb]">
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
        <g transform="translate(1050, 100) rotate(-20)" opacity="0.11" filter="url(#d3)">
          <rect x="0" y="0" width="7" height="40" rx="1" stroke="#1a1208" strokeWidth="1.5" fill="none"/>
          <path d="M 0 40 L 3.5 50 L 7 40" stroke="#1a1208" strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
        </g>
        <text x="140" y="540" fontSize="16" fill="#1a1208" opacity="0.1" filter="url(#d3)" fontFamily="serif">✦</text>
        <text x="155" y="558" fontSize="10" fill="#1a1208" opacity="0.08" filter="url(#d3)" fontFamily="serif">✦</text>
        <path d="M 1080 440 C 1080 437 1075 432 1070 436 C 1065 432 1060 437 1060 440 C 1060 445 1070 453 1070 453 C 1070 453 1080 445 1080 440 Z" stroke="#1a1208" strokeWidth="1.5" fill="none" opacity="0.1" filter="url(#d3)"/>
        <path d="M 60 350 Q 72 345 84 350 Q 96 355 108 350 Q 120 345 132 350" stroke="#1a1208" strokeWidth="1.5" fill="none" opacity="0.1" filter="url(#d3)" strokeLinecap="round"/>
        <path d="M 1068 350 Q 1080 345 1116 350 Q 1128 345 1140 350" stroke="#1a1208" strokeWidth="1.5" fill="none" opacity="0.1" filter="url(#d3)" strokeLinecap="round"/>
      </svg>

      <div className="relative z-10 flex flex-col items-center my-auto">
        {/* Logo superior */}
        <button 
          onClick={() => onNavigate("home")} 
          className="bg-transparent border-none cursor-pointer mb-2 group touch-manipulation"
        >
          <span className="font-['Caveat'] text-[26px] font-bold text-[#1a1208] group-hover:opacity-80 active:opacity-60 transition-opacity">
            Histórias <span className="text-[#b07030]">Anônimas</span>
          </span>
        </button>

        <FormBox>
          <div className="text-center mb-1">
            {/* Ícone de Pena */}
            <svg width="26" height="32" viewBox="0 0 32 40" fill="none" className="mb-1 opacity-50 mx-auto">
              <defs>
                <filter id="quill-sk">
                  <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="6" result="n"/>
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
              </defs>
              <path d="M 16 2 C 26 2 30 10 28 18 C 26 26 18 30 16 38" stroke="#1a1208" strokeWidth="1.8" fill="none" strokeLinecap="round" filter="url(#quill-sk)"/>
              <path d="M 16 2 C 6 2 2 10 4 18 C 6 26 14 30 16 38" stroke="#1a1208" strokeWidth="1.8" fill="none" strokeLinecap="round" filter="url(#quill-sk)"/>
              <line x1="16" y1="8" x2="16" y2="38" stroke="#1a1208" strokeWidth="1.2" strokeLinecap="round" filter="url(#quill-sk)" opacity="0.5"/>
            </svg>
            <h2 className="font-['Caveat'] text-[26px] font-bold text-[#1a1208] m-0 leading-none">
              Criar sua conta
            </h2>
            <p className="font-['Caveat'] text-[18px] text-[#7a5a2a] mt-1">
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
              <SketchButton seed={52} variant="primary" onClick={() => onNavigate("login")}>
                Ir para o Login
              </SketchButton>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-1.5">
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
                <SketchInput
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  seed={43}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <Label>Confirme sua senha</Label>
                <SketchInput
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  seed={45}
                  autoComplete="new-password"
                />
              </div>

              <p className="font-['Caveat'] text-[18px] text-[#5a4020] text-center leading-[1.2] mt-1">
                ao criar uma conta você concorda em compartilhar
                suas histórias de forma anônima e respeitosa
              </p>

              {/* Botão de Cadastrar padronizado com o estilo da Home Page */}
              <div className="mt-1 transition-all duration-200 hover:opacity-90 active:scale-[0.98] touch-manipulation">
                <SketchButton seed={51} variant="primary" type="submit">
                  {loading ? "Criando..." : "Criar conta"}
                </SketchButton>
              </div>

              <SketchDivider seed={18} />

              <div className="text-center">
                <span className="font-['Caveat'] text-[20px] text-[#5a4020]">já tem uma conta?{" "}</span>
                <button 
                  type="button" 
                  onClick={() => onNavigate("login")} 
                  className="bg-transparent border-none cursor-pointer font-['Caveat'] text-[20px] text-[#b07030] hover:text-[#1a1208] active:text-[#1a1208] underline p-0 transition-colors touch-manipulation"
                >
                  entrar
                </button>
              </div>
            </form>
          )}
        </FormBox>

        {/* Botão de Voltar com Hover Invertido */}
        <button 
          type="button" 
          onClick={() => onNavigate("home")} 
          className="mt-3 px-4 py-[5px] bg-[#fffdfc]/90 border-2 border-[#1a1208] rounded-md cursor-pointer font-['Caveat'] text-[17px] font-bold text-[#1a1208] flex items-center gap-[6px] hover:bg-[#1a1208] hover:text-[#f7f3eb] active:bg-[#1a1208] active:text-[#f7f3eb] focus:bg-[#1a1208] focus:text-[#f7f3eb] transition-colors shadow-sm select-none touch-manipulation"
        >
          voltar para o início
        </button>
      </div>
    </div>
  )
}