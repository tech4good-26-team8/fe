import { useEffect, useState } from "react";
import { DeleteIcon, MicIcon, SendIcon } from "./icons";

interface RecordSheetProps {
  onCancel: () => void;
  onSend: () => void;
}

export function RecordSheet({ onCancel, onSend }: RecordSheetProps) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="absolute inset-0 bg-ink/40 flex items-end justify-center z-20">
      <div className="w-full max-w-[430px] bg-surface rounded-t-3xl px-8 pt-8 pb-10 flex flex-col items-center gap-6 shadow-2xl">
        <span className="text-2xl font-semibold text-ink tabular-nums">
          {mm}:{ss}
        </span>
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center animate-pulse">
          <MicIcon className="w-8 h-8 text-white" />
        </div>
        <div className="flex items-center gap-10">
          <button
            onClick={onCancel}
            aria-label="취소"
            className="w-12 h-12 rounded-full bg-cream border border-border flex items-center justify-center text-ink"
          >
            <DeleteIcon className="w-5 h-5" />
          </button>
          <button
            onClick={onSend}
            aria-label="보내기"
            className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white"
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
