/**
 * JobScout Scraper CLI
 * =============================================================================
 * Command-line interface for job scraping operations.
 */

import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

import type { JobSource } from '@jobscout/shared';
import { ScrapeService, type ScrapeSummary } from './services/index.js';
import type { CompanyInfo } from './adapters/index.js';
import { logger } from './utils/index.js';

// =============================================================================
// TYPES
// =============================================================================

interface CliOptions {
  source?: JobSource;
  company?: string;
  dryRun: boolean;
  removeStale: boolean;
  help: boolean;
}

interface CompanyList {
  source: string;
  companies: CompanyInfo[];
}

// =============================================================================
// CLI PARSING
// =============================================================================

function parseArgs(): CliOptions {
  const args = process.argv.slice(2);
  const options: CliOptions = {
    dryRun: false,
    removeStale: true,
    help: false,
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg.startsWith('--source=')) {
      options.source = arg.split('=')[1] as JobSource;
    } else if (arg.startsWith('--company=')) {
      options.company = arg.split('=')[1];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    } else if (arg === '--no-remove-stale') {
      options.removeStale = false;
    }
  }

  return options;
}

function showHelp(): void {
  console.log(`
JobScout Scraper CLI

Usage: npm run scrape [options]

Options:
  --source=<source>     Scrape specific source (greenhouse, lever, ashby)
  --company=<slug>      Scrape specific company only
  --dry-run             Fetch jobs but don't save to database
  --no-remove-stale     Don't remove jobs not found in current scrape
  -h, --help            Show this help message

Examples:
  npm run scrape                          # Scrape all sources
  npm run scrape -- --source=greenhouse   # Scrape Greenhouse only
  npm run scrape -- --source=lever --company=Netflix --dry-run
`);
}

// =============================================================================
// COMPANY LOADING
// =============================================================================

function loadCompanies(source: JobSource): CompanyInfo[] {
  const filePath = resolve(__dirname, `../companies/${source}.json`);
  
  if (!existsSync(filePath)) {
    logger.warn(`No company list found for ${source}`);
    return [];
  }

  try {
    const content = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content) as CompanyList;
    return data.companies;
  } catch (error) {
    logger.error(`Failed to load companies for ${source}`, error as Error);
    return [];
  }
}

// =============================================================================
// MAIN
// =============================================================================

async function main(): Promise<void> {
  const options = parseArgs();

  if (options.help) {
    showHelp();
    process.exit(0);
  }

  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   JobScout Scraper                                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

  logger.info('Starting scraper', {
    source: options.source || 'all',
    company: options.company || 'all',
    dryRun: options.dryRun,
  });

  const scraper = new ScrapeService();
  const summaries: ScrapeSummary[] = [];

  try {
    // Determine which sources to scrape
    const sources: JobSource[] = options.source 
      ? [options.source] 
      : ['greenhouse', 'lever', 'ashby'];

    for (const source of sources) {
      let companies = loadCompanies(source);

      // Filter to specific company if requested
      if (options.company) {
        companies = companies.filter(c => 
          c.slug.toLowerCase() === options.company!.toLowerCase() ||
          c.name.toLowerCase() === options.company!.toLowerCase()
        );
        
        if (companies.length === 0) {
          logger.warn(`Company '${options.company}' not found in ${source} list`);
          continue;
        }
      }

      if (companies.length === 0) {
        logger.info(`No companies to scrape for ${source}`);
        continue;
      }

      const summary = await scraper.scrapeCompanies(source, companies, {
        dryRun: options.dryRun,
        removeStale: options.removeStale,
      });
      
      summaries.push(summary);
    }

    // Print final summary
    console.log('\n');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                      SCRAPE SUMMARY                        ');
    console.log('═══════════════════════════════════════════════════════════');
    
    const totals = {
      companies: summaries.reduce((sum, s) => sum + s.totalCompanies, 0),
      found: summaries.reduce((sum, s) => sum + s.totalJobsFound, 0),
      created: summaries.reduce((sum, s) => sum + s.totalJobsCreated, 0),
      updated: summaries.reduce((sum, s) => sum + s.totalJobsUpdated, 0),
      removed: summaries.reduce((sum, s) => sum + s.totalJobsRemoved, 0),
      errors: summaries.reduce((sum, s) => sum + s.totalErrors, 0),
      duration: summaries.reduce((sum, s) => sum + s.duration, 0),
    };

    console.log(`  Companies scraped:  ${totals.companies}`);
    console.log(`  Jobs found:         ${totals.found}`);
    console.log(`  Jobs created:       ${totals.created}`);
    console.log(`  Jobs updated:       ${totals.updated}`);
    console.log(`  Jobs removed:       ${totals.removed}`);
    console.log(`  Errors:             ${totals.errors}`);
    console.log(`  Duration:           ${(totals.duration / 1000).toFixed(2)}s`);
    console.log('═══════════════════════════════════════════════════════════');

    if (options.dryRun) {
      console.log('\n  (DRY RUN - no changes were saved to database)\n');
    }

  } catch (error) {
    logger.error('Scraper failed', error as Error);
    process.exit(1);
  } finally {
    await scraper.shutdown();
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
