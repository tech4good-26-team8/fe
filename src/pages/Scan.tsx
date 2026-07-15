import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { useOnboardingMedia } from "../context/OnboardingMediaContext";
import { useSession } from "../context/SessionContext";
import { uploadAvatar } from "../api/endpoints";

export function Scan() {
  const navigate = useNavigate();
  const { setPhoto } = useOnboardingMedia();
  const { memberId } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user" } })
      .then((s) => {
        streamRef.current = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setCameraError(true));

    return () => streamRef.current?.getTracks().forEach((t) => t.stop());
  }, []);

  function capturePhoto(): Promise<Blob | null> {
    return new Promise((resolve) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || !canvas || !video.videoWidth) return resolve(null);

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);

      // mirror horizontally to match the preview
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.92);
    });
  }

  async function startScan() {
    setScanning(true);
    const blob = await capturePhoto();
    if (blob) {
      const url = URL.createObjectURL(blob);
      setPhotoUrl(url);
      setPhoto(url);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (memberId) {
        try {
          await uploadAvatar(memberId, blob);
        } catch {
          // 업로드 실패해도 온보딩 흐름은 계속 진행 — 재촬영은 프로필에서 가능
        }
      }
    }
    setTimeout(() => navigate("/voice-record"), 1600);
  }

  return (
    <Screen className="items-center px-6 pt-6 pb-10">
      <TopBar title="얼굴 인식" />
      <div className="text-center mt-4">
        <h1 className="text-[22px] font-medium text-ink leading-snug">카메라를 정면으로 바라봐주세요</h1>
        <p className="text-[15px] font-light text-ink-muted mt-2">사진을 바탕으로 3D 캐릭터가 생성돼요!</p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden bg-border/50 flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl} alt="촬영된 얼굴 사진" className="w-full h-full object-cover" />
          ) : !cameraError ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
          ) : (
            <span className="text-sm text-ink-muted px-6 text-center">
              카메라 권한이 필요해요
            </span>
          )}
          {scanning && (
            <div className="absolute inset-0 bg-ink/30 flex items-center justify-center">
              <span className="text-cream font-semibold">스캔 중...</span>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="w-full flex flex-col gap-3 items-center">
        <button
          onClick={startScan}
          disabled={scanning}
          className="w-full rounded-2xl bg-accent disabled:bg-border disabled:text-ink-muted py-4 text-base font-semibold text-white"
        >
          {scanning ? "스캔 중..." : "스캔 시작하기"}
        </button>
        <button className="text-sm text-ink-muted underline">
          도움이 필요하신가요? 지원센터 문의
        </button>
      </div>
    </Screen>
  );
}
