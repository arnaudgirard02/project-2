import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SubscriptionTier } from '@/lib/types/subscription';
import { SUBSCRIPTION_PLANS } from '@/lib/config/subscriptionPlans';

export async function getUserSubscription(userId: string) {
  try {
    const docRef = doc(db, 'subscriptions', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    
    // Create free subscription if none exists
    const freeSubscription = {
      userId,
      tier: 'free' as SubscriptionTier,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      exerciseViewsRemaining: SUBSCRIPTION_PLANS[0].limits.exerciseViews,
      exerciseCreationsRemaining: SUBSCRIPTION_PLANS[0].limits.exerciseCreation
    };
    
    await setDoc(docRef, freeSubscription);
    return freeSubscription;
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return null;
  }
}

export async function updateSubscriptionAfterPayment(userId: string, planId: SubscriptionTier) {
  const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
  if (!plan) {
    throw new Error('Plan invalide');
  }

  const docRef = doc(db, 'subscriptions', userId);

  try {
    // Get current subscription first
    const currentSub = await getDoc(docRef);
    const subscriptionData = {
      userId,
      tier: planId,
      status: 'active',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      exerciseViewsRemaining: plan.limits.exerciseViews,
      exerciseCreationsRemaining: plan.limits.exerciseCreation,
      updatedAt: new Date().toISOString(),
      previousTier: currentSub.exists() ? currentSub.data().tier : 'free'
    };

    await setDoc(docRef, subscriptionData);
    return subscriptionData;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
}

export async function checkSubscriptionLimits(userId: string, action: 'view' | 'create') {
  const subscription = await getUserSubscription(userId);
  if (!subscription) {
    return false;
  }

  // Pro plan has unlimited access
  if (subscription.tier === 'pro') {
    return true;
  }

  if (action === 'view') {
    return subscription.exerciseViewsRemaining > 0;
  } else {
    return subscription.exerciseCreationsRemaining > 0;
  }
}

export async function decrementSubscriptionLimit(userId: string, action: 'view' | 'create') {
  const docRef = doc(db, 'subscriptions', userId);
  const subscription = await getUserSubscription(userId);
  
  if (!subscription) return false;

  // Don't decrement for pro plan
  if (subscription.tier === 'pro') return true;

  const field = action === 'view' ? 'exerciseViewsRemaining' : 'exerciseCreationsRemaining';
  if (subscription[field] <= 0) return false;

  await setDoc(docRef, {
    ...subscription,
    [field]: subscription[field] - 1
  });

  return true;
}