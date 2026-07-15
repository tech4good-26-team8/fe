import { useNavigate } from "react-router-dom";
import { ArchiveIcon, ChatIcon, MicIcon } from "./icons";

interface BottomTabsProps {
  onMicPress: () => void;
}

export function BottomTabs({ onMicPress }: BottomTabsProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-between px-10 pt-8 pb-6 bg-surface border-t border-border shrink-0">
      <button
        onClick={() => navigate("/chat")}
        className="flex flex-col items-center gap-1 text-ink-muted"
      >
        <ChatIcon className="w-6 h-6" />
        <span className="text-xs">채팅</span>
      </button>

      <button
        onClick={onMicPress}
        aria-label="음성 녹음"
        className="absolute left-1/2 -translate-x-1/2 -top-7 w-16 h-16 rounded-full bg-accent shadow-lg shadow-accent/30 flex items-center justify-center"
      >
        <MicIcon className="w-7 h-7 text-white" />
      </button>

      <button
        onClick={() => navigate("/gallery")}
        className="flex flex-col items-center gap-1 text-ink-muted"
      >
        <ArchiveIcon className="w-6 h-6" />
        <span className="text-xs">보관함</span>
      </button>
    </div>
  );
}
