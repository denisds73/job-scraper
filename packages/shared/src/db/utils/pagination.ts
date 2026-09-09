/**
 * Database Pagination Utilities
 * =============================================================================
 * Common pagination types and helpers for database queries.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CursorPaginationParams {
  cursor?: string;
  limit?: number;
  direction?: 'forward' | 'backward';
}

export interface CursorPaginatedResult<T> {
  data: T[];
  pagination: {
    nextCursor: string | null;
    prevCursor: string | null;
    hasMore: boolean;
  };
}

// =============================================================================
// CONSTANTS
// =============================================================================

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 20;
export const MAX_LIMIT = 100;

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Normalize pagination params with defaults and limits
 */
export function normalizePagination(params: PaginationParams): {
  page: number;
  limit: number;
  skip: number;
  take: number;
} {
  const page = Math.max(1, params.page ?? DEFAULT_PAGE);
  const limit = Math.min(MAX_LIMIT, Math.max(1, params.limit ?? DEFAULT_LIMIT));
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    take: limit,
  };
}

/**
 * Create a paginated result from data and count
 */
export function createPaginatedResult<T>(
  data: T[],
  total: number,
  params: { page: number; limit: number }
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNextPage: params.page < totalPages,
      hasPrevPage: params.page > 1,
    },
  };
}

/**
 * Create a cursor-paginated result
 */
export function createCursorPaginatedResult<T extends { id: string }>(
  data: T[],
  _limit: number,
  hasMore: boolean
): CursorPaginatedResult<T> {
  const lastItem = data[data.length - 1];
  const firstItem = data[0];
  const nextCursor = hasMore && lastItem ? lastItem.id : null;
  const prevCursor = firstItem ? firstItem.id : null;

  return {
    data,
    pagination: {
      nextCursor,
      prevCursor,
      hasMore,
    },
  };
}
