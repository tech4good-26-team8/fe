import { familyName } from "../data/mockFamily";

const MOCK_FAMILY_CODE = "482913";

export function InviteModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="absolute inset-0 bg-ink/40 flex items-center justify-center z-20 px-8">
      <div className="w-full bg-cream rounded-3xl p-6 flex flex-col items-center gap-4">
        <h2 className="text-base font-semibold text-ink">{familyName}에 초대하기</h2>
        <p className="text-sm text-ink-muted text-center">
          아래 코드를 가족에게 알려주면
          <br />
          가족 코드로 접속할 수 있어요
        </p>
        <span className="text-3xl font-bold tracking-[0.3em] text-ink bg-beige rounded-2xl px-6 py-3">
          {MOCK_FAMILY_CODE}
        </span>
        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-ink mt-2"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
