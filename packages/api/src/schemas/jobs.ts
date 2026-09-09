/**
 * Jobs API Schemas
 * =============================================================================
 * Zod schemas for jobs endpoints.
 */

import { z } from 'zod';
import {
  paginationSchema,
  jobSourceSchema,
  locationTypeSchema,
  employmentTypeSchema,
  experienceLevelSchema,
  sortDirectionSchema,
  jobListItemSchema,
  jobDetailSchema,
  listResponseSchema,
  singleResponseSchema,
} from './common.js';

// =============================================================================
// SEARCH QUERY
// =============================================================================

export const jobSearchQuerySchema = paginationSchema.extend({
  q: z.string().optional(),
  location: z.string().optional(),
  remote: z.coerce.boolean().optional(),
  locationType: z
    .union([locationTypeSchema, z.array(locationTypeSchema)])
    .optional(),
  employmentType: z
    .union([employmentTypeSchema, z.array(employmentTypeSchema)])
    .optional(),
  experienceLevel: z
    .union([experienceLevelSchema, z.array(experienceLevelSchema)])
    .optional(),
  salaryMin: z.coerce.number().int().positive().optional(),
  salaryMax: z.coerce.number().int().positive().optional(),
  skills: z.union([z.string(), z.array(z.string())]).optional(),
  companyId: z.string().optional(),
  source: z.union([jobSourceSchema, z.array(jobSourceSchema)]).optional(),
  postedAfter: z.coerce.date().optional(),
  postedBefore: z.coerce.date().optional(),
  sortBy: z.enum(['postedAt', 'salary', 'title', 'company']).default('postedAt'),
  sortDir: sortDirectionSchema.default('desc'),
});

export type JobSearchQuery = z.infer<typeof jobSearchQuerySchema>;

// =============================================================================
// LIST QUERY
// =============================================================================

export const jobListQuerySchema = paginationSchema.extend({
  source: jobSourceSchema.optional(),
  companyId: z.string().optional(),
});

export type JobListQuery = z.infer<typeof jobListQuerySchema>;

// =============================================================================
// PARAMS
// =============================================================================

export const jobParamsSchema = z.object({
  id: z.string(),
});

export type JobParams = z.infer<typeof jobParamsSchema>;

// =============================================================================
// RESPONSES
// =============================================================================

export const jobListResponseSchema = listResponseSchema(jobListItemSchema);
export const jobDetailResponseSchema = singleResponseSchema(jobDetailSchema);

// =============================================================================
// FACETS
// =============================================================================

export const facetCountSchema = z.object({
  value: z.string(),
  count: z.number(),
});

export const jobFacetsSchema = z.object({
  locations: z.array(facetCountSchema),
  employmentTypes: z.array(facetCountSchema),
  experienceLevels: z.array(facetCountSchema),
  skills: z.array(facetCountSchema),
  sources: z.array(facetCountSchema),
});

export const jobSearchResponseSchema = z.object({
  data: z.array(jobListItemSchema),
  meta: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
    hasMore: z.boolean(),
  }),
  facets: jobFacetsSchema.optional(),
});
