import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserSessionPayload } from '../../models/User.js';

const DEFAULT_DEV_SECRET = 'workmatch-jwt-dev-secret-key-2026';
const JWT_SECRET = process.env.JWT_SECRET || DEFAULT_DEV_SECRET;

// Enforce strict security in production
if (process.env.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === DEFAULT_DEV_SECRET || process.env.JWT_SECRET.length < 16) {
    const errorMsg = 'CRITICAL SECURITY ERROR: Production environment detected without a strong JWT_SECRET configured. Minimum 16 characters required.';
    console.error(`❌ ${errorMsg}`);
    if (process.env.STRICT_SECURITY !== 'false') {
      throw new Error(errorMsg);
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user?: UserSessionPayload;
}

/**
 * Parses cookies from raw HTTP request headers without external dependencies.
 */
export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;

  cookieHeader.split(';').forEach(cookie => {
    const parts = cookie.split('=');
    const name = parts[0]?.trim();
    if (name) {
      cookies[name] = decodeURIComponent(parts.slice(1).join('=').trim());
    }
  });

  return cookies;
}

/**
 * Sets an HttpOnly, SameSite cookie containing the user's JWT token.
 */
export function setAuthCookie(res: Response, token: string): void {
  const isSecure = process.env.NODE_ENV === 'production';
  const cookieOptions = [
    `workmatch_token=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${30 * 24 * 60 * 60}` // 30 days
  ];

  if (isSecure) {
    cookieOptions.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieOptions.join('; '));
}

/**
 * Clears the authenticated session cookie.
 */
export function clearAuthCookie(res: Response): void {
  const isSecure = process.env.NODE_ENV === 'production';
  const cookieOptions = [
    'workmatch_token=',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT'
  ];

  if (isSecure) {
    cookieOptions.push('Secure');
  }

  res.setHeader('Set-Cookie', cookieOptions.join('; '));
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  let token: string | null = null;

  // 1. Check Authorization header: Bearer <token>
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 2. Fallback to HttpOnly cookie: workmatch_token
  if (!token && req.headers.cookie) {
    const cookies = parseCookies(req.headers.cookie);
    if (cookies.workmatch_token) {
      token = cookies.workmatch_token;
    }
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as UserSessionPayload;
      req.user = decoded;
      return next();
    } catch (err) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired authorization token',
        code: 'UNAUTHORIZED'
      });
      return;
    }
  }

  // Allow fallback ONLY if explicitly enabled and strictly NOT in production
  if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_FALLBACK === 'true') {
    req.user = {
      userId: 'user_default',
      email: 'user@workmatch.local',
      isAdmin: true,
      planType: 'personal'
    };
    return next();
  }

  res.status(401).json({
    success: false,
    error: 'Authentication required. Please provide a valid Bearer token or session cookie.',
    code: 'UNAUTHORIZED'
  });
}

export function generateToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
}
