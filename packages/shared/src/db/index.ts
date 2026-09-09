/**
 * Database Module Exports
 * =============================================================================
 * Central export point for all database-related functionality.
 */

// Client
export {
  prisma,
  getPrismaClient,
  disconnectPrisma,
  checkDatabaseHealth,
  type PrismaClient,
} from './client.js';

// Repositories
export {
  BaseRepository,
  JobRepository,
  CompanyRepository,
  ScrapeRepository,
  type TransactionClient,
  type FindOptions,
  type JobSearchParams,
  type JobSearchResult,
  type JobFacets,
  type FacetCount,
  type ScrapeRecord,
  type ScrapeStats,
} from './repositories/index.js';

// Utilities
export {
  type PaginationParams,
  type PaginatedResult,
  type CursorPaginationParams,
  type CursorPaginatedResult,
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  normalizePagination,
  createPaginatedResult,
  createCursorPaginatedResult,
} from './utils/index.js';

// =============================================================================
// REPOSITORY FACTORY
// =============================================================================

import { getPrismaClient } from './client.js';
import { JobRepository } from './repositories/job.js';
import { CompanyRepository } from './repositories/company.js';
import { ScrapeRepository } from './repositories/scrape.js';

/**
 * Create all repositories with a shared Prisma client
 */
export function createRepositories(prismaClient = getPrismaClient()) {
  return {
    jobs: new JobRepository(prismaClient),
    companies: new CompanyRepository(prismaClient),
    scrapes: new ScrapeRepository(prismaClient),
  };
}

/**
 * Default repository instances
 */
export const repositories = createRepositories();
