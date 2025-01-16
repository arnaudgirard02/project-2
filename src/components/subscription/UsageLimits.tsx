import { useSubscription } from '@/hooks/useSubscription';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, PenTool, Calendar } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/lib/config/subscriptionPlans';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function UsageLimits() {
  const { subscription } = useSubscription();
  
  if (!subscription) return null;

  const plan = SUBSCRIPTION_PLANS.find(p => p.id === subscription.tier);
  if (!plan) return null;

  const viewsLimit = plan.limits.exerciseViews;
  const creationLimit = plan.limits.exerciseCreation;

  const viewsUsed = viewsLimit - subscription.exerciseViewsRemaining;
  const creationUsed = creationLimit - subscription.exerciseCreationsRemaining;

  const viewsPercentage = viewsLimit === Infinity ? 0 : (viewsUsed / viewsLimit) * 100;
  const creationPercentage = creationLimit === Infinity ? 0 : (creationUsed / creationLimit) * 100;

  const renewalDate = new Date(subscription.currentPeriodEnd);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Utilisation du forfait</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{viewsLimit === Infinity ? 'Consultations' : 'Consultations restantes'}</span>
              </div>
              <span className="font-medium">
                {viewsLimit === Infinity ? 'Illimité' : `${subscription.exerciseViewsRemaining}/${viewsLimit}`}
              </span>
            </div>
            <Progress value={viewsPercentage} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <PenTool className="h-4 w-4" />
                <span>{creationLimit === Infinity ? 'Créations' : 'Créations restantes'}</span>
              </div>
              <span className="font-medium">
                {creationLimit === Infinity ? 'Illimité' : `${subscription.exerciseCreationsRemaining}/${creationLimit}`}
              </span>
            </div>
            <Progress value={creationPercentage} className="h-2" />
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Renouvellement le</span>
              </div>
              <span className="font-medium">
                {format(renewalDate, "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}