// Firebase general imports
import { initializeApp } from "firebase/app";

// Firestore (data base's) imports
import { getFirestore } from "firebase/firestore";

// Auth imports
import { getAuth } from "firebase/auth";

// Expo imports
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
  measurementId: Constants.manifest.extra.measurementId,
};
initializeApp(firebaseConfig);

export const firestore = getFirestore();

export const auth = getAuth();
