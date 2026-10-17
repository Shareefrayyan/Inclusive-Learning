import { 
  collection, 
  doc, 
  addDoc,
  setDoc,
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  DocumentReference
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { UserProfile } from './authService';

// Types for school app data

export interface School {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  website?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  schoolId: string;
  teacherId: string;
  students: string[]; // Array of student UIDs
  subjects: string[]; // Array of subject IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Subject {
  id: string;
  name: string;
  description?: string;
  schoolId: string;
  teacherId: string;
  classIds: string[]; // Array of class IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  dueDate: Timestamp;
  points: number;
  attachmentUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: Timestamp;
  attachmentUrl?: string;
  notes?: string;
  score?: number;
  feedback?: string;
  gradedAt?: Timestamp;
  gradedBy?: string;
}

export interface StudyMaterial {
  id: string;
  title: string;
  description?: string;
  subjectId: string;
  classId: string;
  teacherId: string;
  contentType: 'document' | 'video' | 'quiz' | 'flashcards';
  content: any; // Structured content (questions, answers, etc.)
  attachmentUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Performance {
  id: string;
  studentId: string;
  subjectId: string;
  assignmentId?: string;
  quizId?: string;
  score: number;
  maxScore: number;
  date: Timestamp;
  notes?: string;
}

// CRUD Operations for Schools

export const createSchool = async (schoolData: Omit<School, 'id' | 'createdAt' | 'updatedAt'>): Promise<School> => {
  try {
    const timestamp = Timestamp.now();
    const schoolRef = await addDoc(collection(db, 'schools'), {
      ...schoolData,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    const newSchool: School = {
      id: schoolRef.id,
      ...schoolData,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    return newSchool;
  } catch (error) {
    console.error('Error creating school:', error);
    throw error;
  }
};

export const getSchool = async (schoolId: string): Promise<School | null> => {
  try {
    const schoolDoc = await getDoc(doc(db, 'schools', schoolId));
    if (schoolDoc.exists()) {
      return { id: schoolDoc.id, ...schoolDoc.data() } as School;
    }
    return null;
  } catch (error) {
    console.error('Error getting school:', error);
    throw error;
  }
};

export const updateSchool = async (schoolId: string, schoolData: Partial<School>): Promise<void> => {
  try {
    await updateDoc(doc(db, 'schools', schoolId), {
      ...schoolData,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error updating school:', error);
    throw error;
  }
};

// CRUD Operations for Classes

export const createClass = async (classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class> => {
  try {
    const timestamp = Timestamp.now();
    const classRef = await addDoc(collection(db, 'classes'), {
      ...classData,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    const newClass: Class = {
      id: classRef.id,
      ...classData,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    return newClass;
  } catch (error) {
    console.error('Error creating class:', error);
    throw error;
  }
};

export const getClass = async (classId: string): Promise<Class | null> => {
  try {
    const classDoc = await getDoc(doc(db, 'classes', classId));
    if (classDoc.exists()) {
      return { id: classDoc.id, ...classDoc.data() } as Class;
    }
    return null;
  } catch (error) {
    console.error('Error getting class:', error);
    throw error;
  }
};

export const getClassesBySchool = async (schoolId: string): Promise<Class[]> => {
  try {
    const classesQuery = query(
      collection(db, 'classes'),
      where('schoolId', '==', schoolId),
      orderBy('name')
    );
    
    const classesSnapshot = await getDocs(classesQuery);
    return classesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Class);
  } catch (error) {
    console.error('Error getting classes by school:', error);
    throw error;
  }
};

export const getClassesByTeacher = async (teacherId: string): Promise<Class[]> => {
  try {
    const classesQuery = query(
      collection(db, 'classes'),
      where('teacherId', '==', teacherId),
      orderBy('name')
    );
    
    const classesSnapshot = await getDocs(classesQuery);
    return classesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Class);
  } catch (error) {
    console.error('Error getting classes by teacher:', error);
    throw error;
  }
};

// CRUD Operations for Subjects

export const createSubject = async (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>): Promise<Subject> => {
  try {
    const timestamp = Timestamp.now();
    const subjectRef = await addDoc(collection(db, 'subjects'), {
      ...subjectData,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    const newSubject: Subject = {
      id: subjectRef.id,
      ...subjectData,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    return newSubject;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
};

// CRUD Operations for Assignments

export const createAssignment = async (assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>, file?: File): Promise<Assignment> => {
  try {
    let attachmentUrl = assignmentData.attachmentUrl;
    
    // Upload file if provided
    if (file) {
      const storageRef = ref(storage, `assignments/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      attachmentUrl = await getDownloadURL(storageRef);
    }
    
    const timestamp = Timestamp.now();
    const assignmentRef = await addDoc(collection(db, 'assignments'), {
      ...assignmentData,
      attachmentUrl,
      createdAt: timestamp,
      updatedAt: timestamp
    });
    
    const newAssignment: Assignment = {
      id: assignmentRef.id,
      ...assignmentData,
      attachmentUrl,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    return newAssignment;
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

// Get student performance data
export const getStudentPerformance = async (studentId: string): Promise<Performance[]> => {
  try {
    const performanceQuery = query(
      collection(db, 'performance'),
      where('studentId', '==', studentId),
      orderBy('date', 'desc')
    );
    
    const performanceSnapshot = await getDocs(performanceQuery);
    return performanceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Performance);
  } catch (error) {
    console.error('Error getting student performance:', error);
    throw error;
  }
};

// Submit an assignment
export const submitAssignment = async (submissionData: Omit<Submission, 'id' | 'submittedAt'>, file?: File): Promise<Submission> => {
  try {
    let attachmentUrl = submissionData.attachmentUrl;
    
    // Upload file if provided
    if (file) {
      const storageRef = ref(storage, `submissions/${submissionData.studentId}/${submissionData.assignmentId}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      attachmentUrl = await getDownloadURL(storageRef);
    }
    
    const submittedAt = Timestamp.now();
    const submissionRef = await addDoc(collection(db, 'submissions'), {
      ...submissionData,
      attachmentUrl,
      submittedAt
    });
    
    const newSubmission: Submission = {
      id: submissionRef.id,
      ...submissionData,
      attachmentUrl,
      submittedAt
    };
    
    return newSubmission;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
}; 