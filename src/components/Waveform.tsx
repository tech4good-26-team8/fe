const PATTERN = [6, 14, 9, 18, 11, 20, 8, 15, 10, 6];

export function Waveform({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-end gap-0.5 ${className}`}>
      {PATTERN.map((h, i) => (
        <span key={i} className="w-0.5 bg-current rounded-full opacity-70" style={{ height: h }} />
      ))}
    </div>
  );
}
