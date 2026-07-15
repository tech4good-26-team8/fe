import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderState = "starting" | "recording" | "denied" | "unsupported";

export interface RecordingResult {
  url: string;
  durationSec: number;
}

export function useAudioRecorder() {
  const [recorderState, setRecorderState] = useState<RecorderState>("starting");
  const [seconds, setSeconds] = useState(0);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAtRef = useRef(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    if (typeof MediaRecorder === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setRecorderState("unsupported");
      return;
    }

    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        chunksRef.current = [];

        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorderRef.current = recorder;

        recorder.start();
        startedAtRef.current = Date.now();
        setSeconds(0);
        timerRef.current = setInterval(() => {
          setSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }, 1000);
        setRecorderState("recording");
      })
      .catch(() => {
        if (!cancelled) setRecorderState("denied");
      });

    return () => {
      cancelled = true;
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.onstop = null;
        recorderRef.current.stop();
      }
      cleanup();
    };
  }, [cleanup]);

  const stop = useCallback((): Promise<RecordingResult | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== "recording") return Promise.resolve(null);

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const durationSec = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const url = URL.createObjectURL(blob);
        cleanup();
        resolve({ url, durationSec });
      };
      recorder.stop();
    });
  }, [cleanup]);

  const cancel = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder?.state === "recording") {
      recorder.onstop = null;
      recorder.stop();
    }
    cleanup();
  }, [cleanup]);

  return { recorderState, seconds, stop, cancel };
}
