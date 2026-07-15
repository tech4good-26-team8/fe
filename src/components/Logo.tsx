// Placeholder wordmark — swap for the real logo asset once the design team provides one.
export function Logo({ size = 96 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-accent-light text-ink font-bold"
      style={{ width: size, height: size, fontSize: size * 0.24 }}
    >
      패밀로그
    </div>
  );
}
