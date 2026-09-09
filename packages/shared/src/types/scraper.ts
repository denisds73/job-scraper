/**
 * Scraper-related type definitions
 */

import type { JobSource } from './job.js';

// ============================================
// RAW JOB DATA (from ATS APIs)
// ============================================

export interface RawJob {
  externalId: string;
  title: string;
  description: string;
  location: string;
  department?: string;
  postedAt: Date;
  applyUrl: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// ADAPTER CONFIGURATION
// ============================================

export interface AdapterConfig {
  baseUrl: string;
  rateLimit: number; // requests per second
  timeout: number;   // milliseconds
  retries: number;
  retryDelay: number; // milliseconds
}

export interface CompanyConfig {
  slug: string;
  name: string;
  enabled?: boolean;
  customConfig?: Partial<AdapterConfig>;
}

// ============================================
// SCRAPE TRACKING
// ============================================

export type ScrapeStatus = 'running' | 'success' | 'partial' | 'failed';

export interface ScrapeResult {
  source: JobSource;
  companySlug: string;
  status: ScrapeStatus;
  jobsFound: number;
  jobsCreated: number;
  jobsUpdated: number;
  jobsRemoved: number;
  errors: ScrapeError[];
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
}

export interface ScrapeError {
  code: string;
  message: string;
  jobExternalId?: string;
  stack?: string;
  timestamp: Date;
}

export interface ScrapeSummary {
  source: JobSource;
  totalCompanies: number;
  successfulCompanies: number;
  failedCompanies: number;
  totalJobsFound: number;
  totalJobsCreated: number;
  totalJobsUpdated: number;
  totalJobsRemoved: number;
  totalErrors: number;
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
}

// ============================================
// PROCESSING TYPES
// ============================================

export interface NormalizedJob {
  externalId: string;
  source: JobSource;
  title: string;
  description: string;
  requirements: string[];
  location: string;
  isRemote: boolean;
  locationType: 'remote' | 'hybrid' | 'onsite';
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'staff' | 'principal' | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  skills: string[];
  department: string | null;
  postedAt: Date;
  sourceUrl: string;
  companySlug: string;
}

export interface SalaryParseResult {
  min: number | null;
  max: number | null;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
  confidence: number; // 0-1
}

export interface SkillExtractionResult {
  skills: string[];
  confidence: Record<string, number>; // skill -> confidence
}
