function Logo({ light = false }) {
  return (
    <div className={`logo ${light ? "logo-light" : ""}`}>
      <svg viewBox="0 0 100 100" width="40" height="40" aria-hidden="true">
        {/* Outer silver rim & black band */}
        <circle cx="50" cy="50" r="48" fill="#1C1D1F" stroke="#D1D5DB" strokeWidth="1.5" />

        {/* Letters B - M - W */}
        <text
          x="50"
          y="12"
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="700"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          transform="rotate(-42 50 50)"
        >
          B
        </text>
        <text
          x="50"
          y="12"
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="700"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
        >
          M
        </text>
        <text
          x="50"
          y="12"
          fill="#FFFFFF"
          fontSize="11"
          fontWeight="700"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          transform="rotate(42 50 50)"
        >
          W
        </text>

        {/* Inner circle quadrants (clockwise from top-left: Blue, White, Blue, White) */}
        <path d="M 50 50 L 50 22 A 28 28 0 0 0 22 50 Z" fill="#0066B1" />
        <path d="M 50 50 L 50 22 A 28 28 0 0 1 78 50 Z" fill="#FFFFFF" />
        <path d="M 50 50 L 78 50 A 28 28 0 0 1 50 78 Z" fill="#0066B1" />
        <path d="M 50 50 L 50 78 A 28 28 0 0 1 22 50 Z" fill="#FFFFFF" />

        {/* Silver inner ring & quadrant dividing lines */}
        <circle cx="50" cy="50" r="28" fill="none" stroke="#D1D5DB" strokeWidth="1.2" />
        <line x1="22" y1="50" x2="78" y2="50" stroke="#D1D5DB" strokeWidth="1" />
        <line x1="50" y1="22" x2="50" y2="78" stroke="#D1D5DB" strokeWidth="1" />
      </svg>
      <span>
        BMW <strong>ServiceCare</strong>
      </span>
    </div>
  );
}

export default Logo;
