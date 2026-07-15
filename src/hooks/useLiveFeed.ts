import { chatMessages } from "../data/mockFamily";
import type { ChatMessage } from "../types";

// Mock data for now — swap the body for a WebSocket subscription once the
// realtime backend endpoint exists. Consumers only rely on the returned array.
export function useLiveFeed(): ChatMessage[] {
  return chatMessages;
}
