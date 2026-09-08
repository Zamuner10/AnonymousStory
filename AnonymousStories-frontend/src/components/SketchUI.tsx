import React from 'react';

// --- SketchInput ---
interface SketchInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  seed?: number;
  autoComplete?: string;
}

export function SketchInput({
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  seed = 1,
  autoComplete,
}: SketchInputProps) {
  const filterId = `input-sk-${seed}`;
  const wrapperClass = `sketch-input-${seed}`;

  return (
    <div style={{ position: 'relative', width: '100%' }} className={wrapperClass}>
      <style>{`
        .${wrapperClass} input {
          color-scheme: light;
        }
        .${wrapperClass} input:-webkit-autofill,
        .${wrapperClass} input:-webkit-autofill:hover,
        .${wrapperClass} input:-webkit-autofill:focus {
          -webkit-text-fill-color: #1a1208;
          -webkit-box-shadow: 0 0 0 1000px rgba(247,243,235,0.95) inset;
          box-shadow: 0 0 0 1000px rgba(247,243,235,0.95) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.04"
              numOctaves="3"
              seed={seed}
              result="n"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="n"
              scale="2.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
        <rect
          x="2"
          y="2"
          width="calc(100% - 4px)"
          height="calc(100% - 4px)"
          rx="4"
          fill="rgba(247,243,235,0.7)"
          stroke="#1a1208"
          strokeWidth="1.8"
          filter={`url(#${filterId})`}
        />
      </svg>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          minHeight: 44, // Garantia obrigatoria de toque mobile (44px)
          padding: '10px 14px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontFamily: 'Caveat, cursive',
          fontSize: 18,
          color: '#1a1208',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// --- SketchButton ---
interface SketchButtonProps {
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  seed?: number;
  variant?: 'primary' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
}

export function SketchButton({
  children,
  onClick,
  seed = 1,
  variant = 'primary',
  type = 'button',
}: SketchButtonProps) {
  const filterId = `btn-sk-${seed}`;
  const wrapperClass = `sketch-btn-${seed}`;
  const isPrimary = variant === 'primary';

  const baseFill = isPrimary ? '#1a1208' : 'transparent';
  const hoverFill = isPrimary ? '#f7f3eb' : '#1a1208';
  const baseText = isPrimary ? '#f7f3eb' : '#1a1208';
  const hoverText = isPrimary ? '#1a1208' : '#f7f3eb';

  return (
    <div style={{ position: 'relative', width: '100%' }} className={wrapperClass}>
      <style>{`
        .${wrapperClass} rect {
          transition: fill 0.2s ease;
        }
        .${wrapperClass}:hover rect {
          fill: ${hoverFill};
        }
        .${wrapperClass} button {
          transition: color 0.2s ease;
        }
        .${wrapperClass}:hover button {
          color: ${hoverText} !important;
        }
      `}</style>
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
          pointerEvents: 'none',
        }}
      >
        <defs>
          <filter id={filterId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.045"
              numOctaves="3"
              seed={seed}
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
          width="calc(100% - 6px)"
          height="calc(100% - 6px)"
          rx="4"
          fill={baseFill}
          stroke="#1a1208"
          strokeWidth={isPrimary ? '0' : '2'}
          filter={`url(#${filterId})`}
        />
      </svg>
      <button
        type={type}
        onClick={onClick}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          minHeight: 44, // Garantia obrigatoria de toque mobile (44px)
          minWidth: 44,
          padding: '10px 16px',
          background: 'transparent',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          fontFamily: 'Caveat, cursive',
          fontSize: 20,
          fontWeight: 700,
          color: baseText,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </button>
    </div>
  );
}

// --- Label ---
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      style={{
        display: 'block',
        fontFamily: 'Caveat, cursive',
        fontSize: 17,
        color: '#1a1208',
        marginBottom: 4,
        fontWeight: 600,
      }}
    >
      {children}
    </label>
  );
}

// --- SketchDivider ---
export function SketchDivider({ seed = 1 }: { seed?: number }) {
  const filterId = `div-sk-${seed}`;

  return (
    <svg
      width="100%"
      height="12"
      viewBox="0 0 300 12"
      preserveAspectRatio="none"
      style={{ display: 'block', margin: '12px 0' }}
    >
      <defs>
        <filter id={filterId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="3"
            seed={seed}
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
        d="M 5 6 Q 75 3 150 6 Q 225 9 295 6"
        stroke="#1a1208"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        filter={`url(#${filterId})`}
        opacity="0.3"
      />
    </svg>
  );
}