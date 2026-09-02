import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importação do hook
import axios from "axios";
import Background from "../components/Background";
import { SketchInput, SketchButton, Label, SketchDivider } from "../components/SketchUI";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export function CreateStory() {
  const navigate = useNavigate(); // 2. Hook de navegação do React Router
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // Validações locais antes de disparar a requisição
    if (title.length < 5 || title.length > 80) {
      setError("O título deve ter entre 5 e 80 caracteres.");
      return;
    }

    if (content.length < 30 || content.length > 500) {
      setError("O conteúdo deve ter entre 30 e 500 caracteres.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/stories", {
        title,
        content,
        anonymous,
      });

      setSuccessMessage("Carta enviada para o mural com sucesso!");

      // 3. Redireciona para a rota real '/feed' após 1.5s
      setTimeout(() => {
        navigate("/feed");
      }, 1500);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erro ao publicar a carta. Tente novamente.");
      } else {
        setError("Ocorreu um erro inesperado ao conectar ao servidor.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen py-10 flex items-center justify-center bg-[#f7f3eb]">
      <Background fadeStrength="heavy" />

      <div className="relative z-10 w-full max-w-xl px-4 flex flex-col items-center">
        {/* Logotipo da Aplicação */}
        <button
          onClick={() => navigate("/")}
          className="bg-transparent border-none cursor-pointer mb-6"
        >
          <span className="font-[#1a1208] font-['Caveat'] text-3xl font-bold tracking-tight">
            Histórias <span className="text-[#b07030]">Anônimas</span>
          </span>
        </button>

        {/* Card de Folha Pautada */}
        <div className="relative w-full bg-[#fffdfc]/95 border-2 border-[#1a1208] rounded-lg p-8 shadow-md">
          {/* Margem Vermelha de Caderno */}
          <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-[rgba(220,80,60,0.2)] pointer-events-none" />

          <h2 className="font-['Caveat'] text-4xl font-bold text-[#1a1208] text-center mb-1">
            Escrever uma Carta
          </h2>
          <p className="font-['Caveat'] text-lg text-[#7a5a2a] text-center mb-4">
            Deixe suas palavras voarem sem julgamentos
          </p>

          <SketchDivider seed={33} />

          {/* Mensagens de Feedback */}
          {successMessage && (
            <div className="my-3 p-3 bg-green-100 border border-green-400 text-green-800 rounded font-['Caveat'] text-xl text-center">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="my-3 p-3 bg-red-100 border border-red-400 text-red-800 rounded font-['Caveat'] text-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
            {/* Campo Título */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Título da Carta</Label>
                <span className="font-['Caveat'] text-sm text-[#7a5a2a]">
                  {title.length}/80
                </span>
              </div>
              <SketchInput
                placeholder="Ex: Para o amor que não deu certo..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                seed={41}
              />
            </div>

            {/* Campo Conteúdo */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label>Sua História</Label>
                <span className={`font-['Caveat'] text-sm ${content.length < 30 || content.length > 500 ? 'text-red-600 font-bold' : 'text-[#7a5a2a]'}`}>
                  {content.length}/500 (mín. 30)
                </span>
              </div>
              <textarea
                rows={6}
                placeholder="Escreva do fundo do seu coração..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-[#f7f3eb]/80 border-2 border-[#1a1208] rounded font-['Caveat'] text-xl text-[#1a1208] focus:outline-none focus:bg-[#fffdfc] transition-all resize-none"
              />
            </div>

            {/* Seletor de Assinatura */}
            <div>
              <Label>Como deseja assinar esta carta?</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setAnonymous(true)}
                  className={`py-2 px-3 rounded font-['Caveat'] text-lg font-bold border-2 transition-all cursor-pointer ${
                    anonymous
                      ? "bg-[#1a1208] text-[#f7f3eb] border-[#1a1208]"
                      : "bg-transparent text-[#1a1208] border-[#1a1208]/40 hover:border-[#1a1208]"
                  }`}
                >
                  ✦ Anônimo
                </button>

                <button
                  type="button"
                  onClick={() => setAnonymous(false)}
                  className={`py-2 px-3 rounded font-['Caveat'] text-lg font-bold border-2 transition-all cursor-pointer ${
                    !anonymous
                      ? "bg-[#1a1208] text-[#f7f3eb] border-[#1a1208]"
                      : "bg-transparent text-[#1a1208] border-[#1a1208]/40 hover:border-[#1a1208]"
                  }`}
                >
                  ✍ {user?.name ? user.name : "Assinar com meu nome"}
                </button>
              </div>
            </div>

            <div className="mt-2">
              <SketchButton seed={50} variant="primary" type="submit">
                {loading ? "Enviando Carta..." : "Publicar Carta"}
              </SketchButton>
            </div>
          </form>
        </div>

        {/* Botão de Voltar */}
        <button
          type="button"
          onClick={() => navigate("/feed")}
          className="mt-6 px-4 py-1.5 bg-[#fffdfc]/90 border-2 border-[#1a1208] rounded-md cursor-pointer font-['Caveat'] text-lg font-bold text-[#1a1208] flex items-center gap-2 hover:bg-[#1a1208] hover:text-[#f7f3eb] transition-colors shadow-sm"
        >
          Voltar para o Mural de Cartas
        </button>
      </div>
    </div>
  );
}