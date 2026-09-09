/**
 * API Error Utilities
 * =============================================================================
 * Standardized error handling for consistent API responses.
 */

import type { FastifyReply, FastifyRequest } from 'fastify';

// =============================================================================
// ERROR TYPES
// =============================================================================

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string) {
    super(
      404,
      id ? `${resource} with id '${id}' not found` : `${resource} not found`,
      'NOT_FOUND'
    );
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(400, message, 'BAD_REQUEST', details);
  }
}

export class ValidationError extends ApiError {
  constructor(details: unknown) {
    super(400, 'Validation failed', 'VALIDATION_ERROR', details);
  }
}

export class RateLimitError extends ApiError {
  constructor() {
    super(429, 'Too many requests', 'RATE_LIMIT_EXCEEDED');
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal server error') {
    super(500, message, 'INTERNAL_ERROR');
  }
}

// =============================================================================
// ERROR RESPONSE FORMAT
// =============================================================================

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    path: string;
    requestId?: string;
  };
}

export function formatErrorResponse(
  error: ApiError,
  request: FastifyRequest
): ErrorResponse {
  return {
    error: {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message,
      details: error.details,
    },
    meta: {
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId: request.id,
    },
  };
}

// =============================================================================
// ERROR HANDLER
// =============================================================================

export function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  request.log.error(error);

  if (error instanceof ApiError) {
    reply.status(error.statusCode).send(formatErrorResponse(error, request));
    return;
  }

  // Handle Prisma errors
  if (error.name === 'PrismaClientKnownRequestError') {
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025') {
      reply.status(404).send(
        formatErrorResponse(new NotFoundError('Resource'), request)
      );
      return;
    }
  }

  // Handle Zod validation errors
  if (error.name === 'ZodError') {
    const zodError = error as { issues?: unknown };
    reply.status(400).send(
      formatErrorResponse(new ValidationError(zodError.issues), request)
    );
    return;
  }

  // Default to internal error
  const internalError = new InternalError(
    process.env.NODE_ENV === 'development' ? error.message : undefined
  );
  reply.status(500).send(formatErrorResponse(internalError, request));
}
