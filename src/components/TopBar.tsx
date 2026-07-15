import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "./icons";

interface TopBarProps {
  title?: string;
  onBack?: () => void;
}

export function TopBar({ title, onBack }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center w-full min-h-[52px] px-4 py-3 shrink-0">
      <button
        onClick={onBack ?? (() => navigate(-1))}
        className="absolute left-3 p-1 text-ink"
        aria-label="뒤로가기"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      {title && <h1 className="text-[17px] font-semibold text-ink">{title}</h1>}
    </div>
  );
}
