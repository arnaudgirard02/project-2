import { ExerciseForm } from "@/components/exercises/ExerciseForm";
import { ExerciseGuard } from "@/components/exercises/ExerciseGuard";

export function CreateExercise() {
  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Créer un exercice</h1>
        <p className="text-muted-foreground mt-1">
          Utilisez l'IA pour générer un exercice personnalisé
        </p>
      </div>

      <ExerciseGuard action="create">
      <ExerciseForm />
      </ExerciseGuard>
    </div>
  );
}