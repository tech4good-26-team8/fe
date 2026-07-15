import type { ReactNode } from "react";

export function Screen({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`w-full max-w-[430px] min-h-svh bg-cream flex flex-col ${className}`}>
      {children}
    </div>
  );
}
