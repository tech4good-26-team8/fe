import type { FamilyMember } from "../types";

const statusBadge: Record<FamilyMember["status"], string | null> = {
  active: null,
  busy: "💻",
  sleeping: "💤",
  none: null,
};

interface AvatarProps {
  member: FamilyMember;
  size?: number;
  showName?: boolean;
  showUpdateBubble?: boolean;
}

export function Avatar({ member, size = 88, showName = true, showUpdateBubble = false }: AvatarProps) {
  const badge = statusBadge[member.status];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {showUpdateBubble && (
          <div className="absolute -top-3 right-1 rounded-2xl rounded-br-sm bg-surface border border-border px-2.5 py-1.5 shadow-sm z-10">
            <span className="text-accent text-xs tracking-widest font-bold">···</span>
          </div>
        )}
        <div
          className={`bg-surface border flex items-center justify-center rounded-full w-full h-full ${
            showUpdateBubble ? "border-2 border-accent" : "border-border"
          }`}
          style={{ fontSize: size * 0.5 }}
        >
          {member.emoji}
        </div>
        {badge && (
          <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-surface border border-border shadow-sm text-sm">
            {badge}
          </div>
        )}
      </div>
      {showName && (
        <span className="text-sm text-ink-muted">
          {member.isMe ? "나" : member.name}
        </span>
      )}
    </div>
  );
}
