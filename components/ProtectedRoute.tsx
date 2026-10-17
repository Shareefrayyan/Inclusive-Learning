"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/firebase/auth-context'
import { UserRole } from '@/lib/authService'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userProfile, loading, error } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if not loading and there's no Firebase configuration error
    if (!loading && !error) {
      // If user is not authenticated, redirect to login
      if (!user) {
        router.push('/signin')
      } 
      // If roles are specified and user doesn't have the required role
      else if (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role)) {
        // Redirect based on their actual role
        switch(userProfile.role) {
          case 'student':
            router.push('/dashboard/student')
            break
          case 'teacher':
            router.push('/dashboard/teacher')
            break
          case 'parent':
            router.push('/dashboard/parent')
            break
          case 'admin':
            router.push('/dashboard/admin')
            break
          default:
            // If role is unknown or not dashboard-specific, redirect to a generic dashboard or homepage
            // Consider what the appropriate fallback is. For now, redirecting to /
            router.push('/') 
            break;
        }
      }
    }
  }, [user, userProfile, loading, error, router, allowedRoles])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  // If there's a Firebase configuration error, show a message
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 max-w-xl">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Firebase Authentication Issue</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>There was an issue with Firebase Authentication: {typeof error === 'object' && error !== null && error.message ? error.message : 'An unexpected error occurred.'}</p>
                <p className="mt-1">Please ensure your Firebase setup is correct and you are connected to the internet.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Optionally, you could render children here or a fallback UI if appropriate */}
        {/* For now, just showing the error message */}
      </div>
    )
  }

  // If not authenticated or not authorized, don't render children
  // This prevents rendering the page content if a redirect is about to happen or if access is denied.
  if (!user || (allowedRoles && userProfile && !allowedRoles.includes(userProfile.role))) {
    // If loading is false, and there's no user, it means a redirect should have happened.
    // If there is a user, but their role is not allowed, they also shouldn't see the content.
    // Returning null (or a loading/access denied component) is appropriate here.
    return null
  }

  // If authenticated and authorized, render children
  return <>{children}</>
} 