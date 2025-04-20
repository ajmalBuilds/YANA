import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { auth } from './firebase';

export const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const register = async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  await updateProfile(userCredential.user, {
    displayName: name,
  });
};

export const logout = () => signOut(auth);
