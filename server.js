import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import { google } from 'googleapis';
import { startAutomation } from './index.js';
import { uploadToFacebook } from './src/socials/facebook.js';
import { db, initDb } from './src/db.js';

dotenv.config();

// --- SUPABASE CONNECTION ---
initDb();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const DATA_FILE = './tokens.json';

// --- FACEBOOK OAUTH CONFIG ---
const FB_APP_ID = process.env.FACEBOOK_APP_ID;
const FB_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const FB_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI || 'http://localhost:3000/auth/facebook/callback';

// --- YOUTUBE OAUTH SETUP ---
const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/auth/youtube/callback'
);

// --- ROUTES ---

// 1. YouTube Auth
app.get('/auth/youtube', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });
    res.redirect(url);
});

// 2. Facebook Auth
app.get('/auth/facebook', (req, res) => {
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${FB_REDIRECT_URI}&scope=pages_manage_posts,instagram_content_publish,pages_read_engagement`;
    res.redirect(url);
});

// 2. YouTube Callback
app.get('/auth/youtube/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Save to Supabase
        await db.query(
            `INSERT INTO users (user_id, youtube_tokens) VALUES ($1, $2)
             ON CONFLICT (user_id) DO UPDATE SET youtube_tokens = $2`,
            ['admin', JSON.stringify(tokens)]
        );

        res.send('<h1>✅ YouTube Connected & Saved to Supabase!</h1><p>You can close this window now.</p>');
    } catch (e) {
        res.status(500).send('Error: ' + e.message);
    }
});

// 3. Facebook Callback
app.get('/auth/facebook/callback', async (req, res) => {
    const { code } = req.query;
    try {
        // Exchange code for Access Token
        const tokenRes = await axios.get(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${FB_APP_ID}&redirect_uri=${FB_REDIRECT_URI}&client_secret=${FB_APP_SECRET}&code=${code}`);
        const accessToken = tokenRes.data.access_token;

        // Save to Supabase
        await db.query(
            `INSERT INTO users (user_id, facebook_token) VALUES ($1, $2)
             ON CONFLICT (user_id) DO UPDATE SET facebook_token = $2`,
            ['admin', accessToken]
        );

        res.send('<h1>✅ Facebook Connected!</h1><p>Tokens saved to Supabase. You can close this.</p>');
    } catch (e) {
        res.status(500).send('Error: ' + (e.response?.data?.error?.message || e.message));
    }
});


// 4. Trigger Automation manually
app.post('/api/automate', async (req, res) => {
    const { topic } = req.body;
    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    // Run automation in background
    startAutomation(topic).catch(err => console.error('Automation failed:', err));

    res.json({ status: 'started', topic });
});

app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
});
