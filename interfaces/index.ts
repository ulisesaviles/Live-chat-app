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
}

// Message interface (to be contained in chats)
type messageType = "img" | "txt";
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
