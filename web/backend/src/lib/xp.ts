import { db, schema } from '../db';
import { eq } from 'drizzle-orm';
import { createNotification } from './notifications';

// XP rewards table
export const XP_REWARDS = {
    HABIT_COMPLETE: 25,
    DAILY_LOGIN: 10,
    CREATE_POST: 15,
    ADD_COMMENT: 5,
    EARN_BADGE: 50,
    JOIN_CHALLENGE: 20,
    ADD_FRIEND: 10,
    STREAK_BONUS: 10,  // per day of streak
    LOGIN_WEEK: 50,    // 7-day login streak
    LOGIN_FORTNIGHT: 100,
    LOGIN_MONTH: 200,
} as const;

// Level formula: XP needed for level N = N * 100
export function xpForLevel(level: number): number {
    return level * 100;
}

export function calculateLevel(totalXp: number): { level: number; xpInLevel: number; xpToNext: number } {
    let level = 1;
    let remaining = totalXp;
    while (remaining >= xpForLevel(level)) {
        remaining -= xpForLevel(level);
        level++;
    }
    return {
        level,
        xpInLevel: remaining,
        xpToNext: xpForLevel(level),
    };
}

export function awardXP(userId: string, amount: number, reason: string): { xp: number; level: number; xpToNext: number; leveledUp: boolean } {
    const user = db.select().from(schema.users).where(eq(schema.users.id, userId)).get();
    if (!user) return { xp: 0, level: 1, xpToNext: 100, leveledUp: false };

    const oldLevel = calculateLevel(user.xp).level;
    const newXp = user.xp + amount;
    const { level: newLevel, xpToNext } = calculateLevel(newXp);
    const leveledUp = newLevel > oldLevel;

    db.update(schema.users).set({ xp: newXp, level: newLevel }).where(eq(schema.users.id, userId)).run();

    if (leveledUp) {
        createNotification(
            userId,
            'level_up',
            `Level ${newLevel} Reached! 🎉`,
            `You've leveled up to Level ${newLevel}! Keep crushing those habits!`
        );
    }

    return { xp: newXp, level: newLevel, xpToNext, leveledUp };
}
