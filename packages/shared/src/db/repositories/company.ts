/**
 * Company Repository
 * =============================================================================
 * Data access layer for company-related operations.
 */

import type { PrismaClient, Prisma, Company as PrismaCompany } from '@prisma/client';
import { BaseRepository } from './base.js';
import {
  type PaginationParams,
  type PaginatedResult,
  normalizePagination,
  createPaginatedResult,
} from '../utils/pagination.js';
import type {
  Company,
  CompanyFilters,
  CompanyListItem,
  CompanyDetail,
  CompanyCreateInput,
} from '../../types/company.js';
import type { JobSource, JobListItem } from '../../types/job.js';

// =============================================================================
// TYPES
// =============================================================================

type CompanyWithJobCount = PrismaCompany & {
  _count: { jobs: number };
};

// =============================================================================
// REPOSITORY
// =============================================================================

export class CompanyRepository extends BaseRepository<
  PrismaCompany,
  Prisma.CompanyCreateInput,
  Prisma.CompanyUpdateInput,
  Prisma.CompanyWhereInput,
  Prisma.CompanyOrderByWithRelationInput
> {
  protected get model() {
    return this.prisma.company;
  }

  // ===========================================================================
  // QUERY OPERATIONS
  // ===========================================================================

  /**
   * Find company by slug
   */
  async findBySlug(slug: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { slug },
    });

    return company ? this.toCompany(company) : null;
  }

  /**
   * Find company by career page URL
   */
  async findByCareerPageUrl(url: string): Promise<Company | null> {
    const company = await this.prisma.company.findUnique({
      where: { careerPageUrl: url },
    });

    return company ? this.toCompany(company) : null;
  }

  /**
   * Find or create company by career page URL
   */
  async findOrCreate(input: CompanyCreateInput): Promise<Company> {
    const existing = await this.findByCareerPageUrl(input.careerPageUrl);
    if (existing) return existing;

    const prismaInput = this.toPrismaCreateInput(input);
    const created = await this.prisma.company.create({
      data: prismaInput,
    });

    return this.toCompany(created);
  }

  /**
   * Search companies with filters
   */
  async search(
    filters?: CompanyFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResult<CompanyListItem>> {
    const { page, limit, skip, take } = normalizePagination(pagination ?? {});
    const where = this.buildWhereClause(filters);

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take,
        include: {
          _count: { select: { jobs: true } },
        },
      }),
      this.prisma.company.count({ where }),
    ]);

    const items = companies.map((c) =>
      this.toCompanyListItem(c as CompanyWithJobCount)
    );
    return createPaginatedResult(items, total, { page, limit });
  }

  /**
   * Get company with all jobs
   */
  async getWithJobs(
    idOrSlug: string,
    jobPagination?: PaginationParams
  ): Promise<CompanyDetail | null> {
    const { skip, take } = normalizePagination(jobPagination ?? {});

    // Try to find by ID first, then by slug
    const company = await this.prisma.company.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        jobs: {
          orderBy: { postedAt: 'desc' },
          skip,
          take,
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
        _count: { select: { jobs: true } },
      },
    });

    if (!company) return null;

    return this.toCompanyDetail(company as CompanyWithJobCount & {
      jobs: Array<{
        id: string;
        title: string;
        location: string;
        locationType: string;
        employmentType: string;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string;
        salaryPeriod: string;
        skills: string[];
        postedAt: Date;
        sourceUrl: string;
        company: { id: string; name: string; logo: string | null };
      }>;
    });
  }

  /**
   * Get companies by ATS type
   */
  async findByAtsType(atsType: JobSource): Promise<Company[]> {
    const companies = await this.prisma.company.findMany({
      where: { atsType: this.toAtsTypeEnum(atsType) },
      orderBy: { name: 'asc' },
    });

    return companies.map((c) => this.toCompany(c));
  }

  /**
   * Get companies with open jobs
   */
  async findWithOpenJobs(limit = 20): Promise<CompanyListItem[]> {
    const companies = await this.prisma.company.findMany({
      where: {
        jobs: { some: {} },
      },
      orderBy: {
        jobs: { _count: 'desc' },
      },
      take: limit,
      include: {
        _count: { select: { jobs: true } },
      },
    });

    return companies.map((c) =>
      this.toCompanyListItem(c as CompanyWithJobCount)
    );
  }

  /**
   * Get company statistics
   */
  async getStats(): Promise<{
    total: number;
    byAtsType: Record<string, number>;
    withJobs: number;
  }> {
    const [total, byAtsType, withJobs] = await Promise.all([
      this.prisma.company.count(),
      this.prisma.company.groupBy({
        by: ['atsType'],
        _count: true,
      }),
      this.prisma.company.count({
        where: { jobs: { some: {} } },
      }),
    ]);

    return {
      total,
      byAtsType: Object.fromEntries(
        byAtsType.map((item) => [item.atsType, item._count])
      ),
      withJobs,
    };
  }

  // ===========================================================================
  // CRUD OPERATIONS
  // ===========================================================================

  /**
   * Update company by slug
   */
  async updateBySlug(
    slug: string,
    data: Prisma.CompanyUpdateInput
  ): Promise<Company> {
    const updated = await this.prisma.company.update({
      where: { slug },
      data,
    });

    return this.toCompany(updated);
  }

  // ===========================================================================
  // PRIVATE HELPERS
  // ===========================================================================

  private buildWhereClause(filters?: CompanyFilters): Prisma.CompanyWhereInput {
    if (!filters) return {};

    const conditions: Prisma.CompanyWhereInput[] = [];

    if (filters.query) {
      conditions.push({
        OR: [
          { name: { contains: filters.query, mode: 'insensitive' } },
          { description: { contains: filters.query, mode: 'insensitive' } },
        ],
      });
    }

    if (filters.industry) {
      conditions.push({
        industry: { contains: filters.industry, mode: 'insensitive' },
      });
    }

    if (filters.size) {
      const sizes = Array.isArray(filters.size)
        ? filters.size
        : [filters.size];
      conditions.push({
        size: { in: sizes.map((s) => this.toCompanySizeEnum(s)) },
      });
    }

    if (filters.atsType) {
      const types = Array.isArray(filters.atsType)
        ? filters.atsType
        : [filters.atsType];
      conditions.push({
        atsType: { in: types.map((t) => this.toAtsTypeEnum(t)) },
      });
    }

    if (filters.hasOpenJobs) {
      conditions.push({ jobs: { some: {} } });
    }

    return conditions.length > 0 ? { AND: conditions } : {};
  }

  private toCompany(prismaCompany: PrismaCompany): Company {
    return {
      id: prismaCompany.id,
      name: prismaCompany.name,
      slug: prismaCompany.slug,
      logo: prismaCompany.logo,
      description: prismaCompany.description,
      website: prismaCompany.website,
      careerPageUrl: prismaCompany.careerPageUrl,
      industry: prismaCompany.industry,
      size: prismaCompany.size as unknown as import('../../types/company.js').CompanySize | null,
      foundedYear: prismaCompany.foundedYear,
      headquarters: prismaCompany.headquarters,
      atsType: prismaCompany.atsType as unknown as JobSource,
      createdAt: prismaCompany.createdAt,
      updatedAt: prismaCompany.updatedAt,
    };
  }

  private toCompanyListItem(company: CompanyWithJobCount): CompanyListItem {
    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      logo: company.logo,
      industry: company.industry,
      size: company.size as unknown as import('../../types/company.js').CompanySize | null,
      jobCount: company._count.jobs,
    };
  }

  private toCompanyDetail(
    company: CompanyWithJobCount & { jobs: unknown[] }
  ): CompanyDetail {
    return {
      ...this.toCompany(company),
      jobs: (company.jobs as Array<{
        id: string;
        title: string;
        location: string;
        locationType: string;
        employmentType: string;
        salaryMin: number | null;
        salaryMax: number | null;
        salaryCurrency: string;
        salaryPeriod: string;
        skills: string[];
        postedAt: Date;
        sourceUrl: string;
        company: { id: string; name: string; logo: string | null };
      }>).map((job) => ({
        id: job.id,
        title: job.title,
        company: {
          id: job.company.id,
          name: job.company.name,
          logo: job.company.logo,
        },
        location: job.location,
        locationType: job.locationType as import('../../types/job.js').LocationType,
        employmentType: job.employmentType as import('../../types/job.js').EmploymentType,
        salary:
          job.salaryMin || job.salaryMax
            ? {
                min: job.salaryMin,
                max: job.salaryMax,
                currency: job.salaryCurrency,
                period: job.salaryPeriod as import('../../types/job.js').SalaryPeriod,
              }
            : null,
        skills: job.skills,
        postedAt: job.postedAt,
        sourceUrl: job.sourceUrl,
      })),
      jobCount: company._count.jobs,
    };
  }

  private toPrismaCreateInput(input: CompanyCreateInput): Prisma.CompanyCreateInput {
    return {
      name: input.name,
      slug: input.slug,
      logo: input.logo,
      description: input.description,
      website: input.website,
      careerPageUrl: input.careerPageUrl,
      industry: input.industry,
      size: input.size ? this.toCompanySizeEnum(input.size) : null,
      foundedYear: input.foundedYear,
      headquarters: input.headquarters,
      atsType: this.toAtsTypeEnum(input.atsType),
    };
  }

  private toAtsTypeEnum(source: JobSource): 'GREENHOUSE' | 'LEVER' | 'ASHBY' | 'WORKABLE' | 'SMARTRECRUITERS' {
    const map: Record<JobSource, 'GREENHOUSE' | 'LEVER' | 'ASHBY' | 'WORKABLE' | 'SMARTRECRUITERS'> = {
      greenhouse: 'GREENHOUSE',
      lever: 'LEVER',
      ashby: 'ASHBY',
      workable: 'WORKABLE',
      smartrecruiters: 'SMARTRECRUITERS',
    };
    return map[source];
  }

  private toCompanySizeEnum(
    size: import('../../types/company.js').CompanySize
  ): 'SIZE_1_10' | 'SIZE_11_50' | 'SIZE_51_200' | 'SIZE_201_500' | 'SIZE_501_1000' | 'SIZE_1001_5000' | 'SIZE_5000_PLUS' {
    const map = {
      '1-10': 'SIZE_1_10',
      '11-50': 'SIZE_11_50',
      '51-200': 'SIZE_51_200',
      '201-500': 'SIZE_201_500',
      '501-1000': 'SIZE_501_1000',
      '1001-5000': 'SIZE_1001_5000',
      '5000+': 'SIZE_5000_PLUS',
    } as const;
    return map[size];
  }
}
