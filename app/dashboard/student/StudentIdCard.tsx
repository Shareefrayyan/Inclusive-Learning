import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';

export default function StudentIdCard() {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  // Placeholder for averageScore, you can fetch or calculate this as needed
  const averageScore = userProfile.averageScore ?? 0;

  return (
    <div className="w-full bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 rounded-2xl shadow-lg flex flex-col md:flex-row items-center p-4 md:p-5 mb-8 min-h-0" style={{ minHeight: '0', height: 'auto' }}>
      {/* Avatar */}
      <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md mr-0 md:mr-4 mb-3 md:mb-0">
        <span className="text-2xl font-bold text-indigo-400">{userProfile.displayName?.split(' ').map((n: string) => n[0]).join('')}</span>
      </div>
      {/* Info */}
      <div className="flex-grow flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-1">{userProfile.displayName}</h2>
        <p className="text-slate-600 text-sm md:text-base">Class {userProfile.class} &bull; Roll No: {userProfile.rollNumber}</p>
        <div className="flex gap-2 mt-2">
          <Badge className="bg-orange-100 text-orange-800 font-medium px-2 py-0.5 flex items-center gap-1 text-xs md:text-sm">
            <Star className="h-3 w-3 text-orange-500" /> Streak: {userProfile.streak ?? 0} days
          </Badge>
          <Badge className="bg-green-100 text-green-800 font-medium px-2 py-0.5 flex items-center gap-1 text-xs md:text-sm">
            <TrendingUp className="h-3 w-3 text-green-500" /> Improved by {userProfile.scoreImprovement ?? 0}%
          </Badge>
        </div>
      </div>
      {/* Average Score */}
      <div className="flex-shrink-0 bg-white rounded-xl p-3 shadow-md border border-slate-100 text-center mt-4 md:mt-0 md:ml-6 min-w-[100px]">
        <p className="text-xs font-medium text-slate-500 mb-1">Average Score</p>
        <p className="text-2xl font-bold text-blue-600">{averageScore}%</p>
        <p className="text-xs text-slate-400 mt-1">across all subjects</p>
      </div>
    </div>
  );
} 