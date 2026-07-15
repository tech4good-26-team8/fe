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
          <div className="absolute -top-3 right-1 rounded-2xl rounded-br-sm bg-beige px-2.5 py-1.5 shadow-sm z-10">
            <span className="text-ink-muted text-xs tracking-widest">···</span>
          </div>
        )}
        <div
          className={`${member.bg} flex items-center justify-center rounded-full w-full h-full`}
          style={{ fontSize: size * 0.5 }}
        >
          {member.emoji}
        </div>
        {badge && (
          <div className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 rounded-full bg-cream shadow-sm text-sm">
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
