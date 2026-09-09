/**
 * Type exports
 */

// Job types
export type {
  JobSource,
  LocationType,
  EmploymentType,
  ExperienceLevel,
  SalaryPeriod,
  SalaryRange,
  Job,
  JobCreateInput,
  JobUpdateInput,
  JobFilters,
  JobSortOptions,
  JobListItem,
  JobDetail,
} from './job.js';

// Company types
export type {
  CompanySize,
  Company,
  CompanyCreateInput,
  CompanyUpdateInput,
  CompanyFilters,
  CompanyListItem,
  CompanyDetail,
} from './company.js';

// API types
export type {
  PaginationParams,
  PaginationMeta,
  PaginatedResponse,
  ApiResponse,
  ApiError,
  ApiErrorDetail,
  ApiErrorResponse,
  ErrorCode,
  HealthStatus,
  FilterOption,
  FilterOptions,
} from './api.js';

export { ErrorCodes } from './api.js';

// Scraper types
export type {
  RawJob,
  AdapterConfig,
  CompanyConfig,
  ScrapeStatus,
  ScrapeResult,
  ScrapeError,
  ScrapeSummary,
  NormalizedJob,
  SalaryParseResult,
  SkillExtractionResult,
} from './scraper.js';
