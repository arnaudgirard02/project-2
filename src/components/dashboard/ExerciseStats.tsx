import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Heart, MessageSquare, TrendingUp } from "lucide-react";
import { Exercise } from "@/lib/types/exercise";
import { Link } from "react-router-dom";

interface ExerciseStatsProps {
  stats: {
    totalExercises: number;
    totalDuration: number;
    totalLikes: number;
    totalViews: number;
    totalComments: number;
    avgLikes: number;
    avgViews: number;
    avgComments: number;
    trendingExercises: Exercise[];
  };
}

export function ExerciseStats({ stats }: ExerciseStatsProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vues moyennes</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgViews.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalViews} vues au total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Likes moyens</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgLikes.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalLikes} likes au total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commentaires moyens</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgComments.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalComments} commentaires au total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Exercices populaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.trendingExercises.length > 0 ? (
              stats.trendingExercises.map((exercise) => (
                <Link 
                  key={exercise.id}
                  to={`/exercises/${exercise.id}`}
                  className="block"
                >
                  <div className="rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">
                        {exercise.title || exercise.topic || "Sans titre"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {exercise.metadata?.likes?.length || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {exercise.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {exercise.metadata?.comments?.length || 0}
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                      {exercise.description}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Aucun exercice populaire pour le moment
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}