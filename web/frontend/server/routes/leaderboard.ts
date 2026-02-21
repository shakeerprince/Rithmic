import { Hono } from 'hono';
import { db, schema } from '../db';

const leaderboard = new Hono();

// GET /api/leaderboard
leaderboard.get('/', async (c) => {
    const userId = c.get('userId' as never) as string;
    const allUsers = await db.select({
        id: schema.users.id,
        name: schema.users.name,
        xp: schema.users.xp,
        level: schema.users.level,
        avatarUrl: schema.users.avatarUrl,
    }).from(schema.users);

    // Sort by XP descending
    allUsers.sort((a, b) => b.xp - a.xp);

    // Add ranks
    const ranked = allUsers.map((u, i) => ({
        rank: i + 1,
        ...u,
        isCurrentUser: u.id === userId,
    }));

    // Find current user rank
    const myRank = ranked.find(u => u.id === userId);

    return c.json({
        leaderboard: ranked.slice(0, 20),
        myRank: myRank ? myRank.rank : null,
        myXp: myRank ? myRank.xp : 0,
        myLevel: myRank ? myRank.level : 1,
    });
});

export default leaderboard;
