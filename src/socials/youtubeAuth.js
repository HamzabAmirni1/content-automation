import { google } from "googleapis";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_PATH = './tokens.json';

/**
 * Gets an authenticated YouTube client using tokens from tokens.json
 */
export async function getYouTubeAuth() {
    if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET) {
        throw new Error("YOUTUBE_CLIENT_ID or YOUTUBE_CLIENT_SECRET missing in .env");
    }

    const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000'
    );

    // Try reading from process.env (for Vercel/Netlify)
    if (process.env.YOUTUBE_TOKENS) {
        try {
            const tokens = JSON.parse(process.env.YOUTUBE_TOKENS);
            oauth2Client.setCredentials(tokens);
            return oauth2Client;
        } catch (e) {
            console.error("Error parsing YOUTUBE_TOKENS env var:", e.message);
        }
    }

    // Fallback to local tokens.json
    if (fs.existsSync(TOKEN_PATH)) {
        const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
        oauth2Client.setCredentials(tokens);
        return oauth2Client;
    }

    throw new Error("YouTube token not found (no tokens.json and no YOUTUBE_TOKENS env var).");
}
