import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Exercise } from "@/lib/types/exercise";
import { ExerciseGuard } from "@/components/exercises/ExerciseGuard";
import { getExerciseById, updateExercise, deleteExercise, reportExercise } from "@/lib/services/exerciseService";
import { deleteExerciseAsAdmin } from "@/lib/services/adminService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LikeButton } from "@/components/exercises/LikeButton";
import { CommentSection } from "@/components/exercises/CommentSection";
import { EditDialog } from "@/components/shared/EditDialog";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { ReportDialog } from "@/components/exercises/ReportDialog";
import { CollapsibleSection } from "@/components/exercises/CollapsibleSection";
import { ArrowLeft, Clock, BookOpen, Pencil, Trash2, Flag, HelpCircle, Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, isAdmin } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function ExerciseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  const handleLikeToggle = (newLikes: string[]) => {
    if (exercise) {
      setExercise({
        ...exercise,
        metadata: {
          ...exercise.metadata,
          likes: newLikes
        }
      });
    }
  };

  const handleCommentAdded = (newComment: any) => {
    if (exercise) {
      const existingComments = exercise.metadata?.comments || [];
      const updatedComments = existingComments.map(comment =>
        comment.id === newComment.id ? newComment : comment
      );
      
      if (!updatedComments.find(comment => comment.id === newComment.id)) {
        updatedComments.push(newComment);
      }

      setExercise({
        ...exercise,
        metadata: {
          ...exercise.metadata,
          comments: updatedComments
        }
      });
    }
  };

  const handleEditExercise = async (newContent: string) => {
    if (!exercise || !user) return;
    
    try {
      await updateExercise(exercise.id, user.uid, { content: newContent });
      setExercise({
        ...exercise,
        content: newContent,
        metadata: {
          ...exercise.metadata,
          lastModified: new Date()
        }
      });
      toast({
        title: "Exercice modifié",
        description: "L'exercice a été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'exercice",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!exercise || !user) return;
    
    setLoading(true);
    try {
      if (isAdmin(user.email || '')) {
        await deleteExerciseAsAdmin(exercise.id);
      } else {
        await deleteExercise(exercise.id, user.uid);
      }
      toast({
        title: "Exercice supprimé",
        description: "L'exercice a été supprimé avec succès",
      });
      navigate("/exercises");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'exercice",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (reason: string, details: string) => {
    if (!exercise || !user) return;
    
    try {
      await reportExercise(exercise.id, user.uid, reason, details);
      toast({
        title: "Signalement envoyé",
        description: "Merci de nous avoir signalé cet exercice. Nous allons l'examiner.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le signalement",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadExercise = async () => {
      if (!id) return;
      try {
        const data = await getExerciseById(id);
        setExercise(data);
      } catch (err) {
        console.error("Error loading exercise:", err);
        if (err instanceof Error && err.message === 'subscription_limit_reached') {
          setError('subscription_limit');
        } else {
          setError('not_found');
        }
      } finally {
        setLoading(false);
      }
    };

    loadExercise();
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-32 mb-8" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (exercise) {
    return (
      <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-8">
        <ExerciseGuard action="view">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/exercises")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux exercices
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReporting(true)}
              >
                <Flag className="mr-2 h-4 w-4" />
                Signaler
              </Button>
              {(exercise.userId === user?.uid || isAdmin(user?.email || '')) && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setIsDeleting(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer l'exercice
              </Button>
              )}
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            {exercise.title || exercise.topic || "Exercice sans titre"}
          </h1>
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{exercise.duration} minutes</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="capitalize">{exercise.level}</span>
              </div>
            </div>
            <LikeButton
              exerciseId={exercise.id}
              initialLikes={exercise.metadata?.likes || []}
              onLikeToggle={handleLikeToggle}
            />
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{exercise.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contenu de l'exercice</CardTitle>
              {(exercise.userId === user?.uid || (user?.email && isAdmin(user.email))) && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none dark:prose-invert space-y-4">
                {exercise.content.split('\n').map((line, index) => {
                  // Ignorer les lignes vides
                  if (!line.trim()) {
                    return null;
                  }
                  
                  // Titres avec **
                  if (line.startsWith('**') && line.endsWith('**')) {
                    return (
                      <h3 key={index} className="text-lg font-bold">
                        {line.replace(/^\*\*|\*\*$/g, '')}
                      </h3>
                    );
                  }
                  
                  // Lignes commençant par >
                  if (line.startsWith('>')) {
                    return (
                      <div key={index} className="pl-4 border-l-2 border-primary/20">
                        {line.substring(1).trim()}
                      </div>
                    );
                  }
                  
                  // Lignes commençant par un nombre suivi d'un point
                  if (line.match(/^\d+\./)) {
                    return (
                      <div key={index} className="flex gap-2">
                        <span className="font-medium">{line.match(/^\d+\./)[0]}</span>
                        <span>{line.replace(/^\d+\./, '').trim()}</span>
                      </div>
                    );
                  }
                  
                  // Texte normal
                  return <p key={index}>{line}</p>;
                })}
              </div>
            </CardContent>
          </Card>

          {exercise.hints && exercise.hints.length > 0 && (
            <CollapsibleSection
              title="Indices"
              icon={<HelpCircle className="h-5 w-5" />}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert space-y-2 pt-2">
                {exercise.hints.map((hint, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="font-medium">{index + 1}.</span>
                    <span>{hint}</span>
                  </div>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {exercise.solution && (
            <CollapsibleSection
              title="Solution"
              icon={<Lightbulb className="h-5 w-5" />}
            >
              <div className="prose prose-sm max-w-none dark:prose-invert bg-muted p-4 rounded-lg mt-2">
                {exercise.solution.split('\n').map((line, index) => (
                  <p key={index} className="my-1">{line}</p>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {isEditing && exercise && (
            <EditDialog
              title="Modifier l'exercice"
              content={exercise.content}
              isOpen={true}
              onClose={() => setIsEditing(false)}
              onSave={handleEditExercise}
            />
          )}

          {isDeleting && (
            <DeleteDialog
              title="Supprimer l'exercice"
              description="Êtes-vous sûr de vouloir supprimer cet exercice ? Cette action est irréversible et supprimera également tous les commentaires associés."
              isOpen={true}
              onClose={() => setIsDeleting(false)}
              onConfirm={handleDelete}
            />
          )}
          
          {isReporting && (
            <ReportDialog
              isOpen={true}
              onClose={() => setIsReporting(false)}
              onSubmit={handleReport}
            />
          )}

          <Card>
            <CardContent className="pt-6">
              <CommentSection
                exerciseId={exercise.id}
                comments={exercise.metadata?.comments || []}
                onCommentAdded={handleCommentAdded}
              />
            </CardContent>
          </Card>
        </div>
        </ExerciseGuard>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 lg:px-8 py-8">
      <Card>
        <CardContent className="text-center py-8">
          <h2 className="text-xl font-semibold mb-2">Exercice non trouvé</h2>
          <p className="text-muted-foreground mb-4">
            L'exercice que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <Button onClick={() => navigate("/exercises")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux exercices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}