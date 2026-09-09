/**
 * Company Hooks
 * =============================================================================
 * React Query hooks for company data.
 */

import { useQuery } from '@tanstack/react-query';
import { api, type CompanyListParams } from '../lib/api';
import { STALE_TIME } from '../lib/query-provider';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const companyKeys = {
  all: ['companies'] as const,
  lists: () => [...companyKeys.all, 'list'] as const,
  list: (params: CompanyListParams) => [...companyKeys.lists(), params] as const,
  details: () => [...companyKeys.all, 'detail'] as const,
  detail: (slug: string) => [...companyKeys.details(), slug] as const,
  top: (limit: number) => [...companyKeys.all, 'top', limit] as const,
  stats: () => [...companyKeys.all, 'stats'] as const,
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * List companies with optional filters
 */
export function useCompanies(params: CompanyListParams = {}) {
  return useQuery({
    queryKey: companyKeys.list(params),
    queryFn: () => api.companies.list(params),
    staleTime: STALE_TIME.LONG,
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Get a single company by slug
 */
export function useCompany(slug: string | undefined, jobPage = 1, jobLimit = 20) {
  return useQuery({
    queryKey: companyKeys.detail(slug || ''),
    queryFn: () => api.companies.get(slug!, jobPage, jobLimit),
    staleTime: STALE_TIME.LONG,
    enabled: !!slug,
    select: (data) => data.data,
  });
}

/**
 * Get top companies by job count
 */
export function useTopCompanies(limit = 10) {
  return useQuery({
    queryKey: companyKeys.top(limit),
    queryFn: () => api.companies.top(limit),
    staleTime: STALE_TIME.LONG,
    select: (data) => data.data,
  });
}

/**
 * Get company statistics
 */
export function useCompanyStats() {
  return useQuery({
    queryKey: companyKeys.stats(),
    queryFn: () => api.companies.stats(),
    staleTime: STALE_TIME.LONG,
    select: (data) => data.data,
  });
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Format company size for display
 */
export function formatCompanySize(size: string | null): string {
  if (!size) return 'Unknown size';
  
  const sizeLabels: Record<string, string> = {
    startup: '1-10 employees',
    small: '11-50 employees',
    medium: '51-200 employees',
    large: '201-1000 employees',
    enterprise: '1000+ employees',
  };
  
  return sizeLabels[size] || size;
}

/**
 * Format industry for display
 */
export function formatIndustry(industry: string | null): string {
  if (!industry) return 'Technology';
  
  return industry
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
