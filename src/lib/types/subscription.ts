export type SubscriptionTier = 'free' | 'premium' | 'pro';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  limits: {
    exerciseViews: number;
    exerciseCreation: number;
    communityAccess: boolean;
    analytics: boolean;
  };
}