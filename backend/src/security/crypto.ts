import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'workmatch-default-secret-key-32-chars-long!!';
const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT || 'workmatch_secure_system_salt_2026';
const ALGORITHM = 'aes-256-cbc';
const KEY = crypto.scryptSync(ENCRYPTION_SECRET, ENCRYPTION_SALT, 32);

if (process.env.NODE_ENV === 'production' && ENCRYPTION_SECRET.includes('workmatch-default')) {
  console.warn('[SECURITY WARNING] Using default encryption secret in production! Please set ENCRYPTION_SECRET in your environment.');
}

export class Security {
  public static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  public static encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  public static decrypt(cipherText: string): string {
    const parts = cipherText.split(':');
    if (parts.length !== 2) return cipherText;
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = parts[1];
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
