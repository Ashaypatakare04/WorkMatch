import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  const status = err.status || 500;
  Logger.error(`Unhandled error during ${req.method} ${req.url}: ${err.message}`, err, {
    status,
    method: req.method,
    url: req.url,
    ip: req.ip
  });

  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
    code: err.code || (status === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR'),
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
