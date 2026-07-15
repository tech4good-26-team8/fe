import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Logo } from "../components/Logo";
import { TopBar } from "../components/TopBar";

const CODE_LENGTH = 6;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];

export function InviteCode() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (code.length === CODE_LENGTH) {
      const t = setTimeout(() => navigate("/scan"), 300);
      return () => clearTimeout(t);
    }
  }, [code, navigate]);

  function press(key: string) {
    if (key === "back") {
      setCode((c) => c.slice(0, -1));
    } else if (key && code.length < CODE_LENGTH) {
      setCode((c) => c + key);
    }
  }

  return (
    <Screen>
      <TopBar />
      <div className="flex flex-col items-center px-6 pt-2 gap-10">
        <h1 className="text-lg font-semibold text-ink">초대코드 입력</h1>
        <Logo size={120} />
        <div className="flex gap-2.5">
          {Array.from({ length: CODE_LENGTH }).map((_, i) => (
            <div
              key={i}
              className={`w-9 h-11 rounded-lg flex items-center justify-center text-lg font-semibold ${
                i < code.length ? "bg-accent text-ink" : "bg-beige text-transparent"
              }`}
            >
              {code[i] ?? "•"}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1" />

      <div className="grid grid-cols-3 bg-beige-dark">
        {KEYS.map((key, i) => (
          <button
            key={i}
            onClick={() => press(key)}
            disabled={!key}
            className="h-16 flex items-center justify-center text-xl text-ink border border-beige/60 disabled:opacity-0"
          >
            {key === "back" ? "⌫" : key}
          </button>
        ))}
      </div>
    </Screen>
  );
}
