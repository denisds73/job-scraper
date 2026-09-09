/**
 * Base Adapter
 * =============================================================================
 * Abstract base class for ATS adapters.
 */

import type { JobSource, Company } from '@jobscout/shared';
import { httpGet, getRateLimiter, createLogger, type HttpOptions } from '../utils/index.js';

// =============================================================================
// TYPES
// =============================================================================

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
  salaryPeriod: 'yearly' | 'monthly' | 'hourly';
  skills: string[];
  department: string | null;
  postedAt: Date;
  sourceUrl: string;
  companyId: string;
}

export interface AdapterConfig {
  baseUrl: string;
  rateLimit: number;
  timeout: number;
}

export interface CompanyInfo {
  slug: string;
  name: string;
  careerPageUrl?: string;
}

// =============================================================================
// BASE ADAPTER
// =============================================================================

export abstract class BaseAdapter {
  abstract readonly source: JobSource;
  abstract readonly config: AdapterConfig;

  protected logger = createLogger({ adapter: this.constructor.name });

  /**
   * Fetch all jobs for a company from the ATS API
   */
  abstract fetchJobs(companySlug: string): Promise<RawJob[]>;

  /**
   * Get the career page URL for a company
   */
  abstract getCareerPageUrl(companySlug: string): string;

  /**
   * Make rate-limited HTTP request
   */
  protected async fetch<T>(url: string): Promise<T> {
    const rateLimiter = getRateLimiter(this.source);
    const options: HttpOptions = {
      timeout: this.config.timeout,
      rateLimiter,
    };

    const response = await httpGet<T>(url, options);
    return response.data;
  }

  /**
   * Normalize a raw job into our standard format
   */
  normalizeJob(raw: RawJob, company: Company): NormalizedJob {
    return {
      externalId: raw.externalId,
      source: this.source,
      title: raw.title,
      description: this.cleanHtml(raw.description),
      requirements: this.extractRequirements(raw.description),
      location: raw.location,
      isRemote: this.isRemoteJob(raw.location, raw.title),
      locationType: this.inferLocationType(raw.location, raw.title),
      employmentType: this.inferEmploymentType(raw.title),
      experienceLevel: this.inferExperienceLevel(raw.title, raw.description),
      salaryMin: null,
      salaryMax: null,
      salaryCurrency: 'USD',
      salaryPeriod: 'yearly',
      skills: [],
      department: raw.department || null,
      postedAt: raw.postedAt,
      sourceUrl: raw.applyUrl,
      companyId: company.id,
    };
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  protected cleanHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  protected extractRequirements(description: string): string[] {
    const requirements: string[] = [];
    const text = this.cleanHtml(description);
    
    // Look for bullet points or numbered lists
    const lines = text.split(/[.!?]\s+/);
    for (const line of lines) {
      if (line.match(/^\s*[-•*]\s*/) || line.match(/^\s*\d+[.)]\s*/)) {
        const cleaned = line.replace(/^\s*[-•*\d.)]+\s*/, '').trim();
        if (cleaned.length > 10 && cleaned.length < 500) {
          requirements.push(cleaned);
        }
      }
    }

    return requirements.slice(0, 20);
  }

  protected isRemoteJob(location: string, title: string): boolean {
    const text = `${location} ${title}`.toLowerCase();
    return /\b(remote|work from home|wfh|anywhere|distributed)\b/.test(text);
  }

  protected inferLocationType(
    location: string,
    title: string
  ): 'remote' | 'hybrid' | 'onsite' {
    const text = `${location} ${title}`.toLowerCase();
    
    if (/\b(remote|work from home|wfh|anywhere|distributed)\b/.test(text)) {
      return 'remote';
    }
    if (/\b(hybrid|flexible)\b/.test(text)) {
      return 'hybrid';
    }
    return 'onsite';
  }

  protected inferEmploymentType(
    title: string
  ): 'full-time' | 'part-time' | 'contract' | 'internship' {
    const lower = title.toLowerCase();
    
    if (/\b(intern|internship|co-op|coop)\b/.test(lower)) {
      return 'internship';
    }
    if (/\b(contract|contractor|freelance|consultant)\b/.test(lower)) {
      return 'contract';
    }
    if (/\b(part[\s-]?time)\b/.test(lower)) {
      return 'part-time';
    }
    return 'full-time';
  }

  protected inferExperienceLevel(
    title: string,
    description: string
  ): 'entry' | 'mid' | 'senior' | 'staff' | 'principal' | null {
    const text = `${title} ${description}`.toLowerCase();
    
    if (/\b(principal|distinguished|fellow|director)\b/.test(text)) {
      return 'principal';
    }
    if (/\b(staff|lead|architect)\b/.test(text)) {
      return 'staff';
    }
    if (/\b(senior|sr\.?|iii|3)\b/.test(text)) {
      return 'senior';
    }
    if (/\b(junior|jr\.?|entry|new grad|graduate|i\b|1)\b/.test(text)) {
      return 'entry';
    }
    if (/\b(mid[\s-]?level|ii|2)\b/.test(text)) {
      return 'mid';
    }
    
    // Default based on years of experience mentioned
    const yearsMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)/);
    if (yearsMatch) {
      const years = parseInt(yearsMatch[1], 10);
      if (years <= 2) return 'entry';
      if (years <= 5) return 'mid';
      if (years <= 8) return 'senior';
      return 'staff';
    }

    return null;
  }
}

export type { Company };
