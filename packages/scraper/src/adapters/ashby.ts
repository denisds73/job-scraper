/**
 * Ashby Adapter
 * =============================================================================
 * Scraper adapter for Ashby ATS.
 * Uses the public job board API.
 */

import { BaseAdapter, type RawJob, type AdapterConfig } from './base.js';
import type { JobSource } from '@jobscout/shared';

// =============================================================================
// ASHBY API TYPES
// =============================================================================

interface AshbyJob {
  id: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  publishedAt: string;
  updatedAt?: string;
  location: string;
  department?: string;
  team?: string;
  employmentType?: string;
  isRemote?: boolean;
  applicationUrl?: string;
  compensationTierSummary?: string;
}

interface AshbyJobsResponse {
  jobs: AshbyJob[];
}

interface AshbyInfoResponse {
  name: string;
  aboutUs?: string;
  logoUrl?: string;
}

// =============================================================================
// ADAPTER
// =============================================================================

export class AshbyAdapter extends BaseAdapter {
  readonly source: JobSource = 'ashby';
  
  readonly config: AdapterConfig = {
    baseUrl: 'https://api.ashbyhq.com/posting-api/job-board',
    rateLimit: 1, // Be conservative with Ashby
    timeout: 15000,
  };

  /**
   * Get the career page URL for a company
   */
  getCareerPageUrl(companySlug: string): string {
    return `https://jobs.ashbyhq.com/${companySlug}`;
  }

  /**
   * Fetch all jobs for a company
   */
  async fetchJobs(companySlug: string): Promise<RawJob[]> {
    const url = `${this.config.baseUrl}/${companySlug}`;
    
    this.logger.debug(`Fetching jobs from Ashby`, { company: companySlug });
    
    try {
      const response = await this.fetch<AshbyJobsResponse>(url);
      
      const jobs = response.jobs || [];
      this.logger.info(`Found ${jobs.length} jobs`, { 
        company: companySlug,
        count: jobs.length,
      });

      return jobs.map(job => this.transformJob(job, companySlug));
    } catch (error) {
      this.logger.error(`Failed to fetch jobs from Ashby`, error as Error, {
        company: companySlug,
      });
      throw error;
    }
  }

  /**
   * Fetch company info
   */
  async fetchCompanyInfo(companySlug: string): Promise<AshbyInfoResponse | null> {
    const url = `${this.config.baseUrl}/${companySlug}/info`;
    
    try {
      return await this.fetch<AshbyInfoResponse>(url);
    } catch (error) {
      return null;
    }
  }

  /**
   * Transform Ashby job to RawJob
   */
  private transformJob(job: AshbyJob, companySlug: string): RawJob {
    const description = job.descriptionHtml || job.description;
    
    // Build application URL if not provided
    const applyUrl = job.applicationUrl || 
      `https://jobs.ashbyhq.com/${companySlug}/application?jobId=${job.id}`;

    return {
      externalId: job.id,
      title: job.title,
      description: description,
      location: this.extractLocation(job),
      department: job.department || job.team,
      postedAt: new Date(job.publishedAt),
      applyUrl,
      metadata: {
        employmentType: job.employmentType,
        isRemote: job.isRemote,
        compensationTierSummary: job.compensationTierSummary,
        team: job.team,
      },
    };
  }

  /**
   * Extract location from job
   */
  private extractLocation(job: AshbyJob): string {
    if (job.isRemote) {
      return job.location ? `Remote - ${job.location}` : 'Remote';
    }
    return job.location || 'Remote';
  }
}

// Export singleton instance
export const ashbyAdapter = new AshbyAdapter();
