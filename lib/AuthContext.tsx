"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';
import { getUserProfile, UserProfile } from './authService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
        try {
          setLoading(true);
          
          if (authUser) {
            setUser(authUser);
            
            // Fetch additional user profile data from Firestore
            try {
              const profile = await getUserProfile(authUser.uid);
              setUserProfile(profile);
            } catch (profileError) {
              console.error('Error fetching user profile:', profileError);
              // Don't set error state for profile fetch issues
            }
          } else {
            setUser(null);
            setUserProfile(null);
          }
          
          setError(null);
        } catch (err) {
          console.error('Auth state change error:', err);
          setError('Failed to process authentication');
        } finally {
          setLoading(false);
        }
      });

      return () => {
        try {
          unsubscribe();
        } catch (err) {
          console.error('Error unsubscribing from auth state:', err);
        }
      };
    } catch (err) {
      console.error('Firebase initialization error:', err);
      setError('Firebase is not properly configured');
      setLoading(false);
      // Return empty function as cleanup
      return () => {};
    }
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 