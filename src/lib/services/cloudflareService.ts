const CLOUDFLARE_WORKER_URL = import.meta.env.VITE_CLOUDFLARE_WORKER_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Validate environment variables early
const validateEnvironment = () => {
  const missing = [];
  
  // Validate worker URL
  if (!CLOUDFLARE_WORKER_URL) {
    missing.push('VITE_CLOUDFLARE_WORKER_URL');
  } else if (!CLOUDFLARE_WORKER_URL.startsWith('http')) {
    throw new Error('Invalid CLOUDFLARE_WORKER_URL format');
  }

  // Validate API key
  if (!API_KEY) {
    missing.push('VITE_API_KEY');
  } else if (API_KEY.length < 10) {
    throw new Error('API_KEY is too short - check your configuration');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  console.log('Environment validation passed');
};

interface CloudflareSecrets {
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseUrl: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  openai: {
    apiKey: string;
  };
  stripe: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
    premiumPriceId: string;
    proPriceId: string;
  };
}

let cachedSecrets: CloudflareSecrets | null = null;

const validateSecrets = (secrets: any): secrets is CloudflareSecrets => {
  if (!secrets.firebase || !secrets.openai || !secrets.stripe) {
    return false;
  }

  const requiredFirebaseFields = [
    'apiKey',
    'authDomain',
    'databaseUrl',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
    'measurementId'
  ];

  return requiredFirebaseFields.every(field => secrets.firebase[field]);
};

export async function getSecrets(): Promise<CloudflareSecrets> {
  // Return cached secrets if available
  if (cachedSecrets) {
    return cachedSecrets;
  }

  // Validate environment before making request
  validateEnvironment();
  
  try {
    console.log('Attempting to connect to worker:', CLOUDFLARE_WORKER_URL);
    console.log('Using API key:', API_KEY ? 'Present' : 'Missing');

    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      credentials: 'omit'
    });

    console.log('Worker response status:', response.status);

    if (!response.ok) {
      const status = response.status;
      const statusText = response.statusText;
      let errorText;
      try {
        const errorJson = await response.json();
        errorText = errorJson.error || errorJson.details || 'Unknown error';
      } catch {
        errorText = await response.text().catch(() => 'No error details');
      }
      console.error('Worker request failed:', { status, statusText, errorText });
      throw new Error(`Worker request failed: ${status} ${statusText} - ${errorText}`);
    }

    const secrets = await response.json();
    console.log('Received secrets structure:', Object.keys(secrets));

    
    if (!validateSecrets(secrets)) {
      console.error('Invalid secrets structure:', secrets);
      throw new Error('Invalid or incomplete secrets received from worker');
    }

    // Cache the validated secrets
    cachedSecrets = secrets;
    return secrets;

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch secrets: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching secrets');
  }
}

export async function checkWorkerConnection(): Promise<boolean> {
  try {
    await getSecrets();
    return true;
  } catch (error) {
    return false;
  }
}