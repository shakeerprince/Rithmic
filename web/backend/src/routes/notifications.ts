import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, desc, and } from 'drizzle-orm';

const notifications = new Hono();

// GET /api/notifications
notifications.get('/', async (c) => {
    const userId = c.get('userId' as never) as string;
    const rows = await db.select().from(schema.notifications)
        .where(eq(schema.notifications.userId, userId))
        .orderBy(desc(schema.notifications.createdAt));
    return c.json(rows);
});

// POST /api/notifications/read-all
notifications.post('/read-all', async (c) => {
    const userId = c.get('userId' as never) as string;
    await db.update(schema.notifications)
        .set({ isRead: true })
        .where(eq(schema.notifications.userId, userId));
    return c.json({ success: true });
});

// POST /api/notifications/:id/read
notifications.post('/:id/read', async (c) => {
    const userId = c.get('userId' as never) as string;
    const id = c.req.param('id');
    await db.update(schema.notifications)
        .set({ isRead: true })
        .where(and(eq(schema.notifications.id, id), eq(schema.notifications.userId, userId)));
    return c.json({ success: true });
});

export default notifications;
