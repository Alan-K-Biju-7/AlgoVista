import { apiRequest, authHeader } from './apiClient';

const originalFetch = global.fetch;

describe('apiClient', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    global.fetch = originalFetch;
  });

  test('returns JSON responses and sends auth headers', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ ok: true }),
    });

    await expect(apiRequest('/api/health', { headers: authHeader('abc') })).resolves.toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith('/api/health', expect.objectContaining({
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        Authorization: 'Bearer abc',
      }),
    }));
  });

  test('throws status-aware errors for JSON and text failures', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: 'Please log in first.' }),
    });

    await expect(apiRequest('/api/me')).rejects.toMatchObject({
      message: 'Please log in first.',
      status: 401,
    });

    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      status: 502,
      text: async () => 'Gateway unavailable',
    });

    await expect(apiRequest('/api/coach')).rejects.toMatchObject({
      message: 'Gateway unavailable',
      status: 502,
      payload: { error: 'Gateway unavailable' },
    });
  });
});
