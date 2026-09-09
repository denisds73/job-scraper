/**
 * Job-related type definitions
 * Shared across web, api, and scraper packages
 */

// ============================================
// ENUMS & UNION TYPES
// ============================================

export type JobSource = 
  | 'greenhouse' 
  | 'lever' 
  | 'ashby' 
  | 'workable' 
  | 'smartrecruiters';

export type LocationType = 'remote' | 'hybrid' | 'onsite';

export type EmploymentType = 
  | 'full-time' 
  | 'part-time' 
  | 'contract' 
  | 'internship';

export type ExperienceLevel = 
  | 'entry' 
  | 'mid' 
  | 'senior' 
  | 'staff' 
  | 'principal';

export type SalaryPeriod = 'yearly' | 'monthly' | 'hourly';

// ============================================
// CORE INTERFACES
// ============================================

export interface SalaryRange {
  min: number | null;
  max: number | null;
  currency: string;
  period: SalaryPeriod;
}

export interface Job {
  id: string;
  externalId: string;
  source: JobSource;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  isRemote: boolean;
  locationType: LocationType;
  employmentType: EmploymentType;
  experienceLevel: ExperienceLevel | null;
  salary: SalaryRange | null;
  skills: string[];
  department: string | null;
  postedAt: Date;
  expiresAt: Date | null;
  lastSeenAt: Date;
  sourceUrl: string;
  companyId: string;
  company?: Company;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PARTIAL/INPUT TYPES
// ============================================

export interface JobCreateInput {
  externalId: string;
  source: JobSource;
  title: string;
  description: string;
  requirements?: string[];
  location: string;
  isRemote?: boolean;
  locationType: LocationType;
  employmentType: EmploymentType;
  experienceLevel?: ExperienceLevel | null;
  salary?: SalaryRange | null;
  skills?: string[];
  department?: string | null;
  postedAt: Date;
  expiresAt?: Date | null;
  sourceUrl: string;
  companyId: string;
}

export interface JobUpdateInput {
  title?: string;
  description?: string;
  requirements?: string[];
  location?: string;
  isRemote?: boolean;
  locationType?: LocationType;
  employmentType?: EmploymentType;
  experienceLevel?: ExperienceLevel | null;
  salary?: SalaryRange | null;
  skills?: string[];
  department?: string | null;
  expiresAt?: Date | null;
  lastSeenAt?: Date;
}

// ============================================
// QUERY/FILTER TYPES
// ============================================

export interface JobFilters {
  query?: string;
  location?: string;
  isRemote?: boolean;
  locationType?: LocationType | LocationType[];
  employmentType?: EmploymentType | EmploymentType[];
  experienceLevel?: ExperienceLevel | ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  skills?: string[];
  companyId?: string;
  source?: JobSource | JobSource[];
  postedAfter?: Date;
  postedBefore?: Date;
}

export interface JobSortOptions {
  field: 'postedAt' | 'salary' | 'title' | 'company';
  direction: 'asc' | 'desc';
}

// ============================================
// RESPONSE TYPES
// ============================================

export interface JobListItem {
  id: string;
  title: string;
  company: {
    id: string;
    name: string;
    logo: string | null;
  };
  location: string;
  locationType: LocationType;
  employmentType: EmploymentType;
  salary: SalaryRange | null;
  skills: string[];
  postedAt: Date;
  sourceUrl: string;
  isNew?: boolean;
  isFeatured?: boolean;
}

export interface JobDetail extends Job {
  company: Company;
  similarJobs?: JobListItem[];
}

// Import Company type
import type { Company } from './company.js';
