// Firestore (data base's) imports
import { setDoc, doc, updateDoc, getDoc } from "firebase/firestore";

// Auth imports
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

// Import db
import { firestore, auth } from "../config/firebase";

// Import user interface
import { User } from "../interfaces";

// Avoid AsyncStorage alerts
import { LogBox } from "react-native";
LogBox.ignoreAllLogs(true);

// User related functions
export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
  let user: User = {
    name,
    requests: [],
    friendsIds: [],
    chatsIds: [],
  };
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userId = userCredential.user.uid;
    await setDoc(doc(firestore, "users", userId), user);
    user.isLogedIn = true;
    user.userId = userId;
  } catch (e) {
    user.isLogedIn = false;
    console.log(e);
  } finally {
    return user;
  }
}

export async function signIn(email: string, password: string): Promise<User> {
  let user: User = {
    isLogedIn: false,
  };
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    user = {
      ...user,
      ...(await getUserDoc(userCredential.user.uid)),
      isLogedIn: true,
    };
  } catch (e) {
    console.log(e);
    user.isLogedIn = false;
  } finally {
    return user;
  }
}

export async function createAuthListener(
  IfUserLogedInCallBack: Function,
  IfUserNotLogedInCallBack: Function
): Promise<void> {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      IfUserLogedInCallBack(user.uid);
    } else {
      IfUserNotLogedInCallBack();
    }
  });
}

export async function updateUser(
  userId: string,
  newFields: object,
  getUser?: boolean
): Promise<void | User> {
  await updateDoc(doc(firestore, "users", userId), newFields);
  if (getUser) return await getUserDoc(userId);
}

export async function getUserDoc(userId: string): Promise<User> {
  const document = await getDoc(doc(firestore, "users", userId));
  let user: User = {
    exists: document.exists(),
    userId,
    ...document.data(),
  };
  return user;
}
