import { useNavigate } from "react-router-dom";
import { Screen } from "../components/Screen";
import { Avatar } from "../components/Avatar";
import { members, familyName } from "../data/mockFamily";

export function InviteComplete() {
  const navigate = useNavigate();
  const preview = members.slice(0, 4);

  return (
    <Screen className="items-center justify-center px-6 pb-10 gap-12">
      <h1 className="text-lg font-semibold text-ink text-center leading-relaxed">
        {familyName} 그룹에
        <br />
        초대가 완료되었어요!
      </h1>

      <div className="w-64 h-64 rounded-full bg-beige flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4">
          {preview.map((m) => (
            <Avatar key={m.id} member={m} size={64} showName={false} />
          ))}
        </div>
      </div>

      <button
        onClick={() => navigate("/home")}
        className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-ink"
      >
        일상 공유하러 가기 →
      </button>
    </Screen>
  );
}
