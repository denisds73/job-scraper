/**
 * Common API Schemas
 * =============================================================================
 * Shared Zod schemas for request validation and OpenAPI documentation.
 */

import { z } from 'zod';

// =============================================================================
// PAGINATION
// =============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationSchema>;

// =============================================================================
// ENUMS
// =============================================================================

export const jobSourceSchema = z.enum([
  'greenhouse',
  'lever',
  'ashby',
  'workable',
  'smartrecruiters',
]);

export const locationTypeSchema = z.enum(['remote', 'hybrid', 'onsite']);

export const employmentTypeSchema = z.enum([
  'full-time',
  'part-time',
  'contract',
  'internship',
]);

export const experienceLevelSchema = z.enum([
  'entry',
  'mid',
  'senior',
  'staff',
  'principal',
]);

export const sortDirectionSchema = z.enum(['asc', 'desc']);

// =============================================================================
// COMPANY SCHEMAS
// =============================================================================

export const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().nullable(),
  industry: z.string().nullable(),
  size: z.string().nullable(),
  jobCount: z.number().optional(),
});

export const companyDetailSchema = companySchema.extend({
  description: z.string().nullable(),
  website: z.string().nullable(),
  careerPageUrl: z.string(),
  foundedYear: z.number().nullable(),
  headquarters: z.string().nullable(),
  atsType: jobSourceSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

// =============================================================================
// JOB SCHEMAS
// =============================================================================

export const salarySchema = z.object({
  min: z.number().nullable(),
  max: z.number().nullable(),
  currency: z.string(),
  period: z.enum(['yearly', 'monthly', 'hourly']),
});

export const jobListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  company: z.object({
    id: z.string(),
    name: z.string(),
    logo: z.string().nullable(),
  }),
  location: z.string(),
  locationType: locationTypeSchema,
  employmentType: employmentTypeSchema,
  salary: salarySchema.nullable(),
  skills: z.array(z.string()),
  postedAt: z.string(),
  sourceUrl: z.string(),
  isNew: z.boolean().optional(),
});

export const jobDetailSchema = jobListItemSchema.extend({
  externalId: z.string(),
  source: jobSourceSchema,
  description: z.string(),
  requirements: z.array(z.string()),
  experienceLevel: experienceLevelSchema.nullable(),
  department: z.string().nullable(),
  expiresAt: z.string().nullable(),
  lastSeenAt: z.string(),
  companyId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  similarJobs: z.array(jobListItemSchema).optional(),
});

// =============================================================================
// RESPONSE SCHEMAS
// =============================================================================

export const paginationMetaSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  totalPages: z.number(),
  hasMore: z.boolean(),
});

export function listResponseSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    data: z.array(itemSchema),
    meta: paginationMetaSchema,
  });
}

export function singleResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    data: dataSchema,
  });
}

// =============================================================================
// ERROR SCHEMAS
// =============================================================================

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
  meta: z.object({
    timestamp: z.string(),
    path: z.string(),
    requestId: z.string().optional(),
  }),
});
