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
      <h1 className="text-xl font-semibold text-ink leading-snug">
        {generating ? (
          <>
            {name}님의 목소리로 이야기하는
            <br />
            3D 캐릭터를 만들고 있어요
          </>
        ) : (
          <>
            {name}님,
            <br />
            본인의 음성으로 이야기 하는
            <br />
            3D 캐릭터가 생성되었어요! <span className="text-accent-light">✓</span>
          </>
        )}
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
        {generating && (
          <p className="text-sm text-ink-muted animate-pulse">
            목소리를 만들고 있어요… 1분 정도 걸려요
          </p>
        )}
        {!generating && member?.greetingAudioUrl && (
          <button
            onClick={playGreeting}
            className="rounded-2xl border border-accent px-6 py-3 text-sm font-semibold text-accent"
          >
            {playing ? "재생 중…" : "내 목소리 인사말 들어보기 ▶"}
          </button>
        )}
      </div>

      <div className="w-full flex flex-col items-center gap-4">
        <button
          onClick={() => navigate("/invite-complete")}
          disabled={generating}
          className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-white disabled:opacity-50"
        >
          {generating ? "만드는 중…" : "초대 완료하러 가기 →"}
        </button>
        <button onClick={() => navigate("/home")} className="text-sm text-ink-muted underline">
          일상 공유하러 가기 →
        </button>
      </div>
    </Screen>
  );
}
