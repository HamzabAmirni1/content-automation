import { google } from 'googleapis';
import readline from 'readline';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload'];
const TOKEN_PATH = './tokens.json';

/**
 * Script to generate YouTube Refresh Token
 */
async function getNewToken() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.YOUTUBE_CLIENT_ID,
        process.env.YOUTUBE_CLIENT_SECRET,
        process.env.YOUTUBE_REDIRECT_URI || 'http://localhost:3000' // Make sure this matches your Google Cloud Console
    );

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });

    console.log('🚀 Autorise cette application en visitant ce lien :');
    console.log(authUrl);

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    rl.question('Entrez le code de la page ici : ', async (code) => {
        rl.close();
        try {
            const { tokens } = await oauth2Client.getToken(code);
            fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
            console.log('✅ Token enregistré dans tokens.json !');
        } catch (err) {
            console.error('❌ Erreur lors de la récupération du token', err);
        }
    });
}

if (!process.env.YOUTUBE_CLIENT_ID) {
    console.log('❌ Erreur : YOUTUBE_CLIENT_ID manquant dans le .env');
} else {
    getNewToken();
}
