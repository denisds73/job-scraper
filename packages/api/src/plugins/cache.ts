/**
 * Cache Service
 * =============================================================================
 * In-memory cache with TTL support. Can be swapped for Redis in production.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

// =============================================================================
// TYPES
// =============================================================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // TTL in seconds
}

interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  wrap<T>(
    key: string,
    fn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T>;
}

// =============================================================================
// TYPE DECLARATIONS
// =============================================================================

declare module 'fastify' {
  interface FastifyInstance {
    cache: CacheService;
  }
}

// =============================================================================
// IN-MEMORY CACHE IMPLEMENTATION
// =============================================================================

class InMemoryCache implements CacheService {
  private store = new Map<string, CacheEntry<unknown>>();
  private defaultTtl: number;

  constructor(defaultTtl = 300) {
    // 5 minutes default
    this.defaultTtl = defaultTtl;

    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    const ttl = (options?.ttl ?? this.defaultTtl) * 1000;
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl,
    });
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(): Promise<void> {
    this.store.clear();
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  /**
   * Get cached value or execute function and cache result
   */
  async wrap<T>(
    key: string,
    fn: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await fn();
    await this.set(key, value, options);
    return value;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      }
    }
  }
}

// =============================================================================
// CACHE KEY BUILDERS
// =============================================================================

export const CacheKeys = {
  jobSearch: (params: Record<string, unknown>) =>
    `jobs:search:${JSON.stringify(params)}`,
  jobDetail: (id: string) => `jobs:detail:${id}`,
  jobList: (page: number, limit: number) => `jobs:list:${page}:${limit}`,
  companyList: (page: number, limit: number) =>
    `companies:list:${page}:${limit}`,
  companyDetail: (slug: string) => `companies:detail:${slug}`,
  filters: () => 'filters:all',
};

export const CacheTTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
};

// =============================================================================
// PLUGIN
// =============================================================================

const cachePlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const cache = new InMemoryCache(CacheTTL.MEDIUM);

  fastify.decorate('cache', cache);

  // Clear cache on close
  fastify.addHook('onClose', async () => {
    await cache.clear();
  });

  fastify.log.info('Cache service initialized (in-memory)');
};

export default fp(cachePlugin, {
  name: 'cache',
});
