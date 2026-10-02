/**
 * ============================================================================
 * WORKMATCH STRUCTURED LOGGING & ERROR MONITORING UTILITY
 * ============================================================================
 *
 * Production-grade structured logger for observability, security audit compliance,
 * and error telemetry.
 *
 * Features:
 * - Structured JSON output for cloud log aggregators (Datadog, CloudWatch, GCP)
 * - Automatic redaction of sensitive credentials (passwords, tokens, cookies)
 * - Sentry / monitoring telemetry hook for unhandled exceptions
 * - Express HTTP request/response metrics middleware
 */

import { Request, Response, NextFunction } from 'express';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const SENSITIVE_KEYS = new Set([
  'password',
  'password_hash',
  'token',
  'secret',
  'jwt',
  'cookie',
  'authorization',
  'credit_card',
  'access_token',
  'client_secret'
]);

/**
 * Recursively deep-redacts sensitive keys from log objects.
 */
function sanitize(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return obj;
  if (typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(item => sanitize(item));
  }

  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('secret') || lowerKey.includes('password')) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object') {
      sanitized[key] = sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export class Logger {
  private static formatLog(level: LogLevel, message: string, meta?: Record<string, any>): string {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      environment: process.env.NODE_ENV || 'development',
      service: 'workmatch-api',
      ...(meta ? sanitize(meta) : {})
    };

    if (process.env.NODE_ENV === 'production') {
      return JSON.stringify(entry);
    }

    // Development readable format
    const metaStr = meta ? ` ${JSON.stringify(sanitize(meta))}` : '';
    const color = level === 'error' ? '\x1b[31m' : level === 'warn' ? '\x1b[33m' : '\x1b[36m';
    const reset = '\x1b[0m';
    return `${color}[${entry.timestamp}] [${entry.level}]${reset} ${message}${metaStr}`;
  }

  public static info(message: string, meta?: Record<string, any>): void {
    console.log(this.formatLog('info', message, meta));
  }

  public static debug(message: string, meta?: Record<string, any>): void {
    if (process.env.LOG_LEVEL === 'debug' || process.env.NODE_ENV !== 'production') {
      console.debug(this.formatLog('debug', message, meta));
    }
  }

  public static warn(message: string, meta?: Record<string, any>): void {
    console.warn(this.formatLog('warn', message, meta));
  }

  public static error(message: string, error?: any, meta?: Record<string, any>): void {
    const errorDetails = error instanceof Error
      ? { errorMessage: error.message, stack: process.env.NODE_ENV === 'production' ? undefined : error.stack }
      : { rawError: error };

    const combinedMeta = { ...errorDetails, ...(meta || {}) };
    console.error(this.formatLog('error', message, combinedMeta));

    // Sentry / telemetry hook
    if (process.env.SENTRY_DSN && typeof (globalThis as any).Sentry?.captureException === 'function') {
      try {
        (globalThis as any).Sentry.captureException(error || new Error(message));
      } catch {
        // Fallback silently if Sentry hook is misconfigured
      }
    }
  }
}

/**
 * Express middleware for high-performance HTTP request duration and status logging.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Suppress noisy health-check logs in high-volume production polling
    if (req.path === '/api/health' && statusCode === 200) {
      return;
    }

    const meta = {
      method: req.method,
      path: req.originalUrl || req.url,
      status: statusCode,
      durationMs,
      ip: String(clientIp)
    };

    if (statusCode >= 500) {
      Logger.error(`HTTP ${req.method} ${meta.path} - ${statusCode} (${durationMs}ms)`, null, meta);
    } else if (statusCode >= 400) {
      Logger.warn(`HTTP ${req.method} ${meta.path} - ${statusCode} (${durationMs}ms)`, meta);
    } else {
      Logger.info(`HTTP ${req.method} ${meta.path} - ${statusCode} (${durationMs}ms)`, meta);
    }
  });

  next();
}
