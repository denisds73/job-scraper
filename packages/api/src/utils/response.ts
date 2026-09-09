/**
 * API Response Utilities
 * =============================================================================
 * Standardized response formatting for consistent API output.
 */

// =============================================================================
// RESPONSE TYPES
// =============================================================================

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ListResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
}

export interface EmptyResponse {
  success: boolean;
  message?: string;
}

// =============================================================================
// RESPONSE BUILDERS
// =============================================================================

/**
 * Format a paginated list response
 */
export function formatListResponse<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  }
): ListResponse<T> {
  return {
    data,
    meta: {
      total: pagination.total,
      page: pagination.page,
      pageSize: pagination.limit,
      totalPages: pagination.totalPages,
      hasMore: pagination.hasNextPage,
    },
  };
}

/**
 * Format a single item response
 */
export function formatSingleResponse<T>(data: T): SingleResponse<T> {
  return { data };
}

/**
 * Format an empty/success response
 */
export function formatEmptyResponse(
  success = true,
  message?: string
): EmptyResponse {
  return { success, message };
}

// =============================================================================
// HTTP STATUS HELPERS
// =============================================================================

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];
