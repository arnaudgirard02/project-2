import { SubscriptionTier } from '@/lib/types/subscription';
import { getSecrets } from './cloudflareService';

export const STRIPE_URLS = {
  premium: '',
  pro: ''
};

export async function initializeStripeUrls() {
  try {
    const { stripe } = await getSecrets();
    if (stripe.premiumPriceId && stripe.proPriceId) {
      STRIPE_URLS.premium = `https://buy.stripe.com/test/${stripe.premiumPriceId}`;
      STRIPE_URLS.pro = `https://buy.stripe.com/test/${stripe.proPriceId}`;
    } else {
      throw new Error('Stripe price IDs not found in secrets');
    }
  } catch (error) {
    console.error('Error initializing Stripe URLs:', error);
    throw error;
  }
}

export async function redirectToStripeCheckout(planId: string) {
  // Ensure URLs are initialized
  await initializeStripeUrls();

  const url = STRIPE_URLS[planId as keyof typeof STRIPE_URLS];
  if (!url) {
    throw new Error('Invalid plan ID');
  }
  
  window.location.href = url;
}

export function getPlanFromUrl(url: string): string | null {
  for (const [plan, stripeUrl] of Object.entries(STRIPE_URLS)) {
    if (url.includes(stripeUrl)) {
      return plan;
    }
  }
  return null;
}