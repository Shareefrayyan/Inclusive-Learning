import { db } from './config'
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, where, orderBy } from 'firebase/firestore'

// Add a new mistake
export async function addMistake(uid, mistake) {
  const ref = collection(db, 'users', uid, 'mistakes')
  return await addDoc(ref, mistake)
}

// Update a mistake
export async function updateMistake(uid, mistakeId, updates) {
  const ref = doc(db, 'users', uid, 'mistakes', mistakeId)
  return await updateDoc(ref, updates)
}

// Delete a mistake
export async function deleteMistake(uid, mistakeId) {
  const ref = doc(db, 'users', uid, 'mistakes', mistakeId)
  return await deleteDoc(ref)
}

// Subscribe to mistakes for a topic (real-time)
export function subscribeToMistakesByTopic(uid, topicId, callback) {
  const ref = collection(db, 'users', uid, 'mistakes')
  const q = query(ref, where('topicId', '==', topicId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, callback)
}

// Subscribe to all mistakes (real-time)
export function subscribeToAllMistakes(uid, callback) {
  const ref = collection(db, 'users', uid, 'mistakes')
  const q = query(ref, orderBy('createdAt', 'desc'))
  return onSnapshot(q, callback)
} 