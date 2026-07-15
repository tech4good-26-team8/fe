import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { ImageIcon } from "../components/icons";
import { galleryItems, getMember } from "../data/mockFamily";

export function Gallery() {
  return (
    <Screen>
      <TopBar title="갤러리" />
      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 px-5 py-4">
        {galleryItems.map((item) => {
          const uploader = getMember(item.uploaderId);
          return (
            <div key={item.id} className="flex flex-col gap-1.5">
              <div className="aspect-square rounded-2xl bg-surface border border-border flex items-center justify-center text-ink-muted">
                <ImageIcon className="w-8 h-8" />
              </div>
              <span className="text-xs text-ink">
                {uploader?.emoji} {uploader?.name}
              </span>
              <span className="text-xs text-ink-muted">{item.uploadedAt}</span>
            </div>
          );
        })}
      </div>
    </Screen>
  );
}
