import app from './app';

// ─── Bun local development server ────────────────────
const port = Number(process.env.PORT) || 3001;
console.log(`\n  🚀 Rithmic API v2.3.0 running on http://localhost:${port}\n`);

export default {
    port,
    fetch: app.fetch,
};
