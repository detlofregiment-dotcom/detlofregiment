export function Crest({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} role="img" aria-label="Detlof Preparatory School crest">
      <defs>
        <linearGradient id="crest-purple" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9e00d4" />
          <stop offset="100%" stopColor="#8300c6" />
        </linearGradient>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffc900" />
          <stop offset="100%" stopColor="#fee605" />
        </linearGradient>
      </defs>

      {/* Outer shield */}
      <path
        d="M60 4 L112 20 V68 C112 104 88 126 60 136 C32 126 8 104 8 68 V20 Z"
        fill="url(#crest-purple)"
        stroke="#fee605"
        strokeWidth="3"
      />
      {/* Inner shield line */}
      <path
        d="M60 13 L102 26 V66 C102 96 84 116 60 126 C36 116 18 96 18 66 V26 Z"
        fill="none"
        stroke="#fee605"
        strokeWidth="1.2"
        opacity="0.7"
      />

      {/* Star */}
      <path
        d="M60 22 L63.2 29.4 L71 29.4 L65.2 34.2 L67.2 41.4 L60 37 L53.5 41.4 L55.5 34.2 L49 29.4 L56.8 29.4 Z"
        fill="#fee605"
      />

      {/* Scales of balance */}
      <g stroke="#fee605" strokeWidth="2" fill="none" strokeLinecap="round">
        <line x1="60" y1="44" x2="60" y2="64" />
        <line x1="44" y1="50" x2="76" y2="50" />
        {/* left pan */}
        <line x1="44" y1="50" x2="38" y2="62" />
        <line x1="44" y1="50" x2="50" y2="62" />
        <path d="M36 62 Q44 70 52 62" />
        {/* right pan */}
        <line x1="76" y1="50" x2="70" y2="62" />
        <line x1="76" y1="50" x2="82" y2="62" />
        <path d="M68 62 Q76 70 84 62" />
      </g>

      {/* Open book */}
      <g>
        <path
          d="M38 88 Q49 82 60 88 Q71 82 82 88 V104 Q71 98 60 104 Q49 98 38 104 Z"
          fill="#fd0000"
        />
        <line x1="60" y1="88" x2="60" y2="104" stroke="#fff" strokeWidth="1.5" />
      </g>

      {/* Banner */}
      <path d="M30 112 L90 112 L86 124 L34 124 Z" fill="#fff" stroke="#fee605" strokeWidth="1.5" />
      <text
        x="60"
        y="120"
        textAnchor="middle"
        fontSize="7"
        fill="#8300c6"
        fontFamily="Georgia, serif"
        letterSpacing="1.5"
        fontWeight="bold"
      >
        WISDOM
      </text>
    </svg>
  );
}
