'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signUpStudent } from '@/lib/firebase/signUpStudent';
import { signUpParent } from '@/lib/firebase/signUpParent';
import { signUpPrincipal } from '@/lib/firebase/signUpPrincipal';
import { signUpTeacher } from '@/lib/firebase/signUpTeacher';

const classOptions = [
  '6A', '6B', '7A', '7B', '8A', '8B', '9A', '9B'
];

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role');

  // Common fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Student fields
  const [studentClass, setStudentClass] = useState('');
  const [rollNumber, setRollNumber] = useState('');

  // Parent fields
  const [childName, setChildName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (role === 'student' && (!studentClass || !rollNumber)) {
      setError('Please fill in all fields.');
      return;
    }
    if (role === 'parent' && !childName) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    let result = { success: true };
    if (role === 'student') {
      result = await signUpStudent({ name, email, password, studentClass, rollNumber });
    } else if (role === 'parent') {
      result = await signUpParent({ name, email, password, childName });
    } else if (role === 'principal') {
      result = await signUpPrincipal({ name, email, password });
    } else if (role === 'teacher') {
      result = await signUpTeacher({ name, email, password });
    }
    setLoading(false);
    if (result.success) {
      setSuccess('Signup successful! Redirecting to dashboard...');
      setTimeout(() => {
        if (role === 'student') router.push('/dashboard/student');
        else if (role === 'parent') router.push('/dashboard/parent');
        else if (role === 'principal') router.push('/dashboard/principal');
        else if (role === 'teacher') router.push('/dashboard/teacher');
      }, 1500);
    } else {
      setError('Signup failed.');
    }
  };

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-green-50 py-8 px-2">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-2">Select your role</h1>
          <div className="grid grid-cols-2 gap-4">
            <a href="/signup?role=student" className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-center font-semibold">Student</a>
            <a href="/signup?role=parent" className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-center font-semibold">Parent</a>
            <a href="/signup?role=teacher" className="p-4 rounded-xl bg-green-50 hover:bg-green-100 text-center font-semibold">Teacher</a>
            <a href="/signup?role=principal" className="p-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-center font-semibold">Principal</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-pink-50 to-green-50 py-8 px-2">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-2">Create your account</h1>
        <p className="text-center text-slate-500 mb-4">Sign up to get started as a {role}</p>
        {error && <div className="bg-red-100 text-red-700 rounded-md px-4 py-2 text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 rounded-md px-4 py-2 text-center">{success}</div>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
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
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
          required
        />
        {role === 'student' && (
          <>
            <select
              value={studentClass}
              onChange={e => setStudentClass(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            >
              <option value="">Select Class</option>
              {classOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Roll Number"
              value={rollNumber}
              onChange={e => setRollNumber(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </>
        )}
        {role === 'parent' && (
          <input
            type="text"
            placeholder="Child's Name"
            value={childName}
            onChange={e => setChildName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
            required
          />
        )}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-indigo-700 transition-all duration-150"
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </button>
        <p className="text-center text-sm mt-2">
          Already have an account? <a href="/signin" className="text-indigo-600 font-medium hover:underline">Sign in</a>
        </p>
      </form>
    </div>
  );
} 