/**
 * Salary Parser
 * =============================================================================
 * Extract salary information from job descriptions.
 * Updated for Indian market with INR and lakhs support.
 */

export interface ParsedSalary {
  min: number | null;
  max: number | null;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  // Indian Rupee (primary)
  '₹': 'INR',
  'Rs': 'INR',
  'Rs.': 'INR',
  'INR': 'INR',
  'inr': 'INR',
  // Other currencies (fallback)
  '$': 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  'C$': 'CAD',
  'A$': 'AUD',
};

// Salary patterns to match - Indian patterns first
const SALARY_PATTERNS = [
  // Indian: 15L - 25L, 15 lakh - 25 lakh, 15 LPA - 25 LPA
  /(?<min>\d+(?:\.\d+)?)\s*(?:L|lakh|lac|lpa)\s*[-–to]+\s*(?<max>\d+(?:\.\d+)?)\s*(?:L|lakh|lac|lpa)?(?:\s*(?:per\s*)?(?:year|annum|pa))?/gi,
  // Indian: ₹15L - ₹25L
  /(?<currency>₹|Rs\.?|INR)\s*(?<min>\d+(?:\.\d+)?)\s*(?:L|lakh|lac)?\s*[-–to]+\s*(?:₹|Rs\.?|INR)?\s*(?<max>\d+(?:\.\d+)?)\s*(?:L|lakh|lac)?/gi,
  // Indian: ₹15,00,000 - ₹25,00,000 (Indian comma format)
  /(?<currency>₹|Rs\.?|INR)\s*(?<min>[\d,]+)\s*[-–to]+\s*(?:₹|Rs\.?|INR)?\s*(?<max>[\d,]+)/gi,
  // 15-25 LPA (common format)
  /(?<min>\d+)\s*[-–to]+\s*(?<max>\d+)\s*(?:L|lakh|lac|lpa)(?:\s*(?:per\s*)?(?:year|annum|pa))?/gi,
  // USD/other: $150,000 - $200,000 per year
  /(?<currency>[$£€¥]|[CA][$])\s*(?<min>[\d,]+)(?:\s*[k])?\s*[-–to]+\s*(?<currency2>[$£€¥]|[CA][$])?\s*(?<max>[\d,]+)(?:\s*[k])?\s*(?:per\s+)?(?<period>year|yr|annual|month|mo|hour|hr)?/gi,
  // 150k - 200k (USD assumed)
  /(?<min>\d+)\s*[k]\s*[-–to]+\s*(?<max>\d+)\s*[k]/gi,
  // $150,000/year
  /(?<currency>[$£€¥]|[CA][$])\s*(?<amount>[\d,]+)(?:\s*[k])?\s*[/per]+\s*(?<period>year|yr|annual|month|mo|hour|hr)/gi,
  // CTC: ₹30L or CTC: 30 LPA
  /(?:ctc|salary|compensation|package)[:\s]+(?<currency>₹|Rs\.?|INR)?\s*(?<min>\d+(?:\.\d+)?)\s*(?:L|lakh|lac|lpa)?(?:\s*[-–to]+\s*(?:₹|Rs\.?|INR)?\s*(?<max>\d+(?:\.\d+)?)\s*(?:L|lakh|lac|lpa)?)?/gi,
];

function parseNumber(str: string, isLakhs: boolean = false): number {
  // Remove commas and clean up
  const cleaned = str.replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  
  // Handle lakhs (L, lakh, lac, lpa suffix or explicit flag)
  if (isLakhs || num < 200) {
    // Numbers under 200 are likely in lakhs for Indian salaries
    return num * 100000;
  }
  
  // Handle "k" suffix (150k = 150000)
  if (num < 1000 && str.toLowerCase().includes('k')) {
    return num * 1000;
  }
  
  return num;
}

function isLakhsFormat(text: string): boolean {
  return /l|lakh|lac|lpa/i.test(text);
}

function normalizePeriod(period?: string): 'yearly' | 'monthly' | 'hourly' {
  if (!period) return 'yearly';
  
  const lower = period.toLowerCase();
  if (/hour|hr/i.test(lower)) return 'hourly';
  if (/month|mo/i.test(lower)) return 'monthly';
  return 'yearly';
}

function normalizeCurrency(symbol?: string): string {
  if (!symbol) return 'INR'; // Default to INR for India
  const normalized = symbol.trim();
  return CURRENCY_SYMBOLS[normalized] || CURRENCY_SYMBOLS[normalized.toUpperCase()] || 'INR';
}

function normalizeToYearly(amount: number, period: string): number {
  switch (period) {
    case 'hourly':
      return amount * 2080; // 40 hours * 52 weeks
    case 'monthly':
      return amount * 12;
    default:
      return amount;
  }
}

/**
 * Parse salary information from text
 */
export function parseSalary(text: string): ParsedSalary {
  const result: ParsedSalary = {
    min: null,
    max: null,
    currency: 'INR', // Default to INR for India-focused platform
    period: 'yearly',
  };

  // Check if text contains Indian salary indicators
  const hasLakhs = isLakhsFormat(text);
  const hasINR = /₹|Rs\.?|INR|lpa|lakh/i.test(text);

  for (const pattern of SALARY_PATTERNS) {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    
    if (match?.groups) {
      const { min, max, amount, currency, currency2, period } = match.groups;
      
      result.currency = normalizeCurrency(currency || currency2);
      result.period = normalizePeriod(period);
      
      // Determine if values are in lakhs
      const useLakhs = hasLakhs || hasINR || result.currency === 'INR';
      
      if (amount) {
        // Single amount (e.g., $150,000/year or ₹30L)
        const parsed = parseNumber(amount, useLakhs && parseFloat(amount.replace(/,/g, '')) < 200);
        result.min = parsed;
        result.max = parsed;
      } else {
        if (min) {
          const minNum = parseFloat(min.replace(/,/g, ''));
          result.min = parseNumber(min, useLakhs && minNum < 200);
        }
        if (max) {
          const maxNum = parseFloat(max.replace(/,/g, ''));
          result.max = parseNumber(max, useLakhs && maxNum < 200);
        } else if (min) {
          // Only min specified, use as both
          result.max = result.min;
        }
      }

      // For INR, if values are suspiciously low, they might be in lakhs
      if (result.currency === 'INR') {
        if (result.min && result.min < 500000 && result.min > 100) {
          // Likely in lakhs, convert
          result.min *= 100000;
        }
        if (result.max && result.max < 500000 && result.max > 100) {
          result.max *= 100000;
        }
      }

      // Sanity check - salary should be reasonable
      // For INR: 3L (300000) to 3Cr (30000000) annual
      // For USD: $30k to $1M annual
      const minValid = result.currency === 'INR' 
        ? (result.min && result.min >= 100000 && result.min < 100000000)
        : (result.min && result.min >= 10000 && result.min < 10000000);
      
      if (minValid) {
        break; // Found a valid salary
      } else {
        // Reset and try next pattern
        result.min = null;
        result.max = null;
      }
    }
  }

  // Ensure min <= max
  if (result.min && result.max && result.min > result.max) {
    [result.min, result.max] = [result.max, result.min];
  }

  return result;
}

/**
 * Check if text likely contains salary information
 */
export function hasSalaryInfo(text: string): boolean {
  return /[$£€¥₹]\s*\d|Rs\.?\s*\d|\d+\s*(?:L|lakh|lac|lpa)|salary|compensation|ctc|package.*\d/i.test(text);
}

/**
 * Format salary for display (Indian format)
 */
export function formatSalaryINR(min?: number | null, max?: number | null): string {
  if (!min && !max) return '';
  
  const formatAmount = (amt: number): string => {
    if (amt >= 10000000) {
      return `₹${(amt / 10000000).toFixed(1)}Cr`;
    }
    if (amt >= 100000) {
      return `₹${Math.round(amt / 100000)}L`;
    }
    return `₹${amt.toLocaleString('en-IN')}`;
  };
  
  if (min && max && min !== max) {
    return `${formatAmount(min)} - ${formatAmount(max)}`;
  }
  if (min) {
    return formatAmount(min);
  }
  if (max) {
    return `Up to ${formatAmount(max)}`;
  }
  return '';
}
