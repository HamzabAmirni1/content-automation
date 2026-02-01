import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

/**
 * Uploads a video to a Facebook Page as a Reel/Post.
 * @param {string} videoPath 
 * @param {string} description 
 */
export async function uploadToFacebook(videoPath, description) {
    const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!token) {
        console.error("❌ Facebook Token missing in .env");
        return;
    }

    try {
        console.log("📤 Starting Facebook Video Upload...");

        // Step 1: Initialize Upload
        const initRes = await axios.post(`https://graph.facebook.com/v19.0/me/video_reels?access_token=${token}`, {
            upload_phase: 'start'
        });

        const videoId = initRes.data.video_id;
        console.log(`✅ Upload Initialized. Video ID: ${videoId}`);

        // Step 2: Upload Video Buffer
        const stats = fs.statSync(videoPath);
        const fileSizeInBytes = stats.size;
        const videoBuffer = fs.readFileSync(videoPath);

        await axios.post(`https://rupload.facebook.com/video-reels/${videoId}`, videoBuffer, {
            headers: {
                'Authorization': `OAuth ${token}`,
                'offset': '0',
                'file_size': fileSizeInBytes.toString(),
                'Content-Type': 'application/octet-stream'
            }
        });

        console.log("✅ Video Data Uploaded.");

        // Step 3: Publish with Description
        const publishRes = await axios.post(`https://graph.facebook.com/v19.0/me/video_reels?access_token=${token}`, {
            upload_phase: 'finish',
            video_id: videoId,
            video_state: 'PUBLISHED',
            description: description
        });

        console.log("✨ Video Published on Facebook Successfully!", publishRes.data);
        return publishRes.data;
    } catch (error) {
        console.error("❌ Facebook Upload Error:", error.response?.data || error.message);
        throw error;
    }
}
