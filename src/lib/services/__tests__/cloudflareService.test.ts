import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSecrets } from '../cloudflareService';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('Cloudflare Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and cache secrets', async () => {
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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSecrets),
    });

    const secrets = await getSecrets();
    expect(secrets).toEqual(mockSecrets);

    // Second call should use cached values
    const cachedSecrets = await getSecrets();
    expect(cachedSecrets).toEqual(mockSecrets);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it('should throw error when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      text: () => Promise.resolve('Server Error'),
    });

    await expect(getSecrets()).rejects.toThrow('Failed to fetch secrets');
  });

  it('should throw error when required secrets are missing', async () => {
    const incompleteSecrets = {
      firebaseApiKey: 'test-api-key',
      // Missing other required fields
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(incompleteSecrets),
    });

    await expect(getSecrets()).rejects.toThrow('Missing required secrets');
  });
});