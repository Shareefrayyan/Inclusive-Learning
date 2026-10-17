'use client';
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, ArrowUpRight, ArrowDownRight, Calendar, BookOpen, FlaskConical, Sun, UserCircle, BarChart2, BarChartHorizontalBig } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChartContainer } from '@/components/ui/chart';

const subjects = [
  { name: 'Mathematics', score: 88, change: 5, color: 'bg-blue-50', accent: 'text-blue-600' },
  { name: 'Science', score: 76, change: -3, color: 'bg-purple-50', accent: 'text-purple-600' },
  { name: 'English', score: 92, change: 2, color: 'bg-yellow-50', accent: 'text-yellow-600' },
  { name: 'Social Studies', score: 81, change: 0, color: 'bg-pink-50', accent: 'text-pink-600' },
];

const upcoming = [
  { title: 'Math Chapter 5 Test', subject: 'Mathematics', date: 'June 8, 2025', type: 'test', color: 'bg-yellow-50', icon: <FlaskConical className="text-yellow-500" /> },
  { title: 'English Project', subject: 'English', date: 'June 12, 2025', type: 'project', color: 'bg-purple-50', icon: <BookOpen className="text-purple-500" /> },
  { title: 'Science Quiz', subject: 'Science', date: 'June 15, 2025', type: 'test', color: 'bg-mint-50', icon: <FlaskConical className="text-green-500" /> },
  { title: 'Summer Holiday', subject: 'All', date: 'June 20, 2025', type: 'holiday', color: 'bg-blue-50', icon: <Sun className="text-blue-400" /> },
];

const homework = [
  { subject: 'Mathematics', title: 'Linear Equations Practice', due: '2023-05-20', status: 'submitted', score: 9, total: 10 },
  { subject: 'English', title: 'Essay on Climate Change', due: '2023-05-18', status: 'submitted', score: 8, total: 10 },
  { subject: 'Science', title: 'Cell Structure Diagram', due: '2023-05-15', status: 'missed' },
];
const performance = {
  averageScore: 82,
  mistakes: 7,
  weakSubjects: ['Science', 'Social Studies'],
  timeSpent: [
    { name: 'Questionnaire', value: 3.5 },
    { name: 'Notebook', value: 3 },
    { name: 'Doubts', value: 1 },
  ],
};
const announcements = [
  { title: 'School Reopens', desc: 'School will reopen on June 10th.' },
  { title: 'PTA Meeting', desc: 'Parent-Teacher meeting on June 15th at 5pm.' },
];

export default function ParentDashboard() {
  const { userProfile, loading: authLoading, error: authError } = useAuth();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');

  if (authLoading) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto flex justify-center items-center min-h-screen">
        <p className="text-xl text-slate-600">Loading parent data...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="p-6 md:p-8 max-w-5xl mx-auto flex flex-col justify-center items-center min-h-screen text-center">
        <UserCircle size={48} className="text-red-500 mb-4" />
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

  // Top Card
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <Card className="mb-8 p-6 flex flex-col md:flex-row items-center bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 shadow-lg rounded-2xl">
        <Avatar className="w-20 h-20 mr-0 md:mr-6 mb-4 md:mb-0">
          <AvatarFallback>{userProfile!.childName?.split(' ').map((n: string) => n[0]).join('') || 'C'}</AvatarFallback>
        </Avatar>
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 w-full">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 mb-1">{userProfile?.displayName || 'Parent'}</h2>
            <p className="text-slate-600 text-lg mb-2">Child: {userProfile!.childName}</p>
          </div>
        </div>
      </Card>
      {/* Contact School Admin - move here */}
      <Card className="mb-8 p-6 bg-blue-50/80 shadow rounded-2xl flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 font-merriweather text-center">Contact School Admin</h2>
        <Button
          className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold rounded-xl px-6 py-3 shadow"
          onClick={() => setShowAdminModal(true)}
        >
          <Mail className="h-5 w-5" /> Raise a concern with the principal or admin
        </Button>
      </Card>
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Academic Snapshot */}
        <Card className="p-6 bg-white/80 shadow rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold font-merriweather flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-blue-400" /> Academic Snapshot
            </CardTitle>
            <p className="text-slate-500 text-sm">Your child&apos;s performance across subjects</p>
          </CardHeader>
          <CardContent className="pt-2">
            {subjects.map((subject) => (
              <div key={subject.name} className="mb-4">
                <div className="flex justify-between items-center mb-1">
                  <span className={`font-semibold ${subject.accent}`}>{subject.name}</span>
                  <span className="text-lg font-bold text-slate-700">{subject.score}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden mb-1">
                  <div
                    className={
                      subject.name === 'Mathematics' ? 'bg-blue-700' :
                      subject.name === 'Science' ? 'bg-purple-700' :
                      subject.name === 'English' ? 'bg-yellow-500' :
                      subject.name === 'Social Studies' ? 'bg-pink-600' :
                      'bg-slate-700'
                    }
                    style={{ width: `${subject.score}%`, height: '100%' }}
                  />
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  {subject.change > 0 ? (
                    <span className="text-green-600 flex items-center"><ArrowUpRight className="h-4 w-4 mr-1" />+{subject.change}%</span>
                  ) : subject.change < 0 ? (
                    <span className="text-red-600 flex items-center"><ArrowDownRight className="h-4 w-4 mr-1" />{subject.change}%</span>
                  ) : (
                    <span className="text-slate-400">No change</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Homework Status */}
        <Card className="p-6 bg-white/80 shadow rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold font-merriweather flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" /> Homework Status
            </CardTitle>
            <p className="text-slate-500 text-sm">Recent homework tasks and completion status</p>
          </CardHeader>
          <CardContent className="pt-2">
            {homework.map((hw, idx) => (
              <div key={idx} className={`mb-3 rounded-lg p-3 ${hw.status === 'missed' ? 'bg-red-50' : 'bg-green-50'} flex flex-col md:flex-row md:items-center justify-between gap-2`}>
                <div>
                  <div className="font-semibold text-slate-800">{hw.title}</div>
                  <div className="text-xs text-slate-500">{hw.subject} &bull; Due: {hw.due}</div>
                </div>
                <div className="flex items-center gap-2 mt-2 md:mt-0">
                  {hw.status === 'submitted' ? (
                    <Badge className="bg-green-200 text-green-800">Submitted</Badge>
                  ) : (
                    <Badge className="bg-red-200 text-red-800">Missed</Badge>
                  )}
                  {hw.status === 'submitted' && (
                    <span className="text-green-700 font-bold text-sm">{hw.score}/{hw.total}</span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Performance Overview */}
        <Card className="p-6 bg-white/80 shadow rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold font-merriweather flex items-center gap-2">
              <BarChartHorizontalBig className="h-5 w-5 text-indigo-400" /> Performance Overview
            </CardTitle>
            <p className="text-slate-500 text-sm">Key performance metrics</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="mb-2 flex flex-wrap gap-4">
              <div className="bg-blue-50 rounded-lg px-4 py-2 text-center flex-1 min-w-[120px]">
                <div className="text-xs text-slate-500">Average Score</div>
                <div className="text-xl font-bold text-blue-600">{performance.averageScore}%</div>
              </div>
              <div className="bg-orange-50 rounded-lg px-4 py-2 text-center flex-1 min-w-[120px]">
                <div className="text-xs text-slate-500">Mistakes</div>
                <div className="text-xl font-bold text-orange-600">{performance.mistakes}</div>
              </div>
              <div className="bg-pink-50 rounded-lg px-4 py-2 text-center flex-1 min-w-[120px]">
                <div className="text-xs text-slate-500">Weak Subjects</div>
                <div className="text-sm font-semibold text-pink-600">{performance.weakSubjects.join(', ')}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-xs text-slate-500 mb-1">Time Spent on Learning</div>
              <div className="bg-slate-50 rounded-lg p-4">
                {/* Placeholder for chart */}
                <div className="h-32 flex items-center justify-center text-slate-400">[Chart Placeholder]</div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* School Announcements */}
        <Card className="p-6 bg-white/80 shadow rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold font-merriweather flex items-center gap-2">
              <Mail className="h-5 w-5 text-amber-400" /> School Announcements
            </CardTitle>
            <p className="text-slate-500 text-sm">Recent updates from the school</p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {announcements.map((a, idx) => (
                <div key={idx} className="bg-blue-50 rounded-lg p-3 shadow-sm">
                  <div className="font-semibold text-slate-800">{a.title}</div>
                  <div className="text-slate-600 text-sm mt-1">{a.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Modal/Drawer for admin message */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
          <div className="w-full max-w-md h-full bg-white shadow-2xl p-8 flex flex-col gap-4 animate-slide-in-right">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold font-merriweather">Contact School Admin</h3>
              <Button variant="ghost" onClick={() => setShowAdminModal(false)} className="text-slate-500">✕</Button>
            </div>
            <Textarea
              placeholder="Type your message here..."
              className="min-h-[120px] mb-2"
              value={adminMessage}
              onChange={e => setAdminMessage(e.target.value)}
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">Send Message</Button>
          </div>
        </div>
      )}
      {/* Upcoming Tests & Reminders */}
      <Card className="p-6 bg-white/80 shadow rounded-2xl">
        <h2 className="text-xl font-bold mb-4 font-merriweather">Upcoming Schedule</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {upcoming.map((item, idx) => (
            <div key={idx} className={`rounded-xl p-5 flex items-center gap-4 shadow-sm ${item.color} transition-all`}>
              <div className="flex-shrink-0 text-2xl">{item.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-slate-800 mb-1">{item.title}</div>
                <div className="flex items-center gap-2 text-xs mb-1">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">{item.subject}</span>
                  <span className="text-slate-400">{item.date}</span>
                </div>
                <div className="text-xs text-slate-500">
                  {item.type === 'test' && '🧪 Test'}
                  {item.type === 'project' && '📘 Project'}
                  {item.type === 'holiday' && '🏖️ Holiday'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <style jsx global>{`
        .font-merriweather { font-family: Merriweather, serif; }
        .animate-slide-in-right { animation: slide-in-right 0.3s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slide-in-right {
          0% { transform: translateX(100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
