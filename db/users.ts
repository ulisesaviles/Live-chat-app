// Firestore (data base's) imports
import { setDoc, doc, updateDoc, getDoc } from "firebase/firestore";
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

    // Build user object
    user = {
      ...(await getUserDoc(userCredential.user.uid)),
      isLogedIn: true,
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

//Change profile picture
export async function changeProfilePic(userId: string, uri: string): Promise<any> {
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
      (snapshot: any) => {
      },
      // Here we will log the error in case we got any
      (error: any) => console.log(error),
      // Then, when we know everything went great, we will create a download URL and put it into the pictureUrl property of our user
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then(async (url) => {
          user = await updateUser(userId, {pictureUrl: url}, true);
          if (user) {
            // Then, we will update our local copy of our user so we don't have to retrieve it every time we want to know something about our user
            setData(user, "user");
          }
        });
      }
    );
  }
  catch(error) {
    console.log(error);
  }
}