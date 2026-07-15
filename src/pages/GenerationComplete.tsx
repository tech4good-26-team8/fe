import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Avatar } from "../components/Avatar";
import { useSession } from "../context/SessionContext";
import { useOnboardingMedia } from "../context/OnboardingMediaContext";
import { getMember } from "../api/endpoints";
import type { MemberResponse } from "../api/types";

export function GenerationComplete() {
  const navigate = useNavigate();
  const { memberId } = useSession();
  const { displayName } = useOnboardingMedia();
  const [member, setMember] = useState<MemberResponse | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!memberId) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await getMember(memberId!);
        if (cancelled) return;
        setMember(res);
        if (res.avatarStatus === "PENDING" || res.avatarStatus === "PROCESSING") {
          timerRef.current = setTimeout(poll, 2500);
        }
      } catch {
        if (!cancelled) timerRef.current = setTimeout(poll, 4000);
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [memberId]);

  const ready = member?.avatarStatus === "READY";
  const name = displayName ?? member?.name ?? "회원";

  return (
    <Screen className="px-6 pt-8 pb-10">
      <h1 className="text-xl font-medium text-ink leading-snug">
        {name}님,
        <br />
        본인의 음성으로 이야기 하는
        <br />
        3D 캐릭터가 생성되었어요! {ready && <span className="text-accent-light">✓</span>}
      </h1>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <Avatar
          member={{
            id: memberId ?? 0,
            name,
            avatarUrl: member?.avatarUrl,
            avatarStatus: member?.avatarStatus,
          }}
          size={187}
          showName={false}
        />
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <button
          onClick={() => navigate("/invite-complete")}
          className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-white"
        >
          초대 완료하러 가기 →
        </button>
        <button onClick={() => navigate("/home")} className="text-sm text-ink-muted underline">
          일상 공유하러 가기 →
        </button>
      </div>
    </Screen>
  );
}
