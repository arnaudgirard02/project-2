import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { PricingCard } from "@/components/subscription/PricingCard";
import { SUBSCRIPTION_PLANS } from "@/lib/config/subscriptionPlans";
import { redirectToStripeCheckout } from '@/lib/services/stripeService';
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

export function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription, loading: subscriptionLoading } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      if (planId === 'free') {
        toast({
          title: "Plan gratuit activé",
          description: "Vous pouvez maintenant accéder aux fonctionnalités de base.",
        });
        navigate('/dashboard');
        return;
      }

      await redirectToStripeCheckout(planId);
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Erreur",
        description: "Impossible de procéder à l'abonnement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Choisissez votre plan
        </h1>
        <div className="space-y-4">
          <p className="text-xl text-muted-foreground">
            Des tarifs simples et transparents pour tous les besoins
          </p>
          {user && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Votre plan actuel : <span className="font-medium">Plan {subscription?.tier === 'free' ? 'Gratuit' : subscription?.tier}</span></span>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={plan.id === subscription?.tier}
            onSubscribe={handleSubscribe}
          />
        ))}
      </div>
    </div>
  );
}