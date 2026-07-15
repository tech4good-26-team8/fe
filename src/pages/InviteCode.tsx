import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { DeleteIcon } from "../components/icons";
import { joinGroup } from "../api/endpoints";
import { useSession } from "../context/SessionContext";
import { useOnboardingMedia } from "../context/OnboardingMediaContext";

const CODE_LENGTH = 6;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", null, "0", "back" as const];

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
        setSession({ groupId: res.groupId ?? null, memberId: res.memberId, displayName });
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
      <div className="flex flex-col px-6 pt-6">
        <h1 className="text-2xl font-bold text-ink leading-snug">
          초대코드 6자리를
          <br />
          입력해주세요
        </h1>
        <p className="text-lg text-ink-muted mt-2">가족에게 공유받은 코드예요</p>
        <div className="grid grid-cols-6 gap-2 w-full mt-10">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`aspect-[4/5] rounded-xl flex items-center justify-center text-2xl font-bold transition-colors ${
                i < code.length ? "bg-accent text-white" : "bg-surface border border-border"
              }`}
            >
              {code[i] ?? ""}
            </div>
          ))}
        </div>
        {error && <span className="text-sm text-danger mt-4">{error}</span>}
      </div>

      <div className="flex-1" />

      <div className="grid grid-cols-3 gap-1 px-4 pt-2 pb-8">
        {KEYS.map((key, i) => {
          if (key === null) return <span key={i} />;
          if (key === "back") {
            return (
              <button
                key={i}
                onClick={pressBack}
                aria-label="지우기"
                className="h-14 rounded-2xl flex items-center justify-center text-ink-muted active:bg-border/40 transition-colors"
              >
                <DeleteIcon className="w-6 h-6" />
              </button>
            );
          }
          return (
            <button
              key={i}
              onClick={() => pressDigit(key)}
              className="h-14 rounded-2xl flex items-center justify-center text-ink active:bg-border/40 transition-colors"
            >
              <span className="text-2xl font-semibold">{key}</span>
            </button>
          );
        })}
      </div>
    </Screen>
  );
}
