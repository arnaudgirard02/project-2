import { Handler } from '@netlify/functions';
import { handleWebhookEvent } from '../../src/lib/services/stripeService';
import { updateSubscriptionFromStripe } from '../../src/lib/services/subscriptionService';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const signature = event.headers['stripe-signature'];
  
  if (!signature) {
    return { statusCode: 400, body: 'No signature found' };
  }

  try {
    const stripeEvent = await handleWebhookEvent(
      event.body || '',
      signature
    );

    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = stripeEvent.data.object;
        await updateSubscriptionFromStripe(subscription);
        break;
      }
      
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        // Gérer la session complétée si nécessaire
        break;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};