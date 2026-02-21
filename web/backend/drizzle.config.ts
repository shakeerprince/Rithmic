import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle', // output folder for migrations
    dialect: 'postgresql', // 'mysql' | 'sqlite' | 'postgresql'
    dbCredentials: {
        url: process.env.DATABASE_URL || '',
    },
});
