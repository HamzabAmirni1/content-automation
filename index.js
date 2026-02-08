import { generateContent } from "./src/ai.js";
import { generateImage } from "./src/images.js";
import { createVideoFromImage } from "./src/video.js";
import dotenv from "dotenv";

dotenv.config();

export async function startAutomation(topic) {
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

        // 4. Upload to Socials
        if (process.env.YOUTUBE_CLIENT_ID) {
            try {
                const { getYouTubeAuth } = await import("./src/socials/youtubeAuth.js");
                const { uploadToYouTube } = await import("./src/socials/youtube.js");
                const auth = await getYouTubeAuth();
                await uploadToYouTube(videoPath, { title: content.title, description: content.script }, auth);
                console.log("✅ Uploaded to YouTube!");
            } catch (authError) {
                console.error("⚠️ YouTube Upload failed:", authError.message);
            }
        }

        console.log("✨ Automation Process Completed!");
    } catch (error) {
        console.error("❌ Error in Automation Flow:", error);
    }
}

// Get topic from command line or default
const topic = process.argv[2] || "Interesting facts about Space";
startAutomation(topic);
