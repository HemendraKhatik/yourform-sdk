import { YourFormError, AuthenticationError, RateLimitError, ServerError, ValidationError } from './errors/index.js';

/**
 * Configuration options for the internal HTTP client.
 */
export interface HttpClientOptions {
  /** Your secret API key. */
  apiKey: string;
  /** Optional base URL for API requests. Defaults to the production API. */
  baseUrl?: string;
  /** Maximum number of times to retry failed requests. Defaults to 3. */
  maxRetries?: number;
}

/**
 * Internal HTTP client for making authenticated requests to the YourForm API.
 * Handles authentication, retries, and error mapping.
 */
export class HttpClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly maxRetries: number;

  constructor(options: HttpClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = (options.baseUrl || 'https://www.yourform.live/api/v1').replace(/\/+$/, '');
    this.maxRetries = options.maxRetries || 3;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Execute an HTTP request with automatic retries for transient errors.
   * 
   * @param path The API endpoint path (e.g., '/forms').
   * @param options Standard Fetch API request options.
   * @returns The parsed JSON response.
   * @throws AuthenticationError if the API key is invalid.
   * @throws RateLimitError if rate limits are exceeded.
   * @throws ValidationError if the request parameters are invalid.
   * @throws ServerError for 5xx responses.
   */
  public async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    let attempt = 0;

    while (attempt <= this.maxRetries) {
      let response: Response;
      
      try {
        response = await fetch(`${this.baseUrl}${path}`, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        });
      } catch (error: any) {
        // Retry on network errors
        if (attempt === this.maxRetries) {
          throw new YourFormError(error instanceof Error ? error.message : 'Network error');
        }
        await this.sleep(Math.pow(2, attempt) * 1000);
        attempt++;
        continue;
      }

      if (response.ok) {
        return await response.json() as T;
      }

      const headers = {
        limit: parseInt(response.headers?.get('x-ratelimit-limit') || '0'),
        remaining: parseInt(response.headers?.get('x-ratelimit-remaining') || '0'),
        reset: parseInt(response.headers?.get('x-ratelimit-reset') || '0'),
      };

      // Handle Rate Limiting with exponential backoff or Retry-After header
      if (response.status === 429) {
        if (attempt === this.maxRetries) {
          throw new RateLimitError('Rate limit exceeded after maximum retries', headers);
        }
        const retryAfter = parseInt(response.headers.get('Retry-After') || '1') * 1000;
        const backoff = Math.pow(2, attempt) * 1000;
        await this.sleep(Math.max(retryAfter, backoff));
        attempt++;
        continue;
      }

      // Retry on internal server errors
      if (response.status >= 500) {
        if (attempt === this.maxRetries) {
          throw new ServerError(`Server error (${response.status})`, response.status);
        }
        await this.sleep(Math.pow(2, attempt) * 1000);
        attempt++;
        continue;
      }

      if (response.status === 401 || response.status === 403) {
        throw new AuthenticationError('API key is invalid or unauthorized');
      }

      if (response.status === 400) {
        const body = await response.json().catch(() => ({}));
        throw new ValidationError('Validation failed', body);
      }

      throw new YourFormError(`Request failed with status ${response.status}`);
    }

    throw new YourFormError('Request failed after maximum retries');
  }
}
