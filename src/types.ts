export type MemberStatus = "active" | "busy" | "sleeping" | "none";

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  emoji: string;
  status: MemberStatus;
  isMe?: boolean;
}

export interface ChatMessage {
  id: string;
  authorId: string;
  kind: "voice" | "text";
  text?: string;
  durationSec?: number;
  audioUrl?: string;
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  uploaderId: string;
  uploadedAt: string;
  imageUrl: string;
}
