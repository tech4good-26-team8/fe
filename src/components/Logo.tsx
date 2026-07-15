// Recreates the team's house-roof/infinity mark in a neutral grayscale
// palette instead of the brand's orange gradient (per request: 무채색).
export function Logo({ size = 96 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{ width: size, height: size, background: "#f0efec" }}
    >
      <svg
        viewBox="0 0 240 190"
        style={{ width: size * 0.68, height: size * 0.68 * (190 / 240) }}
        fill="none"
      >
        <circle cx="80" cy="110" r="42" stroke="#3a352e" strokeWidth="12" />
        <circle cx="160" cy="110" r="42" stroke="#3a352e" strokeWidth="12" />
        <path
          d="M55 95 L120 22 L185 95"
          stroke="#3a352e"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="38" cy="110" r="10" fill="#3a352e" />
        <circle cx="202" cy="110" r="10" fill="#e3e0d9" stroke="#b8b3a8" strokeWidth="3" />
      </svg>
    </div>
  );
}
