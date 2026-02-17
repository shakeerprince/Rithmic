import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, or, and, desc } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { notifyDM } from '../lib/notifications';

const messages = new Hono();

// GET /api/messages — list conversations (unique users you've chatted with)
messages.get('/', async (c) => {
    const userId = c.get('userId') as string;

    // Get all DMs involving this user
    const allDMs = db.select().from(schema.directMessages)
        .where(or(eq(schema.directMessages.senderId, userId), eq(schema.directMessages.recipientId, userId)))
        .all();

    // Group by the "other" user
    const conversationMap = new Map<string, any>();
    for (const dm of allDMs) {
        const otherId = dm.senderId === userId ? dm.recipientId : dm.senderId;
        const existing = conversationMap.get(otherId);
        if (!existing || new Date(dm.sentAt) > new Date(existing.sentAt)) {
            conversationMap.set(otherId, dm);
        }
    }

    // Build conversation list
    const conversations = Array.from(conversationMap.entries()).map(([otherId, lastMsg]) => {
        const user = db.select().from(schema.users).where(eq(schema.users.id, otherId)).get();
        const unread = allDMs.filter(dm => dm.senderId === otherId && !dm.isRead).length;
        return {
            userId: otherId,
            name: user?.name || 'Unknown',
            bio: user?.bio || '',
            lastMessage: lastMsg.message,
            lastMessageAt: lastMsg.sentAt,
            unreadCount: unread,
        };
    });

    conversations.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
    return c.json(conversations);
});

// GET /api/messages/:userId — chat history with a specific user
messages.get('/:userId', async (c) => {
    const myId = c.get('userId') as string;
    const otherId = c.req.param('userId');

    const msgs = db.select().from(schema.directMessages)
        .where(or(
            and(eq(schema.directMessages.senderId, myId), eq(schema.directMessages.recipientId, otherId)),
            and(eq(schema.directMessages.senderId, otherId), eq(schema.directMessages.recipientId, myId)),
        ))
        .all();

    // Sort by time
    msgs.sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());

    // Mark received messages as read
    for (const m of msgs) {
        if (m.recipientId === myId && !m.isRead) {
            db.update(schema.directMessages).set({ isRead: true }).where(eq(schema.directMessages.id, m.id)).run();
        }
    }

    const otherUser = db.select().from(schema.users).where(eq(schema.users.id, otherId)).get();

    return c.json({
        otherUser: { id: otherId, name: otherUser?.name || 'Unknown', bio: otherUser?.bio },
        messages: msgs,
    });
});

// POST /api/messages/:userId — send a DM
messages.post('/:userId', async (c) => {
    const myId = c.get('userId') as string;
    const recipientId = c.req.param('userId');
    const body = await c.req.json();
    const id = randomUUID();

    db.insert(schema.directMessages).values({
        id,
        senderId: myId,
        recipientId,
        message: body.message,
        sentAt: new Date().toISOString(),
        isRead: false,
    }).run();

    // 🔔 Notify the recipient
    const sender = db.select().from(schema.users).where(eq(schema.users.id, myId)).get();
    if (sender) {
        notifyDM(recipientId, sender.name);
    }

    return c.json({ id, senderId: myId, recipientId, message: body.message, sentAt: new Date().toISOString() }, 201);
});

export default messages;
