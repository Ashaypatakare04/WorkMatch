import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateBody(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
}

export function validateQuery(schema: z.ZodTypeAny) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Query parameter validation failed',
          code: 'QUERY_VALIDATION_ERROR',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      next(error);
    }
  };
}

// ─────────────────────────────────────────────────────────────
// Common Zod Validation Schemas
// ─────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().trim().email('Invalid email address format').max(255),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must not exceed 128 characters')
    .refine(
      val => /[0-9]/.test(val) || /[^a-zA-Z0-9]/.test(val),
      'Password must contain at least one digit or special symbol'
    ),
  full_name: z.string().trim().min(2, 'Full name must have at least 2 characters').max(255)
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required')
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .max(128)
    .refine(
      val => /[0-9]/.test(val) || /[^a-zA-Z0-9]/.test(val),
      'Password must contain at least one digit or special symbol'
    )
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email('Invalid email address format')
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(10, 'Reset token is required'),
  new_password: z
    .string()
    .min(8, 'New password must be at least 8 characters long')
    .max(128)
    .refine(
      val => /[0-9]/.test(val) || /[^a-zA-Z0-9]/.test(val),
      'Password must contain at least one digit or special symbol'
    )
});

export const applicationCreateSchema = z.object({
  job_id: z.string().min(1, 'job_id is required'),
  proposal_id: z.string().optional(),
  status: z
    .enum([
      'discovered',
      'saved',
      'proposal_generated',
      'applied',
      'viewed',
      'interview',
      'hired',
      'rejected',
      'withdrawn'
    ])
    .optional()
    .default('applied'),
  mode: z.enum(['manual', 'assisted', 'automatic']).optional().default('manual'),
  connect_cost: z.number().int().nonnegative().optional().default(0),
  notes: z.string().max(2000).optional().default('')
});

export const applicationStatusSchema = z.object({
  status: z.enum([
    'discovered',
    'saved',
    'proposal_generated',
    'applied',
    'viewed',
    'interview',
    'hired',
    'rejected',
    'withdrawn'
  ]),
  notes: z.string().max(2000).optional(),
  outcome: z.enum(['pending', 'won', 'lost']).optional()
});

export const automationSettingsUpdateSchema = z.object({
  application_mode: z.enum(['MANUAL', 'ASSISTED', 'AUTOMATIC']).optional(),
  is_active: z.boolean().or(z.number().min(0).max(1)).optional(),
  emergency_stop: z.boolean().or(z.number().min(0).max(1)).optional(),
  max_daily_applications: z.number().int().min(1).max(100).optional(),
  max_hourly_applications: z.number().int().min(1).max(20).optional(),
  min_match_score: z.number().min(0).max(100).optional(),
  max_connect_cost: z.number().int().nonnegative().max(50).optional(),
  allowed_categories: z.array(z.string()).optional(),
  excluded_categories: z.array(z.string()).optional(),
  max_budget_limit: z.number().nonnegative().optional(),
  require_low_risk_only: z.boolean().or(z.number().min(0).max(1)).optional()
});

export const oauthExchangeSchema = z.object({
  provider: z.enum(['google', 'github', 'linkedin']),
  token: z.string().optional(),
  profile: z
    .object({
      id: z.string().optional(),
      email: z.string().email().optional(),
      name: z.string().optional(),
      avatar: z.string().url().optional()
    })
    .optional()
});
