import { useEffect, useState } from 'react'
import { subscribeToNotebookNotes, addNotebookNote, updateNotebookNote, deleteNotebookNote } from '@/lib/firebase/notebookNotes'
import { useAuth } from '@/lib/firebase/auth-context'

export function useNotebookNotes() {
  const { user } = useAuth()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    const unsubscribe = subscribeToNotebookNotes(user.uid, (snap) => {
      setNotes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
    return () => unsubscribe && unsubscribe()
  }, [user])

  return {
    notes,
    loading,
    error,
    addNote: (note) => addNotebookNote(user.uid, note),
    updateNote: (id, updates) => updateNotebookNote(user.uid, id, updates),
    deleteNote: (id) => deleteNotebookNote(user.uid, id)
  }
} 