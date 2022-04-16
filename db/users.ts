// Firestore (data base's) imports
import {
  setDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

// Auth imports
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// Import db
import { firestore, auth, storage } from "../config/firebase";

// Import user interface
import { User, Chat } from "../interfaces";

// AsyncStorage handler
import { setData } from "../config/asyncStorage";

// User related functions
// Create user doc
export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  // Helpers
  const getUserName = (fullName: string): string => {
    fullName = fullName.trim();
    const phraseAsArray: string[] = fullName.split(" ");
    let phraseAsStr: string = "";
    for (let i = 0; i < phraseAsArray.length; i++) {
      const word = phraseAsArray[i];
      phraseAsStr += word.charAt(0).toUpperCase();
      phraseAsStr += word.substring(1);
    }
    return phraseAsStr;
  };

  // Build default empty user
  let user: User = {
    name,
    requests: [],
    friendsIds: [],
    chatsIds: [],
  };
  try {
    // Create user using firebase auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get userId
    const userId = userCredential.user.uid;

    // Create userName
    const usersColleciton = await getDocs(collection(firestore, "users"));
    const userName = `${getUserName(name)}${usersColleciton.size}`;
    user.userName = userName;

    // Create document in firestore
    await setDoc(doc(firestore, "users", userId), user);

    // Actually sign in using firebase auth
    await signInWithEmailAndPassword(auth, email, password);

    // Add fields  when loged in
    user.isLogedIn = true;
    user.userId = userId;

    // Store user
    await setData(user, "user");
  } catch (e) {
    // Catch error
    user.isLogedIn = false;
    console.log(e);
  } finally {
    // Return user
    return user;
  }
}

// Handle sign in
export async function userSignIn(
  email: string,
  password: string
): Promise<User> {
  // Create user obj
  let user: User = {
    isLogedIn: false,
  };
  try {
    // Actually sign in using firebase auth
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;

    // Build user object
    user = {
      ...(await getUserDoc(userId)),
      isLogedIn: true,
      userId,
    };

    // Store user
    await setData(user, "user");
  } catch (e) {
    // Catch errors
    console.log(e);
    user.isLogedIn = false;
  } finally {
    // Return user
    return user;
  }
}

// Create an auth listener taking callback functions as parameters
type callBack = (userId: string) => void;
export function createAuthListener(
  IfUserLogedInCallBack: callBack,
  IfUserNotLogedInCallBack: callBack
): void {
  // Create listener passing the callbacks provided
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // If loged in
      IfUserLogedInCallBack(user.uid);
    } else {
      // If not
      IfUserNotLogedInCallBack("");
    }
  });
}

// Update user by providing only the new fields
export async function updateUser(
  userId: string,
  newFields: object,
  getUser?: boolean
): Promise<void | User> {
  // Update user in firebase
  await updateDoc(doc(firestore, "users", userId), newFields);

  // Return updated user if requested
  if (getUser) return await getUserDoc(userId);
}

// Get full user doc providing the user id
export async function getUserDoc(userId: string): Promise<User> {
  // Get document
  const document = await getDoc(doc(firestore, "users", userId));

  // Add user id and exists fields
  let user: User = {
    exists: document.exists(),
    userId,
    ...document.data(),
  };

  // Return it
  return user;
}

// Sign out
export async function userSignOut(): Promise<void> {
  await signOut(auth);
}

// Change profile picture
export async function changeProfilePic(
  userId: string,
  uri: string
): Promise<any> {
  try {
    // Here we transform our uri into a blob image
    let res: any = await fetch(uri);
    const blob = await res.blob();
    let user;

    // Then we get the reference of WHERE exactly in our bucket we want to store the image
    const storageRef = ref(storage, `profilePictures/${userId}`);

    // Then we create our job
    const uploadTask = uploadBytesResumable(storageRef, blob);

    // When executing our opload
    uploadTask.on(
      "state_changed",
      // Here we can see our upload progress
      (snapshot: any) => {},
      // Here we will log the error in case we got any
      (error: any) => console.log(error),
      // Then, when we know everything went great, we will create a download URL and put it into the pictureUrl property of our user
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          user = await updateUser(userId, { pictureUrl: url }, true);
          if (user) {
            // Then, we will update our local copy of our user so we don't have to retrieve it every time we want to know something about our user
            setData(user, "user");
          }
        });
      }
    );
  } catch (error) {
    console.log(error);
  }
}

// Create userDoc listener
type listenerCallBack = (user: User) => void;
export function setUserDocListener(
  userId: string,
  callBack: listenerCallBack
): void {
  onSnapshot(doc(firestore, "users", userId), (document) => {
    callBack({ ...document.data(), userId: document.id });
  });
}

// Create chat doc
export async function createChat(usersIds: string[]): Promise<string | null> {
  try {
    // Build info object
    const newChatInfo: Chat = { usersIds };

    // Create chatId
    const chatId: string = `${usersIds[0]}_${usersIds[1]}`;

    // Create info doc
    const chatsCollection = collection(firestore, "chats");
    const chatsDoc = doc(chatsCollection, "chatsDoc");
    const chatCollection = collection(chatsDoc, chatId);
    const infoDoc = doc(chatCollection, "info");
    await setDoc(infoDoc, newChatInfo);

    // Return id
    return chatId;
  } catch (e) {
    console.log(e);
    // Return err
    return null;
  }
}

// Send a user a friend request
export async function sendFriendRequest(
  userId: string,
  myId: string
): Promise<boolean> {
  try {
    // Get users current requests
    let user = await getUserDoc(userId);

    // Push myId
    if (!user.requests?.includes(myId)) user.requests?.push(myId);

    // Update userDoc
    await updateUser(userId, { requests: user.requests });

    // Return Success
    return true;
  } catch (e) {
    // Error
    return false;
  }
}

// Decline friend request
export async function declineFriendRequest(
  userId: string,
  myId: string
): Promise<boolean> {
  try {
    // Get my document to read requests
    let user = await getUserDoc(myId);

    // Push myId
    user.requests?.splice(user.requests.indexOf(userId), 1);

    // Update userDoc
    await updateUser(myId, { requests: user.requests });

    // Return Success
    return true;
  } catch (e) {
    // Error
    return false;
  }
}

// Accept friend request
export async function acceptFriendRequest(
  userId: string,
  myId: string
): Promise<boolean> {
  try {
    // Get both users
    let me = await getUserDoc(myId);
    let him = await getUserDoc(userId);

    // Remove him from my requests
    me.requests?.splice(me.requests.indexOf(userId), 1);

    // Add friends
    me.friendsIds?.push(userId);
    him.friendsIds?.push(myId);

    // Create chat
    const chatId = await createChat([myId, userId]);

    // Add chatId to both users
    me.chatsIds?.push(chatId!);
    him.chatsIds?.push(chatId!);

    // Update both users
    await updateUser(myId, {
      requests: me.requests,
      friendsIds: me.friendsIds,
      chatsIds: me.chatsIds,
    });
    await updateUser(userId, {
      friendsIds: him.friendsIds,
      chatsIds: him.chatsIds,
    });

    // Return Success
    return true;
  } catch (e) {
    // Error
    return false;
  }
}

// Remove friend
export async function removeFriend(
  userId: string,
  myId: string
): Promise<boolean> {
  try {
    // Get both users
    let me = await getUserDoc(myId);
    let him = await getUserDoc(userId);

    // Remove friends
    me.friendsIds?.splice(me.friendsIds.indexOf(userId), 1);
    him.friendsIds?.splice(him.friendsIds.indexOf(myId), 1);

    // Update both users
    await updateUser(myId, {
      friendsIds: me.friendsIds,
    });
    await updateUser(userId, {
      friendsIds: him.friendsIds,
    });

    // Return Success
    return true;
  } catch (e) {
    // Error
    return false;
  }
}

// Get all users
export async function getAllUsers(): Promise<User[] | null> {
  try {
    // Get users collection
    const usersColleciton = await getDocs(collection(firestore, "users"));

    // Parse collection into array of users
    let users: User[] = [];
    usersColleciton.forEach((doc) => {
      users.push({
        userId: doc.id,
        ...doc.data(),
      });
    });

    // Return it
    return users;
  } catch (e) {}
  // Return err
  return null;
}
