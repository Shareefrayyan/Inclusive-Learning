"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BarChart,
  Calendar,
  CheckCircle2,
  Clock,
  FileCheck,
  FileX,
  LineChart,
  PieChart,
  Star,
  Target,
  TrendingUp,
  Trophy,
  PlusCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from '@/lib/firebase/auth-context'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

interface StudentData {
  name: string;
  class: string;
  rollNumber: string;
  scoreImprovement: number;
  streak: number;
  profileImage: string;
  averageScore: number;
  subjects: { name: string; score: number; change: number; color: string; }[];
  homework: {
    submitted: { id: string; subject: string; title: string; score: number; feedback: string; }[];
    missed: { id: string; subject: string; title: string; dueDate: string; }[];
  };
  timeSpent: {
    questionnaire: number;
    notebook: number;
    doubts: number;
  };
  insights: { id: string; text: string; icon: any; }[];
  goals: { id: string; title: string; progress: number; achieved: boolean; }[];
}

export default function PerformanceBoardPage() {
  const { user: currentUser } = useAuth()
  const [studentData, setStudentData] = useState<StudentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [timeView, setTimeView] = useState<"daily" | "weekly">("weekly")

  useEffect(() => {
    if (currentUser) {
      const fetchStudentData = async () => {
        const db = getFirestore()
        const studentDocRef = doc(db, 'users', currentUser.uid)
        try {
          const studentDoc = await getDoc(studentDocRef)
          if (studentDoc.exists()) {
            setStudentData(studentDoc.data() as StudentData)
          } else {
            console.error('No such document!')
          }
        } catch (err) {
          console.error('Error fetching student data:', err)
          setError(err as Error)
        } finally {
          setLoading(false)
        }
      }
      fetchStudentData()
    }
  }, [currentUser])

  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error loading student data: {error.message}</p>
  }

  if (!studentData) {
    return <p>No student data found.</p>
  }

  // Calculate total time spent
  const totalTimeSpent = Object.values(studentData.timeSpent).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <Link href="/dashboard/student" className="text-slate-600 hover:text-slate-800 hover:underline">
            Back to Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800">Performance Board</h1>
          <div className="w-24"></div> {/* Empty div for alignment */}
        </div>

        {/* Digital Student ID Card */}
        <Card className="w-full mb-6 overflow-hidden border-0 shadow-md">
          <div className="relative bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100 p-6">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full opacity-20 -mr-10 -mt-10"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200 rounded-full opacity-20 -ml-10 -mb-10"></div>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
              {/* Profile picture */}
              <div className="flex-shrink-0">
                <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
                  <AvatarImage src={studentData.profileImage || "/placeholder.svg"} alt={studentData.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-800 text-xl">
                    {studentData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Student details */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="text-2xl font-bold text-slate-800">{studentData.name}</h2>
                <p className="text-slate-600">{studentData.class}</p>
                <p className="text-slate-500 text-sm">Roll Number: {studentData.rollNumber}</p>
                <p className="text-slate-500 text-sm">Email: student1@school.com</p>
                <p className="text-slate-500 text-sm">UID: pePJhALb8PMkzMgocB2RNgHj2wp1</p>
                <p className="text-slate-500 text-sm">Role: student</p>

                <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1"
                  >
                    <TrendingUp className="h-3 w-3" /> Improved by {studentData.scoreImprovement}%
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-amber-100 text-amber-800 border-amber-200 flex items-center gap-1"
                  >
                    <Star className="h-3 w-3" /> Streak: {studentData.streak} days
                  </Badge>
                </div>
              </div>

              {/* Average score */}
              <div className="flex-shrink-0 bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center min-w-[120px]">
                <p className="text-sm font-medium text-slate-500">Average Score</p>
                <p className="text-4xl font-bold text-blue-600">{studentData.averageScore}%</p>
                <p className="text-xs text-slate-400">Across all subjects</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Academic Snapshot Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-500" />
                Academic Snapshot
              </CardTitle>
              <CardDescription>Performance across all subjects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.subjects.map((subject) => (
                  <div key={subject.name} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{subject.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{subject.score}%</span>
                        {subject.change > 0 ? (
                          <Badge className="bg-green-100 text-green-800 border-0">+{subject.change}%</Badge>
                        ) : subject.change < 0 ? (
                          <Badge className="bg-red-100 text-red-800 border-0">{subject.change}%</Badge>
                        ) : (
                          <Badge className="bg-slate-100 text-slate-800 border-0">0%</Badge>
                        )}
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${subject.color}`} style={{ width: `${subject.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <h4 className="text-sm font-medium mb-2">Progress Over Time</h4>
                <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-slate-300" />
                  <span className="text-sm text-slate-400 ml-2">Score trend visualization</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Homework & Submission Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-green-500" />
                Homework & Submissions
              </CardTitle>
              <CardDescription>Track your assignments and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Submitted Homework
                  </h4>
                  {studentData.homework.submitted.length > 0 ? (
                    <div className="space-y-2">
                      {studentData.homework.submitted.map((hw) => (
                        <div key={hw.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{hw.title}</p>
                              <p className="text-xs text-slate-500">{hw.subject}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-0">{hw.score}/10</Badge>
                          </div>
                          {hw.feedback && (
                            <div className="mt-2 text-xs bg-blue-50 p-2 rounded border border-blue-100 text-slate-700">
                              <span className="font-medium">Feedback:</span> {hw.feedback}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No submitted homework</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                    <FileX className="h-4 w-4 text-red-500" />
                    Missed Homework
                  </h4>
                  {studentData.homework.missed.length > 0 ? (
                    <div className="space-y-2">
                      {studentData.homework.missed.map((hw) => (
                        <div key={hw.id} className="bg-white p-3 rounded-lg border border-red-100 shadow-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-sm">{hw.title}</p>
                              <p className="text-xs text-slate-500">{hw.subject}</p>
                            </div>
                            <Badge variant="outline" className="border-red-200 text-red-700">
                              Due: {hw.dueDate}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No missed homework</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Goals & Milestones Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-500" />
                Goals & Milestones
              </CardTitle>
              <CardDescription>Track your academic goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {studentData.goals.map((goal) => (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        {goal.achieved ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Target className="h-5 w-5 text-purple-500" />
                        )}
                        <span className="text-sm font-medium">{goal.title}</span>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    {goal.achieved && (
                      <div className="bg-green-50 border border-green-100 rounded-md p-2 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        <span className="text-xs text-green-800">Goal achieved! Congratulations!</span>
                      </div>
                    )}
                  </div>
                ))}

                <Button variant="outline" className="w-full mt-2 border-dashed">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Set New Goal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Time Spent Studying Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  Time Spent Studying
                </CardTitle>
                <Tabs defaultValue={timeView} onValueChange={(v) => setTimeView(v as "daily" | "weekly")}>
                  <TabsList className="h-8">
                    <TabsTrigger value="daily" className="text-xs px-3">
                      Daily
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="text-xs px-3">
                      Weekly
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>
                {timeView === "weekly"
                  ? "Your study time distribution this week"
                  : "Your study time distribution today"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-4">
                <div className="h-40 w-40 relative flex items-center justify-center">
                  <PieChart className="h-full w-full text-slate-200" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-slate-800">{Math.round(totalTimeSpent / 60)} hrs</span>
                    <span className="text-xs text-slate-500">Total</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Questionnaire</span>
                  <span className="text-sm font-medium ml-auto">
                    {Math.round(studentData.timeSpent.questionnaire / 60)} hrs{" "}
                    {studentData.timeSpent.questionnaire % 60} mins
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Smart Notebook</span>
                  <span className="text-sm font-medium ml-auto">
                    {Math.round(studentData.timeSpent.notebook / 60)} hrs {studentData.timeSpent.notebook % 60} mins
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Doubt-solving</span>
                  <span className="text-sm font-medium ml-auto">
                    {Math.round(studentData.timeSpent.doubts / 60)} hrs {studentData.timeSpent.doubts % 60} mins
                  </span>
                </div>
              </div>

              <div className="mt-4 bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800">
                <p className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  Great job! You studied {Math.round(totalTimeSpent / 60)} hrs this week!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Insights Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-slate-800">Insights & Recommendations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {studentData.insights.map((insight) => (
              <Card key={insight.id} className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <insight.icon className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-sm text-slate-700">{insight.text}</p>
                </CardContent>
              </Card>
            ))}

            {/* Study Calendar */}
            <Card className="bg-white border-slate-200 shadow-sm sm:col-span-2 md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  Study Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-16 bg-slate-50 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-slate-400">Study calendar visualization</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-500 py-4">
          <p>Keep up the good work! Your consistent effort will lead to great results.</p>
        </footer>
      </div>
    </div>
  )
}
