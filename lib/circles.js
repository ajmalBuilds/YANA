import { db } from "./firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

const circlesCollection = collection(db, "circles");

export async function createCircle(data, ownerId) {
  const docRef = await addDoc(circlesCollection, {
    ...data,
    ownerId,
    createdAt: serverTimestamp(),
    members: [ownerId],
  });
  return docRef.id;
}

export async function getAllCircles() {
  const snapshot = await getDocs(circlesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
