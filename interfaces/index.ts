// Import types
import { messageType } from "../types";

// Actual interfaces:
// User interface
export interface User {
  name?: string;
  requests?: string[];
  friendsIds?: string[];
  chatsIds?: string[];
  pictureUrl?: string;
  userId?: string;
  isLogedIn?: boolean | undefined;
  exists?: boolean;
  userName?: string;
}

// Message interface (to be contained in chats)
export interface Message {
  id: number;
  type: messageType;
  pictureUrl?: string;
  senderId: string;
  text?: string;
}

// Chat interface
export interface Chat {
  messages: Message[];
  usersIds: string[];
}
