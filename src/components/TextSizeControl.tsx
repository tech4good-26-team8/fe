import { useTextScale } from "../context/TextScaleContext";

export function TextSizeControl() {
  const { scale, increase, decrease } = useTextScale();

  return (
    <div className="flex items-center rounded-full bg-surface border border-border overflow-hidden shrink-0">
      <button
        onClick={decrease}
        disabled={scale === "normal"}
        aria-label="글씨 작게"
        className="w-10 h-10 flex items-center justify-center text-ink text-sm font-bold disabled:opacity-30"
      >
        가-
      </button>
      <div className="w-px h-5 bg-border" />
      <button
        onClick={increase}
        disabled={scale === "xlarge"}
        aria-label="글씨 크게"
        className="w-10 h-10 flex items-center justify-center text-ink text-lg font-bold disabled:opacity-30"
      >
        가+
      </button>
    </div>
  );
}
