#!/usr/bin/env npx tsx
/**
 * Bulk HTML Scraper
 * Scrapes jobs from all configured career pages
 * 
 * Usage:
 *   npx tsx bulk-html-scrape.ts                    # Scrape all companies
 *   npx tsx bulk-html-scrape.ts --city=chennai    # Scrape Chennai companies only
 *   npx tsx bulk-html-scrape.ts --company=Zoho    # Scrape single company
 *   npx tsx bulk-html-scrape.ts --test            # Test mode (first 3 companies)
 */

import { PrismaClient } from '@prisma/client';
import HtmlScraper, { ScrapedJob, ScrapeConfig } from './src/adapters/html-scraper';
import COMPANY_CONFIGS, { getCompanyConfig, getCompaniesByCity } from './src/adapters/company-configs';

const prisma = new PrismaClient();

interface ScrapeResult {
  company: string;
  jobsFound: number;
  jobsSaved: number;
  errors: string[];
  duration: number;
}

async function saveJobsToDatabase(jobs: ScrapedJob[]): Promise<number> {
  let saved = 0;
  
  for (const job of jobs) {
    try {
      // Find or create company
      let company = await prisma.company.findFirst({
        where: { 
          name: { equals: job.company, mode: 'insensitive' }
        }
      });

      if (!company) {
        company = await prisma.company.create({
          data: {
            name: job.company,
            slug: job.company.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            website: job.url ? new URL(job.url).origin : undefined,
          }
        });
        console.log(`  Created company: ${job.company}`);
      }

      // Check if job already exists
      const existingJob = await prisma.job.findFirst({
        where: {
          OR: [
            { sourceUrl: job.url },
            {
              AND: [
                { title: job.title },
                { companyId: company.id },
                { location: job.location }
              ]
            }
          ]
        }
      });

      if (existingJob) {
        // Update lastSeenAt
        await prisma.job.update({
          where: { id: existingJob.id },
          data: { lastSeenAt: new Date() }
        });
        continue;
      }

      // Create new job
      await prisma.job.create({
        data: {
          title: job.title,
          location: job.location || 'India',
          department: job.department,
          employmentType: mapEmploymentType(job.type),
          sourceUrl: job.url,
          source: 'HTML_SCRAPE',
          companyId: company.id,
          postedAt: new Date(),
          lastSeenAt: new Date(),
        }
      });

      saved++;
    } catch (error) {
      console.error(`  Error saving job: ${job.title}`, error);
    }
  }

  return saved;
}

function mapEmploymentType(type?: string): string {
  if (!type) return 'FULL_TIME';
  
  const lower = type.toLowerCase();
  if (lower.includes('part')) return 'PART_TIME';
  if (lower.includes('contract')) return 'CONTRACT';
  if (lower.includes('intern')) return 'INTERNSHIP';
  if (lower.includes('freelance')) return 'FREELANCE';
  return 'FULL_TIME';
}

async function scrapeCompany(scraper: HtmlScraper, config: ScrapeConfig): Promise<ScrapeResult> {
  const startTime = Date.now();
  const result: ScrapeResult = {
    company: config.name,
    jobsFound: 0,
    jobsSaved: 0,
    errors: [],
    duration: 0,
  };

  try {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Scraping: ${config.name}`);
    console.log(`URL: ${config.careerUrl}`);
    console.log('='.repeat(60));

    const jobs = await scraper.scrape(config);
    result.jobsFound = jobs.length;

    if (jobs.length > 0) {
      console.log(`Found ${jobs.length} jobs:`);
      jobs.slice(0, 5).forEach(j => {
        console.log(`  - ${j.title} | ${j.location}`);
      });
      if (jobs.length > 5) {
        console.log(`  ... and ${jobs.length - 5} more`);
      }

      result.jobsSaved = await saveJobsToDatabase(jobs);
      console.log(`Saved ${result.jobsSaved} new jobs to database`);
    } else {
      console.log('No jobs found (page structure may have changed)');
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    result.errors.push(errorMsg);
    console.error(`Error: ${errorMsg}`);
  }

  result.duration = (Date.now() - startTime) / 1000;
  console.log(`Duration: ${result.duration.toFixed(2)}s`);

  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const isTest = args.includes('--test');
  const cityArg = args.find(a => a.startsWith('--city='));
  const companyArg = args.find(a => a.startsWith('--company='));

  let configs: ScrapeConfig[] = [];

  if (companyArg) {
    const companyName = companyArg.split('=')[1];
    const config = getCompanyConfig(companyName);
    if (config) {
      configs = [config];
    } else {
      console.error(`Company not found: ${companyName}`);
      console.log('Available companies:', COMPANY_CONFIGS.map(c => c.name).join(', '));
      process.exit(1);
    }
  } else if (cityArg) {
    const city = cityArg.split('=')[1];
    configs = getCompaniesByCity(city);
    if (configs.length === 0) {
      console.error(`No companies found for city: ${city}`);
      console.log('Available cities: chennai, bangalore, delhi, hyderabad, pune, coimbatore, services');
      process.exit(1);
    }
  } else {
    configs = COMPANY_CONFIGS;
  }

  if (isTest) {
    configs = configs.slice(0, 3);
    console.log('TEST MODE: Scraping first 3 companies only');
  }

  console.log(`\n${'#'.repeat(60)}`);
  console.log('# BULK HTML SCRAPER - Personal Job Search Tool');
  console.log('#'.repeat(60));
  console.log(`\nCompanies to scrape: ${configs.length}`);
  configs.forEach(c => console.log(`  - ${c.name}`));

  const scraper = new HtmlScraper();
  await scraper.init();

  const results: ScrapeResult[] = [];
  let totalJobsFound = 0;
  let totalJobsSaved = 0;

  for (const config of configs) {
    const result = await scrapeCompany(scraper, config);
    results.push(result);
    totalJobsFound += result.jobsFound;
    totalJobsSaved += result.jobsSaved;

    // Rate limiting between companies
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  await scraper.close();
  await prisma.$disconnect();

  // Print summary
  console.log(`\n${'#'.repeat(60)}`);
  console.log('# SCRAPE SUMMARY');
  console.log('#'.repeat(60));
  console.log(`\nTotal companies scraped: ${results.length}`);
  console.log(`Total jobs found: ${totalJobsFound}`);
  console.log(`Total jobs saved: ${totalJobsSaved}`);

  const successful = results.filter(r => r.errors.length === 0);
  const failed = results.filter(r => r.errors.length > 0);

  console.log(`\nSuccessful: ${successful.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed companies:');
    failed.forEach(r => {
      console.log(`  - ${r.company}: ${r.errors.join(', ')}`);
    });
  }

  console.log('\nResults by company:');
  results
    .sort((a, b) => b.jobsFound - a.jobsFound)
    .forEach(r => {
      const status = r.errors.length > 0 ? '❌' : '✅';
      console.log(`  ${status} ${r.company.padEnd(25)} ${r.jobsFound} found, ${r.jobsSaved} saved (${r.duration.toFixed(1)}s)`);
    });
}

main().catch(console.error);
