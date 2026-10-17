import { useEffect, useState } from 'react'
import { subscribeToStickyNotesByTopic, addStickyNote, updateStickyNote, deleteStickyNote } from '@/lib/firebase/stickyNotes'
import { useAuth } from '@/lib/firebase/auth-context'
import { QuerySnapshot, DocumentData } from 'firebase/firestore'

export interface StickyNote {
  id: string;
  text: string;
  topicId: string;
  colorTag?: string;
  createdAt: any;
}

export function useStickyNotes(topicId: string) {
  const { user } = useAuth()
  const [stickyNotes, setStickyNotes] = useState<StickyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user || !topicId) return
    setLoading(true)
    const unsubscribe = subscribeToStickyNotesByTopic(user.uid, topicId, (snap: QuerySnapshot<DocumentData>) => {
      setStickyNotes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as StickyNote[])
      setLoading(false)
    })
    return () => unsubscribe && unsubscribe()
  }, [user, topicId])

  return {
    stickyNotes,
    loading,
    error,
    addStickyNote: (note: Omit<StickyNote, 'id'>) => user ? addStickyNote(user.uid, note) : Promise.reject('No user'),
    updateStickyNote: (id: string, updates: Partial<StickyNote>) => user ? updateStickyNote(user.uid, id, updates) : Promise.reject('No user'),
    deleteStickyNote: (id: string) => user ? deleteStickyNote(user.uid, id) : Promise.reject('No user')
  }
} 