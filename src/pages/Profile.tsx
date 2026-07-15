import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { Avatar } from "../components/Avatar";
import { members } from "../data/mockFamily";

export function Profile() {
  const navigate = useNavigate();
  const me = members.find((m) => m.isMe)!;
  const [name, setName] = useState(me.name);

  return (
    <Screen className="items-center px-6 pt-2">
      <TopBar title="프로필 관리" />

      <div className="mt-6">
        <Avatar member={me} size={120} showName={false} />
      </div>

      <div className="w-full flex flex-col gap-3 mt-10">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 수정"
          className="w-full rounded-2xl bg-beige px-5 py-4 text-base text-ink placeholder:text-ink-muted outline-none"
        />
        <button
          onClick={() => navigate("/scan")}
          className="w-full rounded-2xl bg-beige-dark py-4 text-base font-semibold text-ink"
        >
          사진 다시 찍기 →
        </button>
      </div>
    </Screen>
  );
}
