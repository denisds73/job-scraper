/**
 * Database Seed Script (DEVELOPMENT ONLY)
 * =============================================================================
 * 
 * NOTE: This script creates SAMPLE data with placeholder URLs.
 * For production, use the scraper to get REAL jobs with working URLs:
 * 
 *   npm run scrape -- --source=greenhouse --company=stripe
 *   npm run scrape -- --source=ashby --company=linear
 * 
 * The scraper fetches real job postings with valid application URLs.
 * 
 * Usage: npx prisma db seed
 */

import { 
  PrismaClient, 
  Prisma,
  JobSource,
  LocationType,
  EmploymentType,
  ExperienceLevel,
  SalaryPeriod,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seed script started\n');
  console.log('⚠️  NOTE: This creates sample data for development only.');
  console.log('   For real job data, use the scraper instead:');
  console.log('   npm run scrape -- --source=greenhouse --company=stripe\n');
  
  // Check if we already have data
  const existingJobs = await prisma.job.count();
  const existingCompanies = await prisma.company.count();
  
  if (existingJobs > 0 || existingCompanies > 0) {
    console.log(`Database already has ${existingCompanies} companies and ${existingJobs} jobs.`);
    console.log('Skipping seed to preserve existing data.');
    console.log('\nTo reset and re-seed, first clear the database:');
    console.log('  npx prisma migrate reset');
    return;
  }
  
  console.log('Database is empty. Run the scraper to populate with real jobs:');
  console.log('');
  console.log('  # Scrape jobs from companies with public APIs:');
  console.log('  npm run scrape -- --source=greenhouse --company=stripe');
  console.log('  npm run scrape -- --source=greenhouse --company=figma');
  console.log('  npm run scrape -- --source=greenhouse --company=airbnb');
  console.log('  npm run scrape -- --source=ashby --company=linear');
  console.log('  npm run scrape -- --source=ashby --company=supabase');
  console.log('');
  console.log('✅ Seed complete (no changes made)');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
