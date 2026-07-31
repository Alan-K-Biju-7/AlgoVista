import { apiRequest, csrfHeader } from './apiClient';

const originalFetch = global.fetch;

describe('apiClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  test('returns JSON and sends credentialed, CSRF-protected requests', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ ok: true }),
    });

    await expect(apiRequest('/api/progress', {
      method: 'PATCH',
      headers: csrfHeader('csrf-token'),
      body: JSON.stringify({ conceptId: 'arrays', status: 'learning' }),
    })).resolves.toEqual({ ok: true });
    expect(global.fetch).toHaveBeenCalledWith('/api/progress', expect.objectContaining({
      credentials: 'include',
      headers: expect.objectContaining({
        'Content-Type': 'application/json',
        'X-CSRF-Token': 'csrf-token',
      }),
    }));
  });

  test('throws status-aware errors for JSON and text failures', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 401,
      text: async () => JSON.stringify({ error: 'Please log in first.' }),
    });

    await expect(apiRequest('/api/me')).rejects.toMatchObject({
      message: 'Please log in first.',
      status: 401,
    });

    global.fetch = vi.fn().mockResolvedValueOnce({
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
