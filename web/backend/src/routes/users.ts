import { Hono } from 'hono';
import { db, schema } from '../db';
import { eq, desc } from 'drizzle-orm';

const users = new Hono();

// GET /api/users/:id — public profile
users.get('/:id', async (c) => {
    const userId = c.req.param('id');
    const user = db.select().from(schema.users).where(eq(schema.users.id, userId)).get();
    if (!user) return c.json({ error: 'User not found' }, 404);

    // Habits (public view)
    const habits = db.select().from(schema.habits).where(eq(schema.habits.userId, userId)).all();

    // Badges
    const earnedBadges = db.select().from(schema.userBadges).where(eq(schema.userBadges.userId, userId)).all();

    // Posts
    const posts = db.select({
        id: schema.posts.id,
        title: schema.posts.title,
        body: schema.posts.body,
        habitName: schema.posts.habitName,
        upvotes: schema.posts.upvotes,
        downvotes: schema.posts.downvotes,
        commentCount: schema.posts.commentCount,
        createdAt: schema.posts.createdAt,
    })
        .from(schema.posts)
        .where(eq(schema.posts.authorId, userId))
        .orderBy(desc(schema.posts.createdAt))
        .all();

    // Challenge participation
    const challengeParticipations = db.select().from(schema.challengeParticipants)
        .where(eq(schema.challengeParticipants.userId, userId)).all();

    const totalStreak = habits.reduce((s, h) => s + h.currentStreak, 0);
    const longestStreak = habits.reduce((s, h) => Math.max(s, h.longestStreak), 0);

    return c.json({
        id: user.id,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
        stats: {
            totalHabits: habits.length,
            totalStreak,
            longestStreak,
            totalPosts: posts.length,
            totalBadges: earnedBadges.length,
            challengesJoined: challengeParticipations.length,
        },
        habits: habits.map(h => ({
            id: h.id,
            name: h.name,
            category: h.category,
            currentStreak: h.currentStreak,
            longestStreak: h.longestStreak,
            colorValue: h.colorValue,
        })),
        badges: earnedBadges.map(b => ({
            name: b.badgeName,
            earnedAt: b.earnedAt,
        })),
        posts,
    });
});

export default users;
