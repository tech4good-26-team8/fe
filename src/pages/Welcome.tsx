import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Logo } from "../components/Logo";

export function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  return (
    <Screen className="items-center px-6 pt-24 pb-10">
      <Logo size={140} />

      <div className="flex-1" />

      <div className="w-full flex flex-col gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
          className="w-full rounded-2xl bg-beige px-5 py-4 text-base text-ink placeholder:text-ink-muted outline-none"
        />
        <button
          disabled={!name.trim()}
          onClick={() => navigate("/invite-code")}
          className="w-full rounded-2xl bg-accent disabled:bg-beige-dark disabled:text-ink-muted py-4 text-base font-semibold text-ink"
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
