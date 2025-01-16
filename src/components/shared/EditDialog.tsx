import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface EditDialogProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newContent: string) => Promise<void>;
}

export function EditDialog({ title, content, isOpen, onClose, onSave }: EditDialogProps) {
  const [editedContent, setEditedContent] = useState(content);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!editedContent.trim() || loading) return;
    setLoading(true);
    try {
      await onSave(editedContent);
      onClose();
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}