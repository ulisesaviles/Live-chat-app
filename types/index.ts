// import interfaces
import { User } from "../interfaces";

// This type allows to handle colors easyly
export type ColorSchemeType = "dark" | "light";

// Message type
export type messageType = "img" | "txt";

// Conversation for home
export type ConversationForHome = {
  user: User;
  conversationId: string;
  lastMessage?: {
    text?: string;
    timestamp: number;
    senderId?: string;
    type: "txt" | "img";
  };
  chatId?: string;
};

export enum InCallOptions {
  VIDEO = "video",
  AUDIO = "audio",
  SWAP = "swap",
  END_CALL = "endCall",
  ANSWER_CALL = "answer",
}

export enum CallStates {
  WAITING = "waiting",
  ON_CALL = "onCall",
  CALL_ENDED = "ended",
  INCOMING_CALL = "incoming",
}
