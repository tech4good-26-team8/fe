import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { Waveform } from "../components/Waveform";
import { MicIcon } from "../components/icons";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useOnboardingMedia } from "../context/OnboardingMediaContext";
import { useSession } from "../context/SessionContext";
import { audioBlobToWav } from "../utils/wav";
import { uploadVoicepack } from "../api/endpoints";

export function VoiceRecord() {
  const navigate = useNavigate();
  const { displayName, voiceScript } = useOnboardingMedia();
  const name = displayName ?? "회원";
  const [recording, setRecording] = useState(false);

  return (
    <Screen className="items-center px-6 pt-2 pb-10">
      <TopBar />

      <div className="w-full mt-4">
        <h1 className="text-2xl font-bold text-ink leading-snug">
          {name}님의 목소리를
          <br />
          담아볼게요
        </h1>
        <p className="text-lg text-ink-muted mt-2">
          시작을 누르고, 화면에 뜨는 문장을 읽어주세요
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {recording ? (
          <RecordingPanel
            script={voiceScript ?? `안녕하세요, 저는 ${name}입니다`}
            onDone={() => navigate("/generation-complete")}
          />
        ) : (
          <div className="w-[110px] h-[110px] rounded-full bg-cream border-2 border-border flex items-center justify-center">
            <MicIcon className="w-9 h-9 text-ink-muted" />
          </div>
        )}
      </div>

      {!recording && (
        <button
          onClick={() => setRecording(true)}
          className="w-full min-h-14 rounded-2xl bg-accent text-lg font-semibold text-white active:scale-[0.99] transition-transform"
        >
          음성 녹음 시작하기
        </button>
      )}
    </Screen>
  );
}

function RecordingPanel({
  script,
  onDone,
}: {
  script: string;
  onDone: () => void;
}) {
  const { recorderState, stop } = useAudioRecorder();
  const { setVoice } = useOnboardingMedia();
  const { memberId } = useSession();
  const [saving, setSaving] = useState(false);
  const blocked = recorderState === "denied" || recorderState === "unsupported";

  async function handleDone() {
    const result = await stop();
    if (result) {
      setSaving(true);
      const recordedBlob = await fetch(result.url).then((r) => r.blob());
      const wavBlob = await audioBlobToWav(recordedBlob);
      setVoice(URL.createObjectURL(wavBlob));
      if (memberId) {
        try {
          await uploadVoicepack(memberId, wavBlob);
        } catch {
          // 업로드 실패해도 온보딩 흐름은 계속 진행
        }
      }
    }
    onDone();
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full">
      <div className="w-full rounded-2xl bg-surface shadow-sm px-6 py-6 text-center">
        <p className="text-base text-ink-muted mb-2">아래 문장을 천천히 읽어주세요</p>
        <p className="text-2xl font-bold text-ink leading-snug">"{script}"</p>
      </div>

      <div className="flex items-center gap-3">
        <Waveform className="h-10 scale-x-[-1] text-accent" />
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
          <MicIcon
            className={`w-8 h-8 text-accent ${recorderState === "recording" ? "animate-pulse" : ""}`}
          />
        </div>
        <Waveform className="h-10 text-accent" />
      </div>

      {blocked && (
        <span className="text-[15px] text-ink-muted text-center px-6">
          {recorderState === "unsupported"
            ? "이 브라우저는 음성 녹음을 지원하지 않아요"
            : "마이크 권한이 필요해요"}
        </span>
      )}

      <button
        onClick={handleDone}
        disabled={blocked || saving}
        className="w-full min-h-14 rounded-2xl bg-accent disabled:bg-border disabled:text-ink-muted text-lg font-semibold text-white active:scale-[0.99] transition-transform"
      >
        {saving ? "음성 저장 중..." : "다 읽었어요"}
      </button>
    </div>
  );
}
