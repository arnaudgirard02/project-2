import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getSecrets } from './services/cloudflareService';
import { getEnvConfig, validateEnvConfig } from './config/env';
import { FirebaseApp } from 'firebase/app';
import { Auth } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const getFirebaseConfig = async () => {
  try {
    // Try to get secrets from Cloudflare Worker first
    const { firebase } = await getSecrets();
    return {
      apiKey: firebase.apiKey,
      authDomain: firebase.authDomain,
      databaseURL: firebase.databaseUrl,
      projectId: firebase.projectId,
      storageBucket: firebase.storageBucket,
      messagingSenderId: firebase.messagingSenderId,
      appId: firebase.appId,
      measurementId: firebase.measurementId,
    };
  } catch (error) {
    console.error('Failed to get Firebase configuration from worker:', error);
    throw new Error('Failed to get Firebase configuration from worker. Check your worker URL and API key.');
  }
};

export async function initializeFirebase() {
  try {
    if (!getApps().length) {
      const config = await getFirebaseConfig();
      
      if (!config) {
        throw new Error('No Firebase configuration available');
      }

      const firebaseConfig = {
        ...config,
        apiKey: String(config.apiKey),
        authDomain: String(config.authDomain),
        databaseURL: String(config.databaseURL),
        projectId: String(config.projectId),
        storageBucket: String(config.storageBucket),
        messagingSenderId: String(config.messagingSenderId),
        appId: String(config.appId),
        measurementId: String(config.measurementId),
      };

      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
    db = getFirestore(app);

    return true;
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    throw new Error(`Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export { auth, db };