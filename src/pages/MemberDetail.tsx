import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Avatar } from "../components/Avatar";
import { ArrowLeftIcon, PauseIcon, PlayIcon } from "../components/icons";
import { useSession } from "../context/SessionContext";
import { useMembers } from "../context/MembersContext";
import { getMemberMessages, markMessagesRead } from "../api/endpoints";
import type { MessageResponse } from "../api/types";

export function MemberDetail() {
  const { memberId: memberIdParam } = useParams();
  const memberId = Number(memberIdParam);
  const navigate = useNavigate();
  const { memberId: viewerId } = useSession();
  const { getMember } = useMembers();
  const member = getMember(memberId);

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!viewerId) return;
    getMemberMessages(memberId, viewerId, true)
      .then(setMessages)
      .catch(() => setMessages([]));
  }, [memberId, viewerId]);

  useEffect(() => {
    const current = messages[index];
    const audio = audioRef.current;
    if (audio && current?.audioUrl) {
      audio.src = current.audioUrl;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  }, [messages, index]);

  useEffect(() => {
    if (messages.length === 0 || !viewerId) return;
    markMessagesRead({ readerId: viewerId, senderId: memberId }).catch(() => {});
  }, [messages, viewerId, memberId]);

  function handleEnded() {
    setPlaying(false);
    setIndex((i) => (i < messages.length - 1 ? i + 1 : i));
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  const current = messages[index];

  return (
    <Screen className="relative overflow-hidden bg-white">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-5 left-4 z-10 text-accent"
        aria-label="뒤로가기"
      >
        <ArrowLeftIcon className="w-7 h-7" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        {member && (
          <div style={{ filter: "drop-shadow(0 0 30px white)" }}>
            <Avatar
              member={{
                id: member.memberId,
                name: member.name,
                avatarUrl: member.avatarUrl,
                avatarStatus: member.avatarStatus,
              }}
              size={220}
              showName={false}
            />
          </div>
        )}

        {current ? (
          <div className="relative w-full bg-white rounded-2xl border-2 border-accent px-5 py-4 flex items-start gap-3 shadow-lg">
            <p className="flex-1 text-[15px] text-ink whitespace-pre-line leading-relaxed">
              {current.text ?? "..."}
            </p>
            <button
              onClick={togglePlay}
              disabled={!current.audioUrl}
              aria-label={playing ? "일시정지" : "재생"}
              className="shrink-0 text-ink mt-1 disabled:opacity-40"
            >
              {playing ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink-muted">아직 읽지 않은 소식이 없어요</p>
        )}
      </div>

      <audio ref={audioRef} onEnded={handleEnded} className="hidden" />
    </Screen>
  );
}
