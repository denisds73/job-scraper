/**
 * Companies Routes
 * =============================================================================
 * API endpoints for company listings and details.
 */

import type { FastifyPluginAsync } from 'fastify';
import { CacheKeys, CacheTTL } from '../../plugins/cache.js';
import { NotFoundError, formatListResponse, formatSingleResponse } from '../../utils/index.js';
import {
  companyListQuerySchema,
  companyParamsSchema,
  type CompanyListQuery,
  type CompanyParams,
} from '../../schemas/index.js';
import type { CompanyFilters, CompanySize, JobSource } from '@jobscout/shared';

// =============================================================================
// HELPERS
// =============================================================================

function buildFilters(query: CompanyListQuery): CompanyFilters {
  return {
    query: query.q,
    industry: query.industry,
    size: query.size as CompanySize | undefined,
    atsType: query.atsType as JobSource | undefined,
    hasOpenJobs: query.hasJobs,
  };
}

// =============================================================================
// ROUTES
// =============================================================================

const companiesRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/companies - List companies
  fastify.get<{
    Querystring: CompanyListQuery;
  }>('/', {
    schema: {
      description: 'List companies with filtering and pagination',
      tags: ['companies'],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          industry: { type: 'string' },
          size: { type: 'string' },
          atsType: { type: 'string' },
          hasJobs: { type: 'boolean' },
          page: { type: 'number', default: 1 },
          limit: { type: 'number', default: 20 },
        },
      },
    },
    handler: async (request, reply) => {
      const query = companyListQuerySchema.parse(request.query);

      const cacheKey = CacheKeys.companyList(query.page, query.limit);

      const result = await fastify.cache.wrap(
        cacheKey,
        async () => {
          const filters = buildFilters(query);
          return fastify.repositories.companies.search(filters, {
            page: query.page,
            limit: query.limit,
          });
        },
        { ttl: CacheTTL.LONG }
      );

      return formatListResponse(result.data, result.pagination);
    },
  });

  // GET /api/companies/:slug - Company detail with jobs
  fastify.get<{
    Params: CompanyParams;
    Querystring: { jobPage?: number; jobLimit?: number };
  }>('/:slug', {
    schema: {
      description: 'Get company details with job listings',
      tags: ['companies'],
      params: {
        type: 'object',
        properties: {
          slug: { type: 'string' },
        },
        required: ['slug'],
      },
      querystring: {
        type: 'object',
        properties: {
          jobPage: { type: 'number', default: 1 },
          jobLimit: { type: 'number', default: 20 },
        },
      },
    },
    handler: async (request, reply) => {
      const { slug } = companyParamsSchema.parse(request.params);
      const { jobPage = 1, jobLimit = 20 } = request.query;

      const cacheKey = CacheKeys.companyDetail(slug);

      const company = await fastify.cache.wrap(
        cacheKey,
        async () => {
          const companyData = await fastify.repositories.companies.getWithJobs(
            slug,
            { page: jobPage, limit: jobLimit }
          );

          if (!companyData) {
            throw new NotFoundError('Company', slug);
          }

          return companyData;
        },
        { ttl: CacheTTL.LONG }
      );

      // Transform dates to ISO strings
      const response = {
        ...company,
        createdAt: company.createdAt instanceof Date ? company.createdAt.toISOString() : company.createdAt,
        updatedAt: company.updatedAt instanceof Date ? company.updatedAt.toISOString() : company.updatedAt,
        jobs: company.jobs.map((job: { postedAt: Date | string }) => ({
          ...job,
          postedAt: job.postedAt instanceof Date ? job.postedAt.toISOString() : job.postedAt,
        })),
      };

      return formatSingleResponse(response);
    },
  });

  // GET /api/companies/stats - Company statistics
  fastify.get('/stats', {
    schema: {
      description: 'Get company statistics',
      tags: ['companies'],
    },
    handler: async (request, reply) => {
      const stats = await fastify.repositories.companies.getStats();
      return formatSingleResponse(stats);
    },
  });

  // GET /api/companies/top - Companies with most jobs
  fastify.get<{
    Querystring: { limit?: number };
  }>('/top', {
    schema: {
      description: 'Get companies with the most open jobs',
      tags: ['companies'],
      querystring: {
        type: 'object',
        properties: {
          limit: { type: 'number', minimum: 1, maximum: 50, default: 10 },
        },
      },
    },
    handler: async (request, reply) => {
      const { limit = 10 } = request.query;

      const companies = await fastify.cache.wrap(
        `companies:top:${limit}`,
        async () => {
          return fastify.repositories.companies.findWithOpenJobs(limit);
        },
        { ttl: CacheTTL.LONG }
      );

      return { data: companies };
    },
  });
};

export default companiesRoutes;
