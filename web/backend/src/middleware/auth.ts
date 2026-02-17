import { Hono } from 'hono';
import { Context, Next } from 'hono';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'rithmic-dev-secret-2024';

export interface AuthContext {
    userId: string;
}

export function generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthContext | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        return { userId: decoded.userId };
    } catch {
        return null;
    }
}

export async function authMiddleware(c: Context, next: Next) {
    const authHeader = c.req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.slice(7);
    const auth = verifyToken(token);
    if (!auth) {
        return c.json({ error: 'Invalid token' }, 401);
    }

    c.set('userId', auth.userId);
    await next();
}
