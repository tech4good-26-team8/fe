import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Avatar } from "../components/Avatar";
import { useSession } from "../context/SessionContext";
import { useOnboardingMedia } from "../context/OnboardingMediaContext";
import { getMember } from "../api/endpoints";
import type { MemberResponse } from "../api/types";

function inProgress(status?: string) {
  return status === "PENDING" || status === "PROCESSING";
}

export function GenerationComplete() {
  const navigate = useNavigate();
  const { memberId } = useSession();
  const { displayName } = useOnboardingMedia();
  const [member, setMember] = useState<MemberResponse | null>(null);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!memberId) return;
    let cancelled = false;

    async function poll() {
      try {
        const res = await getMember(memberId!);
        if (cancelled) return;
        setMember(res);
        const waitingGreeting = res.voiceStatus === "READY" && !res.greetingAudioUrl;
        if (inProgress(res.avatarStatus) || inProgress(res.voiceStatus) || waitingGreeting) {
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
      audioRef.current?.pause();
    };
  }, [memberId]);

  const generating =
    !member ||
    inProgress(member.avatarStatus) ||
    inProgress(member.voiceStatus) ||
    (member.voiceStatus === "READY" && !member.greetingAudioUrl);
  const name = displayName ?? member?.name ?? "회원";

  function playGreeting() {
    if (!member?.greetingAudioUrl) return;
    audioRef.current?.pause();
    const audio = new Audio(member.greetingAudioUrl);
    audioRef.current = audio;
    setPlaying(true);
    audio.onended = () => setPlaying(false);
    audio.play().catch(() => setPlaying(false));
  }

  return (
    <Screen className="px-6 pt-8 pb-10">
      <h1 className="text-2xl font-bold text-ink leading-snug">
        {generating ? (
          <>
            {name}님의 목소리로 말하는
            <br />
            캐릭터를 만들고 있어요
          </>
        ) : (
          <>
            {name}님의 목소리로 말하는
            <br />
            캐릭터가 완성됐어요!
          </>
        )}
      </h1>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {generating ? (
          <div className="relative w-[187px] h-[187px] rounded-full bg-surface shadow-sm flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-border border-t-accent animate-spin" />
          </div>
        ) : (
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
        )}
        {generating && (
          <p className="text-base text-ink-muted animate-pulse">
            목소리를 만들고 있어요 · 1분 정도 걸려요
          </p>
        )}
        {!generating && member?.greetingAudioUrl && (
          <button
            onClick={playGreeting}
            className="rounded-full bg-surface shadow-sm px-6 py-3.5 text-base font-semibold text-accent active:scale-[0.98] transition-transform"
          >
            {playing ? "재생 중…" : "▶ 내 목소리 인사말 들어보기"}
          </button>
        )}
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <button
          onClick={() => navigate("/invite-complete")}
          disabled={generating}
          className="w-full h-14 rounded-2xl bg-accent text-lg font-semibold text-white disabled:bg-border disabled:text-ink-muted active:scale-[0.99] transition-transform"
        >
          {generating ? "만드는 중…" : "초대 완료하러 가기"}
        </button>
        <button onClick={() => navigate("/home")} className="text-[15px] text-ink-muted">
          먼저 일상 공유하러 가기 <span className="font-semibold text-accent">→</span>
        </button>
      </div>
    </Screen>
  );
}
