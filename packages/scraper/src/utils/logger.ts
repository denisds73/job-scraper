/**
 * Scraper Logger
 * =============================================================================
 * Structured logging for scraper operations.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  source?: string;
  company?: string;
  jobId?: string;
  [key: string]: unknown;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  debug: '\x1b[90m', // gray
  info: '\x1b[36m',  // cyan
  warn: '\x1b[33m',  // yellow
  error: '\x1b[31m', // red
};

const RESET = '\x1b[0m';

class Logger {
  private minLevel: LogLevel;
  private context: LogContext;

  constructor(context: LogContext = {}, minLevel?: LogLevel) {
    this.context = context;
    this.minLevel = minLevel || (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(
    level: LogLevel,
    message: string,
    context?: LogContext
  ): string {
    const timestamp = this.formatTimestamp();
    const color = LEVEL_COLORS[level];
    const levelStr = level.toUpperCase().padEnd(5);
    
    const mergedContext = { ...this.context, ...context };
    const contextStr = Object.keys(mergedContext).length > 0
      ? ` ${JSON.stringify(mergedContext)}`
      : '';

    return `${color}[${timestamp}] ${levelStr}${RESET} ${message}${contextStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      console.log(this.formatMessage('info', message, context));
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, context));
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    if (this.shouldLog('error')) {
      const errorContext = error
        ? { ...context, error: error.message, stack: error.stack }
        : context;
      console.error(this.formatMessage('error', message, errorContext));
    }
  }

  child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context }, this.minLevel);
  }

  // Progress indicator for batch operations
  progress(current: number, total: number, message: string): void {
    const percent = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.floor(percent / 5)) + '░'.repeat(20 - Math.floor(percent / 5));
    process.stdout.write(`\r[${bar}] ${percent}% ${message}`);
    if (current === total) {
      console.log(''); // New line when complete
    }
  }
}

// Default logger instance
export const logger = new Logger();

// Factory for creating child loggers
export function createLogger(context: LogContext): Logger {
  return new Logger(context);
}

export { Logger, LogContext, LogLevel };
