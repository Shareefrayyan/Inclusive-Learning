import { db } from './config'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore'

// Add a new sticky note
export async function addStickyNote(uid, stickyNote) {
  const ref = collection(db, 'users', uid, 'stickyNotes')
  return await addDoc(ref, stickyNote)
}

// Update a sticky note
export async function updateStickyNote(uid, stickyNoteId, updates) {
  const ref = doc(db, 'users', uid, 'stickyNotes', stickyNoteId)
  return await updateDoc(ref, updates)
}

// Delete a sticky note
export async function deleteStickyNote(uid, stickyNoteId) {
  const ref = doc(db, 'users', uid, 'stickyNotes', stickyNoteId)
  return await deleteDoc(ref)
}

// Subscribe to sticky notes for a topic (real-time)
export function subscribeToStickyNotesByTopic(uid, topicId, callback) {
  const ref = collection(db, 'users', uid, 'stickyNotes')
  const q = query(ref, where('topicId', '==', topicId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, callback)
} 