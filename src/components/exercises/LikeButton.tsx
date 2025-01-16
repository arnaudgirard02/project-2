import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toggleLike } from "@/lib/services/exerciseService";
import { useToast } from "@/hooks/use-toast";

interface LikeButtonProps {
  exerciseId: string;
  initialLikes: string[];
  onLikeToggle: (newLikes: string[]) => void;
}

export function LikeButton({ exerciseId, initialLikes, onLikeToggle }: LikeButtonProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const isLiked = initialLikes.includes(user.uid);

  const handleLike = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const updatedLikes = await toggleLike(exerciseId, user.uid);
      onLikeToggle(updatedLikes);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le like",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isLiked ? "destructive" : "outline"}
      size="lg"
      onClick={handleLike}
      disabled={loading}
      className="gap-2 min-w-[100px]"
    >
      <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
      <span>{initialLikes.length}</span>
    </Button>
  );
}