/**
 * Base Repository
 * =============================================================================
 * Abstract base class for all repositories providing common CRUD operations.
 */

import type { PrismaClient } from '@prisma/client';
import {
  type PaginationParams,
  type PaginatedResult,
  normalizePagination,
  createPaginatedResult,
} from '../utils/pagination.js';

// =============================================================================
// TYPES
// =============================================================================

export interface FindOptions<TOrderBy> {
  pagination?: PaginationParams;
  orderBy?: TOrderBy;
}

export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

// =============================================================================
// BASE REPOSITORY
// =============================================================================

export abstract class BaseRepository<
  TModel,
  TCreateInput,
  TUpdateInput,
  TWhereInput,
  TOrderByInput,
> {
  constructor(protected readonly prisma: PrismaClient) {}

  /**
   * Get the Prisma model delegate (e.g., prisma.job, prisma.company)
   */
  protected abstract get model(): {
    findUnique: (args: { where: { id: string }; include?: object }) => Promise<TModel | null>;
    findMany: (args: {
      where?: TWhereInput;
      orderBy?: TOrderByInput;
      skip?: number;
      take?: number;
      include?: object;
    }) => Promise<TModel[]>;
    count: (args: { where?: TWhereInput }) => Promise<number>;
    create: (args: { data: TCreateInput; include?: object }) => Promise<TModel>;
    update: (args: {
      where: { id: string };
      data: TUpdateInput;
      include?: object;
    }) => Promise<TModel>;
    delete: (args: { where: { id: string } }) => Promise<TModel>;
    deleteMany: (args: { where?: TWhereInput }) => Promise<{ count: number }>;
  };

  /**
   * Default includes for queries
   */
  protected get defaultInclude(): object | undefined {
    return undefined;
  }

  /**
   * Find a single record by ID
   */
  async findById(id: string): Promise<TModel | null> {
    return this.model.findUnique({
      where: { id },
      include: this.defaultInclude,
    });
  }

  /**
   * Find multiple records with optional filtering and pagination
   */
  async findMany(
    where?: TWhereInput,
    options?: FindOptions<TOrderByInput>
  ): Promise<PaginatedResult<TModel>> {
    const { page, limit, skip, take } = normalizePagination(
      options?.pagination ?? {}
    );

    const [data, total] = await Promise.all([
      this.model.findMany({
        where,
        orderBy: options?.orderBy,
        skip,
        take,
        include: this.defaultInclude,
      }),
      this.model.count({ where }),
    ]);

    return createPaginatedResult(data, total, { page, limit });
  }

  /**
   * Find all records matching criteria (no pagination)
   */
  async findAll(
    where?: TWhereInput,
    orderBy?: TOrderByInput
  ): Promise<TModel[]> {
    return this.model.findMany({
      where,
      orderBy,
      include: this.defaultInclude,
    });
  }

  /**
   * Count records matching criteria
   */
  async count(where?: TWhereInput): Promise<number> {
    return this.model.count({ where });
  }

  /**
   * Check if a record exists
   */
  async exists(where: TWhereInput): Promise<boolean> {
    const count = await this.model.count({ where });
    return count > 0;
  }

  /**
   * Create a new record
   */
  async create(data: TCreateInput): Promise<TModel> {
    return this.model.create({
      data,
      include: this.defaultInclude,
    });
  }

  /**
   * Update an existing record
   */
  async update(id: string, data: TUpdateInput): Promise<TModel> {
    return this.model.update({
      where: { id },
      data,
      include: this.defaultInclude,
    });
  }

  /**
   * Delete a record by ID
   */
  async delete(id: string): Promise<TModel> {
    return this.model.delete({ where: { id } });
  }

  /**
   * Delete multiple records
   */
  async deleteMany(where: TWhereInput): Promise<number> {
    const result = await this.model.deleteMany({ where });
    return result.count;
  }

  /**
   * Execute operations within a transaction
   */
  async withTransaction<T>(
    fn: (tx: TransactionClient) => Promise<T>
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
