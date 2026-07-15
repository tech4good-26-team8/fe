import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Avatar } from "../components/Avatar";
import { BottomTabs } from "../components/BottomTabs";
import { RecordSheet } from "../components/RecordSheet";
import { InviteModal } from "../components/InviteModal";
import { BellIcon, PlusIcon, UserIcon } from "../components/icons";
import { useSession } from "../context/SessionContext";
import { useMembers } from "../context/MembersContext";
import { getGroup, sendVoiceMessage } from "../api/endpoints";
import type { RecordingResult } from "../hooks/useAudioRecorder";

function todayLabel() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function Home() {
  const navigate = useNavigate();
  const { groupId, memberId } = useSession();
  const { members } = useMembers();
  const [recording, setRecording] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [group, setGroup] = useState<{ name: string; inviteCode: string } | null>(null);

  useEffect(() => {
    if (!groupId) return;
    getGroup(groupId)
      .then((g) => setGroup({ name: g.name, inviteCode: g.inviteCode }))
      .catch(() => setGroup(null));
  }, [groupId]);

  const sinceLabel = todayLabel();

  function showMockNotification() {
    setNotification("🔔 새로운 소식이 있어요");
    setTimeout(() => setNotification(null), 2500);
  }

  function copyInviteLink() {
    if (!group) return;
    // update feedback state first — clipboard permission/prompt must never block or delay it
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    navigator.clipboard?.writeText(`https://familog.app/invite/${group.inviteCode}`).catch(() => {});
  }

  async function sendVoiceNote(result: RecordingResult) {
    setRecording(false);
    if (!memberId) return;
    try {
      const blob = await fetch(result.url).then((r) => r.blob());
      await sendVoiceMessage(memberId, blob);
    } catch {
      // 전송 실패 시에도 화면은 그대로 유지 — 채팅에서 다시 시도 가능
    }
  }

  return (
    <Screen className="relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 pt-5 shrink-0">
        <div>
          <h1 className="text-[17px] font-medium text-ink">{group?.name ?? "우리 가족"}</h1>
          {sinceLabel && <p className="text-xs font-light text-ink-muted mt-0.5">Since {sinceLabel}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setInviting(true)}
            aria-label="가족 초대"
            className="w-[45px] h-[45px] rounded-full bg-surface border border-border flex items-center justify-center text-ink"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          <button
            onClick={showMockNotification}
            aria-label="알림"
            className="w-[45px] h-[45px] rounded-full bg-surface border border-border flex items-center justify-center text-ink"
          >
            <BellIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            aria-label="프로필"
            className="w-[45px] h-[45px] rounded-full bg-surface border border-border flex items-center justify-center text-ink"
          >
            <UserIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {notification && (
        <div className="mx-5 mt-3 rounded-xl bg-surface border-l-4 border-accent px-4 py-2 text-sm text-ink shadow-sm shrink-0">
          {notification}
        </div>
      )}

      <div className="scroll-area flex-1 grid grid-cols-2 gap-x-4 gap-y-6 content-start justify-items-center px-8 pt-6 overflow-y-auto">
        {members.map((m) => (
          <button key={m.memberId} onClick={() => navigate(`/member/${m.memberId}`)}>
            <Avatar
              member={{
                id: m.memberId,
                name: m.name,
                avatarUrl: m.avatarUrl,
                avatarStatus: m.avatarStatus,
                isMe: m.memberId === memberId,
              }}
              size={116}
              unreadPreview={m.unreadCount > 0 ? (m.latestUnread?.textPreview ?? "새 소식이 있어요") : null}
            />
          </button>
        ))}
      </div>

      <BottomTabs onMicPress={() => setRecording(true)} />

      {recording && <RecordSheet onCancel={() => setRecording(false)} onSend={sendVoiceNote} />}
      {inviting && group && (
        <InviteModal
          inviteCode={group.inviteCode}
          groupName={group.name}
          copied={copied}
          onCopyLink={copyInviteLink}
          onClose={() => setInviting(false)}
        />
      )}
    </Screen>
  );
}
