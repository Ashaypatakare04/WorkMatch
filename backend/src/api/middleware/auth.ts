import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserSessionPayload } from '../../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'workmatch-jwt-dev-secret-key-2026';

export interface AuthenticatedRequest extends Request {
  user?: UserSessionPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserSessionPayload;
      req.user = decoded;
      return next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid or expired authorization token', code: 'UNAUTHORIZED' });
      return;
    }
  }

  // Allow fallback ONLY if explicitly enabled in local development environment
  if (process.env.ALLOW_DEV_FALLBACK === 'true') {
    req.user = {
      userId: 'user_default',
      email: 'user@workmatch.local',
      isAdmin: true,
      planType: 'personal'
    };
    return next();
  }

  res.status(401).json({ error: 'Authentication required. Please provide a valid Bearer token.', code: 'UNAUTHORIZED' });
}

export function generateToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}
