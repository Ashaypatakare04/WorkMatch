import { Router, Response } from 'express';
import { UserRepository } from '../../repositories/UserRepository.js';
import { Security } from '../../security/crypto.js';
import { AuthenticatedRequest, generateToken, authMiddleware, setAuthCookie, clearAuthCookie } from '../middleware/auth.js';
import {
  validateBody,
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from '../middleware/validation.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

export const authRouter = Router();

// 1. User Registration with rate limiting, Zod validation, and HttpOnly cookie
authRouter.post(
  '/register',
  authRateLimiter.middleware(),
  validateBody(registerSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { email, password, full_name } = req.body;

      const existing = UserRepository.findByEmail(email);
      if (existing) {
        res.status(400).json({ success: false, error: 'User with this email already exists' });
        return;
      }

      const passwordHash = await Security.hashPassword(password);
      const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const user = UserRepository.create({
        id,
        email,
        password_hash: passwordHash,
        full_name,
        is_admin: false,
        plan_type: 'personal'
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
        planType: user.plan_type
      });

      // Set HttpOnly Secure session cookie
      setAuthCookie(res, token);

      res.json({ success: true, token, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// 2. User Login with rate limiting, Zod validation, and HttpOnly cookie
authRouter.post(
  '/login',
  authRateLimiter.middleware(),
  validateBody(loginSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      const user = UserRepository.findByEmail(email);
      if (!user || !user.password_hash) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const match = await Security.comparePassword(password, user.password_hash);
      if (!match) {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
        return;
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
        planType: user.plan_type
      });

      // Set HttpOnly Secure session cookie
      setAuthCookie(res, token);

      res.json({ success: true, token, user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// 3. User Logout - Clears session cookie
authRouter.post('/logout', (req: AuthenticatedRequest, res: Response): void => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Successfully signed out' });
});

// 4. Password Change (Authenticated)
authRouter.post(
  '/change-password',
  authMiddleware,
  validateBody(changePasswordSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, error: 'Unauthorized' });
        return;
      }

      const user = UserRepository.findByEmail(req.user!.email);
      if (!user || !user.password_hash) {
        res.status(404).json({ success: false, error: 'User not found' });
        return;
      }

      const { current_password, new_password } = req.body;
      const isMatch = await Security.comparePassword(current_password, user.password_hash);
      if (!isMatch) {
        res.status(400).json({ success: false, error: 'Incorrect current password' });
        return;
      }

      const newHash = await Security.hashPassword(new_password);
      UserRepository.changePassword(userId, newHash);

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// 5. Password Reset Request (Forgot Password)
authRouter.post(
  '/forgot-password',
  authRateLimiter.middleware(),
  validateBody(forgotPasswordSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      const user = UserRepository.findByEmail(email);

      let resetToken: string | null = null;
      if (user) {
        resetToken = UserRepository.createPasswordResetToken(user.id);
        // In live production, dispatch via EmailNotifier (Resend / SMTP)
        console.log(`[Auth] Generated password reset token for ${email}: ${resetToken}`);
      }

      // Always return uniform message to prevent email enumeration attacks
      res.json({
        success: true,
        message: 'If an account exists with this email, password recovery instructions have been sent.',
        ...(process.env.NODE_ENV !== 'production' && resetToken ? { debugToken: resetToken } : {})
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// 6. Complete Password Reset with Token
authRouter.post(
  '/reset-password',
  authRateLimiter.middleware(),
  validateBody(resetPasswordSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { token, new_password } = req.body;

      const newHash = await Security.hashPassword(new_password);
      const success = UserRepository.resetPasswordWithToken(token, newHash);

      if (!success) {
        res.status(400).json({
          success: false,
          error: 'Invalid, expired, or already used password reset token'
        });
        return;
      }

      res.json({ success: true, message: 'Password has been reset successfully. You may now log in.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);

// 7. Demo 1-Click Fast Auth (Preserved for seamless demo environment)
authRouter.post('/demo', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    let defaultUser = UserRepository.findById('user_default');
    if (!defaultUser) {
      defaultUser = UserRepository.create({
        id: 'user_default',
        email: 'user@workmatch.local',
        full_name: 'Alex Mercer',
        is_admin: true,
        plan_type: 'personal'
      });
    }

    const token = generateToken({
      userId: defaultUser.id,
      email: defaultUser.email,
      isAdmin: defaultUser.is_admin,
      planType: defaultUser.plan_type
    });

    setAuthCookie(res, token);

    res.json({ success: true, token, user: defaultUser });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 8. Current Authenticated User Profile
authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  const user = UserRepository.findById(userId);
  if (!user) {
    res.status(404).json({ success: false, error: 'User not found' });
    return;
  }
  res.json({ success: true, user });
});
