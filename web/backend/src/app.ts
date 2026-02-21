import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

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

const app = new Hono().basePath('/api');

// ─── Middleware ────────────────────────────────────────
app.use('*', cors({
    origin: (origin) => origin || '*',
    credentials: true,
}));
app.use('*', logger());

// ─── Health Check ─────────────────────────────────────
app.get('/', (c) => c.json({ status: 'ok', app: 'Rithmic API', version: '2.3.0' }));

// ─── Public Routes ────────────────────────────────────
app.route('/auth', authRoutes);

// ─── Protected Routes ─────────────────────────────────
const protectedPaths = [
    '/habits', '/posts', '/challenges',
    '/notifications', '/dashboard', '/users',
    '/messages', '/leaderboard', '/friends',
    '/communities', '/upload',
];
for (const path of protectedPaths) {
    app.use(`${path}/*`, authMiddleware);
    app.use(path, authMiddleware);
}

app.route('/habits', habitsRoutes);
app.route('/posts', postsRoutes);
app.route('/challenges', challengesRoutes);
app.route('/notifications', notificationsRoutes);
app.route('/dashboard', dashboardRoutes);
app.route('/users', usersRoutes);
app.route('/messages', messagesRoutes);
app.route('/leaderboard', leaderboardRoutes);
app.route('/friends', friendsRoutes);
app.route('/communities', communitiesRoutes);
app.route('/upload', uploadsRoutes);

export default app;
