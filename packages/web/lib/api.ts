/**
 * API Client
 * =============================================================================
 * Type-safe API client for JobScout backend.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiError;
  meta: {
    timestamp: string;
    path: string;
    requestId?: string;
  };
}

// Job types
export interface JobCompany {
  id: string;
  name: string;
  logo: string | null;
}

export interface JobSalary {
  min: number | null;
  max: number | null;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

export interface JobListItem {
  id: string;
  title: string;
  company: JobCompany;
  location: string;
  locationType: 'remote' | 'hybrid' | 'onsite';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary: JobSalary | null;
  skills: string[];
  postedAt: string;
  sourceUrl: string;
  isNew?: boolean;
}

export interface JobDetail extends JobListItem {
  externalId: string;
  source: string;
  description: string;
  requirements: string[];
  experienceLevel: 'entry' | 'mid' | 'senior' | 'staff' | 'principal' | null;
  department: string | null;
  expiresAt: string | null;
  lastSeenAt: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  similarJobs?: JobListItem[];
}

// Company types
export interface CompanyListItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  industry: string | null;
  size: string | null;
  jobCount: number;
}

export interface CompanyDetail extends CompanyListItem {
  description: string | null;
  website: string | null;
  careerPageUrl: string;
  foundedYear: number | null;
  headquarters: string | null;
  atsType: string;
  createdAt: string;
  updatedAt: string;
  jobs: JobListItem[];
}

// Filter types
export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface SalaryRange {
  min: number;
  max: number | null;
  label: string;
}

export interface FiltersData {
  locations: FilterOption[];
  locationTypes: FilterOption[];
  employmentTypes: FilterOption[];
  experienceLevels: FilterOption[];
  sources: FilterOption[];
  skills: FilterOption[];
  salaryRanges: SalaryRange[];
}

// Search params
export interface JobSearchParams {
  q?: string;
  location?: string;
  remote?: boolean;
  locationType?: string | string[];
  employmentType?: string | string[];
  experienceLevel?: string | string[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string | string[];
  companyId?: string;
  source?: string | string[];
  sortBy?: 'postedAt' | 'salary' | 'title' | 'company';
  sortDir?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CompanyListParams {
  q?: string;
  industry?: string;
  size?: string;
  hasJobs?: boolean;
  page?: number;
  limit?: number;
}

// =============================================================================
// ERROR CLASS
// =============================================================================

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// =============================================================================
// HELPERS
// =============================================================================

function toQueryString<T extends Record<string, unknown>>(params: T): string {
  const searchParams = new URLSearchParams();
  
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    
    if (Array.isArray(value)) {
      value.forEach(v => searchParams.append(key, String(v)));
    } else {
      searchParams.append(key, String(value));
    }
  }
  
  return searchParams.toString();
}

// =============================================================================
// NORMALIZERS
// =============================================================================

/**
 * Normalize API enum values to lowercase
 */
function normalizeEnum<T extends string>(value: string): T {
  return value.toLowerCase().replace(/_/g, '-') as T;
}

/**
 * Normalize job list item from API response
 */
function normalizeJobListItem(job: Record<string, unknown>): JobListItem {
  return {
    ...job,
    locationType: normalizeEnum<JobListItem['locationType']>(job.locationType as string),
    employmentType: normalizeEnum<JobListItem['employmentType']>(job.employmentType as string),
    salary: job.salary ? {
      ...(job.salary as Record<string, unknown>),
      period: normalizeEnum<JobSalary['period']>((job.salary as Record<string, unknown>).period as string),
    } as JobSalary : null,
  } as JobListItem;
}

/**
 * Normalize job detail from API response  
 */
function normalizeJobDetail(job: Record<string, unknown>): JobDetail {
  const normalized = normalizeJobListItem(job) as unknown as Record<string, unknown>;
  if (job.experienceLevel) {
    normalized.experienceLevel = normalizeEnum<NonNullable<JobDetail['experienceLevel']>>(job.experienceLevel as string);
  }
  return normalized as unknown as JobDetail;
}

/**
 * Normalize paginated response
 */
function normalizePaginatedJobs(response: Record<string, unknown>): PaginatedResponse<JobListItem> {
  return {
    data: ((response.data as Record<string, unknown>[]) || []).map(normalizeJobListItem),
    meta: response.meta as PaginationMeta,
  };
}

// =============================================================================
// API CLIENT
// =============================================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    let errorData: ApiErrorResponse | null = null;
    try {
      errorData = await response.json();
    } catch {
      // Ignore JSON parse errors
    }

    throw new ApiClientError(
      errorData?.error?.message || `HTTP ${response.status}`,
      response.status,
      errorData?.error?.code,
      errorData?.error?.details
    );
  }

  return response.json();
}

// =============================================================================
// API METHODS
// =============================================================================

export const api = {
  jobs: {
    search: async (params: JobSearchParams = {}): Promise<PaginatedResponse<JobListItem>> => {
      const response = await request<Record<string, unknown>>(`/api/jobs/search?${toQueryString(params as unknown as Record<string, unknown>)}`);
      return normalizePaginatedJobs(response);
    },
    
    list: async (params: { page?: number; limit?: number; source?: string; companyId?: string } = {}): Promise<PaginatedResponse<JobListItem>> => {
      const response = await request<Record<string, unknown>>(`/api/jobs?${toQueryString(params as Record<string, unknown>)}`);
      return normalizePaginatedJobs(response);
    },
    
    get: async (id: string): Promise<SingleResponse<JobDetail>> => {
      const response = await request<{ data: Record<string, unknown> }>(`/api/jobs/${id}`);
      return { data: normalizeJobDetail(response.data) };
    },
    
    suggestions: (q: string, limit = 10): Promise<{ data: string[] }> =>
      request(`/api/jobs/suggestions?q=${encodeURIComponent(q)}&limit=${limit}`),
  },

  companies: {
    list: (params: CompanyListParams = {}): Promise<PaginatedResponse<CompanyListItem>> =>
      request(`/api/companies?${toQueryString(params as unknown as Record<string, unknown>)}`),
    
    get: (slug: string, jobPage = 1, jobLimit = 20): Promise<SingleResponse<CompanyDetail>> =>
      request(`/api/companies/${slug}?jobPage=${jobPage}&jobLimit=${jobLimit}`),
    
    top: (limit = 10): Promise<{ data: CompanyListItem[] }> =>
      request(`/api/companies/top?limit=${limit}`),
    
    stats: (): Promise<SingleResponse<{ total: number; withJobs: number; byAtsType: Record<string, number> }>> =>
      request(`/api/companies/stats`),
  },

  filters: {
    get: (): Promise<SingleResponse<FiltersData>> =>
      request(`/api/filters`),
    
    skills: (q?: string, limit = 20): Promise<{ data: FilterOption[] }> =>
      request(`/api/filters/skills?${toQueryString({ q, limit })}`),
    
    locations: (q?: string, limit = 20): Promise<{ data: FilterOption[] }> =>
      request(`/api/filters/locations?${toQueryString({ q, limit })}`),
  },

  health: {
    check: (): Promise<{ status: string; timestamp: string; version: string }> =>
      request(`/health`),
  },
};
