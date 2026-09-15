// src/pages/CreateStory.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import { SketchButton } from "../components/SketchUI";

const MAX_CONTENT = 700;
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
      className="w-full min-h-[100dvh] overflow-y-auto flex flex-col items-center justify-start p-3 sm:p-6 pb-20"
      style={{
        position: "relative",
        background: "#f7f3eb",
        boxSizing: "border-box",
      }}
    >
      {/* Fundo pautado quadriculado */}
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
        className="touch-manipulation min-h-[44px] flex items-center justify-center"
        style={{
          position: "relative",
          zIndex: 10,
          background: "none",
          border: "none",
          cursor: "pointer",
          marginBottom: 12,
          marginTop: 8,
        }}
      >
        <span style={{ fontFamily: "Caveat, cursive", fontSize: 26, fontWeight: 700, color: "#1a1208" }}>
          Histórias <span style={{ color: "#b07030" }}>Anônimas</span>
        </span>
      </button>

      {/* A carta */}
      <div
        className="my-3 sm:my-auto"
        style={{
          position: "relative",
          zIndex: 10,
          width: 560,
          maxWidth: "94vw",
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

        {/* Linhas pautadas */}
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

        {/* Conteúdo interno */}
        <div
          className="p-4 sm:p-8"
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
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
              {/* Cabeçalho: De / Data */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <button
                  type="button"
                  onClick={() => setAnonymous((a) => !a)}
                  title="Clique para trocar entre Anônimo e seu nome"
                  className="touch-manipulation min-h-[44px] flex items-center"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontFamily: "Caveat, cursive",
                    fontSize: 17,
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

              {/* Para: */}
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 16, color: "#7a5a2a", opacity: 0.75, marginBottom: 8 }}>
                Para: quem vai ler isso?
              </p>

              {/* Assunto */}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12, borderBottom: "1px dashed rgba(26,18,8,0.25)", paddingBottom: 6 }}>
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
                    width: "100%",
                    minWidth: 0,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "Caveat, cursive",
                    fontSize: 18,
                    color: "#1a1208",
                  }}
                />
                <span style={{ fontFamily: "Caveat, cursive", fontSize: 13, color: "#a08860", whiteSpace: "nowrap" }}>
                  {title.length}/{MAX_TITLE}
                </span>
              </div>

              {/* Área de escrita */}
{/* Área de escrita corrigida */}
<textarea
  value={content}
  maxLength={MAX_CONTENT} // Bloqueia fisicamente a colagem acima de 700 caracteres no navegador
  onChange={(e) => {
    const text = e.target.value;
    if (text.length <= MAX_CONTENT) {
      setContent(text);
    }
  }}
  placeholder={"Escreva aqui a sua história...\n\nSeja ela de um amor, uma conquista ou uma perda.\nEsta carta será lida por alguém, um dia."}
  className="touch-manipulation"
  style={{
    flex: 1,
    minHeight: 160,
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
              {/* Contador com barra de progresso */}
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

              {/* Assinatura */}
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 17, color: "#1a1208", fontWeight: 700, textAlign: "right", marginTop: 6, marginBottom: 4 }}>
                — com carinho, {displayName}
              </p>

              {error && (
                <p style={{ fontFamily: "Caveat, cursive", fontSize: 16, color: "#c0392b", textAlign: "center", marginTop: 4 }}>
                  {error}
                </p>
              )}

              {/* Botões responsivos */}
              <div className="flex flex-col sm:flex-row gap-3 mt-3 w-full">
                <div className="w-full sm:flex-1 touch-manipulation" style={{ opacity: loading ? 0.5 : 1, pointerEvents: loading ? "none" : "auto" }}>
                  <SketchButton seed={71} variant="ghost" onClick={handleClear}>
                    Apagar
                  </SketchButton>
                </div>
                <div className="w-full sm:flex-1 touch-manipulation" style={{ opacity: loading ? 0.7 : 1, pointerEvents: loading ? "none" : "auto" }}>
                  <SketchButton seed={72} variant="primary" onClick={handleSubmit}>
                    {loading ? "Enviando..." : "Enviar carta ✉"}
                  </SketchButton>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Voltar */}
      <button
        type="button"
        onClick={() => navigate("/feed")}
        className="touch-manipulation min-h-[44px] flex items-center justify-center"
        style={{
          position: "relative",
          zIndex: 10,
          marginTop: 14,
          marginBottom: 12,
          background: "none",
          border: "none",
          cursor: "pointer",
          fontFamily: "Caveat, cursive",
          fontSize: 17,
          color: "#7a5a2a",
        }}
      >
        voltar para o mural
      </button>
    </div>
  );
}