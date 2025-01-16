import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { EditDialog } from "@/components/shared/EditDialog";
import { DeleteDialog } from "@/components/shared/DeleteDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Loader2, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { addComment, updateComment, deleteComment } from "@/lib/services/exerciseService";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

function sortCommentsByDate(comments: Comment[]) {
  return [...comments].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA;
  });
}

interface Comment {
  id: string;
  userId: string;
  authorName: string;
  content: string;
  createdAt: string | { seconds: number; nanoseconds: number };
  editedAt?: string | { seconds: number; nanoseconds: number };
}

interface CommentSectionProps {
  exerciseId: string;
  comments: Comment[];
  onCommentAdded: (newComment: Comment) => void;
}

export function CommentSection({ exerciseId, comments, onCommentAdded }: CommentSectionProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [deletingComment, setDeletingComment] = useState<Comment | null>(null);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleEdit = async (newContent: string) => {
    if (!editingComment) return;
    
    setLoading(true);
    try {
      const updatedComment = await updateComment(exerciseId, editingComment.id, user.uid, newContent);
      onCommentAdded(updatedComment);
      setEditingComment(null);
      toast({
        title: "Commentaire modifié",
        description: "Votre commentaire a été mis à jour avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de modifier votre commentaire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingComment) return;
    
    setLoading(true);
    try {
      await deleteComment(exerciseId, deletingComment.id, user.uid);
      const updatedComments = comments.filter(c => c.id !== deletingComment.id);
      onCommentAdded({ ...deletingComment, deleted: true });
      setDeletingComment(null);
      toast({
        title: "Commentaire supprimé",
        description: "Votre commentaire a été supprimé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer votre commentaire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || loading) return;

    setLoading(true);
    try {
      const comment = await addComment(exerciseId, user.uid, newComment);
      onCommentAdded(comment);
      setNewComment("");
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter votre commentaire",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-lg font-semibold">
          Commentaires ({comments.length})
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="Ajouter un commentaire..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button type="submit" disabled={loading || !newComment.trim()}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Publication...
            </>
          ) : (
            "Publier"
          )}
        </Button>
      </form>

      <div className="space-y-4">
        {sortCommentsByDate(comments).map((comment) => (
          <Card key={comment.id} className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {comment.authorName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{comment.authorName}</p>
                  <div className="flex items-center gap-4">
                    {comment.createdAt && (
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(comment.createdAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    )}
                    {comment.userId === user.uid && (
                      <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setEditingComment(comment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-600"
                        onClick={() => setDeletingComment(comment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{comment.content}</p>
                {comment.editedAt && (
                  <p className="text-xs text-muted-foreground italic mt-1">
                    Modifié le{' '}
                    {format(new Date(comment.editedAt), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
      {editingComment && (
        <EditDialog
          title="Modifier le commentaire"
          content={editingComment.content}
          isOpen={true}
          onClose={() => setEditingComment(null)}
          onSave={handleEdit}
        />
      )}
      {deletingComment && (
        <DeleteDialog
          title="Supprimer le commentaire"
          description="Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette action est irréversible."
          isOpen={true}
          loading={loading}
          onClose={() => setDeletingComment(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}