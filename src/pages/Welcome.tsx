import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Logo } from "../components/Logo";
import { createGroup, joinGroup } from "../api/endpoints";
import { useSession } from "../context/SessionContext";
import { useOnboardingMedia } from "../context/OnboardingMediaContext";

export function Welcome() {
  const navigate = useNavigate();
  const { memberId, setSession } = useSession();
  const { setDisplayName, setVoiceScript } = useOnboardingMedia();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 이미 가입한 기기는 온보딩을 건너뛰고 바로 홈으로
  if (memberId) return <Navigate to="/home" replace />;

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

  const filled = !!name.trim();

  return (
    <Screen
      className="px-6 pt-14 pb-8"
      style={{
        background:
          "linear-gradient(234deg, rgba(255,222,89,0.4) 24.91%, rgba(255,130,16,0.4) 61.346%), #fff",
      }}
    >
      <div className="flex-1 flex flex-col justify-center w-full">
        <div className="flex justify-center">
          <Logo size={170} />
        </div>

        <div className="mt-12">
          <h1 className="text-[26px] font-bold text-ink leading-snug">어떻게 불러드릴까요?</h1>
          <p className="text-base text-ink-muted mt-3">가족들에게 보여질 이름이에요</p>
        </div>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && filled && goToInviteCode()}
          placeholder="이름 입력"
          autoFocus
          className="w-full bg-transparent border-b-2 border-ink/15 focus:border-accent py-3 mt-8 text-2xl font-bold text-ink placeholder:text-ink-muted/50 placeholder:font-medium outline-none transition-colors"
        />
        {error && <span className="text-sm text-danger mt-3">{error}</span>}
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          disabled={!filled}
          onClick={goToInviteCode}
          className="w-full h-14 rounded-2xl bg-accent disabled:bg-border disabled:text-ink-muted text-lg font-semibold text-white shadow-sm active:scale-[0.99] transition-transform"
        >
          가족 코드로 접속하기
        </button>
        <button
          onClick={createNewFamily}
          disabled={!filled || creating}
          className="text-[15px] text-ink-muted disabled:opacity-50"
        >
          {creating ? (
            "가족을 만드는 중..."
          ) : (
            <>
              아직 가족 코드가 없나요? <span className="font-semibold text-accent">새 가족 만들기</span>
            </>
          )}
        </button>
      </div>
    </Screen>
  );
}
