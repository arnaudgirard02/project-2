import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteExercisesByAuthors } from "@/lib/services/adminService";
import { Textarea } from "@/components/ui/textarea";

export function BulkDeleteExercises() {
  const [loading, setLoading] = useState(false);
  const [authors, setAuthors] = useState("");
  const { toast } = useToast();

  const handleDelete = async () => {
    const authorList = authors
      .split("\n")
      .map(author => author.trim())
      .filter(Boolean);

    if (authorList.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer au moins un nom d'auteur",
        variant: "destructive",
      });
      return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer tous les exercices de ces ${authorList.length} utilisateurs ?`)) {
      return;
    }

    setLoading(true);
    try {
      const deletedCount = await deleteExercisesByAuthors(authorList);
      toast({
        title: "Suppression terminée",
        description: `${deletedCount} exercices ont été supprimés avec succès.`,
      });
      setAuthors(""); // Clear the textarea after successful deletion
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer les exercices",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Suppression en masse
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Entrez les noms des auteurs (un par ligne) dont vous souhaitez supprimer les exercices.
            </p>
            <Textarea
              placeholder="Alexandre Fournier&#10;Audrey Robert&#10;Camille Roux"
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              className="min-h-[200px] font-mono"
              disabled={loading}
            />
          </div>
          <Button
            variant="destructive"
            disabled={loading || !authors.trim()}
            onClick={handleDelete}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Suppression en cours...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer les exercices
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}