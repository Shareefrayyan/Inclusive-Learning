import { db } from './config'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore'

// Add a new notebook note
export async function addNotebookNote(uid, note) {
  const ref = collection(db, 'users', uid, 'notebookNotes')
  return await addDoc(ref, note)
}

// Update a notebook note
export async function updateNotebookNote(uid, noteId, updates) {
  const ref = doc(db, 'users', uid, 'notebookNotes', noteId)
  return await updateDoc(ref, updates)
}

// Delete a notebook note
export async function deleteNotebookNote(uid, noteId) {
  const ref = doc(db, 'users', uid, 'notebookNotes', noteId)
  return await deleteDoc(ref)
}

// Subscribe to all notebook notes (real-time)
export function subscribeToNotebookNotes(uid, callback) {
  const ref = collection(db, 'users', uid, 'notebookNotes')
  const q = query(ref, orderBy('updatedAt', 'desc'))
  return onSnapshot(q, callback)
} 