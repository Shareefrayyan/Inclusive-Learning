import { auth } from '../firebase';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export async function signUpStudent({ name, email, password, studentClass, rollNumber }) {
  const db = getFirestore();

  try {
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Create Firestore record
    const studentRef = doc(db, 'users', user.uid);
    await setDoc(studentRef, {
      uid: user.uid,
      displayName: name,
      email: user.email,
      role: 'student',
      class: studentClass,
      rollNumber,
      streak: 0,
      scoreImprovement: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    console.error('Error during student signup:', error);
    return { success: false, error };
  }
} 