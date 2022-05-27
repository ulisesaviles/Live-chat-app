import { collection, deleteDoc, doc, getDoc, getDocs } from "firebase/firestore"
import { getData } from "../config/asyncStorage";
import { firestore } from "../config/firebase"

export const getNewCallRef = (caller: string, callee: string) => {
  const callCollection = collection(firestore, 'calls');
  return doc(callCollection, `${caller}_${callee}`);
}

export const getCallCollectionRef = () => {
  return collection(firestore, 'calls');
}

export const getCallDocsRef = async () => {
  const user: any = await getData('user', true);
  const callCollection = collection(firestore, 'calls');
  return await getDocs(callCollection);
};

export const deleteCallDoc = async () => {
  const user: any = await getData('user', true);

  const callsCollection = collection(firestore, 'calls');

  const docs = await getDocs(callsCollection);

  const callDocRef = docs.docs.find(doc => doc.id.includes(user!.userId));
  if (callDocRef) {
    const callerCollection = collection(doc(callsCollection, callDocRef.id), 'caller');
    const calleeCollection = collection(doc(callsCollection, callDocRef.id), 'callee');
    
    const callerDocs = await getDocs(callerCollection);
    callerDocs.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    const calleeDocs = await getDocs(calleeCollection);
    calleeDocs.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    await deleteDoc(callDocRef.ref);
  }
}

export const getCallReceivedData = async () => {
  const user: any = await getData('user', true);

  const callsCollection = collection(firestore, 'calls');

  const docs = await getDocs(callsCollection);

  const callDocRef = docs.docs.find(doc => doc.id.includes(`_${user!.userId}`));
  return await callDocRef?.data();
};

export const getCallReceivedRef = async () => {
  const user: any = await getData('user', true);

  const callsCollection = collection(firestore, 'calls');

  const docs = await getDocs(callsCollection);

  const callDocRef = docs.docs.find(doc => doc.id.includes(`_${user!.userId}`));
  
  return doc(callsCollection, callDocRef?.id);
};