import { useEffect, useState } from "react";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { CalendarSheet } from "../components/CalendarSheet";
import { listPhotos } from "../api/endpoints";
import type { PhotoResponse } from "../api/types";
import { useSession } from "../context/SessionContext";

const WEEKDAY_LABEL = ["일", "월", "화", "수", "목", "금", "토"];

function formatKoreanDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}. ${m}. ${d} (${WEEKDAY_LABEL[date.getDay()]})`;
}

function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function Gallery() {
  const { groupId } = useSession();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [pickingDate, setPickingDate] = useState(false);
  const [photos, setPhotos] = useState<PhotoResponse[]>([]);

  useEffect(() => {
    if (!groupId) return;
    listPhotos(groupId, selectedDate ? toIsoDate(selectedDate) : undefined)
      .then(setPhotos)
      .catch(() => setPhotos([]));
  }, [groupId, selectedDate]);

  return (
    <Screen className="relative overflow-hidden">
      <TopBar title="추억 기록 갤러리" />

      <button
        onClick={() => setPickingDate(true)}
        className="self-start ml-5 mt-3 text-sm text-ink-muted shrink-0"
      >
        {selectedDate ? formatKoreanDate(selectedDate) : "전체 날짜"}
      </button>

      <div className="scroll-area flex-1 overflow-y-auto flex flex-col gap-6 px-6 py-4">
        {photos.length === 0 && (
          <p className="text-sm text-ink-muted text-center mt-10">아직 등록된 사진이 없어요</p>
        )}
        {photos.map((item) => (
          <div key={item.photoId} className="flex flex-col gap-1.5">
            <span className="text-sm text-ink">{item.uploaderName}님</span>
            <div className="relative aspect-[352/267] rounded-2xl bg-surface border border-border overflow-hidden">
              <img src={item.imageUrl} alt={item.location ?? "가족 사진"} className="w-full h-full object-cover" />
              {item.location && (
                <span className="absolute bottom-3 right-3 rounded-full bg-ink/55 px-3 py-1 text-xs text-white">
                  📍{item.location}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {pickingDate && (
        <CalendarSheet
          value={selectedDate ?? new Date()}
          onSelect={setSelectedDate}
          onClose={() => setPickingDate(false)}
        />
      )}
    </Screen>
  );
}
