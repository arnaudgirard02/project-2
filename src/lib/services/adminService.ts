import { collection, getDocs, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { Exercise } from '@/lib/types/exercise';
import { writeBatch } from 'firebase/firestore';

interface UserWithExercises {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  subject: string;
  level: string;
  exercisesCount: number;
}

export const isAdmin = (email: string) => {
  return email === 'arnaud7.girard@hotmail.fr';
};

export const deleteExerciseAsAdmin = async (exerciseId: string) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser?.email || !isAdmin(currentUser.email)) {
      throw new Error('Unauthorized: Only admins can perform this action');
    }

    const exerciseRef = doc(db, 'exercises', exerciseId);
    const exerciseDoc = await getDoc(exerciseRef);
    
    if (!exerciseDoc.exists()) {
      throw new Error('Exercise not found');
    }

    await deleteDoc(exerciseRef);
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
};

export const deleteExercisesByAuthors = async (authorNames: string[]) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser?.email || !isAdmin(currentUser.email)) {
      throw new Error('Unauthorized: Only admins can perform this action');
    }

    const exercisesRef = collection(db, 'exercises');
    const q = query(exercisesRef, where('authorName', 'in', authorNames));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return snapshot.size; // Return number of deleted exercises
  } catch (error) {
    console.error('Error deleting exercises:', error);
    throw error;
  }
};

export const getUsers = async () => {
  const usersRef = collection(db, 'users');
  const exercisesRef = collection(db, 'exercises');
  
  const [usersSnapshot, exercisesSnapshot] = await Promise.all([
    getDocs(usersRef),
    getDocs(exercisesRef)
  ]);

  // Count exercises per user
  const exercisesByUser = exercisesSnapshot.docs.reduce((acc, doc) => {
    const userId = doc.data().userId;
    acc[userId] = (acc[userId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    exercisesCount: exercisesByUser[doc.id] || 0
  })) as UserWithExercises[];
};

export const getGlobalStats = async () => {
  const exercisesRef = collection(db, 'exercises');
  const usersRef = collection(db, 'users');
  
  const [exercisesSnapshot, usersSnapshot] = await Promise.all([
    getDocs(exercisesRef),
    getDocs(usersRef)
  ]);

  const teacherQuery = query(usersRef, where('role', '==', 'teacher'));
  const teachersSnapshot = await getDocs(teacherQuery);

  return {
    totalExercises: exercisesSnapshot.size,
    totalUsers: usersSnapshot.size,
    totalTeachers: teachersSnapshot.size,
    totalStudents: usersSnapshot.size - teachersSnapshot.size,
  };
};

export const getReportedExercises = async () => {
  try {
    const exercisesRef = collection(db, 'exercises');
    const q = query(
      exercisesRef,
      where('reports', '!=', null)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Exercise[];
  } catch (error) {
    console.error('Error fetching reported exercises:', error);
    return [];
  }
};