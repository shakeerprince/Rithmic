import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;
console.log("Testing with postgres.js (Verbose)...");

if (!connectionString) {
    console.error("No DATABASE_URL found");
    process.exit(1);
}

// Extract components for logging (safe part)
const parts = connectionString.split('@');
if (parts.length > 1) {
    console.log("Connecting to:", parts[1]);
}

const sql = postgres(connectionString, {
    ssl: 'prefer', // Try to be lenient
    connect_timeout: 10,
});

async function test() {
    try {
        console.log("Attempting query...");
        const result = await sql`SELECT 1 as connected`;
        console.log("✅ Success!", result);
        process.exit(0);
    } catch (err: any) {
        console.error("❌ Connection failed details:");
        console.error("Message:", err.message);
        console.error("Code:", err.code);
        console.error("Severity:", err.severity);
        console.error("Detail:", err.detail);
        process.exit(1);
    }
}

test();
