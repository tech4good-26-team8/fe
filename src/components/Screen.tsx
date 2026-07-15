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
    <div className={`w-full max-w-[430px] min-h-svh bg-cream flex flex-col ${className}`} style={style}>
      {children}
    </div>
  );
}
