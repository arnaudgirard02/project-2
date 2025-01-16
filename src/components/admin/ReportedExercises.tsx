import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, Loader2, ExternalLink, Trash2 } from "lucide-react";
import { Exercise } from "@/lib/types/exercise";
import { Link } from "react-router-dom";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ReportedExercisesProps {
  exercises: Exercise[];
  loading: boolean;
  onDelete: (exerciseId: string) => Promise<void>;
}

export function ReportedExercises({ exercises, loading, onDelete }: ReportedExercisesProps) {
  const [deletingExercise, setDeletingExercise] = useState<Exercise | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingExercise) return;
    setDeleteLoading(true);
    try {
      await onDelete(deletingExercise.id);
      setDeletingExercise(null);
    } catch (error) {
      console.error("Error deleting exercise:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'inappropriate':
        return 'Contenu inapproprié';
      case 'unsuitable':
        return 'Contenu inadapté';
      case 'incorrect':
        return 'Solution incorrecte';
      default:
        return 'Autre';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Flag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun signalement</h3>
          <p className="text-muted-foreground">
            Il n'y a actuellement aucun exercice signalé à modérer.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {exercises.map((exercise) => (
        <Card key={exercise.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                {exercise.title || exercise.topic || "Exercice sans titre"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Link to={`/exercises/${exercise.id}`} target="_blank">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Voir l'exercice
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeletingExercise(exercise)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Par {exercise.authorName}</span>
                <span>•</span>
                <span>Niveau {exercise.level}</span>
                <span>•</span>
                <span>{exercise.subject}</span>
              </div>

              <div className="space-y-4">
                {exercise.reports?.map((report) => (
                  <div
                    key={report.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {getReasonLabel(report.reason)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(report.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <p className="text-sm">{report.details}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {deletingExercise && (
        <DeleteDialog
          title="Supprimer l'exercice"
          description="Êtes-vous sûr de vouloir supprimer cet exercice ? Cette action est irréversible."
          isOpen={true}
          loading={deleteLoading}
          onClose={() => setDeletingExercise(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}