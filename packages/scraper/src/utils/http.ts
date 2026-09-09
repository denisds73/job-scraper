/**
 * HTTP Client
 * =============================================================================
 * Retry-enabled HTTP client for scraper operations.
 */

import { createLogger } from './logger.js';
import { RateLimiter } from './rate-limiter.js';

const logger = createLogger({ component: 'http' });

interface HttpOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  rateLimiter?: RateLimiter;
}

interface HttpResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string,
    public retryable: boolean
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

const DEFAULT_OPTIONS: Required<Omit<HttpOptions, 'rateLimiter'>> = {
  timeout: 10000,
  retries: 3,
  retryDelay: 1000,
  headers: {
    'User-Agent': 'JobScout/1.0 (https://github.com/denisds73/job-scraper)',
    'Accept': 'application/json',
  },
};

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Make an HTTP GET request with retry logic
 */
export async function httpGet<T>(
  url: string,
  options: HttpOptions = {}
): Promise<HttpResponse<T>> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: HttpError | null = null;

  for (let attempt = 0; attempt <= config.retries; attempt++) {
    try {
      // Apply rate limiting if configured
      if (options.rateLimiter) {
        await options.rateLimiter.acquire();
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.timeout);

      logger.debug(`GET ${url}`, { attempt: attempt + 1, maxAttempts: config.retries + 1 });

      const response = await fetch(url, {
        method: 'GET',
        headers: config.headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const retryable = isRetryableStatus(response.status);
        throw new HttpError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          url,
          retryable
        );
      }

      const data = await response.json() as T;

      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      if (error instanceof HttpError) {
        lastError = error;

        if (error.retryable && attempt < config.retries) {
          const delay = config.retryDelay * Math.pow(2, attempt); // Exponential backoff
          logger.warn(`Request failed, retrying in ${delay}ms`, {
            url,
            status: error.status,
            attempt: attempt + 1,
          });
          await sleep(delay);
          continue;
        }
      } else if (error instanceof Error) {
        // Handle timeout or network errors
        if (error.name === 'AbortError') {
          lastError = new HttpError(`Request timeout after ${config.timeout}ms`, 0, url, true);
        } else {
          lastError = new HttpError(error.message, 0, url, true);
        }

        if (attempt < config.retries) {
          const delay = config.retryDelay * Math.pow(2, attempt);
          logger.warn(`Request error, retrying in ${delay}ms`, {
            url,
            error: error.message,
            attempt: attempt + 1,
          });
          await sleep(delay);
          continue;
        }
      }

      break;
    }
  }

  throw lastError || new HttpError('Unknown error', 0, url, false);
}

/**
 * Batch fetch with concurrency control
 */
export async function httpBatch<T>(
  urls: string[],
  options: HttpOptions & { concurrency?: number } = {}
): Promise<Array<{ url: string; result: T | null; error?: string }>> {
  const { concurrency = 3, ...httpOptions } = options;
  const results: Array<{ url: string; result: T | null; error?: string }> = [];
  const pending: Promise<void>[] = [];

  for (const url of urls) {
    const promise = (async () => {
      try {
        const response = await httpGet<T>(url, httpOptions);
        results.push({ url, result: response.data });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Failed to fetch ${url}`, error as Error);
        results.push({ url, result: null, error: message });
      }
    })();

    pending.push(promise);

    // Control concurrency
    if (pending.length >= concurrency) {
      await Promise.race(pending);
      // Remove completed promises
      const completed = pending.filter((p) => 
        Promise.race([p, Promise.resolve('pending')]).then((r) => r !== 'pending')
      );
      for (const c of completed) {
        const index = pending.indexOf(c);
        if (index > -1) pending.splice(index, 1);
      }
    }
  }

  // Wait for remaining requests
  await Promise.all(pending);

  return results;
}

export { HttpError, HttpOptions, HttpResponse };
