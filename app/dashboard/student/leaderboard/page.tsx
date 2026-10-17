'use client';

import Link from 'next/link';
import { ArrowLeft, Trophy, Flame, Medal, Crown } from 'lucide-react';

// Static dummy data for leaderboard
const leaderboardData = [
  { rank: 1, name: 'Aarav Sharma', class: '9A', points: 2850, streak: 15 },
  { rank: 2, name: 'Priya Patel', class: '9B', points: 2720, streak: 12 },
  { rank: 3, name: 'Rahul Singh', class: '9A', points: 2680, streak: 10 },
  { rank: 4, name: 'Ananya Gupta', class: '9C', points: 2540, streak: 8 },
  { rank: 5, name: 'Vikram Reddy', class: '9B', points: 2410, streak: 7 },
  { rank: 6, name: 'Sneha Joshi', class: '9A', points: 2350, streak: 6 },
  { rank: 7, name: 'Arjun Nair', class: '9C', points: 2280, streak: 5 },
  { rank: 8, name: 'Kavya Menon', class: '9B', points: 2150, streak: 4 },
  { rank: 9, name: 'Rohan Das', class: '9A', points: 2080, streak: 3 },
  { rank: 10, name: 'Ishita Verma', class: '9C', points: 1990, streak: 2 },
];

function getRankBadge(rank: number) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full shadow-lg">
        <Crown className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full shadow-lg">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full shadow-lg">
        <Medal className="w-5 h-5 text-white" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center w-10 h-10 bg-slate-100 rounded-full">
      <span className="font-bold text-slate-600">{rank}</span>
    </div>
  );
}

function getRowStyle(rank: number) {
  if (rank === 1) return 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400';
  if (rank === 2) return 'bg-gradient-to-r from-slate-50 to-slate-100 border-l-4 border-slate-400';
  if (rank === 3) return 'bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-600';
  return 'bg-white hover:bg-slate-50';
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-yellow-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/dashboard/student"
            className="p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-slate-200"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-lg">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Leaderboard</h1>
              <p className="text-slate-500 text-sm">See how you stack up against your peers</p>
            </div>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="flex justify-center items-end gap-4 mb-8">
          {/* 2nd Place */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center shadow-lg mb-2 border-4 border-white">
              <span className="text-lg md:text-xl font-bold text-slate-600">
                {leaderboardData[1].name.split(' ')[0][0]}{leaderboardData[1].name.split(' ')[1][0]}
              </span>
            </div>
            <div className="bg-gradient-to-t from-slate-300 to-slate-200 w-20 md:w-24 h-20 md:h-24 rounded-t-lg flex flex-col items-center justify-center">
              <Medal className="w-6 h-6 text-slate-500 mb-1" />
              <span className="font-bold text-slate-700">2nd</span>
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-700 mt-2 text-center">{leaderboardData[1].name}</p>
            <p className="text-xs text-slate-500">{leaderboardData[1].points} pts</p>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center -mt-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-yellow-300 to-amber-400 flex items-center justify-center shadow-xl mb-2 border-4 border-white">
              <span className="text-xl md:text-2xl font-bold text-amber-800">
                {leaderboardData[0].name.split(' ')[0][0]}{leaderboardData[0].name.split(' ')[1][0]}
              </span>
            </div>
            <div className="bg-gradient-to-t from-yellow-400 to-amber-300 w-24 md:w-28 h-28 md:h-32 rounded-t-lg flex flex-col items-center justify-center">
              <Crown className="w-8 h-8 text-amber-700 mb-1" />
              <span className="font-bold text-amber-800 text-lg">1st</span>
            </div>
            <p className="text-sm md:text-base font-semibold text-slate-800 mt-2 text-center">{leaderboardData[0].name}</p>
            <p className="text-xs text-slate-500">{leaderboardData[0].points} pts</p>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg mb-2 border-4 border-white">
              <span className="text-lg md:text-xl font-bold text-amber-100">
                {leaderboardData[2].name.split(' ')[0][0]}{leaderboardData[2].name.split(' ')[1][0]}
              </span>
            </div>
            <div className="bg-gradient-to-t from-amber-600 to-amber-500 w-20 md:w-24 h-16 md:h-20 rounded-t-lg flex flex-col items-center justify-center">
              <Medal className="w-6 h-6 text-amber-200 mb-1" />
              <span className="font-bold text-amber-100">3rd</span>
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-700 mt-2 text-center">{leaderboardData[2].name}</p>
            <p className="text-xs text-slate-500">{leaderboardData[2].points} pts</p>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-slate-100 to-slate-50 px-4 md:px-6 py-4 border-b border-slate-200">
            <div className="flex items-center gap-4">
              <div className="w-10 text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Rank</span>
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-500 uppercase">Student</span>
              </div>
              <div className="w-20 text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Points</span>
              </div>
              <div className="w-16 text-center">
                <span className="text-xs font-semibold text-slate-500 uppercase">Streak</span>
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-slate-100">
            {leaderboardData.map((student) => (
              <div
                key={student.rank}
                className={`px-4 md:px-6 py-4 transition-colors ${getRowStyle(student.rank)}`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  {getRankBadge(student.rank)}

                  {/* Student Name */}
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{student.name}</p>
                  </div>

                  {/* Points */}
                  <div className="w-20 text-center">
                    <span className="font-bold text-slate-800">{student.points.toLocaleString()}</span>
                  </div>

                  {/* Streak */}
                  <div className="w-16 flex items-center justify-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-slate-700">{student.streak}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            🏆 Points are earned by completing lessons, quizzes, and maintaining study streaks!
          </p>
        </div>
      </div>
    </div>
  );
}





