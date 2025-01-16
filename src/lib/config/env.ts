interface EnvConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    databaseURL: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
    measurementId: string;
  };
  openai: {
    apiKey: string;
  };
}

export function getEnvConfig(): EnvConfig {
  return {
    firebase: {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
      measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
    },
    openai: {
      apiKey: import.meta.env.VITE_OPENAI_API_KEY || '',
    },
  };
}

export function validateEnvConfig(config: EnvConfig): void {
  const missingVars: string[] = [];

  Object.entries(config.firebase).forEach(([key, value]) => {
    if (!value) missingVars.push(`VITE_FIREBASE_${key.toUpperCase()}`);
  });

  if (!config.openai.apiKey) missingVars.push('VITE_OPENAI_API_KEY');

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars.join('\n')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    );
  }
}

export function getEnvironment() {
  return import.meta.env.VITE_APP_ENV || 'development';
}

export function isDevelopment() {
  return getEnvironment() === 'development';
}

export function isProduction() {
  return getEnvironment() === 'production';
}