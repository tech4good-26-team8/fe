import { useAudioRecorder, type RecordingResult } from "../hooks/useAudioRecorder";
import { DeleteIcon, MicIcon } from "./icons";

interface RecordSheetProps {
  onCancel: () => void;
  onSend: (result: RecordingResult) => void;
}

export function RecordSheet({ onCancel, onSend }: RecordSheetProps) {
  const { recorderState, seconds, stop, cancel } = useAudioRecorder();

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const blocked = recorderState === "denied" || recorderState === "unsupported";

  async function handleSend() {
    const result = await stop();
    if (result) onSend(result);
    else onCancel();
  }

  function handleCancel() {
    cancel();
    onCancel();
  }

  return (
    <div className="absolute inset-0 bg-ink/40 flex items-end justify-center z-20">
      <div className="relative w-full max-w-[430px] bg-cream rounded-t-3xl px-8 pt-8 pb-10 flex flex-col items-center gap-6">
        <button
          onClick={handleCancel}
          aria-label="취소"
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-beige flex items-center justify-center text-ink-muted"
        >
          <DeleteIcon className="w-4 h-4" />
        </button>

        {blocked ? (
          <span className="text-sm text-ink-muted text-center">
            {recorderState === "unsupported"
              ? "이 브라우저는 음성 녹음을 지원하지 않아요"
              : "마이크 권한이 필요해요"}
          </span>
        ) : (
          <span className="text-2xl font-semibold text-ink tabular-nums">
            {mm}:{ss}
          </span>
        )}

        <button
          onClick={handleSend}
          disabled={blocked}
          aria-label="녹음 종료하고 보내기"
          className={`w-20 h-20 rounded-full bg-accent-light flex items-center justify-center text-ink disabled:opacity-50 ${
            recorderState === "recording" ? "animate-pulse" : ""
          }`}
        >
          <MicIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
