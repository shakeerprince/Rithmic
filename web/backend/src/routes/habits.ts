import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { notifyStreakMilestone, notifyBadgeEarned } from '../lib/notifications';
import { awardXP, XP_REWARDS } from '../lib/xp';

const STREAK_MILESTONES = [7, 14, 30, 60, 100, 365];
const BADGE_MAP: Record<number, string> = {
    7: '7-Day Warrior',
    14: '14-Day Fighter',
    30: '30-Day Legend',
    60: '60-Day Master',
    100: '100-Day Champion',
    365: '365-Day Immortal',
};

const habitsRoute = new Hono();

// GET /api/habits
habitsRoute.get('/', async (c) => {
    const userId = c.get('userId') as string;
    const habits = db.select().from(schema.habits).where(eq(schema.habits.userId, userId)).all();
    return c.json(habits.map(h => ({
        ...h,
        daysOfWeek: h.daysOfWeek.split(',').map(Number),
        reminderEnabled: Boolean(h.reminderEnabled),
    })));
});

// POST /api/habits
habitsRoute.post('/', async (c) => {
    const userId = c.get('userId') as string;
    const body = await c.req.json();
    const id = randomUUID();
    db.insert(schema.habits).values({
        id, name: body.name, category: body.category || 'Custom',
        startHour: body.startHour ?? 6, startMinute: body.startMinute ?? 0,
        endHour: body.endHour ?? 7, endMinute: body.endMinute ?? 0,
        daysOfWeek: (body.daysOfWeek || [1, 2, 3, 4, 5, 6, 7]).join(','),
        frequency: body.frequency || 'Daily',
        reminderEnabled: body.reminderEnabled ?? true,
        colorValue: body.colorValue || 0xFFC8E600,
        createdAt: new Date().toISOString(),
        userId,
    }).run();
    return c.json({ id, message: 'Habit created' }, 201);
});

// DELETE /api/habits/:id
habitsRoute.delete('/:id', async (c) => {
    const id = c.req.param('id');
    db.delete(schema.habits).where(eq(schema.habits.id, id)).run();
    return c.json({ message: 'Deleted' });
});

// POST /api/habits/:id/start
habitsRoute.post('/:id/start', async (c) => {
    const habitId = c.req.param('id');
    const today = new Date().toISOString().split('T')[0];
    const existing = db.select().from(schema.habitEntries)
        .where(and(eq(schema.habitEntries.habitId, habitId), eq(schema.habitEntries.date, today))).get();
    if (existing) return c.json(existing);
    const entry = {
        id: randomUUID(), habitId, date: today, status: 'in_progress',
        startedAt: new Date().toISOString(), completedAt: null, durationSeconds: null,
    };
    db.insert(schema.habitEntries).values(entry).run();
    return c.json(entry);
});

// POST /api/habits/:id/complete — with XP + notifications
habitsRoute.post('/:id/complete', async (c) => {
    const habitId = c.req.param('id');
    const today = new Date().toISOString().split('T')[0];

    const entry = db.select().from(schema.habitEntries)
        .where(and(eq(schema.habitEntries.habitId, habitId), eq(schema.habitEntries.date, today))).get();
    if (!entry) return c.json({ error: 'Start habit first' }, 400);

    const now = new Date().toISOString();
    const dur = entry.startedAt ? Math.round((Date.now() - new Date(entry.startedAt).getTime()) / 1000) : 0;
    db.update(schema.habitEntries).set({
        status: 'completed', completedAt: now, durationSeconds: dur,
    }).where(eq(schema.habitEntries.id, entry.id)).run();

    // Update streak
    const habit = db.select().from(schema.habits).where(eq(schema.habits.id, habitId)).get()!;
    const newStreak = habit.currentStreak + 1;
    const newLongest = Math.max(habit.longestStreak, newStreak);
    db.update(schema.habits).set({ currentStreak: newStreak, longestStreak: newLongest })
        .where(eq(schema.habits.id, habitId)).run();

    // 🎮 Award XP for habit completion
    const xpResult = awardXP(habit.userId, XP_REWARDS.HABIT_COMPLETE, 'Habit completed');

    // 🔔 Streak milestone notification + badge
    if (STREAK_MILESTONES.includes(newStreak)) {
        notifyStreakMilestone(habit.userId, newStreak, habit.name);
        awardXP(habit.userId, XP_REWARDS.STREAK_BONUS * newStreak, `${newStreak}-day streak bonus`);

        const badgeName = BADGE_MAP[newStreak];
        if (badgeName) {
            const existing = db.select().from(schema.userBadges)
                .where(and(eq(schema.userBadges.userId, habit.userId), eq(schema.userBadges.badgeName, badgeName)))
                .get();
            if (!existing) {
                db.insert(schema.userBadges).values({
                    id: randomUUID(), userId: habit.userId, badgeName,
                    earnedAt: new Date().toISOString(),
                }).run();
                notifyBadgeEarned(habit.userId, badgeName);
                awardXP(habit.userId, XP_REWARDS.EARN_BADGE, `Badge: ${badgeName}`);
            }
        }
    }

    return c.json({
        message: 'Habit completed',
        xpEarned: XP_REWARDS.HABIT_COMPLETE,
        newStreak,
        ...xpResult,
    });
});

// GET /api/habits/entries
habitsRoute.get('/entries', async (c) => {
    const date = c.req.query('date');
    if (!date) return c.json([]);
    const entries = db.select().from(schema.habitEntries)
        .where(eq(schema.habitEntries.date, date)).all();
    return c.json(entries);
});

export default habitsRoute;
