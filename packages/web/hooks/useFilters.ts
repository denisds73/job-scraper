/**
 * Filters Hook
 * =============================================================================
 * React Query hooks for filter data.
 */

import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { STALE_TIME } from '../lib/query-provider';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const filterKeys = {
  all: ['filters'] as const,
  data: () => [...filterKeys.all, 'data'] as const,
  skills: (q?: string) => [...filterKeys.all, 'skills', q] as const,
  locations: (q?: string) => [...filterKeys.all, 'locations', q] as const,
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Get all filter options
 */
export function useFilters() {
  return useQuery({
    queryKey: filterKeys.data(),
    queryFn: () => api.filters.get(),
    staleTime: STALE_TIME.LONG,
    select: (data) => data.data,
  });
}

/**
 * Search skills for autocomplete
 */
export function useSkillSearch(query?: string) {
  return useQuery({
    queryKey: filterKeys.skills(query),
    queryFn: () => api.filters.skills(query),
    staleTime: STALE_TIME.LONG,
    enabled: query === undefined || query.length >= 1,
    select: (data) => data.data,
  });
}

/**
 * Search locations for autocomplete
 */
export function useLocationSearch(query?: string) {
  return useQuery({
    queryKey: filterKeys.locations(query),
    queryFn: () => api.filters.locations(query),
    staleTime: STALE_TIME.LONG,
    enabled: query === undefined || query.length >= 1,
    select: (data) => data.data,
  });
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Format location type for display
 */
export function formatLocationType(type: string): string {
  const labels: Record<string, string> = {
    remote: 'Remote',
    hybrid: 'Hybrid',
    onsite: 'On-site',
  };
  return labels[type] || type;
}

/**
 * Format employment type for display
 */
export function formatEmploymentType(type: string): string {
  const labels: Record<string, string> = {
    'full-time': 'Full-time',
    'part-time': 'Part-time',
    contract: 'Contract',
    internship: 'Internship',
  };
  return labels[type] || type;
}

/**
 * Format experience level for display
 */
export function formatExperienceLevel(level: string): string {
  const labels: Record<string, string> = {
    entry: 'Entry Level',
    mid: 'Mid Level',
    senior: 'Senior',
    staff: 'Staff',
    principal: 'Principal',
  };
  return labels[level] || level;
}
