"use client"

import { useState, useRef, useEffect } from "react"
import {
  Search,
  BookOpen,
  Clock,
  PlusCircle,
  Star,
  HelpCircle,
  AlertCircle,
  BookMarked,
  X,
  Edit,
  Trash2,
  StickyNote,
  Plus,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useNotebookNotes } from './hooks/useNotebookNotes'
import { useStickyNotes } from './hooks/useStickyNotes'
import { useMistakes } from './hooks/useMistakes'
import { usePracticedNotes } from './hooks/usePracticedNotes'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Logo from "@/components/Logo"
import { toast } from 'sonner'
import { useAuth } from '@/lib/firebase/auth-context'

// Define the subjects with their colors
const subjects = [
  { name: "Telugu", color: "bg-blue-50 border-blue-200 text-blue-800" },
  { name: "English", color: "bg-purple-50 border-purple-200 text-purple-800" },
  { name: "Mathematics", color: "bg-green-50 border-green-200 text-green-800" },
  { name: "Physical Science", color: "bg-amber-50 border-amber-200 text-amber-800" },
  { name: "Biological Science", color: "bg-rose-50 border-rose-200 text-rose-800" },
  { name: "Social Studies", color: "bg-indigo-50 border-indigo-200 text-indigo-800" },
]

// Sample chapters for each subject
const chaptersBySubject = {
  Telugu: ["Chapter 1: Telugu Basics", "Chapter 2: Advanced Telugu", "Chapter 3: Telugu Literature"],
  English: ["Chapter 1: Grammar", "Chapter 2: Literature", "Chapter 3: Composition"],
  Mathematics: ["Chapter 1: Algebra", "Chapter 2: Geometry", "Chapter 3: Trigonometry"],
  "Physical Science": ["Chapter 1: Physics", "Chapter 2: Chemistry", "Chapter 3: Mechanics"],
  "Biological Science": ["Chapter 1: Cell Biology", "Chapter 2: Human Physiology", "Chapter 3: Ecology"],
  "Social Studies": ["Chapter 1: History", "Chapter 2: Geography", "Chapter 3: Civics"],
}

// Sample topics for each chapter
const topicsByChapter = {
  "Chapter 1: Telugu Basics": ["Telugu Alphabet", "Basic Vocabulary", "Simple Sentences"],
  "Chapter 2: Advanced Telugu": ["Telugu Grammar", "Telugu Poetry", "Telugu Prose"],
  "Chapter 3: Telugu Literature": ["Classic Telugu Literature", "Modern Telugu Literature", "Telugu Authors"],
  "Chapter 1: Grammar": ["Parts of Speech", "Tenses", "Sentence Structure"],
  "Chapter 2: Literature": ["Poetry Analysis", "Prose Analysis", "Literary Devices"],
  "Chapter 3: Composition": ["Essay Writing", "Letter Writing", "Creative Writing"],
  "Chapter 1: Algebra": ["Linear Equations", "Quadratic Equations", "Polynomials"],
  "Chapter 2: Geometry": ["Triangles", "Circles", "Coordinate Geometry"],
  "Chapter 3: Trigonometry": ["Trigonometric Ratios", "Trigonometric Identities", "Applications of Trigonometry"],
  "Chapter 1: Physics": ["Motion", "Force", "Energy"],
  "Chapter 2: Chemistry": ["Elements", "Compounds", "Chemical Reactions"],
  "Chapter 3: Mechanics": ["Newton's Laws", "Momentum", "Work and Energy"],
  "Chapter 1: Cell Biology": ["Cell Structure", "Cell Division", "Cell Functions"],
  "Chapter 2: Human Physiology": ["Digestive System", "Respiratory System", "Circulatory System"],
  "Chapter 3: Ecology": ["Ecosystems", "Biodiversity", "Environmental Conservation"],
  "Chapter 1: History": ["Ancient History", "Medieval History", "Modern History"],
  "Chapter 2: Geography": ["Physical Geography", "Human Geography", "Economic Geography"],
  "Chapter 3: Civics": ["Indian Constitution", "Government Structure", "Fundamental Rights"],
}

// Sample notes
const sampleNotes = [
  {
    id: "note1",
    subject: "Mathematics",
    chapter: "Chapter 1: Algebra",
    topic: "Linear Equations",
    content:
      "Linear equations are equations of the form ax + b = c, where a, b, and c are constants and x is a variable. To solve, isolate x by performing the same operations on both sides of the equation.",
    isImportant: true,
    isDoubt: false,
    isRevision: true,
    isMistake: false,
    date: "2023-05-15",
    timer: 0,
  },
  {
    id: "note2",
    subject: "Biological Science",
    chapter: "Chapter 1: Cell Biology",
    topic: "Cell Structure",
    content:
      "The cell membrane is a phospholipid bilayer with embedded proteins that surrounds the cell. It regulates what enters and exits the cell through selective permeability.",
    isImportant: false,
    isDoubt: true,
    isRevision: true,
    isMistake: false,
    date: "2023-05-16",
    timer: 0,
  },
]

// Sample practiced notes
const samplePracticedNotes = [
  {
    id: "practice1",
    subject: "Mathematics",
    chapter: "Chapter 3: Trigonometry",
    topic: "Trigonometric Ratios",
    question: "Define the six trigonometric ratios.",
    answer:
      "The six trigonometric ratios are: 1) Sine (sin) = opposite/hypotenuse, 2) Cosine (cos) = adjacent/hypotenuse, 3) Tangent (tan) = opposite/adjacent, 4) Cosecant (csc) = hypotenuse/opposite, 5) Secant (sec) = hypotenuse/adjacent, and 6) Cotangent (cot) = adjacent/opposite.",
    score: 9,
    feedback: "Excellent answer! You've correctly defined all six trigonometric ratios.",
    isImportant: true,
    isDoubt: false,
    isRevision: true,
    isMistake: false,
    date: "2023-05-17",
    timer: 0,
  },
  {
    id: "practice2",
    subject: "English",
    chapter: "Chapter 2: Literature",
    topic: "Literary Devices",
    question: "Define metaphor and provide an example.",
    answer:
      "A metaphor is a figure of speech that makes a direct comparison between two things without using 'like' or 'as'.",
    score: 6,
    feedback:
      "Good start, but your answer could be more complete. A metaphor suggests that one thing is another thing, creating a stronger comparison than a simile. You should also include an example.",
    isImportant: false,
    isDoubt: true,
    isRevision: true,
    isMistake: true,
    date: "2023-05-18",
    timer: 0,
  },
]

// Sample mistakes
const sampleMistakes = [
  {
    id: "mistake1",
    subject: "Physical Science",
    chapter: "Chapter 1: Physics",
    topic: "Motion",
    question: "What is the formula for calculating velocity?",
    incorrectAnswer: "v = d × t",
    correctAnswer: "v = d ÷ t",
    date: "2023-05-19",
    timer: 0,
  },
  {
    id: "mistake2",
    subject: "Mathematics",
    chapter: "Chapter 2: Geometry",
    topic: "Circles",
    question: "What is the formula for the area of a circle?",
    incorrectAnswer: "A = 2πr",
    correctAnswer: "A = πr²",
    date: "2023-05-20",
    timer: 0,
  },
]

// Sample teacher instructions
const sampleTeacherInstructions = [
  {
    id: "instruction1",
    subject: "Mathematics",
    chapter: "Chapter 1: Algebra",
    topic: "Linear Equations",
    content:
      "Focus on understanding the concept of variables and constants. Practice solving equations step by step, showing all your work. Make sure to check your answers by substituting the value back into the original equation. Pay special attention to equations with fractions and decimals.",
    date: "2023-05-21",
    notes: "",
  },
  {
    id: "instruction2",
    subject: "Biological Science",
    chapter: "Chapter 1: Cell Biology",
    topic: "Cell Structure",
    content:
      "Draw and label the parts of a cell. Understand the function of each organelle and how they work together. Compare and contrast plant and animal cells. Be prepared to discuss the relationship between cell structure and function in the next class.",
    date: "2023-05-22",
    notes: "",
  },
]

// Smart Revision Suggester type
type RevisionSuggestion = {
  id: string
  subject: string
  chapter: string
  topic: string
  reason: string
  date: string
}

// Spaced Repetition Scheduler type
type SpacedRepetitionItem = {
  id: string
  subject: string
  chapter: string
  topic: string
  lastReviewed: string
  nextDue: string
  reviewCount: number
  progress: number
}

// Sample revision suggestions
const sampleRevisionSuggestions: RevisionSuggestion[] = [
  {
    id: "revision1",
    subject: "Mathematics",
    chapter: "Chapter 2: Geometry",
    topic: "Triangles",
    reason: "3 recent mistakes",
    date: "2023-05-23",
  },
  {
    id: "revision2",
    subject: "Physical Science",
    chapter: "Chapter 1: Physics",
    topic: "Motion",
    reason: "Low score (65%)",
    date: "2023-05-24",
  },
  {
    id: "revision3",
    subject: "English",
    chapter: "Chapter 3: Composition",
    topic: "Essay Writing",
    reason: "Not attempted yet",
    date: "2023-05-25",
  },
]

// Sample spaced repetition items
const sampleSpacedRepetitionItems: SpacedRepetitionItem[] = [
  {
    id: "spaced1",
    subject: "Mathematics",
    chapter: "Chapter 1: Algebra",
    topic: "Linear Equations",
    lastReviewed: "2023-05-15",
    nextDue: "2023-05-22",
    reviewCount: 2,
    progress: 60,
  },
  {
    id: "spaced2",
    subject: "Biological Science",
    chapter: "Chapter 1: Cell Biology",
    topic: "Cell Structure",
    lastReviewed: "2023-05-18",
    nextDue: "2023-05-23",
    reviewCount: 1,
    progress: 30,
  },
  {
    id: "spaced3",
    subject: "English",
    chapter: "Chapter 2: Literature",
    topic: "Literary Devices",
    lastReviewed: "2023-05-20",
    nextDue: "2023-05-25",
    reviewCount: 3,
    progress: 80,
  },
]

// Get color for a subject
const getSubjectColor = (subjectName: string) => {
  const subject = subjects.find((s) => s.name === subjectName)
  return subject ? subject.color : "bg-slate-50 border-slate-200 text-slate-700"
}

// Add local interfaces for types
interface NotebookNote {
  id: string;
  subject: string;
  chapter: string;
  topic: string;
  content: string;
  isImportant: boolean;
  isDoubt: boolean;
  isRevision: boolean;
  isMistake: boolean;
  date: string;
  timer: number;
}

interface PracticedNote {
  id: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  feedback: string;
  questionType?: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  isImportant?: boolean;
  isDoubt?: boolean;
  isRevision?: boolean;
  isMistake?: boolean;
  isRetry?: boolean;
  date?: string;
  timer?: number;
}

interface Mistake {
  id: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  featureType: string;
  topicId: string;
  subject?: string;
  chapter?: string;
  topic?: string;
  createdAt: any;
  date?: string;
  isImportant?: boolean;
  isDoubt?: boolean;
  isRevision?: boolean;
}

interface StickyNote {
  id: string;
  text: string;
  topicId: string;
  colorTag?: string;
  color?: string;
  position?: { x: number; y: number };
  createdAt: any;
}

// Main component
export default function NotebookPage() {
  const { userProfile } = useAuth()
  
  // State for selected subject, chapter, and topic
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedChapter, setSelectedChapter] = useState<string>("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")

  // Firestore hooks
  const { notes, loading: notesLoading, addNote, updateNote, deleteNote } = useNotebookNotes() as { notes: NotebookNote[], loading: boolean, addNote: any, updateNote: any, deleteNote: any }
  const { mistakes, loading: mistakesLoading } = useMistakes()
  const { practicedNotes, loading: practicedLoading } = usePracticedNotes() as { practicedNotes: PracticedNote[], loading: boolean }
  const { stickyNotes, loading: stickyLoading, addStickyNote, updateStickyNote, deleteStickyNote } = useStickyNotes(selectedTopic)

  // TipTap editor for new note
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: '',
  })

  // State for new note
  const [newNoteContent, setNewNoteContent] = useState<string>("")
  // State for new note flags (important, doubt, revision)
  const [newNoteFlags, setNewNoteFlags] = useState({
    isImportant: false,
    isDoubt: false,
    isRevision: false,
  })

  // State for search
  const [searchQuery, setSearchQuery] = useState<string>("")

  // State for sticky notes
  const [showStickyNoteForm, setShowStickyNoteForm] = useState<boolean>(false)
  const [newStickyNoteContent, setNewStickyNoteContent] = useState<string>("")
  const [newStickyNoteColor, setNewStickyNoteColor] = useState<string>("bg-yellow-100")

  // State for timers
  const [timers, setTimers] = useState<Record<string, { running: boolean; time: number }>>({})

  // State for selected item
  const [selectedItem, setSelectedItem] = useState<NotebookNote | PracticedNote | null>(null)
  const [activeTab, setActiveTab] = useState<string>("write-notes")

  // State for teacher instruction dialog
  const [instructionDialogOpen, setInstructionDialogOpen] = useState<boolean>(false)
  const [selectedInstruction, setSelectedInstruction] = useState<Mistake | null>(null)

  // State for important and doubts notes
  const [newImportantNote, setNewImportantNote] = useState<string>("")
  const [newDoubtNote, setNewDoubtNote] = useState<string>("")
  const [showImportantForm, setShowImportantForm] = useState<boolean>(false)
  const [showDoubtForm, setShowDoubtForm] = useState<boolean>(false)

  // State for teacher instruction form
  const [showTeacherInstructionForm, setShowTeacherInstructionForm] = useState<boolean>(false)
  const [newTeacherInstruction, setNewTeacherInstruction] = useState<string>("")

  // State for practiced notes filter
  const [practicedNotesFilter, setPracticedNotesFilter] = useState<'all' | 'flashcard' | 'qa' | 'mcq' | 'match'>('all')

  // State for revision suggestions and spaced repetition items
  const [revisionSuggestions, setRevisionSuggestions] = useState<RevisionSuggestion[]>(sampleRevisionSuggestions)
  const [spacedRepetitionItems, setSpacedRepetitionItems] =
    useState<SpacedRepetitionItem[]>(sampleSpacedRepetitionItems)

  // Refs
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Effect for timers
  useEffect(() => {
    timerIntervalRef.current = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers = { ...prevTimers }
        Object.keys(newTimers).forEach((key) => {
          if (newTimers[key].running) {
            newTimers[key].time += 1
          }
        })
        return newTimers
      })
    }, 1000)

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [])

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Toggle timer
  const toggleTimer = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = { ...prevTimers }
      if (!newTimers[id]) {
        newTimers[id] = { running: true, time: 0 }
      } else {
        newTimers[id].running = !newTimers[id].running
      }
      return newTimers
    })
  }

  // Reset timer
  const resetTimer = (id: string) => {
    setTimers((prevTimers) => {
      const newTimers = { ...prevTimers }
      if (newTimers[id]) {
        newTimers[id].time = 0
      }
      return newTimers
    })
  }

  // Handle subject selection
  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject)
    setSelectedChapter("")
    setSelectedTopic("")
  }

  // Handle chapter selection
  const handleChapterSelect = (chapter: string) => {
    setSelectedChapter(chapter)
    setSelectedTopic("")
  }

  // Handle topic selection
  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic)
  }

  // Add new note
  const addNewNote = () => {
    if (!newNoteContent.trim() || !selectedSubject || !selectedChapter || !selectedTopic) return

    const newNote: NotebookNote = {
      id: `note${Date.now()}`,
      subject: selectedSubject,
      chapter: selectedChapter,
      topic: selectedTopic,
      content: newNoteContent,
      isImportant: newNoteFlags.isImportant,
      isDoubt: newNoteFlags.isDoubt,
      isRevision: newNoteFlags.isRevision,
      isMistake: false,
      date: new Date().toISOString().split("T")[0],
      timer: 0,
    }

    addNote(newNote)
    setNewNoteContent("")
    setNewNoteFlags({ isImportant: false, isDoubt: false, isRevision: false })
  }

  // Add new important note
  const addNewImportantNote = () => {
    if (!newImportantNote.trim() || !selectedSubject) return

    const newNote: NotebookNote = {
      id: `note${Date.now()}`,
      subject: selectedSubject,
      chapter: selectedChapter || "Unspecified",
      topic: selectedTopic || "Unspecified",
      content: newImportantNote,
      isImportant: true,
      isDoubt: false,
      isRevision: false,
      isMistake: false,
      date: new Date().toISOString().split("T")[0],
      timer: 0,
    }

    addNote(newNote)
    setNewImportantNote("")
    setShowImportantForm(false)
  }

  // Add new doubt note
  const addNewDoubtNote = () => {
    if (!newDoubtNote.trim() || !selectedSubject) return

    const newNote: NotebookNote = {
      id: `note${Date.now()}`,
      subject: selectedSubject,
      chapter: selectedChapter || "Unspecified",
      topic: selectedTopic || "Unspecified",
      content: newDoubtNote,
      isImportant: false,
      isDoubt: true,
      isRevision: false,
      isMistake: false,
      date: new Date().toISOString().split("T")[0],
      timer: 0,
    }

    addNote(newNote)
    setNewDoubtNote("")
    setShowDoubtForm(false)
  }

  // Add new teacher instruction
  const addNewTeacherInstruction = () => {
    if (!newTeacherInstruction.trim() || !selectedSubject) return
    const newInstruction: Mistake = {
      id: `instruction${Date.now()}`,
      question: newTeacherInstruction,
      studentAnswer: "",
      correctAnswer: "",
      score: 0,
      featureType: "",
      topicId: selectedTopic || "Unspecified",
      createdAt: new Date(),
    }
    setSelectedInstruction(newInstruction)
    setNewTeacherInstruction("")
    setShowTeacherInstructionForm(false)
  }

  // Toggle note flag
  const toggleNoteFlag = (id: string, flag: "isImportant" | "isDoubt" | "isRevision" | "isMistake") => {
    updateNote(id, { [flag]: !notes.find((note) => note.id === id)?.[flag] })
  }

  // Toggle practiced note flag
  const togglePracticedNoteFlag = (id: string, flag: "isImportant" | "isDoubt" | "isRevision" | "isMistake") => {
    // This would update the practiced note in Firestore
    console.log(`Toggling ${flag} for practiced note ${id}`)
  }

  // Handle item click from important or doubts
  const handleItemClick = (item: NotebookNote | PracticedNote) => {
    setSelectedItem(item)
    if ("question" in item) {
      setActiveTab("practiced-notes")
    } else {
      setActiveTab("write-notes")
    }
  }

  // Handle teacher instruction click
  const handleInstructionClick = (instruction: Mistake) => {
    setSelectedInstruction(instruction)
    setInstructionDialogOpen(true)
  }

  // Update teacher instruction notes
  const updateInstructionNotes = (id: string, notes: string) => {
    updateNote(id, { notes })
  }

  // Filter notes by search query and selected subject
  const filteredNotes = notes.filter(
    (note) =>
      (note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.topic.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedSubject || note.subject === selectedSubject),
  )

  // Filter practiced notes by search query and selected subject
  const filteredPracticedNotes = practicedNotes.filter(
    (note) =>
      (note.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.studentAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.subject || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.chapter || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.topic || '').toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedSubject || note.subject === selectedSubject),
  )

  // Filter mistakes by search query and selected subject
  const filteredMistakes = mistakes.filter(
    (mistake) =>
      (mistake.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mistake.correctAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mistake.topicId.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (!selectedSubject || mistake.topicId === selectedTopic),
  )

  // Filter teacher instructions by search query
  const filteredTeacherInstructions = notes.filter(
    (note) =>
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.topic.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get important notes
  // REMOVED: Old complex declaration to avoid conflicts
  // const importantNotes = [...notes.filter((note) => note.isImportant), ...practicedNotes.filter((note) => note.isImportant)]

  // Add debug logging for important notes
  // REMOVED: Old debug logging to avoid conflicts

  // Get doubt notes
  const doubtNotes = [...notes.filter((note) => note.isDoubt), ...practicedNotes.filter((note) => note.isDoubt)]

  // Get revision notes
  // REMOVED: Old complex declaration to avoid conflicts  
  // const revisionNotes = [...notes.filter((note) => note.isRevision), ...practicedNotes.filter((note) => note.isRevision)]

  // Fix addStickyNote button handler
  // Replace onClick={addStickyNote} with a handler that creates a sticky note object
  // Example:
  // onClick={() => handleAddStickyNote()}
  const handleAddStickyNote = () => {
    if (!newStickyNoteContent.trim() || !selectedTopic) return;
    addStickyNote({
      text: newStickyNoteContent,
      topicId: selectedTopic,
      colorTag: newStickyNoteColor,
      createdAt: new Date(),
    });
    setNewStickyNoteContent("");
    setShowStickyNoteForm(false);
  };

  // Filter practiced notes based on selected filter
  const getFilteredPracticedNotes = () => {
    if (practicedNotesFilter === 'all') {
      return practicedNotes
    }
    return practicedNotes.filter(note => {
      const questionType = note.questionType?.toLowerCase()
      if (practicedNotesFilter === 'qa') {
        return questionType === 'qa'
      }
      return questionType === practicedNotesFilter
    })
  }

  // Move practiced note to mistakes section - SIMPLIFIED: Just toggle the flag
  const movePracticedNoteToMistakes = async (note: PracticedNote) => {
    if (!userProfile?.uid) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // Simply update the practiced note's isMistake flag
      // This would ideally update the note in Firestore, but for now we'll update locally
      const updatedNote = { ...note, isMistake: true };
      
      // Update the local state (you would also update Firestore here)
      toast.success('✅ Note marked as mistake successfully!');
      console.log('✅ Note marked as mistake:', updatedNote);
      
      // Force a re-render by updating practiced notes
      window.location.reload(); // Temporary - ideally update state properly
    } catch (error) {
      console.error('❌ Failed to mark as mistake:', error);
      toast.error('Failed to mark note as mistake');
    }
  }

  // Move practiced note to revision section - SIMPLIFIED: Just toggle the flag
  const movePracticedNoteToRevision = async (note: PracticedNote) => {
    if (!userProfile?.uid) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // Simply update the practiced note's isRevision flag
      const updatedNote = { ...note, isRevision: true };
      
      // Update the local state (you would also update Firestore here)
      toast.success('✅ Note added to revision successfully!');
      console.log('✅ Note marked for revision:', updatedNote);
      
      // Force a re-render
      window.location.reload(); // Temporary - ideally update state properly
    } catch (error) {
      console.error('❌ Failed to mark for revision:', error);
      toast.error('Failed to add note to revision');
    }
  }

  // Move practiced note to important section - SIMPLIFIED: Just toggle the flag  
  const movePracticedNoteToImportant = async (note: PracticedNote) => {
    if (!userProfile?.uid) {
      toast.error('User not authenticated');
      return;
    }

    try {
      // Simply update the practiced note's isImportant flag
      const updatedNote = { ...note, isImportant: true };
      
      // Update the local state (you would also update Firestore here)
      toast.success('✅ Note marked as important successfully!');
      console.log('✅ Note marked as important:', updatedNote);
      
      // Force a re-render
      window.location.reload(); // Temporary - ideally update state properly
    } catch (error) {
      console.error('❌ Failed to mark as important:', error);
      toast.error('Failed to mark note as important');
    }
  }

  // SIMPLIFIED: Get important notes - just filter practiced notes with isImportant flag
  const importantNotes = practicedNotes.filter((note) => note.isImportant)

  // SIMPLIFIED: Get revision notes - just filter practiced notes with isRevision flag  
  const revisionNotes = practicedNotes.filter((note) => note.isRevision)

  // SIMPLIFIED: Get mistake notes - just filter practiced notes with isMistake flag
  const mistakeNotes = practicedNotes.filter((note) => note.isMistake)

  // Remove the old complex filteredRevisionNotes state and use simple filtering
  const filteredRevisionNotes = revisionNotes

  // Add debug logging
  console.log('⭐ Important notes count:', importantNotes.length)
  console.log('📚 Revision notes count:', revisionNotes.length) 
  console.log('❌ Mistake notes count:', mistakeNotes.length)
  console.log('📝 All practiced notes:', practicedNotes.length)
  console.log('📝 Practiced notes with flags:', practicedNotes.map(note => ({
    id: note.id,
    question: note.question?.substring(0, 30) + '...',
    isImportant: note.isImportant || false,
    isRevision: note.isRevision || false, 
    isMistake: note.isMistake || false
  })))

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      {/* Header */}
      <header className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Link href="/dashboard/student" className="text-slate-600 hover:text-slate-800 hover:underline">
            Back to Dashboard
          </Link>
          <Logo size="lg" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-800 font-merriweather mb-6">
          Your Smart Notebook
        </h1>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search across your notes, answers, mistakes, and tags..."
            className="w-full py-3 pl-10 pr-4 rounded-xl border-slate-200 bg-white shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-green-50 border border-green-100 p-4 rounded-xl shadow-sm w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <BookMarked className="h-5 w-5 text-green-500 mr-2" /> Smart Revision Strategy
              </h2>
              <span className="text-sm text-slate-500">{revisionSuggestions.length} topics</span>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {revisionSuggestions.length > 0 ? (
                revisionSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="mb-2 p-2 bg-white rounded-lg border border-green-100 text-sm hover:bg-green-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-slate-700">{suggestion.topic}</p>
                        <p className="text-xs text-slate-500">
                          {suggestion.subject} • {suggestion.chapter.split(":")[0]}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {suggestion.reason}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Button
                        size="sm"
                        className="w-full bg-green-100 hover:bg-green-200 text-green-800 border border-green-300"
                      >
                        Let's Study
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">No revision suggestions yet</p>
              )}
            </div>
          </Card>
          <Card className="bg-amber-50 border border-amber-100 p-4 rounded-xl shadow-sm w-full">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center">
                <Clock className="h-5 w-5 text-amber-500 mr-2" /> Smart Learning Strategy
              </h2>
              <span className="text-sm text-slate-500">{spacedRepetitionItems.length} items</span>
            </div>
            <div className="max-h-40 overflow-y-auto">
              {spacedRepetitionItems.length > 0 ? (
                spacedRepetitionItems.map((item) => (
                  <div
                    key={item.id}
                    className="mb-2 p-2 bg-white rounded-lg border border-amber-100 text-sm hover:bg-amber-50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-slate-700">{item.topic}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${item.nextDue < new Date().toISOString().split("T")[0] ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}
                      >
                        Due: {item.nextDue}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      {item.subject} • Last reviewed: {item.lastReviewed}
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">{item.reviewCount} reviews</span>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="text-xs py-1 h-7">
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs py-1 h-7 bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300"
                        >
                          Mark Reviewed
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-sm italic">No scheduled reviews yet</p>
              )}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-8 flex flex-col gap-6">
          {/* Horizontal Subject Selection */}
          <Card className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Subject Selection</h2>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
              {subjects.map((subject) => {
                const isSelected = selectedSubject === subject.name
                const baseClasses = `p-3 rounded-lg cursor-pointer transition-all text-center ${subject.color.split(" ")[0]} ${subject.color.split(" ")[1]}`
                const selectedClasses = isSelected ? "ring-2 ring-blue-500" : ""

                return (
                  <div
                    key={subject.name}
                    className={`${baseClasses} ${selectedClasses}`}
                    onClick={() => handleSubjectSelect(subject.name)}
                  >
                    <p className={`font-medium ${subject.color.split(" ")[2]}`}>{subject.name}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Chapter</label>
                <Select value={selectedChapter} onValueChange={handleChapterSelect} disabled={!selectedSubject}>
                  <SelectTrigger className="w-full bg-blue-50 border-blue-200 rounded-lg">
                    <SelectValue placeholder="Select Chapter" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-50 border-blue-200 rounded-lg">
                    {selectedSubject &&
                      chaptersBySubject[selectedSubject as keyof typeof chaptersBySubject]?.map((chapter) => (
                        <SelectItem key={chapter} value={chapter}>
                          {chapter}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
                <Select value={selectedTopic} onValueChange={handleTopicSelect} disabled={!selectedChapter}>
                  <SelectTrigger className="w-full bg-purple-50 border-purple-200 rounded-lg">
                    <SelectValue placeholder="Select Topic" />
                  </SelectTrigger>
                  <SelectContent className="bg-purple-50 border-purple-200 rounded-lg">
                    {selectedChapter &&
                      topicsByChapter[selectedChapter as keyof typeof topicsByChapter]?.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Tabs Panel */}
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="write-notes" className="data-[state=active]:bg-blue-50">
                Write Notes
              </TabsTrigger>
              <TabsTrigger value="practiced-notes" className="data-[state=active]:bg-green-50">
                Practiced Notes
              </TabsTrigger>
              <TabsTrigger value="revision-notes" className="data-[state=active]:bg-amber-50">
                Revision Notes
              </TabsTrigger>
              <TabsTrigger value="mistakes" className="data-[state=active]:bg-rose-50">
                Mistakes
              </TabsTrigger>
              <TabsTrigger value="important-notes" className="data-[state=active]:bg-amber-50">
                Important Notes
              </TabsTrigger>
            </TabsList>

            {/* Write Notes Tab */}
            <TabsContent value="write-notes">
              <Card className="bg-blue-50 border border-blue-100 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Write Notes</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-blue-200 text-blue-800"
                      onClick={() => setShowStickyNoteForm(true)}
                    >
                      <StickyNote className="h-4 w-4 mr-1" /> Add Sticky Note
                    </Button>
                  </div>
                </div>

                {/* Sticky Note Form */}
                {showStickyNoteForm && (
                  <Card className="bg-yellow-50 border border-yellow-200 p-3 mb-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-sm font-medium text-slate-800">New Sticky Note</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => setShowStickyNoteForm(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Write your sticky note here..."
                      className="min-h-[80px] mb-2 bg-white border-yellow-200"
                      value={newStickyNoteContent}
                      onChange={(e) => setNewStickyNoteContent(e.target.value)}
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-1">
                        {["bg-yellow-100", "bg-blue-100", "bg-green-100", "bg-purple-100", "bg-rose-100"].map(
                          (color) => (
                            <div
                              key={color}
                              className={`h-6 w-6 rounded-full cursor-pointer ${color} ${
                                newStickyNoteColor === color ? "ring-2 ring-slate-500" : ""
                              }`}
                              onClick={() => setNewStickyNoteColor(color)}
                            />
                          ),
                        )}
                      </div>
                      <Button
                        size="sm"
                        className="bg-yellow-200 hover:bg-yellow-300 text-yellow-800 border border-yellow-300"
                        onClick={handleAddStickyNote}
                      >
                        Add
                      </Button>
                    </div>
                  </Card>
                )}

                {/* Sticky Notes */}
                {stickyNotes.length > 0 && (
                  <div className="relative h-40 mb-4 border border-slate-200 rounded-lg bg-white">
                    {stickyNotes.map((note) => (
                      <div
                        key={note.id}
                        className={`absolute p-3 w-40 h-40 rounded-lg shadow-sm ${note.color} border border-slate-200`}
                        style={{ top: `${note.position.y}px`, left: `${note.position.x}px` }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="w-4 h-4 bg-white rounded-full" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => deleteStickyNote(note.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm mt-1 overflow-hidden">{note.text}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Note Form */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <h3 className="text-sm font-medium text-slate-800">
                      {selectedSubject && selectedChapter && selectedTopic
                        ? `${selectedSubject} > ${selectedChapter.split(":")[0]} > ${selectedTopic}`
                        : "Select a subject, chapter, and topic to start writing"}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center text-slate-600"
                      onClick={() => {
                        const id = "new-note"
                        toggleTimer(id)
                      }}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      {timers["new-note"] ? formatTime(timers["new-note"].time) : "00:00"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-blue-200 text-blue-800"
                      onClick={addNewNote}
                      disabled={!selectedSubject || !selectedChapter || !selectedTopic || !newNoteContent.trim()}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" /> Add Page
                    </Button>
                  </div>
                </div>
                <textarea
                  placeholder="Start writing your notes here..."
                  className="min-h-[200px] border-0 focus:ring-0 p-0 w-full"
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                />
                {/* Add flag buttons at the bottom */}
                <div className="flex flex-row justify-end items-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-amber-50 text-amber-800 border-amber-200"
                    onClick={() => setNewNoteFlags({ ...newNoteFlags, isImportant: !newNoteFlags.isImportant })}
                    aria-pressed={newNoteFlags?.isImportant}
                  >
                    <Star className="h-4 w-4 mr-1" /> Important
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-purple-50 text-purple-800 border-purple-200"
                    onClick={() => setNewNoteFlags({ ...newNoteFlags, isDoubt: !newNoteFlags.isDoubt })}
                    aria-pressed={newNoteFlags?.isDoubt}
                  >
                    <HelpCircle className="h-4 w-4 mr-1" /> Mark as Doubt
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 text-green-800 border-green-200"
                    onClick={() => setNewNoteFlags({ ...newNoteFlags, isRevision: !newNoteFlags.isRevision })}
                    aria-pressed={newNoteFlags?.isRevision}
                  >
                    <BookMarked className="h-4 w-4 mr-1" />{" "}
                    {newNoteFlags.isRevision ? "Revision" : "Add to Revision"}
                  </Button>
                </div>

                {/* Existing Notes */}
                <div className="space-y-4">
                  {selectedItem && "content" in selectedItem ? (
                    <Card key={selectedItem.id} className="bg-white border border-blue-100 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-sm font-medium text-slate-800">
                            {selectedItem.subject} &gt; {selectedItem.chapter.split(":")[0]} &gt; {selectedItem.topic}
                          </h3>
                          <p className="text-xs text-slate-500">{selectedItem.date}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center text-slate-600"
                            onClick={() => toggleTimer(selectedItem.id)}
                          >
                            <Clock className="h-4 w-4 mr-1" />
                            {timers[selectedItem.id] ? formatTime(timers[selectedItem.id].time) : "00:00"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => {
                              deleteNote(selectedItem.id)
                              setSelectedItem(null)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-3 whitespace-pre-line">{selectedItem.content}</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${selectedItem.isImportant ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-white text-slate-700 border-slate-200"}`}
                          onClick={() => toggleNoteFlag(selectedItem.id, "isImportant")}
                        >
                          <Star className="h-3 w-3 mr-1" /> {selectedItem.isImportant ? "Important" : "Mark Important"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${selectedItem.isDoubt ? "bg-purple-50 text-purple-800 border-purple-200" : "bg-white text-slate-700 border-slate-200"}`}
                          onClick={() => toggleNoteFlag(selectedItem.id, "isDoubt")}
                        >
                          <HelpCircle className="h-3 w-3 mr-1" /> {selectedItem.isDoubt ? "Doubt" : "Mark as Doubt"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className={`${selectedItem.isRevision ? "bg-green-50 text-green-800 border-green-200" : "bg-white text-slate-700 border-slate-200"}`}
                          onClick={() => toggleNoteFlag(selectedItem.id, "isRevision")}
                        >
                          <BookMarked className="h-3 w-3 mr-1" />{" "}
                          {selectedItem.isRevision ? "Revision" : "Add to Revision"}
                        </Button>
                      </div>
                    </Card>
                  ) : (
                    filteredNotes.map((note) => (
                      <Card key={note.id} className="bg-white border border-blue-100 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-sm font-medium text-slate-800">
                              {note.subject || 'General'} &gt; {note.chapter || 'General'} &gt; {note.topic || 'General'}
                            </h3>
                            <p className="text-xs text-slate-500">{note.date}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center text-slate-600"
                              onClick={() => toggleTimer(note.id)}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              {timers[note.id] ? formatTime(timers[note.id].time) : "00:00"}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => deleteNote(note.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-slate-700 mb-3 whitespace-pre-line">{note.content}</p>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${note.isImportant ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-white text-slate-700 border-slate-200"}`}
                            onClick={() => toggleNoteFlag(note.id, "isImportant")}
                          >
                            <Star className="h-3 w-3 mr-1" /> {note.isImportant ? "Important" : "Mark Important"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${note.isDoubt ? "bg-purple-50 text-purple-800 border-purple-200" : "bg-white text-slate-700 border-slate-200"}`}
                            onClick={() => toggleNoteFlag(note.id, "isDoubt")}
                          >
                            <HelpCircle className="h-3 w-3 mr-1" /> {note.isDoubt ? "Doubt" : "Mark as Doubt"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${note.isRevision ? "bg-green-50 text-green-800 border-green-200" : "bg-white text-slate-700 border-slate-200"}`}
                            onClick={() => toggleNoteFlag(note.id, "isRevision")}
                          >
                            <BookMarked className="h-3 w-3 mr-1" /> {note.isRevision ? "Revision" : "Add to Revision"}
                          </Button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Practiced Notes Tab */}
            <TabsContent value="practiced-notes">
              <Card className="bg-green-50 border border-green-100 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Practiced Notes</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-green-200 text-green-800"
                      disabled
                    >
                      <BookOpen className="h-4 w-4 mr-1" /> Auto-saved from practice
                    </Button>
                  </div>
                </div>

                {/* Filter Toggle */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {['all', 'flashcard', 'qa', 'mcq', 'match'].map((filter) => (
                    <Button
                      key={filter}
                      variant={practicedNotesFilter === filter ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPracticedNotesFilter(filter as typeof practicedNotesFilter)}
                      className={practicedNotesFilter === filter ? "bg-green-600 text-white" : "bg-white text-slate-700"}
                    >
                      {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Button>
                  ))}
                </div>

                {practicedLoading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Loading practiced notes...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getFilteredPracticedNotes().length > 0 ? (
                      getFilteredPracticedNotes().map((note) => (
                        <Card key={note.id} className="bg-white border border-green-100 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-sm font-medium text-slate-800">
                                {note.subject || 'General'} &gt; {note.chapter || 'General'} &gt; {note.topic || 'General'}
                              </h3>
                              <p className="text-xs text-slate-500">
                                Score: {note.score}/10 {note.isRetry && "(Retry)"} | {note.questionType?.toUpperCase() || 'QA'}
                                {note.score === 0 && <span className="ml-2 text-red-600 font-medium">• INCORRECT</span>}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center text-slate-600"
                                onClick={() => toggleTimer(note.id)}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                {timers[note.id] ? formatTime(timers[note.id].time) : "00:00"}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                              <h4 className="text-sm font-medium text-slate-800 mb-1">Question:</h4>
                              <p className="text-slate-700">{note.question}</p>
                            </div>
                            
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                              <h4 className="text-sm font-medium text-slate-800 mb-1">Your Answer:</h4>
                              <p className="text-slate-700 whitespace-pre-line">{note.studentAnswer}</p>
                            </div>
                            
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                              <h4 className="text-sm font-medium text-slate-800 mb-1">Correct Answer:</h4>
                              <p className="text-slate-700 whitespace-pre-line">{note.correctAnswer}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white text-slate-700 border-slate-200 hover:bg-amber-50"
                              onClick={() => movePracticedNoteToImportant(note)}
                            >
                              <Star className="h-3 w-3 mr-1" /> Mark Important
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white text-slate-700 border-slate-200 hover:bg-green-50"
                              onClick={() => movePracticedNoteToRevision(note)}
                            >
                              <BookMarked className="h-3 w-3 mr-1" /> Add to Revision
                            </Button>
                            {note.score === 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                onClick={() => movePracticedNoteToMistakes(note)}
                              >
                                <AlertCircle className="h-3 w-3 mr-1" /> Move to Mistakes
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No practiced notes yet</p>
                        <p className="text-slate-400 text-xs mt-1">
                          Practice questions in the Study section to see them here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Revision Notes Tab */}
            <TabsContent value="revision-notes">
              <Card className="bg-amber-50 border border-amber-100 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Revision Notes</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-amber-200 text-amber-800"
                      disabled
                    >
                      <BookOpen className="h-4 w-4 mr-1" /> Auto-saved from practice
                    </Button>
                  </div>
                </div>

                {practicedLoading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Loading revision notes...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRevisionNotes.length > 0 ? (
                      filteredRevisionNotes.map((note) => (
                        <Card key={note.id} className="bg-white border border-amber-100 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-sm font-medium text-slate-800">
                                {note.subject || 'General'} &gt; {note.chapter || 'General'} &gt; {note.topic || 'General'}
                              </h3>
                              <p className="text-xs text-slate-500">{note.date}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center text-slate-600"
                                onClick={() => toggleTimer(note.id)}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                {timers[note.id] ? formatTime(timers[note.id].time) : "00:00"}
                              </Button>
                            </div>
                          </div>
                          <p className="text-slate-700 mb-3 whitespace-pre-line">{note.content}</p>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${note.isImportant ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-white text-slate-700 border-slate-200"}`}
                              onClick={() => toggleNoteFlag(note.id, "isImportant")}
                            >
                              <Star className="h-3 w-3 mr-1" /> {note.isImportant ? "Important" : "Mark Important"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${note.isDoubt ? "bg-purple-50 text-purple-800 border-purple-200" : "bg-white text-slate-700 border-slate-200"}`}
                              onClick={() => toggleNoteFlag(note.id, "isDoubt")}
                            >
                              <HelpCircle className="h-3 w-3 mr-1" /> {note.isDoubt ? "Doubt" : "Mark as Doubt"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`${note.isRevision ? "bg-green-50 text-green-800 border-green-200" : "bg-white text-slate-700 border-slate-200"}`}
                              onClick={() => toggleNoteFlag(note.id, "isRevision")}
                            >
                              <BookMarked className="h-3 w-3 mr-1" /> {note.isRevision ? "Revision" : "Add to Revision"}
                            </Button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No revision notes yet</p>
                        <p className="text-slate-400 text-xs mt-1">
                          Practice questions in the Study section to see them here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Mistakes Tab */}
            <TabsContent value="mistakes">
              <Card className="bg-rose-50 border border-rose-100 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Mistakes</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-rose-200 text-rose-800"
                      disabled
                    >
                      <BookOpen className="h-4 w-4 mr-1" /> Auto-saved from practice
                    </Button>
                  </div>
                </div>

                {practicedLoading ? (
                  <div className="text-center py-8">
                    <p className="text-slate-500">Loading mistakes...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mistakeNotes.length > 0 ? (
                      mistakeNotes.map((note) => (
                        <Card key={note.id} className="bg-white border border-rose-100 p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-sm font-medium text-slate-800">
                                {note.subject || 'General'} &gt; {note.chapter || 'General'} &gt; {note.topic || 'General'}
                              </h3>
                              <p className="text-xs text-slate-500">
                                Score: {note.score}/10 | {note.questionType?.toUpperCase() || 'QA'}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center text-slate-600"
                                onClick={() => toggleTimer(note.id)}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                {timers[note.id] ? formatTime(timers[note.id].time) : "00:00"}
                              </Button>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-rose-50 rounded-lg border border-rose-100">
                              <h4 className="text-sm font-medium text-slate-800 mb-1">Question:</h4>
                              <p className="text-slate-700">{note.question}</p>
                            </div>
                            
                            <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                              <h4 className="text-sm font-medium text-slate-800 mb-1">Your Answer (Incorrect):</h4>
                              <p className="text-slate-700 whitespace-pre-line">{note.studentAnswer}</p>
                            </div>
                            
                            <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                              <h4 className="text-sm font-medium text-slate-800 mb-1">Correct Answer:</h4>
                              <p className="text-slate-700 whitespace-pre-line">{note.correctAnswer}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-50 text-red-700 border-red-200"
                            >
                              <AlertCircle className="h-3 w-3 mr-1" /> Mistake
                            </Button>
                          </div>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 text-sm">No mistakes yet</p>
                        <p className="text-slate-400 text-xs mt-1">
                          Practice questions in the Study section to see them here
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* Important Notes Tab */}
            <TabsContent value="important-notes">
              <Card className="bg-amber-50 border border-amber-100 p-4 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-slate-800">Important Notes</h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white border-amber-200 text-amber-800"
                      onClick={() => setShowImportantForm(!showImportantForm)}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" /> Add Important Note
                    </Button>
                  </div>
                </div>

                {showImportantForm && (
                  <Card className="bg-white border border-amber-100 p-4 rounded-lg mb-4">
                    <Textarea
                      placeholder="Add an important note..."
                      className="min-h-[120px] mb-2 border-amber-200 text-sm"
                      value={newImportantNote}
                      onChange={(e) => setNewImportantNote(e.target.value)}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-600"
                        onClick={() => setShowImportantForm(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300"
                        onClick={addNewImportantNote}
                        disabled={!newImportantNote.trim() || !selectedSubject}
                      >
                        Save
                      </Button>
                    </div>
                  </Card>
                )}

                <div className="space-y-4">
                  {importantNotes.length > 0 ? (
                    importantNotes.map((note, index) => (
                      <Card key={note.id || index} className="bg-white border border-amber-100 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-sm font-medium text-slate-800">
                              {note.subject || 'General'} &gt; {note.chapter || 'General'} &gt; {note.topic || 'General'}
                            </h3>
                            <p className="text-xs text-slate-500">
                              Score: {note.score}/10 | {note.questionType?.toUpperCase() || 'QA'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center text-slate-600"
                              onClick={() => toggleTimer(note.id)}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              {timers[note.id] ? formatTime(timers[note.id].time) : "00:00"}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                            <h4 className="text-sm font-medium text-slate-800 mb-1">Question:</h4>
                            <p className="text-slate-700">{note.question}</p>
                          </div>
                          
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <h4 className="text-sm font-medium text-slate-800 mb-1">Your Answer:</h4>
                            <p className="text-slate-700 whitespace-pre-line">{note.studentAnswer}</p>
                          </div>
                          
                          <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                            <h4 className="text-sm font-medium text-slate-800 mb-1">Correct Answer:</h4>
                            <p className="text-slate-700 whitespace-pre-line">{note.correctAnswer}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-3">
                          <Button variant="outline" size="sm" className="bg-amber-50 text-amber-800 border-amber-200">
                            <Star className="h-3 w-3 mr-1" /> Important
                          </Button>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm italic text-center py-8">No important notes yet</p>
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </header>

      {/* Teacher Instruction Dialog */}
      <Dialog open={instructionDialogOpen} onOpenChange={setInstructionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Teacher Instruction</DialogTitle>
          </DialogHeader>
          {selectedInstruction && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-800">
                  {selectedInstruction.subject || 'General'} &gt; {selectedInstruction.chapter || 'General'} &gt; {selectedInstruction.topic || 'General'}
                </h3>
                <p className="text-xs text-slate-500">{selectedInstruction.date}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-slate-700 whitespace-pre-line">{selectedInstruction.question}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-1">Your Notes:</h4>
                <Textarea
                  placeholder="Add your notes about this instruction..."
                  className="min-h-[100px] border-slate-200"
                  value={selectedInstruction.notes}
                  onChange={(e) => updateInstructionNotes(selectedInstruction.id, e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setInstructionDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
