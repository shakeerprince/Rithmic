import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, like, desc, and, ne, isNull } from 'drizzle-orm';
import { awardXP, XP_REWARDS } from '../lib/xp';

const communitiesRoute = new Hono();

// Helper: generate short invite code
function generateInviteCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let code = '';
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
}

// GET /api/communities — browse all communities (or search)
communitiesRoute.get('/', async (c) => {
    const q = c.req.query('q') || '';
    const category = c.req.query('category') || '';
    const userId = c.get('userId' as never) as string;

    let all = db.select().from(schema.communities).orderBy(desc(schema.communities.memberCount)).all();

    if (q) all = all.filter(cm => cm.name.toLowerCase().includes(q.toLowerCase()) || cm.description.toLowerCase().includes(q.toLowerCase()));
    if (category) all = all.filter(cm => cm.category === category);

    // Attach joined status
    const enriched = all.map(cm => {
        const membership = db.select().from(schema.communityMembers)
            .where(and(eq(schema.communityMembers.communityId, cm.id), eq(schema.communityMembers.userId, userId)))
            .get();
        return { ...cm, isJoined: !!membership, myRole: membership?.role || null };
    });

    return c.json(enriched);
});

// GET /api/communities/my — communities I've joined
communitiesRoute.get('/my', async (c) => {
    const userId = c.get('userId' as never) as string;

    const memberships = db.select().from(schema.communityMembers)
        .where(eq(schema.communityMembers.userId, userId)).all();

    const communities = memberships.map(m => {
        const cm = db.select().from(schema.communities)
            .where(eq(schema.communities.id, m.communityId)).get();
        return cm ? { ...cm, myRole: m.role } : null;
    }).filter(Boolean);

    return c.json(communities);
});

// GET /api/communities/invite/:code — get community by invite code (public info)
communitiesRoute.get('/invite/:code', async (c) => {
    const code = c.req.param('code');
    const userId = c.get('userId' as never) as string;

    const community = db.select().from(schema.communities)
        .where(eq(schema.communities.inviteCode, code)).get();
    if (!community) return c.json({ error: 'Invalid invite link' }, 404);

    const membership = db.select().from(schema.communityMembers)
        .where(and(eq(schema.communityMembers.communityId, community.id), eq(schema.communityMembers.userId, userId)))
        .get();

    // Get creator info
    const creator = db.select({ name: schema.users.name }).from(schema.users)
        .where(eq(schema.users.id, community.creatorId)).get();

    return c.json({
        ...community,
        isJoined: !!membership,
        myRole: membership?.role || null,
        creatorName: creator?.name || 'Unknown',
    });
});

// POST /api/communities/invite/:code/join — join via invite link
communitiesRoute.post('/invite/:code/join', async (c) => {
    const code = c.req.param('code');
    const userId = c.get('userId' as never) as string;

    const community = db.select().from(schema.communities)
        .where(eq(schema.communities.inviteCode, code)).get();
    if (!community) return c.json({ error: 'Invalid invite link' }, 404);

    // Check already joined
    const existing = db.select().from(schema.communityMembers)
        .where(and(
            eq(schema.communityMembers.communityId, community.id),
            eq(schema.communityMembers.userId, userId),
        )).get();
    if (existing) return c.json({ error: 'Already a member', id: community.id }, 400);

    db.insert(schema.communityMembers).values({
        id: crypto.randomUUID(),
        communityId: community.id,
        userId,
        role: 'member',
        joinedAt: new Date().toISOString(),
    }).run();

    db.update(schema.communities).set({
        memberCount: community.memberCount + 1,
    }).where(eq(schema.communities.id, community.id)).run();

    awardXP(userId, XP_REWARDS.JOIN_CHALLENGE, 'Joined a community via invite');

    return c.json({ message: 'Joined community', id: community.id });
});

// GET /api/communities/:id — community detail
communitiesRoute.get('/:id', async (c) => {
    const communityId = c.req.param('id');
    const userId = c.get('userId' as never) as string;

    const community = db.select().from(schema.communities)
        .where(eq(schema.communities.id, communityId)).get();
    if (!community) return c.json({ error: 'Community not found' }, 404);

    // Members
    const members = db.select().from(schema.communityMembers)
        .where(eq(schema.communityMembers.communityId, communityId)).all();

    const memberUsers = members.map(m => {
        const u = db.select({
            id: schema.users.id,
            name: schema.users.name,
            avatarUrl: schema.users.avatarUrl,
            level: schema.users.level,
        }).from(schema.users).where(eq(schema.users.id, m.userId)).get();
        return u ? { ...u, role: m.role } : null;
    }).filter(Boolean);

    // Posts in this community (with imageUrl)
    const posts = db.select({
        id: schema.posts.id,
        title: schema.posts.title,
        body: schema.posts.body,
        authorId: schema.posts.authorId,
        imageUrl: schema.posts.imageUrl,
        upvotes: schema.posts.upvotes,
        downvotes: schema.posts.downvotes,
        commentCount: schema.posts.commentCount,
        createdAt: schema.posts.createdAt,
    }).from(schema.posts)
        .where(eq(schema.posts.communityId, communityId))
        .orderBy(desc(schema.posts.createdAt)).all();

    // Enrich posts with author name
    const enrichedPosts = posts.map(p => {
        const author = db.select({ name: schema.users.name }).from(schema.users)
            .where(eq(schema.users.id, p.authorId)).get();
        return { ...p, authorName: author?.name || 'Unknown' };
    });

    // Check membership
    const membership = members.find(m => m.userId === userId);

    return c.json({
        ...community,
        isJoined: !!membership,
        myRole: membership?.role || null,
        members: memberUsers,
        posts: enrichedPosts,
    });
});

// POST /api/communities — create a community
communitiesRoute.post('/', async (c) => {
    const userId = c.get('userId' as never) as string;
    const { name, description, icon, category, bannerColor, bannerImage } = await c.req.json();

    if (!name || !description) return c.json({ error: 'Name and description required' }, 400);
    if (name.length < 3 || name.length > 30) return c.json({ error: 'Name must be 3-30 characters' }, 400);

    // Check unique name
    const existing = db.select().from(schema.communities).where(eq(schema.communities.name, name)).get();
    if (existing) return c.json({ error: 'Community name already taken' }, 400);

    const id = crypto.randomUUID();
    const inviteCode = generateInviteCode();
    const now = new Date().toISOString();

    db.insert(schema.communities).values({
        id, name, description,
        icon: icon || '🏠',
        bannerColor: bannerColor || '#7c5cfc',
        bannerImage: bannerImage || null,
        category: category || 'General',
        creatorId: userId,
        memberCount: 1,
        inviteCode,
        createdAt: now,
    }).run();

    // Auto-join creator as admin
    db.insert(schema.communityMembers).values({
        id: crypto.randomUUID(),
        communityId: id,
        userId,
        role: 'admin',
        joinedAt: now,
    }).run();

    // Award XP
    awardXP(userId, XP_REWARDS.CREATE_POST, 'Created a community');

    return c.json({ id, inviteCode, message: 'Community created' }, 201);
});

// POST /api/communities/:id/join — join a community
communitiesRoute.post('/:id/join', async (c) => {
    const userId = c.get('userId' as never) as string;
    const communityId = c.req.param('id');

    const community = db.select().from(schema.communities)
        .where(eq(schema.communities.id, communityId)).get();
    if (!community) return c.json({ error: 'Community not found' }, 404);

    // Check already joined
    const existing = db.select().from(schema.communityMembers)
        .where(and(
            eq(schema.communityMembers.communityId, communityId),
            eq(schema.communityMembers.userId, userId),
        )).get();
    if (existing) return c.json({ error: 'Already a member' }, 400);

    db.insert(schema.communityMembers).values({
        id: crypto.randomUUID(),
        communityId,
        userId,
        role: 'member',
        joinedAt: new Date().toISOString(),
    }).run();

    // Increment member count
    db.update(schema.communities).set({
        memberCount: community.memberCount + 1,
    }).where(eq(schema.communities.id, communityId)).run();

    // Award XP
    awardXP(userId, XP_REWARDS.JOIN_CHALLENGE, 'Joined a community');

    return c.json({ message: 'Joined community' });
});

// POST /api/communities/:id/leave — leave a community
communitiesRoute.post('/:id/leave', async (c) => {
    const userId = c.get('userId' as never) as string;
    const communityId = c.req.param('id');

    const community = db.select().from(schema.communities)
        .where(eq(schema.communities.id, communityId)).get();
    if (!community) return c.json({ error: 'Community not found' }, 404);
    if (community.creatorId === userId) return c.json({ error: 'Creator cannot leave their community' }, 400);

    const membership = db.select().from(schema.communityMembers)
        .where(and(
            eq(schema.communityMembers.communityId, communityId),
            eq(schema.communityMembers.userId, userId),
        )).get();
    if (!membership) return c.json({ error: 'Not a member' }, 400);

    db.delete(schema.communityMembers).where(eq(schema.communityMembers.id, membership.id)).run();

    db.update(schema.communities).set({
        memberCount: Math.max(0, community.memberCount - 1),
    }).where(eq(schema.communities.id, communityId)).run();

    return c.json({ message: 'Left community' });
});

// POST /api/communities/:id/post — create post in community (with optional media)
communitiesRoute.post('/:id/post', async (c) => {
    const userId = c.get('userId' as never) as string;
    const communityId = c.req.param('id');
    const { title, body, imageUrl } = await c.req.json();

    if (!title || !body) return c.json({ error: 'Title and body required' }, 400);

    // Check membership
    const membership = db.select().from(schema.communityMembers)
        .where(and(
            eq(schema.communityMembers.communityId, communityId),
            eq(schema.communityMembers.userId, userId),
        )).get();
    if (!membership) return c.json({ error: 'Must join community to post' }, 403);

    const id = crypto.randomUUID();
    db.insert(schema.posts).values({
        id,
        authorId: userId,
        title,
        body,
        communityId,
        imageUrl: imageUrl || null,
        createdAt: new Date().toISOString(),
    }).run();

    awardXP(userId, XP_REWARDS.CREATE_POST, 'Posted in community');

    return c.json({ id, message: 'Post created' }, 201);
});

export default communitiesRoute;
