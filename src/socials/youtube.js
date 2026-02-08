import { google } from "googleapis";
import fs from "fs";

/**
 * Uploads a video to YouTube.
 * Requires OAuth2 credentials.
 * @param {string} videoPath 
 * @param {object} metadata {title, description}
 * @param {object} auth Credentials
 */
export async function uploadToYouTube(videoPath, metadata, auth) {
    const youtube = google.youtube({
        version: 'v3',
        auth: auth
    });

    const res = await youtube.videos.insert({
        part: 'snippet,status',
        requestBody: {
            snippet: {
                title: metadata.title,
                description: metadata.description,
                tags: ['ai', 'automation', 'shorts'],
                categoryId: '22', // People & Blogs
            },
            status: {
                privacyStatus: 'public', // or 'private' for testing
                selfDeclaredMadeForKids: false,
            },
        },
        media: {
            body: fs.createReadStream(videoPath),
        },
    });

    console.log('Video uploaded to YouTube:', res.data.id);
    return res.data;
}
