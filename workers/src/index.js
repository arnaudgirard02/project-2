export default {
  async fetch(request, env) {
    try {
      // Log detailed request information
      const requestInfo = {
        method: request.method,
        url: request.url,
        origin: request.headers.get('Origin') || 'no origin',
        hasApiKey: !!request.headers.get('X-API-Key'),
        contentType: request.headers.get('Content-Type')
      };
      console.log('Worker received request:', requestInfo);

    const allowedOrigins = [
      'https://shimmering-strudel-5310ba.netlify.app',
      'https://iteach-gpt.netlify.app',
      'http://localhost:5173'
    ];

    const origin = request.headers.get('Origin') || '';
    const isAllowedOrigin = allowedOrigins.includes(origin);

      // Log CORS validation
      console.log('CORS check:', { origin, isAllowedOrigin });

    if (request.method === 'OPTIONS') {
      console.log('Handling CORS preflight request');
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405 });
    }

    const apiKey = request.headers.get('X-API-Key');
    const expectedApiKey = env.API_KEY;
    
    // Log API key comparison (safely)
    console.log('API Key validation:', {
      receivedKeyLength: apiKey?.length || 0,
      expectedKeyLength: expectedApiKey?.length || 0,
      receivedKeyPrefix: apiKey?.substring(0, 4) || 'none',
      expectedKeyPrefix: expectedApiKey?.substring(0, 4) || 'none',
      match: apiKey === expectedApiKey
    });

    if (!expectedApiKey) {
      console.error('Worker API_KEY environment variable is not set');
      return new Response(JSON.stringify({
        error: 'Configuration Error',
        details: 'Worker API key is not configured in environment variables'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
          'Cache-Control': 'no-store'
        }
      });
    }

    if (!apiKey || apiKey !== expectedApiKey) {
      console.error('Authentication failed:', {
        hasApiKey: !!apiKey,
        keyMatch: apiKey === expectedApiKey
      });
      return new Response(JSON.stringify({
        error: 'Unauthorized',
        details: 'Invalid or missing API key'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': isAllowedOrigin ? origin : ''
        }
      });
    }

    // Use env directly
    const config = env;

    const secrets = {
      firebase: {
        apiKey: config.FIREBASE_API_KEY || '',
        authDomain: config.FIREBASE_AUTH_DOMAIN || '',
        databaseUrl: config.FIREBASE_DATABASE_URL || '',
        projectId: config.FIREBASE_PROJECT_ID || '',
        storageBucket: config.FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID || '',
        appId: config.FIREBASE_APP_ID || '',
        measurementId: config.FIREBASE_MEASUREMENT_ID || '',
      },
      openai: {
        apiKey: config.OPENAI_API_KEY || '',
      },
      stripe: {
        publishableKey: config.STRIPE_PUBLISHABLE_KEY || '',
        secretKey: config.STRIPE_SECRET_KEY || '',
        webhookSecret: config.STRIPE_WEBHOOK_SECRET || '',
        premiumPriceId: config.STRIPE_PREMIUM_PRICE_ID || '',
        proPriceId: config.STRIPE_PRO_PRICE_ID || '',
      }
    };

    console.log('Sending secrets with structure:', Object.keys(secrets));

    return new Response(JSON.stringify(secrets), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin : '',
        'Cache-Control': 'no-store',
      },
    });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }
  },
};