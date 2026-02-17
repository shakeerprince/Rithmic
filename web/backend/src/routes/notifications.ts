import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';

const notificationsRoute = new Hono();

// GET /api/notifications
notificationsRoute.get('/', async (c) => {
    const userId = c.get('userId') as string;
    const rows = db.select().from(schema.notifications)
        .where(eq(schema.notifications.userId, userId)).all();

    // Sort newest first
    rows.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return c.json(rows.map(n => ({ ...n, isRead: Boolean(n.isRead) })));
});

// POST /api/notifications/:id/read
notificationsRoute.post('/:id/read', async (c) => {
    const id = c.req.param('id');
    db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.id, id)).run();
    return c.json({ message: 'Marked as read' });
});

// POST /api/notifications/read-all
notificationsRoute.post('/read-all', async (c) => {
    const userId = c.get('userId') as string;
    db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.userId, userId)).run();
    return c.json({ message: 'All marked as read' });
});

// GET /api/notifications/unread-count
notificationsRoute.get('/unread-count', async (c) => {
    const userId = c.get('userId') as string;
    const unread = db.select().from(schema.notifications)
        .where(and(eq(schema.notifications.userId, userId), eq(schema.notifications.isRead, false))).all();
    return c.json({ count: unread.length });
});

export default notificationsRoute;
