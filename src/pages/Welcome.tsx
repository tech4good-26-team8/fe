import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Logo } from "../components/Logo";

export function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  return (
    <Screen className="items-center justify-center px-6 pb-16 gap-14">
      <Logo size={140} />

      <div className="w-full flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          className="w-full rounded-2xl bg-surface border border-border px-5 py-4 text-base text-ink placeholder:text-ink-muted outline-none focus:border-accent"
        />
        <button
          disabled={!name.trim()}
          onClick={() => navigate("/invite-code")}
          className="w-full rounded-2xl bg-accent disabled:bg-border disabled:text-ink-muted py-4 text-base font-semibold text-white disabled:font-medium"
        >
          가족 코드로 접속하기
        </button>
        <button
          onClick={() => navigate("/scan", { state: { newFamily: true } })}
          disabled={!name.trim()}
          className="text-sm text-ink-muted underline disabled:opacity-50"
        >
          아직 가족 코드가 없나요? 새 가족 만들기
        </button>
      </div>
    </Screen>
  );
}
