/**
 * Adapter Exports
 */

export { 
  BaseAdapter, 
  type RawJob, 
  type NormalizedJob, 
  type AdapterConfig,
  type CompanyInfo,
} from './base.js';

export { GreenhouseAdapter, greenhouseAdapter } from './greenhouse.js';
export { LeverAdapter, leverAdapter } from './lever.js';
export { AshbyAdapter, ashbyAdapter } from './ashby.js';

import type { JobSource } from '@jobscout/shared';
import { greenhouseAdapter } from './greenhouse.js';
import { leverAdapter } from './lever.js';
import { ashbyAdapter } from './ashby.js';
import type { BaseAdapter } from './base.js';

/**
 * Get adapter by source
 */
export function getAdapter(source: JobSource): BaseAdapter {
  switch (source) {
    case 'greenhouse':
      return greenhouseAdapter;
    case 'lever':
      return leverAdapter;
    case 'ashby':
      return ashbyAdapter;
    default:
      throw new Error(`Unsupported source: ${source}`);
  }
}

/**
 * Get all available adapters
 */
export function getAllAdapters(): BaseAdapter[] {
  return [greenhouseAdapter, leverAdapter, ashbyAdapter];
}
