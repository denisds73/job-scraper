/**
 * Filters API Schemas
 * =============================================================================
 * Zod schemas for filters endpoint.
 */

import { z } from 'zod';
import { singleResponseSchema } from './common.js';

// =============================================================================
// FILTER OPTIONS
// =============================================================================

export const filterOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  count: z.number().optional(),
});

export const filtersSchema = z.object({
  locations: z.array(filterOptionSchema),
  locationTypes: z.array(filterOptionSchema),
  employmentTypes: z.array(filterOptionSchema),
  experienceLevels: z.array(filterOptionSchema),
  sources: z.array(filterOptionSchema),
  skills: z.array(filterOptionSchema),
  salaryRanges: z.array(
    z.object({
      min: z.number(),
      max: z.number().nullable(),
      label: z.string(),
    })
  ),
});

export type Filters = z.infer<typeof filtersSchema>;

export const filtersResponseSchema = singleResponseSchema(filtersSchema);
