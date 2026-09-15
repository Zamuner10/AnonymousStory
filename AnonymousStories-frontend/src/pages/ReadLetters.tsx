// src/pages/ReadLetters.tsx
import React, { useState, useEffect, useMemo } from "react";
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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 640);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

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
  const isMobile = useIsMobile();
  const w = isMobile ? 210 : 280;
  const h = isMobile ? 160 : 212;
  const bg = PAPER_COLORS[seed % PAPER_COLORS.length];

  return (
    <div
      onClick={story ? onClick : undefined}
      className="touch-manipulation"
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
          (e.currentTarget as HTMLDivElement).style.transform = `rotate(${tilt}deg) scale(1.05)`;
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
      <div style={{ position: "absolute", top: 0, bottom: 0, left: isMobile ? 26 : 36, width: 1.5, background: "rgba(220,80,60,0.2)" }} />

      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <filter id={`rsk-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="4" seed={seed} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
        <rect x={4} y={4} width={w - 8} height={h - 8} rx={3} fill="none" stroke="#1a1208" strokeWidth="2" filter={`url(#rsk-${seed})`} />
      </svg>

      {story ? (
        <div style={{ position: "absolute", inset: isMobile ? "8px 10px 8px 32px" : "10px 14px 10px 46px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <div>
                <p style={{ fontFamily: "Caveat, cursive", fontSize: isMobile ? 10 : 11, color: "#5a3a1a", opacity: 0.7, lineHeight: 1.2 }}>
                  {story.authorDisplayName}
                </p>
                <p style={{ fontFamily: "Caveat, cursive", fontSize: isMobile ? 9.5 : 10.5, color: "#5a3a1a", opacity: 0.5 }}>
                  {new Date(story.createdAt).toLocaleDateString("pt-BR")}
                </p>
              </div>
            </div>
            <p style={{ fontFamily: "Caveat, cursive", fontSize: isMobile ? 13 : 15, color: "#1a1208", fontWeight: 700, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {story.title}
            </p>
            <p
              style={{
                fontFamily: "Caveat, cursive",
                fontSize: isMobile ? 12 : 13.5,
                color: "#3a2010",
                lineHeight: 1.3,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: isMobile ? 2 : 3,
                WebkitBoxOrient: "vertical",
              } as React.CSSProperties}
            >
              {story.content}
            </p>
          </div>
          <p style={{ fontFamily: "Caveat, cursive", fontSize: isMobile ? 11 : 12, color: "#1a1208", fontWeight: 700, textAlign: "right" }}>
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
];

const SLOTS_PER_ROW = 8;

function Row({
  rowStories,
  direction,
  duration,
  seedOff,
  tiltOff,
  onCardClick,
}: {
  rowStories: (Story | null)[];
  direction: "left" | "right";
  duration: number;
  seedOff: number;
  tiltOff: number;
  onCardClick: (s: Story) => void;
}) {
  // Garante que o bloco base tenha ao menos SLOTS_PER_ROW slots ou o total de histórias recebidas
  const totalSlots = Math.max(SLOTS_PER_ROW, rowStories.length);
  const baseBlock = Array.from({ length: totalSlots }, (_, idx) => 
    idx < rowStories.length ? rowStories[idx] : null
  );

  // Duplica o bloco base apenas para criar o loop do CSS Marquee
  const infiniteLoopSlots = [...baseBlock, ...baseBlock];

  return (
    <div style={{ overflow: "hidden", width: "100%", flexShrink: 0 }}>
      <div
        className={direction === "left" ? "animate-marquee-slow-left" : "animate-marquee-slow-right"}
        style={{ display: "flex", gap: 14, width: "max-content", alignItems: "center", paddingBlock: 6, animationDuration: `${duration}s` }}
      >
        {infiniteLoopSlots.map((storyData, i) => (
          <ReadCard
            key={i}
            story={storyData}
            seed={(i + seedOff) % 17 + 1}
            tilt={TILTS[(i + tiltOff) % TILTS.length]}
            onClick={() => storyData && onCardClick(storyData)}
          />
        ))}
      </div>
    </div>
  );
}

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
        background: "rgba(26,18,8,0.5)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease",
        padding: 12,
      }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } } @keyframes slideUp { from { transform: translateY(24px) scale(0.97); opacity: 0 } to { transform: translateY(0) scale(1); opacity: 1 } }`}</style>

      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: 520,
          maxWidth: "94vw",
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

        <div className="p-4 sm:p-8" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 14, color: "#7a5a2a", opacity: 0.8 }}>História Anônima</p>
              <p style={{ fontFamily: "Caveat, cursive", fontSize: 13, color: "#7a5a2a", opacity: 0.6 }}>
                {new Date(story.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="touch-manipulation"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 8, minWidth: 44, minHeight: 44, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
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

          <svg width="100%" height="10" viewBox="0 0 448 10" style={{ display: "block", marginBottom: 14 }}>
            <defs>
              <filter id="mdiv">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="11" result="n" />
                <feDisplacementMap in="SourceGraphic" in2="n" scale="2" xChannelSelector="R" yChannelSelector="G" />
              </filter>
            </defs>
            <line x1="0" y1="5" x2="448" y2="5" stroke="#1a1208" strokeWidth="1.5" opacity="0.15" filter="url(#mdiv)" />
          </svg>

          <p style={{ fontFamily: "Caveat, cursive", fontSize: 24, fontWeight: 700, color: "#1a1208", marginBottom: 10 }}>
            {story.title}
          </p>

          <p style={{ fontFamily: "Caveat, cursive", fontSize: 19, color: "#1a1208", lineHeight: 1.6, marginBottom: 20, whiteSpace: "pre-wrap" }}>
            {story.content}
          </p>

          <svg width="100%" height="10" viewBox="0 0 448 10" style={{ display: "block", marginBottom: 12 }}>
            <line x1="0" y1="5" x2="448" y2="5" stroke="#1a1208" strokeWidth="1.5" opacity="0.12" filter="url(#mdiv)" />
          </svg>

          <p style={{ fontFamily: "Caveat, cursive", fontSize: 18, color: "#1a1208", fontWeight: 700, textAlign: "right" }}>
            — {story.authorDisplayName}
          </p>

          <p style={{ fontFamily: "Caveat, cursive", fontSize: 14, color: "#7a5a2a", textAlign: "center", marginTop: 18, opacity: 0.6 }}>
            clique fora para fechar ✦
          </p>
        </div>
      </div>
    </div>
  );
}

export function ReadLetters() {
  const navigate = useNavigate();

  const [displayStories, setDisplayStories] = useState<Story[]>(() => {
    try {
      const cached = localStorage.getItem("anonymous_stories_cache");
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(() => displayStories.length === 0);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Story | null>(null);

  const handleIncomingStories = (incoming: Story[]) => {
    setDisplayStories((prev) => {
      let updatedList: Story[];

      if (prev.length === 0) {
        const fixedStory1 = incoming.find((s) => s.id === 1);
        const remaining = incoming.filter((s) => s.id !== 1);
        const shuffledRemaining = shuffleArray(remaining);

        updatedList = fixedStory1 ? [fixedStory1, ...shuffledRemaining] : shuffledRemaining;
      } else {
        const existingIds = new Set(prev.map((s) => s.id));
        const newStories = incoming.filter((s) => !existingIds.has(s.id));

        if (newStories.length === 0) {
          return prev;
        }

        updatedList = [...prev, ...newStories];
      }

      try {
        localStorage.setItem("anonymous_stories_cache", JSON.stringify(updatedList));
      } catch (err) {
        console.error("Erro ao salvar cache local:", err);
      }

      return updatedList;
    });
  };

  useEffect(() => {
    let isFirstLoad = displayStories.length === 0;

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

  const numRows = 4;

  const rowsStories: (Story | null)[][] = useMemo(() => {
    // Inicializa as 4 fileiras vazias
    const rows: (Story | null)[][] = Array.from({ length: numRows }, () => []);

    // Distribui cada história sequencialmente sem duplicar
    displayStories.forEach((story, index) => {
      const rowIndex = index % numRows;
      rows[rowIndex].push(story);
    });

    return rows;
  }, [displayStories]);

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", overflowY: "auto", overflowX: "hidden", background: "#f7f3eb" }}>
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
        .animate-marquee-slow-right:hover,
        .animate-marquee-slow-left:active,
        .animate-marquee-slow-right:active {
          animation-play-state: paused;
        }
      `}</style>

      {/* Barra Superior Fixo no Topo */}
      <div 
        className="px-3 py-2.5 sm:px-7 sm:py-3.5"
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 30, display: "flex", flexWrap: "wrap", rowGap: 6, justifyContent: "space-between", alignItems: "center", background: "linear-gradient(to bottom, rgba(247,243,235,0.98) 0%, rgba(247,243,235,0.8) 70%, transparent 100%)", backdropFilter: "blur(2px)" }}
      >
        <button
          onClick={() => navigate("/")}
          className="bg-transparent border-none cursor-pointer p-0 touch-manipulation flex items-center"
        >
          <span className="text-lg sm:text-2xl" style={{ fontFamily: "Caveat, cursive", fontWeight: 700, color: "#1a1208" }}>
            Histórias <span style={{ color: "#b07030" }}>Anônimas</span>
          </span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }} className="touch-manipulation">
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible", pointerEvents: "none" }}>
              <defs>
                <filter id="tb-sk">
                  <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="7" result="n" />
                  <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" />
                </filter>
              </defs>
              <rect
                x="2"
                y="2"
                width="calc(100% - 4px)"
                height="calc(100% - 4px)"
                rx="4"
                fill="#1a1208"
                filter="url(#tb-sk)"
                style={{ width: "calc(100% - 4px)", height: "calc(100% - 4px)" }}
              />
            </svg>
            <button
              onClick={() => navigate("/write")}
              style={{
                position: "relative",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "Caveat, cursive",
                fontSize: 15,
                fontWeight: 700,
                color: "#f7f3eb",
                padding: "6px 14px",
                minHeight: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="hidden sm:inline">Escrever uma carta</span>
              <span className="sm:hidden">Escrever</span>
            </button>
          </div>

          <Header />
        </div>
      </div>

      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(80,100,180,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(80,100,180,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

      {/* Esteiras Infinitas */}
      <div style={{ width: "100%", minHeight: "100dvh", display: "flex", flexDirection: "column", justifyContent: "space-evenly", paddingBlock: 4, paddingTop: 68, paddingBottom: 56 }}>
        {ROWS_CONFIG.map((row, i) => (
          <Row   
            key={i}
            rowStories={rowsStories[i]}
            direction={row.dir}
            duration={row.dur}
            seedOff={row.so}
            tiltOff={row.to}
            onCardClick={setSelected}
          />
        ))}
      </div>

      {/* Contador Fixo no Rodapé */}
      <div 
        style={{ 
          position: "fixed", 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 20, 
          height: 48, 
          background: "linear-gradient(to top, rgba(247,243,235,0.98) 0%, rgba(247,243,235,0.85) 70%, transparent 100%)", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          paddingBottom: "env(safe-area-inset-bottom, 6px)",
          pointerEvents: "none",
          backdropFilter: "blur(2px)"
        }}
      >
        <span className="text-xs sm:text-sm text-center px-2" style={{ fontFamily: "Caveat, cursive", color: "#7a5a2a", fontWeight: 700, opacity: 0.85 }}>
          {error ? error : loading ? "carregando histórias..." : `${displayStories.length} histórias anônimas neste lugar ✦ clique em uma carta para ler`}
        </span>
      </div>

      {selected && <LetterModal story={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}