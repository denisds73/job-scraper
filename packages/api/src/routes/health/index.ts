/**
 * Health Check Routes
 * =============================================================================
 */

import type { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (fastify) => {
  // Basic health check
  fastify.get('/', {
    schema: {
      description: 'Basic health check',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            version: { type: 'string' },
          },
        },
      },
    },
    handler: async () => {
      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0',
      };
    },
  });

  // Detailed health check with database status
  fastify.get('/ready', {
    schema: {
      description: 'Readiness check including database connectivity',
      tags: ['health'],
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            timestamp: { type: 'string' },
            version: { type: 'string' },
            checks: {
              type: 'object',
              properties: {
                database: { type: 'string' },
                cache: { type: 'string' },
              },
            },
          },
        },
        503: {
          type: 'object',
          properties: {
            status: { type: 'string' },
            checks: { type: 'object' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const checks: Record<string, string> = {};
      let allHealthy = true;

      // Check database
      try {
        await fastify.prisma.$queryRaw`SELECT 1`;
        checks.database = 'healthy';
      } catch {
        checks.database = 'unhealthy';
        allHealthy = false;
      }

      // Check cache
      try {
        await fastify.cache.set('health-check', true, { ttl: 1 });
        const value = await fastify.cache.get('health-check');
        checks.cache = value ? 'healthy' : 'unhealthy';
      } catch {
        checks.cache = 'unhealthy';
        allHealthy = false;
      }

      const response = {
        status: allHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '0.1.0',
        checks,
      };

      if (!allHealthy) {
        return reply.status(503).send(response);
      }

      return response;
    },
  });
};

export default healthRoutes;
