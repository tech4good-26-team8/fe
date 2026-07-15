export function Logo({ size = 96 }: { size?: number }) {
  return <img src="/logo.png" alt="패밀로그" style={{ width: size, height: size }} />;
}
