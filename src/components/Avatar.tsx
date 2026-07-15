import type { GenStatus } from "../api/types";
import shadowImg from "../assets/avatars/shadow.png";
import member1 from "../assets/avatars/member-1.png";
import member2 from "../assets/avatars/member-2.png";
import member3 from "../assets/avatars/member-3.png";
import member4 from "../assets/avatars/member-4.png";
import member5 from "../assets/avatars/member-5.png";
import member6 from "../assets/avatars/member-6.png";

const PLACEHOLDERS = [member1, member2, member3, member4, member5, member6];

function placeholderFor(id: number) {
  return PLACEHOLDERS[Math.abs(id) % PLACEHOLDERS.length];
}

export interface AvatarSubject {
  id: number;
  name: string;
  avatarUrl?: string;
  avatarStatus?: GenStatus;
  isMe?: boolean;
}

interface AvatarProps {
  member: AvatarSubject;
  size?: number;
  showName?: boolean;
  /** Orange speech-bubble preview shown above the avatar (unread message). */
  unreadPreview?: string | null;
}

export function Avatar({ member, size = 88, showName = true, unreadPreview }: AvatarProps) {
  const ready = member.avatarStatus === "READY" && member.avatarUrl;
  const src = ready ? member.avatarUrl : placeholderFor(member.id);

  return (
    <div className="flex flex-col items-center gap-1.5" style={{ width: size }}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {unreadPreview && (
          <div className="absolute -top-4 -right-2 max-w-[9rem] rounded-2xl rounded-br-sm bg-accent px-3 py-1.5 shadow-sm z-10">
            <span className="block text-white text-xs font-medium leading-snug line-clamp-2">
              {unreadPreview}
            </span>
          </div>
        )}
        <img
          src={src}
          alt={member.isMe ? "나" : member.name}
          className="w-full h-full rounded-full object-cover bg-surface border border-border"
        />
      </div>
      <img src={shadowImg} alt="" className="w-[70%] shrink-0" style={{ height: size * 0.06 }} />
      {showName && (
        <span className="text-sm text-ink-muted">{member.isMe ? "나" : member.name}</span>
      )}
    </div>
  );
}
