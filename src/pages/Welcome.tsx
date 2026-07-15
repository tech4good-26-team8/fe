import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Logo } from "../components/Logo";
import { createGroup, joinGroup } from "../api/endpoints";
import { useSession } from "../context/SessionContext";
import { useOnboardingMedia } from "../context/OnboardingMediaContext";

export function Welcome() {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const { setDisplayName, setVoiceScript } = useOnboardingMedia();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function goToInviteCode() {
    setDisplayName(name.trim());
    navigate("/invite-code");
  }

  async function createNewFamily() {
    setCreating(true);
    setError(null);
    try {
      const trimmed = name.trim();
      const group = await createGroup({ name: `${trimmed}의 가족` });
      const join = await joinGroup({ name: trimmed, inviteCode: group.inviteCode });
      setDisplayName(trimmed);
      setVoiceScript(join.voiceScript);
      setSession({ groupId: group.groupId, memberId: join.memberId, displayName: trimmed });
      navigate("/scan");
    } catch {
      setError("가족을 만들지 못했어요. 잠시 후 다시 시도해주세요");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Screen
      className="items-center justify-center px-6 pb-16 gap-14"
      style={{
        background:
          "linear-gradient(234deg, rgba(255,222,89,0.4) 24.91%, rgba(255,130,16,0.4) 61.346%), #fff",
      }}
    >
      <Logo size={180} />

      <div className="w-full flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          className="w-full h-[68px] rounded-[24px] bg-white px-5 text-[15px] text-ink placeholder:text-ink-muted outline-none shadow-sm focus:ring-2 focus:ring-accent"
        />
        {error && <span className="text-sm text-danger text-center">{error}</span>}
        <button
          disabled={!name.trim()}
          onClick={goToInviteCode}
          className="w-full h-[62px] rounded-[24px] bg-accent disabled:bg-border disabled:text-ink-muted text-[15px] font-semibold text-white disabled:font-medium shadow-sm"
        >
          가족 코드로 접속하기
        </button>
        <button
          onClick={createNewFamily}
          disabled={!name.trim() || creating}
          className="text-sm text-ink-muted underline disabled:opacity-50"
        >
          {creating ? "가족을 만드는 중..." : "아직 가족 코드가 없나요? 새 가족 만들기"}
        </button>
      </div>
    </Screen>
  );
}
