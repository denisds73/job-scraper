/**
 * Shared constants used across all packages
 */

// ============================================
// JOB CONSTANTS
// ============================================

export const JOB_SOURCES = [
  'greenhouse',
  'lever',
  'ashby',
  'workable',
  'smartrecruiters',
] as const;

export const LOCATION_TYPES = ['remote', 'hybrid', 'onsite'] as const;

export const EMPLOYMENT_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'internship',
] as const;

export const EXPERIENCE_LEVELS = [
  'entry',
  'mid',
  'senior',
  'staff',
  'principal',
] as const;

export const SALARY_PERIODS = ['yearly', 'monthly', 'hourly'] as const;

// ============================================
// COMPANY CONSTANTS
// ============================================

export const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001-5000',
  '5000+',
] as const;

// ============================================
// UI LABELS
// ============================================

export const LOCATION_TYPE_LABELS: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
};

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

export const EXPERIENCE_LEVEL_LABELS: Record<string, string> = {
  entry: 'Entry Level',
  mid: 'Mid Level',
  senior: 'Senior',
  staff: 'Staff / Lead',
  principal: 'Principal / Director',
};

export const COMPANY_SIZE_LABELS: Record<string, string> = {
  '1-10': '1-10 employees',
  '11-50': '11-50 employees',
  '51-200': '51-200 employees',
  '201-500': '201-500 employees',
  '501-1000': '501-1,000 employees',
  '1001-5000': '1,001-5,000 employees',
  '5000+': '5,000+ employees',
};

// ============================================
// PAGINATION
// ============================================

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DEFAULT_PAGE = 1;

// ============================================
// CACHE TTL (seconds)
// ============================================

export const CACHE_TTL = {
  JOB_LIST: 60 * 5,        // 5 minutes
  JOB_DETAIL: 60 * 60,     // 1 hour
  COMPANY_LIST: 60 * 60,   // 1 hour
  COMPANY_DETAIL: 60 * 60, // 1 hour
  FILTERS: 60 * 60,        // 1 hour
  SEARCH: 60 * 5,          // 5 minutes
} as const;

// ============================================
// SCRAPER DEFAULTS
// ============================================

export const SCRAPER_DEFAULTS = {
  RATE_LIMIT: 2,           // requests per second
  TIMEOUT: 10000,          // 10 seconds
  RETRIES: 3,
  RETRY_DELAY: 1000,       // 1 second
  STALE_DAYS: 90,          // Days before job is considered stale
} as const;

// ============================================
// SKILLS
// ============================================

export const COMMON_SKILLS = [
  // Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
  // Frontend
  'React', 'Vue', 'Angular', 'Next.js', 'Svelte', 'HTML', 'CSS', 'Tailwind', 'SASS',
  // Backend
  'Node.js', 'Express', 'Fastify', 'Django', 'Flask', 'Spring', 'Rails', 'Laravel',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'SQLite',
  // Cloud & DevOps
  'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitHub Actions',
  // Data
  'SQL', 'GraphQL', 'REST', 'gRPC', 'Kafka', 'RabbitMQ',
  // ML/AI
  'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'Computer Vision',
  // Mobile
  'React Native', 'Flutter', 'iOS', 'Android', 'SwiftUI',
  // Testing
  'Jest', 'Cypress', 'Playwright', 'Testing', 'TDD',
  // Other
  'Git', 'Linux', 'Agile', 'Scrum', 'CI/CD',
] as const;
