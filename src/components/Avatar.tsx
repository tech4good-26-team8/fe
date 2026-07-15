import type { GenStatus } from "../api/types";
import { ChatIcon } from "./icons";
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
    <div className="flex flex-col items-center gap-2.5" style={{ width: size }}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {unreadPreview && (
          <span className="absolute -top-0.5 -right-0.5 w-7 h-7 rounded-full bg-accent border-2 border-cream shadow-sm z-10 flex items-center justify-center">
            <ChatIcon className="w-3.5 h-3.5 text-white" />
          </span>
        )}
        <img
          src={src}
          alt={member.isMe ? "나" : member.name}
          className="w-full h-full rounded-full object-cover"
        />
      </div>
      {showName && (
        <span className="text-sm text-ink-muted">{member.isMe ? "나" : member.name}</span>
      )}
    </div>
  );
}
