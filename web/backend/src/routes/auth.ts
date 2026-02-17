import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq } from 'drizzle-orm';
import { generateToken } from '../middleware/auth';
import { awardXP, XP_REWARDS, calculateLevel } from '../lib/xp';

const auth = new Hono();

// POST /api/auth/login
auth.post('/login', async (c) => {
    const { email, password } = await c.req.json();

    if (!email) {
        return c.json({ error: 'Email is required' }, 400);
    }

    // Find user by email
    const users = db.select().from(schema.users).where(eq(schema.users.email, email)).all();
    let user = users[0];

    // If no user, auto-create (demo mode)
    if (!user) {
        const name = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
        const id = `u_${Date.now()}`;
        db.insert(schema.users).values({
            id,
            name,
            email,
            passwordHash: 'demo',
            bio: 'New to Rithmic! 🌟',
            createdAt: new Date().toISOString(),
        }).run();
        user = db.select().from(schema.users).where(eq(schema.users.id, id)).get()!;
    }

    // ─── Daily Login Streak ──────────────────────────────────
    const today = new Date().toISOString().split('T')[0];
    let loginReward = 0;
    let loginStreak = user.loginStreak || 0;

    if (user.lastLoginDate !== today) {
        // Check if yesterday = streak continues
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (user.lastLoginDate === yesterday) {
            loginStreak++;
        } else if (user.lastLoginDate !== today) {
            loginStreak = 1; // reset
        }

        // Award login XP
        loginReward = XP_REWARDS.DAILY_LOGIN;
        if (loginStreak === 7) loginReward = XP_REWARDS.LOGIN_WEEK;
        else if (loginStreak === 14) loginReward = XP_REWARDS.LOGIN_FORTNIGHT;
        else if (loginStreak === 30) loginReward = XP_REWARDS.LOGIN_MONTH;

        awardXP(user.id, loginReward, 'Daily login');

        db.update(schema.users).set({
            lastLoginDate: today,
            loginStreak,
        }).where(eq(schema.users.id, user.id)).run();

        // Re-fetch after XP update
        user = db.select().from(schema.users).where(eq(schema.users.id, user.id)).get()!;
    }

    const token = generateToken(user.id);
    const { level, xpInLevel, xpToNext } = calculateLevel(user.xp);

    return c.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            avatarUrl: user.avatarUrl,
            bio: user.bio,
            createdAt: user.createdAt,
            xp: user.xp,
            level,
            xpToNext,
            loginStreak,
        },
        loginReward,
    });
});

// GET /api/auth/me
auth.get('/me', async (c) => {
    const userId = c.get('userId');
    if (!userId) return c.json({ error: 'Unauthorized' }, 401);

    const user = db.select().from(schema.users).where(eq(schema.users.id, userId)).get();
    if (!user) return c.json({ error: 'User not found' }, 404);

    const { level, xpInLevel, xpToNext } = calculateLevel(user.xp);

    return c.json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        createdAt: user.createdAt,
        xp: user.xp,
        level,
        xpToNext,
        loginStreak: user.loginStreak,
    });
});

export default auth;
