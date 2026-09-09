/**
 * Greenhouse Adapter
 * =============================================================================
 * Scraper adapter for Greenhouse ATS.
 * API Docs: https://developers.greenhouse.io/job-board.html
 */

import { BaseAdapter, type RawJob, type AdapterConfig } from './base.js';
import type { JobSource } from '@jobscout/shared';

// =============================================================================
// GREENHOUSE API TYPES
// =============================================================================

interface GreenhouseJob {
  id: number;
  title: string;
  content: string;
  updated_at: string;
  absolute_url: string;
  location: {
    name: string;
  };
  departments: Array<{
    id: number;
    name: string;
  }>;
  offices: Array<{
    id: number;
    name: string;
    location: string;
  }>;
  metadata?: Array<{
    id: number;
    name: string;
    value: string | string[] | null;
    value_type: string;
  }>;
}

interface GreenhouseJobsResponse {
  jobs: GreenhouseJob[];
  meta?: {
    total: number;
  };
}

interface GreenhouseJobDetailResponse {
  id: number;
  title: string;
  content: string;
  updated_at: string;
  absolute_url: string;
  location: {
    name: string;
  };
  departments: Array<{
    id: number;
    name: string;
  }>;
}

// =============================================================================
// ADAPTER
// =============================================================================

export class GreenhouseAdapter extends BaseAdapter {
  readonly source: JobSource = 'greenhouse';
  
  readonly config: AdapterConfig = {
    baseUrl: 'https://boards-api.greenhouse.io/v1/boards',
    rateLimit: 2, // 2 requests per second
    timeout: 15000,
  };

  /**
   * Get the career page URL for a company
   */
  getCareerPageUrl(companySlug: string): string {
    return `https://boards.greenhouse.io/${companySlug}`;
  }

  /**
   * Fetch all jobs for a company
   */
  async fetchJobs(companySlug: string): Promise<RawJob[]> {
    const url = `${this.config.baseUrl}/${companySlug}/jobs?content=true`;
    
    this.logger.debug(`Fetching jobs from Greenhouse`, { company: companySlug });
    
    try {
      const response = await this.fetch<GreenhouseJobsResponse>(url);
      
      this.logger.info(`Found ${response.jobs.length} jobs`, { 
        company: companySlug,
        count: response.jobs.length,
      });

      return response.jobs.map(job => this.transformJob(job));
    } catch (error) {
      this.logger.error(`Failed to fetch jobs from Greenhouse`, error as Error, {
        company: companySlug,
      });
      throw error;
    }
  }

  /**
   * Fetch a single job by ID
   */
  async fetchJob(companySlug: string, jobId: string): Promise<RawJob | null> {
    const url = `${this.config.baseUrl}/${companySlug}/jobs/${jobId}`;
    
    try {
      const job = await this.fetch<GreenhouseJobDetailResponse>(url);
      return this.transformJob(job as GreenhouseJob);
    } catch (error) {
      this.logger.warn(`Job not found`, { company: companySlug, jobId });
      return null;
    }
  }

  /**
   * Transform Greenhouse job format to RawJob
   */
  private transformJob(job: GreenhouseJob): RawJob {
    return {
      externalId: String(job.id),
      title: job.title,
      description: job.content,
      location: this.extractLocation(job),
      department: job.departments?.[0]?.name,
      postedAt: new Date(job.updated_at),
      applyUrl: job.absolute_url,
      metadata: {
        departments: job.departments,
        offices: job.offices,
        customMetadata: job.metadata,
      },
    };
  }

  /**
   * Extract location from job data
   */
  private extractLocation(job: GreenhouseJob): string {
    // Primary location
    if (job.location?.name) {
      return job.location.name;
    }

    // Fall back to first office
    if (job.offices?.[0]) {
      const office = job.offices[0];
      return office.location || office.name;
    }

    return 'Remote';
  }
}

// Export singleton instance
export const greenhouseAdapter = new GreenhouseAdapter();
