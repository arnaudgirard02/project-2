import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SubscriptionPlan } from "@/lib/types/subscription";

interface PricingCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSubscribe: (planId: string) => void;
}

export function PricingCard({ plan, isCurrentPlan, onSubscribe }: PricingCardProps) {
  return (
    <Card className={`flex flex-col ${isCurrentPlan ? 'border-primary' : ''}`}>
      <CardHeader>
        <CardTitle className="text-xl">{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="text-3xl font-bold mb-6">
          {plan.price === 0 ? (
            'Gratuit'
          ) : (
            <>
              {plan.price}€ <span className="text-base font-normal">/mois</span>
            </>
          )}
        </div>
        <ul className="space-y-3 mb-6">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <span className={feature.startsWith('✓') ? 'text-primary' : 'text-muted-foreground'}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan}
          onClick={() => onSubscribe(plan.id)}
        >
          {isCurrentPlan ? 'Plan actuel' : 'Choisir ce plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}