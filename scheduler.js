import cron from "node-cron";
import { generateImage } from "./src/images.js";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

/**
 * Main function to create and upload content (Photo + Text)
 */
async function runDailyAutomation() {
    try {
        console.log(`\n📅 [${new Date().toLocaleString()}] Starting Daily Automation (Photo + Text)...`);

        // 1. Generate Content using AI
        const { generateContent } = await import("./src/ai.js");

        // Asking Gemini to pick a random interesting topic and write about it
        const randomTopics = ["Space facts", "History mysteries", "Psychology hacks", "Nature wonders", "Future tech", "Ancient civilizations"];
        const chosenTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];

        const content = await generateContent(`A random interesting post about ${chosenTopic}`);
        console.log(`🎯 AI generated content: ${content.title}`);

        // 2. Generate Image
        const imagePath = await generateImage(content.imagePrompt, `daily_photo_${Date.now()}.png`);
        console.log("✅ Visual Created.");

        // 3. Upload to Facebook as a Photo Post
        if (process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
            try {
                console.log("📤 Posting Photo to Facebook...");
                const { uploadPhotoToFacebook } = await import("./src/socials/facebook.js");
                const caption = `${content.title}\n\n${content.script}\n\n#AI #Automation #DailyPost #HamzaAmirni`;
                await uploadPhotoToFacebook(imagePath, caption);
                console.log("✅ Posted successfully to Facebook!");
            } catch (fbError) {
                console.error("❌ Facebook Upload Error:", fbError.message);
            }
        }

        // 4. Upload to YouTube as a Video
        if (process.env.YOUTUBE_CLIENT_ID) {
            try {
                console.log("🎬 Creating Video for YouTube...");
                const { createVideoFromImage } = await import("./src/video.js");
                const videoPath = await createVideoFromImage(imagePath, `daily_video_${Date.now()}.mp4`);

                console.log("📤 Uploading to YouTube...");
                const { getYouTubeAuth } = await import("./src/socials/youtubeAuth.js");
                const { uploadToYouTube } = await import("./src/socials/youtube.js");

                const auth = await getYouTubeAuth();
                await uploadToYouTube(videoPath, {
                    title: content.title,
                    description: content.script + "\n\n#AI #Automation #Shorts"
                }, auth);

                console.log("✅ Posted successfully to YouTube!");
            } catch (ytError) {
                console.error("❌ YouTube Upload Error:", ytError.message);
            }
        }

        console.log("✨ Automation Task Finished!");
    } catch (error) {
        console.error("❌ Automation Error:", error);
    }
}

// 🕒 SCHEDULE: Every 6 hours (00:00, 06:00, 12:00, 18:00)
cron.schedule('0 */6 * * *', () => {
    runDailyAutomation();
}, {
    timezone: "Africa/Casablanca"
});

console.log("🤖 Content Automation Bot is ACTIVE.");
console.log("🕒 Scheduled to run every 6 hours automatically (Casablanca Time).");

// Run once immediately on start
runDailyAutomation();
