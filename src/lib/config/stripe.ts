import { getSecrets } from '../services/cloudflareService';

let stripeConfig: {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  prices: {
    premium: { id: string; amount: number };
    pro: { id: string; amount: number };
  };
} | null = null;

export async function getStripeConfig() {
  if (stripeConfig) {
    return stripeConfig;
  }

  try {
    const secrets = await getSecrets();
    
    stripeConfig = {
      publishableKey: secrets.stripePublishableKey,
      secretKey: secrets.stripeSecretKey,
      webhookSecret: secrets.stripeWebhookSecret,
      prices: {
        premium: {
          id: secrets.stripePremiumPriceId,
          amount: 699, // 6.99€
        },
        pro: {
          id: secrets.stripeProPriceId,
          amount: 999, // 9.99€
        },
      },
    };

    return stripeConfig;
  } catch (error) {
    console.error('Error loading Stripe config:', error);
    throw error;
  }
}