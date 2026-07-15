import type { ChatMessage, FamilyMember, GalleryItem } from "../types";

export const familyName = "김가네";

export const members: FamilyMember[] = [
  {
    id: "grandma",
    name: "김순자",
    relation: "할머니",
    emoji: "👵",
    status: "active",
  },
  {
    id: "mom",
    name: "이정숙",
    relation: "엄마",
    emoji: "👩",
    status: "active",
  },
  {
    id: "dad",
    name: "김도윤",
    relation: "아빠",
    emoji: "👨",
    status: "busy",
  },
  {
    id: "me",
    name: "김지영",
    relation: "나",
    emoji: "🙋‍♀️",
    status: "none",
    isMe: true,
  },
  {
    id: "brother",
    name: "김민재",
    relation: "오빠",
    emoji: "🧑",
    status: "none",
  },
  {
    id: "grandson",
    name: "박서준",
    relation: "손자",
    emoji: "👦",
    status: "sleeping",
  },
];

export const chatMessages: ChatMessage[] = [
  {
    id: "m1",
    authorId: "grandson",
    kind: "voice",
    text: "할머니 뭐해요~?",
    durationSec: 3,
    createdAt: "09:41",
  },
  {
    id: "m2",
    authorId: "grandson",
    kind: "voice",
    durationSec: 5,
    createdAt: "09:41",
  },
  {
    id: "m3",
    authorId: "grandson",
    kind: "voice",
    durationSec: 4,
    createdAt: "09:42",
  },
  {
    id: "m4",
    authorId: "me",
    kind: "voice",
    durationSec: 2,
    createdAt: "09:43",
  },
];

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    uploaderId: "mom",
    uploadedAt: "2026-07-14",
    imageUrl: "",
  },
  {
    id: "g2",
    uploaderId: "grandson",
    uploadedAt: "2026-07-12",
    imageUrl: "",
  },
  {
    id: "g3",
    uploaderId: "grandma",
    uploadedAt: "2026-07-10",
    imageUrl: "",
  },
];

export function getMember(id: string): FamilyMember | undefined {
  return members.find((m) => m.id === id);
}
