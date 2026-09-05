import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Background from "../components/Background";
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI";
import { api } from "../services/api";

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
    <div className="relative w-full min-h-screen py-10 flex items-center justify-center bg-[#f7f3eb]">
      <Background fadeStrength="heavy" />

      <div className="relative z-10 w-full max-w-md px-4 flex flex-col items-center">
        {/* Logotipo da Aplicação */}
        <button
          onClick={() => navigate("/")}
          className="bg-transparent border-none cursor-pointer mb-6"
        >
          <span className="font-['Caveat'] text-3xl font-bold text-[#1a1208] tracking-tight">
            Histórias <span className="text-[#b07030]">Anônimas</span>
          </span>
        </button>

        {/* Card Sem Linha Vermelha */}
        <div className="relative w-full bg-[#fffdfc]/95 border-2 border-[#1a1208] rounded-lg p-8 shadow-md">
          <h2 className="font-['Caveat'] text-4xl font-bold text-[#1a1208] text-center mb-1">
            Recuperar Senha
          </h2>
          <p className="font-['Caveat'] text-lg text-[#7a5a2a] text-center mb-4">
            Digite seu e-mail para receber o link de redefinição
          </p>

          <SketchDivider seed={22} />

          {/* Mensagem de Sucesso (Generica) */}
          {message && (
            <div className="my-4 p-4 bg-green-100 border border-green-400 text-green-900 rounded font-['Caveat'] text-xl text-center">
              {message}
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="my-4 p-3 bg-red-100 border border-red-400 text-red-800 rounded font-['Caveat'] text-xl text-center">
              {error}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
              <div>
                <Label>E-mail da Conta</Label>
                <SketchInput
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  seed={14}
                />
              </div>

              <div className="mt-2">
                <SketchButton seed={30} variant="primary" type="submit">
                  {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                </SketchButton>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-transparent border-none text-[#7a5a2a] hover:text-[#1a1208] font-['Caveat'] text-xl cursor-pointer underline transition-colors"
            >
              Lembrou sua senha? Voltar para o Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}