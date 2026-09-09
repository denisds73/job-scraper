/**
 * Scrape Service
 * =============================================================================
 * Orchestrates the scraping process.
 */

import type { JobSource, Company } from '@jobscout/shared';
import { getAdapter, type BaseAdapter, type CompanyInfo } from '../adapters/index.js';
import { normalizeJob } from '../processors/index.js';
import { StorageService, type CompanyData } from './storage.js';
import { createLogger, type Logger } from '../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ScrapeOptions {
  source?: JobSource;
  companies?: CompanyInfo[];
  dryRun?: boolean;
  removeStale?: boolean;
}

export interface ScrapeResult {
  source: JobSource;
  company: string;
  jobsFound: number;
  jobsCreated: number;
  jobsUpdated: number;
  jobsRemoved: number;
  errors: string[];
  duration: number;
}

export interface ScrapeSummary {
  totalCompanies: number;
  totalJobsFound: number;
  totalJobsCreated: number;
  totalJobsUpdated: number;
  totalJobsRemoved: number;
  totalErrors: number;
  duration: number;
  results: ScrapeResult[];
}

// =============================================================================
// SERVICE
// =============================================================================

export class ScrapeService {
  private storage: StorageService;
  private logger: Logger;

  constructor(storage?: StorageService) {
    this.storage = storage || new StorageService();
    this.logger = createLogger({ service: 'scrape' });
  }

  /**
   * Scrape jobs from a single company
   */
  async scrapeCompany(
    adapter: BaseAdapter,
    companyInfo: CompanyInfo,
    options: { dryRun?: boolean; removeStale?: boolean } = {}
  ): Promise<ScrapeResult> {
    const startTime = Date.now();
    const result: ScrapeResult = {
      source: adapter.source,
      company: companyInfo.name,
      jobsFound: 0,
      jobsCreated: 0,
      jobsUpdated: 0,
      jobsRemoved: 0,
      errors: [],
      duration: 0,
    };

    this.logger.info(`Scraping ${companyInfo.name}`, { 
      source: adapter.source,
      slug: companyInfo.slug,
    });

    try {
      // Fetch raw jobs from ATS
      const rawJobs = await adapter.fetchJobs(companyInfo.slug);
      result.jobsFound = rawJobs.length;

      if (rawJobs.length === 0) {
        this.logger.info(`No jobs found for ${companyInfo.name}`);
        result.duration = Date.now() - startTime;
        return result;
      }

      // Ensure company exists
      const companyData: CompanyData = {
        name: companyInfo.name,
        slug: companyInfo.slug,
        careerPageUrl: companyInfo.careerPageUrl || adapter.getCareerPageUrl(companyInfo.slug),
        atsType: adapter.source,
      };
      const companyId = await this.storage.ensureCompany(companyData);

      // Create a minimal company object for normalization
      const company: Company = {
        id: companyId,
        name: companyInfo.name,
        slug: companyInfo.slug,
        logo: null,
        description: null,
        website: null,
        careerPageUrl: companyData.careerPageUrl,
        industry: null,
        size: null,
        foundedYear: null,
        headquarters: null,
        atsType: adapter.source,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Normalize jobs
      const normalizedJobs = rawJobs.map(raw => 
        normalizeJob(raw, company, adapter.source)
      );

      // Save to database
      const storageResult = await this.storage.saveJobs(normalizedJobs, options.dryRun);
      result.jobsCreated = storageResult.created;
      result.jobsUpdated = storageResult.updated;

      // Remove stale jobs
      if (options.removeStale && !options.dryRun) {
        const currentJobIds = rawJobs.map(j => j.externalId);
        result.jobsRemoved = await this.storage.markStaleJobs(
          adapter.source,
          companyId,
          currentJobIds
        );
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      result.errors.push(message);
      this.logger.error(`Failed to scrape ${companyInfo.name}`, error as Error);
    }

    result.duration = Date.now() - startTime;
    return result;
  }

  /**
   * Scrape multiple companies
   */
  async scrapeCompanies(
    source: JobSource,
    companies: CompanyInfo[],
    options: { dryRun?: boolean; removeStale?: boolean } = {}
  ): Promise<ScrapeSummary> {
    const startTime = Date.now();
    const adapter = getAdapter(source);
    const results: ScrapeResult[] = [];

    this.logger.info(`Starting scrape for ${companies.length} companies`, { source });

    for (let i = 0; i < companies.length; i++) {
      const company = companies[i];
      this.logger.progress(i + 1, companies.length, `${company.name}`);
      
      const result = await this.scrapeCompany(adapter, company, options);
      results.push(result);
    }

    const summary: ScrapeSummary = {
      totalCompanies: companies.length,
      totalJobsFound: results.reduce((sum, r) => sum + r.jobsFound, 0),
      totalJobsCreated: results.reduce((sum, r) => sum + r.jobsCreated, 0),
      totalJobsUpdated: results.reduce((sum, r) => sum + r.jobsUpdated, 0),
      totalJobsRemoved: results.reduce((sum, r) => sum + r.jobsRemoved, 0),
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
      duration: Date.now() - startTime,
      results,
    };

    this.logger.info(`Scrape complete`, {
      companies: summary.totalCompanies,
      found: summary.totalJobsFound,
      created: summary.totalJobsCreated,
      updated: summary.totalJobsUpdated,
      removed: summary.totalJobsRemoved,
      errors: summary.totalErrors,
      duration: `${summary.duration}ms`,
    });

    return summary;
  }

  /**
   * Clean up
   */
  async shutdown(): Promise<void> {
    await this.storage.disconnect();
  }
}
