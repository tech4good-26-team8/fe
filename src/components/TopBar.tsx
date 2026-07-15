import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "./icons";

interface TopBarProps {
  title?: string;
  onBack?: () => void;
}

export function TopBar({ title, onBack }: TopBarProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center w-full px-4 py-4 shrink-0">
      <button
        onClick={onBack ?? (() => navigate(-1))}
        className="absolute left-4 p-1 text-ink"
        aria-label="뒤로가기"
      >
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      {title && <h1 className="text-lg font-semibold text-ink">{title}</h1>}
    </div>
  );
}
