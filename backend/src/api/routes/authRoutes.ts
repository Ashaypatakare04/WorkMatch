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
  resetPasswordSchema,
  oauthExchangeSchema
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

// ─────────────────────────────────────────────────────────────
// OAuth Social Authentication (Google, GitHub)
// ─────────────────────────────────────────────────────────────

function getOAuthCallbackUrl(req: AuthenticatedRequest, provider: string): string {
  const envVar = process.env[`${provider.toUpperCase()}_REDIRECT_URI`];
  if (envVar && envVar.trim()) {
    return envVar.trim();
  }
  const host = req.get('host') || 'localhost:4000';
  const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
  return `${protocol}://${host}/api/auth/${provider}/callback`;
}

// 9. Google OAuth Initiation
authRouter.get('/google', (req: AuthenticatedRequest, res: Response): void => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl = getOAuthCallbackUrl(req, 'google');

  if (clientId && clientId.trim() && !clientId.includes('mock') && !clientId.includes('placeholder')) {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account`;
    res.redirect(authUrl);
  } else {
    // Sandbox fallback: redirect directly to callback with test code
    res.redirect(`${callbackUrl}?code=sandbox_demo_google_code`);
  }
});

// 10. Google OAuth Callback
authRouter.get('/google/callback', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const code = req.query.code ? String(req.query.code) : '';
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const callbackUrl = getOAuthCallbackUrl(req, 'google');

    let googleProfile: { email: string; full_name: string; provider_id: string; avatar_url?: string };

    if (!code || code === 'sandbox_demo_google_code' || !clientId || !clientSecret || clientId.includes('placeholder')) {
      googleProfile = {
        email: 'alex.google@workmatch.local',
        full_name: 'Alex Mercer (Google)',
        provider_id: 'goog_sandbox_1001',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
      };
    } else {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: callbackUrl,
          grant_type: 'authorization_code'
        })
      });
      const tokenData = (await tokenRes.json()) as any;
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || 'Failed to exchange Google OAuth code');
      }

      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });
      const userData = (await userRes.json()) as any;
      if (!userData || !userData.email) {
        throw new Error('Could not retrieve user email from Google');
      }

      googleProfile = {
        email: userData.email,
        full_name: userData.name || userData.email.split('@')[0],
        provider_id: userData.id || userData.sub,
        avatar_url: userData.picture
      };
    }

    const user = UserRepository.findOrCreateOAuthUser({
      email: googleProfile.email,
      full_name: googleProfile.full_name,
      provider: 'google',
      provider_id: googleProfile.provider_id,
      avatar_url: googleProfile.avatar_url
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      planType: user.plan_type
    });

    setAuthCookie(res, token);

    const frontendUrl = process.env.FRONTEND_URL || '';
    const redirectUrl = frontendUrl ? `${frontendUrl}/?token=${token}#dashboard` : `/?token=${token}#dashboard`;
    res.redirect(redirectUrl);
  } catch (err: any) {
    res.status(500).send(`OAuth Google Error: ${err.message}`);
  }
});

// 11. GitHub OAuth Initiation
authRouter.get('/github', (req: AuthenticatedRequest, res: Response): void => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const callbackUrl = getOAuthCallbackUrl(req, 'github');

  if (clientId && clientId.trim() && !clientId.includes('mock') && !clientId.includes('placeholder')) {
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
      clientId
    )}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user:email`;
    res.redirect(authUrl);
  } else {
    // Sandbox fallback: redirect directly to callback with test code
    res.redirect(`${callbackUrl}?code=sandbox_demo_github_code`);
  }
});

// 12. GitHub OAuth Callback
authRouter.get('/github/callback', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const code = req.query.code ? String(req.query.code) : '';
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const callbackUrl = getOAuthCallbackUrl(req, 'github');

    let ghProfile: { email: string; full_name: string; provider_id: string; avatar_url?: string };

    if (!code || code === 'sandbox_demo_github_code' || !clientId || !clientSecret || clientId.includes('placeholder')) {
      ghProfile = {
        email: 'dev.github@workmatch.local',
        full_name: 'GitHub Engineer',
        provider_id: 'gh_sandbox_2002',
        avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100'
      };
    } else {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          redirect_uri: callbackUrl
        })
      });
      const tokenData = (await tokenRes.json()) as any;
      if (!tokenRes.ok || !tokenData.access_token) {
        throw new Error(tokenData.error_description || 'Failed to exchange GitHub OAuth code');
      }

      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'WorkMatch-AI'
        }
      });
      const userData = (await userRes.json()) as any;

      let email = userData.email;
      if (!email) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
            'User-Agent': 'WorkMatch-AI'
          }
        });
        const emailsData = (await emailsRes.json()) as any[];
        const primaryEmail = Array.isArray(emailsData) ? emailsData.find(e => e.primary && e.verified) || emailsData[0] : null;
        email = primaryEmail ? primaryEmail.email : `${userData.login}@users.noreply.github.com`;
      }

      ghProfile = {
        email,
        full_name: userData.name || userData.login,
        provider_id: String(userData.id),
        avatar_url: userData.avatar_url
      };
    }

    const user = UserRepository.findOrCreateOAuthUser({
      email: ghProfile.email,
      full_name: ghProfile.full_name,
      provider: 'github',
      provider_id: ghProfile.provider_id,
      avatar_url: ghProfile.avatar_url
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      planType: user.plan_type
    });

    setAuthCookie(res, token);

    const frontendUrl = process.env.FRONTEND_URL || '';
    const redirectUrl = frontendUrl ? `${frontendUrl}/?token=${token}#dashboard` : `/?token=${token}#dashboard`;
    res.redirect(redirectUrl);
  } catch (err: any) {
    res.status(500).send(`OAuth GitHub Error: ${err.message}`);
  }
});

// 13. Direct OAuth Token / Sandbox Exchange Endpoint (API / Client Popups)
authRouter.post(
  '/oauth',
  validateBody(oauthExchangeSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { provider, profile } = req.body;

      const email = profile?.email || (provider === 'google' ? 'alex.google@workmatch.local' : 'dev.github@workmatch.local');
      const fullName = profile?.name || (provider === 'google' ? 'Alex Mercer (Google)' : 'GitHub Engineer');
      const providerId = profile?.id || `${provider}_id_${Date.now()}`;
      const avatarUrl = profile?.avatar || (provider === 'google'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'
        : 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100');

      const user = UserRepository.findOrCreateOAuthUser({
        email,
        full_name: fullName,
        provider,
        provider_id: providerId,
        avatar_url: avatarUrl
      });

      const token = generateToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin,
        planType: user.plan_type
      });

      setAuthCookie(res, token);

      res.json({
        success: true,
        token,
        user
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
);
