import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates a video script and an image prompt based on a topic.
 * @param {string} topic 
 */
export async function generateContent(topic) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
        You are an expert content creator for YouTube Shorts, Reels, and TikTok.
        Topic: ${topic}
        
        Please provide:
        1. A catchy title.
        2. A short script (max 30 seconds) for a video.
        3. A detailed image generation prompt that represents this content visually.
        
        Return the result in JSON format:
        {
            "title": "...",
            "script": "...",
            "imagePrompt": "..."
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();

        // Clean up JSON if AI includes markdown backticks
        text = text.replace(/```json/g, "").replace(/```/g, "").trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("AI Generation Error:", error);
        throw error;
    }
}
