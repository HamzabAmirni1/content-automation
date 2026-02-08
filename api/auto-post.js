import { generateContent } from "../src/ai.js";
import { generateImage } from "../src/images.js";
import { uploadPhotoToFacebook } from "../src/socials/facebook.js";
import path from "path";

export default async function handler(req, res) {
    // Only allow GET (for Cron) or POST
    try {
        console.log("🚀 Vercel Edge/Serverless Function Started...");

        // 1. Generate Content
        const randomTopics = ["Space facts", "History mysteries", "Psychology hacks", "Nature wonders", "Future tech"];
        const chosenTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
        const content = await generateContent(`A viral post about ${chosenTopic}`);

        // 2. Generate Image
        // In Vercel, we can use /tmp for temporary storage
        const imageName = `vpost_${Date.now()}.png`;
        const imagePath = await generateImage(content.imagePrompt, imageName);

        // 3. Upload to Facebook
        let fbResult = null;
        if (process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
            const caption = `${content.title}\n\n${content.script}\n\n#AI #Automation #Vercel`;
            fbResult = await uploadPhotoToFacebook(imagePath, caption);
        }

        return res.status(200).json({
            status: "success",
            topic: content.title,
            facebook: fbResult ? "posted" : "skipped"
        });
    } catch (error) {
        console.error("Vercel Function Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
