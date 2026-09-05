import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const MAX_CONTENT = 500;
const MIN_CONTENT = 30;
const MAX_TITLE = 80;
const MIN_TITLE = 5;

export function CreateStory() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [anonymous, setAnonymous] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const displayName = anonymous ? "Anônimo(a)" : user?.name || "Anônimo(a)";
  const remaining = MAX_CONTENT - content.length;
  const progressPct = Math.max(0, Math.min(100, (content.length / MAX_CONTENT) * 100));

  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  function handleClear() {
    setTitle("");
    setContent("");
    setError("");
  }

  async function handleSubmit() {
    setError("");

    if (title.trim().length < MIN_TITLE || title.trim().length > MAX_TITLE) {
      setError(`O assunto precisa ter entre ${MIN_TITLE} e ${MAX_TITLE} caracteres.`);
      return;
    }
    if (content.trim().length < MIN_CONTENT || content.trim().length > MAX_CONTENT) {
      setError(`A carta precisa ter entre ${MIN_CONTENT} e ${MAX_CONTENT} caracteres.`);
      return;
    }

    setLoading(true);
    try {
      await api.post("/stories", { title, content, anonymous });
      setSent(true);
      setTimeout(() => navigate("/feed"), 1600);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Não foi possível enviar a carta. Tente novamente.");
      } else {
        setError("Ocorreu um erro inesperado ao conectar ao servidor.");
      }
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7f3eb",
        overflow: "hidden",
        padding: "24px 16px",
        boxSizing: "border-box",
      }}
    >
      {/* Fundo pautado quadriculado — mesmo padrão do resto do site */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(80,100,180,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(80,100,180,0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }}
      />

      {/* Logotipo */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "relative",
          zIndex: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: 18,
        }}
      >
        <span style={{ fontFamily: "Caveat, cursive", fontSize: 26, fontWeight: 700, color: "#1a1208" }}>
          Histórias <span style={{ color: "#b07030" }}>Anônimas</span>
        </span>
      </button>

      {/* A carta — mesmo molde visual do modal de leitura (LetterModal),
          mas SEM a margem vermelha, e agora editável em vez de só
          exibir texto. */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: 560,
          maxWidth: "94vw",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}
        >
          <defs>
            <filter id="write-sk">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="41" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect
            x="5"
            y="5"
            width="calc(100% - 10px)"
            height="calc(100% - 10px)"
            rx="5"
            fill="rgba(255,254,245,0.97)"
            stroke="#1a1208"
            strokeWidth="2.8"
            filter="url(#write-sk)"
          />
        </svg>

        {/* Linhas pautadas*/}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 27px, rgba(100,120,200,0.09) 27px, rgba(100,120,200,0.09) 28px)",
            backgroundPositionY: "90px",
            borderRadius: 4,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: "32px 36px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            overflowY: "auto",
          }}
        >
          {sent ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 30, fontWeight: 700, color: "#1a1208", marginBottom: 8 }}>
                Carta enviada ✦
              </p>
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 18, color: "#7a5a2a" }}>
                Ela já está a caminho do mural...
              </p>
            </div>
          ) : (
            <>
              {/* Cabeçalho: De / Data — clique em "De:" alterna entre
                  Anônimo e o nome da conta, sem precisar de um botão
                  separado quebrando a estética da carta */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                <button
                  type="button"
                  onClick={() => setAnonymous((a) => !a)}
                  title="Clique para trocar entre Anônimo e seu nome"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "Caveat, cursive",
                    fontSize: 16,
                    color: "#7a5a2a",
                    textDecoration: "underline dotted",
                  }}
                >
                  De: {displayName}
                </button>
                <span style={{ fontFamily: "Caveat, cursive", fontSize: 14, color: "#7a5a2a", opacity: 0.7 }}>
                  {today}
                </span>
              </div>

              {/* Assunto — o "título" que o backend exige (5 a 80
                  caracteres), encaixado discretamente no cabeçalho da
                  carta, já que o design do Figma não mostra um campo
                  separado pra isso */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14, borderBottom: "1px dashed rgba(26,18,8,0.25)", paddingBottom: 6 }}>
                <label style={{ fontFamily: "Caveat, cursive", fontSize: 15, color: "#7a5a2a", opacity: 0.75, whiteSpace: "nowrap" }}>
                  Assunto:
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="do que se trata esta carta..."
                  maxLength={MAX_TITLE}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "Caveat, cursive",
                    fontSize: 20,
                    color: "#1a1208",
                  }}
                />
                <span style={{ fontFamily: "Caveat, cursive", fontSize: 15, color: "#a08860", whiteSpace: "nowrap" }}>
                  {title.length}/{MAX_TITLE}
                </span>
              </div>

              {/* Área de escrita — placeholder igual ao texto guia do
                  Figma ("Escreva aqui a sua história...") */}
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT))}
                placeholder={"Escreva aqui a sua história...\n\nSeja ela de um amor, uma conquista ou uma perda.\nEsta carta será lida por alguém, um dia."}
                style={{
                  flex: 1,
                  minHeight: 220,
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  fontFamily: "Caveat, cursive",
                  fontSize: 19,
                  lineHeight: "27px",
                  color: "#1a1208",
                }}
              />

              {/* Contador com barra de progresso — igual ao "500
                  restantes" do Figma */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6, marginBottom: 4 }}>
                <div style={{ flex: 1, height: 3, background: "rgba(26,18,8,0.12)", borderRadius: 2, overflow: "hidden" }}>
                  <div
                    style={{
                      width: `${progressPct}%`,
                      height: "100%",
                      background: remaining < 0 ? "#c0392b" : "#b07030",
                      transition: "width 0.15s ease",
                    }}
                  />
                </div>
                <span style={{ fontFamily: "Caveat, cursive", fontSize: 13, color: remaining < 30 ? "#c0392b" : "#7a5a2a", whiteSpace: "nowrap" }}>
                  {remaining} restantes
                </span>
              </div>

              {/* Assinatura — "com carinho, Anônimo(a)" do Figma, dinâmica
                  de acordo com a escolha feita no "De:" acima */}
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 17, color: "#1a1208", fontWeight: 700, textAlign: "right", marginTop: 6, marginBottom: 4 }}>
                — com carinho, {displayName}
              </p>

              {error && (
                <p style={{ fontFamily: "Caveat, cursive", fontSize: 16, color: "#c0392b", textAlign: "center", marginTop: 4 }}>
                  {error}
                </p>
              )}

              {/* Botões — "Apagar" e "Enviar carta ✉", igual ao Figma */}
              <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    background: "transparent",
                    border: "2px solid #1a1208",
                    borderRadius: 6,
                    cursor: loading ? "default" : "pointer",
                    fontFamily: "Caveat, cursive",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#1a1208",
                    opacity: loading ? 0.5 : 1,
                  }}
                >
                  Apagar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "11px 0",
                    background: "#1a1208",
                    border: "2px solid #1a1208",
                    borderRadius: 6,
                    cursor: loading ? "default" : "pointer",
                    fontFamily: "Caveat, cursive",
                    fontSize: 17,
                    fontWeight: 700,
                    color: "#f7f3eb",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Enviando..." : "Enviar carta ✉"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Voltar — igual ao "← voltar para o início" do Figma */}
      <button
        type="button"
        onClick={() => navigate("/feed")}
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 18,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "Caveat, cursive",
          fontSize: 16,
          color: "#7a5a2a",
        }}
      >
      voltar para o mural
      </button>
    </div>
  );
}
