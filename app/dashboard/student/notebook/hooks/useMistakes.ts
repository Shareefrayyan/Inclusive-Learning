import { useEffect, useState } from 'react'
import { subscribeToAllMistakes, addMistake, updateMistake, deleteMistake } from '@/lib/firebase/mistakes'
import { useAuth } from '@/lib/firebase/auth-context'
import { QuerySnapshot, DocumentData } from 'firebase/firestore'

export interface Mistake {
  id: string;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  score: number;
  featureType: string;
  topicId: string;
  createdAt: any;
}

export function useMistakes() {
  const { user } = useAuth()
  const [mistakes, setMistakes] = useState<Mistake[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) return
    setLoading(true)
    const unsubscribe = subscribeToAllMistakes(user.uid, (snap: QuerySnapshot<DocumentData>) => {
      setMistakes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Mistake[])
      setLoading(false)
    })
    return () => unsubscribe && unsubscribe()
  }, [user])

  return {
    mistakes,
    loading,
    error,
    addMistake: (mistake: Omit<Mistake, 'id'>) => user ? addMistake(user.uid, mistake) : Promise.reject('No user'),
    updateMistake: (id: string, updates: Partial<Mistake>) => user ? updateMistake(user.uid, id, updates) : Promise.reject('No user'),
    deleteMistake: (id: string) => user ? deleteMistake(user.uid, id) : Promise.reject('No user')
  }
} 