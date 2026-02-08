import { generateContent } from "../../src/ai.js";
import { generateImage } from "../../src/images.js";
import { uploadPhotoToFacebook } from "../../src/socials/facebook.js";
import fs from "fs";
import path from "path";

export const handler = async (event, context) => {
    try {
        console.log("🚀 Starting Automation via Netlify Function...");

        // 1. Generate Content
        const randomTopics = ["Space facts", "History mysteries", "Psychology hacks", "Nature"];
        const chosenTopic = randomTopics[Math.floor(Math.random() * randomTopics.length)];
        const content = await generateContent(`A viral post about ${chosenTopic}`);

        // 2. Generate Image
        // Note: Netlify /tmp is writable
        const tempPath = path.join("/tmp", `post_${Date.now()}.png`);
        const imagePath = await generateImage(content.imagePrompt, `post_${Date.now()}.png`);

        // Move image if needed, or just use the generated one
        // Pollinations returns a buffer/stream that we save.

        // 3. Upload to Facebook
        if (process.env.FACEBOOK_PAGE_ACCESS_TOKEN) {
            const caption = `${content.title}\n\n${content.script}\n\n#AI #Automation #Netlify`;
            await uploadPhotoToFacebook(imagePath, caption);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ status: "success", topic: content.title }),
        };
    } catch (error) {
        console.error("Netlify Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
