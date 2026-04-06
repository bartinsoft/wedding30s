import { Router } from 'express';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { OAuth2Client } from 'google-auth-library';
import { query, queryOne, execute } from '../db/index.js';
import { requireAuth, signToken, setAuthCookie, clearAuthCookie } from '../middleware/auth.js';
import { sendEmail, wrapEmailTemplate } from '../email.js';

const router = Router();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function linkWeddingsToUser(userId: string, email: string) {
  await execute('UPDATE weddings SET user_id = ? WHERE email = ? AND user_id IS NULL', [userId, email]);
}

// Register with email + password
router.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const existing = await queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    if (existing) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }

    const id = nanoid();
    const passwordHash = await bcrypt.hash(password, 12);

    await execute(
      'INSERT INTO users (id, email, password_hash, name) VALUES (?, ?, ?, ?)',
      [id, email.toLowerCase(), passwordHash, name || null]
    );

    await linkWeddingsToUser(id, email.toLowerCase());

    const token = signToken({ id, email: email.toLowerCase() });
    setAuthCookie(res, token);

    res.status(201).json({ id, email: email.toLowerCase(), name: name || null });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login with email + password
router.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = await queryOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]) as Record<string, any> | undefined;
    if (!user || !user.password_hash) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = signToken({ id: user.id, email: user.email });
    setAuthCookie(res, token);

    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google auth
router.post('/api/auth/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!googleClient || !credential) {
      res.status(400).json({ error: 'Google auth not configured' });
      return;
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      res.status(400).json({ error: 'Invalid Google token' });
      return;
    }

    const email = payload.email.toLowerCase();
    let user = await queryOne('SELECT * FROM users WHERE email = ? OR google_id = ?', [email, payload.sub]) as Record<string, any> | undefined;

    if (!user) {
      // Create new user
      const id = nanoid();
      await execute(
        'INSERT INTO users (id, email, google_id, name) VALUES (?, ?, ?, ?)',
        [id, email, payload.sub, payload.name || null]
      );
      user = { id, email, name: payload.name || null };
      await linkWeddingsToUser(id, email);
    } else if (!user.google_id) {
      // Link Google to existing account
      await execute('UPDATE users SET google_id = ? WHERE id = ?', [payload.sub, user.id]);
    }

    const token = signToken({ id: user.id, email: user.email });
    setAuthCookie(res, token);

    res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Google auth failed' });
  }
});

// Logout
router.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

// Get current user
router.get('/api/auth/me', requireAuth, (req, res) => {
  res.json(req.user);
});

// Forgot password
router.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    const user = await queryOne('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]) as Record<string, any> | undefined;
    // Always return success (don't reveal if email exists)
    if (!user) {
      res.json({ ok: true });
      return;
    }

    const resetToken = nanoid(32);
    const id = nanoid();
    await execute(
      'INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))',
      [id, user.id, resetToken]
    );

    const resetUrl = `${BASE_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email.toLowerCase(),
      subject: 'Reset your password — Wedding30s',
      html: wrapEmailTemplate(`
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p style="text-align: center; margin: 1.5rem 0;">
          <a href="${resetUrl}" style="display: inline-block; padding: 0.75rem 2rem; background: #7A8B5E; color: white; text-decoration: none; border-radius: 2rem; font-size: 0.9rem;">
            Reset Password
          </a>
        </p>
        <p style="color: #888; font-size: 0.85rem;">This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
      `),
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Reset password
router.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ error: 'Token and password are required' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' });
      return;
    }

    const reset = await queryOne(
      'SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > NOW()',
      [token]
    ) as Record<string, any> | undefined;

    if (!reset) {
      res.status(400).json({ error: 'Invalid or expired reset token' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, reset.user_id]);
    await execute('UPDATE password_resets SET used = 1 WHERE id = ?', [reset.id]);

    res.json({ ok: true });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// List user's weddings
router.get('/api/users/me/weddings', requireAuth, async (req, res) => {
  const weddings = await query(
    'SELECT id, slug, partner1_name, partner2_name, date, location, status, photo_url, created_at FROM weddings WHERE user_id = ? ORDER BY created_at DESC',
    [req.user!.id]
  );
  res.json(weddings);
});

export default router;
