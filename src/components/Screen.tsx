import type { CSSProperties, ReactNode } from "react";

export function Screen({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`w-full max-w-[430px] h-dvh bg-cream flex flex-col overflow-hidden ${className}`} style={style}>
      {children}
    </div>
  );
}
