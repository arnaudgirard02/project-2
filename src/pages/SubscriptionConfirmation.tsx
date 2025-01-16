import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPlanFromUrl } from '@/lib/services/stripeService';
import { updateSubscriptionAfterPayment } from '@/lib/services/subscriptionService';
import { SUBSCRIPTION_PLANS } from '@/lib/config/subscriptionPlans';

export function SubscriptionConfirmation() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [newPlan, setNewPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const checkoutUrl = searchParams.get('checkout_url');
        if (!checkoutUrl) {
          throw new Error('URL de paiement manquante');
        }

        const planId = getPlanFromUrl(checkoutUrl);
        if (!planId) {
          throw new Error('Plan non reconnu');
        }

        setNewPlan(planId);
        const subscription = await updateSubscriptionAfterPayment(user.uid, planId);
        toast({
          title: "Abonnement activé",
          description: `Votre abonnement ${planId.charAt(0).toUpperCase() + planId.slice(1)} a été activé avec succès.`
        });
        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        console.error('Error updating subscription:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        toast({
          title: "Erreur",
          description: err instanceof Error ? err.message : 'Une erreur est survenue',
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    updateSubscription();
  }, [user, searchParams, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-md mx-auto py-12">
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Une erreur est survenue
            </h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/pricing')}>
              Retour aux tarifs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const plan = newPlan ? SUBSCRIPTION_PLANS.find(p => p.id === newPlan) : null;

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardContent className="pt-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">
            Abonnement mis à jour avec succès !
          </h2>
          <p className="text-lg font-medium text-primary mb-2">
            {plan?.name || 'Nouvel abonnement'}
          </p>
          <p className="text-muted-foreground mb-6">
            {plan?.description}
          </p>
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-2">Fonctionnalités incluses :</h3>
            <ul className="text-sm text-muted-foreground space-y-2 text-left">
              {plan?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Redirection automatique vers le tableau de bord...
          </p>
          <Button onClick={() => navigate('/dashboard')}>
            Aller au tableau de bord
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}