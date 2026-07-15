import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Avatar } from "../components/Avatar";
import { useSession } from "../context/SessionContext";
import { useMembers } from "../context/MembersContext";
import { getGroup } from "../api/endpoints";

const COLLAGE_SLOTS = [
  { left: "28%", top: "10%", size: 78 },
  { left: "58%", top: "25%", size: 84 },
  { left: "10%", top: "47%", size: 79 },
  { left: "46%", top: "53%", size: 92 },
];

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"];

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${day}. ${WEEKDAY_LABEL[d.getDay()]}`;
}

export function InviteComplete() {
  const navigate = useNavigate();
  const { groupId, joinedAt } = useSession();
  const { members } = useMembers();
  const [groupName, setGroupName] = useState<string | null>(null);
  const preview = members.slice(0, 4);

  useEffect(() => {
    if (!groupId) return;
    getGroup(groupId)
      .then((g) => setGroupName(g.name))
      .catch(() => setGroupName(null));
  }, [groupId]);

  return (
    <Screen className="items-center justify-center px-6 pb-10 gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold text-ink leading-snug">
          {groupName ?? "가족"} 그룹에
          <br />
          초대가 완료되었어요!
        </h1>
        <p className="text-lg text-ink-muted">
          이제 가족과 목소리로 쉽게 일상을 나눠보세요
        </p>
      </div>

      <div
        className="relative w-64 h-64 rounded-full bg-surface shrink-0"
        style={{ boxShadow: "0 0 40px 10px rgba(255, 222, 89, 0.5)" }}
      >
        {preview.length > 0 ? (
          preview.map((m, i) => (
            <div
              key={m.memberId}
              className="absolute"
              style={{ left: COLLAGE_SLOTS[i].left, top: COLLAGE_SLOTS[i].top }}
            >
              <Avatar
                member={{ id: m.memberId, name: m.name, avatarUrl: m.avatarUrl, avatarStatus: m.avatarStatus }}
                size={COLLAGE_SLOTS[i].size}
                showName={false}
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            <span className="text-5xl">🏡</span>
            <p className="text-lg font-semibold text-ink">아직 가족을 기다리고 있어요</p>
            <p className="text-base text-ink-muted">초대코드를 공유하면 이곳이 가족들로 채워져요</p>
          </div>
        )}
      </div>

      <div className="w-full rounded-2xl bg-surface shadow-sm px-6 py-5 flex flex-col gap-3 text-base">
        <div className="flex items-center justify-between">
          <span className="text-ink-muted">가족 구성원</span>
          <span className="font-semibold text-ink">{members.length}명</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-muted">함께한 날</span>
          <span className="font-semibold text-ink">{joinedAt ? formatDateLabel(joinedAt) : "-"}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/home")}
        className="w-full min-h-14 rounded-2xl bg-accent text-lg font-semibold text-white active:scale-[0.99] transition-transform"
      >
        일상 공유하러 가기
      </button>
    </Screen>
  );
}
