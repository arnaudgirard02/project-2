import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Papa from 'papaparse';

interface CsvExercise {
  authorName: string;
  content: string;
  title: string;
  createdAt: string;
  description: string;
  difficulty: string;
  duration: number;
  language: string;
  level: string;
  likes: number;
  'metadata.isPublic': boolean;
  'metadata.lastModified': string;
  'metadata.version': number;
  status: string;
  subject: string;
  'tags.0': string;
  'tags.1': string;
  'tags.2': string;
  type: string;
  userId: string;
  views: number;
}

export function CsvUpload() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const processExercise = (exercise: CsvExercise) => {
    // Validate and sanitize required fields
    if (!exercise.content || !exercise.userId || !exercise.authorName) {
      throw new Error(`Missing required fields for exercise by ${exercise.authorName}`);
    }

    // Ensure all numbers are valid
    const duration = parseInt(String(exercise.duration)) || 15;
    const likes = parseInt(String(exercise.likes)) || 0;
    const views = parseInt(String(exercise.views)) || 0;
    const version = parseInt(String(exercise['metadata.version'])) || 1;

    // Validate dates
    const createdAt = exercise.createdAt ? new Date(exercise.createdAt) : new Date();
    const lastModified = exercise['metadata.lastModified'] 
      ? new Date(exercise['metadata.lastModified']) 
      : new Date();

    // Validate enums
    const validDifficulties = ['easy', 'medium', 'hard'];
    const normalizedDifficulty = exercise.difficulty?.toLowerCase().trim();
    const difficulty = validDifficulties.includes(normalizedDifficulty)
      ? normalizedDifficulty
      : 'medium';

    const validTypes = ['practice', 'quiz', 'problem'];
    const normalizedType = exercise.type?.toLowerCase().trim();
    const type = validTypes.includes(normalizedType)
      ? normalizedType
      : 'practice';

    return {
      authorName: exercise.authorName,
      content: exercise.content,
      title: exercise.title || exercise.description,
      createdAt,
      description: exercise.description,
      difficulty,
      duration,
      language: exercise.language || 'fr',
      level: exercise.level,
      likes,
      metadata: {
        isPublic: Boolean(exercise['metadata.isPublic']),
        lastModified,
        version,
        likes: [],
        comments: []
      },
      status: exercise.status || 'published',
      subject: exercise.subject,
      tags: [
        exercise['tags.0'],
        exercise['tags.1'],
        exercise['tags.2']
      ].filter(Boolean),
      type,
      userId: exercise.userId,
      views
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          const exercises = results.data as CsvExercise[];
          const exercisesRef = collection(db, 'exercises');
          
          if (exercises.length === 0) {
            throw new Error('No exercises found in CSV file');
          }

          let successCount = 0;
          let errorCount = 0;

          for (const exercise of exercises) {
            try {
              const processedExercise = processExercise(exercise);
              await addDoc(exercisesRef, processedExercise);
              successCount++;
            } catch (error) {
              console.error('Error adding exercise:', exercise.authorName, error);
              errorCount++;
            }
          }

          toast({
            title: "Import terminé",
            description: `${successCount} exercices importés avec succès. ${errorCount} erreurs.`,
            variant: errorCount > 0 ? "destructive" : "default",
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Une erreur inconnue est survenue';
          toast({
            title: "Erreur",
            description: errorMessage,
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        toast({
          title: "Erreur",
          description: "Impossible de lire le fichier CSV",
          variant: "destructive",
        });
        setLoading(false);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Import CSV
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Importez un fichier CSV contenant des exercices. Le fichier doit contenir les colonnes suivantes : authorName, content, title, createdAt, description, difficulty, duration, language, level, likes, metadata.isPublic, metadata.lastModified, metadata.version, status, subject, tags.0, tags.1, tags.2, type, userId, views
          </p>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => document.getElementById('csv-upload')?.click()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Import en cours...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Sélectionner un fichier CSV
                </>
              )}
            </Button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}