import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { Header } from "../components/Header";

interface Story {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  authorDisplayName: string;
}

const PAPER_COLORS = ["#fffef5", "#f5f8ff", "#fff5f5", "#f5fff7", "#fdf5ff", "#fffbf0", "#f0f8ff"];

// Função utilitária Fisher-Yates para embaralhar arrays
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Card clicável do mural
function ReadCard({
  story,
  seed,
  tilt,
  onClick,
}: {
  story: Story | null;
  seed: number;
  tilt: number;
  onClick: () => void;
}) {
  const w = 280;
  const h = 212;
  const bg = PAPER_COLORS[seed % PAPER_COLORS.length];

  return (
    <div
      onClick={story ? onClick : undefined}
      style={{
        width: w,
        height: h,
        flexShrink: 0,
        transform: `rotate(${tilt}deg)`,
        position: "relative",
        cursor: story ? "pointer" : "default",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => {
        if (story) {
          (e.currentTarget as HTMLDivElement).style.transform = `rotate(${tilt}deg) scale(1.06)`;
        }
      }}
      onMouseLeave={(e) => {
        if (story) {
          (e.currentTarget as HTMLDivElement).style.transform = `rotate(${tilt}deg) scale(1)`;
        }
      }}
    >
      <div style={{ position: "absolute", inset: 0, boxShadow: "3px 5px 14px rgba(26,18,8,0.15)", borderRadius: 3 }} />
      <div style={{ position: "absolute", inset: 0, background: bg, borderRadius: 3 }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(transparent, transparent 21px, rgba(100,120,200,0.1) 21px, rgba(100,120,200,0.1) 22px)", backgroundPositionY: "36px", borderRadius: 3, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 36, width: 1.5, background: "rgba(220,80,60,0.2)" }} />

      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <filter id={`rsk-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <rect x={4} y={4} width={w - 8} height={h - 8} rx={3} fill="none" stroke="#1a1208" strokeWidth="2" filter={`url(#rsk-${seed})`} />
      </svg>

      {/* Conteúdo da Carta */}
      {story ? (
        <div style={{ position: "absolute", inset: "10px 14px 10px 46px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <div>
                <p style={{ fontFamily: "Caveat, cursive", fontSize: 10.5, color: "#5a3a1a", opacity: 0.65, lineHeight: 1.3 }}>
                  {story.authorDisplayName}
                </p>
                <p style={{ fontFamily: "Caveat, cursive", fontSize: 10.5, color: "#5a3a1a", opacity: 0.5 }}>
                  {new Date(story.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none" style={{ opacity: 0.28, flexShrink: 0 }}>
                <rect x="1" y="1" width="18" height="14" rx="1" stroke="#1a1208" strokeWidth="1.5" />
                <polyline points="1,1 10,8 19,1" stroke="#1a1208" strokeWidth="1.5" />
              </svg>
            </div>
            <p style={{ fontFamily: "Caveat, cursive", fontSize: 14, color: "#1a1208", fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {story.title}
            </p>
            <p
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: 13,
                color: "#3a2010",
                lineHeight: 1.4,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
              } as React.CSSProperties}
            >
              {story.content}
            </p>
          </div>
          <p style={{ fontFamily: "Caveat, cursive", fontSize: 12, color: "#1a1208", fontWeight: 700, textAlign: "right" }}>
            — {story.authorDisplayName}
          </p>
        </div>
      ) : null}
    </div>
  );
}

const TILTS = [-3, 2, -5, 1, -2, 4, -1, 3, -4, 2, -6, 0];

const ROWS_CONFIG = [
  { dir: "right" as const, dur: 52, so: 0, to: 0 },
  { dir: "left" as const, dur: 66, so: 4, to: 3 },
  { dir: "right" as const, dur: 46, so: 8, to: 6 },
  { dir: "left" as const, dur: 60, so: 2, to: 1 },
  { dir: "right" as const, dur: 54, so: 6, to: 4 },
];

function Row({
  stories,
  direction,
  duration,
  seedOff,
  tiltOff,
  rowGlobalOffset,
  onCardClick,
}: {
  stories: Story[];
  direction: "left" | "right";
  duration: number;
  seedOff: number;
  tiltOff: number;
  rowGlobalOffset: number;
  onCardClick: (s: Story) => void;
}) {
  const slots = Array.from({ length: 6 });
  const tripledSlots = [...slots, ...slots, ...slots];

  return (
    <div style={{ overflow: "visible", width: "100%", flexShrink: 0 }}>
      <div
        className={direction === "left" ? "animate-marquee-slow-left" : "animate-marquee-slow-right"}
        style={{ display: "flex", gap: 18, width: "max-content", alignItems: "center", paddingBlock: 10, animationDuration: `${duration}s` }}
      >
        {tripledSlots.map((_, i) => {
          const globalIndex = rowGlobalOffset + i;
          const storyData = globalIndex < stories.length ? stories[globalIndex] : null;
          return (
            <ReadCard
              key={i}
              story={storyData}
              seed={(i + seedOff) % 17 + 1}
              tilt={TILTS[(i + tiltOff) % TILTS.length]}
              onClick={() => storyData && onCardClick(storyData)}
            />
          );
        })}
      </div>
    </div>
  );
}

// Modal completo de leitura da carta
function LetterModal({ story, onClose }: { story: Story; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26,18,8,0.45)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease",
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes slideUp { from { transform: translateY(24px) scale(0.97); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }`}</style>

      {/* Papel */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: 520,
          maxWidth: "90vw",
          maxHeight: "85vh",
          overflowY: "auto",
          animation: "slideUp 0.22s ease",
        }}
      >
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
          <defs>
            <filter id="modal-sk">
              <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" seed="37" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
          <rect
            x="5"
            y="5"
            width="calc(100% - 10px)"
            height="calc(100% - 10px)"
            rx="5"
            fill="rgba(255,254,245,1)"
            stroke="#1a1208"
            strokeWidth="2.8"
            filter="url(#modal-sk)"
            style={{ width: "calc(100% - 10px)", height: "calc(100% - 10px)" }}
          />
        </svg>

        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, rgba(100,120,200,0.09) 27px, rgba(100,120,200,0.09) 28px)", backgroundPositionY: "80px", borderRadius: 4, pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 1, padding: "36px 36px 36px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 13, color: "#7a5a2a", opacity: 0.7 }}>História Anônima</p>
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 13, color: "#7a5a2a", opacity: 0.6 }}>
                {new Date(story.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <svg width="34" height="40" viewBox="0 0 34 40" fill="none" style={{ opacity: 0.35 }}>
                <defs>
                  <filter id="stmp2">
                    <feTurbulence type="fractalNoise" baseFrequency="0.07" numOctaves="3" seed="5" result="n" />
                    <feDisplacementMap in="SourceGraphic" in2="n" scale="1.5" xChannelSelector="R" yChannelSelector="G" />
                  </filter>
                </defs>
                <rect x="1" y="1" width="32" height="38" rx="1" stroke="#1a1208" strokeWidth="1.5" filter="url(#stmp2)" />
                <text x="17" y="24" fontSize="15" textAnchor="middle" fill="#1a1208" fontFamily="serif">✉</text>
                <text x="17" y="34" fontSize="6.5" textAnchor="middle" fill="#1a1208" fontFamily="Caveat, cursive" letterSpacing="1">BRASIL</text>
              </svg>

              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <defs>
                    <filter id="x-sk">
                      <feTurbulence type="fractalNoise" baseFrequency="0.06" numOctaves="3" seed="2" result="n" />
                      <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
                    </filter>
                  </defs>
                  <line x1="4" y1="4" x2="18" y2="18" stroke="#1a1208" strokeWidth="2.2" strokeLinecap="round" filter="url(#x-sk)" opacity="0.6" />
                  <line x1="18" y1="4" x2="4" y2="18" stroke="#1a1208" strokeWidth="2.2" strokeLinecap="round" filter="url(#x-sk)" opacity="0.6" />
                </svg>
              </button>
            </div>
          </div>

          <svg width="100%" height="10" viewBox="0 0 448 10" style={{ display: "block", marginBottom: 18 }}>
            <defs>
              <filter id="mdiv">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="11" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <line x1="0" y1="5" x2="448" y2="5" stroke="#1a1208" strokeWidth="1.5" opacity="0.15" filter="url(#mdiv)" />
          </svg>

          <p style={{ fontFamily: "Caveat, cursive", fontSize: 26, fontWeight: 700, color: "#1a1208", marginBottom: 12 }}>
            {story.title}
          </p>

          <p style={{ fontFamily: "Caveat, cursive", fontSize: 20, color: "#1a1208", lineHeight: 1.75, marginBottom: 28, whiteSpace: "pre-wrap" }}>
            {story.content}
          </p>

          <svg width="100%" height="10" viewBox="0 0 448 10" style={{ display: "block", marginBottom: 12 }}>
            <line x1="0" y1="5" x2="448" y2="5" stroke="#1a1208" strokeWidth="1.5" opacity="0.12" filter="url(#mdiv)" />
          </svg>

          <p style={{ fontFamily: "Caveat, cursive", fontSize: 20, color: "#1a1208", fontWeight: 700, textAlign: "right" }}>
            — {story.authorDisplayName}
          </p>

          <p style={{ fontFamily: "Caveat, cursive", fontSize: 15, color: "#7a5a2a", textAlign: "center", marginTop: 24, opacity: 0.5 }}>
            clique fora para fechar ✦
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReadLetters() {
  const navigate = useNavigate();
  const [displayStories, setDisplayStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Story | null>(null);

  const handleIncomingStories = (incoming: Story[]) => {
    setDisplayStories((prev) => {
      if (prev.length === 0) {
        const fixedStory1 = incoming.find((s) => s.id === 1);
        const remaining = incoming.filter((s) => s.id !== 1);
        const shuffledRemaining = shuffleArray(remaining);

        return fixedStory1 ? [fixedStory1, ...shuffledRemaining] : shuffledRemaining;
      }

      const existingIds = new Set(prev.map((s) => s.id));
      const newStories = incoming.filter((s) => !existingIds.has(s.id));

      if (newStories.length === 0) {
        return prev;
      }

      return [...prev, ...newStories];
    });
  };

  useEffect(() => {
    let isFirstLoad = true;

    async function fetchStories() {
      try {
        const response = await api.get<Story[]>("/stories");
        handleIncomingStories(response.data);
        setError("");
      } catch (err) {
        console.error("Erro ao carregar histórias do backend:", err);
        if (isFirstLoad) {
          setError("Não foi possível carregar as histórias agora.");
        }
      } finally {
        if (isFirstLoad) {
          setLoading(false);
          isFirstLoad = false;
        }
      }
    }

    fetchStories();
    const intervalId = setInterval(fetchStories, 20000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden", background: "#f7f3eb" }}>
      <style>{`
        @keyframes marqueeLeft {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee-slow-left {
          display: flex;
          animation: marqueeLeft 75s linear infinite;
        }
        .animate-marquee-slow-right {
          display: flex;
          animation: marqueeRight 75s linear infinite;
        }
        .animate-marquee-slow-left:hover,
        .animate-marquee-slow-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Topo Limpo: Logo Original à esquerda + Header à direita */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 30, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 28px", background: "linear-gradient(to bottom, rgba(247,243,235,0.96) 0%, transparent 100%)" }}>
        <button onClick={() => navigate("/")} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <span style={{ fontFamily: "Caveat, cursive", fontSize: 24, fontWeight: 700, color: "#1a1208" }}>
            Histórias <span style={{ color: "#b07030" }}>Anônimas</span>
          </span>
        </button>

        <Header />
      </div>

      {/* Fundo pautado quadriculado */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(80,100,180,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(80,100,180,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

      {/* 5 fileiras de esteiras com recuo para não encostar na barra superior */}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "space-evenly", paddingBlock: 6, paddingTop: 56 }}>
        {ROWS_CONFIG.map((row, i) => (
          <Row
            key={i}
            stories={displayStories}
            direction={row.dir}
            duration={row.dur}
            seedOff={row.so}
            tiltOff={row.to}
            rowGlobalOffset={i * 18}
            onCardClick={setSelected}
          />
        ))}
      </div>

      {/* Barra inferior de status */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 20, height: 48, background: "linear-gradient(to top, rgba(247,243,235,0.96) 0%, transparent 100%)", display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 10, pointerEvents: "none" }}>
        <span style={{ fontFamily: "Caveat, cursive", fontSize: 13.5, color: "#7a5a2a", opacity: 0.55 }}>
          {error ? error : loading ? "carregando histórias..." : `${displayStories.length} histórias anônimas neste lugar ✦ clique em uma carta para ler`}
        </span>
      </div>

      {/* Modal de leitura da carta */}
      {selected && <LetterModal story={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}