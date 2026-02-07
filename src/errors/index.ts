/**
 * Base error class for all YourForm SDK errors.
 */
export class YourFormError extends Error {
  /** Internal flag to identify YourForm errors. */
  public readonly isYourFormError: boolean = true;
  /** Internal flag to identify rate limit specifically. */
  public readonly isRateLimitError: boolean = false;
  
  constructor(message: string) {
    super(message);
    this.name = 'YourFormError';
    Object.setPrototypeOf(this, YourFormError.prototype);
  }
}

/**
 * Thrown when an API request fails due to invalid or missing authentication.
 */
export class AuthenticationError extends YourFormError {
  constructor(message: string = 'Invalid API key or authentication failed') {
    super(message);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Thrown when the client has hit the API rate limits.
 */
export class RateLimitError extends YourFormError {
  public override readonly isRateLimitError: boolean = true;
  /** Number of milliseconds to wait before retrying. */
  public readonly retryAfter?: number;
  /** The maximum number of requests allowed in the current window. */
  public readonly limit?: number;
  /** The number of requests remaining in the current window. */
  public readonly remaining?: number;
  /** The time at which the current rate limit window resets, in UTC epoch seconds. */
  public readonly reset?: number;

  constructor(message: string, details?: { retryAfter?: number; limit?: number; remaining?: number; reset?: number }) {
    super(message);
    this.name = 'RateLimitError';
    this.retryAfter = details?.retryAfter;
    this.limit = details?.limit;
    this.remaining = details?.remaining;
    this.reset = details?.reset;
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

/**
 * Thrown when the request fails validation (e.g. missing required parameters).
 */
export class ValidationError extends YourFormError {
  /** Detailed validation error messages from the API. */
  public readonly details?: any;

  constructor(message: string, details?: any) {
    super(message);
    this.name = 'ValidationError';
    this.details = details;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Thrown when the YourForm API returns a 5xx server error.
 */
export class ServerError extends YourFormError {
  /** The HTTP status code returned by the server. */
  public readonly statusCode: number;

  constructor(message: string = 'Internal server error', statusCode: number = 500) {
    super(message);
    this.name = 'ServerError';
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
