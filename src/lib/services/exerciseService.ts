import { 
  addDoc, 
  deleteDoc,
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp, 
  getDoc, 
  doc, 
  Timestamp,
  updateDoc,
  arrayUnion,
  increment,
  arrayRemove
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { isAdmin } from './adminService';
import { Exercise, ExerciseFormData } from '@/lib/types/exercise';
import { generateExerciseContent } from './openaiService';

export const generateExercise = async (formData: ExerciseFormData, userId: string) => {
  try {
    // Récupérer les informations de l'utilisateur
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const userData = userDoc.data();
    if (!userData?.firstName || !userData?.lastName) {
      throw new Error('User profile incomplete');
    }

    const authorName = `${userData.firstName} ${userData.lastName}`;

    // Ici, vous intégreriez l'appel à votre API d'IA
    const content = await generateExerciseContent(formData);

    const exercise: Omit<Exercise, 'id'> = {
      title: formData.topic,
      description: formData.description,
      subject: formData.subject || '',
      level: formData.level || '',
      content,
      type: formData.type,
      difficulty: formData.difficulty,
      duration: formData.duration,
      createdAt: serverTimestamp(),
      userId,
      authorName,
      status: 'published',
      likes: 0,
      views: 0,
      language: 'fr',
      metadata: {
        lastModified: serverTimestamp(),
        likes: [],
        comments: [],
        version: 1,
        isPublic: true
      },
      tags: [formData.subject.toLowerCase(), formData.level.toLowerCase(), formData.type]
    };

    const exercisesRef = collection(db, 'exercises');
    await addDoc(exercisesRef, exercise);
  } catch (error) {
    console.error('Error generating exercise:', error instanceof Error ? error.message : error);
    throw error;
  }
};

export const getUserExercises = async (userId: string): Promise<Exercise[]> => {
  try {
    const q = query(
      collection(db, 'exercises'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Gestion sécurisée des timestamps
      const createdAt = data.createdAt?.toDate?.() || new Date();
      const lastModified = data.metadata?.lastModified?.toDate?.() || new Date();
      return {
        id: doc.id,
        ...data,
        createdAt: createdAt,
        metadata: {
          ...data.metadata,
          lastModified: lastModified,
        }
      } as Exercise;
    });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
};

export const getAllExercises = async (limitCount = 20): Promise<Exercise[]> => {
  try {
    const q = query(
      collection(db, 'exercises'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const exercises = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Convert Firestore Timestamp to Date
      const createdAt = data.createdAt instanceof Timestamp ? 
        data.createdAt.toDate() : 
        new Date(data.createdAt);

      const metadata = {
        ...data.metadata,
        lastModified: data.metadata?.lastModified instanceof Timestamp ? 
          data.metadata.lastModified.toDate() : 
          new Date(data.metadata.lastModified),
        version: data.metadata?.version || 1,
        isPublic: data.metadata?.isPublic ?? true
      };

      return {
        id: doc.id,
        ...data,
        createdAt,
        metadata,
        // Valeurs par défaut pour les champs obligatoires
        status: data.status || 'published',
        likes: data.likes || 0,
        views: data.views || 0,
        language: data.language || 'fr',
        type: data.type || 'practice',
        difficulty: data.difficulty || 'medium',
        duration: data.duration || 15,
        title: data.topic || data.title || "Exercice sans titre"
      } as Exercise;
    });
    return exercises;

  } catch (error) {
    console.error('Error fetching exercises:', error);
    console.error('Error details:', error instanceof Error ? error.message : error);
    return [];
  }
};

import { checkSubscriptionLimits, decrementSubscriptionLimit } from './subscriptionService';

export const getExerciseById = async (id: string): Promise<Exercise | null> => {
  try {
    const docRef = doc(db, 'exercises', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      return null;
    }

    // Get current user
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Check subscription limits
    const hasAccess = await checkSubscriptionLimits(user.uid, 'view');
    if (!hasAccess) {
      throw new Error('subscription_limit_reached');
    }

    // Decrement view count only after confirming access
    await decrementSubscriptionLimit(user.uid, 'view');

    const data = docSnap.data();
    const metadata = {
      ...data.metadata,
      lastModified: data.metadata?.lastModified instanceof Timestamp ? 
        data.metadata.lastModified.toDate() : 
        new Date(data.metadata?.lastModified || Date.now()),
      likes: data.metadata?.likes || [],
      comments: data.metadata?.comments || [],
      version: data.metadata?.version || 1,
      isPublic: data.metadata?.isPublic ?? true
    };

    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt instanceof Timestamp ? 
        data.createdAt.toDate() : 
        new Date(data.createdAt || Date.now()),
      metadata,
      status: data.status || 'published',
      likes: data.likes || 0,
      views: data.views || 0,
      language: data.language || 'fr',
      type: data.type || 'practice',
      difficulty: data.difficulty || 'medium',
      duration: data.duration || 15,
      title: data.topic || data.title || "Exercice sans titre"
    } as Exercise;
  } catch (error) {
    console.error('Error fetching exercise:', error);
    throw error;
  }
};

export const toggleLike = async (exerciseId: string, userId: string) => {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  
  try {
    const exerciseDoc = await getDoc(exerciseRef);
    if (!exerciseDoc.exists()) {
      throw new Error('Exercise not found');
    }

    const data = exerciseDoc.data();
    const metadata = data?.metadata || { likes: [], comments: [] };
    const likes = metadata.likes || [];
    const isLiked = likes.includes(userId);
    
    const newLikes = isLiked
      ? likes.filter((id: string) => id !== userId)
      : [...likes, userId];

    await updateDoc(exerciseRef, {
      'metadata.likes': newLikes
    });

    return newLikes;
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
};

export const addComment = async (exerciseId: string, userId: string, content: string) => {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  
  try {
    const exerciseDoc = await getDoc(exerciseRef);
    if (!exerciseDoc.exists()) {
      throw new Error('Exercise not found');
    }

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    const userData = userDoc.data();
    if (!userData?.firstName || !userData?.lastName) {
      throw new Error('User profile incomplete');
    }

    const authorName = `${userData.firstName} ${userData.lastName}`;

    const comment = {
      id: crypto.randomUUID(),
      userId,
      exerciseId,
      authorName,
      content,
      createdAt: new Date().toISOString()
    };

    await updateDoc(exerciseRef, {
      'metadata.comments': arrayUnion(comment),
      'metadata.lastModified': serverTimestamp()
    });
    
    return comment;

  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const updateComment = async (
  exerciseId: string,
  commentId: string,
  userId: string,
  newContent: string
) => {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  
  try {
    const exerciseDoc = await getDoc(exerciseRef);
    if (!exerciseDoc.exists()) {
      throw new Error('Exercise not found');
    }
    
    const data = exerciseDoc.data();
    const comments = data.metadata?.comments || [];
    const existingComment = comments.find(
      (c: { id: string; exerciseId: string }) => 
      c.id === commentId && c.exerciseId === exerciseId
    );

    if (!existingComment) {
      throw new Error('Comment not found');
    }

    if (existingComment.userId !== userId) {
      throw new Error('Unauthorized');
    }

    const updatedComment = {
      ...existingComment,
      content: newContent,
      editedAt: new Date().toISOString(),
      exerciseId
    };

    const updatedComments = comments.map(c => 
      c.id === commentId ? updatedComment : c
    );

    await updateDoc(exerciseRef, {
      'metadata.comments': updatedComments,
      'metadata.lastModified': serverTimestamp()
    });

    return updatedComment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const updateExercise = async (exerciseId: string, userId: string, updates: Partial<Exercise>) => {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  
  try {
    const exerciseDoc = await getDoc(exerciseRef);
    if (!exerciseDoc.exists()) {
      throw new Error('Exercise not found');
    }

    // Check if user is admin or exercise owner
    const currentUser = auth.currentUser;
    if (!currentUser?.email || (!isAdmin(currentUser.email) && exerciseDoc.data().userId !== userId)) {
      throw new Error('Unauthorized');
    }

    await updateDoc(exerciseRef, {
      ...updates,
      'metadata.lastModified': serverTimestamp(),
      'metadata.version': increment(1)
    });
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw error;
  }
};

export const deleteExercise = async (exerciseId: string, userId: string) => {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  
  try {
    const exerciseDoc = await getDoc(exerciseRef);
    if (!exerciseDoc.exists()) {
      throw new Error('Exercise not found');
    }

    if (exerciseDoc.data().userId !== userId) {
      throw new Error('Unauthorized');
    }

    await deleteDoc(exerciseRef);
  } catch (error) {
    console.error('Error deleting exercise:', error);
    throw error;
  }
};

export const deleteComment = async (exerciseId: string, commentId: string, userId: string) => {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  
  try {
    const exerciseDoc = await getDoc(exerciseRef);
    if (!exerciseDoc.exists()) {
      throw new Error('Exercise not found');
    }

    const data = exerciseDoc.data();
    const comments = data.metadata?.comments || [];
    const comment = comments.find((c: { id: string; userId: string }) => 
      c.id === commentId && c.userId === userId
    );

    if (!comment) {
      throw new Error('Comment not found or unauthorized');
    }

    const updatedComments = comments.filter((c: { id: string }) => c.id !== commentId);

    await updateDoc(exerciseRef, {
      'metadata.comments': updatedComments,
      'metadata.lastModified': serverTimestamp()
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

export const getExerciseStats = async (userId: string) => {
  try {
    const exercises = await getUserExercises(userId);
    
    // Statistiques de base
    const totalExercises = exercises.length;
    const totalDuration = exercises.reduce((acc, ex) => acc + (ex.duration || 0), 0);
    
    // Calcul des likes, vues et commentaires
    const totalLikes = exercises.reduce((acc, ex) => acc + (ex.metadata?.likes?.length || 0), 0);
    const totalViews = exercises.reduce((acc, ex) => acc + (ex.views || 0), 0);
    const totalComments = exercises.reduce((acc, ex) => acc + (ex.metadata?.comments?.length || 0), 0);
    
    // Moyennes
    const avgLikes = totalExercises ? totalLikes / totalExercises : 0;
    const avgViews = totalExercises ? totalViews / totalExercises : 0;
    const avgComments = totalExercises ? totalComments / totalExercises : 0;
    
    // Exercices populaires (plus de likes)
    const trendingExercises = [...exercises]
      .sort((a, b) => (b.metadata?.likes?.length || 0) - (a.metadata?.likes?.length || 0))
      .slice(0, 3);

    return {
      totalExercises,
      totalDuration,
      totalLikes,
      totalViews,
      totalComments,
      avgLikes,
      avgViews,
      avgComments,
      trendingExercises
    };
  } catch (error) {
    console.error('Error getting exercise stats:', error);
    throw error;
  }
};

export const reportExercise = async (
  exerciseId: string,
  userId: string,
  reason: string,
  details: string
) => {
  const exerciseRef = doc(db, 'exercises', exerciseId);
  
  try {
    const exerciseDoc = await getDoc(exerciseRef);
    if (!exerciseDoc.exists()) {
      throw new Error('Exercise not found');
    }

    const report = {
      id: crypto.randomUUID(),
      userId,
      reason,
      details,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    await updateDoc(exerciseRef, {
      reports: arrayUnion(report)
    });

    return report;
  } catch (error) {
    console.error('Error reporting exercise:', error);
    throw error;
  }
};