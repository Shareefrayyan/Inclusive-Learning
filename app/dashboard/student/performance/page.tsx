"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Award,
  Target,
  BarChart2,
  BookMarked,
  HelpCircle,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  FlameIcon as Fire,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Logo from "@/components/Logo"

// Sample student data
const studentData = {
  name: "Aisha Patel",
  class: "Class 9A",
  rollNumber: "2023-9A-042",
  profilePicture: "/placeholder.svg?height=80&width=80",
  streak: 5,
  improvement: 15,
  averageScore: 82,
}

// Sample subject scores
const subjectScores = [
  { subject: "Mathematics", score: 85, change: 5, color: "bg-blue-100" },
  { subject: "Science", score: 78, change: -2, color: "bg-green-100" },
  { subject: "English", score: 92, change: 3, color: "bg-purple-100" },
  { subject: "Social Studies", score: 75, change: 8, color: "bg-amber-100" },
  { subject: "Telugu", score: 80, change: 0, color: "bg-rose-100" },
]

// Sample homework data
const homeworkData = {
  submitted: [
    {
      id: 1,
      title: "Linear Equations Practice",
      subject: "Mathematics",
      submittedOn: "2023-05-20",
      score: 9,
      feedback: "Excellent work! Your approach to solving the equations was very methodical.",
    },
    {
      id: 2,
      title: "Essay on Climate Change",
      subject: "English",
      submittedOn: "2023-05-18",
      score: 8,
      feedback: "Good arguments, but work on your conclusion.",
    },
  ],
  missed: [
    {
      id: 3,
      title: "Cell Structure Diagram",
      subject: "Science",
      dueDate: "2023-05-15",
    },
  ],
}

// Sample goals data
const goalsData = [
  {
    id: 1,
    title: "Score 85% in Science",
    currentProgress: 78,
    target: 85,
    achieved: false,
  },
  {
    id: 2,
    title: "Complete 10 Math practice tests",
    currentProgress: 7,
    target: 10,
    achieved: false,
  },
  {
    id: 3,
    title: "Read 5 English literature books",
    currentProgress: 5,
    target: 5,
    achieved: true,
  },
]

// Sample time spent data
const timeSpentData = {
  daily: {
    questionnaire: 45, // minutes
    notebook: 30,
    doubts: 15,
    total: 90,
  },
  weekly: {
    questionnaire: 210, // minutes
    notebook: 180,
    doubts: 60,
    total: 450,
  },
}

// Sample insights data
const insightsData = [
  {
    id: 1,
    text: "You've revised 3 new topics this week",
    icon: <BookOpen className="h-4 w-4 text-blue-500" />,
    color: "bg-blue-50 border-blue-100",
  },
  {
    id: 2,
    text: "Mistakes repeated twice in Algebra",
    icon: <XCircle className="h-4 w-4 text-amber-500" />,
    color: "bg-amber-50 border-amber-100",
  },
  {
    id: 3,
    text: "No new doubts asked in last 5 days",
    icon: <HelpCircle className="h-4 w-4 text-purple-500" />,
    color: "bg-purple-50 border-purple-100",
  },
]

export default function PerformancePage() {
  const [timeView, setTimeView] = useState<"daily" | "weekly">("weekly")

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-6">
      <header className="flex justify-between items-center mb-6">
        <Logo size="lg" />
        <Link href="/dashboard/student" className="text-slate-600 hover:text-slate-800 hover:underline">
          Back to Dashboard
        </Link>
      </header>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6">Performance Board</h1>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Academic Snapshot Card */}
        <Card className="bg-white shadow-sm border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart2 className="h-5 w-5 mr-2 text-blue-500" />
              Academic Snapshot
            </CardTitle>
            <CardDescription>Your performance across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectScores.map((subject, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-slate-700">{subject.subject}</p>
                    <div className="flex items-center">
                      <p className="text-sm font-bold text-slate-800">{subject.score}%</p>
                      {subject.change !== 0 && (
                        <span
                          className={`ml-2 flex items-center text-xs ${subject.change > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {subject.change > 0 ? (
                            <ArrowUpRight className="h-3 w-3 mr-0.5" />
                          ) : (
                            <ArrowDownRight className="h-3 w-3 mr-0.5" />
                          )}
                          {Math.abs(subject.change)}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${subject.color}`}
                      style={{ width: `${subject.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <p className="text-sm font-medium text-slate-700 mb-2">Score Progress (Last 3 Months)</p>
              <div className="h-40 bg-slate-50 rounded-lg flex items-center justify-center">
                <p className="text-slate-400 text-sm">Progress chart visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Homework & Submission Card */}
        <Card className="bg-white shadow-sm border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BookMarked className="h-5 w-5 mr-2 text-purple-500" />
              Homework & Submissions
            </CardTitle>
            <CardDescription>Track your assignments and feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Submitted Homework
                </h3>
                {homeworkData.submitted.map((homework) => (
                  <div key={homework.id} className="bg-green-50 border border-green-100 rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-800">{homework.title}</p>
                        <p className="text-xs text-slate-500">
                          {homework.subject} • Submitted on {homework.submittedOn}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 border border-green-200">{homework.score}/10</Badge>
                    </div>
                    {homework.feedback && (
                      <div className="mt-2 pt-2 border-t border-green-100">
                        <p className="text-xs text-slate-600">
                          <span className="font-medium">Teacher Feedback:</span> {homework.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                  <XCircle className="h-4 w-4 mr-1 text-red-500" />
                  Missed Homework
                </h3>
                {homeworkData.missed.map((homework) => (
                  <div key={homework.id} className="bg-red-50 border border-red-100 rounded-lg p-3 mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-800">{homework.title}</p>
                        <p className="text-xs text-slate-500">
                          {homework.subject} • Due on {homework.dueDate}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-red-100 text-red-800 border border-red-200">
                        Missed
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full text-slate-600">
              View All Homework
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>

        {/* Goals & Milestones Card */}
        <Card className="bg-white shadow-sm border border-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2 text-amber-500" />
              Goals & Milestones
            </CardTitle>
            <CardDescription>Track your academic goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goalsData.map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {goal.achieved ? (
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                          <Target className="h-4 w-4 text-amber-600" />
                        </div>
                      )}
                      <p className={`font-medium ${goal.achieved ? "text-green-800" : "text-slate-800"}`}>
                        {goal.title}
                      </p>
                    </div>
                    <Badge
                      className={
                        goal.achieved
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }
                    >
                      {goal.currentProgress}/{goal.target}
                    </Badge>
                  </div>
                  <Progress
                    value={(goal.currentProgress / goal.target) * 100}
                    className={`h-2 ${goal.achieved ? "bg-green-100" : "bg-amber-100"}`}
                  />
                  {goal.achieved && (
                    <div className="flex items-center justify-center bg-green-50 border border-green-100 rounded-lg p-2">
                      <Award className="h-4 w-4 text-green-600 mr-1" />
                      <p className="text-sm text-green-800">Goal achieved! Well done!</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" className="w-full text-slate-600">
              Set New Goal
              <PlusIcon className="h-4 w-4 ml-1" />
            </Button>
          </CardFooter>
        </Card>

        {/* Time Spent Studying Card */}
        <Card className="bg-white shadow-sm border border-slate-100">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-500" />
                Time Spent Studying
              </CardTitle>
              <Tabs defaultValue={timeView} onValueChange={(value) => setTimeView(value as "daily" | "weekly")}>
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
            <CardDescription>Track your study time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-600 mb-1">Questionnaire</p>
                  <p className="text-lg font-bold text-blue-700">
                    {timeView === "daily"
                      ? `${timeSpentData.daily.questionnaire} min`
                      : `${Math.floor(timeSpentData.weekly.questionnaire / 60)}h ${timeSpentData.weekly.questionnaire % 60}m`}
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-600 mb-1">Notebook</p>
                  <p className="text-lg font-bold text-purple-700">
                    {timeView === "daily"
                      ? `${timeSpentData.daily.notebook} min`
                      : `${Math.floor(timeSpentData.weekly.notebook / 60)}h ${timeSpentData.weekly.notebook % 60}m`}
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-600 mb-1">Doubts</p>
                  <p className="text-lg font-bold text-amber-700">
                    {timeView === "daily"
                      ? `${timeSpentData.daily.doubts} min`
                      : `${Math.floor(timeSpentData.weekly.doubts / 60)}h ${timeSpentData.weekly.doubts % 60}m`}
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 h-48 flex items-center justify-center">
                <p className="text-slate-400 text-sm">Time distribution chart would appear here</p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                <p className="text-sm text-green-800 font-medium">
                  Great job! You studied{" "}
                  {timeView === "daily"
                    ? `${timeSpentData.daily.total} minutes today`
                    : `${Math.floor(timeSpentData.weekly.total / 60)} hours ${timeSpentData.weekly.total % 60} minutes this week`}
                </p>
                {timeView === "weekly" && timeSpentData.weekly.total >= 240 && (
                  <div className="flex items-center justify-center mt-1">
                    <Award className="h-4 w-4 text-amber-500 mr-1" />
                    <p className="text-xs text-amber-700">You've earned the "Dedicated Learner" badge!</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Insights Section */}
      <h2 className="text-lg font-semibold text-slate-800 mb-3">Insights & Recommendations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {insightsData.map((insight) => (
          <Card key={insight.id} className={`${insight.color} shadow-sm border`}>
            <CardContent className="p-4 flex items-center">
              <div className="mr-3 bg-white p-2 rounded-full">{insight.icon}</div>
              <p className="text-sm text-slate-700">{insight.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Calendar View */}
      <Card className="bg-white shadow-sm border border-slate-100 mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-green-500" />
            Study Calendar
          </CardTitle>
          <CardDescription>Your learning activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-50 rounded-lg flex items-center justify-center">
            <p className="text-slate-400 text-sm">Calendar visualization would appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Plus icon component
function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
