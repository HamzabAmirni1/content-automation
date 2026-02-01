import { generateContent } from "./src/ai.js";
import { generateImage } from "./src/images.js";
import { createVideoFromImage } from "./src/video.js";
import dotenv from "dotenv";

dotenv.config();

async function startAutomation(topic) {
    try {
        console.log(`🚀 Starting automation for topic: ${topic}`);

        // 1. Generate Prompt & Script using AI
        const content = await generateContent(topic);
        console.log("✅ AI Content Generated:", content.title);

        // 2. Generate Image
        const imagePath = await generateImage(content.imagePrompt, "background.png");
        console.log("✅ Image Generated:", imagePath);

        // 3. Create Video (Requires FFmpeg installed)
        const videoPath = await createVideoFromImage(imagePath, "final_video.mp4");
        console.log("✅ Video Created:", videoPath);

        // 4. Upload to Socials (Placeholders for logic)
        console.log("⏳ Social Media Upload feature is ready for setup with your API keys.");

        // Example logic if keys are present
        /*
        if (process.env.YOUTUBE_CLIENT_ID) {
             await uploadToYouTube(videoPath, { title: content.title, description: content.script }, auth);
        }
        */

        console.log("✨ Automation Process Completed!");
    } catch (error) {
        console.error("❌ Error in Automation Flow:", error);
    }
}

// Get topic from command line or default
const topic = process.argv[2] || "Interesting facts about Space";
startAutomation(topic);
