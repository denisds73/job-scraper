/**
 * Company-related type definitions
 */

import type { JobSource, JobListItem } from './job.js';

// ============================================
// ENUMS & UNION TYPES
// ============================================

export type CompanySize =
  | '1-10'
  | '11-50'
  | '51-200'
  | '201-500'
  | '501-1000'
  | '1001-5000'
  | '5000+';

// ============================================
// CORE INTERFACES
// ============================================

export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  website: string | null;
  careerPageUrl: string;
  industry: string | null;
  size: CompanySize | null;
  foundedYear: number | null;
  headquarters: string | null;
  atsType: JobSource;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// INPUT TYPES
// ============================================

export interface CompanyCreateInput {
  name: string;
  slug: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  careerPageUrl: string;
  industry?: string | null;
  size?: CompanySize | null;
  foundedYear?: number | null;
  headquarters?: string | null;
  atsType: JobSource;
}

export interface CompanyUpdateInput {
  name?: string;
  logo?: string | null;
  description?: string | null;
  website?: string | null;
  careerPageUrl?: string;
  industry?: string | null;
  size?: CompanySize | null;
  foundedYear?: number | null;
  headquarters?: string | null;
}

// ============================================
// QUERY TYPES
// ============================================

export interface CompanyFilters {
  query?: string;
  industry?: string;
  size?: CompanySize | CompanySize[];
  atsType?: JobSource | JobSource[];
  hasOpenJobs?: boolean;
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface CompanyListItem {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  industry: string | null;
  size: CompanySize | null;
  jobCount: number;
}

export interface CompanyDetail extends Company {
  jobs: JobListItem[];
  jobCount: number;
}
