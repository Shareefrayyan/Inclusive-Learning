import { db } from './config'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore'

// Add a new practiced note
export async function addPracticedNote(uid, practicedNote) {
  const ref = collection(db, 'users', uid, 'practicedNotes')
  return await addDoc(ref, practicedNote)
}

// Update a practiced note
export async function updatePracticedNote(uid, practicedNoteId, updates) {
  const ref = doc(db, 'users', uid, 'practicedNotes', practicedNoteId)
  return await updateDoc(ref, updates)
}

// Delete a practiced note
export async function deletePracticedNote(uid, practicedNoteId) {
  const ref = doc(db, 'users', uid, 'practicedNotes', practicedNoteId)
  return await deleteDoc(ref)
}

// Get practiced notes for a topic (on-demand)
export async function getPracticedNotesByTopic(uid, topicId) {
  const ref = collection(db, 'users', uid, 'practicedNotes')
  const q = query(ref, where('topicId', '==', topicId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// Get all practiced notes (on-demand)
export async function getAllPracticedNotes(uid) {
  const ref = collection(db, 'users', uid, 'practicedNotes')
  const q = query(ref, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }))
} 