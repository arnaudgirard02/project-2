import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getEnvConfig, validateEnvConfig } from '../../config/env';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test.firebaseapp.com',
      VITE_FIREBASE_DATABASE_URL: 'https://test.firebaseio.com',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_STORAGE_BUCKET: 'test.appspot.com',
      VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
      VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef',
      VITE_FIREBASE_MEASUREMENT_ID: 'G-TEST123',
      VITE_OPENAI_API_KEY: 'test-openai-key',
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should get environment configuration', () => {
    const config = getEnvConfig();
    expect(config.firebase.apiKey).toBe('test-api-key');
    expect(config.firebase.projectId).toBe('test-project');
    expect(config.openai.apiKey).toBe('test-openai-key');
  });

  it('should validate complete configuration', () => {
    const config = getEnvConfig();
    expect(() => validateEnvConfig(config)).not.toThrow();
  });

  it('should throw error for missing variables', () => {
    delete process.env.VITE_FIREBASE_API_KEY;
    delete process.env.VITE_OPENAI_API_KEY;

    const config = getEnvConfig();
    expect(() => validateEnvConfig(config)).toThrow('Missing required environment variables');
  });
});