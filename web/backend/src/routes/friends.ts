import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, or, and, like, ne } from 'drizzle-orm';
import { awardXP, XP_REWARDS } from '../lib/xp';

const friends = new Hono();

// GET /api/friends/search?q= — search users by name (shows all if q is empty)
friends.get('/search', async (c) => {
    const userId = c.get('userId' as never) as string;
    const q = c.req.query('q') || '';

    let results;
    if (q.length >= 2) {
        results = await db.select({
            id: schema.users.id,
            name: schema.users.name,
            bio: schema.users.bio,
            avatarUrl: schema.users.avatarUrl,
            xp: schema.users.xp,
            level: schema.users.level,
        }).from(schema.users)
            .where(and(
                like(schema.users.name, `%${q}%`),
                ne(schema.users.id, userId),
            )).limit(20);
    } else {
        // Return all users if no query
        results = await db.select({
            id: schema.users.id,
            name: schema.users.name,
            bio: schema.users.bio,
            avatarUrl: schema.users.avatarUrl,
            xp: schema.users.xp,
            level: schema.users.level,
        }).from(schema.users)
            .where(ne(schema.users.id, userId))
            .limit(50);
    }

    // Attach friendship status for each
    const enriched = await Promise.all(results.map(async (u) => {
        const fsFound = await db.select().from(schema.friendships)
            .where(or(
                and(eq(schema.friendships.requesterId, userId), eq(schema.friendships.addresseeId, u.id)),
                and(eq(schema.friendships.requesterId, u.id), eq(schema.friendships.addresseeId, userId)),
            ));
        const fs = fsFound[0];
        return { ...u, friendStatus: fs?.status || 'none', friendshipId: fs?.id || null };
    }));

    return c.json(enriched);
});

// GET /api/friends/suggestions — people you may know (non-friends)
friends.get('/suggestions', async (c) => {
    const userId = c.get('userId' as never) as string;

    // Get all friendship IDs
    const allFriendships = await db.select().from(schema.friendships)
        .where(or(
            eq(schema.friendships.requesterId, userId),
            eq(schema.friendships.addresseeId, userId),
        ));

    const connectedIds = new Set<string>();
    connectedIds.add(userId);
    allFriendships.forEach(f => {
        connectedIds.add(f.requesterId);
        connectedIds.add(f.addresseeId);
    });

    // Get all users not connected
    const allUsers = await db.select({
        id: schema.users.id,
        name: schema.users.name,
        bio: schema.users.bio,
        avatarUrl: schema.users.avatarUrl,
        xp: schema.users.xp,
        level: schema.users.level,
    }).from(schema.users);

    const suggestions = allUsers
        .filter(u => !connectedIds.has(u.id))
        .map(u => ({ ...u, friendStatus: 'none' as const, friendshipId: null }));

    return c.json(suggestions);
});

// GET /api/friends — list accepted friends
friends.get('/', async (c) => {
    const userId = c.get('userId' as never) as string;

    const all = await db.select().from(schema.friendships)
        .where(and(
            or(eq(schema.friendships.requesterId, userId), eq(schema.friendships.addresseeId, userId)),
            eq(schema.friendships.status, 'accepted'),
        ));

    const friendIds = all.map(f => f.requesterId === userId ? f.addresseeId : f.requesterId);
    const friendUsersList = await Promise.all(friendIds.map(async (fid) => {
        const usersFound = await db.select({
            id: schema.users.id,
            name: schema.users.name,
            bio: schema.users.bio,
            avatarUrl: schema.users.avatarUrl,
            xp: schema.users.xp,
            level: schema.users.level,
            loginStreak: schema.users.loginStreak,
        }).from(schema.users).where(eq(schema.users.id, fid));
        return usersFound[0];
    }));
    const friendUsers = friendUsersList.filter((u): u is Exclude<typeof u, undefined> => !!u);

    return c.json(friendUsers);
});

// GET /api/friends/requests — incoming pending requests
friends.get('/requests', async (c) => {
    const userId = c.get('userId' as never) as string;

    const pending = await db.select().from(schema.friendships)
        .where(and(
            eq(schema.friendships.addresseeId, userId),
            eq(schema.friendships.status, 'pending'),
        ));

    const enriched = await Promise.all(pending.map(async (f) => {
        const usersFound = await db.select({
            id: schema.users.id,
            name: schema.users.name,
            bio: schema.users.bio,
            avatarUrl: schema.users.avatarUrl,
            xp: schema.users.xp,
            level: schema.users.level,
        }).from(schema.users).where(eq(schema.users.id, f.requesterId));
        const requester = usersFound[0];
        return { ...f, requester };
    }));

    return c.json(enriched);
});

// GET /api/friends/sent — outgoing pending requests
friends.get('/sent', async (c) => {
    const userId = c.get('userId' as never) as string;

    const sent = await db.select().from(schema.friendships)
        .where(and(
            eq(schema.friendships.requesterId, userId),
            eq(schema.friendships.status, 'pending'),
        ));

    const enriched = await Promise.all(sent.map(async (f) => {
        const usersFound = await db.select({
            id: schema.users.id,
            name: schema.users.name,
            avatarUrl: schema.users.avatarUrl,
        }).from(schema.users).where(eq(schema.users.id, f.addresseeId));
        const addressee = usersFound[0];
        return { ...f, addressee };
    }));

    return c.json(enriched);
});

// GET /api/friends/status/:userId — check status with specific user
friends.get('/status/:userId', async (c) => {
    const userId = c.get('userId' as never) as string;
    const targetId = c.req.param('userId');

    const fsFound = await db.select().from(schema.friendships)
        .where(or(
            and(eq(schema.friendships.requesterId, userId), eq(schema.friendships.addresseeId, targetId)),
            and(eq(schema.friendships.requesterId, targetId), eq(schema.friendships.addresseeId, userId)),
        ));
    const fs = fsFound[0];

    return c.json({ status: fs?.status || 'none', friendshipId: fs?.id || null, isRequester: fs?.requesterId === userId });
});

// POST /api/friends/request/:userId — send friend request
friends.post('/request/:userId', async (c) => {
    const userId = c.get('userId' as never) as string;
    const targetId = c.req.param('userId');
    if (userId === targetId) return c.json({ error: 'Cannot friend yourself' }, 400);

    // Check existing
    const existingFsFound = await db.select().from(schema.friendships)
        .where(or(
            and(eq(schema.friendships.requesterId, userId), eq(schema.friendships.addresseeId, targetId)),
            and(eq(schema.friendships.requesterId, targetId), eq(schema.friendships.addresseeId, userId)),
        ));
    const existing = existingFsFound[0];

    if (existing) {
        if (existing.status === 'accepted') return c.json({ error: 'Already friends' }, 400);
        if (existing.status === 'pending') return c.json({ error: 'Request already pending' }, 400);
        // If rejected, allow re-request by updating
        await db.update(schema.friendships).set({
            requesterId: userId, addresseeId: targetId,
            status: 'pending', updatedAt: new Date().toISOString(),
        }).where(eq(schema.friendships.id, existing.id));
        return c.json({ message: 'Friend request sent' });
    }

    const id = crypto.randomUUID();
    await db.insert(schema.friendships).values({
        id, requesterId: userId, addresseeId: targetId,
        status: 'pending', createdAt: new Date().toISOString(),
    });

    // Notify target
    const requestersFound = await db.select().from(schema.users).where(eq(schema.users.id, userId));
    const requester = requestersFound[0];
    await db.insert(schema.notifications).values({
        id: crypto.randomUUID(),
        userId: targetId,
        type: 'friend_request',
        title: 'New Friend Request',
        body: `${requester?.name || 'Someone'} sent you a friend request!`,
        createdAt: new Date().toISOString(),
    });

    return c.json({ message: 'Friend request sent', friendshipId: id });
});

// POST /api/friends/accept/:requestId — accept request
friends.post('/accept/:requestId', async (c) => {
    const userId = c.get('userId' as never) as string;
    const requestId = c.req.param('requestId');

    const friendshipsFound = await db.select().from(schema.friendships).where(eq(schema.friendships.id, requestId));
    const fs = friendshipsFound[0];
    if (!fs) return c.json({ error: 'Request not found' }, 404);
    if (fs.addresseeId !== userId) return c.json({ error: 'Not your request' }, 403);
    if (fs.status !== 'pending') return c.json({ error: 'Already responded' }, 400);

    await db.update(schema.friendships).set({
        status: 'accepted', updatedAt: new Date().toISOString(),
    }).where(eq(schema.friendships.id, requestId));

    // Award XP to both
    awardXP(userId, XP_REWARDS.ADD_FRIEND, 'Made a new friend');
    awardXP(fs.requesterId, XP_REWARDS.ADD_FRIEND, 'Made a new friend');

    // Notify requester
    const acceptorsFound = await db.select().from(schema.users).where(eq(schema.users.id, userId));
    const acceptor = acceptorsFound[0];
    await db.insert(schema.notifications).values({
        id: crypto.randomUUID(),
        userId: fs.requesterId,
        type: 'friend_accepted',
        title: 'Friend Request Accepted!',
        body: `${acceptor?.name || 'Someone'} accepted your friend request! 🎉`,
        createdAt: new Date().toISOString(),
    });

    return c.json({ message: 'Friend request accepted' });
});

// POST /api/friends/reject/:requestId — reject request
friends.post('/reject/:requestId', async (c) => {
    const userId = c.get('userId' as never) as string;
    const requestId = c.req.param('requestId');

    const friendshipsFound = await db.select().from(schema.friendships).where(eq(schema.friendships.id, requestId));
    const fs = friendshipsFound[0];
    if (!fs) return c.json({ error: 'Request not found' }, 404);
    if (fs.addresseeId !== userId) return c.json({ error: 'Not your request' }, 403);

    await db.update(schema.friendships).set({
        status: 'rejected', updatedAt: new Date().toISOString(),
    }).where(eq(schema.friendships.id, requestId));

    return c.json({ message: 'Friend request rejected' });
});

// DELETE /api/friends/remove/:friendId — unfriend
friends.delete('/remove/:friendId', async (c) => {
    const userId = c.get('userId' as never) as string;
    const friendId = c.req.param('friendId');

    const friendshipsFound = await db.select().from(schema.friendships)
        .where(and(
            or(
                and(eq(schema.friendships.requesterId, userId), eq(schema.friendships.addresseeId, friendId)),
                and(eq(schema.friendships.requesterId, friendId), eq(schema.friendships.addresseeId, userId)),
            ),
            eq(schema.friendships.status, 'accepted'),
        ));
    const fs = friendshipsFound[0];

    if (!fs) return c.json({ error: 'Not friends' }, 404);

    await db.delete(schema.friendships).where(eq(schema.friendships.id, fs.id));
    return c.json({ message: 'Friend removed' });
});

export default friends;
