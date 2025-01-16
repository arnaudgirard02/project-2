import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ExerciseGuardProps {
  children: React.ReactNode;
  action: 'view' | 'create';
}

export function ExerciseGuard({ children, action }: ExerciseGuardProps) {
  const { subscription, loading } = useSubscription();
  const [showLimitMessage, setShowLimitMessage] = useState(false);

  useEffect(() => {
    if (!loading && subscription) {
      const remaining = action === 'view' 
        ? subscription.exerciseViewsRemaining 
        : subscription.exerciseCreationsRemaining;

      setShowLimitMessage(remaining <= 0 && subscription.tier !== 'pro');
    }
  }, [subscription, loading, action]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (showLimitMessage) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Limite atteinte
          </h2>
          <p className="text-muted-foreground mb-6">
            {action === 'view' 
              ? "Vous avez atteint votre limite de consultations d'exercices pour ce mois-ci."
              : "Vous avez atteint votre limite de création d'exercices pour ce mois-ci."}
          </p>
          <Link to="/pricing">
            <Button>
              Passer à un forfait supérieur
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}