interface Env {
  API_KEY: string;
  FIREBASE_API_KEY: string;
  FIREBASE_AUTH_DOMAIN: string;
  FIREBASE_DATABASE_URL: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_STORAGE_BUCKET: string;
  FIREBASE_MESSAGING_SENDER_ID: string;
  FIREBASE_APP_ID: string;
  FIREBASE_MEASUREMENT_ID: string;
  OPENAI_API_KEY: string;
  STRIPE_PUBLISHABLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PREMIUM_PRICE_ID: string;
  STRIPE_PRO_PRICE_ID: string;
}

export default {
  async fetch(request: Request, env: Env) {
    const allowedOrigins = [
      'https://shimmering-strudel-5310ba.netlify.app',
      'https://iteach-gpt.netlify.app',
      'http://localhost:5173'
    ];
    
    const origin = request.headers.get('Origin') || '';
    const isAllowedOrigin = allowedOrigins.includes(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
          'Access-Control-Allow-Credentials': 'true',
        },
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const apiKey = request.headers.get('X-API-Key');
    if (!apiKey || apiKey !== env.API_KEY) {
      return new Response('Unauthorized', { status: 401 });
    }

    const secrets = {
      firebaseApiKey: env.FIREBASE_API_KEY,
      firebaseAuthDomain: env.FIREBASE_AUTH_DOMAIN,
      firebaseDatabaseUrl: env.FIREBASE_DATABASE_URL,
      firebaseProjectId: env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: env.FIREBASE_APP_ID,
      firebaseMeasurementId: env.FIREBASE_MEASUREMENT_ID,
      openaiApiKey: env.OPENAI_API_KEY,
      stripePublishableKey: env.STRIPE_PUBLISHABLE_KEY,
      stripeSecretKey: env.STRIPE_SECRET_KEY,
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      stripePremiumPriceId: env.STRIPE_PREMIUM_PRICE_ID,
      stripeProPriceId: env.STRIPE_PRO_PRICE_ID,
    };

    return new Response(JSON.stringify(secrets), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  },
}