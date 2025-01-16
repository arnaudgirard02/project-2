export interface Exercise {
  id: string;
  title?: string;
  description: string;
  subject: string;
  tags?: string[];
  level: string;
  content: string;
  solution?: string;
  hints?: string[];
  createdAt: Date | { seconds: number; nanoseconds: number };
  userId: string;
  authorName: string;
  type: 'practice' | 'quiz' | 'problem';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: number;
  status?: 'draft' | 'published';
  likes?: number;
  views?: number;
  language: string;
  reports?: {
    id: string;
    userId: string;
    reason: 'inappropriate' | 'unsuitable' | 'incorrect' | 'other';
    details: string;
    createdAt: Date;
    status: 'pending' | 'reviewed' | 'resolved';
  }[];
  resources?: {
    type: 'image' | 'video' | 'document';
    url: string;
    description: string;
  }[];
  prerequisites?: string[];
  learningObjectives?: string[];
  targetSkills?: string[];
  metadata?: {
    lastModified: Date;
    version: number;
    isPublic: boolean;
    likes: string[];
    comments: {
      id: string;
      userId: string;
      authorName: string;
      content: string;
      createdAt: Date;
     editedAt?: string;
    }[];
  };
}

export interface ExerciseFormData {
  topic: string;
  description: string;
  tags: string[];
  subject: string;
  level: string;
  type: 'practice' | 'quiz' | 'problem';
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: string;
  prerequisites: string[];
  learningObjectives: string[];
  targetSkills: string[];
  isPublic: boolean;
  interests?: string[];
}