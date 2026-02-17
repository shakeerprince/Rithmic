import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { notifyChallengeJoin, notifyChatMessage } from '../lib/notifications';
import { awardXP, XP_REWARDS } from '../lib/xp';

const challenges = new Hono();

// GET /api/challenges
challenges.get('/', async (c) => {
    const rows = db.select().from(schema.challenges).all();
    const now = new Date();

    const result = rows.map((ch) => {
        const participants = db.select().from(schema.challengeParticipants)
            .where(eq(schema.challengeParticipants.challengeId, ch.id)).all();

        const start = new Date(ch.startDate);
        const end = new Date(ch.endDate);
        const isActive = now >= start && now <= end;
        const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000));

        return {
            ...ch,
            participantIds: participants.map(p => p.userId),
            participantCount: participants.length,
            isActive,
            daysRemaining,
            creatorName: db.select().from(schema.users).where(eq(schema.users.id, ch.creatorId)).get()?.name || 'Unknown',
        };
    });

    return c.json(result);
});

// GET /api/challenges/:id
challenges.get('/:id', async (c) => {
    const id = c.req.param('id');
    const ch = db.select().from(schema.challenges).where(eq(schema.challenges.id, id)).get();
    if (!ch) return c.json({ error: 'Not found' }, 404);

    const participants = db.select().from(schema.challengeParticipants)
        .where(eq(schema.challengeParticipants.challengeId, id)).all();

    const now = new Date();
    const start = new Date(ch.startDate);
    const end = new Date(ch.endDate);

    const leaderboard = participants.map(p => {
        const user = db.select().from(schema.users).where(eq(schema.users.id, p.userId)).get();
        return { userId: p.userId, name: user?.name || 'Unknown', score: p.score };
    }).sort((a, b) => b.score - a.score);

    return c.json({
        ...ch,
        participantIds: participants.map(p => p.userId),
        participantCount: participants.length,
        isActive: now >= start && now <= end,
        daysRemaining: Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000)),
        creatorName: db.select().from(schema.users).where(eq(schema.users.id, ch.creatorId)).get()?.name || 'Unknown',
        leaderboard,
    });
});

// POST /api/challenges/:id/join — with real notifications
challenges.post('/:id/join', async (c) => {
    const userId = c.get('userId') as string;
    const challengeId = c.req.param('id');

    const existing = db.select().from(schema.challengeParticipants)
        .where(and(eq(schema.challengeParticipants.challengeId, challengeId), eq(schema.challengeParticipants.userId, userId)))
        .get();

    if (existing) return c.json({ message: 'Already joined' });

    db.insert(schema.challengeParticipants).values({
        id: randomUUID(),
        challengeId,
        userId,
        score: 0,
    }).run();

    // 🎮 Award XP for joining challenge
    awardXP(userId, XP_REWARDS.JOIN_CHALLENGE, 'Joined a challenge');

    // 🔔 Notify challenge creator
    const ch = db.select().from(schema.challenges).where(eq(schema.challenges.id, challengeId)).get();
    const joiner = db.select().from(schema.users).where(eq(schema.users.id, userId)).get();
    if (ch && joiner && ch.creatorId !== userId) {
        notifyChallengeJoin(ch.creatorId, joiner.name, ch.title);
    }

    return c.json({ message: 'Joined' }, 201);
});

// GET /api/challenges/:id/chat
challenges.get('/:id/chat', async (c) => {
    const challengeId = c.req.param('id');
    const messages = db.select({
        id: schema.chatMessages.id,
        challengeId: schema.chatMessages.challengeId,
        senderId: schema.chatMessages.senderId,
        message: schema.chatMessages.message,
        sentAt: schema.chatMessages.sentAt,
        senderName: schema.users.name,
    })
        .from(schema.chatMessages)
        .leftJoin(schema.users, eq(schema.chatMessages.senderId, schema.users.id))
        .where(eq(schema.chatMessages.challengeId, challengeId))
        .all();

    return c.json(messages.map(m => ({ ...m, senderName: m.senderName || 'Unknown' })));
});

// POST /api/challenges/:id/chat — with real notifications
challenges.post('/:id/chat', async (c) => {
    const userId = c.get('userId') as string;
    const challengeId = c.req.param('id');
    const body = await c.req.json();
    const id = randomUUID();

    db.insert(schema.chatMessages).values({
        id,
        challengeId,
        senderId: userId,
        message: body.message,
        sentAt: new Date().toISOString(),
    }).run();

    const user = db.select().from(schema.users).where(eq(schema.users.id, userId)).get();

    // 🔔 Notify all participants except sender
    const ch = db.select().from(schema.challenges).where(eq(schema.challenges.id, challengeId)).get();
    const participants = db.select().from(schema.challengeParticipants)
        .where(eq(schema.challengeParticipants.challengeId, challengeId)).all();
    if (ch) {
        notifyChatMessage(participants.map(p => p.userId), user?.name || 'Someone', ch.title, userId);
    }

    return c.json({ id, challengeId, senderId: userId, senderName: user?.name || 'You', message: body.message, sentAt: new Date().toISOString() }, 201);
});

export default challenges;
