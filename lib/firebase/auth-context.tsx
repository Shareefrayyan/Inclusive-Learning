'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, User } from 'firebase/auth';
import { auth } from './config';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: string;
  class: string;
  rollNumber: string;
  streak: number;
  scoreImprovement: number;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔥 Auth state changed:', firebaseUser ? 'User logged in' : 'User logged out');
      setUser(firebaseUser);
      setLoading(true);
      setUserProfile(null);
      if (firebaseUser) {
        try {
          console.log('👤 Fetching user profile for UID:', firebaseUser.uid);
          const db = getFirestore();
          const profileRef = doc(db, 'users', firebaseUser.uid);
          const profileSnap = await getDoc(profileRef);
          if (profileSnap.exists()) {
            const profileData = profileSnap.data() as UserProfile;
            console.log('✅ User profile loaded:', profileData);
            setUserProfile(profileData);
          } else {
            console.log('❌ No user profile found in Firestore');
            setUserProfile(null);
          }
        } catch (err) {
          console.error('❌ Error fetching user profile:', err);
          setError(err as Error);
          setUserProfile(null);
        }
      }
      setLoading(false);
    }, (err) => {
      console.error('❌ Auth state change error:', err);
      setError(err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Attempting signin for:', email);
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase signin successful:', result.user.uid);
    } catch (err) {
      console.error('❌ Firebase signin error:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, error, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 