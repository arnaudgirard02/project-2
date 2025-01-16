import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getUserSubscription } from '@/lib/services/subscriptionService';
import { SubscriptionTier } from '@/lib/types/subscription';

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<{
    tier: SubscriptionTier;
    exerciseViewsRemaining: number;
    exerciseCreationsRemaining: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = async () => {
      if (!user) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      try {
        const data = await getUserSubscription(user.uid);
        setSubscription(data);
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, [user]);

  return { subscription, loading };
}