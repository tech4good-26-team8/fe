import type { FamilyMember } from "../types";

interface AvatarProps {
  member: FamilyMember;
  size?: number;
  showName?: boolean;
  showUpdateBubble?: boolean;
}

export function Avatar({ member, size = 88, showName = true, showUpdateBubble = false }: AvatarProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        {showUpdateBubble && (
          <div className="absolute -top-3 right-1 rounded-2xl rounded-br-sm bg-beige px-2.5 py-1.5 shadow-sm z-10">
            <span className="text-ink-muted text-xs tracking-widest">···</span>
          </div>
        )}
        <div
          className={`flex items-center justify-center rounded-full w-full h-full`}
          style={{ fontSize: size * 0.9 }}
        >
          {member.emoji}
        </div>
      </div>
      {showName && (
        <span className="text-m text-ink-muted">
          {member.isMe ? "나" : member.name}
        </span>
      )}
    </div>
  );
}
