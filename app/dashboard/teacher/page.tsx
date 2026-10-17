"use client"

import { useState } from "react"
import {
  Users,
  BookOpen,
  Unlock,
  BarChart2,
  Upload,
  HelpCircle,
  Bell,
  Calendar,
  FileText,
  LayoutDashboard,
  Search,
  MessageSquare,
  Eye,
  Filter,
  CheckCircle,
  XCircle,
  Download,
  Edit,
  Trash2,
  CheckSquare,
  Share2,
  PlusCircle,
  Clock,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Logo from "@/components/Logo"

// Define the navigation items
const navigationItems = [
  { id: "classes", label: "Classes & Students", icon: <Users className="h-5 w-5" /> },
  { id: "attendance", label: "Attendance system", icon: <Clock className="h-5 w-5" /> },
  { id: "homework", label: "Homework Manager", icon: <BookOpen className="h-5 w-5" /> },
  { id: "topics", label: "Unlock Topics", icon: <Unlock className="h-5 w-5" /> },
  { id: "performance", label: "Performance Overview", icon: <BarChart2 className="h-5 w-5" /> },
  { id: "materials", label: "Upload Study Material", icon: <Upload className="h-5 w-5" /> },
  { id: "doubts", label: "Student Doubts", icon: <HelpCircle className="h-5 w-5" /> },
  { id: "announcements", label: "Announcements", icon: <Bell className="h-5 w-5" /> },
  { id: "reminders", label: "Reminders & Tests", icon: <Calendar className="h-5 w-5" /> },
  { id: "instructions", label: "Teacher Instructions", icon: <FileText className="h-5 w-5" /> },
  { id: "dashboard", label: "Dashboard Metrics", icon: <LayoutDashboard className="h-5 w-5" /> },
]

// Sample data for students
const sampleStudents = [
  {
    id: 1,
    name: "Aisha Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "95%",
    homework: "8/10",
    avgScore: "87%",
  },
  {
    id: 2,
    name: "Rahul Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "92%",
    homework: "7/10",
    avgScore: "82%",
  },
  {
    id: 3,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "98%",
    homework: "10/10",
    avgScore: "94%",
  },
  {
    id: 4,
    name: "Arjun Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "88%",
    homework: "6/10",
    avgScore: "78%",
  },
  {
    id: 5,
    name: "Neha Gupta",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "94%",
    homework: "9/10",
    avgScore: "89%",
  },
  {
    id: 6,
    name: "Vikram Reddy",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "90%",
    homework: "8/10",
    avgScore: "85%",
  },
  {
    id: 7,
    name: "Ananya Desai",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "96%",
    homework: "9/10",
    avgScore: "91%",
  },
  {
    id: 8,
    name: "Rohan Malhotra",
    avatar: "/placeholder.svg?height=40&width=40",
    attendance: "85%",
    homework: "5/10",
    avgScore: "72%",
  },
]

// Sample data for homework
const sampleHomework = [
  {
    id: 1,
    title: "Linear Equations Practice",
    class: "Class 9A",
    subject: "Mathematics",
    dueDate: "2023-05-25",
    status: "Submitted: 18/25",
  },
  {
    id: 2,
    title: "Cell Structure Diagram",
    class: "Class 10B",
    subject: "Biology",
    dueDate: "2023-05-26",
    status: "Submitted: 22/25",
  },
  {
    id: 3,
    title: "Essay on Climate Change",
    class: "Class 9A",
    subject: "English",
    dueDate: "2023-05-27",
    status: "Submitted: 15/25",
  },
  {
    id: 4,
    title: "Chemical Reactions Worksheet",
    class: "Class 10B",
    subject: "Chemistry",
    dueDate: "2023-05-28",
    status: "Submitted: 20/25",
  },
  {
    id: 5,
    title: "History Timeline Project",
    class: "Class 9A",
    subject: "History",
    dueDate: "2023-05-29",
    status: "Submitted: 12/25",
  },
]

// Sample data for topics
const sampleTopics = {
  completed: [
    { id: 1, name: "Linear Equations", subject: "Mathematics", class: "Class 9A", unlocked: true },
    { id: 2, name: "Cell Structure", subject: "Biology", class: "Class 10B", unlocked: true },
    { id: 3, name: "Parts of Speech", subject: "English", class: "Class 9A", unlocked: true },
  ],
  notCompleted: [
    { id: 4, name: "Quadratic Equations", subject: "Mathematics", class: "Class 9A", unlocked: false },
    { id: 5, name: "Cell Division", subject: "Biology", class: "Class 10B", unlocked: false },
    { id: 6, name: "Essay Writing", subject: "English", class: "Class 9A", unlocked: true },
  ],
}

// Sample data for study materials
const sampleMaterials = [
  {
    id: 1,
    title: "Linear Equations Notes",
    class: "Class 9A",
    subject: "Mathematics",
    type: "PDF",
    uploadDate: "2023-05-15",
  },
  {
    id: 2,
    title: "Cell Structure Diagrams",
    class: "Class 10B",
    subject: "Biology",
    type: "Image",
    uploadDate: "2023-05-16",
  },
  {
    id: 3,
    title: "Grammar Rules Video",
    class: "Class 9A",
    subject: "English",
    type: "Video",
    uploadDate: "2023-05-17",
  },
  {
    id: 4,
    title: "Chemical Reactions Presentation",
    class: "Class 10B",
    subject: "Chemistry",
    type: "PDF",
    uploadDate: "2023-05-18",
  },
]

// Sample data for student doubts
const sampleDoubts = [
  {
    id: 1,
    student: "Aisha Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    question:
      "I'm confused about how to solve quadratic equations using the quadratic formula. Can you explain it again?",
    subject: "Mathematics",
    class: "Class 9A",
    date: "2023-05-20",
    resolved: false,
  },
  {
    id: 2,
    student: "Rahul Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    question: "What's the difference between mitosis and meiosis in cell division?",
    subject: "Biology",
    class: "Class 10B",
    date: "2023-05-21",
    resolved: true,
  },
  {
    id: 3,
    student: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    question: "How do I identify metaphors in a poem?",
    subject: "English",
    class: "Class 9A",
    date: "2023-05-22",
    resolved: false,
  },
]

// Sample data for announcements
const sampleAnnouncements = [
  {
    id: 1,
    title: "Math Test Postponed",
    message: "The math test scheduled for Friday has been postponed to next Monday.",
    class: "Class 9A",
    subject: "Mathematics",
    date: "2023-05-18",
  },
  {
    id: 2,
    title: "Science Exhibition",
    message: "Reminder: Science exhibition projects are due next week. Please complete your models by Thursday.",
    class: "All Classes",
    subject: "General",
    date: "2023-05-19",
  },
  {
    id: 3,
    title: "Parent-Teacher Meeting",
    message: "The parent-teacher meeting will be held on Saturday from 10 AM to 2 PM.",
    class: "All Classes",
    subject: "General",
    date: "2023-05-20",
  },
]

// Sample data for reminders and tests
const sampleReminders = [
  {
    id: 1,
    type: "Test",
    title: "Mathematics Mid-Term",
    class: "Class 9A",
    subject: "Mathematics",
    date: "2023-05-30",
    notes: "Covers chapters 1-5",
  },
  {
    id: 2,
    type: "Reminder",
    title: "Submit Biology Projects",
    class: "Class 10B",
    subject: "Biology",
    date: "2023-05-28",
    notes: "Cell models due",
  },
  {
    id: 3,
    type: "Test",
    title: "English Grammar Quiz",
    class: "Class 9A",
    subject: "English",
    date: "2023-05-26",
    notes: "Focus on parts of speech",
  },
  {
    id: 4,
    type: "Reminder",
    title: "Chemistry Lab Setup",
    class: "Class 10B",
    subject: "Chemistry",
    date: "2023-05-25",
    notes: "Prepare lab equipment for experiment",
  },
]

// Sample data for teacher instructions
const sampleInstructions = [
  {
    id: 1,
    class: "Class 9A",
    chapter: "Chapter 1: Algebra",
    topic: "Linear Equations",
    content:
      "Focus on helping students understand the concept of variables and constants. Use real-world examples to illustrate how linear equations can model everyday situations.",
  },
  {
    id: 2,
    class: "Class 10B",
    chapter: "Chapter 1: Cell Biology",
    topic: "Cell Structure",
    content:
      "Emphasize the differences between plant and animal cells. Have students draw and label the parts of both types of cells. Discuss the function of each organelle.",
  },
]

// Sample data for dashboard metrics
const sampleMetrics = {
  strugglingStudents: 5,
  missingHomework: 7,
  commonDoubt: "Quadratic Equations",
  lowestScoringTopic: "Chemical Reactions",
  topPerformer: "Priya Sharma",
}

export default function TeacherDashboard() {
  const [activeNav, setActiveNav] = useState("dashboard")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedChapter, setSelectedChapter] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [attendance, setAttendance] = useState<Record<number, boolean>>(() =>
    Object.fromEntries(sampleStudents.map((s) => [s.id, true]))
  )
  const [attendanceDate, setAttendanceDate] = useState("")
  const [attendanceMode, setAttendanceMode] = useState<'manual' | 'face-recognition'>('manual')

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <Logo size="md" className="mb-1" />
          <p className="text-sm text-slate-500 mt-1">Teacher Dashboard</p>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeNav === item.id ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
              }`}
              onClick={() => setActiveNav(item.id)}
            >
              <span className={activeNav === item.id ? "text-blue-600" : "text-slate-500"}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>MS</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-slate-700">Ms. Sharma</p>
              <p className="text-xs text-slate-500">Mathematics Teacher</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 text-slate-600">
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 p-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-800">
              {navigationItems.find((item) => item.id === activeNav)?.label}
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input type="search" placeholder="Search..." className="w-64 pl-9 rounded-lg border-slate-200" />
              </div>
              <Button variant="outline" className="border-slate-200 text-slate-600">
                <Bell className="h-4 w-4 mr-2" />
                <span className="sr-only sm:not-sr-only sm:inline">Notifications</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="p-6">
          {/* Attendance system */}
          {activeNav === "attendance" && (
            <div className="space-y-6">
              {/* Toggle Buttons for Attendance Mode */}
              <div className="flex space-x-2">
                <Button
                  onClick={() => setAttendanceMode('manual')}
                  className={`${
                    attendanceMode === 'manual'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  } transition-colors`}
                >
                  Manual Attendance
                </Button>
                <Button
                  onClick={() => setAttendanceMode('face-recognition')}
                  className={`${
                    attendanceMode === 'face-recognition'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  } transition-colors`}
                >
                  Face Recognition Attendance
                </Button>
              </div>

              {/* Manual Attendance Mode */}
              {attendanceMode === 'manual' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Select value={selectedClass} onValueChange={setSelectedClass}>
                      <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="Select Class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="9A">Class 9A</SelectItem>
                        <SelectItem value="9B">Class 9B</SelectItem>
                        <SelectItem value="10A">Class 10A</SelectItem>
                        <SelectItem value="10B">Class 10B</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Date</label>
                      <Input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="bg-white" />
                    </div>
                  </div>

                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle>Mark Attendance</CardTitle>
                      <CardDescription>Toggle present status for each student</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead className="w-[150px]">Present</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {sampleStudents.slice(0, 8).map((student) => (
                            <TableRow key={student.id}>
                              <TableCell className="font-medium">{student.name}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  <Switch
                                    id={`present-${student.id}`}
                                    checked={!!attendance[student.id]}
                                    onCheckedChange={(val) =>
                                      setAttendance((prev) => ({ ...prev, [student.id]: !!val }))
                                    }
                                  />
                                  <label htmlFor={`present-${student.id}`} className="ml-2 text-sm text-slate-700">
                                    {attendance[student.id] ? "Present" : "Absent"}
                                  </label>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button className="bg-blue-600 hover:bg-blue-700">Save Attendance</Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Face Recognition Attendance Mode */}
              {attendanceMode === 'face-recognition' && (
                <div className="w-full">
                  <Card className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold text-slate-800">Face Recognition Attendance</CardTitle>
                      <CardDescription>AI-powered attendance system with facial recognition</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="w-full flex justify-center">
                        <iframe
                          src="http://localhost:3001"
                          title="Face Recognition Attendance"
                          allow="camera; microphone"
                          style={{
                            width: "100%",
                            height: "80vh",
                            border: "none",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#000",
                          }}
                          className="rounded-xl"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}
          {/* Classes & Students */}
          {activeNav === "classes" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9A">Class 9A</SelectItem>
                    <SelectItem value="9B">Class 9B</SelectItem>
                    <SelectItem value="10A">Class 10A</SelectItem>
                    <SelectItem value="10B">Class 10B</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sampleStudents.slice(0, 3).map((student) => (
                  <Card key={student.id} className="bg-blue-50 p-4 flex flex-col items-center text-center shadow-sm border border-slate-200">
                    <Avatar className="h-12 w-12 mb-2">
                      <AvatarImage src={student.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-semibold text-lg text-slate-800">{student.name}</div>
                    <div className="text-xs text-slate-500 mb-2">Roll No: {student.id}</div>
                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Attendance</span>
                        <span className="font-medium text-slate-700">{student.attendance}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Avg. Score</span>
                        <span className="font-medium text-slate-700">{student.avgScore}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Homework Manager */}
          {activeNav === "homework" && (
            <div className="space-y-6">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle>Assign New Homework</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hw-class">Class</Label>
                      <Select>
                        <SelectTrigger id="hw-class">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9A">Class 9A</SelectItem>
                          <SelectItem value="9B">Class 9B</SelectItem>
                          <SelectItem value="10A">Class 10A</SelectItem>
                          <SelectItem value="10B">Class 10B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hw-subject">Subject</Label>
                      <Select>
                        <SelectTrigger id="hw-subject">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hw-topic">Topic</Label>
                      <Input id="hw-topic" placeholder="Enter topic" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hw-deadline">Deadline</Label>
                      <Input id="hw-deadline" type="date" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="hw-instructions">Instructions</Label>
                      <Textarea
                        id="hw-instructions"
                        placeholder="Enter detailed instructions"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="hw-file">Attachments</Label>
                      <Input id="hw-file" type="file" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Assign Homework</Button>
                </CardFooter>
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Assigned Homework</h2>
                <div className="flex items-center space-x-2">
                  <Select>
                    <SelectTrigger className="w-[130px] bg-white">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[130px] bg-white">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="9A">Class 9A</SelectItem>
                      <SelectItem value="9B">Class 9B</SelectItem>
                      <SelectItem value="10A">Class 10A</SelectItem>
                      <SelectItem value="10B">Class 10B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="bg-blue-50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleHomework.map((homework) => (
                      <TableRow key={homework.id}>
                        <TableCell className="font-medium">{homework.title}</TableCell>
                        <TableCell>{homework.class}</TableCell>
                        <TableCell>{homework.subject}</TableCell>
                        <TableCell>{homework.dueDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {homework.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Unlock Topics */}
          {activeNav === "topics" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9A">Class 9A</SelectItem>
                    <SelectItem value="9B">Class 9B</SelectItem>
                    <SelectItem value="10A">Class 10A</SelectItem>
                    <SelectItem value="10B">Class 10B</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Tabs defaultValue="completed">
                <TabsList className="bg-white">
                  <TabsTrigger
                    value="completed"
                    className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
                  >
                    Completed Topics
                  </TabsTrigger>
                  <TabsTrigger
                    value="not-completed"
                    className="data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700"
                  >
                    Not Completed Topics
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="completed">
                  <Card className="bg-blue-50">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Topic</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Visibility</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleTopics.completed.map((topic) => (
                          <TableRow key={topic.id}>
                            <TableCell className="font-medium">{topic.name}</TableCell>
                            <TableCell>{topic.subject}</TableCell>
                            <TableCell>{topic.class}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-50 text-green-700 border-green-200">
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Completed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch id={`topic-${topic.id}`} checked={topic.unlocked} />
                                <Label htmlFor={`topic-${topic.id}`}>{topic.unlocked ? "Unlocked" : "Locked"}</Label>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </TabsContent>
                <TabsContent value="not-completed">
                  <Card className="bg-blue-50">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Topic</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Class</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Visibility</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sampleTopics.notCompleted.map((topic) => (
                          <TableRow key={topic.id}>
                            <TableCell className="font-medium">{topic.name}</TableCell>
                            <TableCell>{topic.subject}</TableCell>
                            <TableCell>{topic.class}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Not Completed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Switch id={`topic-${topic.id}`} checked={topic.unlocked} />
                                <Label htmlFor={`topic-${topic.id}`}>{topic.unlocked ? "Unlocked" : "Locked"}</Label>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Performance Overview */}
          {activeNav === "performance" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9A">Class 9A</SelectItem>
                    <SelectItem value="9B">Class 9B</SelectItem>
                    <SelectItem value="10A">Class 10A</SelectItem>
                    <SelectItem value="10B">Class 10B</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear-equations">Linear Equations</SelectItem>
                    <SelectItem value="quadratic-equations">Quadratic Equations</SelectItem>
                    <SelectItem value="trigonometry">Trigonometry</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="ml-auto bg-white">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle>Average Scores</CardTitle>
                    <CardDescription>Performance across topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-500">Chart visualization would appear here</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle>Common Mistakes</CardTitle>
                    <CardDescription>Frequently occurring errors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-red-500"></div>
                          <span className="font-medium">Sign errors in equations</span>
                        </div>
                        <Badge>15 students</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-amber-500"></div>
                          <span className="font-medium">Incorrect formula application</span>
                        </div>
                        <Badge>12 students</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
                          <span className="font-medium">Calculation errors</span>
                        </div>
                        <Badge>10 students</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-4 w-4 rounded-full bg-green-500"></div>
                          <span className="font-medium">Conceptual misunderstanding</span>
                        </div>
                        <Badge>8 students</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle>Most Asked Doubts</CardTitle>
                    <CardDescription>Questions frequently asked by students</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-medium text-slate-800">How do I solve quadratic equations?</p>
                        <p className="text-sm text-slate-500 mt-1">Asked by 8 students</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-medium text-slate-800">
                          What's the difference between linear and quadratic equations?
                        </p>
                        <p className="text-sm text-slate-500 mt-1">Asked by 6 students</p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="font-medium text-slate-800">When do we use the quadratic formula?</p>
                        <p className="text-sm text-slate-500 mt-1">Asked by 5 students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle>Student Performance</CardTitle>
                    <CardDescription>Individual student scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sampleStudents.slice(0, 5).map((student) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: student.avgScore }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{student.avgScore}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Upload Study Material */}
          {activeNav === "materials" && (
            <div className="space-y-6">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle>Upload Study Material</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material-class">Class</Label>
                      <Select>
                        <SelectTrigger id="material-class">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9A">Class 9A</SelectItem>
                          <SelectItem value="9B">Class 9B</SelectItem>
                          <SelectItem value="10A">Class 10A</SelectItem>
                          <SelectItem value="10B">Class 10B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material-subject">Subject</Label>
                      <Select>
                        <SelectTrigger id="material-subject">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material-chapter">Chapter</Label>
                      <Select>
                        <SelectTrigger id="material-chapter">
                          <SelectValue placeholder="Select Chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="chapter1">Chapter 1: Introduction</SelectItem>
                          <SelectItem value="chapter2">Chapter 2: Fundamentals</SelectItem>
                          <SelectItem value="chapter3">Chapter 3: Advanced Concepts</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="material-topic">Topic</Label>
                      <Input id="material-topic" placeholder="Enter topic" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="material-title">Title</Label>
                      <Input id="material-title" placeholder="Enter title for the material" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="material-description">Description (Optional)</Label>
                      <Textarea id="material-description" placeholder="Enter a brief description" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="material-file">Upload File</Label>
                      <Input id="material-file" type="file" />
                      <p className="text-xs text-slate-500 mt-1">Supported formats: PDF, DOCX, PPT, MP4, JPG, PNG</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Upload Material</Button>
                </CardFooter>
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Uploaded Materials</h2>
                <div className="flex items-center space-x-2">
                  <Select>
                    <SelectTrigger className="w-[130px] bg-white">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="mathematics">Mathematics</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[130px] bg-white">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="9A">Class 9A</SelectItem>
                      <SelectItem value="9B">Class 9B</SelectItem>
                      <SelectItem value="10A">Class 10A</SelectItem>
                      <SelectItem value="10B">Class 10B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Card className="bg-blue-50">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sampleMaterials.map((material) => (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.title}</TableCell>
                        <TableCell>{material.class}</TableCell>
                        <TableCell>{material.subject}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              material.type === "PDF"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : material.type === "Image"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                            }
                          >
                            {material.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{material.uploadDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* Student Doubts */}
          {activeNav === "doubts" && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Select>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="9A">Class 9A</SelectItem>
                    <SelectItem value="9B">Class 9B</SelectItem>
                    <SelectItem value="10A">Class 10A</SelectItem>
                    <SelectItem value="10B">Class 10B</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="history">History</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="All Topics" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Topics</SelectItem>
                    <SelectItem value="linear-equations">Linear Equations</SelectItem>
                    <SelectItem value="quadratic-equations">Quadratic Equations</SelectItem>
                    <SelectItem value="trigonometry">Trigonometry</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="ml-auto bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {sampleDoubts.map((doubt) => (
                  <Card
                    key={doubt.id}
                    className={`bg-blue-50 ${doubt.resolved ? "border-l-4 border-l-green-500" : "border-l-4 border-l-amber-500"}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarImage src={doubt.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{doubt.student.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">{doubt.student}</CardTitle>
                            <CardDescription>
                              {doubt.class} • {doubt.subject} • {doubt.date}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            doubt.resolved
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {doubt.resolved ? "Resolved" : "Pending"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-slate-700">{doubt.question}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="text-slate-600">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm" className="text-slate-600">
                          <Share2 className="h-3.5 w-3.5 mr-1" />
                          Share with Class
                        </Button>
                      </div>
                      {!doubt.resolved && (
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckSquare className="h-3.5 w-3.5 mr-1" />
                          Mark as Resolved
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {activeNav === "announcements" && (
            <div className="space-y-6">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle>Create Announcement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="announcement-title">Title</Label>
                      <Input id="announcement-title" placeholder="Enter announcement title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="announcement-class">Target Audience</Label>
                      <Select>
                        <SelectTrigger id="announcement-class">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Classes</SelectItem>
                          <SelectItem value="9A">Class 9A</SelectItem>
                          <SelectItem value="9B">Class 9B</SelectItem>
                          <SelectItem value="10A">Class 10A</SelectItem>
                          <SelectItem value="10B">Class 10B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="announcement-subject">Subject (Optional)</Label>
                      <Select>
                        <SelectTrigger id="announcement-subject">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="announcement-message">Message</Label>
                      <Textarea
                        id="announcement-message"
                        placeholder="Enter announcement message"
                        className="min-h-[100px]"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="announcement-file">Attachments (Optional)</Label>
                      <Input id="announcement-file" type="file" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Post Announcement</Button>
                </CardFooter>
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Recent Announcements</h2>
                <Button variant="outline" className="bg-white">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {sampleAnnouncements.map((announcement) => (
                  <Card key={announcement.id} className="bg-blue-50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {announcement.class}
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                            {announcement.subject}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription>{announcement.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-slate-700">{announcement.message}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Reminders & Tests */}
          {activeNav === "reminders" && (
            <div className="space-y-6">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle>Create Reminder or Test</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminder-type">Type</Label>
                      <Select>
                        <SelectTrigger id="reminder-type">
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="test">Test</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-title">Title</Label>
                      <Input id="reminder-title" placeholder="Enter title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-class">Class</Label>
                      <Select>
                        <SelectTrigger id="reminder-class">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9A">Class 9A</SelectItem>
                          <SelectItem value="9B">Class 9B</SelectItem>
                          <SelectItem value="10A">Class 10A</SelectItem>
                          <SelectItem value="10B">Class 10B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-subject">Subject</Label>
                      <Select>
                        <SelectTrigger id="reminder-subject">
                          <SelectValue placeholder="Select Subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-topic">Topic (Optional)</Label>
                      <Input id="reminder-topic" placeholder="Enter topic" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reminder-date">Date</Label>
                      <Input id="reminder-date" type="date" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="reminder-notes">Notes</Label>
                      <Textarea id="reminder-notes" placeholder="Enter additional notes" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="reminder-file">Attachments (Optional)</Label>
                      <Input id="reminder-file" type="file" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Create</Button>
                </CardFooter>
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Upcoming Tests & Reminders</h2>
                <div className="flex items-center space-x-2">
                  <Select>
                    <SelectTrigger className="w-[130px] bg-white">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="test">Tests</SelectItem>
                      <SelectItem value="reminder">Reminders</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-[130px] bg-white">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="9A">Class 9A</SelectItem>
                      <SelectItem value="9B">Class 9B</SelectItem>
                      <SelectItem value="10A">Class 10A</SelectItem>
                      <SelectItem value="10B">Class 10B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleReminders.map((reminder) => (
                  <Card
                    key={reminder.id}
                    className={`bg-blue-50 ${
                      reminder.type === "Test" ? "border-l-4 border-l-blue-500" : "border-l-4 border-l-amber-500"
                    }`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{reminder.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            reminder.type === "Test"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {reminder.type}
                        </Badge>
                      </div>
                      <CardDescription>
                        {reminder.class} • {reminder.subject}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{reminder.date}</span>
                      </div>
                      <p className="text-slate-700">{reminder.notes}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Teacher Instructions */}
          {activeNav === "instructions" && (
            <div className="space-y-6">
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle>Create Teacher Instructions</CardTitle>
                  <CardDescription>These notes will appear in the Student Smart Notebook</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instruction-class">Class</Label>
                      <Select>
                        <SelectTrigger id="instruction-class">
                          <SelectValue placeholder="Select Class" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="9A">Class 9A</SelectItem>
                          <SelectItem value="9B">Class 9B</SelectItem>
                          <SelectItem value="10A">Class 10A</SelectItem>
                          <SelectItem value="10B">Class 10B</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instruction-chapter">Chapter</Label>
                      <Select>
                        <SelectTrigger id="instruction-chapter">
                          <SelectValue placeholder="Select Chapter" />
                        </SelectTrigger>
                        <SelectContent></SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instruction-topic">Topic</Label>
                      <Select>
                        <SelectTrigger id="instruction-topic">
                          <SelectValue placeholder="Select Topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="linear-equations">Linear Equations</SelectItem>
                          <SelectItem value="quadratic-equations">Quadratic Equations</SelectItem>
                          <SelectItem value="trigonometry">Trigonometry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="instruction-content">Instructions</Label>
                      <Textarea
                        id="instruction-content"
                        placeholder="Enter detailed instructions for students..."
                        className="min-h-[200px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">Save Instructions</Button>
                </CardFooter>
              </Card>

              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Existing Instructions</h2>
                <div className="flex items-center space-x-2">
                  <Select>
                    <SelectTrigger className="w-[130px] bg-white">
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      <SelectItem value="9A">Class 9A</SelectItem>
                      <SelectItem value="9B">Class 9B</SelectItem>
                      <SelectItem value="10A">Class 10A</SelectItem>
                      <SelectItem value="10B">Class 10B</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {sampleInstructions.map((instruction) => (
                  <Card key={instruction.id} className="bg-blue-50">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-base">{instruction.topic}</CardTitle>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {instruction.class}
                        </Badge>
                      </div>
                      <CardDescription>{instruction.chapter}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-slate-700">{instruction.content}</p>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-end">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Dashboard Metrics */}
          {activeNav === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Students with Multiple Mistakes</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      <li className="text-slate-800 font-medium">Aisha Patel</li>
                      <li className="text-slate-800 font-medium">Rahul Singh</li>
                      <li className="text-slate-800 font-medium">Priya Sharma</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Missing Homework</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1">
                      <li className="text-slate-800 font-medium">Arjun Kumar</li>
                      <li className="text-slate-800 font-medium">Neha Gupta</li>
                      <li className="text-slate-800 font-medium">Rohan Malhotra</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Most Asked Doubt</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">Quadratic Equations</div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Lowest Scoring Topic</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">Linear Equations</div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Top Performer</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-2xl font-bold">Priya Sharma</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest updates from your classes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">New homework submissions</p>
                          <p className="text-sm text-slate-500">15 students submitted Linear Equations homework</p>
                          <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <HelpCircle className="h-4 w-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="font-medium">New student doubt</p>
                          <p className="text-sm text-slate-500">
                            Rahul Singh asked a question about Quadratic Equations
                          </p>
                          <p className="text-xs text-slate-400 mt-1">3 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-green-100 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div>
                          <p className="font-medium">Test completed</p>
                          <p className="text-sm text-slate-500">Class 9A completed the Mathematics quiz</p>
                          <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="bg-amber-100 p-2 rounded-full">
                          <Upload className="h-4 w-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="font-medium">New study material</p>
                          <p className="text-sm text-slate-500">You uploaded "Cell Structure Diagrams" for Class 10B</p>
                          <p className="text-xs text-slate-400 mt-1">2 days ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle>Upcoming Schedule</CardTitle>
                    <CardDescription>Tests and reminders for the next week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sampleReminders.slice(0, 3).map((reminder, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div
                            className={`p-2 rounded-full ${reminder.type === "Test" ? "bg-blue-100" : "bg-amber-100"}`}
                          >
                            {reminder.type === "Test" ? (
                              <BookOpen
                                className={`h-4 w-4 ${reminder.type === "Test" ? "text-blue-500" : "text-amber-500"}`}
                              />
                            ) : (
                              <Bell className="h-4 w-4 text-amber-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{reminder.title}</p>
                            <p className="text-sm text-slate-500">
                              {reminder.class} • {reminder.subject}
                            </p>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                              <Calendar className="h-3 w-3" />
                              <span>{reminder.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full mt-2">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add New Reminder
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Class Performance Overview</CardTitle>
                    <CardDescription>Average scores by subject</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-slate-500">Performance chart visualization would appear here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
