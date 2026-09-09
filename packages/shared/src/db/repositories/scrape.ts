/**
 * Scrape Repository
 * =============================================================================
 * Data access layer for scrape audit trail operations.
 */

import type { PrismaClient, Prisma, Scrape as PrismaScrape } from '@prisma/client';
import { BaseRepository } from './base.js';
import {
  type PaginationParams,
  type PaginatedResult,
  normalizePagination,
  createPaginatedResult,
} from '../utils/pagination.js';
import type { JobSource } from '../../types/job.js';
import type {
  ScrapeResult,
  ScrapeStatus,
  ScrapeError,
} from '../../types/scraper.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ScrapeRecord {
  id: string;
  source: JobSource;
  status: ScrapeStatus;
  companyId: string | null;
  companyName?: string;
  jobsFound: number;
  jobsCreated: number;
  jobsUpdated: number;
  jobsRemoved: number;
  errors: ScrapeError[];
  startedAt: Date;
  completedAt: Date | null;
  durationMs: number | null;
}

export interface ScrapeStats {
  totalScrapes: number;
  successfulScrapes: number;
  failedScrapes: number;
  totalJobsCreated: number;
  totalJobsUpdated: number;
  avgDurationMs: number;
  bySource: Record<string, {
    total: number;
    successful: number;
    avgDurationMs: number;
  }>;
}

// =============================================================================
// REPOSITORY
// =============================================================================

export class ScrapeRepository extends BaseRepository<
  PrismaScrape,
  Prisma.ScrapeCreateInput,
  Prisma.ScrapeUpdateInput,
  Prisma.ScrapeWhereInput,
  Prisma.ScrapeOrderByWithRelationInput
> {
  protected get model() {
    return this.prisma.scrape;
  }

  protected get defaultInclude() {
    return {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    };
  }

  // ===========================================================================
  // LIFECYCLE OPERATIONS
  // ===========================================================================

  /**
   * Start a new scrape operation
   */
  async startScrape(
    source: JobSource,
    companyId?: string
  ): Promise<ScrapeRecord> {
    const scrape = await this.prisma.scrape.create({
      data: {
        source: this.toSourceEnum(source),
        status: 'RUNNING',
        companyId,
        startedAt: new Date(),
      },
      include: this.defaultInclude,
    });

    return this.toScrapeRecord(scrape);
  }

  /**
   * Complete a scrape operation with results
   */
  async completeScrape(
    id: string,
    result: ScrapeResult
  ): Promise<ScrapeRecord> {
    const completedAt = new Date();
    const scrape = await this.prisma.scrape.findUnique({
      where: { id },
      select: { startedAt: true },
    });

    const durationMs = scrape
      ? completedAt.getTime() - scrape.startedAt.getTime()
      : null;

    const status = this.determineStatus(result);

    const updated = await this.prisma.scrape.update({
      where: { id },
      data: {
        status,
        jobsFound: result.jobsFound,
        jobsCreated: result.jobsCreated,
        jobsUpdated: result.jobsUpdated,
        jobsRemoved: result.jobsRemoved,
        errors: result.errors as unknown as Prisma.InputJsonValue[],
        completedAt,
        durationMs,
      },
      include: this.defaultInclude,
    });

    return this.toScrapeRecord(updated);
  }

  /**
   * Mark a scrape as failed
   */
  async failScrape(id: string, error: ScrapeError): Promise<ScrapeRecord> {
    const completedAt = new Date();
    const scrape = await this.prisma.scrape.findUnique({
      where: { id },
      select: { startedAt: true, errors: true },
    });

    const durationMs = scrape
      ? completedAt.getTime() - scrape.startedAt.getTime()
      : null;

    const existingErrors = (scrape?.errors as unknown as ScrapeError[]) ?? [];

    const updated = await this.prisma.scrape.update({
      where: { id },
      data: {
        status: 'FAILED',
        errors: [...existingErrors, error] as unknown as Prisma.InputJsonValue[],
        completedAt,
        durationMs,
      },
      include: this.defaultInclude,
    });

    return this.toScrapeRecord(updated);
  }

  /**
   * Add an error to an ongoing scrape
   */
  async addError(id: string, error: ScrapeError): Promise<void> {
    const scrape = await this.prisma.scrape.findUnique({
      where: { id },
      select: { errors: true },
    });

    const existingErrors = (scrape?.errors as unknown as ScrapeError[]) ?? [];

    await this.prisma.scrape.update({
      where: { id },
      data: {
        errors: [...existingErrors, error] as unknown as Prisma.InputJsonValue[],
      },
    });
  }

  // ===========================================================================
  // QUERY OPERATIONS
  // ===========================================================================

  /**
   * Get recent scrapes with pagination
   */
  async getRecent(
    source?: JobSource,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<ScrapeRecord>> {
    const { page, limit, skip, take } = normalizePagination(pagination ?? {});

    const where: Prisma.ScrapeWhereInput = source
      ? { source: this.toSourceEnum(source) }
      : {};

    const [scrapes, total] = await Promise.all([
      this.prisma.scrape.findMany({
        where,
        orderBy: { startedAt: 'desc' },
        skip,
        take,
        include: this.defaultInclude,
      }),
      this.prisma.scrape.count({ where }),
    ]);

    const records = scrapes.map((s) => this.toScrapeRecord(s));
    return createPaginatedResult(records, total, { page, limit });
  }

  /**
   * Get last scrape for a source/company
   */
  async getLastScrape(
    source: JobSource,
    companyId?: string
  ): Promise<ScrapeRecord | null> {
    const scrape = await this.prisma.scrape.findFirst({
      where: {
        source: this.toSourceEnum(source),
        companyId: companyId ?? undefined,
        status: { in: ['SUCCESS', 'PARTIAL'] },
      },
      orderBy: { startedAt: 'desc' },
      include: this.defaultInclude,
    });

    return scrape ? this.toScrapeRecord(scrape) : null;
  }

  /**
   * Get scrape statistics
   */
  async getStats(since?: Date): Promise<ScrapeStats> {
    const where: Prisma.ScrapeWhereInput = since
      ? { startedAt: { gte: since } }
      : {};

    const [totals, bySource, aggregates] = await Promise.all([
      // Total counts
      Promise.all([
        this.prisma.scrape.count({ where }),
        this.prisma.scrape.count({
          where: { ...where, status: 'SUCCESS' },
        }),
        this.prisma.scrape.count({
          where: { ...where, status: 'FAILED' },
        }),
      ]),
      // By source
      this.prisma.scrape.groupBy({
        by: ['source'],
        where,
        _count: true,
        _avg: { durationMs: true },
      }),
      // Aggregates
      this.prisma.scrape.aggregate({
        where,
        _sum: {
          jobsCreated: true,
          jobsUpdated: true,
        },
        _avg: {
          durationMs: true,
        },
      }),
    ]);

    const [totalScrapes, successfulScrapes, failedScrapes] = totals;

    // Get success counts by source
    const successBySource = await this.prisma.scrape.groupBy({
      by: ['source'],
      where: { ...where, status: 'SUCCESS' },
      _count: true,
    });

    const successMap = Object.fromEntries(
      successBySource.map((s) => [s.source, s._count])
    );

    return {
      totalScrapes,
      successfulScrapes,
      failedScrapes,
      totalJobsCreated: aggregates._sum.jobsCreated ?? 0,
      totalJobsUpdated: aggregates._sum.jobsUpdated ?? 0,
      avgDurationMs: Math.round(aggregates._avg.durationMs ?? 0),
      bySource: Object.fromEntries(
        bySource.map((s) => [
          s.source.toLowerCase(),
          {
            total: s._count,
            successful: successMap[s.source] ?? 0,
            avgDurationMs: Math.round(s._avg.durationMs ?? 0),
          },
        ])
      ),
    };
  }

  /**
   * Get running scrapes (for monitoring)
   */
  async getRunning(): Promise<ScrapeRecord[]> {
    const scrapes = await this.prisma.scrape.findMany({
      where: { status: 'RUNNING' },
      orderBy: { startedAt: 'asc' },
      include: this.defaultInclude,
    });

    return scrapes.map((s) => this.toScrapeRecord(s));
  }

  /**
   * Check if a scrape is currently running for a source/company
   */
  async isRunning(source: JobSource, companyId?: string): Promise<boolean> {
    const count = await this.prisma.scrape.count({
      where: {
        source: this.toSourceEnum(source),
        companyId: companyId ?? undefined,
        status: 'RUNNING',
      },
    });
    return count > 0;
  }

  // ===========================================================================
  // CLEANUP OPERATIONS
  // ===========================================================================

  /**
   * Clean up old scrape records
   */
  async cleanupOldRecords(olderThan: Date): Promise<number> {
    const result = await this.prisma.scrape.deleteMany({
      where: {
        startedAt: { lt: olderThan },
        status: { in: ['SUCCESS', 'PARTIAL', 'FAILED'] },
      },
    });
    return result.count;
  }

  /**
   * Mark stale running scrapes as failed
   */
  async markStaleAsFailed(staleThresholdMs = 3600000): Promise<number> {
    const threshold = new Date(Date.now() - staleThresholdMs);

    const result = await this.prisma.scrape.updateMany({
      where: {
        status: 'RUNNING',
        startedAt: { lt: threshold },
      },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
        errors: [
          {
            code: 'SCRAPE_TIMEOUT',
            message: 'Scrape marked as failed due to timeout',
          },
        ],
      },
    });

    return result.count;
  }

  // ===========================================================================
  // PRIVATE HELPERS
  // ===========================================================================

  private determineStatus(result: ScrapeResult): 'SUCCESS' | 'PARTIAL' | 'FAILED' {
    if (result.errors.length === 0) {
      return 'SUCCESS';
    }
    if (result.jobsCreated > 0 || result.jobsUpdated > 0) {
      return 'PARTIAL';
    }
    return 'FAILED';
  }

  private toScrapeRecord(
    scrape: PrismaScrape & { company?: { id: string; name: string; slug: string } | null }
  ): ScrapeRecord {
    return {
      id: scrape.id,
      source: scrape.source.toLowerCase() as JobSource,
      status: scrape.status.toLowerCase() as ScrapeStatus,
      companyId: scrape.companyId,
      companyName: scrape.company?.name,
      jobsFound: scrape.jobsFound,
      jobsCreated: scrape.jobsCreated,
      jobsUpdated: scrape.jobsUpdated,
      jobsRemoved: scrape.jobsRemoved,
      errors: scrape.errors as unknown as ScrapeError[],
      startedAt: scrape.startedAt,
      completedAt: scrape.completedAt,
      durationMs: scrape.durationMs,
    };
  }

  private toSourceEnum(source: JobSource): 'GREENHOUSE' | 'LEVER' | 'ASHBY' | 'WORKABLE' | 'SMARTRECRUITERS' {
    const map: Record<JobSource, 'GREENHOUSE' | 'LEVER' | 'ASHBY' | 'WORKABLE' | 'SMARTRECRUITERS'> = {
      greenhouse: 'GREENHOUSE',
      lever: 'LEVER',
      ashby: 'ASHBY',
      workable: 'WORKABLE',
      smartrecruiters: 'SMARTRECRUITERS',
    };
    return map[source];
  }
}
