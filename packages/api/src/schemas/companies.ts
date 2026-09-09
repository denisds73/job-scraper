/**
 * Companies API Schemas
 * =============================================================================
 * Zod schemas for companies endpoints.
 */

import { z } from 'zod';
import {
  paginationSchema,
  jobSourceSchema,
  companySchema,
  companyDetailSchema,
  jobListItemSchema,
  listResponseSchema,
  singleResponseSchema,
} from './common.js';

// =============================================================================
// LIST QUERY
// =============================================================================

export const companyListQuerySchema = paginationSchema.extend({
  q: z.string().optional(),
  industry: z.string().optional(),
  size: z.string().optional(),
  atsType: jobSourceSchema.optional(),
  hasJobs: z.coerce.boolean().optional(),
});

export type CompanyListQuery = z.infer<typeof companyListQuerySchema>;

// =============================================================================
// PARAMS
// =============================================================================

export const companyParamsSchema = z.object({
  slug: z.string(),
});

export type CompanyParams = z.infer<typeof companyParamsSchema>;

// =============================================================================
// RESPONSES
// =============================================================================

export const companyListResponseSchema = listResponseSchema(companySchema);

export const companyDetailWithJobsSchema = companyDetailSchema.extend({
  jobs: z.array(jobListItemSchema),
  jobCount: z.number(),
});

export const companyDetailResponseSchema = singleResponseSchema(
  companyDetailWithJobsSchema
);
