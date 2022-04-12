// Firestore (data base's) imports
import { setDoc, doc, updateDoc, getDoc } from "firebase/firestore";

// Auth imports
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

// Import db
import { firestore, auth } from "../config/firebase";

// Import user interface
import { User } from "../interfaces";

// AsyncStorage handler
import { setData } from "../config/asyncStorage";

// User related functions
// Create user doc
export async function createUser(
  email: string,
  password: string,
  name: string
): Promise<User> {
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

    // Get user id
    const userId = userCredential.user.uid;

    // Create document in firestore
    await setDoc(doc(firestore, "users", userId), user);

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

    // Build user object
    user = {
      ...(await getUserDoc(userCredential.user.uid)),
      isLogedIn: true,
    };
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
