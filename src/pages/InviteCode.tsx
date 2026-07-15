import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { DeleteIcon } from "../components/icons";
import { joinGroup } from "../api/endpoints";
import { useSession } from "../context/SessionContext";
import { useOnboardingMedia } from "../context/OnboardingMediaContext";

const CODE_LENGTH = 6;
const KEYS = [
  { digit: "1", letters: "" },
  { digit: "2", letters: "ABC" },
  { digit: "3", letters: "DEF" },
  { digit: "4", letters: "GHI" },
  { digit: "5", letters: "JKL" },
  { digit: "6", letters: "MNO" },
  { digit: "7", letters: "PQRS" },
  { digit: "8", letters: "TUV" },
  { digit: "9", letters: "WXYZ" },
  null,
  { digit: "0", letters: "" },
  "back" as const,
];

export function InviteCode() {
  const navigate = useNavigate();
  const { setSession } = useSession();
  const { displayName, setVoiceScript } = useOnboardingMedia();
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (code.length !== CODE_LENGTH) return;

    let cancelled = false;
    setChecking(true);
    setError(null);

    joinGroup({ name: displayName ?? "", inviteCode: code })
      .then((res) => {
        if (cancelled) return;
        setVoiceScript(res.voiceScript);
        setSession({ memberId: res.memberId, displayName });
        navigate("/scan");
      })
      .catch(() => {
        if (cancelled) return;
        setError("초대코드를 확인해주세요");
        setCode("");
      })
      .finally(() => {
        if (!cancelled) setChecking(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  function pressDigit(digit: string) {
    if (!checking && code.length < CODE_LENGTH) setCode((c) => c + digit);
  }

  function pressBack() {
    setError(null);
    setCode((c) => c.slice(0, -1));
  }

  return (
    <Screen>
      <TopBar />
      <div className="flex flex-col items-center px-6 pt-8 gap-20">
        <h1 className="text-lg font-semibold text-ink">초대코드 입력</h1>
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2.5">
            {Array.from({ length: CODE_LENGTH }).map((_, i) => (
              <div
                key={i}
                className={`w-11 h-[55px] rounded-2xl flex items-center justify-center text-lg font-semibold ${
                  i < code.length ? "bg-accent text-white" : "bg-surface border border-border"
                }`}
              >
                {code[i] ?? ""}
              </div>
            ))}
          </div>
          {error && <span className="text-sm text-danger">{error}</span>}
        </div>
      </div>

      <div className="flex-1" />

      <div className="grid grid-cols-3 gap-2.5 bg-border/40 px-3 pt-4 pb-8">
        {KEYS.map((key, i) => {
          if (key === null) return <span key={i} />;
          if (key === "back") {
            return (
              <button
                key={i}
                onClick={pressBack}
                aria-label="지우기"
                className="h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-ink-muted active:bg-cream"
              >
                <DeleteIcon className="w-5 h-5" />
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => pressDigit(key.digit)}
              className="h-16 rounded-2xl bg-white shadow-sm flex flex-col items-center justify-center gap-0.5 text-ink active:bg-cream"
            >
              <span className="text-xl font-medium">{key.digit}</span>
              {key.letters && (
                <span className="text-[10px] tracking-widest text-ink-muted">{key.letters}</span>
              )}
            </button>
          );
        })}
      </div>
    </Screen>
  );
}
