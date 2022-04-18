// Firestore (data base's) imports
import {
  setDoc,
  doc,
  getDoc,
  collection,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getData } from "../config/asyncStorage";

// Import db
import { firestore, storage } from "../config/firebase";

// Import user interface
import { User, Chat, Message } from "../interfaces";
import { ConversationForHome } from "../types";

// Import user functions
import { getUserDoc } from "./users";

// Chat related functions
// Create chat doc
export async function createChat(usersIds: string[]): Promise<string | null> {
  try {
    // Build info object
    const newChatInfo: Chat = { usersIds };

    // Create chatId
    let chatId: string = `${usersIds[0]}_${usersIds[1]}`;

    // Create info doc
    const chatsCollection = collection(firestore, "chats");
    const chatsDoc = doc(chatsCollection, "chatsDoc");
    let chatCollection = collection(chatsDoc, chatId);
    let infoDoc = doc(chatCollection, "info");
    if (!(await getDoc(infoDoc)).exists) {
      chatId = `${usersIds[1]}_${usersIds[0]}`;
      chatCollection = collection(chatsDoc, chatId);
      infoDoc = doc(chatCollection, "info");
    }
    await setDoc(infoDoc, newChatInfo);

    // Return id
    return chatId;
  } catch (e) {
    console.log(e);
    // Return err
    return null;
  }
}

// Create chat listener
type ConversationListenerCallBack = (conversation: ConversationForHome) => void;
export async function setChatCollectionListener(
  chatId: string,
  myId: string,
  callBack: ConversationListenerCallBack
): Promise<void> {
  // Get chat reference
  const chatsCollection = collection(firestore, "chats");
  const chatsDoc = doc(chatsCollection, "chatsDoc");
  const chatCollection = collection(chatsDoc, chatId);

  // Get user info
  const infoDoc = (await getDoc(doc(chatCollection, "info"))).data();
  let user: User;
  for (let i = 0; i < infoDoc?.usersIds.length; i++) {
    const userId = infoDoc?.usersIds[i];
    if (userId !== myId) user = await getUserDoc(userId);
  }

  // Set listener
  onSnapshot(chatCollection, async (collection) => {
    // Get last message
    const messages = collection.docs;
    let lastMessage:
      | {
          text?: string;
          timestamp: number;
          type: "txt" | "img";
        }
      | undefined = undefined;
    if (messages.length > 1) {
      lastMessage = messages[messages.length - 2];
      lastMessage = {
        ...lastMessage.data(),
        timestamp: parseInt(lastMessage.id),
      };
    }

    // Build conversation
    const conversation: ConversationForHome = {
      conversationId: chatId,
      lastMessage,
      user: user!,
      chatId,
    };

    // Call callback
    callBack(conversation);
  });
}

// Get all chats
export async function getAllChats(
  userId: string
): Promise<ConversationForHome[]> {
  // Get user
  const user = await getUserDoc(userId);

  // Get chats
  let chats: ConversationForHome[] = [];
  for (let i = 0; i < user.chatsIds!.length; i++) {
    const chatId = user.chatsIds![i];

    // Get chat reference
    const chatsCollection = collection(firestore, "chats");
    const chatsDoc = doc(chatsCollection, "chatsDoc");
    const chatCollection = collection(chatsDoc, chatId);

    // Get user info
    const infoDoc = (await getDoc(doc(chatCollection, "info"))).data();

    // Get user chattingWith
    let friend: User;
    for (let i = 0; i < infoDoc?.usersIds.length; i++) {
      const friendId = infoDoc?.usersIds[i];
      if (friendId !== userId) friend = await getUserDoc(friendId);
    }

    // Get last message
    const chat = await getDocs(chatCollection);
    const messages = chat.docs;
    let lastMessage:
      | {
          text?: string;
          timestamp: number;
          type: "txt" | "img";
        }
      | undefined = undefined;
    if (messages.length > 1) {
      lastMessage = messages[messages.length - 2];
      lastMessage = {
        ...lastMessage.data(),
        timestamp: parseInt(lastMessage.id),
      };
    }

    // Build conversation
    const conversation: ConversationForHome = {
      conversationId: chatId,
      lastMessage,
      user: friend!,
      chatId,
    };

    // Push it into the array
    chats.push(conversation);
  }

  // Return them
  return chats;
}

export const sendMessage = async (chatId: string, message: Message) => {
  const chatsCollection = collection(firestore, "chats");
  const chatsDoc = doc(chatsCollection, "chatsDoc");
  const chatCollection = collection(chatsDoc, chatId);
  const timestamp = new Date().getTime();
  const messageDoc = doc(chatCollection, timestamp.toString());
  let updatedMessage: Message = { ...message };

  if (message.type === "img") {
    let res: any = await fetch(message.pictureUrl!);
    const blob = await res.blob();

    const storageRef = ref(storage, `chats/${chatId}/${timestamp}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot: any) => {},
      (error: any) => console.log(error),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          updatedMessage["pictureUrl"] = url;
          await setDoc(messageDoc, updatedMessage);
        });
      }
    );
  } else {
    await setDoc(messageDoc, message);
  }
};

export const getMessages = async (chatId: string) => {
  const chatsCollection = collection(firestore, "chats");
  const chatsDoc = doc(chatsCollection, "chatsDoc");
  const chatCollection = collection(chatsDoc, chatId);

  const messages = (await getDocs(chatCollection)).docs;
  let populatedMessages: any[] = [];
  messages.forEach(async (message) => {
    populatedMessages.push(await message.data());
  });

  return populatedMessages;
};

export const messagesListener = async (
  chatId: string,
  callback: (messages: any) => void
) => {
  const user: any = await getData("user", true);

  const chatsCollection = collection(firestore, "chats");
  const chatsDoc = doc(chatsCollection, "chatsDoc");
  const chatCollection = collection(chatsDoc, chatId);
  const infoDoc: any = (await getDoc(doc(chatCollection, "info"))).data();

  if (infoDoc.usersIds.find((id: any) => id === user.userId)) {
    onSnapshot(chatCollection, async (snapshot) => {
      let messages: any = [];
      let added = false;
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          added = true;
        }
      });

      if (added) {
        await snapshot.docs.forEach(async (doc) => {
          const message = await doc.data();
          if (!message.usersIds) {
            messages.push(message);
          }
        });
      }
      callback(messages);
    });
  }
};
