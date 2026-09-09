/**
 * Rate Limiter
 * =============================================================================
 * Token bucket rate limiter for respectful API scraping.
 */

interface RateLimiterOptions {
  requestsPerSecond: number;
  maxBurst?: number;
}

export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private refillRate: number; // tokens per ms
  private lastRefill: number;
  private queue: Array<() => void> = [];
  private processing = false;

  constructor(options: RateLimiterOptions) {
    this.maxTokens = options.maxBurst ?? options.requestsPerSecond;
    this.tokens = this.maxTokens;
    this.refillRate = options.requestsPerSecond / 1000;
    this.lastRefill = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      this.refill();

      if (this.tokens >= 1) {
        this.tokens -= 1;
        const resolve = this.queue.shift()!;
        resolve();
      } else {
        // Wait for token refill
        const waitTime = (1 - this.tokens) / this.refillRate;
        await this.sleep(Math.ceil(waitTime));
      }
    }

    this.processing = false;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Acquire a rate limit token
   * Blocks until a token is available
   */
  async acquire(): Promise<void> {
    return new Promise((resolve) => {
      this.queue.push(resolve);
      this.processQueue();
    });
  }

  /**
   * Execute a function with rate limiting
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();
    return fn();
  }

  /**
   * Get current state for debugging
   */
  getState(): { tokens: number; queueLength: number } {
    this.refill();
    return {
      tokens: Math.floor(this.tokens),
      queueLength: this.queue.length,
    };
  }
}

// Pre-configured rate limiters for different ATS APIs
export const rateLimiters = {
  greenhouse: new RateLimiter({ requestsPerSecond: 2, maxBurst: 5 }),
  lever: new RateLimiter({ requestsPerSecond: 2, maxBurst: 5 }),
  ashby: new RateLimiter({ requestsPerSecond: 1, maxBurst: 3 }),
};

export function getRateLimiter(source: string): RateLimiter {
  return rateLimiters[source as keyof typeof rateLimiters] 
    ?? new RateLimiter({ requestsPerSecond: 1 });
}
