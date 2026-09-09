/**
 * Filters Routes
 * =============================================================================
 * API endpoint for available filter options.
 */

import type { FastifyPluginAsync } from 'fastify';
import { CacheKeys, CacheTTL } from '../../plugins/cache.js';
import { formatSingleResponse } from '../../utils/index.js';
import {
  JOB_SOURCES,
  EMPLOYMENT_TYPES,
  EXPERIENCE_LEVELS,
  LOCATION_TYPES,
} from '@jobscout/shared';

// =============================================================================
// CONSTANTS
// =============================================================================

const SALARY_RANGES = [
  { min: 0, max: 50000, label: 'Under $50k' },
  { min: 50000, max: 100000, label: '$50k - $100k' },
  { min: 100000, max: 150000, label: '$100k - $150k' },
  { min: 150000, max: 200000, label: '$150k - $200k' },
  { min: 200000, max: 250000, label: '$200k - $250k' },
  { min: 250000, max: null, label: '$250k+' },
];

const LOCATION_TYPE_LABELS: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
};

const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  staff: 'Staff',
  principal: 'Principal',
};

const SOURCE_LABELS: Record<string, string> = {
  greenhouse: 'Greenhouse',
  lever: 'Lever',
  ashby: 'Ashby',
  workable: 'Workable',
  smartrecruiters: 'SmartRecruiters',
};

// =============================================================================
// ROUTES
// =============================================================================

const filtersRoutes: FastifyPluginAsync = async (fastify) => {
  // GET /api/filters - All available filter options with counts
  fastify.get('/', {
    schema: {
      description: 'Get all available filter options with counts',
      tags: ['filters'],
    },
    handler: async (request, reply) => {
      const cacheKey = CacheKeys.filters();

      const filters = await fastify.cache.wrap(
        cacheKey,
        async () => {
          // Get facets from database
          const facets = await fastify.repositories.jobs.getFacets();

          // Build filter options with labels
          const locationTypes = LOCATION_TYPES.map((type) => ({
            value: type,
            label: LOCATION_TYPE_LABELS[type] || type,
            count: facets.locations.find((f) => f.value === type)?.count,
          }));

          const employmentTypes = EMPLOYMENT_TYPES.map((type) => ({
            value: type,
            label: EMPLOYMENT_TYPE_LABELS[type] || type,
            count: facets.employmentTypes.find((f) => f.value.toLowerCase() === type.replace('-', '_'))?.count,
          }));

          const experienceLevels = EXPERIENCE_LEVELS.map((level) => ({
            value: level,
            label: EXPERIENCE_LEVEL_LABELS[level] || level,
            count: facets.experienceLevels.find((f) => f.value.toLowerCase() === level)?.count,
          }));

          const sources = JOB_SOURCES.map((source) => ({
            value: source,
            label: SOURCE_LABELS[source] || source,
            count: facets.sources.find((f) => f.value.toLowerCase() === source)?.count,
          }));

          // Get top locations
          const locations = facets.locations.slice(0, 20).map((loc) => ({
            value: loc.value,
            label: loc.value,
            count: loc.count,
          }));

          // Get top skills
          const skills = facets.skills.slice(0, 50).map((skill) => ({
            value: skill.value,
            label: skill.value,
            count: skill.count,
          }));

          return {
            locations,
            locationTypes,
            employmentTypes,
            experienceLevels,
            sources,
            skills,
            salaryRanges: SALARY_RANGES,
          };
        },
        { ttl: CacheTTL.LONG }
      );

      return formatSingleResponse(filters);
    },
  });

  // GET /api/filters/skills - Skill suggestions for autocomplete
  fastify.get<{
    Querystring: { q?: string; limit?: number };
  }>('/skills', {
    schema: {
      description: 'Get skill suggestions for autocomplete',
      tags: ['filters'],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 50, default: 20 },
        },
      },
    },
    handler: async (request, reply) => {
      const { q, limit = 20 } = request.query;

      // Get all skills from the skill table
      const skills = await fastify.prisma.skill.findMany({
        where: q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { aliases: { hasSome: [q] } },
              ],
            }
          : undefined,
        orderBy: { name: 'asc' },
        take: limit,
        select: {
          name: true,
          slug: true,
          category: true,
        },
      });

      return {
        data: skills.map((s) => ({
          value: s.slug,
          label: s.name,
          category: s.category,
        })),
      };
    },
  });

  // GET /api/filters/locations - Location suggestions
  fastify.get<{
    Querystring: { q?: string; limit?: number };
  }>('/locations', {
    schema: {
      description: 'Get location suggestions for autocomplete',
      tags: ['filters'],
      querystring: {
        type: 'object',
        properties: {
          q: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 50, default: 20 },
        },
      },
    },
    handler: async (request, reply) => {
      const { q, limit = 20 } = request.query;

      const locations = await fastify.prisma.job.groupBy({
        by: ['location'],
        where: q
          ? { location: { contains: q, mode: 'insensitive' } }
          : undefined,
        _count: true,
        orderBy: { _count: { location: 'desc' } },
        take: limit,
      });

      return {
        data: locations.map((loc) => ({
          value: loc.location,
          label: loc.location,
          count: loc._count,
        })),
      };
    },
  });
};

export default filtersRoutes;
