/**
 * Salary Parser
 * =============================================================================
 * Extract salary information from job descriptions.
 */

export interface ParsedSalary {
  min: number | null;
  max: number | null;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  '$': 'USD',
  '£': 'GBP',
  '€': 'EUR',
  '¥': 'JPY',
  'C$': 'CAD',
  'A$': 'AUD',
};

// Salary patterns to match
const SALARY_PATTERNS = [
  // $150,000 - $200,000 per year
  /(?<currency>[$£€¥]|[CA][$])\s*(?<min>[\d,]+)(?:\s*[k])?\s*[-–to]+\s*(?<currency2>[$£€¥]|[CA][$])?\s*(?<max>[\d,]+)(?:\s*[k])?\s*(?:per\s+)?(?<period>year|yr|annual|month|mo|hour|hr)?/gi,
  // 150k - 200k
  /(?<min>\d+)\s*[k]\s*[-–to]+\s*(?<max>\d+)\s*[k]/gi,
  // $150,000/year
  /(?<currency>[$£€¥]|[CA][$])\s*(?<amount>[\d,]+)(?:\s*[k])?\s*[/per]+\s*(?<period>year|yr|annual|month|mo|hour|hr)/gi,
  // Annual salary: $150,000
  /(?:salary|compensation|pay)[:\s]+(?<currency>[$£€¥]|[CA][$])?\s*(?<min>[\d,]+)(?:\s*[k])?\s*[-–to]*\s*(?<currency2>[$£€¥]|[CA][$])?\s*(?<max>[\d,]+)?(?:\s*[k])?/gi,
];

function parseNumber(str: string): number {
  const cleaned = str.replace(/,/g, '');
  const num = parseFloat(cleaned);
  
  // Handle "k" suffix (150k = 150000)
  if (num < 1000 && str.toLowerCase().includes('k')) {
    return num * 1000;
  }
  
  return num;
}

function normalizePeriod(period?: string): 'yearly' | 'monthly' | 'hourly' {
  if (!period) return 'yearly';
  
  const lower = period.toLowerCase();
  if (/hour|hr/i.test(lower)) return 'hourly';
  if (/month|mo/i.test(lower)) return 'monthly';
  return 'yearly';
}

function normalizeCurrency(symbol?: string): string {
  if (!symbol) return 'USD';
  return CURRENCY_SYMBOLS[symbol] || 'USD';
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
    currency: 'USD',
    period: 'yearly',
  };

  for (const pattern of SALARY_PATTERNS) {
    // Reset lastIndex for global patterns
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    
    if (match?.groups) {
      const { min, max, amount, currency, currency2, period } = match.groups;
      
      result.currency = normalizeCurrency(currency || currency2);
      result.period = normalizePeriod(period);
      
      if (amount) {
        // Single amount (e.g., $150,000/year)
        const parsed = parseNumber(amount);
        result.min = parsed;
        result.max = parsed;
      } else {
        if (min) {
          result.min = parseNumber(min);
        }
        if (max) {
          result.max = parseNumber(max);
        } else if (min) {
          // Only min specified, use as both
          result.max = result.min;
        }
      }

      // Normalize small numbers (likely in thousands)
      if (result.min && result.min < 1000) {
        result.min *= 1000;
      }
      if (result.max && result.max < 1000) {
        result.max *= 1000;
      }

      // Sanity check - salary should be reasonable
      if (result.min && result.min > 10000 && result.min < 10000000) {
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
  return /[$£€¥]\s*\d|salary|compensation|pay.*\d/i.test(text);
}
