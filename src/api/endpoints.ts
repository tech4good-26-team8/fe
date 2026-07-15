import { apiGet, apiPatch, apiPost, apiPostForm } from "./client";
import type {
  CreateGroupRequest,
  GroupResponse,
  JoinMemberRequest,
  JoinMemberResponse,
  MemberCardResponse,
  MemberResponse,
  MessageResponse,
  PhotoResponse,
  ReadMessagesRequest,
  ReadResultResponse,
  SendTextMessageRequest,
  UpdateMemberRequest,
} from "./types";

export function createGroup(req: CreateGroupRequest) {
  return apiPost<GroupResponse>("/groups", req);
}

export function getGroup(groupId: number) {
  return apiGet<GroupResponse>(`/groups/${groupId}`);
}

export function joinGroup(req: JoinMemberRequest) {
  return apiPost<JoinMemberResponse>("/members", req);
}

export function listMembers(groupId: number, viewerId?: number) {
  return apiGet<MemberCardResponse[]>("/members", { groupId, viewerId });
}

export function getMember(memberId: number) {
  return apiGet<MemberResponse>(`/members/${memberId}`);
}

export function updateMember(memberId: number, req: UpdateMemberRequest) {
  return apiPatch<MemberResponse>(`/members/${memberId}`, req);
}

export function uploadAvatar(memberId: number, photo: Blob, filename = "photo.jpg") {
  const form = new FormData();
  form.set("photo", photo, filename);
  return apiPostForm<MemberResponse>(`/members/${memberId}/avatar`, form);
}

export function uploadVoicepack(memberId: number, audio: Blob, filename = "voicepack.wav") {
  const form = new FormData();
  form.set("audio", audio, filename);
  return apiPostForm<MemberResponse>(`/members/${memberId}/voicepack`, form);
}

export function getMemberMessages(memberId: number, viewerId: number, unreadOnly = true) {
  return apiGet<MessageResponse[]>(`/members/${memberId}/messages`, { viewerId, unreadOnly });
}

export function listMessages(groupId: number, after?: number) {
  return apiGet<MessageResponse[]>("/messages", { groupId, after });
}

export function sendTextMessage(req: SendTextMessageRequest) {
  return apiPost<MessageResponse>("/messages", req);
}

export function sendVoiceMessage(senderId: number, audio: Blob, filename = "voice.webm") {
  const form = new FormData();
  form.set("audio", audio, filename);
  return apiPostForm<MessageResponse>("/messages/voice", form, { senderId });
}

export function sendImageMessage(senderId: number, image: Blob, filename = "image.jpg") {
  const form = new FormData();
  form.set("image", image, filename);
  return apiPostForm<MessageResponse>("/messages/image", form, { senderId });
}

export function markMessagesRead(req: ReadMessagesRequest) {
  return apiPost<ReadResultResponse>("/messages/read", req);
}

export function listPhotos(groupId: number, date?: string) {
  return apiGet<PhotoResponse[]>("/photos", { groupId, date });
}

export function uploadPhoto(
  uploaderId: number,
  image: Blob,
  opts: { location?: string; takenDate?: string; filename?: string } = {},
) {
  const form = new FormData();
  form.set("image", image, opts.filename ?? "photo.jpg");
  return apiPostForm<PhotoResponse>("/photos", form, { uploaderId, location: opts.location, takenDate: opts.takenDate });
}
