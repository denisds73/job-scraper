/**
 * JobScout API Server
 * =============================================================================
 * Production-ready Fastify REST API with OpenAPI documentation.
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from root .env
config({ path: resolve(process.cwd(), '../../.env') });
config({ path: resolve(process.cwd(), '.env') }); // Also check local

import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

import { prismaPlugin, cachePlugin } from './plugins/index.js';
import {
  healthRoutes,
  jobsRoutes,
  companiesRoutes,
  filtersRoutes,
} from './routes/index.js';
import { errorHandler } from './utils/index.js';

// =============================================================================
// CONFIGURATION
// =============================================================================

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';
const isDev = process.env.NODE_ENV === 'development';

// =============================================================================
// APP BUILDER
// =============================================================================

async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
      transport: isDev
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
  });

  // =========================================================================
  // SECURITY & COMPRESSION
  // =========================================================================

  await app.register(helmet, {
    contentSecurityPolicy: false, // Disable for Swagger UI
  });

  await app.register(compress, {
    global: true,
    encodings: ['gzip', 'deflate'],
  });

  // =========================================================================
  // CORS
  // =========================================================================

  await app.register(cors, {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : isDev
        ? true
        : false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    credentials: true,
  });

  // =========================================================================
  // RATE LIMITING
  // =========================================================================

  await app.register(rateLimit, {
    max: isDev ? 1000 : 100,
    timeWindow: '1 minute',
    errorResponseBuilder: (request, context) => ({
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: `Rate limit exceeded. Try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        limit: context.max,
        remaining: 0,
        retryAfter: Math.ceil(context.ttl / 1000),
      },
    }),
  });

  // =========================================================================
  // OPENAPI DOCUMENTATION
  // =========================================================================

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'JobScout API',
        description: 'REST API for IT job aggregation platform',
        version: process.env.npm_package_version || '0.1.0',
        contact: {
          name: 'JobScout',
          url: 'https://github.com/denisds73/job-scraper',
        },
      },
      servers: [
        {
          url: isDev ? `http://localhost:${PORT}` : 'https://api.jobscout.dev',
          description: isDev ? 'Development server' : 'Production server',
        },
      ],
      tags: [
        { name: 'health', description: 'Health check endpoints' },
        { name: 'jobs', description: 'Job search and listings' },
        { name: 'companies', description: 'Company information' },
        { name: 'filters', description: 'Filter options and suggestions' },
      ],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
      persistAuthorization: true,
    },
    staticCSP: true,
  });

  // =========================================================================
  // CUSTOM PLUGINS
  // =========================================================================

  await app.register(prismaPlugin);
  await app.register(cachePlugin);

  // =========================================================================
  // ERROR HANDLER
  // =========================================================================

  app.setErrorHandler(errorHandler);

  // =========================================================================
  // ROUTES
  // =========================================================================

  // Root endpoint
  app.get('/', {
    schema: {
      hide: true,
    },
    handler: async () => ({
      name: 'JobScout API',
      version: process.env.npm_package_version || '0.1.0',
      docs: '/docs',
      health: '/health',
    }),
  });

  // Register route modules
  await app.register(healthRoutes, { prefix: '/health' });
  await app.register(jobsRoutes, { prefix: '/api/jobs' });
  await app.register(companiesRoutes, { prefix: '/api/companies' });
  await app.register(filtersRoutes, { prefix: '/api/filters' });

  // =========================================================================
  // HOOKS
  // =========================================================================

  // Log request summary
  app.addHook('onResponse', (request, reply, done) => {
    request.log.info(
      {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
      },
      'Request completed'
    );
    done();
  });

  return app;
}

// =============================================================================
// SERVER START
// =============================================================================

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });

    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   JobScout API Server                                     ║
║                                                           ║
║   Server:  http://${HOST}:${PORT}                          ║
║   Docs:    http://${HOST}:${PORT}/docs                     ║
║   Health:  http://${HOST}:${PORT}/health                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\nShutting down gracefully...');
  process.exit(0);
});

start();

export { buildApp };
