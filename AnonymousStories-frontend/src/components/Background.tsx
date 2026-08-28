import React from "react"

const LETTERS_A = [
  { from: "Cecília", to: "Minha querida avó", date: "14 mar, 1962", city: "Rio de Janeiro", body: "Cheguei bem à cidade nova. O apartamento é pequeno mas tem uma janela grande que dá pra ver o mar. Estou com saudades..." },
  { from: "Eduardo", to: "Caro amigo Henrique", date: "03 jul, 1948", city: "Lisboa, Portugal", body: "A guerra acabou e finalmente posso escrever sem medo. Minha família está bem. Espero que você tenha passado por tudo isso sem maiores danos..." },
  { from: "Margarida", to: "Meu amado", date: "22 dez, 1971", city: "Recife", body: "Penso em você todo dia. O inverno aqui chegou cedo este ano. Comprei aquela fita azul que você tanto gostou..." },
  { from: "Augusto", to: "Papai", date: "09 set, 1955", city: "São Paulo", body: "Passei no vestibular! Medicina, como o senhor sempre quis. Foi difícil mas consegui. Por favor avisa a mãe antes que ela leia no jornal..." },
  { from: "Beatriz", to: "Tia Dora", date: "01 mai, 1938", city: "Porto Alegre", body: "Casei em silêncio, numa manhã de chuva. Ele é bom homem e me trata bem. O vestido era branco com renda na barra..." },
]

const LETTERS_B = [
  { from: "Theodoro", to: "Ao meu filho querido", date: "18 fev, 1967", city: "Manaus", body: "Seu avô faleceu na última sexta. Ele foi em paz, dormindo. Deixou a velha câmera pra você. Dizia que só quem sonha deveria fotografar..." },
  { from: "Inês", to: "Professora Amélia", date: "30 out, 1952", city: "Belo Horizonte", body: "A senhora mudou minha vida sem saber. Aquele poema que nos leu numa tarde de quinta-feira — eu o decorei inteiro..." },
  { from: "Reinaldo", to: "Minha irmã Lurdes", date: "07 jun, 1943", city: "Campos dos Goytacazes", body: "Parti nesta manhã no primeiro trem. Não tive coragem de acordar ninguém pra se despedir. Cuide da mãe por mim..." },
  { from: "Dorinha", to: "Amor meu", date: "25 jan, 1978", city: "Florianópolis", body: "Você prometeu que ia me escrever toda semana. Já faz três semanas sem notícia. Mesmo assim ainda acendo a luz da varanda toda noite..." },
  { from: "Sebastião", to: "Caríssimo Padre Antônio", date: "12 abr, 1961", city: "Salvador", body: "O menino nasceu saudável e forte. Chamamos de José. Ele tem os olhos da mãe e o nariz torto do avô. A graça de Deus é grande..." },
]

const LETTERS_C = [
  { from: "Helena", to: "Querida Fernanda", date: "03 ago, 1985", city: "Curitiba", body: "Fui ao show semana passada. Chorei do começo ao fim sem saber por quê. A vida parece muito grande e muito curta ao mesmo tempo..." },
  { from: "Arnaldo", to: "Meu velho companheiro", date: "17 nov, 1934", city: "Campinas", body: "A fazenda foi vendida. Quarenta anos de trabalho e foi embora num papel. Mas estou bem. O que é nosso de verdade ninguém toma..." },
  { from: "Vitória", to: "Mãe", date: "29 mar, 1990", city: "Paris, França", body: "Cheguei em Paris. O frio é diferente do nosso — ele entra nos ossos de outro jeito. Mas a cidade é linda. Sinto sua falta a cada esquina..." },
  { from: "Cláudio", to: "Amigo Joca", date: "14 set, 1969", city: "Belém do Pará", body: "Estou me candidatando à prefeitura. Todo mundo diz que é loucura. Mas alguém tem que tentar. Se não ganhar, pelo menos terei tentado..." },
  { from: "Noemia", to: "Minha filha do coração", date: "06 out, 1947", city: "Fortaleza", body: "Guardo todas as suas cartas numa caixinha de madeira que o seu pai fez. Quando a saudade aperta, abro e leio uma por uma..." },
]

const LETTERS_D = [
  { from: "Otávio", to: "Querida Mariana", date: "11 nov, 1965", city: "Ouro Preto", body: "As ladeiras continuam lindas sob a névoa da manhã. Guardei aquela flor seca no meio do livro que você me deu..." },
  { from: "Isabel", to: "Meu querido irmão", date: "05 abr, 1950", city: "Niterói", body: "Chegaram as fotografias do aniversário. Todos saíram tão sorridentes! Espero poder visitar vocês no próximo feriado..." },
  { from: "Gabriel", to: "Querida Lúcia", date: "20 ago, 1974", city: "Goiânia", body: "O sol aqui ilumina tudo com uma cor dourada no fim da tarde. Me faz lembrar dos nossos passeios no parque..." },
  { from: "Teresa", to: "Minha mãe", date: "15 dez, 1982", city: "Santos", body: "Aprendi a fazer aquela receita de bolo que a senhora fazia. O cheiro me fez voltar à infância por alguns instantes..." },
  { from: "Valter", to: "Amigo Camargo", date: "02 fev, 1958", city: "Vitória", body: "O mar hoje está calmo. Trabalhar no porto me traz paz. Espero que suas viagens estejam sendo tranquilas..." },
]

interface Letter { from: string; to: string; date: string; city: string; body: string }

function SketchCard({ letter, tilt, seed }: { letter: Letter; tilt: number; seed: number }) {
  const w = 260
  const h = 200
  return (
    <div style={{ width: w, height: h, flexShrink: 0, transform: `rotate(${tilt}deg)`, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, boxShadow: "3px 5px 0px rgba(30,20,10,0.15)", borderRadius: 2 }} />
      <div
        style={{
          position: "absolute", inset: 0, borderRadius: 2,
          background: seed % 5 === 0 ? "#fffef5" : seed % 5 === 1 ? "#f5f8ff" : seed % 5 === 2 ? "#fff5f5" : seed % 5 === 3 ? "#f5fff7" : "#fdf5ff",
        }}
      />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(transparent, transparent 21px, rgba(100,120,200,0.1) 21px, rgba(100,120,200,0.1) 22px)", backgroundPositionY: "34px", borderRadius: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, bottom: 0, left: 34, width: 1, background: "rgba(220,80,60,0.2)" }} />
      <svg width={w} height={h} style={{ position: "absolute", inset: 0 }} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <filter id={`sk-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="4" seed={seed} result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/>
          </filter>
        </defs>
        <rect x={4} y={4} width={w-8} height={h-8} rx={2} fill="none" stroke="#1a1208" strokeWidth="2" filter={`url(#sk-${seed})`}/>
      </svg>
      <div style={{ position: "absolute", inset: "10px 12px 10px 42px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <div>
            <p style={{ fontFamily: "Caveat, cursive", fontSize: 10, color: "#4a3820", opacity: 0.6 }}>{letter.city}</p>
            <p style={{ fontFamily: "Caveat, cursive", fontSize: 10, color: "#4a3820", opacity: 0.5 }}>{letter.date}</p>
          </div>
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" style={{ opacity: 0.35 }}>
            <rect x="1" y="1" width="22" height="16" rx="1" stroke="#1a1208" strokeWidth="1.5"/>
            <polyline points="1,1 12,10 23,1" stroke="#1a1208" strokeWidth="1.5"/>
          </svg>
        </div>
        <p style={{ fontFamily: "Caveat, cursive", fontSize: 11, color: "#2a1a08", opacity: 0.55, marginBottom: 5 }}>{letter.to},</p>
        <p style={{ fontFamily: "Caveat, cursive", fontSize: 13.5, color: "#1a1208", lineHeight: 1.55 }}>{letter.body}</p>
        <p style={{ fontFamily: "Caveat, cursive", fontSize: 14, color: "#1a1208", fontWeight: 700, textAlign: "right", marginTop: 4 }}>— {letter.from}</p>
      </div>
    </div>
  )
}

const TILTS_A = [-4, 2, -6, 1, -3, 5, -2]
const TILTS_B = [5, -3, 4, -5, 2, -1, 6]
const TILTS_C = [-2, 4, -3, 6, -4, 2, -5]
const TILTS_D = [-5, 3, -2, 4, -6, 1, -4]

function Track({ letters, duration, direction, tilts, opacity, seedOff }: {
  letters: Letter[]; duration: number; direction: "left" | "right"; tilts: number[]; opacity: number; seedOff: number
}) {
  // Criamos 1 bloco com 4 cópias da lista original
  const singleSet = [...letters, ...letters, ...letters, ...letters]

  return (
    <div style={{ overflow: "hidden", width: "100%", opacity, display: "flex" }}>
      <div
        style={{
          display: "flex",
          gap: "2.5rem",
          alignItems: "center",
          animationName: direction === "left" ? "marquee-left" : "marquee-right",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          paddingBlock: 20,
          paddingRight: "2.5rem", // Mantém o gap perfeito entre as duas metades no loop
          willChange: "transform",
        }}
      >
        {/* Renderizamos exatamente 2 blocos idênticos lado a lado para o loop matemático perfeito (-50% transform) */}
        {singleSet.map((letter, i) => (
          <SketchCard key={`a-${i}`} letter={letter} tilt={tilts[i % tilts.length]} seed={(i + seedOff) % 12 + 1} />
        ))}
        {singleSet.map((letter, i) => (
          <SketchCard key={`b-${i}`} letter={letter} tilt={tilts[i % tilts.length]} seed={(i + seedOff) % 12 + 1} />
        ))}
      </div>
    </div>
  )
}

export default function Background({ fadeStrength = "medium" }: { fadeStrength?: "light" | "medium" | "heavy" }) {
  const fadeOpacity = fadeStrength === "light" ? 0.82 : fadeStrength === "heavy" ? 0.97 : 0.92

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", zIndex: 0, pointerEvents: "none" }}>
      {/* CSS das animações de Marquee Perfeito */}
      <style>{`
        @keyframes marquee-left {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes marquee-right {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
      `}</style>

      {/* Papel quadriculado */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(80,100,180,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(80,100,180,0.06) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

      {/* Container que cobre 100% dos cantos ao rotacionar a esteira */}
      <div style={{ position: "absolute", inset: "-250%", transform: "rotate(-45deg) scale(1.15)", display: "flex", flexDirection: "column", justifyContent: "center", gap: 10, pointerEvents: "none" }}>
        {/* Linhas intercaladas (Esquerda/Direita) que rolam infinitamente desde a inicialização */}
        <Track letters={LETTERS_A} duration={60} direction="left"   tilts={TILTS_A} opacity={0.75} seedOff={0} />
        <Track letters={LETTERS_B} duration={75} direction="right"  tilts={TILTS_B} opacity={0.65} seedOff={3} />
        <Track letters={LETTERS_C} duration={55} direction="left"   tilts={TILTS_C} opacity={0.55} seedOff={6} />
        <Track letters={LETTERS_D} duration={80} direction="right"  tilts={TILTS_D} opacity={0.70} seedOff={9} />
        <Track letters={LETTERS_A} duration={65} direction="left"   tilts={TILTS_B} opacity={0.60} seedOff={2} />
        <Track letters={LETTERS_B} duration={85} direction="right"  tilts={TILTS_C} opacity={0.65} seedOff={5} />
        <Track letters={LETTERS_C} duration={70} direction="left"   tilts={TILTS_A} opacity={0.55} seedOff={8} />
        <Track letters={LETTERS_D} duration={78} direction="right"  tilts={TILTS_B} opacity={0.70} seedOff={1} />
        <Track letters={LETTERS_A} duration={62} direction="left"   tilts={TILTS_D} opacity={0.50} seedOff={4} />
        <Track letters={LETTERS_B} duration={82} direction="right"  tilts={TILTS_A} opacity={0.60} seedOff={7} />
      </div>

      {/* Máscara radial de gradiente do centro */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 60% at 50% 50%, rgba(247,243,235,${fadeOpacity}) 0%, rgba(247,243,235,${fadeOpacity - 0.2}) 55%, transparent 100%)`, pointerEvents: "none" }} />
    </div>
  )
}