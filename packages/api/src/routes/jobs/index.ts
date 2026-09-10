/**
 * Jobs Routes
 * =============================================================================
 * API endpoints for job listings and search.
 */

import type { FastifyPluginAsync } from 'fastify';
import { CacheKeys, CacheTTL } from '../../plugins/cache.js';
import { NotFoundError, formatListResponse, formatSingleResponse } from '../../utils/index.js';
import {
  jobSearchQuerySchema,
  jobListQuerySchema,
  jobParamsSchema,
  type JobSearchQuery,
  type JobListQuery,
  type JobParams,
} from '../../schemas/index.js';
import type {
  JobFilters,
  JobSortOptions,
  LocationType,
  EmploymentType,
  ExperienceLevel,
  JobSource,
} from '@jobscout/shared';

// =============================================================================
// HELPERS
// =============================================================================

function parseArrayParam<T>(param: T | T[] | undefined): T[] | undefined {
  if (param === undefined) return undefined;
  return Array.isArray(param) ? param : [param];
}

// India-focused: Default location filter to show only India jobs
const DEFAULT_LOCATION_FILTER = 'India';

function buildFilters(query: JobSearchQuery): JobFilters {
  return {
    query: query.q,
    // Use India as default location if not specified
    location: query.location || DEFAULT_LOCATION_FILTER,
    isRemote: query.remote,
    locationType: parseArrayParam(query.locationType) as LocationType[] | undefined,
    employmentType: parseArrayParam(query.employmentType) as EmploymentType[] | undefined,
    experienceLevel: parseArrayParam(query.experienceLevel) as ExperienceLevel[] | undefined,
    salaryMin: query.salaryMin,
    salaryMax: query.salaryMax,
    skills: typeof query.skills === 'string' ? [query.skills] : query.skills,
    companyId: query.companyId,
    source: parseArrayParam(query.source) as JobSource[] | undefined,
    postedAfter: query.postedAfter,
    postedBefore: query.postedBefore,
  };
}

function buildSort(query: JobSearchQuery): JobSortOptions {
  return {
    field: query.sortBy,
    direction: query.sortDir,
  };
}

// =============================================================================
// ROUTES
// =============================================================================

const jobsRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/jobs/search - Full-text search
  fastify.get<{
    Querystring: JobSearchQuery;
  }>('/search', {
    schema: {
      description: 'Search jobs with full-text search and filters',
      tags: ['jobs'],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          location: { type: 'string' },
          remote: { type: 'boolean' },
          locationType: { type: 'string' },
          employmentType: { type: 'string' },
          experienceLevel: { type: 'string' },
          salaryMin: { type: 'number' },
          salaryMax: { type: 'number' },
          skills: { type: 'string' },
          companyId: { type: 'string' },
          source: { type: 'string' },
          sortBy: { type: 'string', default: 'postedAt' },
          sortDir: { type: 'string', default: 'desc' },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
    handler: async (request, reply) => {
      const query = jobSearchQuerySchema.parse(request.query);

      const cacheKey = CacheKeys.jobSearch(query);

      const result = await fastify.cache.wrap(
        cacheKey,
        async () => {
          const filters = buildFilters(query);
          const sort = buildSort(query);

          const searchResult = await fastify.repositories.jobs.search({
            query: query.q,
            filters,
            sort,
            pagination: { page: query.page, limit: query.limit },
          });

          return {
            jobs: searchResult.jobs,
            pagination: searchResult.pagination,
          };
        },
        { ttl: CacheTTL.MEDIUM }
      );

      return formatListResponse(result.jobs, result.pagination);
    },
  });

  // GET /api/jobs - List recent jobs
  fastify.get<{
    Querystring: JobListQuery;
  }>('/', {
    schema: {
      description: 'List recent jobs with basic filtering',
      tags: ['jobs'],
      querystring: {
        type: 'object',
        properties: {
          source: { type: 'string' },
          companyId: { type: 'string' },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
    handler: async (request, reply) => {
      const query = jobListQuerySchema.parse(request.query);

      const cacheKey = CacheKeys.jobList(query.page, query.limit);

      const result = await fastify.cache.wrap(
        cacheKey,
        async () => {
          if (query.companyId) {
            return fastify.repositories.jobs.findByCompany(query.companyId, {
              page: query.page,
              limit: query.limit,
            });
          }

          const searchResult = await fastify.repositories.jobs.search({
            filters: {
              source: query.source ? [query.source] : undefined,
              location: DEFAULT_LOCATION_FILTER, // India-focused
            },
            pagination: { page: query.page, limit: query.limit },
          });

          return {
            data: searchResult.jobs,
            pagination: searchResult.pagination,
          };
        },
        { ttl: CacheTTL.MEDIUM }
      );

      return formatListResponse(result.data, result.pagination);
    },
  });

  // GET /api/jobs/:id - Job detail
  fastify.get<{
    Params: JobParams;
  }>('/:id', {
    schema: {
      description: 'Get job details by ID',
      tags: ['jobs'],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
    },
    handler: async (request, reply) => {
      const { id } = jobParamsSchema.parse(request.params);

      const cacheKey = CacheKeys.jobDetail(id);

      const job = await fastify.cache.wrap(
        cacheKey,
        async () => {
          const jobData = await fastify.repositories.jobs.findByIdWithCompany(id);

          if (!jobData) {
            throw new NotFoundError('Job', id);
          }

          // Get similar jobs
          const similarJobs = await fastify.repositories.jobs.findSimilar(id, 5);

          return {
            ...jobData,
            similarJobs,
          };
        },
        { ttl: CacheTTL.LONG }
      );

      // Transform dates to ISO strings for JSON response
      const response = {
        ...job,
        postedAt: job.postedAt instanceof Date ? job.postedAt.toISOString() : job.postedAt,
        expiresAt: job.expiresAt instanceof Date ? job.expiresAt.toISOString() : job.expiresAt,
        lastSeenAt: job.lastSeenAt instanceof Date ? job.lastSeenAt.toISOString() : job.lastSeenAt,
        createdAt: job.createdAt instanceof Date ? job.createdAt.toISOString() : job.createdAt,
        updatedAt: job.updatedAt instanceof Date ? job.updatedAt.toISOString() : job.updatedAt,
        company: {
          ...job.company,
          createdAt: job.company?.createdAt instanceof Date ? job.company.createdAt.toISOString() : job.company?.createdAt,
          updatedAt: job.company?.updatedAt instanceof Date ? job.company.updatedAt.toISOString() : job.company?.updatedAt,
        },
        similarJobs: job.similarJobs?.map((j: { postedAt: Date | string }) => ({
          ...j,
          postedAt: j.postedAt instanceof Date ? j.postedAt.toISOString() : j.postedAt,
        })),
      };

      return formatSingleResponse(response);
    },
  });

  // GET /api/jobs/suggestions - Autocomplete
  fastify.get<{
    Querystring: { q: string; limit?: number };
  }>('/suggestions', {
    schema: {
      description: 'Get job title suggestions for autocomplete',
      tags: ['jobs'],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string', minLength: 2 },
          limit: { type: 'number', minimum: 1, maximum: 20, default: 10 },
        },
        required: ['q'],
      },
    },
    handler: async (request, reply) => {
      const { q, limit = 10 } = request.query;

      const suggestions = await fastify.repositories.jobs.suggestTitles(q, limit);

      return { data: suggestions };
    },
  });
};

export default jobsRoutes;
