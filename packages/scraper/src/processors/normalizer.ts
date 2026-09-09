/**
 * Job Normalizer
 * =============================================================================
 * Standardize job data from different ATS sources.
 */

import type { NormalizedJob, RawJob } from '../adapters/base.js';
import type { Company, JobSource } from '@jobscout/shared';
import { parseSalary } from './salary-parser.js';
import { extractSkills } from './skill-extractor.js';

export interface NormalizerOptions {
  extractSalary?: boolean;
  extractSkills?: boolean;
  inferExperience?: boolean;
}

const DEFAULT_OPTIONS: NormalizerOptions = {
  extractSalary: true,
  extractSkills: true,
  inferExperience: true,
};

/**
 * Clean and normalize HTML content
 */
export function cleanHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize location string
 */
export function normalizeLocation(location: string): string {
  return location
    .replace(/\s*,\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Check if job is remote
 */
export function isRemote(location: string, title: string, description: string): boolean {
  const text = `${location} ${title} ${description}`.toLowerCase();
  return /\b(remote|work from home|wfh|anywhere|distributed|telecommute)\b/.test(text);
}

/**
 * Infer location type
 */
export function inferLocationType(
  location: string,
  title: string,
  description: string
): 'remote' | 'hybrid' | 'onsite' {
  const text = `${location} ${title} ${description}`.toLowerCase();
  
  if (/\b(fully remote|100% remote|remote only|remote first)\b/.test(text)) {
    return 'remote';
  }
  if (/\b(remote|work from home|wfh|anywhere|distributed)\b/.test(text)) {
    // Check if it's hybrid
    if (/\b(hybrid|flexible|some remote|partial remote)\b/.test(text)) {
      return 'hybrid';
    }
    return 'remote';
  }
  if (/\b(hybrid|flexible location)\b/.test(text)) {
    return 'hybrid';
  }
  return 'onsite';
}

/**
 * Infer employment type
 */
export function inferEmploymentType(
  title: string,
  description: string
): 'full-time' | 'part-time' | 'contract' | 'internship' {
  const text = `${title} ${description}`.toLowerCase();
  
  if (/\b(intern|internship|co-op|coop|student)\b/.test(text)) {
    return 'internship';
  }
  if (/\b(contract|contractor|freelance|consultant|temporary|temp)\b/.test(text)) {
    return 'contract';
  }
  if (/\b(part[\s-]?time|parttime)\b/.test(text)) {
    return 'part-time';
  }
  return 'full-time';
}

/**
 * Infer experience level
 */
export function inferExperienceLevel(
  title: string,
  description: string
): 'entry' | 'mid' | 'senior' | 'staff' | 'principal' | null {
  const titleLower = title.toLowerCase();
  const text = `${title} ${description}`.toLowerCase();
  
  // Check title first (more reliable)
  if (/\b(principal|distinguished|fellow)\b/.test(titleLower)) {
    return 'principal';
  }
  if (/\b(staff|lead|architect|director)\b/.test(titleLower)) {
    return 'staff';
  }
  if (/\b(senior|sr\.?|iii)\b/.test(titleLower)) {
    return 'senior';
  }
  if (/\b(junior|jr\.?|entry|associate|new grad|graduate)\b/.test(titleLower)) {
    return 'entry';
  }
  if (/\b(mid[\s-]?level|ii)\b/.test(titleLower)) {
    return 'mid';
  }

  // Check years of experience in description
  const yearsMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/);
  if (yearsMatch) {
    const years = parseInt(yearsMatch[1], 10);
    if (years <= 2) return 'entry';
    if (years <= 5) return 'mid';
    if (years <= 8) return 'senior';
    return 'staff';
  }

  return null;
}

/**
 * Extract requirements from description
 */
export function extractRequirements(description: string): string[] {
  const cleanDesc = cleanHtml(description);
  const requirements: string[] = [];
  
  // Look for requirement sections
  const reqSection = cleanDesc.match(/(?:requirements?|qualifications?|what you.?ll need|must have)[:\s]*([\s\S]*?)(?=\n\n|what we|benefits|about us|$)/i);
  
  const textToSearch = reqSection ? reqSection[1] : cleanDesc;
  
  // Split into sentences/bullets
  const lines = textToSearch.split(/[•\-\*\n]/);
  
  for (const line of lines) {
    const cleaned = line.trim();
    if (cleaned.length > 20 && cleaned.length < 300) {
      // Filter out non-requirement lines
      if (!/^(we |our |the company|about|benefits)/i.test(cleaned)) {
        requirements.push(cleaned);
      }
    }
  }

  return requirements.slice(0, 15);
}

/**
 * Normalize a raw job into standard format
 */
export function normalizeJob(
  raw: RawJob,
  company: Company,
  source: JobSource,
  options: NormalizerOptions = DEFAULT_OPTIONS
): NormalizedJob {
  const cleanDescription = cleanHtml(raw.description);
  const normalizedLocation = normalizeLocation(raw.location);
  
  const job: NormalizedJob = {
    externalId: raw.externalId,
    source,
    title: raw.title.trim(),
    description: cleanDescription,
    requirements: extractRequirements(raw.description),
    location: normalizedLocation,
    isRemote: isRemote(normalizedLocation, raw.title, cleanDescription),
    locationType: inferLocationType(normalizedLocation, raw.title, cleanDescription),
    employmentType: inferEmploymentType(raw.title, cleanDescription),
    experienceLevel: options.inferExperience 
      ? inferExperienceLevel(raw.title, cleanDescription) 
      : null,
    salaryMin: null,
    salaryMax: null,
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    skills: [],
    department: raw.department?.trim() || null,
    postedAt: raw.postedAt,
    sourceUrl: raw.applyUrl,
    companyId: company.id,
  };

  // Extract salary if enabled
  if (options.extractSalary) {
    const salary = parseSalary(raw.description);
    job.salaryMin = salary.min;
    job.salaryMax = salary.max;
    job.salaryCurrency = salary.currency;
    job.salaryPeriod = salary.period;
  }

  // Extract skills if enabled
  if (options.extractSkills) {
    job.skills = extractSkills(`${raw.title} ${cleanDescription}`);
  }

  return job;
}
