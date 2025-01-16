import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, School, Flag } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getUsers,
  getGlobalStats,
  getReportedExercises,
  deleteExerciseAsAdmin
} from "@/lib/services/adminService";
import { Exercise } from "@/lib/types/exercise";
import { ReportedExercises } from "@/components/admin/ReportedExercises";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { CsvUpload } from "@/components/admin/CsvUpload";
import { BulkDeleteExercises } from "@/components/admin/BulkDeleteExercises";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  subject: string;
  level: string;
  exercisesCount: number;
}

interface GlobalStats {
  totalExercises: number;
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
}

export function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [reportedExercises, setReportedExercises] = useState<Exercise[]>([]);
  const [stats, setStats] = useState<GlobalStats>({
    totalExercises: 0,
    totalUsers: 0,
    totalTeachers: 0,
    totalStudents: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, statsData, reportedData] = await Promise.all([
          getUsers(),
          getGlobalStats(),
          getReportedExercises()
        ]);
        setUsers(usersData as User[]);
        setStats(statsData);
        setReportedExercises(reportedData);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleDeleteExercise = async (exerciseId: string) => {
    try {
      await deleteExerciseAsAdmin(exerciseId);
      setReportedExercises(prev => prev.filter(ex => ex.id !== exerciseId));
      toast({
        title: "Exercice supprimé",
        description: "L'exercice a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'exercice",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Administration</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de l'activité sur la plateforme
        </p>
      </div>

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
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalUsers}</h3>
              <p className="text-muted-foreground">Utilisateurs inscrits</p>
            </Card>

            <Card className="p-6">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <School className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalTeachers}</h3>
              <p className="text-muted-foreground">Professeurs</p>
            </Card>

            <Card className="p-6">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                <GraduationCap className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalStudents}</h3>
              <p className="text-muted-foreground">Élèves</p>
            </Card>

            <Card className="p-6">
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{stats.totalExercises}</h3>
              <p className="text-muted-foreground">Exercices créés</p>
            </Card>
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Matière</TableHead>
                <TableHead>Niveau</TableHead>
                <TableHead>Exercices créés</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(null).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  </TableRow>
                ))
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell className="capitalize">
                      {user.role === 'teacher' ? 'Professeur' : 'Élève'}
                    </TableCell>
                    <TableCell className="capitalize">{user.subject}</TableCell>
                    <TableCell className="capitalize">{user.level}</TableCell>
                    <TableCell>{user.exercisesCount}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Bulk Delete */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <BulkDeleteExercises />
        </CardContent>
      </Card>

      {/* CSV Upload */}
      <Card className="mt-8">
        <CardContent className="pt-6">
          <CsvUpload />
        </CardContent>
      </Card>

      {/* Exercices signalés */}
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5" />
            <CardTitle>Exercices signalés</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ReportedExercises
            exercises={reportedExercises}
            loading={loading}
            onDelete={handleDeleteExercise}
          />
        </CardContent>
      </Card>
    </div>
  );
}