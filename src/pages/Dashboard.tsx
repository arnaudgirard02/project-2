import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Brain, History, Plus, ChevronRight, Target, Clock, Trophy, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserExercises, getExerciseStats } from "@/lib/services/exerciseService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Exercise } from "@/lib/types/exercise";
import { Skeleton } from "@/components/ui/skeleton";
import { ExerciseStats } from "@/components/dashboard/ExerciseStats";
import { UsageLimits } from "@/components/subscription/UsageLimits";

export function Dashboard() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<{ firstName: string } | null>(null);
  const [stats, setStats] = useState(null);
  const [basicStats, setBasicStats] = useState({
    totalExercises: 0,
    totalDuration: 0,
    averageDifficulty: "medium",
    lastActivity: null as Date | null,
  });

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as { firstName: string });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    const loadExerciseData = async () => {
      if (!user) return;
      try {
        const [userExercises, exerciseStats] = await Promise.all([
          getUserExercises(user.uid),
          getExerciseStats(user.uid)
        ]);

        setExercises(userExercises);
        setStats(exerciseStats);
        
        // Calculer les statistiques de base
        const total = userExercises.length;
        const duration = userExercises.reduce((acc, ex) => acc + (ex.duration || 0), 0);
        const difficulties = {
          easy: 0,
          medium: 0,
          hard: 0
        };
        userExercises.forEach(ex => difficulties[ex.difficulty]++);
        const avgDifficulty = Object.entries(difficulties)
          .reduce((a, b) => a[1] > b[1] ? a : b)[0];
        const lastActivity = userExercises.length > 0 
          ? new Date(userExercises[0].createdAt) 
          : null;
        setBasicStats({
          totalExercises: total,
          totalDuration: duration,
          averageDifficulty: avgDifficulty,
          lastActivity,
        });
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
    loadExerciseData();
  }, [user]);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Bonjour {userData?.firstName || 'Professeur'} 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Voici un aperçu de votre activité
          </p>
        </div>
        <Link to="/create-exercise">
          <Button className="bg-primary">
            <Plus className="mr-2 h-4 w-4" />
            Nouvel exercice
          </Button>
        </Link>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {loading ? (
          Array(4).fill(null).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-10 w-10 rounded-full mb-4" />
              <Skeleton className="h-7 w-24 mb-2" />
              <Skeleton className="h-4 w-32" />
            </Card>
          ))
        ) : (
          <>
            <Card className="p-6">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{basicStats.totalExercises}</h3>
              <p className="text-muted-foreground">Exercices créés</p>
            </Card>

            <Card className="p-6">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{basicStats.totalDuration}min</h3>
              <p className="text-muted-foreground">Durée totale</p>
            </Card>

            <Card className="p-6">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <Target className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold capitalize mb-1">{basicStats.averageDifficulty}</h3>
              <p className="text-muted-foreground">Difficulté moyenne</p>
            </Card>

            <Card className="p-6">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Trophy className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">
                {basicStats.lastActivity ? new Date(basicStats.lastActivity).toLocaleDateString() : "Aucune"}
              </h3>
              <p className="text-muted-foreground">Dernière activité</p>
            </Card>
          </>
        )}
      </div>

      {/* Statistiques détaillées */}
      {stats && <ExerciseStats stats={stats} />}

      {/* Actions rapides */}
      <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <Link to="/create-exercise">
          <Card className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="mt-4">Générer un exercice</CardTitle>
                <p className="text-muted-foreground">
                  Créez un nouvel exercice avec l'aide de l'IA
                </p>
              </CardHeader>
          </Card>
        </Link>

        <Link to="/exercises">
          <Card className="group hover:shadow-lg transition-all duration-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <History className="h-5 w-5 text-primary" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <CardTitle className="mt-4">Exercices récents</CardTitle>
                <p className="text-muted-foreground">
                  Consultez et gérez vos exercices
                </p>
              </CardHeader>
          </Card>
        </Link>
      </div>
      
      <div className="mt-8">
        <UsageLimits />
      </div>
    </div>
  );
}