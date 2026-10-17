import { auth } from '../firebase';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function signUpParent({ name, email, password, childName }) {
  const db = getFirestore();

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Create Firestore record
    const parentRef = doc(db, 'users', user.uid);
    await setDoc(parentRef, {
      uid: user.uid,
      displayName: name,
      email: user.email,
      role: 'parent',
      childName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error during parent signup:', error);
    return { success: false, error };
  }
} 