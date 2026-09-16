import { Router, Response } from 'express';
import { UserRepository } from '../../repositories/UserRepository.js';
import { Security } from '../../security/crypto.js';
import { AuthenticatedRequest, generateToken } from '../middleware/auth.js';

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

authRouter.get('/me', (req: AuthenticatedRequest, res: Response): void => {
  const userId = req.user?.userId || 'user_default';
  const user = UserRepository.findById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ success: true, user });
});
