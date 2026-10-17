"use client";
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, Users, BookOpen, ActivitySquare, Bell, Calendar, MessageCircleWarning, TrendingUp, UserCircle, PieChart } from "lucide-react";
import { ChartContainer } from '@/components/ui/chart';

// Sample data for performance chart
const performanceData = [
  { month: 'Jan', class9: 75, class10: 78 },
  { month: 'Feb', class9: 80, class10: 82 },
  { month: 'Mar', class9: 85, class10: 87 },
];

export default function PrincipalDashboard() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Welcome/Intro Card at the top */}
      <Card className="p-6 bg-white/80 shadow rounded-2xl flex flex-col mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
            <UserCircle className="h-5 w-5 text-slate-400" /> Welcome, Principal
          </CardTitle>
          <p className="text-slate-500 text-sm">Here's a quick overview of your school's activity and performance.</p>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. School-Wide Performance Overview with chart */}
        <Card className="p-6 bg-blue-50/80 shadow rounded-2xl flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
              <BarChart3 className="h-5 w-5 text-blue-400" /> School-Wide Performance
            </CardTitle>
            <p className="text-slate-500 text-sm">Performance improvement (Jan–Mar)</p>
          </CardHeader>
          <CardContent className="pt-2">
            {/* Chart Placeholder */}
            <div className="h-40 flex flex-col items-center justify-center">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <svg width="100%" height="120" viewBox="0 0 320 120">
                  {/* X axis */}
                  <line x1="40" y1="100" x2="300" y2="100" stroke="#cbd5e1" strokeWidth="2" />
                  {/* Y axis */}
                  <line x1="40" y1="20" x2="40" y2="100" stroke="#cbd5e1" strokeWidth="2" />
                  {/* 9th class line */}
                  <polyline
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3"
                    points="40,80 160,60 280,40"
                  />
                  {/* 10th class line */}
                  <polyline
                    fill="none"
                    stroke="#f59e42"
                    strokeWidth="3"
                    points="40,90 160,70 280,50"
                  />
                  {/* Dots and labels for 9th */}
                  <circle cx="40" cy="80" r="4" fill="#2563eb" />
                  <circle cx="160" cy="60" r="4" fill="#2563eb" />
                  <circle cx="280" cy="40" r="4" fill="#2563eb" />
                  {/* Dots and labels for 10th */}
                  <circle cx="40" cy="90" r="4" fill="#f59e42" />
                  <circle cx="160" cy="70" r="4" fill="#f59e42" />
                  <circle cx="280" cy="50" r="4" fill="#f59e42" />
                  {/* Month labels */}
                  <text x="40" y="115" fontSize="12" fill="#64748b">Jan</text>
                  <text x="160" y="115" fontSize="12" fill="#64748b">Feb</text>
                  <text x="280" y="115" fontSize="12" fill="#64748b">Mar</text>
                  {/* Legend */}
                  <rect x="200" y="10" width="12" height="12" fill="#2563eb" />
                  <text x="215" y="20" fontSize="12" fill="#2563eb">9th Class</text>
                  <rect x="200" y="28" width="12" height="12" fill="#f59e42" />
                  <text x="215" y="38" fontSize="12" fill="#f59e42">10th Class</text>
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 2. Subject-wise Strengths & Weaknesses */}
        <Card className="p-6 bg-purple-50/80 shadow rounded-2xl flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
              <PieChart className="h-5 w-5 text-purple-400" /> Subject Strengths & Weaknesses
            </CardTitle>
            <p className="text-slate-500 text-sm">Best and worst performing subjects</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-1">
              <li><span className="font-semibold text-green-700">Strength:</span> English (88%), Mathematics (84%)</li>
              <li><span className="font-semibold text-red-600">Weakness:</span> Science (78%), Telugu (72%)</li>
            </ul>
          </CardContent>
        </Card>
        {/* 3. Student Insights */}
        <Card className="p-6 bg-green-50/80 shadow rounded-2xl flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
              <Users className="h-5 w-5 text-green-400" /> Student Insights
            </CardTitle>
            <p className="text-slate-500 text-sm">Top and underperforming students</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-1">
              <li>Top Performer: <span className="font-semibold">Aisha Patel</span> (9A, 98%)</li>
              <li>Most Improved: <span className="font-semibold">Raj Kumar</span> (10B, +15%)</li>
              <li>Needs Support: <span className="font-semibold">Neha Singh</span> (9B, 55%)</li>
            </ul>
          </CardContent>
        </Card>
        {/* 4. Teacher Activity Snapshot - combined card for two teachers */}
        <Card className="p-6 bg-yellow-50/80 shadow rounded-2xl flex flex-col col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
              <BookOpen className="h-5 w-5 text-yellow-400" /> Teacher Activity
            </CardTitle>
            <p className="text-slate-500 text-sm">Recent teacher actions</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="font-semibold text-lg mb-2">Mrs. Sharma</div>
                <ul className="space-y-1">
                  <li>Homework Assigned: <span className="font-semibold">7</span></li>
                  <li>Doubts Responded: <span className="font-semibold">15</span></li>
                  <li>Lessons Completed: <span className="font-semibold">4</span></li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-lg mb-2">Mr. Iqbal</div>
                <ul className="space-y-1">
                  <li>Homework Assigned: <span className="font-semibold">5</span></li>
                  <li>Doubts Responded: <span className="font-semibold">19</span></li>
                  <li>Lessons Completed: <span className="font-semibold">6</span></li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 5. Announcements and Notifications */}
        <Card className="p-6 bg-amber-50/80 shadow rounded-2xl flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
              <Bell className="h-5 w-5 text-amber-400" /> Announcements & Notifications
            </CardTitle>
            <p className="text-slate-500 text-sm">Latest school announcements</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-2">
              <li className="bg-white rounded-lg p-2 shadow-sm">School will be closed on June 14th for a public holiday.</li>
              <li className="bg-white rounded-lg p-2 shadow-sm">PTA meeting scheduled for June 20th at 5pm in the auditorium.</li>
            </ul>
            <button className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700 transition">Add New</button>
          </CardContent>
        </Card>
        {/* 6. Upcoming Events Calendar */}
        <Card className="p-6 bg-blue-100/80 shadow rounded-2xl flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
              <Calendar className="h-5 w-5 text-blue-500" /> Upcoming Events
            </CardTitle>
            <p className="text-slate-500 text-sm">Project deadlines, holidays, tests</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="mb-2">
              <div className="font-semibold text-blue-700 mb-1">Class 9 Events</div>
              <ul className="ml-4 list-disc text-slate-700">
                <li>Math Test – June 5</li>
                <li>Science Project Submission – June 7</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-indigo-700 mb-1">Class 10 Events</div>
              <ul className="ml-4 list-disc text-slate-700">
                <li>English Debate – June 8</li>
                <li>Social Studies Quiz – June 10</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        {/* 7. Discipline Flags and Reports */}
        <Card className="p-6 bg-red-50/80 shadow rounded-2xl flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
              <MessageCircleWarning className="h-5 w-5 text-red-400" /> Discipline Flags & Reports
            </CardTitle>
            <p className="text-slate-500 text-sm">Behavioral issues and remarks</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-1 text-red-600">
              <li>3 students flagged for repeated issues</li>
              <li>2 new remarks this week</li>
            </ul>
          </CardContent>
        </Card>
        {/* 8. System Usage Stats */}
        <Card className="p-6 bg-green-100/80 shadow rounded-2xl flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold font-merriweather">
              <ActivitySquare className="h-5 w-5 text-green-500" /> System Usage Stats
            </CardTitle>
            <p className="text-slate-500 text-sm">Platform activity and usage</p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="space-y-1">
              <li>Active Students: 800</li>
              <li>Streaks: 120 students 5+ days</li>
              <li>Notebook: 200 hrs | Q&A: 150 hrs | Flashcards: 90 hrs</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
