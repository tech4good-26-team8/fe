import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Avatar } from "../components/Avatar";
import { BottomTabs } from "../components/BottomTabs";
import { RecordSheet } from "../components/RecordSheet";
import { InviteModal } from "../components/InviteModal";
import { TextSizeControl } from "../components/TextSizeControl";
import { BellIcon, PlusIcon, UserIcon } from "../components/icons";
import { members } from "../data/mockFamily";

const MOCK_NOTIFICATION = "🔔 이정숙님이 새로운 소식을 남겼어요";

export function Home() {
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  function showMockNotification() {
    setNotification(MOCK_NOTIFICATION);
    setTimeout(() => setNotification(null), 2500);
  }

  return (
    <Screen className="relative overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 pt-5 shrink-0">
        <TextSizeControl />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setInviting(true)}
            aria-label="가족 초대"
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-ink"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          <button
            onClick={showMockNotification}
            aria-label="알림"
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-ink"
          >
            <BellIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            aria-label="프로필"
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-ink"
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

      <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-6 content-start justify-items-center px-8 pt-6 overflow-y-auto">
        {members.map((m) => (
          <Avatar key={m.id} member={m} showUpdateBubble={m.status === "active"} />
        ))}
      </div>

      <BottomTabs onMicPress={() => setRecording(true)} />

      {recording && (
        <RecordSheet
          onCancel={() => setRecording(false)}
          onSend={() => setRecording(false)}
        />
      )}
      {inviting && <InviteModal onClose={() => setInviting(false)} />}
    </Screen>
  );
}
