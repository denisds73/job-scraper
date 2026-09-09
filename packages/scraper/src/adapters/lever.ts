/**
 * Lever Adapter
 * =============================================================================
 * Scraper adapter for Lever ATS.
 * API Docs: https://github.com/lever/postings-api
 */

import { BaseAdapter, type RawJob, type AdapterConfig } from './base.js';
import type { JobSource } from '@jobscout/shared';

// =============================================================================
// LEVER API TYPES
// =============================================================================

interface LeverPosting {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl: string;
  createdAt: number;
  updatedAt?: number;
  categories: {
    commitment?: string;
    department?: string;
    level?: string;
    location?: string;
    team?: string;
  };
  description: string;
  descriptionPlain: string;
  lists: Array<{
    text: string;
    content: string;
  }>;
  additional?: string;
  additionalPlain?: string;
  workplaceType?: string;
  salaryRange?: {
    min?: number;
    max?: number;
    currency?: string;
    interval?: string;
  };
}

// =============================================================================
// ADAPTER
// =============================================================================

export class LeverAdapter extends BaseAdapter {
  readonly source: JobSource = 'lever';
  
  readonly config: AdapterConfig = {
    baseUrl: 'https://api.lever.co/v0/postings',
    rateLimit: 2,
    timeout: 15000,
  };

  /**
   * Get the career page URL for a company
   */
  getCareerPageUrl(companySlug: string): string {
    return `https://jobs.lever.co/${companySlug}`;
  }

  /**
   * Fetch all jobs for a company
   */
  async fetchJobs(companySlug: string): Promise<RawJob[]> {
    const url = `${this.config.baseUrl}/${companySlug}?mode=json`;
    
    this.logger.debug(`Fetching jobs from Lever`, { company: companySlug });
    
    try {
      const postings = await this.fetch<LeverPosting[]>(url);
      
      this.logger.info(`Found ${postings.length} jobs`, { 
        company: companySlug,
        count: postings.length,
      });

      return postings.map(posting => this.transformPosting(posting));
    } catch (error) {
      this.logger.error(`Failed to fetch jobs from Lever`, error as Error, {
        company: companySlug,
      });
      throw error;
    }
  }

  /**
   * Fetch a single job by ID
   */
  async fetchJob(companySlug: string, jobId: string): Promise<RawJob | null> {
    const url = `${this.config.baseUrl}/${companySlug}/${jobId}`;
    
    try {
      const posting = await this.fetch<LeverPosting>(url);
      return this.transformPosting(posting);
    } catch (error) {
      this.logger.warn(`Job not found`, { company: companySlug, jobId });
      return null;
    }
  }

  /**
   * Transform Lever posting to RawJob
   */
  private transformPosting(posting: LeverPosting): RawJob {
    // Build full description from lists
    const descriptionParts = [posting.description];
    
    for (const list of posting.lists || []) {
      if (list.text && list.content) {
        descriptionParts.push(`<h3>${list.text}</h3>${list.content}`);
      }
    }
    
    if (posting.additional) {
      descriptionParts.push(posting.additional);
    }

    return {
      externalId: posting.id,
      title: posting.text,
      description: descriptionParts.join('\n'),
      location: posting.categories?.location || 'Remote',
      department: posting.categories?.department || posting.categories?.team,
      postedAt: new Date(posting.createdAt),
      applyUrl: posting.applyUrl || posting.hostedUrl,
      metadata: {
        categories: posting.categories,
        workplaceType: posting.workplaceType,
        salaryRange: posting.salaryRange,
        commitment: posting.categories?.commitment,
        level: posting.categories?.level,
      },
    };
  }
}

// Export singleton instance
export const leverAdapter = new LeverAdapter();
