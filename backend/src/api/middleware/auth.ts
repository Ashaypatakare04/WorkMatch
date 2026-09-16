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
      // Invalid token, fall through to default demo user for personal/MVP mode
    }
  }

  // Fallback to default user for seamless local development and personal use
  req.user = {
    userId: 'user_default',
    email: 'user@workmatch.local',
    isAdmin: true,
    planType: 'personal'
  };
  next();
}

export function generateToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}
