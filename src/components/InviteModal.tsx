import { LinkIcon } from "./icons";

interface InviteModalProps {
  groupName: string;
  inviteCode: string;
  copied: boolean;
  onCopyLink: () => void;
  onClose: () => void;
}

export function InviteModal({ groupName, inviteCode, copied, onCopyLink, onClose }: InviteModalProps) {
  return (
    <div className="absolute inset-0 bg-ink/40 flex items-center justify-center z-20 px-8">
      <div className="w-full bg-surface rounded-3xl p-6 flex flex-col items-center gap-4 shadow-xl">
        <h2 className="text-base font-semibold text-ink">{groupName}에 초대하기</h2>
        <p className="text-sm text-ink-muted text-center">
          아래 코드를 가족에게 알려주면
          <br />
          가족 코드로 접속할 수 있어요
        </p>
        <span className="text-3xl font-bold tracking-[0.3em] text-accent bg-cream border border-border rounded-2xl px-6 py-3">
          {inviteCode}
        </span>
        <button
          onClick={onCopyLink}
          className="inline-flex items-center gap-2 rounded-full bg-cream border border-border pl-5 pr-4 h-11 shrink-0"
        >
          <span className="text-sm text-ink">
            {copied ? "링크를 복사했어요" : "초대 링크 복사하기"}
          </span>
          <LinkIcon className="w-4 h-4 text-ink shrink-0" />
        </button>
        <button
          onClick={onClose}
          className="w-full rounded-2xl bg-accent py-3 text-sm font-semibold text-white mt-2"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
