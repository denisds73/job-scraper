/**
 * HTML Scraper Adapter
 * Base class for scraping career pages that don't have public APIs
 * 
 * Personal use only - for job hunting
 */

import { chromium, Browser, Page, BrowserContext } from 'playwright';

export interface ScrapedJob {
  title: string;
  location: string;
  department?: string;
  type?: string; // Full-time, Part-time, Contract
  url: string;
  description?: string;
  postedDate?: string;
  company: string;
}

export interface ScrapeConfig {
  name: string;
  careerUrl: string;
  selectors: {
    jobList: string;
    jobTitle: string;
    jobLocation: string;
    jobUrl: string;
    jobDepartment?: string;
    jobType?: string;
    pagination?: string;
    loadMore?: string;
  };
  waitFor?: string; // Selector to wait for before scraping
  scrollToLoad?: boolean; // For infinite scroll pages
  maxPages?: number;
  delay?: number; // Delay between requests in ms
}

export class HtmlScraper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private rateLimitDelay: number = 2000; // 2 seconds between requests

  async init(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });

    this.context = await this.browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-US',
    });
  }

  async close(): Promise<void> {
    if (this.context) await this.context.close();
    if (this.browser) await this.browser.close();
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async scrape(config: ScrapeConfig): Promise<ScrapedJob[]> {
    if (!this.context) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    const jobs: ScrapedJob[] = [];
    const page = await this.context.newPage();

    try {
      console.log(`[${config.name}] Navigating to ${config.careerUrl}`);
      
      await page.goto(config.careerUrl, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Wait for job list to load
      if (config.waitFor) {
        await page.waitForSelector(config.waitFor, { timeout: 15000 }).catch(() => {
          console.log(`[${config.name}] Warning: waitFor selector not found`);
        });
      }

      // Handle infinite scroll
      if (config.scrollToLoad) {
        await this.handleInfiniteScroll(page, config);
      }

      // Handle load more button
      if (config.selectors.loadMore) {
        await this.handleLoadMore(page, config);
      }

      // Extract jobs
      const jobElements = await page.$$(config.selectors.jobList);
      console.log(`[${config.name}] Found ${jobElements.length} job elements`);

      for (const element of jobElements) {
        try {
          const job = await this.extractJob(element, config);
          if (job && job.title && job.url) {
            jobs.push(job);
          }
        } catch (err) {
          console.log(`[${config.name}] Error extracting job:`, err);
        }
      }

      // Handle pagination
      if (config.selectors.pagination && config.maxPages && config.maxPages > 1) {
        let currentPage = 1;
        while (currentPage < config.maxPages) {
          const nextButton = await page.$(config.selectors.pagination);
          if (!nextButton) break;

          const isDisabled = await nextButton.getAttribute('disabled');
          if (isDisabled) break;

          await nextButton.click();
          await this.delay(config.delay || this.rateLimitDelay);
          await page.waitForLoadState('networkidle');

          const moreJobs = await page.$$(config.selectors.jobList);
          for (const element of moreJobs) {
            try {
              const job = await this.extractJob(element, config);
              if (job && job.title && job.url) {
                // Check for duplicates
                if (!jobs.find(j => j.url === job.url)) {
                  jobs.push(job);
                }
              }
            } catch (err) {
              // Skip this job
            }
          }

          currentPage++;
        }
      }

      console.log(`[${config.name}] Scraped ${jobs.length} jobs`);
      
    } catch (error) {
      console.error(`[${config.name}] Scrape failed:`, error);
    } finally {
      await page.close();
    }

    return jobs;
  }

  private async extractJob(element: any, config: ScrapeConfig): Promise<ScrapedJob | null> {
    try {
      const title = await element.$eval(config.selectors.jobTitle, (el: HTMLElement) => el.textContent?.trim() || '').catch(() => '');
      const location = await element.$eval(config.selectors.jobLocation, (el: HTMLElement) => el.textContent?.trim() || '').catch(() => '');
      
      let url = await element.$eval(config.selectors.jobUrl, (el: HTMLAnchorElement) => el.href).catch(() => '');
      
      // Handle relative URLs
      if (url && !url.startsWith('http')) {
        const baseUrl = new URL(config.careerUrl);
        url = new URL(url, baseUrl.origin).href;
      }

      let department = '';
      if (config.selectors.jobDepartment) {
        department = await element.$eval(config.selectors.jobDepartment, (el: HTMLElement) => el.textContent?.trim() || '').catch(() => '');
      }

      let type = '';
      if (config.selectors.jobType) {
        type = await element.$eval(config.selectors.jobType, (el: HTMLElement) => el.textContent?.trim() || '').catch(() => '');
      }

      if (!title) return null;

      return {
        title,
        location,
        url,
        department,
        type,
        company: config.name,
      };
    } catch (error) {
      return null;
    }
  }

  private async handleInfiniteScroll(page: Page, config: ScrapeConfig): Promise<void> {
    let previousHeight = 0;
    let scrollAttempts = 0;
    const maxScrollAttempts = 10;

    while (scrollAttempts < maxScrollAttempts) {
      const currentHeight = await page.evaluate(() => document.body.scrollHeight);
      
      if (currentHeight === previousHeight) {
        break;
      }

      previousHeight = currentHeight;
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await this.delay(config.delay || this.rateLimitDelay);
      scrollAttempts++;
    }
  }

  private async handleLoadMore(page: Page, config: ScrapeConfig): Promise<void> {
    if (!config.selectors.loadMore) return;

    let clickAttempts = 0;
    const maxClicks = 20;

    while (clickAttempts < maxClicks) {
      const loadMoreButton = await page.$(config.selectors.loadMore);
      if (!loadMoreButton) break;

      const isVisible = await loadMoreButton.isVisible();
      if (!isVisible) break;

      await loadMoreButton.click();
      await this.delay(config.delay || this.rateLimitDelay);
      clickAttempts++;
    }
  }
}

// Pre-configured scrapers for common career page patterns
export const SCRAPER_CONFIGS: Record<string, Partial<ScrapeConfig>> = {
  // Greenhouse-powered pages (custom theme)
  greenhouse: {
    selectors: {
      jobList: '[data-job-id], .job-post, .opening',
      jobTitle: '.job-title, h3, h2',
      jobLocation: '.job-location, .location',
      jobUrl: 'a[href*="job"], a[href*="apply"]',
    },
    waitFor: '.job-post, .opening',
  },

  // Lever-powered pages (custom theme)
  lever: {
    selectors: {
      jobList: '.posting',
      jobTitle: '.posting-title h5, .posting-title',
      jobLocation: '.posting-categories .location, .workplaceTypes',
      jobUrl: 'a.posting-btn-submit, a[href*="apply"]',
    },
    waitFor: '.posting',
  },

  // Workday (common for large enterprises)
  workday: {
    selectors: {
      jobList: '[data-automation-id="jobItem"], .job-tile',
      jobTitle: '[data-automation-id="jobTitle"], .job-title',
      jobLocation: '[data-automation-id="jobLocation"], .job-location',
      jobUrl: 'a[data-automation-id="jobTitle"], a.job-title-link',
    },
    waitFor: '[data-automation-id="jobItem"]',
    scrollToLoad: true,
  },

  // SAP SuccessFactors
  successfactors: {
    selectors: {
      jobList: '.job-result, .jobResultItem',
      jobTitle: '.job-title, .jobTitle',
      jobLocation: '.job-location, .jobLocation',
      jobUrl: 'a.job-link, a.jobTitle-link',
    },
    waitFor: '.job-result',
  },

  // Generic patterns (fallback)
  generic: {
    selectors: {
      jobList: '.job-card, .job-listing, .job-item, .careers-job, article[class*="job"]',
      jobTitle: 'h2, h3, .job-title, .title, [class*="title"]',
      jobLocation: '.location, [class*="location"], [class*="city"]',
      jobUrl: 'a[href*="job"], a[href*="career"], a[href*="apply"], a:first-child',
    },
  },
};

export default HtmlScraper;
