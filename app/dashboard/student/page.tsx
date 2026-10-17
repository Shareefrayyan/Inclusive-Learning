'use client';

import { useEffect, useState } from 'react';
import Link from "next/link";
import { BarChart2, BookOpen, RefreshCw, Calendar, BookMarked, UserCircle, Mail, Hash, ShieldCheck, Zap, Clock, BarChartHorizontalBig, AlertTriangle, MessageCircle, Trophy, type LucideIcon } from "lucide-react";
import { useAuth } from '@/lib/firebase/auth-context'; // Corrected import path
import StudentIdCard from './StudentIdCard';

interface StudentIdCardProps {
  fullName?: string;
  email?: string;
  uid?: string;
  role?: string;
}

export default function StudentDashboard() {
  const { userProfile, loading: authLoading, error: authError, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showTeacherInstructionsModal, setShowTeacherInstructionsModal] = useState(false);
  const [showNoticeBoardModal, setShowNoticeBoardModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto flex justify-center items-center min-h-screen">
        <p className="text-xl text-slate-600">Loading student data...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto flex flex-col justify-center items-center min-h-screen text-center">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-700 mb-2">Error Loading Profile</h2>
        <p className="text-slate-600">Could not load your profile data. Please try refreshing the page or contact support if the issue persists.</p>
        <p className="text-sm text-red-400 mt-2">Error: {authError.message}</p>
      </div>
    );
  }
  
  if (!userProfile && !authLoading) {
     return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto flex flex-col justify-center items-center min-h-screen text-center">
        <UserCircle size={48} className="text-slate-500 mb-4" />
        <h2 className="text-2xl font-semibold text-slate-700 mb-2">Profile Not Found</h2>
        <p className="text-slate-600">We couldn&apos;t find your profile information. This might be a temporary issue or your profile may not be fully set up.</p>
        <p className="text-slate-500 mt-2">Please try signing out and signing back in. If the problem continues, contact support.</p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header with Sign Out Button */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 uppercase" style={{ fontSize: '1.25rem' }}>STUDENT DASHBOARD</h1>
        <button
          onClick={async () => {
            try {
              await signOut();
              // User will be redirected by the auth context
            } catch (error) {
              console.error('Error signing out:', error);
            }
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Sign Out
        </button>
      </div>
      <p className="text-slate-600 mb-8">Welcome back, {userProfile?.displayName || 'Student'}! Access your learning tools below.</p>
      <StudentIdCard />
      {/* Teacher Instructions & Notice Board Row */}
      <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
        {/* Teacher Instructions Card */}
        <div className="md:w-[30%] w-full">
          <div
            className="bg-blue-50 border border-blue-100 rounded-2xl shadow p-4 h-full flex flex-col cursor-pointer hover:shadow-lg transition"
            onClick={() => setShowTeacherInstructionsModal(true)}
            style={{ minHeight: '220px' }}
          >
            <h2 className="text-center font-bold text-slate-800 mb-2 uppercase">TEACHER INSTRUCTIONS</h2>
            <div className="flex-1 overflow-y-auto max-h-40 space-y-3">
              {[{id:1,subject:'Mathematics',topic:'Algebra',content:'Revise quadratic equations for the upcoming test.'},{id:2,subject:'English',topic:'Poetry',content:'Prepare \"The Road Not Taken\" for recitation.'}].map((inst) => (
                <div key={inst.id} className="bg-white border border-blue-100 rounded-lg p-3">
                  <div className="font-medium text-slate-700">{inst.topic} <span className="text-xs text-slate-500 ml-2">({inst.subject})</span></div>
                  <div className="text-slate-600 text-sm mt-1">{inst.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Notice Board Card */}
        <div className="md:w-[70%] w-full">
          <div
            className="rounded-2xl shadow p-4 h-full flex flex-col cursor-pointer hover:shadow-lg transition"
            style={{ background: '#e6f9e6', border: '3px solid #bfa16b', minHeight: '220px' }}
            onClick={() => setShowNoticeBoardModal(true)}
          >
            <h2 className="text-center font-bold text-slate-800 mb-2 uppercase">NOTICE BOARD</h2>
            <div className="flex-1 overflow-y-auto max-h-40 space-y-3">
              {[{id:1,title:'Math Test on Friday',desc:'Class 9A will have a Mathematics test on Friday, 10am.'},{id:2,title:'Holiday Notice',desc:'School will remain closed on Monday for a public holiday.'}].map((notice) => (
                <div key={notice.id} className="bg-green-50 border border-[#bfa16b] rounded-lg p-3">
                  <div className="font-semibold text-slate-800">{notice.title}</div>
                  <div className="text-slate-700 text-sm mt-1">{notice.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Floating Modals for Teacher Instructions and Notice Board */}
      {showTeacherInstructionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-slate-500 hover:text-slate-800" onClick={() => setShowTeacherInstructionsModal(false)}>&times;</button>
            <h2 className="text-center font-bold text-slate-800 mb-4 uppercase">TEACHER INSTRUCTIONS</h2>
            {[{id:1,subject:'Mathematics',topic:'Algebra',content:'Revise quadratic equations for the upcoming test.'},{id:2,subject:'English',topic:'Poetry',content:'Prepare "The Road Not Taken" for recitation.'}].map((inst) => (
              <div key={inst.id} className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                <div className="font-medium text-slate-700">{inst.topic} <span className="text-xs text-slate-500 ml-2">({inst.subject})</span></div>
                <div className="text-slate-600 text-sm mt-1">{inst.content}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      {showNoticeBoardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-green-200 border-4 border-[#8B5C2A] rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-slate-700 hover:text-slate-900" onClick={() => setShowNoticeBoardModal(false)}>&times;</button>
            <h2 className="text-center font-bold text-slate-800 mb-4 uppercase">NOTICE BOARD</h2>
            {[{id:1,title:'Math Test on Friday',desc:'Class 9A will have a Mathematics test on Friday, 10am.'},{id:2,title:'Holiday Notice',desc:'School will remain closed on Monday for a public holiday.'}].map((notice) => (
              <div key={notice.id} className="bg-white border border-yellow-100 rounded-lg p-3 mb-3">
                <div className="font-medium text-slate-700">{notice.title}</div>
                <div className="text-slate-600 text-sm mt-1">{notice.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <DashboardCard
          title="Time Table"
          icon="Calendar"
          href="/dashboard/student/timetable"
          color="bg-purple-50"
          hoverColor="hover:bg-purple-100"
          iconColor="text-purple-500"
          description="Plan your week"
        />
        <DashboardCard
          title="Let's Study"
          icon="BookOpen"
          href="/dashboard/student/study"
          color="bg-green-50"
          hoverColor="hover:bg-green-100"
          iconColor="text-green-500"
          description="Practice & learn topics"
        />
        <DashboardCard
          title="Notebook"
          icon="BookMarked"
          href="/dashboard/student/notebook"
          color="bg-rose-50"
          hoverColor="hover:bg-rose-100"
          iconColor="text-rose-500"
          description="Your smart notes"
        />
        <DashboardCard
          title="Performance Board"
          icon="BarChart2"
          href="/dashboard/student/performance"
          color="bg-blue-50"
          hoverColor="hover:bg-blue-100"
          iconColor="text-blue-500"
          description="Track your progress"
        />
        <DashboardCard
          title="Doubt Bot"
          icon="MessageCircle"
          href="/dashboard/student/doubt-bot"
          color="bg-indigo-50"
          hoverColor="hover:bg-indigo-100"
          iconColor="text-indigo-500"
          description="Ask questions & get answers"
        />
        <DashboardCard
          title="Leaderboard"
          icon="Trophy"
          href="/dashboard/student/leaderboard"
          color="bg-amber-50"
          hoverColor="hover:bg-amber-100"
          iconColor="text-amber-500"
          description="See top performers"
        />
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string;
  icon: string;
  href: string;
  color: string;
  hoverColor: string;
  iconColor: string;
  description: string;
}

function DashboardCard({ title, icon, href, color, hoverColor, iconColor, description }: DashboardCardProps) {
  // Map string icon names to actual components
  const IconComponent = {
    BarChart2,
    BookOpen,
    RefreshCw,
    Calendar,
    BookMarked,
    MessageCircle,
    Trophy,
  }[icon as keyof typeof IconComponentMap];

  // Define the type for the IconComponentMap
  type IconComponentMapType = {
    BarChart2: LucideIcon;
    BookOpen: LucideIcon;
    RefreshCw: LucideIcon;
    Calendar: LucideIcon;
    BookMarked: LucideIcon;
    MessageCircle: LucideIcon;
    Trophy: LucideIcon;
  };
  
  // Statically define the map
  const IconComponentMap: IconComponentMapType = {
    BarChart2,
    BookOpen,
    RefreshCw,
    Calendar,
    BookMarked,
    MessageCircle,
    Trophy,
  };

  if (!IconComponent) {
    // Fallback or error handling if icon string doesn't match
    console.warn(`Icon "${icon}" not found in IconComponentMap.`);
    return null; // Or return a default icon/placeholder
  }

  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-sm border border-slate-100 transition-all duration-200 ${color} ${hoverColor} hover:shadow-md h-48`}
    >
      <div className={`mb-4 ${iconColor}`}>
        <IconComponent size={40} />
      </div>
      <h2 className="text-xl font-semibold text-slate-800 text-center">{title}</h2>
      <p className="text-sm text-slate-500 text-center">{description}</p>
    </Link>
  )
}
