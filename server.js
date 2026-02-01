import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import fs from 'fs';
import { google } from 'googleapis';
import { uploadToFacebook } from './src/socials/facebook.js';
import mongoose from 'mongoose';
import { User } from './src/db.js';

dotenv.config();

// --- MONGOOSE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/content-automation';
mongoose.connect(MONGO_URI)
    .then(() => console.log('🍃 Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const DATA_FILE = './tokens.json';

// --- YOUTUBE OAUTH SETUP ---
const oauth2Client = new google.auth.OAuth2(
    process.env.YOUTUBE_CLIENT_ID,
    process.env.YOUTUBE_CLIENT_SECRET,
    process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000/auth/youtube/callback'
);

// 1. YouTube Auth Route
app.get('/auth/youtube', (req, res) => {
    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/youtube.upload'],
    });
    res.redirect(url);
});

// 2. YouTube Callback
app.get('/auth/youtube/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await oauth2Client.getToken(code);

        // Save to MongoDB (Assume single user 'admin' for now)
        await User.findOneAndUpdate(
            { userId: 'admin' },
            { youtubeTokens: tokens },
            { upsert: true }
        );

        res.send('<h1>✅ YouTube Connected & Saved to DB!</h1><p>You can close this window now.</p>');
    } catch (e) {
        res.status(500).send('Error: ' + e.message);
    }
});

// 3. Facebook Connection
app.post('/api/connect/facebook', async (req, res) => {
    const { token } = req.body;
    if (token) {
        await User.findOneAndUpdate(
            { userId: 'admin' },
            { facebookToken: token },
            { upsert: true }
        );
        res.json({ status: 'success', message: 'Facebook linked and saved to DB' });
    } else {
        res.status(400).json({ status: 'error' });
    }
});

// 4. Trigger Automation manually
app.post('/api/automate', async (req, res) => {
    const { topic } = req.body;
    // Call the logic from index.js (maybe refactor to a function)
    res.json({ status: 'started', topic });
});

app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
});
