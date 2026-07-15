import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { Avatar } from "../components/Avatar";
import { useTextScale, type TextScale } from "../context/TextScaleContext";
import { useSession } from "../context/SessionContext";
import { useMembers } from "../context/MembersContext";
import { updateMember } from "../api/endpoints";

const SCALE_LABEL: Record<TextScale, string> = {
  normal: "보통",
  large: "크게",
  xlarge: "아주 크게",
};

export function Profile() {
  const navigate = useNavigate();
  const { memberId, setSession } = useSession();
  const { getMember, refetch } = useMembers();
  const me = memberId ? getMember(memberId) : undefined;
  const [name, setName] = useState(me?.name ?? "");
  const { scale, setScale } = useTextScale();

  useEffect(() => {
    if (me?.name) setName(me.name);
  }, [me?.name]);

  async function saveName() {
    const trimmed = name.trim();
    if (!memberId || !trimmed || trimmed === me?.name) return;
    try {
      await updateMember(memberId, { name: trimmed });
      setSession({ displayName: trimmed });
      refetch();
    } catch {
      // 저장 실패해도 입력값은 화면에 유지 — 다음 blur에서 재시도 가능
    }
  }

  return (
    <Screen className="items-center px-6 pt-2">
      <TopBar title="프로필 관리" />

      <div className="mt-8">
        {me && (
          <Avatar
            member={{ id: me.memberId, name: me.name, avatarUrl: me.avatarUrl, avatarStatus: me.avatarStatus }}
            size={180}
            showName={false}
          />
        )}
      </div>

      <div className="w-full flex flex-col gap-3 mt-10">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={saveName}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          placeholder="이름 수정"
          className="w-full rounded-2xl bg-surface border border-border px-5 py-4 text-base text-ink placeholder:text-ink-muted outline-none focus:border-accent"
        />
        <button
          onClick={() => navigate("/scan")}
          className="w-full rounded-2xl bg-surface border border-border py-4 text-base font-medium text-ink text-center"
        >
          사진 다시 찍기 →
        </button>
      </div>

      <div className="w-full mt-8">
        <span className="text-sm text-ink-muted">글씨 크기</span>
        <div className="flex rounded-2xl bg-surface border border-border p-1 mt-2">
          {(Object.keys(SCALE_LABEL) as TextScale[]).map((s) => (
            <button
              key={s}
              onClick={() => setScale(s)}
              className={`flex-1 rounded-xl py-3 text-sm font-semibold ${
                scale === s ? "bg-accent text-white" : "text-ink-muted"
              }`}
            >
              {SCALE_LABEL[s]}
            </button>
          ))}
        </div>
      </div>
    </Screen>
  );
}
