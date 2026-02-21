import { Hono } from 'hono';
import { resolve, extname } from 'path';
import { mkdirSync, existsSync, writeFileSync } from 'fs';
import { randomUUID } from 'crypto';

const uploads = new Hono();

// Use /tmp on serverless (Vercel), or local uploads/ dir for dev
const UPLOAD_DIR = process.env.VERCEL
    ? '/tmp/uploads'
    : resolve(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!existsSync(UPLOAD_DIR)) mkdirSync(UPLOAD_DIR, { recursive: true });

// Allowed MIME types
const ALLOWED_TYPES = new Set([
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm', 'video/quicktime',
]);

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// POST /api/upload — upload a file (image or video)
uploads.post('/', async (c) => {
    const formData = await c.req.formData();
    const file = formData.get('file') as File | null;

    if (!file) return c.json({ error: 'No file provided' }, 400);
    if (!ALLOWED_TYPES.has(file.type)) return c.json({ error: `File type ${file.type} not allowed` }, 400);
    if (file.size > MAX_SIZE) return c.json({ error: 'File too large (max 10MB)' }, 400);

    const ext = extname(file.name) || '.bin';
    const filename = `${randomUUID()}${ext}`;
    const filepath = resolve(UPLOAD_DIR, filename);

    const buffer = await file.arrayBuffer();
    writeFileSync(filepath, Buffer.from(buffer));

    const url = `/uploads/${filename}`;
    return c.json({ url, filename, type: file.type, size: file.size });
});

export default uploads;
