import { useState } from "react";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function buildMonthGrid(year: number, month: number): (number | null)[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();
  return [...Array(startWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
}

interface CalendarSheetProps {
  value: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

export function CalendarSheet({ value, onSelect, onClose }: CalendarSheetProps) {
  const [cursor, setCursor] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));
  const [picked, setPicked] = useState(value);

  const cells = buildMonthGrid(cursor.getFullYear(), cursor.getMonth());

  function changeMonth(delta: number) {
    setCursor((c) => new Date(c.getFullYear(), c.getMonth() + delta, 1));
  }

  function confirm() {
    onSelect(picked);
    onClose();
  }

  return (
    <div className="absolute inset-0 bg-ink/40 flex items-end justify-center z-20">
      <div className="w-full max-w-[430px] bg-surface rounded-t-3xl px-6 pt-7 pb-8 flex flex-col gap-5 shadow-2xl">
        <h2 className="text-xl font-semibold text-ink">날짜 선택</h2>

        <div className="flex items-center justify-between">
          <span className="text-base font-medium text-ink-muted">
            {cursor.getFullYear()}년 {String(cursor.getMonth() + 1).padStart(2, "0")}월
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeMonth(-1)}
              aria-label="이전 달"
              className="w-8 h-8 flex items-center justify-center text-ink-muted text-lg"
            >
              ‹
            </button>
            <button
              onClick={() => changeMonth(1)}
              aria-label="다음 달"
              className="w-8 h-8 flex items-center justify-center text-ink-muted text-lg"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-y-2 place-items-center">
          {WEEKDAYS.map((w) => (
            <span key={w} className="text-xs text-ink-muted">
              {w}
            </span>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <span key={i} />;
            const isPicked =
              picked.getFullYear() === cursor.getFullYear() &&
              picked.getMonth() === cursor.getMonth() &&
              picked.getDate() === day;
            return (
              <button
                key={i}
                onClick={() => setPicked(new Date(cursor.getFullYear(), cursor.getMonth(), day))}
                className={`w-9 h-9 rounded-full text-sm ${
                  isPicked ? "bg-accent text-white font-semibold" : "text-ink"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>

        <button
          onClick={confirm}
          className="w-full rounded-2xl bg-accent py-4 text-base font-semibold text-white"
        >
          선택
        </button>
      </div>
    </div>
  );
}
