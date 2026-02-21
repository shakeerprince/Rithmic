import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { notifyChallengeJoin, notifyChatMessage } from '../lib/notifications';
import { awardXP, XP_REWARDS } from '../lib/xp';

const challenges = new Hono();

// GET /api/challenges
challenges.get('/', async (c) => {
    const rows = await db.select().from(schema.challenges);
    const now = new Date();

    const result = await Promise.all(rows.map(async (ch) => {
        const participants = await db.select().from(schema.challengeParticipants)
            .where(eq(schema.challengeParticipants.challengeId, ch.id));

        const start = new Date(ch.startDate);
        const end = new Date(ch.endDate);
        const isActive = now >= start && now <= end;
        const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));

        const creatorsFound = await db.select().from(schema.users).where(eq(schema.users.id, ch.creatorId));
        const creatorName = creatorsFound[0]?.name || 'Unknown';

        return {
            ...ch,
            participantIds: participants.map(p => p.userId),
            participantCount: participants.length,
            isActive,
            daysRemaining,
            creatorName,
        };
    }));

    return c.json(result);
});

// GET /api/challenges/:id
challenges.get('/:id', async (c) => {
    const id = c.req.param('id');
    const challengesFound = await db.select().from(schema.challenges).where(eq(schema.challenges.id, id));
    const ch = challengesFound[0];
    if (!ch) return c.json({ error: 'Not found' }, 404);

    const participants = await db.select().from(schema.challengeParticipants)
        .where(eq(schema.challengeParticipants.challengeId, id));

    const now = new Date();
    const start = new Date(ch.startDate);
    const end = new Date(ch.endDate);

    const leaderboard = await Promise.all(participants.map(async (p) => {
        const usersFound = await db.select().from(schema.users).where(eq(schema.users.id, p.userId));
        const user = usersFound[0];
        return { userId: p.userId, name: user?.name || 'Unknown', score: p.score };
    }));
    leaderboard.sort((a, b) => b.score - a.score);

    return c.json({
        ...ch,
        participantIds: participants.map(p => p.userId),
        participantCount: participants.length,
        isActive: now >= start && now <= end,
        daysRemaining: Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000)),
        creatorName: (await db.select().from(schema.users).where(eq(schema.users.id, ch.creatorId)))[0]?.name || 'Unknown',
        leaderboard,
    });
});

// POST /api/challenges/:id/join — with real notifications
challenges.post('/:id/join', async (c) => {
    const userId = c.get('userId' as never) as string;
    const challengeId = c.req.param('id');

    const existingList = await db.select().from(schema.challengeParticipants)
        .where(and(eq(schema.challengeParticipants.challengeId, challengeId), eq(schema.challengeParticipants.userId, userId)));
    const existing = existingList[0];

    if (existing) return c.json({ message: 'Already joined' });

    await db.insert(schema.challengeParticipants).values({
        id: randomUUID(),
        challengeId,
        userId,
        score: 0,
    });

    // 🎮 Award XP for joining challenge
    awardXP(userId, XP_REWARDS.JOIN_CHALLENGE, 'Joined a challenge');

    // 🔔 Notify challenge creator
    const challengesFound_2 = await db.select().from(schema.challenges).where(eq(schema.challenges.id, challengeId));
    const ch_2 = challengesFound_2[0];
    const joinersFound = await db.select().from(schema.users).where(eq(schema.users.id, userId));
    const joiner = joinersFound[0];
    if (ch_2 && joiner && ch_2.creatorId !== userId) {
        notifyChallengeJoin(ch_2.creatorId, joiner.name, ch_2.title);
    }

    return c.json({ message: 'Joined' }, 201);
});

// GET /api/challenges/:id/chat
challenges.get('/:id/chat', async (c) => {
    const challengeId = c.req.param('id');
    const messages = await db.select({
        id: schema.chatMessages.id,
        challengeId: schema.chatMessages.challengeId,
        senderId: schema.chatMessages.senderId,
        message: schema.chatMessages.message,
        sentAt: schema.chatMessages.sentAt,
        senderName: schema.users.name,
    })
        .from(schema.chatMessages)
        .leftJoin(schema.users, eq(schema.chatMessages.senderId, schema.users.id))
        .where(eq(schema.chatMessages.challengeId, challengeId));

    return c.json(messages.map(m => ({ ...m, senderName: m.senderName || 'Unknown' })));
});

// POST /api/challenges/:id/chat — with real notifications
challenges.post('/:id/chat', async (c) => {
    const userId = c.get('userId' as never) as string;
    const challengeId = c.req.param('id');
    const body = await c.req.json();
    const id = randomUUID();

    await db.insert(schema.chatMessages).values({
        id,
        challengeId,
        senderId: userId,
        message: body.message,
        sentAt: new Date().toISOString(),
    });

    const usersFound_2 = await db.select().from(schema.users).where(eq(schema.users.id, userId));
    const user = usersFound_2[0];

    // 🔔 Notify all participants except sender
    const challengesFound_3 = await db.select().from(schema.challenges).where(eq(schema.challenges.id, challengeId));
    const ch_3 = challengesFound_3[0];
    const participants_2 = await db.select().from(schema.challengeParticipants)
        .where(eq(schema.challengeParticipants.challengeId, challengeId));
    if (ch_3) {
        notifyChatMessage(participants_2.map(p => p.userId), user?.name || 'Someone', ch_3.title, userId);
    }

    return c.json({ id, challengeId, senderId: userId, senderName: user?.name || 'You', message: body.message, sentAt: new Date().toISOString() }, 201);
});

export default challenges;
