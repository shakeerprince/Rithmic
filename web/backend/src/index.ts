import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';

import authRoutes from './routes/auth';
import habitsRoutes from './routes/habits';
import postsRoutes from './routes/posts';
import challengesRoutes from './routes/challenges';
import notificationsRoutes from './routes/notifications';
import dashboardRoutes from './routes/dashboard';
import usersRoutes from './routes/users';
import messagesRoutes from './routes/messages';
import leaderboardRoutes from './routes/leaderboard';
import friendsRoutes from './routes/friends';
import communitiesRoutes from './routes/communities';
import uploadsRoutes from './routes/uploads';
import { authMiddleware } from './middleware/auth';

const app = new Hono();

// ─── Middleware ────────────────────────────────────────
app.use('*', cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
}));
app.use('*', logger());

// ─── Static Files (uploads) ──────────────────────────
app.use('/uploads/*', serveStatic({ root: './' }));

// ─── Health Check ─────────────────────────────────────
app.get('/', (c) => c.json({ status: 'ok', app: 'Rithmic API', version: '2.2.0' }));

// ─── Public Routes ────────────────────────────────────
app.route('/api/auth', authRoutes);

// ─── Protected Routes ─────────────────────────────────
const protectedPaths = [
    '/api/habits', '/api/posts', '/api/challenges',
    '/api/notifications', '/api/dashboard', '/api/users',
    '/api/messages', '/api/leaderboard', '/api/friends',
    '/api/communities', '/api/upload',
];
for (const path of protectedPaths) {
    app.use(`${path}/*`, authMiddleware);
    app.use(path, authMiddleware);
}

app.route('/api/habits', habitsRoutes);
app.route('/api/posts', postsRoutes);
app.route('/api/challenges', challengesRoutes);
app.route('/api/notifications', notificationsRoutes);
app.route('/api/dashboard', dashboardRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/messages', messagesRoutes);
app.route('/api/leaderboard', leaderboardRoutes);
app.route('/api/friends', friendsRoutes);
app.route('/api/communities', communitiesRoutes);
app.route('/api/upload', uploadsRoutes);

// ─── Start ────────────────────────────────────────────
const port = Number(process.env.PORT) || 3001;
console.log(`\n  🚀 Rithmic API v2.2.0 running on http://localhost:${port}\n`);

export default {
    port,
    fetch: app.fetch,
};
