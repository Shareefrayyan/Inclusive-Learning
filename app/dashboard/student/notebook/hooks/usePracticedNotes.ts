import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/firebase/auth-context'
import { db } from '@/lib/firebase/config'
import { collection, query, orderBy, getDocs, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'

export interface PracticedNote {
  id: string;
  questionId: string;
  questionType: 'mcq' | 'flashcard' | 'match' | 'qa';
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  maxScore: number;
  feedback?: string;
  subject: string;
  chapter: string;
  topic: string;
  isRetry: boolean;
  isImportant?: boolean;
  isDoubt?: boolean;
  isRevision?: boolean;
  timestamp: any;
}

export function usePracticedNotes() {
  const { user } = useAuth()
  const [practicedNotes, setPracticedNotes] = useState<PracticedNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    
    const loadPracticedNotes = async () => {
      try {
        setLoading(true)
        console.log('📚 Loading practiced notes from smart notebook...')
        console.log('👤 User ID:', user.uid)
        
        // Query the smart notebook practiced notes collection
        const notesRef = collection(db, 'smartNotebook', user.uid, 'practicedNotes')
        const notesQuery = query(notesRef, orderBy('timestamp', 'desc'))
        
        console.log('🔍 Querying path: smartNotebook/' + user.uid + '/practicedNotes')
        const notesSnapshot = await getDocs(notesQuery)
        
        console.log('📊 Documents found:', notesSnapshot.docs.length)
        
        const notes: PracticedNote[] = notesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data()
          console.log('📄 Document ID:', doc.id, 'Data:', data)
          
          return {
            id: doc.id,
            questionId: data.questionId || '',
            questionType: data.questionType || 'qa',
            question: data.question || '',
            studentAnswer: data.studentAnswer || '',
            correctAnswer: data.correctAnswer || '',
            score: data.score || 0,
            maxScore: data.maxScore || 10,
            feedback: '', // We'll get this from AI when displaying
            subject: data.subject || 'General',
            chapter: data.chapter || 'General',
            topic: data.topic || 'General',
            isRetry: data.isRetry || false,
            isImportant: data.isImportant || false,
            isDoubt: data.isDoubt || false,
            isRevision: data.isRevision || false,
            timestamp: data.timestamp
          }
        })
        
        console.log('✅ Loaded', notes.length, 'practiced notes')
        setPracticedNotes(notes)
        setError(null)
      } catch (err) {
        console.error('❌ Error loading practiced notes:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadPracticedNotes()
  }, [user])

  const refreshPracticedNotes = async () => {
    if (!user) return
    
    try {
      console.log('🔄 Refreshing practiced notes...')
      const notesRef = collection(db, 'smartNotebook', user.uid, 'practicedNotes')
      const notesQuery = query(notesRef, orderBy('timestamp', 'desc'))
      const notesSnapshot = await getDocs(notesQuery)
      
      const notes: PracticedNote[] = notesSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
        const data = doc.data()
        return {
          id: doc.id,
          questionId: data.questionId || '',
          questionType: data.questionType || 'qa',
          question: data.question || '',
          studentAnswer: data.studentAnswer || '',
          correctAnswer: data.correctAnswer || '',
          score: data.score || 0,
          maxScore: data.maxScore || 10,
          feedback: '',
          subject: data.subject || 'General',
          chapter: data.chapter || 'General',
          topic: data.topic || 'General',
          isRetry: data.isRetry || false,
          isImportant: data.isImportant || false,
          isDoubt: data.isDoubt || false,
          isRevision: data.isRevision || false,
          timestamp: data.timestamp
        }
      })
      
      console.log('✅ Refreshed:', notes.length, 'practiced notes')
      setPracticedNotes(notes)
    } catch (err) {
      console.error('❌ Error refreshing practiced notes:', err)
    }
  }

  return {
    practicedNotes,
    loading,
    error,
    refreshPracticedNotes
  }
} 