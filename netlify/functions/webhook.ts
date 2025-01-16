import { Handler } from '@netlify/functions';
import { updateSubscriptionAfterPayment } from '../../src/lib/services/subscriptionService';
import { STRIPE_URLS } from '../../src/lib/services/stripeService';

export const handler: Handler = async (event) => {
  // Vérifier que c'est une requête POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userId, checkoutUrl } = JSON.parse(event.body || '');

    // Déterminer le plan basé sur l'URL de paiement
    let planId;
    if (checkoutUrl === STRIPE_URLS.premium) {
      planId = 'premium';
    } else if (checkoutUrl === STRIPE_URLS.pro) {
      planId = 'pro';
    } else {
      throw new Error('Invalid checkout URL');
    }

    // Mettre à jour l'abonnement
    await updateSubscriptionAfterPayment(userId, planId);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Webhook error' })
    };
  }
};