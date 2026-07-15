type IconProps = { className?: string };

const base = "stroke-current fill-none";

export function PlusIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round">
      <line className={base} x1="12" y1="5" x2="12" y2="19" />
      <line className={base} x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className={base} d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path className={base} d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function UserIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <circle className={base} cx="12" cy="8" r="4" />
      <path className={base} d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

export function MicIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect className={base} x="9" y="3" width="6" height="11" rx="3" />
      <path className={base} d="M5 11a7 7 0 0 0 14 0" />
      <line className={base} x1="12" y1="18" x2="12" y2="22" />
      <line className={base} x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}

export function KeyboardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect className={base} x="2" y="6" width="20" height="12" rx="2" />
      <line className={base} x1="6" y1="10" x2="6" y2="10" />
      <line className={base} x1="10" y1="10" x2="10" y2="10" />
      <line className={base} x1="14" y1="10" x2="14" y2="10" />
      <line className={base} x1="18" y1="10" x2="18" y2="10" />
      <line className={base} x1="7" y1="14" x2="17" y2="14" />
    </svg>
  );
}

export function ImageIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect className={base} x="3" y="4" width="18" height="16" rx="2" />
      <circle className={base} cx="8.5" cy="9.5" r="1.5" />
      <path className={base} d="M21 16l-5-5-4 4-3-3-6 6" />
    </svg>
  );
}

export function ChatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className={base} d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.5A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

export function ArrowLeftIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line className={base} x1="19" y1="12" x2="5" y2="12" />
      <polyline className={base} points="12 19 5 12 12 5" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line className={base} x1="5" y1="12" x2="19" y2="12" />
      <polyline className={base} points="12 5 19 12 12 19" />
    </svg>
  );
}

export function SendIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line className={base} x1="12" y1="19" x2="12" y2="5" />
      <polyline className={base} points="6 11 12 5 18 11" />
    </svg>
  );
}

export function PlayIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className={base} d="M6 4l14 8-14 8V4Z" />
    </svg>
  );
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line className={base} x1="8" y1="4" x2="8" y2="20" />
      <line className={base} x1="16" y1="4" x2="16" y2="20" />
    </svg>
  );
}

export function DeleteIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line className={base} x1="18" y1="6" x2="6" y2="18" />
      <line className={base} x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className={base} d="M10 14a5 5 0 0 0 7.07 0l2-2a5 5 0 0 0-7.07-7.07l-1 1" />
      <path className={base} d="M14 10a5 5 0 0 0-7.07 0l-2 2a5 5 0 0 0 7.07 7.07l1-1" />
    </svg>
  );
}

export function CameraIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className={base} d="M4 8a2 2 0 0 1 2-2h1.5l1-2h7l1 2H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle className={base} cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export function ArchiveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className={base} d="M3 7l1.5-3h15L21 7" />
      <rect className={base} x="3" y="7" width="18" height="13" rx="1.5" />
      <line className={base} x1="9.5" y1="11.5" x2="14.5" y2="11.5" />
    </svg>
  );
}

export function HomeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path className={base} d="M3 10.5 12 3l9 7.5" />
      <path className={base} d="M5 9.5V21h14V9.5" />
      <path className={base} d="M9.5 21v-6h5v6" />
    </svg>
  );
}
