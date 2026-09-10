#!/usr/bin/env tsx
/**
 * Multi-Agent Bulk Scraper
 * =============================================================================
 * Scrapes all companies in parallel using multiple concurrent workers.
 * Designed for maximum throughput while respecting rate limits.
 */

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const MAX_CONCURRENT = 5; // Number of parallel scrapers
const RETRY_ATTEMPTS = 2;
const DELAY_BETWEEN_BATCHES_MS = 2000;

interface Company {
  slug: string;
  name: string;
  careerPageUrl: string;
}

interface CompanyList {
  companies: Company[];
}

interface ScrapeResult {
  company: string;
  source: string;
  success: boolean;
  jobCount?: number;
  error?: string;
  duration: number;
}

// Load company lists
function loadCompanies(source: string): Company[] {
  const filePath = path.join(__dirname, 'companies', `${source}.json`);
  if (!fs.existsSync(filePath)) {
    console.log(`No company list found for ${source}`);
    return [];
  }
  const data: CompanyList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return data.companies;
}

// Run scraper for a single company
function scrapeCompany(source: string, slug: string): Promise<ScrapeResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const proc = spawn('npm', ['run', 'scrape', '--', `--source=${source}`, `--company=${slug}`], {
      cwd: path.join(__dirname),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    proc.stdout?.on('data', (data) => {
      stdout += data.toString();
    });

    proc.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    // Timeout after 2 minutes
    const timeout = setTimeout(() => {
      proc.kill('SIGTERM');
      resolve({
        company: slug,
        source,
        success: false,
        error: 'Timeout after 2 minutes',
        duration: Date.now() - startTime,
      });
    }, 120000);

    proc.on('close', (code) => {
      clearTimeout(timeout);
      const duration = Date.now() - startTime;

      // Parse job count from output
      const jobMatch = stdout.match(/Saved (\d+) jobs/i) || 
                       stdout.match(/(\d+) jobs? (saved|created|updated)/i) ||
                       stdout.match(/Total:?\s*(\d+)/i);
      const jobCount = jobMatch ? parseInt(jobMatch[1], 10) : 0;

      resolve({
        company: slug,
        source,
        success: code === 0,
        jobCount,
        error: code !== 0 ? stderr.slice(-200) : undefined,
        duration,
      });
    });
  });
}

// Process companies in parallel batches
async function processBatch(
  tasks: Array<{ source: string; slug: string }>,
  concurrency: number
): Promise<ScrapeResult[]> {
  const results: ScrapeResult[] = [];
  const queue = [...tasks];
  const active: Promise<void>[] = [];

  const processNext = async (): Promise<void> => {
    if (queue.length === 0) return;
    
    const task = queue.shift()!;
    const result = await scrapeCompany(task.source, task.slug);
    results.push(result);
    
    // Log progress
    const status = result.success ? '✓' : '✗';
    const jobs = result.jobCount ? `${result.jobCount} jobs` : 'no jobs';
    const time = `${(result.duration / 1000).toFixed(1)}s`;
    console.log(`  ${status} ${task.source}/${task.slug}: ${jobs} (${time})`);
    
    // Process next in queue
    if (queue.length > 0) {
      await processNext();
    }
  };

  // Start initial batch of concurrent workers
  for (let i = 0; i < Math.min(concurrency, tasks.length); i++) {
    active.push(processNext());
  }

  await Promise.all(active);
  return results;
}

// Main execution
async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║           Multi-Agent Bulk Scraper for JobScout                ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Load all company lists
  const sources = ['greenhouse', 'ashby', 'lever'];
  const allTasks: Array<{ source: string; slug: string }> = [];

  for (const source of sources) {
    const companies = loadCompanies(source);
    console.log(`📋 ${source}: ${companies.length} companies`);
    for (const company of companies) {
      allTasks.push({ source, slug: company.slug });
    }
  }

  console.log('');
  console.log(`🚀 Starting scrape of ${allTasks.length} companies with ${MAX_CONCURRENT} parallel workers`);
  console.log('═'.repeat(70));
  console.log('');

  const startTime = Date.now();
  const results = await processBatch(allTasks, MAX_CONCURRENT);
  const totalDuration = Date.now() - startTime;

  // Summary
  console.log('');
  console.log('═'.repeat(70));
  console.log('📊 SCRAPE SUMMARY');
  console.log('═'.repeat(70));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalJobs = results.reduce((sum, r) => sum + (r.jobCount || 0), 0);

  console.log(`✓ Successful: ${successful.length}/${results.length} companies`);
  console.log(`✗ Failed: ${failed.length} companies`);
  console.log(`📦 Total jobs scraped: ${totalJobs}`);
  console.log(`⏱️  Total time: ${(totalDuration / 1000 / 60).toFixed(1)} minutes`);

  if (failed.length > 0) {
    console.log('');
    console.log('Failed companies:');
    for (const f of failed) {
      console.log(`  - ${f.source}/${f.company}: ${f.error?.slice(0, 100) || 'Unknown error'}`);
    }
  }

  // Top companies by job count
  console.log('');
  console.log('Top companies by job count:');
  const sorted = [...results].sort((a, b) => (b.jobCount || 0) - (a.jobCount || 0));
  for (const r of sorted.slice(0, 10)) {
    if (r.jobCount) {
      console.log(`  ${r.company}: ${r.jobCount} jobs`);
    }
  }

  console.log('');
  console.log('✅ Bulk scrape complete!');
}

main().catch(console.error);
