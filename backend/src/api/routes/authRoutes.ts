import { Router, Response } from 'express';
import { UserRepository } from '../../repositories/UserRepository.js';
import { Security } from '../../security/crypto.js';
import { AuthenticatedRequest, generateToken, authMiddleware } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password || !full_name) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const existing = UserRepository.findByEmail(email);
    if (existing) {
      res.status(400).json({ error: 'User with this email already exists' });
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

    res.json({ success: true, token, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post('/login', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required' });
      return;
    }

    const user = UserRepository.findByEmail(email);
    if (!user || !user.password_hash) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const match = await Security.comparePassword(password, user.password_hash);
    if (!match) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.is_admin,
      planType: user.plan_type
    });

    res.json({ success: true, token, user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

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

    res.json({ success: true, token, user: defaultUser });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = UserRepository.findById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ success: true, user });
});
