/**
 * JobScout API Server
 * Fastify-based REST API
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'development'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
    },
  });

  // Register plugins
  await app.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Health check
  app.get('/health', async () => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
    };
  });

  // API routes will be registered here
  // await app.register(jobRoutes, { prefix: '/api/jobs' });
  // await app.register(companyRoutes, { prefix: '/api/companies' });
  // await app.register(filterRoutes, { prefix: '/api/filters' });

  // Root endpoint
  app.get('/', async () => {
    return {
      name: 'JobScout API',
      version: process.env.npm_package_version || '0.1.0',
      docs: '/docs',
    };
  });

  return app;
}

async function start() {
  const app = await buildApp();

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`🚀 API server running at http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

export { buildApp };
