"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/firebase/auth-context';

export default function SigninPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams?.get('role') || 'student';
  const { signIn, signOut, loading, userProfile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [justSignedIn, setJustSignedIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    try {
      await signIn(email, password);
      setSuccess('Sign in successful! Redirecting...');
      setJustSignedIn(true);
    } catch (err: any) {
      setError(err?.message || 'Sign in failed.');
    }
  };

  useEffect(() => {
    // Only handle redirect after a fresh sign-in attempt
    if (userProfile && justSignedIn) {
      console.log('📍 Redirecting user after fresh signin:', userProfile);
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        // Always redirect based on the user's actual role from the database
        if (userProfile.role === 'parent') router.push('/dashboard/parent');
        else if (userProfile.role === 'teacher') router.push('/dashboard/teacher');
        else if (userProfile.role === 'principal') router.push('/dashboard/principal');
        else router.push('/dashboard/student');
      }, 1000); // 1 second delay
    }
  }, [userProfile, router, justSignedIn]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-green-50 py-8 px-2">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2">Sign in to your account</h1>
        <p className="text-center text-slate-500 mb-4">Welcome back! Please enter your credentials.</p>
        
        {error && <div className="bg-red-100 text-red-700 rounded-md px-4 py-2 text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 rounded-md px-4 py-2 text-center">{success}</div>}
        
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-indigo-700 transition-all duration-150"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        
        <p className="text-center text-sm mt-2">
          Don&apos;t have an account? <a href={`/signup?role=${role}`} className="text-indigo-600 font-medium hover:underline">Sign up</a>
        </p>
      </form>
    </div>
  );
} 