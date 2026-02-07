import { HttpClient } from '../src/http';
import { AuthenticationError, RateLimitError, ServerError } from '../src/errors';

// Mock fetch globally
global.fetch = jest.fn();

describe('HttpClient', () => {
  const apiKey = 'test_api_key';
  const httpClient = new HttpClient({ apiKey, maxRetries: 1 });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject authorization header', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await httpClient.request('/test');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': `Bearer ${apiKey}`,
        }),
      })
    );
  });

  it('should throw AuthenticationError on 401', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      headers: new Headers(),
    });

    await expect(httpClient.request('/test')).rejects.toThrow(AuthenticationError);
  });

  it('should retry on 429 and eventually throw RateLimitError', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({
        'x-ratelimit-limit': '10',
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': '1000',
      }),
    });

    // Speed up sleep
    jest.spyOn(httpClient as any, 'sleep').mockResolvedValue(undefined);

    await expect(httpClient.request('/test')).rejects.toThrow(RateLimitError);
    expect(global.fetch).toHaveBeenCalledTimes(2); // Initial + 1 retry
  });

  it('should retry on 500 and eventually throw ServerError', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      headers: new Headers(),
    });

    jest.spyOn(httpClient as any, 'sleep').mockResolvedValue(undefined);

    await expect(httpClient.request('/test')).rejects.toThrow(ServerError);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
