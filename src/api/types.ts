export type GenStatus = "PENDING" | "PROCESSING" | "READY" | "FAILED";
export type MessageType = "TEXT" | "VOICE" | "IMAGE";

export interface GroupResponse {
  groupId: number;
  name: string;
  inviteCode: string;
}

export interface CreateGroupRequest {
  name: string;
}

export interface JoinMemberRequest {
  name: string;
  inviteCode: string;
}

export interface JoinMemberResponse {
  memberId: number;
  voiceScript: string;
  avatarStatus: GenStatus;
  voiceStatus: GenStatus;
}

export interface MemberResponse {
  memberId: number;
  name: string;
  avatarUrl?: string;
  avatarStatus: GenStatus;
  voiceStatus: GenStatus;
  greetingAudioUrl?: string;
}

export interface UpdateMemberRequest {
  name: string;
}

export interface UnreadPreview {
  messageId: number;
  type: MessageType;
  textPreview?: string;
  createdAt: string;
}

export interface MemberCardResponse {
  memberId: number;
  name: string;
  avatarUrl?: string;
  avatarStatus: GenStatus;
  unreadCount: number;
  latestUnread?: UnreadPreview;
}

export interface MessageResponse {
  messageId: number;
  senderId: number;
  senderName: string;
  type: MessageType;
  text?: string;
  audioUrl?: string;
  imageUrl?: string;
  convertStatus: GenStatus;
  createdAt: string;
}

export interface SendTextMessageRequest {
  senderId: number;
  text: string;
}

export interface ReadMessagesRequest {
  readerId: number;
  senderId?: number;
}

export interface ReadResultResponse {
  readCount: number;
}

export interface PhotoResponse {
  photoId: number;
  uploaderId: number;
  uploaderName: string;
  imageUrl: string;
  location?: string;
  takenDate: string;
  createdAt: string;
}
