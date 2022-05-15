import { collection, doc, getDoc } from "firebase/firestore"
import { getData } from "../config/asyncStorage";
import { firestore } from "../config/firebase"

export const getCallRef = () => {
  const callCollection = collection(firestore, 'calls');
  return doc(callCollection, 'callsDoc');
}

export const getMyCalleeRef = async () => {
  const callCollection = collection(firestore, 'calls');
  const callsDoc = doc(callCollection, 'callsDoc');
  const calleesCollection = collection(callsDoc, 'callees');
  const user: any = await getData('user', true);

  return doc(calleesCollection, user!.userId);
};