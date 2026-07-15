import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";

export function Scan() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | undefined;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "user" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) videoRef.current.srcObject = s;
      })
      .catch(() => setCameraError(true));

    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  function startScan() {
    setScanning(true);
    setTimeout(() => navigate("/invite-complete"), 1600);
  }

  return (
    <Screen className="items-center px-6 pt-6 pb-10">
      <TopBar />
      <div className="text-center mt-2">
        <h1 className="text-lg font-semibold text-ink">카메라를 정면으로 바라봐주세요</h1>
        <p className="text-sm text-ink-muted mt-2">사진을 바탕으로 3D 캐릭터가 생성돼요!</p>
      </div>

      <div className="flex-1 flex items-center justify-center w-full">
        <div className="relative w-64 h-64 rounded-full overflow-hidden bg-surface border-2 border-border flex items-center justify-center">
          {!cameraError ? (
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
