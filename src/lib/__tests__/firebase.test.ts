import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initializeFirebase } from '../firebase';
import { getSecrets } from '../services/cloudflareService';

// Mock the Firebase modules
vi.mock('firebase/app', () => ({
  getApps: vi.fn(() => []),
  getApp: vi.fn(),
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));

// Mock the cloudflareService
vi.mock('../services/cloudflareService', () => ({
  getSecrets: vi.fn(),
}));

describe('Firebase Initialization', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize Firebase with secrets from Cloudflare', async () => {
    const mockSecrets = {
      firebaseApiKey: 'test-api-key',
      firebaseAuthDomain: 'test.firebaseapp.com',
      firebaseDatabaseUrl: 'https://test.firebaseio.com',
      firebaseProjectId: 'test-project',
      firebaseStorageBucket: 'test.appspot.com',
      firebaseMessagingSenderId: '123456789',
      firebaseAppId: '1:123456789:web:abcdef',
      firebaseMeasurementId: 'G-TEST123',
      openaiApiKey: 'test-openai-key',
    };

    (getSecrets as any).mockResolvedValue(mockSecrets);

    const result = await initializeFirebase();
    expect(result).toBe(true);
  });

  it('should throw error when secrets are missing', async () => {
    const mockSecrets = {
      firebaseApiKey: 'test-api-key',
      // Missing other required fields
    };

    (getSecrets as any).mockResolvedValue(mockSecrets);

    await expect(initializeFirebase()).rejects.toThrow('Missing Firebase configuration');
  });

  it('should fallback to environment variables when Cloudflare fails', async () => {
    (getSecrets as any).mockRejectedValue(new Error('Failed to fetch'));

    // Mock environment variables
    const originalEnv = process.env;
    process.env = {
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      VITE_FIREBASE_DATABASE_URL: 'https://test.firebaseio.com',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
      VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef',
      VITE_FIREBASE_MEASUREMENT_ID: 'G-TEST123',
    };

    const result = await initializeFirebase();
    expect(result).toBe(true);

    // Restore environment
    process.env = originalEnv;
  });
});