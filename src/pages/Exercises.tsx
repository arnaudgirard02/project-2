import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Exercise } from "@/lib/types/exercise";
import { getAllExercises, getUserExercises } from "@/lib/services/exerciseService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExerciseFilters, ExerciseFilters as FilterType } from "@/components/exercises/ExerciseFilters";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function Exercises() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [myExercises, setMyExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [filteredMyExercises, setFilteredMyExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    subject: "",
    level: "",
    difficulty: "",
    duration: "",
  });

  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setFilters(prev => ({
            ...prev,
            subject: userData.subject || "",
            level: userData.level || "",
          }));
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    };
    loadUserPreferences();
  }, [user]);

  useEffect(() => {
    const loadExercises = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const userExercises = await getAllExercises();
        const personalExercises = await getUserExercises(user.uid);
        setExercises(userExercises);
        setMyExercises(personalExercises);
        setFilteredExercises(userExercises);
        setFilteredMyExercises(personalExercises);
      } catch (err) {
        console.error("Error loading exercises:", err);
        setError(
          err instanceof Error 
            ? err.message 
            : "Impossible de charger les exercices. Veuillez réessayer."
        );
      } finally {
        setLoading(false);
      }
    };

    loadExercises();
  }, [user]);

  useEffect(() => {
    const applyFilters = (exerciseList: Exercise[]) => {
      return exerciseList.filter((exercise) => {
        const matchesSearch = filters.search
          ? (exercise.title?.toLowerCase() || "").includes(filters.search.toLowerCase()) ||
            exercise.description.toLowerCase().includes(filters.search.toLowerCase())
          : true;
        
        const matchesSubject = filters.subject
          ? filters.subject === "all" || exercise.subject.toLowerCase() === filters.subject
          : true;

        const matchesLevel = filters.level
          ? filters.level === "all" || exercise.level.toLowerCase() === filters.level
          : true;

        const matchesDifficulty = filters.difficulty
          ? filters.difficulty === "all" || exercise.difficulty === filters.difficulty
          : true;

        const matchesDuration = filters.duration
          ? filters.duration === "all" || exercise.duration <= parseInt(filters.duration)
          : true;

        return matchesSearch && matchesSubject && matchesLevel && 
               matchesDifficulty && matchesDuration;
      });
    };

    setFilteredExercises(applyFilters(exercises));
    setFilteredMyExercises(applyFilters(myExercises));
  }, [filters, exercises, myExercises]);

  if (error) {
    return (
      <Card className="mx-auto max-w-2xl mt-8 p-6">
        <CardContent className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Historique des exercices</h1>
        <Link to="/create-exercise">
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel exercice
          </Button>
        </Link>
      </div>

      <ExerciseFilters
        filters={filters}
        onFilterChange={setFilters}
        className="mb-8"
      />

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tous les exercices</TabsTrigger>
          <TabsTrigger value="my">Mes exercices</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          {renderExercisesList(filteredExercises, loading, navigate)}
        </TabsContent>
        <TabsContent value="my">
          {renderExercisesList(filteredMyExercises, loading, navigate)}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function renderExercisesList(exercisesList: Exercise[], loading: boolean, navigate: ReturnType<typeof useNavigate>) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (exercisesList.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent>
          <History className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun exercice</h3>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore créé d'exercices.
          </p>
          <Link to="/create-exercise">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Créer mon premier exercice
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {exercisesList.map((exercise) => (
        <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-xl">
              {exercise.title || exercise.topic || "Exercice sans titre"}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="capitalize">{exercise.subject}</span>
              <span>•</span>
              <span className="capitalize">{exercise.level}</span>
              <span>•</span>
              <span>{exercise.authorName || "Auteur inconnu"}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {exercise.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${exercise.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                    exercise.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'}`}>
                  {exercise.difficulty === 'easy' ? 'Facile' :
                   exercise.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                </span>
                <span className="text-sm text-muted-foreground">
                  {exercise.duration} min
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto"
                onClick={() => navigate(`/exercises/${exercise.id}`)}
              >
                Voir l'exercice
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}