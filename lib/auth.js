import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);
export const register = async (email, password, name, role = "user") => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    role, // 'admin' or 'user'
    createdAt: new Date(),
  });
};

export const logout = () => signOut(auth);
