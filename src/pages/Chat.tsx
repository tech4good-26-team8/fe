import { useRef, useState } from "react";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { Avatar } from "../components/Avatar";
import { Waveform } from "../components/Waveform";
import { RecordSheet } from "../components/RecordSheet";
import { KeyboardIcon, MicIcon, PauseIcon, PlayIcon, SendIcon } from "../components/icons";
import { chatMessages as initialMessages, getMember } from "../data/mockFamily";
import type { RecordingResult } from "../hooks/useAudioRecorder";
import type { ChatMessage } from "../types";

type ComposerMode = "voice" | "text";

export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [mode, setMode] = useState<ComposerMode>("voice");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  function sendVoice({ url, durationSec }: RecordingResult) {
    setRecording(false);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        authorId: "me",
        kind: "voice",
        durationSec,
        audioUrl: url,
        createdAt: "지금",
      },
    ]);
  }

  function togglePlay(m: ChatMessage) {
    const audio = audioRef.current;
    if (!audio || !m.audioUrl) return;

    if (playingId === m.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    audio.src = m.audioUrl;
    audio.play();
    setPlayingId(m.id);
  }

  function sendText() {
    if (!text.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        authorId: "me",
        kind: "text",
        text: text.trim(),
        createdAt: "지금",
      },
    ]);
    setText("");
  }

  return (
    <Screen className="relative overflow-hidden">
      <TopBar title="채팅" />

      <div className="flex-1 overflow-y-auto flex flex-col gap-4 px-5 py-4">
        {messages.map((m) => {
          const isMe = m.authorId === "me";
          const author = getMember(m.authorId);
          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}
            >
              <Avatar member={author!} size={40} showName={false} />
              <div
                className={`max-w-[68%] rounded-2xl px-4 py-3 flex flex-col gap-1 ${
                  isMe ? "bg-accent-light rounded-br-sm" : "bg-beige rounded-bl-sm"
                }`}
              >
                {m.text && <span className="text-sm text-ink">{m.text}</span>}
                {m.kind === "voice" && (
                  <button
                    onClick={() => togglePlay(m)}
                    disabled={!m.audioUrl}
                    aria-label={playingId === m.id ? "일시정지" : "재생"}
                    className="flex items-center gap-2 text-ink disabled:opacity-50"
                  >
                    {playingId === m.id ? (
                      <PauseIcon className="w-4 h-4" />
                    ) : (
                      <PlayIcon className="w-4 h-4" />
                    )}
                    <Waveform />
                    <span className="text-xs text-ink-muted">{m.durationSec}"</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-beige-dark px-5 py-3 shrink-0">
        {mode === "voice" ? (
          <div className="flex items-center justify-center gap-4">
            <div aria-hidden className="w-10 h-10 "></div>
            <button
              onClick={() => setRecording(true)}
              aria-label="음성 녹음"
              className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-ink"
            >
              <MicIcon className="w-6 h-6" />
            </button>
            <button
              onClick={() => setMode("text")}
              aria-label="키보드로 입력"
              className="w-10 h-10 rounded-full bg-beige flex items-center justify-center text-ink"
            >
              <KeyboardIcon className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode("voice")}
              aria-label="음성으로 전환"
              className="w-9 h-9 rounded-full bg-beige flex items-center justify-center text-ink shrink-0"
            >
              <MicIcon className="w-4 h-4" />
            </button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendText()}
              placeholder="메시지 입력"
              autoFocus
              className="flex-1 rounded-full bg-beige px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted outline-none"
            />
            <button
              onClick={sendText}
              aria-label="보내기"
              className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-ink shrink-0"
            >
              <SendIcon className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {recording && <RecordSheet onCancel={() => setRecording(false)} onSend={sendVoice} />}
      <audio ref={audioRef} onEnded={() => setPlayingId(null)} className="hidden" />
    </Screen>
  );
}
