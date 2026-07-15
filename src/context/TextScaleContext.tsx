import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TextScale = "normal" | "large" | "xlarge";

const SCALE_PX: Record<TextScale, number> = {
  normal: 17,
  large: 19,
  xlarge: 22,
};

const ORDER: TextScale[] = ["normal", "large", "xlarge"];
const STORAGE_KEY = "familog-text-scale";

interface TextScaleContextValue {
  scale: TextScale;
  setScale: (scale: TextScale) => void;
  increase: () => void;
  decrease: () => void;
}

const TextScaleContext = createContext<TextScaleContextValue | null>(null);

export function TextScaleProvider({ children }: { children: ReactNode }) {
  const [scale, setScale] = useState<TextScale>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "normal" || stored === "large" || stored === "xlarge" ? stored : "large";
  });

  useEffect(() => {
    document.documentElement.style.fontSize = `${SCALE_PX[scale]}px`;
    localStorage.setItem(STORAGE_KEY, scale);
  }, [scale]);

  function step(delta: 1 | -1) {
    const index = ORDER.indexOf(scale);
    const next = ORDER[Math.min(ORDER.length - 1, Math.max(0, index + delta))];
    setScale(next);
  }

  return (
    <TextScaleContext.Provider
      value={{ scale, setScale, increase: () => step(1), decrease: () => step(-1) }}
    >
      {children}
    </TextScaleContext.Provider>
  );
}

export function useTextScale() {
  const ctx = useContext(TextScaleContext);
  if (!ctx) throw new Error("useTextScale must be used within TextScaleProvider");
  return ctx;
}
