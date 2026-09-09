/**
 * Job Hooks
 * =============================================================================
 * React Query hooks for job data.
 */

import { useQuery } from '@tanstack/react-query';
import { api, type JobSearchParams, type JobListItem, type JobDetail } from '../lib/api';
import { STALE_TIME } from '../lib/query-provider';

// =============================================================================
// QUERY KEYS
// =============================================================================

export const jobKeys = {
  all: ['jobs'] as const,
  lists: () => [...jobKeys.all, 'list'] as const,
  list: (params: Record<string, unknown>) => [...jobKeys.lists(), params] as const,
  searches: () => [...jobKeys.all, 'search'] as const,
  search: (params: JobSearchParams) => [...jobKeys.searches(), params] as const,
  details: () => [...jobKeys.all, 'detail'] as const,
  detail: (id: string) => [...jobKeys.details(), id] as const,
  suggestions: (q: string) => [...jobKeys.all, 'suggestions', q] as const,
};

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Search jobs with filters
 */
export function useJobSearch(params: JobSearchParams = {}, enabled = true) {
  return useQuery({
    queryKey: jobKeys.search(params),
    queryFn: () => api.jobs.search(params),
    staleTime: STALE_TIME.MEDIUM,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
    enabled,
  });
}

/**
 * Get recent jobs
 */
export function useRecentJobs(limit = 20) {
  return useQuery({
    queryKey: jobKeys.list({ limit, recent: true }),
    queryFn: () => api.jobs.search({ limit, sortBy: 'postedAt', sortDir: 'desc' }),
    staleTime: STALE_TIME.MEDIUM,
  });
}

/**
 * Get a single job by ID
 */
export function useJob(id: string | undefined) {
  return useQuery({
    queryKey: jobKeys.detail(id || ''),
    queryFn: () => api.jobs.get(id!),
    staleTime: STALE_TIME.LONG,
    enabled: !!id,
    select: (data) => data.data, // Unwrap the response
  });
}

/**
 * Get job title suggestions for autocomplete
 */
export function useJobSuggestions(query: string, enabled = true) {
  return useQuery({
    queryKey: jobKeys.suggestions(query),
    queryFn: () => api.jobs.suggestions(query),
    staleTime: STALE_TIME.LONG,
    enabled: enabled && query.length >= 2,
    select: (data) => data.data,
  });
}

// =============================================================================
// HELPER HOOKS
// =============================================================================

/**
 * Get jobs by company
 */
export function useJobsByCompany(companyId: string | undefined, page = 1, limit = 20) {
  return useQuery({
    queryKey: jobKeys.list({ companyId, page, limit }),
    queryFn: () => api.jobs.search({ companyId, page, limit }),
    staleTime: STALE_TIME.MEDIUM,
    enabled: !!companyId,
  });
}

/**
 * Format job for display
 */
export function formatJobForDisplay(job: JobListItem | JobDetail) {
  const postedDate = new Date(job.postedAt);
  const now = new Date();
  const diffMs = now.getTime() - postedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  let postedAtFormatted: string;
  if (diffDays === 0) {
    postedAtFormatted = 'Today';
  } else if (diffDays === 1) {
    postedAtFormatted = 'Yesterday';
  } else if (diffDays < 7) {
    postedAtFormatted = `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    postedAtFormatted = `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  } else {
    postedAtFormatted = postedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }

  const isNew = diffDays <= 1;

  return {
    ...job,
    postedAtFormatted,
    isNew,
  };
}

/**
 * Format salary for display - India-focused with INR and Lakhs
 */
export function formatSalary(salary: JobListItem['salary']): string {
  if (!salary) return '';
  
  const { min, max, currency, period } = salary;

  // INR formatting with Lakhs/Crores
  if (currency === 'INR') {
    const formatINR = (n: number): string => {
      if (n >= 10000000) {
        // Crores (1Cr = 10,000,000)
        const crores = n / 10000000;
        return `₹${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)}Cr`;
      }
      if (n >= 100000) {
        // Lakhs (1L = 100,000)
        const lakhs = n / 100000;
        return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`;
      }
      return `₹${n.toLocaleString('en-IN')}`;
    };

    let range: string;
    if (min && max && min !== max) {
      range = `${formatINR(min)} - ${formatINR(max)}`;
    } else if (min) {
      range = formatINR(min);
    } else if (max) {
      range = `Up to ${formatINR(max)}`;
    } else {
      return '';
    }

    const periodLabel = period === 'yearly' ? '/yr' : period === 'monthly' ? '/mo' : '/hr';
    return `${range}${periodLabel}`;
  }
  
  // Fallback for other currencies (USD, GBP, etc.)
  const formatNumber = (n: number) => {
    if (n >= 1000) {
      return `${Math.round(n / 1000)}k`;
    }
    return n.toLocaleString();
  };

  const currencySymbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : currency;
  
  let range: string;
  if (min && max && min !== max) {
    range = `${currencySymbol}${formatNumber(min)} - ${currencySymbol}${formatNumber(max)}`;
  } else if (min) {
    range = `${currencySymbol}${formatNumber(min)}`;
  } else if (max) {
    range = `Up to ${currencySymbol}${formatNumber(max)}`;
  } else {
    return '';
  }

  const periodLabel = period === 'yearly' ? '/yr' : period === 'monthly' ? '/mo' : '/hr';
  
  return `${range}${periodLabel}`;
}
