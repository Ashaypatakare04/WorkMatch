import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimiterOptions {
  windowMs: number;
  maxRequests: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
}

export class InMemoryRateLimiter {
  private records = new Map<string, RateLimitRecord>();
  private windowMs: number;
  private maxRequests: number;
  private message: string;
  private keyGenerator: (req: Request) => string;

  constructor(options: RateLimiterOptions) {
    this.windowMs = options.windowMs;
    this.maxRequests = options.maxRequests;
    this.message = options.message || 'Too many requests, please try again later.';
    this.keyGenerator =
      options.keyGenerator ||
      ((req: Request) => {
        const forwarded = req.headers['x-forwarded-for'];
        if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
        return req.socket.remoteAddress || req.ip || 'unknown';
      });

    // Cleanup stale entries every 5 minutes
    setInterval(() => this.cleanup(), 300000).unref();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.records.entries()) {
      record.timestamps = record.timestamps.filter(t => now - t < this.windowMs);
      if (record.timestamps.length === 0) {
        this.records.delete(key);
      }
    }
  }

  public reset(): void {
    this.records.clear();
  }

  public middleware() {
    return (req: Request, res: Response, next: NextFunction): void => {
      // Allow bypass in test environment unless explicitly testing rate limits
      if (process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit']) {
        return next();
      }

      const key = this.keyGenerator(req);
      const now = Date.now();
      let record = this.records.get(key);

      if (!record) {
        record = { timestamps: [] };
        this.records.set(key, record);
      }

      // Filter timestamps outside current window
      record.timestamps = record.timestamps.filter(t => now - t < this.windowMs);

      const remaining = Math.max(0, this.maxRequests - record.timestamps.length);
      const resetTime = record.timestamps.length > 0 ? Math.ceil((record.timestamps[0] + this.windowMs - now) / 1000) : Math.ceil(this.windowMs / 1000);

      res.setHeader('X-RateLimit-Limit', this.maxRequests);
      res.setHeader('X-RateLimit-Remaining', remaining);
      res.setHeader('X-RateLimit-Reset', resetTime);

      if (record.timestamps.length >= this.maxRequests) {
        res.setHeader('Retry-After', resetTime);
        res.status(429).json({
          success: false,
          error: this.message,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: resetTime
        });
        return;
      }

      record.timestamps.push(now);
      next();
    };
  }
}

// 15 requests per 15 minutes for authentication endpoints
export const authRateLimiter = new InMemoryRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 15,
  message: 'Too many authentication attempts. Please wait 15 minutes before trying again.'
});

// 300 requests per minute for general API endpoints
export const apiRateLimiter = new InMemoryRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 300,
  message: 'API rate limit exceeded. Please throttle your requests.'
});
