import logoMark from "../assets/logo-mark.png";

export function Logo({ size = 96 }: { size?: number }) {
  return <img src={logoMark} alt="패밀로그" style={{ width: size, height: size }} />;
}
