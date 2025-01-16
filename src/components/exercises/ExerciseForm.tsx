import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Loader2 } from "lucide-react";
import { ExerciseFormData } from "@/lib/types/exercise";
import { generateExercise } from "@/lib/services/exerciseService";
import { useToast } from "@/hooks/use-toast";

const SUBJECTS = [
  "Français",
  "Mathématiques",
  "Anglais",
  "Histoire-Géographie",
  "Sciences",
  "Physique-Chimie",
];

const LEVELS = [
  "CP", "CE1", "CE2", "CM1", "CM2",
  "6ème", "5ème", "4ème", "3ème",
  "Seconde", "Première", "Terminale",
];

const EXERCISE_TYPES = [
  { value: "practice", label: "Exercice pratique" },
  { value: "quiz", label: "Quiz" },
  { value: "problem", label: "Problème" },
];

const DIFFICULTIES = [
  { value: "easy", label: "Facile" },
  { value: "medium", label: "Moyen" },
  { value: "hard", label: "Difficile" },
];

export function ExerciseForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExerciseFormData>({
    topic: "",
    description: "",
    interests: [],
    subject: "",
    level: "",
    type: "practice",
    duration: 15,
    difficulty: "medium",
  });

  const [interests, setInterests] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate user profile first
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        toast({
          title: "Profil incomplet",
          description: "Veuillez compléter votre profil avant de créer un exercice",
          variant: "destructive",
        });
        navigate("/profile");
        return;
      }

      const userData = userDoc.data();
      if (!userData?.firstName || !userData?.lastName) {
        toast({
          title: "Profil incomplet",
          description: "Veuillez compléter votre profil avant de créer un exercice",
          variant: "destructive",
        });
        navigate("/profile");
        return;
      }
    } catch (error) {
      console.error("Error checking user profile:", error);
      toast({
        title: "Erreur",
        description: error instanceof Error 
          ? error.message 
          : "Impossible de vérifier votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      await generateExercise(formData, user.uid);
      toast({
        title: "Exercice créé !",
        description: "Votre exercice a été généré avec succès.",
      });
      navigate("/exercises");
    } catch (error) {
      console.error('Exercise generation error:', error);
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de générer l'exercice. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de l'exercice</CardTitle>
          <CardDescription>
            Définissez les critères pour générer un exercice personnalisé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Sujet spécifique</Label>
            <Input
              id="topic"
              placeholder="Ex: Les fractions, La conjugaison au présent..."
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Décrivez brièvement cet exercice..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interests">Centres d'intérêt des élèves</Label>
            <Input
              id="interests"
              placeholder="Ex: Sport, Musique, Jeux vidéo... (séparés par des virgules)"
              value={interests}
              onChange={(e) => {
                setInterests(e.target.value);
                setFormData({
                  ...formData,
                  interests: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                });
              }}
            />
            <p className="text-sm text-muted-foreground">
              Ces centres d'intérêt seront utilisés pour personnaliser l'exercice
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Matière</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) => setFormData({ ...formData, subject: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une matière" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject.toLowerCase()}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Niveau</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un niveau" />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((level) => (
                    <SelectItem key={level} value={level.toLowerCase()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type d'exercice</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ExerciseFormData["type"]) => 
                  setFormData({ ...formData, type: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {EXERCISE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Difficulté</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value: ExerciseFormData["difficulty"]) =>
                  setFormData({ ...formData, difficulty: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la difficulté" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((difficulty) => (
                    <SelectItem key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Durée estimée (en minutes)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.duration]}
                onValueChange={(value) => setFormData({ ...formData, duration: value[0] })}
                min={5}
                max={60}
                step={5}
                className="flex-1"
              />
              <span className="w-12 text-right">{formData.duration}min</span>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Générer l'exercice
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}