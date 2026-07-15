import { useEffect, useRef, useState } from "react";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { Avatar } from "../components/Avatar";
import { Waveform } from "../components/Waveform";
import { RecordSheet } from "../components/RecordSheet";
import { CameraIcon, KeyboardIcon, MicIcon, PauseIcon, PlayIcon, SendIcon } from "../components/icons";
import type { RecordingResult } from "../hooks/useAudioRecorder";
import type { MessageResponse } from "../api/types";
import { listMessages, markMessagesRead, sendImageMessage, sendTextMessage, sendVoiceMessage } from "../api/endpoints";
import { useSession } from "../context/SessionContext";
import { useMembers } from "../context/MembersContext";

type ComposerMode = "voice" | "text";

const POLL_INTERVAL_MS = 1800;

export function Chat() {
  const { groupId, memberId } = useSession();
  const { getMember } = useMembers();
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [mode, setMode] = useState<ComposerMode>("voice");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!groupId) return;
    let cancelled = false;

    async function poll() {
      try {
        const next = await listMessages(groupId!, lastIdRef.current);
        if (cancelled || next.length === 0) return;
        lastIdRef.current = next[next.length - 1].messageId;
        setMessages((prev) => [...prev, ...next]);
      } catch {
        // 다음 폴링에서 재시도
      }
    }

    poll();
    const timer = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [groupId]);

  useEffect(() => {
    if (!memberId) return;
    markMessagesRead({ readerId: memberId }).catch(() => {});
  }, [memberId]);

  async function sendImage(file: File) {
    if (!memberId) return;
    try {
      const msg = await sendImageMessage(memberId, file);
      setMessages((prev) => [...prev, msg]);
      lastIdRef.current = msg.messageId;
    } catch {
      // 전송 실패 — 사용자는 다시 시도할 수 있음
    }
  }

  async function sendVoice({ url }: RecordingResult) {
    setRecording(false);
    if (!memberId) return;
    try {
      const blob = await fetch(url).then((r) => r.blob());
      const msg = await sendVoiceMessage(memberId, blob);
      setMessages((prev) => [...prev, msg]);
      lastIdRef.current = msg.messageId;
    } catch {
      // 전송 실패 — 사용자는 다시 시도할 수 있음
    }
  }

  function togglePlay(m: MessageResponse) {
    const audio = audioRef.current;
    if (!audio || !m.audioUrl) return;

    if (playingId === m.messageId) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    audio.src = m.audioUrl;
    audio.play();
    setPlayingId(m.messageId);
  }

  async function sendText() {
    if (!text.trim() || !memberId) return;
    const value = text.trim();
    setText("");
    try {
      const msg = await sendTextMessage({ senderId: memberId, text: value });
      setMessages((prev) => [...prev, msg]);
      lastIdRef.current = msg.messageId;
    } catch {
      // 전송 실패 — 사용자는 다시 시도할 수 있음
    }
  }

  return (
    <Screen className="relative overflow-hidden">
      <TopBar title="채팅" />

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-6 py-4">
        {messages.map((m) => {
          const isMe = m.senderId === memberId;
          const author = getMember(m.senderId);
          const audioReady = m.convertStatus === "READY" && m.audioUrl;
          return (
            <div
              key={m.messageId}
              className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <Avatar
                member={{
                  id: m.senderId,
                  name: author?.name ?? m.senderName,
                  avatarUrl: author?.avatarUrl,
                  avatarStatus: author?.avatarStatus,
                }}
                size={40}
                showName={false}
              />
              <div
                className={`max-w-[68%] rounded-2xl flex flex-col gap-1 ${
                  m.type === "IMAGE" ? "overflow-hidden" : "px-4 py-3"
                } ${
                  isMe
                    ? "bg-accent-light rounded-br-sm"
                    : "bg-surface border border-border rounded-bl-sm"
                }`}
              >
                {m.type !== "IMAGE" && (
                  <span className="text-sm text-ink">
                    {m.text ?? (m.convertStatus === "READY" ? "" : "변환 중...")}
                  </span>
                )}
                {m.type === "IMAGE" && m.imageUrl && (
                  <img src={m.imageUrl} alt="공유한 사진" className="w-full max-h-64 object-cover" />
                )}
                {m.type === "VOICE" && (
                  <button
                    onClick={() => togglePlay(m)}
                    disabled={!audioReady}
                    aria-label={playingId === m.messageId ? "일시정지" : "재생"}
                    className="flex items-center gap-2 text-ink disabled:opacity-50"
                  >
                    {playingId === m.messageId ? (
                      <PauseIcon className="w-4 h-4" />
                    ) : (
                      <PlayIcon className="w-4 h-4" />
                    )}
                    <Waveform />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-surface border-t border-border px-5 py-3 shrink-0">
        {mode === "voice" ? (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              aria-label="사진 첨부"
              className="w-10 h-10 rounded-full bg-cream border border-border flex items-center justify-center text-ink"
            >
              <CameraIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setRecording(true)}
              aria-label="음성 녹음"
              className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-white"
            >
              <MicIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setMode("text")}
              aria-label="키보드로 입력"
              className="w-10 h-10 rounded-full bg-cream border border-border flex items-center justify-center text-ink"
            >
              <KeyboardIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("voice")}
              aria-label="음성으로 전환"
              className="w-9 h-9 rounded-full bg-cream border border-border flex items-center justify-center text-ink shrink-0"
            >
              <MicIcon className="w-4 h-4" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder="메시지 입력"
              autoFocus
              className="flex-1 rounded-full bg-cream border border-border px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-accent"
            />
            <button
              onClick={sendText}
              aria-label="보내기"
              className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-white shrink-0"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {recording && <RecordSheet onCancel={() => setRecording(false)} onSend={sendVoice} />}
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) sendImage(file);
          e.target.value = "";
        }}
        className="hidden"
      />
    </Screen>
  );
}
