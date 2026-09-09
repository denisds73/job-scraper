/**
 * Prisma Plugin
 * =============================================================================
 * Decorates Fastify with Prisma client and repository instances.
 */

import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { db } from '@jobscout/shared';

// =============================================================================
// TYPE DECLARATIONS
// =============================================================================

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    repositories: {
      jobs: db.JobRepository;
      companies: db.CompanyRepository;
      scrapes: db.ScrapeRepository;
    };
  }
}

// =============================================================================
// PLUGIN
// =============================================================================

const prismaPlugin: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const prisma = new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

  // Connect to database
  await prisma.$connect();
  fastify.log.info('Database connected');

  // Decorate fastify with prisma client
  fastify.decorate('prisma', prisma);

  // Decorate with repositories
  fastify.decorate('repositories', {
    jobs: new db.JobRepository(prisma),
    companies: new db.CompanyRepository(prisma),
    scrapes: new db.ScrapeRepository(prisma),
  });

  // Disconnect on close
  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
    instance.log.info('Database disconnected');
  });
};

export default fp(prismaPlugin, {
  name: 'prisma',
});
