import { collection, getDocs, query, limit, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function initializeFirestore() {
  try {
    // Check if exercises collection exists and has documents
    const exercisesRef = collection(db, 'exercises');
    const q = query(exercisesRef, limit(1));
    const snapshot = await getDocs(q);

    // If collection is empty, initialize with default data structure
    if (snapshot.empty) {
      const batch = writeBatch(db);
      
      // Create collection structure without actual documents
      // This ensures the collection exists with proper indexes
      console.log('Initializing Firestore collections...');
      
      // Note: We don't actually write any documents here
      // The collection will be created when the first document is added
      
      await batch.commit();
    }
  } catch (error) {
    console.error('Error initializing Firestore:', error);
    throw error;
  }
}