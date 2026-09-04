// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import Background from "../components/Background";

function Doodles() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <filter id="doodle-sketch">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <text
        x="110"
        y="180"
        fontSize="22"
        fill="#1a1208"
        opacity="0.15"
        filter="url(#doodle-sketch)"
        fontFamily="serif"
      >
        ✦
      </text>
      <text
        x="1080"
        y="200"
        fontSize="18"
        fill="#1a1208"
        opacity="0.13"
        filter="url(#doodle-sketch)"
        fontFamily="serif"
      >
        ✦
      </text>
      <text
        x="200"
        y="520"
        fontSize="14"
        fill="#1a1208"
        opacity="0.11"
        filter="url(#doodle-sketch)"
        fontFamily="serif"
      >
        ✦
      </text>
      <text
        x="980"
        y="500"
        fontSize="20"
        fill="#1a1208"
        opacity="0.12"
        filter="url(#doodle-sketch)"
        fontFamily="serif"
      >
        ✦
      </text>
      <g opacity="0.16" filter="url(#doodle-sketch)">
        <path
          d="M 310 350 C 330 345 350 350 365 355"
          stroke="#1a1208"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 358 348 L 366 355 L 356 361"
          stroke="#1a1208"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <g opacity="0.16" filter="url(#doodle-sketch)">
        <path
          d="M 890 350 C 870 345 850 350 835 355"
          stroke="#1a1208"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 842 348 L 834 355 L 844 361"
          stroke="#1a1208"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path
        d="M 165 430 C 165 427 160 422 155 426 C 150 422 145 427 145 430 C 145 435 155 442 155 442 C 155 442 165 435 165 430 Z"
        stroke="#1a1208"
        strokeWidth="1.5"
        fill="none"
        opacity="0.13"
        filter="url(#doodle-sketch)"
      />
      <path
        d="M 1058 420 C 1058 417 1053 412 1048 416 C 1043 412 1038 417 1038 420 C 1038 425 1048 432 1048 432 C 1048 432 1058 425 1058 420 Z"
        stroke="#1a1208"
        strokeWidth="1.5"
        fill="none"
        opacity="0.12"
        filter="url(#doodle-sketch)"
      />
      <circle
        cx="178"
        cy="355"
        r="18"
        stroke="#1a1208"
        strokeWidth="1.5"
        fill="none"
        opacity="0.09"
        filter="url(#doodle-sketch)"
      />
      <circle
        cx="1025"
        cy="355"
        r="14"
        stroke="#1a1208"
        strokeWidth="1.5"
        fill="none"
        opacity="0.09"
        filter="url(#doodle-sketch)"
      />
    </svg>
  );
}

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#f7f3eb]">
      <Background fadeStrength="medium" />
      <Doodles />

      <div className="relative z-10 text-center px-6 flex flex-col items-center">
        <span className="font-['Caveat'] text-base text-[#1a1208] text-[25px] tracking-wider mb-4 block">
          um espaço para o que você carrega por dentro
        </span>

        <div className="relative mb-1">
          <h1 className="font-['Caveat'] text-[clamp(64px,11vw,112px)] text-[#1a1208] font-bold leading-none tracking-tight m-0">
            Histórias
          </h1>
          <svg className="block -mt-1 w-full h-[10px]" viewBox="0 0 400 10">
            <defs>
              <filter id="ul-sketch">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.05"
                  numOctaves="3"
                  seed="3"
                  result="n"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="n"
                  scale="2"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
            </defs>
            <path
              d="M 10 6 Q 100 3 200 6 Q 300 9 390 5"
              stroke="#1a1208"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              filter="url(#ul-sketch)"
              opacity="0.25"
            />
          </svg>
        </div>

        <h1 className="font-['Caveat'] text-[clamp(64px,11vw,112px)] text-[#b07030] font-bold leading-none tracking-tight m-0 mb-7">
          Anônimas.
        </h1>

        <p className="font-['Caveat'] text-[30px] text-[#1a1208] max-w-[420px] leading-[1.7] mb-9">
          Aqui você pode deixar sua história para qualquer um ler — seja ela de
          um amor, uma conquista ou uma perda. Sinta-se à vontade para deixar a
          sua marca.
        </p>

        <div className="flex items-center gap-[14px]">
          {/* Botão 1: Escrever uma carta */}
          <div className="relative w-[194px] h-[50px] group transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 194 50"
            >
              <defs>
                <filter id="btn-sketch">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.045"
                    numOctaves="3"
                    seed="5"
                    result="n"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="n"
                    scale="3"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              <rect
                x="3"
                y="3"
                width="188"
                height="44"
                rx="4"
                className="fill-[#1a1208] group-hover:fill-[#f7f3eb] stroke-[#1a1208] transition-colors duration-200"
                strokeWidth="2.2"
                filter="url(#btn-sketch)"
              />
            </svg>
            <button
              onClick={() => navigate("/login")}
              className="relative z-10 w-full h-full px-8 py-[13px] bg-transparent text-[#f7f3eb] group-hover:text-[#1a1208] font-['Caveat'] font-bold text-[19px] border-none cursor-pointer flex items-center justify-center transition-colors duration-200"
            >
              Escrever uma carta
            </button>
          </div>

          {/* Botão 2: Ler cartas */}
          <div className="relative w-[130px] h-[50px] group transition-transform duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 hover:scale-[1.02]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 130 50"
            >
              <defs>
                <filter id="btn2-sketch">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.045"
                    numOctaves="3"
                    seed="9"
                    result="n"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="n"
                    scale="3"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                </filter>
              </defs>
              <rect
                x="3"
                y="3"
                width="124"
                height="44"
                rx="4"
                className="fill-[#1a1208] group-hover:fill-[#f7f3eb] stroke-[#1a1208] transition-colors duration-200"
                strokeWidth="2.2"
                filter="url(#btn2-sketch)"
              />
            </svg>
            <button
              onClick={() => navigate("/feed")}
              className="relative z-10 w-full h-full px-6 py-[13px] bg-transparent text-[#f7f3eb] group-hover:text-[#1a1208] font-['Caveat'] font-semibold text-[19px] border-none cursor-pointer flex items-center justify-center transition-colors duration-200"
            >
              Ler cartas
            </button>
          </div>
        </div>
      </div>

      {/* Assinatura discreta do criador no canto inferior direito */}
      <div className="absolute bottom-4 right-6 pointer-events-none z-10 select-none">
        <span className="font-['Caveat'] text-lg text-[#1a1208]/35 tracking-widest font-medium">
          created by kz
        </span>
      </div>
    </div>
  );
}