/**
 * Company-Specific Scraper Configurations
 * 
 * Each config tells the scraper how to extract jobs from that company's career page.
 * These were manually tested and configured for each site.
 */

import { ScrapeConfig } from './html-scraper';

export const COMPANY_CONFIGS: ScrapeConfig[] = [
  // ============================================
  // CHENNAI COMPANIES
  // ============================================
  {
    name: 'Zoho',
    careerUrl: 'https://careers.zohocorp.com/jobs/Openings',
    selectors: {
      jobList: '.job-card, .job-listing, [class*="job-item"]',
      jobTitle: 'h3, .job-title, [class*="title"]',
      jobLocation: '.location, [class*="location"]',
      jobUrl: 'a[href*="job"], a[href*="Job"]',
      jobDepartment: '.department, [class*="department"]',
    },
    waitFor: '.job-card, .job-listing',
    scrollToLoad: true,
    delay: 2000,
  },
  {
    name: 'Freshworks',
    careerUrl: 'https://www.freshworks.com/company/careers/jobs/',
    selectors: {
      jobList: '.job-card, .careers-job, [class*="job-listing"]',
      jobTitle: 'h3, h2, .job-title',
      jobLocation: '.location, [class*="location"]',
      jobUrl: 'a',
      jobDepartment: '.department',
    },
    waitFor: '.job-card',
    delay: 2000,
  },
  {
    name: 'Chargebee',
    careerUrl: 'https://www.chargebee.com/company/careers/',
    selectors: {
      jobList: '.job-card, .career-listing, [class*="opening"]',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    waitFor: '.job-card',
    delay: 2000,
  },
  {
    name: 'SurveySparrow',
    careerUrl: 'https://surveysparrow.com/careers/',
    selectors: {
      jobList: '.job-item, .career-item, [class*="position"]',
      jobTitle: 'h3, h4, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Kissflow',
    careerUrl: 'https://kissflow.com/careers/',
    selectors: {
      jobList: '.job-listing, .opening, [class*="job"]',
      jobTitle: 'h3, .job-title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },

  // ============================================
  // BANGALORE UNICORNS
  // ============================================
  {
    name: 'Flipkart',
    careerUrl: 'https://www.flipkartcareers.com/#!/joblist',
    selectors: {
      jobList: '.job-tile, .job-card, [class*="job-item"]',
      jobTitle: '.job-title, h3, h4',
      jobLocation: '.job-location, .location',
      jobUrl: 'a[href*="job"]',
      jobDepartment: '.job-category, .department',
    },
    waitFor: '.job-tile',
    scrollToLoad: true,
    delay: 3000,
  },
  {
    name: 'Razorpay',
    careerUrl: 'https://razorpay.com/jobs/',
    selectors: {
      jobList: '.job-card, .job-listing, [class*="position"]',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
      jobDepartment: '.department',
    },
    waitFor: '.job-card',
    delay: 2000,
  },
  {
    name: 'Swiggy',
    careerUrl: 'https://careers.swiggy.com/',
    selectors: {
      jobList: '.job-card, .opening, [class*="job"]',
      jobTitle: 'h3, h4, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    scrollToLoad: true,
    delay: 2000,
  },
  {
    name: 'Zerodha',
    careerUrl: 'https://zerodha.com/careers/',
    selectors: {
      jobList: '.job-item, .opening, article',
      jobTitle: 'h3, h4, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'PhonePe',
    careerUrl: 'https://www.phonepe.com/careers/openings/',
    selectors: {
      jobList: '.job-card, .job-listing, [class*="position"]',
      jobTitle: 'h3, .title, .job-title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    waitFor: '.job-card',
    delay: 2000,
  },
  {
    name: 'Ola',
    careerUrl: 'https://www.olacabs.com/careers',
    selectors: {
      jobList: '.job-item, .job-card, [class*="opening"]',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'BigBasket',
    careerUrl: 'https://www.bigbasket.com/careers/',
    selectors: {
      jobList: '.job-card, .opening, [class*="job"]',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'BYJU\'S',
    careerUrl: 'https://byjus.com/careers/',
    selectors: {
      jobList: '.job-card, .opening, [class*="position"]',
      jobTitle: 'h3, h4, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Unacademy',
    careerUrl: 'https://unacademy.com/careers',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'upGrad',
    careerUrl: 'https://www.upgrad.com/careers/',
    selectors: {
      jobList: '.job-card, .opening, [class*="job"]',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Urban Company',
    careerUrl: 'https://www.urbancompany.com/careers',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Zepto',
    careerUrl: 'https://www.zeptonow.com/careers',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Jupiter Money',
    careerUrl: 'https://jupiter.money/careers/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Smallcase',
    careerUrl: 'https://www.smallcase.com/careers',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },

  // ============================================
  // BANGALORE MNCs (Big Tech)
  // ============================================
  {
    name: 'Google India',
    careerUrl: 'https://www.google.com/about/careers/applications/jobs/results/?location=Bangalore%2C%20Karnataka%2C%20India&location=Hyderabad%2C%20Telangana%2C%20India',
    selectors: {
      jobList: '[class*="gc-card"], .job-result',
      jobTitle: 'h3, .job-title',
      jobLocation: '[class*="location"]',
      jobUrl: 'a[href*="jobs"]',
    },
    waitFor: '[class*="gc-card"]',
    delay: 3000,
  },
  {
    name: 'Amazon India',
    careerUrl: 'https://www.amazon.jobs/en/locations/bangalore-india',
    selectors: {
      jobList: '.job-tile, .job-card',
      jobTitle: '.job-title',
      jobLocation: '.job-location',
      jobUrl: 'a.job-title',
    },
    waitFor: '.job-tile',
    scrollToLoad: true,
    delay: 3000,
  },
  {
    name: 'Microsoft India',
    careerUrl: 'https://careers.microsoft.com/us/en/search-results?keywords=&location=India',
    selectors: {
      jobList: '.ms-List-cell, [class*="job-item"]',
      jobTitle: '.job-title, h3',
      jobLocation: '.job-location',
      jobUrl: 'a.job-title-link',
    },
    waitFor: '.ms-List-cell',
    scrollToLoad: true,
    delay: 3000,
  },
  {
    name: 'Meta India',
    careerUrl: 'https://www.metacareers.com/jobs?offices[0]=Bangalore%2C%20India&offices[1]=Gurugram%2C%20India',
    selectors: {
      jobList: '[class*="job-card"], [class*="result"]',
      jobTitle: 'h3, [class*="title"]',
      jobLocation: '[class*="location"]',
      jobUrl: 'a',
    },
    waitFor: '[class*="job-card"]',
    delay: 3000,
  },
  {
    name: 'Apple India',
    careerUrl: 'https://jobs.apple.com/en-in/search?location=india-INDC',
    selectors: {
      jobList: '.table-row, .job-item',
      jobTitle: '.table-col-1, .job-title',
      jobLocation: '.table-col-2, .location',
      jobUrl: 'a',
    },
    waitFor: '.table-row',
    delay: 2000,
  },

  // ============================================
  // DELHI NCR UNICORNS
  // ============================================
  {
    name: 'Zomato',
    careerUrl: 'https://www.zomato.com/careers',
    selectors: {
      jobList: '.job-card, .opening, [class*="job"]',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'PolicyBazaar',
    careerUrl: 'https://www.policybazaar.com/careers/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'MakeMyTrip',
    careerUrl: 'https://careers.makemytrip.com/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'OYO',
    careerUrl: 'https://www.oyorooms.com/careers/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Cars24',
    careerUrl: 'https://www.cars24.com/careers/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Lenskart',
    careerUrl: 'https://www.lenskart.com/careers',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Nykaa',
    careerUrl: 'https://www.nykaa.com/careers',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Delhivery',
    careerUrl: 'https://www.delhivery.com/careers/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },

  // ============================================
  // HYDERABAD
  // ============================================
  {
    name: 'Zenoti',
    careerUrl: 'https://www.zenoti.com/careers/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },

  // ============================================
  // PUNE
  // ============================================
  {
    name: 'Persistent Systems',
    careerUrl: 'https://www.persistent.com/careers/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },

  // ============================================
  // COIMBATORE
  // ============================================
  {
    name: 'Payoda',
    careerUrl: 'https://payoda.com/careers/',
    selectors: {
      jobList: '.job-card, .opening, [class*="job"]',
      jobTitle: 'h3, h4, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Ideas2IT',
    careerUrl: 'https://www.ideas2it.com/careers/',
    selectors: {
      jobList: '.job-card, .opening',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },

  // ============================================
  // IT SERVICES (TCS, Infosys, Wipro, etc.)
  // ============================================
  {
    name: 'TCS',
    careerUrl: 'https://ibegin.tcs.com/iBegin/jobs/search',
    selectors: {
      jobList: '.job-card, .job-listing, [class*="job-item"]',
      jobTitle: 'h3, .job-title, .title',
      jobLocation: '.location, .job-location',
      jobUrl: 'a[href*="job"]',
    },
    waitFor: '.job-card',
    scrollToLoad: true,
    delay: 3000,
  },
  {
    name: 'Infosys',
    careerUrl: 'https://www.infosys.com/careers/india/apply.html',
    selectors: {
      jobList: '.job-card, .job-listing',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Wipro',
    careerUrl: 'https://careers.wipro.com/careers-home/jobs',
    selectors: {
      jobList: '.job-card, .job-listing',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    waitFor: '.job-card',
    delay: 2000,
  },
  {
    name: 'HCL Tech',
    careerUrl: 'https://www.hcltech.com/careers',
    selectors: {
      jobList: '.job-card, .job-listing',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Tech Mahindra',
    careerUrl: 'https://careers.techmahindra.com/',
    selectors: {
      jobList: '.job-card, .job-listing',
      jobTitle: 'h3, .title',
      jobLocation: '.location',
      jobUrl: 'a',
    },
    delay: 2000,
  },
  {
    name: 'Cognizant',
    careerUrl: 'https://careers.cognizant.com/global/en/search-results',
    selectors: {
      jobList: '.job-card, [class*="job-listing"]',
      jobTitle: 'h3, .job-title',
      jobLocation: '.location',
      jobUrl: 'a.job-title-link',
    },
    waitFor: '.job-card',
    scrollToLoad: true,
    delay: 3000,
  },
];

// Helper to get config by company name
export function getCompanyConfig(companyName: string): ScrapeConfig | undefined {
  return COMPANY_CONFIGS.find(
    c => c.name.toLowerCase() === companyName.toLowerCase()
  );
}

// Get all companies for a specific city/category
export function getCompaniesByCity(city: string): ScrapeConfig[] {
  const cityCompanies: Record<string, string[]> = {
    chennai: ['Zoho', 'Freshworks', 'Chargebee', 'SurveySparrow', 'Kissflow'],
    bangalore: ['Flipkart', 'Razorpay', 'Swiggy', 'Zerodha', 'PhonePe', 'Ola', 'BigBasket', 'BYJU\'S', 'Unacademy', 'upGrad', 'Urban Company', 'Zepto', 'Jupiter Money', 'Smallcase', 'Google India', 'Amazon India', 'Microsoft India', 'Meta India', 'Apple India'],
    delhi: ['Zomato', 'PolicyBazaar', 'MakeMyTrip', 'OYO', 'Cars24', 'Lenskart', 'Nykaa', 'Delhivery'],
    hyderabad: ['Zenoti'],
    pune: ['Persistent Systems'],
    coimbatore: ['Payoda', 'Ideas2IT'],
    services: ['TCS', 'Infosys', 'Wipro', 'HCL Tech', 'Tech Mahindra', 'Cognizant'],
  };

  const companyNames = cityCompanies[city.toLowerCase()] || [];
  return COMPANY_CONFIGS.filter(c => companyNames.includes(c.name));
}

export default COMPANY_CONFIGS;
