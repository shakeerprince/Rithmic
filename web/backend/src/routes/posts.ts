import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';
import { notifyUpvote, notifyComment } from '../lib/notifications';
import { awardXP, XP_REWARDS } from '../lib/xp';

const posts = new Hono();

// GET /api/posts
posts.get('/', async (c) => {
    const userId = c.get('userId') as string;

    const rows = db.select({
        id: schema.posts.id,
        authorId: schema.posts.authorId,
        title: schema.posts.title,
        body: schema.posts.body,
        habitName: schema.posts.habitName,
        upvotes: schema.posts.upvotes,
        downvotes: schema.posts.downvotes,
        commentCount: schema.posts.commentCount,
        createdAt: schema.posts.createdAt,
        authorName: schema.users.name,
        authorBio: schema.users.bio,
    })
        .from(schema.posts)
        .leftJoin(schema.users, eq(schema.posts.authorId, schema.users.id))
        .orderBy(schema.posts.createdAt)
        .all();

    // Attach user's vote
    const votes = db.select().from(schema.postVotes).where(eq(schema.postVotes.userId, userId)).all();
    const voteMap = new Map(votes.map(v => [v.postId, v.direction]));

    return c.json(rows.map(p => ({
        ...p,
        authorName: p.authorName || 'Unknown',
        userVote: voteMap.get(p.id) || 0,
    })));
});

// POST /api/posts
posts.post('/', async (c) => {
    const userId = c.get('userId') as string;
    const body = await c.req.json();
    const id = randomUUID();

    db.insert(schema.posts).values({
        id,
        authorId: userId,
        title: body.title,
        body: body.body,
        habitName: body.habitName || null,
        createdAt: new Date().toISOString(),
    }).run();

    // 🎮 Award XP for creating a post
    awardXP(userId, XP_REWARDS.CREATE_POST, 'Created a post');

    return c.json({ id, message: 'Post created' }, 201);
});

// POST /api/posts/:id/vote — with real notifications
posts.post('/:id/vote', async (c) => {
    const userId = c.get('userId') as string;
    const postId = c.req.param('id');
    const { direction } = await c.req.json();

    // Remove existing vote
    db.delete(schema.postVotes).where(and(eq(schema.postVotes.postId, postId), eq(schema.postVotes.userId, userId))).run();

    if (direction !== 0) {
        db.insert(schema.postVotes).values({ id: randomUUID(), postId, userId, direction }).run();
    }

    // Recalculate
    const allVotes = db.select().from(schema.postVotes).where(eq(schema.postVotes.postId, postId)).all();
    const upvotes = allVotes.filter(v => v.direction === 1).length;
    const downvotes = allVotes.filter(v => v.direction === -1).length;
    db.update(schema.posts).set({ upvotes, downvotes }).where(eq(schema.posts.id, postId)).run();

    // 🔔 Real notification: notify post author on upvote
    if (direction === 1) {
        const post = db.select().from(schema.posts).where(eq(schema.posts.id, postId)).get();
        const voter = db.select().from(schema.users).where(eq(schema.users.id, userId)).get();
        if (post && voter && post.authorId !== userId) {
            notifyUpvote(post.authorId, voter.name, post.title);
        }
    }

    return c.json({ upvotes, downvotes, userVote: direction });
});

// GET /api/posts/:id
posts.get('/:id', async (c) => {
    const userId = c.get('userId') as string;
    const postId = c.req.param('id');

    const post = db.select({
        id: schema.posts.id,
        authorId: schema.posts.authorId,
        title: schema.posts.title,
        body: schema.posts.body,
        habitName: schema.posts.habitName,
        upvotes: schema.posts.upvotes,
        downvotes: schema.posts.downvotes,
        commentCount: schema.posts.commentCount,
        createdAt: schema.posts.createdAt,
        authorName: schema.users.name,
    })
        .from(schema.posts)
        .leftJoin(schema.users, eq(schema.posts.authorId, schema.users.id))
        .where(eq(schema.posts.id, postId))
        .get();

    if (!post) return c.json({ error: 'Not found' }, 404);

    const vote = db.select().from(schema.postVotes)
        .where(and(eq(schema.postVotes.postId, postId), eq(schema.postVotes.userId, userId)))
        .get();

    return c.json({ ...post, authorName: post.authorName || 'Unknown', userVote: vote?.direction || 0 });
});

// GET /api/posts/:id/comments
posts.get('/:id/comments', async (c) => {
    const postId = c.req.param('id');
    const rows = db.select({
        id: schema.comments.id,
        postId: schema.comments.postId,
        authorId: schema.comments.authorId,
        body: schema.comments.body,
        parentCommentId: schema.comments.parentCommentId,
        upvotes: schema.comments.upvotes,
        createdAt: schema.comments.createdAt,
        authorName: schema.users.name,
    })
        .from(schema.comments)
        .leftJoin(schema.users, eq(schema.comments.authorId, schema.users.id))
        .where(eq(schema.comments.postId, postId))
        .all();

    return c.json(rows.map(r => ({ ...r, authorName: r.authorName || 'Unknown' })));
});

// POST /api/posts/:id/comments — with real notifications
posts.post('/:id/comments', async (c) => {
    const userId = c.get('userId') as string;
    const postId = c.req.param('id');
    const body = await c.req.json();
    const id = randomUUID();

    db.insert(schema.comments).values({
        id,
        postId,
        authorId: userId,
        body: body.body,
        parentCommentId: body.parentCommentId || null,
        createdAt: new Date().toISOString(),
    }).run();

    const count = db.select().from(schema.comments).where(eq(schema.comments.postId, postId)).all().length;
    db.update(schema.posts).set({ commentCount: count }).where(eq(schema.posts.id, postId)).run();

    // 🔔 Real notification: notify post author
    const post = db.select().from(schema.posts).where(eq(schema.posts.id, postId)).get();
    const commenter = db.select().from(schema.users).where(eq(schema.users.id, userId)).get();
    if (post && commenter && post.authorId !== userId) {
        notifyComment(post.authorId, commenter.name, post.title);
    }

    // 🎮 Award XP for commenting
    awardXP(userId, XP_REWARDS.ADD_COMMENT, 'Added a comment');

    return c.json({ id, message: 'Comment added' }, 201);
});

export default posts;
