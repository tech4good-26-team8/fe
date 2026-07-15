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
        <h1 className="text-xl font-medium text-ink leading-relaxed">
          {groupName ?? "가족"} 그룹에
          <br />
          초대가 완료되었어요!
        </h1>
        <p className="text-sm font-light text-ink-muted">
          이제 가족과 목소리로만 쉽게 일상공유를 할 수 있어요
        </p>
      </div>

      <div
        className="relative w-64 h-64 rounded-full bg-surface shrink-0"
        style={{ boxShadow: "0 0 40px 10px rgba(255, 222, 89, 0.5)" }}
      >
        {preview.map((m, i) => (
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
        ))}
      </div>

      <div className="w-full rounded-2xl bg-surface px-6 py-4 flex flex-col gap-2 text-sm font-light text-ink">
        <div className="flex items-center justify-between">
          <span>현재 가족 구성원 수</span>
          <span>{members.length}명</span>
        </div>
        <div className="flex items-center justify-between">
          <span>생성일자</span>
          <span>{joinedAt ? formatDateLabel(joinedAt) : "-"}</span>
        </div>
      </div>

      <button
        onClick={() => navigate("/home")}
        className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-white"
      >
        일상 공유하러 가기 →
      </button>
    </Screen>
  );
}
