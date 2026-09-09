/**
 * Job Repository
 * =============================================================================
 * Data access layer for job-related operations.
 * Includes full-text search, filtering, and advanced query support.
 */

import { Prisma, type PrismaClient, type Job as PrismaJob } from '@prisma/client';
import { BaseRepository, type FindOptions } from './base.js';
import {
  type PaginationParams,
  type PaginatedResult,
  normalizePagination,
  createPaginatedResult,
} from '../utils/pagination.js';
import type {
  Job,
  JobFilters,
  JobSortOptions,
  JobListItem,
  JobSource,
  LocationType,
  EmploymentType,
  ExperienceLevel,
} from '../../types/job.js';

// =============================================================================
// TYPES
// =============================================================================

type JobWithCompany = PrismaJob & {
  company: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
};

export interface JobSearchParams {
  query?: string;
  filters?: JobFilters;
  sort?: JobSortOptions;
  pagination?: PaginationParams;
}

export interface JobSearchResult {
  jobs: JobListItem[];
  pagination: PaginatedResult<JobListItem>['pagination'];
  facets?: JobFacets;
}

export interface JobFacets {
  locations: FacetCount[];
  employmentTypes: FacetCount[];
  experienceLevels: FacetCount[];
  skills: FacetCount[];
  sources: FacetCount[];
}

export interface FacetCount {
  value: string;
  count: number;
}

// =============================================================================
// REPOSITORY
// =============================================================================

export class JobRepository extends BaseRepository<
  PrismaJob,
  Prisma.JobCreateInput,
  Prisma.JobUpdateInput,
  Prisma.JobWhereInput,
  Prisma.JobOrderByWithRelationInput
> {
  protected get model() {
    return this.prisma.job;
  }

  protected get defaultInclude() {
    return {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
          logo: true,
        },
      },
    };
  }

  // ===========================================================================
  // SEARCH OPERATIONS
  // ===========================================================================

  /**
   * Search jobs with full-text search and filters
   */
  async search(params: JobSearchParams): Promise<JobSearchResult> {
    const { query, filters, sort, pagination } = params;
    const { page, limit, skip, take } = normalizePagination(pagination ?? {});

    // Build where clause
    const where = this.buildWhereClause(query, filters);

    // Build order by clause
    const orderBy = this.buildOrderByClause(sort);

    // Execute query with count
    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where,
        orderBy,
        skip,
        take,
        include: this.defaultInclude,
      }),
      this.prisma.job.count({ where }),
    ]);

    // Transform to JobListItem
    const jobListItems = jobs.map((job) =>
      this.toJobListItem(job as JobWithCompany)
    );

    return {
      jobs: jobListItems,
      pagination: createPaginatedResult(jobListItems, total, { page, limit })
        .pagination,
    };
  }

  /**
   * Full-text search using PostgreSQL tsvector
   * Uses raw query for optimal full-text search performance
   */
  async fullTextSearch(
    query: string,
    filters?: JobFilters,
    pagination?: PaginationParams
  ): Promise<JobSearchResult> {
    const { page, limit, skip, take } = normalizePagination(pagination ?? {});

    // Sanitize query for tsquery
    const sanitizedQuery = query
      .replace(/[^\w\s]/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .join(' & ');

    if (!sanitizedQuery) {
      return this.search({ filters, pagination });
    }

    // Build filter conditions
    const filterConditions = this.buildRawFilterConditions(filters);

    // Execute full-text search with ranking
    const jobs = await this.prisma.$queryRaw<JobWithCompany[]>`
      SELECT 
        j.*,
        json_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'logo', c.logo
        ) as company,
        ts_rank_cd(j.search_vector, websearch_to_tsquery('jobscout_english', ${query})) as rank
      FROM jobs j
      INNER JOIN companies c ON j.company_id = c.id
      WHERE j.search_vector @@ websearch_to_tsquery('jobscout_english', ${query})
      ${filterConditions}
      ORDER BY rank DESC, j.posted_at DESC
      LIMIT ${take}
      OFFSET ${skip}
    `;

    // Get total count
    const countResult = await this.prisma.$queryRaw<[{ count: bigint }]>`
      SELECT COUNT(*) as count
      FROM jobs j
      WHERE j.search_vector @@ websearch_to_tsquery('jobscout_english', ${query})
      ${filterConditions}
    `;

    const total = Number(countResult[0].count);
    const jobListItems = jobs.map((job) => this.toJobListItem(job));

    return {
      jobs: jobListItems,
      pagination: createPaginatedResult(jobListItems, total, { page, limit })
        .pagination,
    };
  }

  /**
   * Get autocomplete suggestions for job titles
   */
  async suggestTitles(partialQuery: string, limit = 10): Promise<string[]> {
    if (partialQuery.length < 2) {
      return [];
    }

    const results = await this.prisma.$queryRaw<{ title: string }[]>`
      SELECT DISTINCT title
      FROM jobs
      WHERE title ILIKE ${`%${partialQuery}%`}
      ORDER BY 
        CASE WHEN title ILIKE ${`${partialQuery}%`} THEN 0 ELSE 1 END,
        title
      LIMIT ${limit}
    `;

    return results.map((r) => r.title);
  }

  // ===========================================================================
  // CRUD OPERATIONS
  // ===========================================================================

  /**
   * Find job by ID with full company details
   */
  async findByIdWithCompany(id: string): Promise<Job | null> {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
      },
    });

    if (!job) return null;

    return this.toJob(job);
  }

  /**
   * Find job by external ID and source
   */
  async findByExternalId(
    externalId: string,
    source: JobSource
  ): Promise<PrismaJob | null> {
    const sourceEnum = this.toSourceEnum(source);
    return this.prisma.job.findUnique({
      where: {
        unique_job_per_source: {
          externalId,
          source: sourceEnum,
        },
      },
    });
  }

  /**
   * Upsert job (create or update based on externalId + source)
   */
  async upsert(
    data: Prisma.JobCreateInput,
    updateData?: Prisma.JobUpdateInput
  ): Promise<PrismaJob> {
    return this.prisma.job.upsert({
      where: {
        unique_job_per_source: {
          externalId: data.externalId,
          source: data.source,
        },
      },
      create: data,
      update: updateData ?? {
        ...data,
        lastSeenAt: new Date(),
      },
    });
  }

  /**
   * Bulk upsert jobs (for scraper efficiency)
   */
  async bulkUpsert(
    jobs: Prisma.JobCreateInput[]
  ): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;

    // Process in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < jobs.length; i += batchSize) {
      const batch = jobs.slice(i, i + batchSize);

      await this.prisma.$transaction(async (tx) => {
        for (const job of batch) {
          const existing = await tx.job.findUnique({
            where: {
              unique_job_per_source: {
                externalId: job.externalId,
                source: job.source,
              },
            },
          });

          if (existing) {
            await tx.job.update({
              where: { id: existing.id },
              data: { ...job, lastSeenAt: new Date() },
            });
            updated++;
          } else {
            await tx.job.create({ data: job });
            created++;
          }
        }
      });
    }

    return { created, updated };
  }

  /**
   * Mark jobs as stale (not seen in recent scrape)
   */
  async markStaleJobs(
    source: JobSource,
    companyId: string,
    threshold: Date
  ): Promise<number> {
    const sourceEnum = this.toSourceEnum(source);
    const result = await this.prisma.job.deleteMany({
      where: {
        source: sourceEnum,
        companyId,
        lastSeenAt: { lt: threshold },
      },
    });
    return result.count;
  }

  // ===========================================================================
  // QUERY OPERATIONS
  // ===========================================================================

  /**
   * Get jobs by company
   */
  async findByCompany(
    companyId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<JobListItem>> {
    const { page, limit, skip, take } = normalizePagination(pagination ?? {});

    const [jobs, total] = await Promise.all([
      this.prisma.job.findMany({
        where: { companyId },
        orderBy: { postedAt: 'desc' },
        skip,
        take,
        include: this.defaultInclude,
      }),
      this.prisma.job.count({ where: { companyId } }),
    ]);

    const jobListItems = jobs.map((job) =>
      this.toJobListItem(job as JobWithCompany)
    );
    return createPaginatedResult(jobListItems, total, { page, limit });
  }

  /**
   * Get recent jobs
   */
  async findRecent(
    limit = 20,
    source?: JobSource
  ): Promise<JobListItem[]> {
    const where: Prisma.JobWhereInput = source
      ? { source: this.toSourceEnum(source) }
      : {};

    const jobs = await this.prisma.job.findMany({
      where,
      orderBy: { postedAt: 'desc' },
      take: limit,
      include: this.defaultInclude,
    });

    return jobs.map((job) => this.toJobListItem(job as JobWithCompany));
  }

  /**
   * Get similar jobs based on skills and title
   */
  async findSimilar(jobId: string, limit = 5): Promise<JobListItem[]> {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      select: { skills: true, title: true, companyId: true },
    });

    if (!job) return [];

    // Find jobs with overlapping skills, excluding the same company
    const similarJobs = await this.prisma.job.findMany({
      where: {
        id: { not: jobId },
        companyId: { not: job.companyId },
        OR: [
          { skills: { hasSome: job.skills } },
          { title: { contains: job.title.split(' ')[0], mode: 'insensitive' } },
        ],
      },
      orderBy: { postedAt: 'desc' },
      take: limit,
      include: this.defaultInclude,
    });

    return similarJobs.map((j) => this.toJobListItem(j as JobWithCompany));
  }

  /**
   * Get facets/aggregations for search refinement
   */
  async getFacets(filters?: JobFilters): Promise<JobFacets> {
    const where = this.buildWhereClause(undefined, filters);

    const [locations, employmentTypes, experienceLevels, sources] =
      await Promise.all([
        this.prisma.job.groupBy({
          by: ['location'],
          where,
          _count: true,
          orderBy: { _count: { location: 'desc' } },
          take: 20,
        }),
        this.prisma.job.groupBy({
          by: ['employmentType'],
          where,
          _count: true,
        }),
        this.prisma.job.groupBy({
          by: ['experienceLevel'],
          where,
          _count: true,
        }),
        this.prisma.job.groupBy({
          by: ['source'],
          where,
          _count: true,
        }),
      ]);

    return {
      locations: locations.map((l) => ({
        value: l.location,
        count: l._count,
      })),
      employmentTypes: employmentTypes.map((e) => ({
        value: e.employmentType,
        count: e._count,
      })),
      experienceLevels: experienceLevels
        .filter((e) => e.experienceLevel)
        .map((e) => ({
          value: e.experienceLevel!,
          count: e._count,
        })),
      skills: [], // Would require a separate aggregation query
      sources: sources.map((s) => ({
        value: s.source,
        count: s._count,
      })),
    };
  }

  // ===========================================================================
  // PRIVATE HELPERS
  // ===========================================================================

  private buildWhereClause(
    query?: string,
    filters?: JobFilters
  ): Prisma.JobWhereInput {
    const conditions: Prisma.JobWhereInput[] = [];

    // Text search (basic ILIKE for simple queries)
    if (query) {
      conditions.push({
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { skills: { hasSome: [query] } },
        ],
      });
    }

    if (filters) {
      // Location
      if (filters.location) {
        conditions.push({
          location: { contains: filters.location, mode: 'insensitive' },
        });
      }

      // Remote filter
      if (filters.isRemote !== undefined) {
        conditions.push({ isRemote: filters.isRemote });
      }

      // Location type
      if (filters.locationType) {
        const types = Array.isArray(filters.locationType)
          ? filters.locationType
          : [filters.locationType];
        conditions.push({
          locationType: {
            in: types.map((t) => this.toLocationTypeEnum(t)),
          },
        });
      }

      // Employment type
      if (filters.employmentType) {
        const types = Array.isArray(filters.employmentType)
          ? filters.employmentType
          : [filters.employmentType];
        conditions.push({
          employmentType: {
            in: types.map((t) => this.toEmploymentTypeEnum(t)),
          },
        });
      }

      // Experience level
      if (filters.experienceLevel) {
        const levels = Array.isArray(filters.experienceLevel)
          ? filters.experienceLevel
          : [filters.experienceLevel];
        conditions.push({
          experienceLevel: {
            in: levels.map((l) => this.toExperienceLevelEnum(l)),
          },
        });
      }

      // Salary range
      if (filters.salaryMin !== undefined) {
        conditions.push({ salaryMax: { gte: filters.salaryMin } });
      }
      if (filters.salaryMax !== undefined) {
        conditions.push({ salaryMin: { lte: filters.salaryMax } });
      }

      // Skills
      if (filters.skills && filters.skills.length > 0) {
        conditions.push({ skills: { hasSome: filters.skills } });
      }

      // Company
      if (filters.companyId) {
        conditions.push({ companyId: filters.companyId });
      }

      // Source
      if (filters.source) {
        const sources = Array.isArray(filters.source)
          ? filters.source
          : [filters.source];
        conditions.push({
          source: { in: sources.map((s) => this.toSourceEnum(s)) },
        });
      }

      // Date range
      if (filters.postedAfter) {
        conditions.push({ postedAt: { gte: filters.postedAfter } });
      }
      if (filters.postedBefore) {
        conditions.push({ postedAt: { lte: filters.postedBefore } });
      }
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  }

  private buildOrderByClause(
    sort?: JobSortOptions
  ): Prisma.JobOrderByWithRelationInput {
    if (!sort) {
      return { postedAt: 'desc' };
    }

    const direction = sort.direction === 'asc' ? 'asc' : 'desc';

    switch (sort.field) {
      case 'postedAt':
        return { postedAt: direction };
      case 'salary':
        return { salaryMax: direction };
      case 'title':
        return { title: direction };
      case 'company':
        return { company: { name: direction } };
      default:
        return { postedAt: 'desc' };
    }
  }

  private buildRawFilterConditions(_filters?: JobFilters): Prisma.Sql {
    // Return empty SQL for now - can be extended for raw query filters
    return Prisma.empty;
  }

  private toJob(
    prismaJob: PrismaJob & { company: unknown }
  ): Job {
    return {
      id: prismaJob.id,
      externalId: prismaJob.externalId,
      source: prismaJob.source as unknown as JobSource,
      title: prismaJob.title,
      description: prismaJob.description,
      requirements: prismaJob.requirements,
      location: prismaJob.location,
      isRemote: prismaJob.isRemote,
      locationType: prismaJob.locationType as unknown as LocationType,
      employmentType: prismaJob.employmentType as unknown as EmploymentType,
      experienceLevel: prismaJob.experienceLevel as unknown as ExperienceLevel | null,
      salary:
        prismaJob.salaryMin || prismaJob.salaryMax
          ? {
              min: prismaJob.salaryMin,
              max: prismaJob.salaryMax,
              currency: prismaJob.salaryCurrency,
              period: prismaJob.salaryPeriod as unknown as import('../../types/job.js').SalaryPeriod,
            }
          : null,
      skills: prismaJob.skills,
      department: prismaJob.department,
      postedAt: prismaJob.postedAt,
      expiresAt: prismaJob.expiresAt,
      lastSeenAt: prismaJob.lastSeenAt,
      sourceUrl: prismaJob.sourceUrl,
      companyId: prismaJob.companyId,
      company: prismaJob.company as import('../../types/company.js').Company,
      createdAt: prismaJob.createdAt,
      updatedAt: prismaJob.updatedAt,
    };
  }

  private toJobListItem(job: JobWithCompany): JobListItem {
    const now = new Date();
    const postedAt = new Date(job.postedAt);
    const isNew =
      now.getTime() - postedAt.getTime() < 24 * 60 * 60 * 1000; // 24 hours

    return {
      id: job.id,
      title: job.title,
      company: {
        id: job.company.id,
        name: job.company.name,
        logo: job.company.logo,
      },
      location: job.location,
      locationType: job.locationType as unknown as LocationType,
      employmentType: job.employmentType as unknown as EmploymentType,
      salary:
        job.salaryMin || job.salaryMax
          ? {
              min: job.salaryMin,
              max: job.salaryMax,
              currency: job.salaryCurrency,
              period: job.salaryPeriod as unknown as import('../../types/job.js').SalaryPeriod,
            }
          : null,
      skills: job.skills,
      postedAt: job.postedAt,
      sourceUrl: job.sourceUrl,
      isNew,
    };
  }

  // Enum conversion helpers - return Prisma enum values directly
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

  private toLocationTypeEnum(type: LocationType): 'REMOTE' | 'HYBRID' | 'ONSITE' {
    const map: Record<LocationType, 'REMOTE' | 'HYBRID' | 'ONSITE'> = {
      remote: 'REMOTE',
      hybrid: 'HYBRID',
      onsite: 'ONSITE',
    };
    return map[type];
  }

  private toEmploymentTypeEnum(type: EmploymentType): 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' {
    const map: Record<EmploymentType, 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP'> = {
      'full-time': 'FULL_TIME',
      'part-time': 'PART_TIME',
      contract: 'CONTRACT',
      internship: 'INTERNSHIP',
    };
    return map[type];
  }

  private toExperienceLevelEnum(
    level: ExperienceLevel
  ): 'ENTRY' | 'MID' | 'SENIOR' | 'STAFF' | 'PRINCIPAL' {
    const map: Record<ExperienceLevel, 'ENTRY' | 'MID' | 'SENIOR' | 'STAFF' | 'PRINCIPAL'> = {
      entry: 'ENTRY',
      mid: 'MID',
      senior: 'SENIOR',
      staff: 'STAFF',
      principal: 'PRINCIPAL',
    };
    return map[level];
  }
}
