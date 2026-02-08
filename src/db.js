import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Connection string from Supabase (to be set in .env)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/**
 * Initialize Tables for Supabase
 */
export async function initDb() {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            user_id TEXT PRIMARY KEY,
            youtube_tokens JSONB,
            facebook_token TEXT,
            tiktok_token TEXT,
            instagram_token TEXT,
            settings JSONB DEFAULT '{"autoPost": true}',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS history (
            id SERIAL PRIMARY KEY,
            user_id TEXT REFERENCES users(user_id),
            topic TEXT,
            status TEXT,
            links JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await pool.query(query);
        console.log('✅ Supabase Tables Initialized');
    } catch (err) {
        console.error('❌ Error initializing Supabase:', err);
    }
}

export const db = {
    query: (text, params) => pool.query(text, params),
};
