import cron from "node-cron";
import { generateContent } from "./src/ai.js";
import { generateImage } from "./src/images.js";
import { createVideoFromImage } from "./src/video.js";
import { google } from "googleapis";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

// Configuration
const TOPICS = [
    "Amazing facts about the universe",
    "Mind-blowing psychology facts",
    "Hidden wonders of the deep ocean",
    "How AI is changing the future",
    "Ancient mysteries that remain unsolved"
];

const TOKEN_PATH = './tokens.json';

/**
 * Main function to create and upload content
 */
async function runDailyAutomation() {
    try {
        const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
        console.log(`\n📅 [${new Date().toLocaleString()}] Starting Daily Automation...`);
        console.log(`🎯 Topic of the day: ${topic}`);

        // 1. Generate Script & Prompt
        const content = await generateContent(topic);
        console.log("✅ AI Scripting Done.");

        // 2. Generate Image
        const imagePath = await generateImage(content.imagePrompt, `daily_${Date.now()}.png`);
        console.log("✅ Visual Concept Created.");

        // 3. Create Video
        const videoName = `daily_post_${Date.now()}.mp4`;
        const videoPath = await createVideoFromImage(imagePath, videoName);
        console.log("✅ Video Rendered.");

        // 4. Upload to YouTube (Example)
        if (fs.existsSync(TOKEN_PATH)) {
            console.log("📤 Attempting to upload to YouTube...");
            // YouTube logic
        }

        // 5. Upload to Facebook (Using your new Token)
        if (process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
            console.log("📤 Attempting to upload to Facebook...");
            const { uploadToFacebook } = await import("./src/socials/facebook.js");
            await uploadToFacebook(videoPath, `${content.title}\n\n${content.script}\n#AI #Automation #HamzaAmirni`);
        } else {
            console.log("⚠️ Facebook token not found in .env. Skipping Facebook upload.");
        }

        console.log("✨ Daily Task Completed Successfully!");
    } catch (error) {
        console.error("❌ Daily Automation Error:", error);
    }
}

// 🕒 SCHEDULE: Every day at 9:00 AM
// Format: minute hour day-of-month month day-of-week
cron.schedule('0 9 * * *', () => {
    runDailyAutomation();
}, {
    timezone: "Africa/Casablanca"
});

console.log("🤖 Content Automation Bot is now ACTIVE.");
console.log("🕒 Scheduled to run every day at 09:00 AM (Casablanca Time).");

// Uncomment below if you want to run it immediately once for testing
// runDailyAutomation();
