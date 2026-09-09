/**
 * Storage Service
 * =============================================================================
 * Persist scraped jobs to database.
 */

import { PrismaClient } from '@prisma/client';
import type { NormalizedJob } from '../adapters/base.js';
import type { JobSource } from '@jobscout/shared';
import { createLogger } from '../utils/logger.js';

const logger = createLogger({ service: 'storage' });

// =============================================================================
// TYPES
// =============================================================================

export interface StorageResult {
  created: number;
  updated: number;
  unchanged: number;
  errors: number;
}

export interface CompanyData {
  name: string;
  slug: string;
  careerPageUrl: string;
  atsType: JobSource;
  logo?: string;
  description?: string;
  website?: string;
}

// =============================================================================
// SERVICE
// =============================================================================

export class StorageService {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    this.prisma = prisma || new PrismaClient();
  }

  /**
   * Ensure company exists in database
   */
  async ensureCompany(data: CompanyData): Promise<string> {
    const existing = await this.prisma.company.findFirst({
      where: {
        OR: [
          { slug: data.slug },
          { careerPageUrl: data.careerPageUrl },
        ],
      },
    });

    if (existing) {
      return existing.id;
    }

    const atsTypeMap: Record<JobSource, string> = {
      greenhouse: 'GREENHOUSE',
      lever: 'LEVER',
      ashby: 'ASHBY',
      workable: 'WORKABLE',
      smartrecruiters: 'SMARTRECRUITERS',
    };

    const company = await this.prisma.company.create({
      data: {
        name: data.name,
        slug: data.slug,
        careerPageUrl: data.careerPageUrl,
        atsType: atsTypeMap[data.atsType] as 'GREENHOUSE' | 'LEVER' | 'ASHBY' | 'WORKABLE' | 'SMARTRECRUITERS',
        logo: data.logo,
        description: data.description,
        website: data.website,
      },
    });

    logger.info(`Created company: ${data.name}`, { companyId: company.id });
    return company.id;
  }

  /**
   * Save jobs to database
   */
  async saveJobs(jobs: NormalizedJob[], dryRun = false): Promise<StorageResult> {
    const result: StorageResult = {
      created: 0,
      updated: 0,
      unchanged: 0,
      errors: 0,
    };

    if (dryRun) {
      logger.info(`Dry run: would save ${jobs.length} jobs`);
      return { ...result, created: jobs.length };
    }

    const sourceMap: Record<JobSource, string> = {
      greenhouse: 'GREENHOUSE',
      lever: 'LEVER',
      ashby: 'ASHBY',
      workable: 'WORKABLE',
      smartrecruiters: 'SMARTRECRUITERS',
    };

    const locationTypeMap = {
      remote: 'REMOTE',
      hybrid: 'HYBRID',
      onsite: 'ONSITE',
    } as const;

    const employmentTypeMap = {
      'full-time': 'FULL_TIME',
      'part-time': 'PART_TIME',
      'contract': 'CONTRACT',
      'internship': 'INTERNSHIP',
    } as const;

    const experienceLevelMap = {
      entry: 'ENTRY',
      mid: 'MID',
      senior: 'SENIOR',
      staff: 'STAFF',
      principal: 'PRINCIPAL',
    } as const;

    const salaryPeriodMap = {
      yearly: 'YEARLY',
      monthly: 'MONTHLY',
      hourly: 'HOURLY',
    } as const;

    for (const job of jobs) {
      try {
        const source = sourceMap[job.source];
        
        const existing = await this.prisma.job.findUnique({
          where: {
            unique_job_per_source: {
              externalId: job.externalId,
              source: source as 'GREENHOUSE' | 'LEVER' | 'ASHBY' | 'WORKABLE' | 'SMARTRECRUITERS',
            },
          },
        });

        const jobData = {
          externalId: job.externalId,
          source: source as 'GREENHOUSE' | 'LEVER' | 'ASHBY' | 'WORKABLE' | 'SMARTRECRUITERS',
          title: job.title,
          description: job.description,
          requirements: job.requirements,
          location: job.location,
          isRemote: job.isRemote,
          locationType: locationTypeMap[job.locationType],
          employmentType: employmentTypeMap[job.employmentType],
          experienceLevel: job.experienceLevel ? experienceLevelMap[job.experienceLevel] : null,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          salaryCurrency: job.salaryCurrency,
          salaryPeriod: salaryPeriodMap[job.salaryPeriod],
          skills: job.skills,
          department: job.department,
          postedAt: job.postedAt,
          sourceUrl: job.sourceUrl,
          companyId: job.companyId,
          lastSeenAt: new Date(),
        };

        if (existing) {
          await this.prisma.job.update({
            where: { id: existing.id },
            data: jobData,
          });
          result.updated++;
        } else {
          await this.prisma.job.create({
            data: jobData,
          });
          result.created++;
        }
      } catch (error) {
        logger.error(`Failed to save job: ${job.externalId}`, error as Error);
        result.errors++;
      }
    }

    logger.info(`Storage complete`, result);
    return result;
  }

  /**
   * Mark stale jobs (not seen in current scrape)
   */
  async markStaleJobs(
    source: JobSource,
    companyId: string,
    currentJobIds: string[]
  ): Promise<number> {
    const sourceMap: Record<JobSource, string> = {
      greenhouse: 'GREENHOUSE',
      lever: 'LEVER',
      ashby: 'ASHBY',
      workable: 'WORKABLE',
      smartrecruiters: 'SMARTRECRUITERS',
    };

    // Delete jobs that weren't seen in this scrape
    const result = await this.prisma.job.deleteMany({
      where: {
        source: sourceMap[source] as 'GREENHOUSE' | 'LEVER' | 'ASHBY' | 'WORKABLE' | 'SMARTRECRUITERS',
        companyId,
        externalId: { notIn: currentJobIds },
      },
    });

    if (result.count > 0) {
      logger.info(`Removed ${result.count} stale jobs`, { source, companyId });
    }

    return result.count;
  }

  /**
   * Close database connection
   */
  async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}
