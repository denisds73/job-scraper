/**
 * Processor Exports
 */

export { 
  normalizeJob, 
  cleanHtml, 
  normalizeLocation,
  isRemote,
  inferLocationType,
  inferEmploymentType,
  inferExperienceLevel,
  extractRequirements,
  type NormalizerOptions,
} from './normalizer.js';

export {
  parseSalary,
  hasSalaryInfo,
  type ParsedSalary,
} from './salary-parser.js';

export {
  extractSkills,
  getSkillCategory,
  getAllSkills,
} from './skill-extractor.js';
