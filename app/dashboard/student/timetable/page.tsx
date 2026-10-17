"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, Circle, ChevronDown, X, BookOpen, Edit } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Logo from "@/components/Logo"

// Define the subjects with their colors
const subjects = [
  { name: "Telugu", color: "bg-blue-50 border-blue-200 text-blue-800" },
  { name: "English", color: "bg-purple-50 border-purple-200 text-purple-800" },
  { name: "Mathematics", color: "bg-green-50 border-green-200 text-green-800" },
  { name: "Physical Science", color: "bg-amber-50 border-amber-200 text-amber-800" },
  { name: "Biological Science", color: "bg-rose-50 border-rose-200 text-rose-800" },
  { name: "Social Studies", color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
]

// Define the days of the week
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// Sample topics for each subject
const topicsBySubject = {
  Telugu: ["Telugu Grammar", "Telugu Literature", "Telugu Poetry", "Telugu Prose"],
  English: ["English Grammar", "English Literature", "English Poetry", "English Prose"],
  Mathematics: ["Algebra", "Geometry", "Trigonometry", "Statistics"],
  "Physical Science": ["Physics Mechanics", "Electricity", "Magnetism", "Chemistry Basics"],
  "Biological Science": ["Cell Biology", "Human Physiology", "Plant Biology", "Ecology"],
  "Social Studies": ["History", "Geography", "Civics", "Economics"],
}

// Get color for a subject
const getSubjectColor = (subjectName: string) => {
  const subject = subjects.find((s) => s.name === subjectName)
  return subject ? subject.color : "bg-slate-50 border-slate-200 text-slate-700"
}

// Sample weekly timetable data - up to 2 topics per day
const initialWeeklyTimetable = {
  Monday: [
    { subject: "Mathematics", topic: "Algebra", completed: false },
    { subject: "English", topic: "English Grammar", completed: false },
  ],
  Tuesday: [
    { subject: "Physical Science", topic: "Physics Mechanics", completed: false },
    { subject: "Social Studies", topic: "History", completed: false },
  ],
  Wednesday: [
    { subject: "English", topic: "English Literature", completed: false },
    { subject: "Mathematics", topic: "Geometry", completed: false },
  ],
  Thursday: [
    { subject: "Physical Science", topic: "Chemistry Basics", completed: false },
    { subject: "Social Studies", topic: "Geography", completed: false },
  ],
  Friday: [
    { subject: "Biological Science", topic: "Cell Biology", completed: false },
    { subject: "Mathematics", topic: "Trigonometry", completed: false },
  ],
  Saturday: [
    { subject: "Social Studies", topic: "Civics", completed: false },
    { subject: "Biological Science", topic: "Plant Biology", completed: false },
  ],
  Sunday: [],
}

// Sample motivational quotes
const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Education is the passport to the future, for tomorrow belongs to those who prepare for it today.",
  "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
]

export default function StudentTimetable() {
  const [weeklyTimetable, setWeeklyTimetable] = useState(initialWeeklyTimetable)
  const [hasHomework, setHasHomework] = useState<boolean | null>(null)
  const [homeworkSubjects, setHomeworkSubjects] = useState<string[]>([])
  const [homeworkTopics, setHomeworkTopics] = useState<Record<string, string>>({})
  const [todaysTasks, setTodaysTasks] = useState<
    { subject: string; topic: string; completed: boolean; isHomework: boolean }[]
  >([])
  const [currentDay, setCurrentDay] = useState("")
  const [streak, setStreak] = useState(3)
  const [changingTopic, setChangingTopic] = useState<boolean>(false)
  const [topicToChange, setTopicToChange] = useState<number | null>(null)
  const [selectedSubjectForChange, setSelectedSubjectForChange] = useState<string>("")
  const [quote, setQuote] = useState("")
  const [homeworkEntered, setHomeworkEntered] = useState(false)

  // Initialize the current day, today's tasks, and quote
  useEffect(() => {
    const today = new Date()
    const dayIndex = today.getDay() === 0 ? 6 : today.getDay() - 1
    const dayName = daysOfWeek[dayIndex]
    setCurrentDay(dayName)

    // Initialize today's tasks based on the weekly timetable
    if (dayName !== "Sunday") {
      const initialTasks = weeklyTimetable[dayName as keyof typeof weeklyTimetable].map((item) => ({
        subject: item.subject,
        topic: item.topic,
        completed: item.completed,
        isHomework: false,
      }))
      setTodaysTasks(initialTasks)
    }

    // Set a random motivational quote
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
    setQuote(randomQuote)
  }, [])

  // Handle homework subject selection
  const toggleHomeworkSubject = (subject: string) => {
    if (homeworkSubjects.includes(subject)) {
      setHomeworkSubjects(homeworkSubjects.filter((s) => s !== subject))
      const newHomeworkTopics = { ...homeworkTopics }
      delete newHomeworkTopics[subject]
      setHomeworkTopics(newHomeworkTopics)
    } else {
      setHomeworkSubjects([...homeworkSubjects, subject])
    }
  }

  // Handle homework topic selection
  const selectHomeworkTopic = (subject: string, topic: string) => {
    setHomeworkTopics({ ...homeworkTopics, [subject]: topic })
  }

  // Generate today's plan including homework
  const generateTodaysPlan = () => {
    if (currentDay === "Sunday") {
      return
    }

    const homeworkTasksToAdd = Object.entries(homeworkTopics).map(([subject, topic]) => ({
      subject,
      topic,
      completed: false,
      isHomework: true,
    }))

    // Get suggested topics from the weekly timetable
    const suggestedTasks = weeklyTimetable[currentDay as keyof typeof weeklyTimetable].map((item) => ({
      subject: item.subject,
      topic: item.topic,
      completed: false,
      isHomework: false,
    }))

    let combinedTasks = [...homeworkTasksToAdd]

    // If homework count is less than 3, add 1 suggested topic
    if (homeworkTasksToAdd.length < 3 && suggestedTasks.length > 0) {
      // Add just 1 suggested topic
      combinedTasks = [...combinedTasks, suggestedTasks[0]]
    }

    setTodaysTasks(combinedTasks)
    setHomeworkEntered(true) // Set homework as entered
    setHasHomework(null) // Reset the homework flow
  }

  // Reset homework flow to allow changes
  const resetHomeworkFlow = () => {
    setHomeworkEntered(false)
    setHasHomework(true)
  }

  // Toggle task completion
  const toggleTaskCompletion = (index: number) => {
    const newTasks = [...todaysTasks]
    newTasks[index].completed = !newTasks[index].completed
    setTodaysTasks(newTasks)

    // If the task is not homework, also update the weekly timetable
    if (!newTasks[index].isHomework && currentDay !== "Sunday") {
      const newTimetable = { ...weeklyTimetable }
      const dayTasks = newTimetable[currentDay as keyof typeof weeklyTimetable]

      // Find the matching task in the timetable
      const timetableIndex = dayTasks.findIndex(
        (item) => item.subject === newTasks[index].subject && item.topic === newTasks[index].topic,
      )

      if (timetableIndex !== -1) {
        dayTasks[timetableIndex].completed = newTasks[index].completed
        setWeeklyTimetable(newTimetable)
      }
    }
  }

  // Toggle task completion in weekly timetable
  const toggleWeeklyTaskCompletion = (day: string, index: number) => {
    const newTimetable = { ...weeklyTimetable }
    const tasks = newTimetable[day as keyof typeof weeklyTimetable]
    tasks[index].completed = !tasks[index].completed
    setWeeklyTimetable(newTimetable)

    // If this is today, also update today's tasks
    if (day === currentDay) {
      const newTasks = [...todaysTasks]
      const todayIndex = newTasks.findIndex(
        (task) => !task.isHomework && task.subject === tasks[index].subject && task.topic === tasks[index].topic,
      )

      if (todayIndex !== -1) {
        newTasks[todayIndex].completed = tasks[index].completed
        setTodaysTasks(newTasks)
      }
    }
  }

  // Start changing a topic
  const startChangeTopic = () => {
    setChangingTopic(true)
    setTopicToChange(null)
    setSelectedSubjectForChange("")
  }

  // Select which topic to change
  const selectTopicToChange = (index: number) => {
    setTopicToChange(index)
    setSelectedSubjectForChange(todaysTasks[index].subject)
  }

  // Change a topic
  const changeTopic = (subject: string, topic: string) => {
    if (topicToChange === null) return

    const newTasks = [...todaysTasks]
    newTasks[topicToChange].subject = subject
    newTasks[topicToChange].topic = topic
    setTodaysTasks(newTasks)

    // Also update the weekly timetable if it's not a homework task
    if (!newTasks[topicToChange].isHomework && currentDay !== "Sunday") {
      const newTimetable = { ...weeklyTimetable }
      // Find the non-homework task in the timetable
      const nonHomeworkTaskIndex = newTasks.findIndex((task) => !task.isHomework)
      if (
        nonHomeworkTaskIndex !== -1 &&
        nonHomeworkTaskIndex < newTimetable[currentDay as keyof typeof weeklyTimetable].length
      ) {
        newTimetable[currentDay as keyof typeof weeklyTimetable][nonHomeworkTaskIndex] = {
          subject,
          topic,
          completed: false,
        }
        setWeeklyTimetable(newTimetable)
      }
    }

    setChangingTopic(false)
    setTopicToChange(null)
    setSelectedSubjectForChange("")
  }

  // Cancel changing a topic
  const cancelChangeTopic = () => {
    setChangingTopic(false)
    setTopicToChange(null)
    setSelectedSubjectForChange("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4 md:p-6">
      <header className="flex justify-between items-center mb-6">
        <Logo size="lg" />
        <Link href="/dashboard/student" className="text-slate-600 hover:text-slate-800 hover:underline">
          Back to Dashboard
        </Link>
      </header>

      {/* Top Section - Streak + Motivation */}
      <Card className="bg-blue-50 border border-blue-100 p-4 mb-6 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="text-slate-800 text-xl md:text-2xl font-bold mb-3 sm:mb-0">🔥 Streak: {streak} Days</div>
          <Separator className="hidden sm:block h-10 w-px bg-slate-200 mx-4" />
          <div className="text-slate-600 italic text-center w-full sm:w-auto">{quote}</div>
        </div>
      </Card>

      {/* Weekly Timetable Grid */}
      <Card className="bg-purple-50 border border-purple-100 p-4 mb-6 rounded-xl shadow-sm">
        <h2 className="text-xl md:text-2xl font-merriweather text-slate-800 mb-4 text-center">
          Personalized Weekly Timetable
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
          {daysOfWeek.map((day) => (
            <Card
              key={day}
              className={`${
                day === "Sunday" ? "bg-blue-50 border-blue-200" : "bg-white border-slate-200"
              } border p-3 rounded-xl ${day === currentDay ? "ring-2 ring-blue-500" : ""}`}
            >
              <h3 className="font-bold text-slate-800 mb-2 border-b pb-2">{day}</h3>
              {day === "Sunday" ? (
                <p className="text-blue-800 py-4 text-center">Sunday – Enjoy!</p>
              ) : (
                <ul className="space-y-3">
                  {weeklyTimetable[day as keyof typeof weeklyTimetable].map((item, index) => {
                    const subjectColor = getSubjectColor(item.subject)
                    return (
                      <li
                        key={`${day}-${index}`}
                        className={`flex items-start rounded-lg p-2 ${subjectColor.split(" ")[0]} border ${
                          subjectColor.split(" ")[1]
                        }`}
                      >
                        <Checkbox
                          id={`${day}-task-${index}`}
                          checked={item.completed}
                          onCheckedChange={() => toggleWeeklyTaskCompletion(day, index)}
                          className="mr-3 mt-1 border border-slate-300"
                        />
                        <label
                          htmlFor={`${day}-task-${index}`}
                          className={`${subjectColor.split(" ")[2]} ${item.completed ? "line-through opacity-70" : ""}`}
                        >
                          <div className="font-semibold">{item.subject}</div>
                          <div className="text-sm">{item.topic}</div>
                        </label>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </Card>

      {/* Homework Flow */}
      {hasHomework === null && !homeworkEntered && currentDay !== "Sunday" && (
        <Card className="bg-green-50 border border-green-100 p-4 mb-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-merriweather text-slate-800 mb-4 text-center">Homework</h2>
          <p className="text-slate-600 mb-4 text-center">Do you have homework today?</p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={() => setHasHomework(true)}
              className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200"
            >
              Yes
            </Button>
            <Button
              onClick={() => setHasHomework(false)}
              className="bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
            >
              No
            </Button>
          </div>
        </Card>
      )}

      {/* Homework Entered State */}
      {homeworkEntered && currentDay !== "Sunday" && (
        <Card className="bg-green-50 border border-green-100 p-4 mb-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-merriweather text-slate-800 text-center">Homework Entered</h2>
            <Button
              onClick={resetHomeworkFlow}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-white border-green-200 text-green-800"
            >
              <Edit className="h-4 w-4" />
              Change Homework
            </Button>
          </div>
        </Card>
      )}

      {/* If has homework - Step 2 */}
      {hasHomework === true && (
        <Card className="bg-green-50 border border-green-100 p-4 mb-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-merriweather text-slate-800 mb-4 text-center">Homework</h2>
          <div className="mb-6">
            <p className="text-slate-600 mb-4 text-center">Select which subjects you have homework in:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {subjects.map((subject) => {
                const isSelected = homeworkSubjects.includes(subject.name)
                return (
                  <Button
                    key={subject.name}
                    onClick={() => toggleHomeworkSubject(subject.name)}
                    variant="outline"
                    className={`flex justify-between items-center ${
                      isSelected ? subject.color : "bg-white text-slate-700 border-slate-200"
                    }`}
                  >
                    {subject.name}
                    {isSelected ? (
                      <CheckCircle2 className="h-4 w-4 ml-2 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4 ml-2 text-gray-400" />
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {homeworkSubjects.length > 0 && (
            <div className="mb-6">
              <p className="text-slate-600 mb-4 text-center">Select which topics for each subject:</p>
              <div className="space-y-3">
                {homeworkSubjects.map((subject) => {
                  const subjectObj = subjects.find((s) => s.name === subject)
                  const color = subjectObj ? subjectObj.color : ""
                  return (
                    <div key={subject} className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className={`min-w-[150px] font-medium ${color.split(" ")[2]}`}>{subject}:</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="bg-white text-slate-700 border-slate-200 justify-between w-full sm:w-auto"
                          >
                            {homeworkTopics[subject] || "Select a topic"}
                            <ChevronDown className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-full">
                          {topicsBySubject[subject as keyof typeof topicsBySubject].map((topic) => (
                            <DropdownMenuItem key={topic} onClick={() => selectHomeworkTopic(subject, topic)}>
                              {topic}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button
              onClick={() => setHasHomework(null)}
              variant="outline"
              className="bg-white border-green-200 text-green-800"
            >
              Back
            </Button>
            <Button
              onClick={generateTodaysPlan}
              className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200"
              disabled={Object.keys(homeworkTopics).length === 0}
            >
              Generate Today's Plan
            </Button>
          </div>
        </Card>
      )}

      {/* Today's Tasks */}
      {(hasHomework === false || todaysTasks.length > 0) && currentDay !== "Sunday" && (
        <Card className="bg-amber-50 border border-amber-100 p-4 mb-6 rounded-xl shadow-sm transition-all duration-300">
          <h2 className="text-xl font-merriweather text-slate-800 mb-2 text-center">Today's Tasks</h2>
          <h3 className="text-slate-600 mb-4 text-center">{currentDay}</h3>
          <div className="space-y-3">
            {todaysTasks.map((task, index) => {
              const subjectColor = getSubjectColor(task.subject)
              return (
                <div
                  key={index}
                  className={`flex items-start justify-between p-3 rounded-lg border transition-all duration-300 ${
                    subjectColor.split(" ")[0]
                  } ${subjectColor.split(" ")[1]}`}
                >
                  <div className="flex items-start">
                    <Checkbox
                      id={`task-${index}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(index)}
                      className="mr-3 mt-1 border border-slate-300"
                    />
                    <label
                      htmlFor={`task-${index}`}
                      className={`${subjectColor.split(" ")[2]} ${task.completed ? "line-through opacity-70" : ""}`}
                    >
                      <div className="font-semibold">{task.subject}</div>
                      <div>{task.topic}</div>
                      {task.isHomework && <div className="text-sm mt-1 font-medium text-blue-600">(Homework)</div>}
                    </label>
                  </div>
                  {changingTopic && topicToChange === index ? (
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelChangeTopic}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    !task.isHomework && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          startChangeTopic()
                          selectTopicToChange(index)
                        }}
                        className="text-slate-600 hover:text-slate-800"
                      >
                        Change
                      </Button>
                    )
                  )}
                </div>
              )
            })}
          </div>

          {/* Topic Change Interface */}
          {changingTopic && topicToChange !== null && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-amber-200 transition-all duration-300">
              <h3 className="text-slate-800 font-semibold mb-2">Change Topic</h3>

              <div className="mb-3">
                <p className="text-slate-600 mb-2">Select Subject:</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="bg-white text-slate-700 border-slate-200 justify-between w-full sm:w-auto"
                    >
                      {selectedSubjectForChange || "Select a subject"}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {subjects.map((subject) => (
                      <DropdownMenuItem key={subject.name} onClick={() => setSelectedSubjectForChange(subject.name)}>
                        {subject.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {selectedSubjectForChange && (
                <div className="mb-3">
                  <p className="text-slate-600 mb-2">Select Topic:</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-white text-slate-700 border-slate-200 justify-between w-full sm:w-auto"
                      >
                        Select a topic
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {topicsBySubject[selectedSubjectForChange as keyof typeof topicsBySubject]?.map((topic) => (
                        <DropdownMenuItem key={topic} onClick={() => changeTopic(selectedSubjectForChange, topic)}>
                          {topic}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}

              <div className="flex justify-end mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelChangeTopic}
                  className="bg-white border-amber-200 text-amber-800"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {todaysTasks.length === 0 && (
            <p className="text-slate-600 text-center py-3">No tasks for today. Enjoy your day!</p>
          )}
        </Card>
      )}
    </div>
  )
}
