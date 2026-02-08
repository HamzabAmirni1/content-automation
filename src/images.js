import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generates an image using Pollinations.ai and saves it.
 * @param {string} prompt 
 * @param {string} fileName 
 */
export async function generateImage(prompt, fileName) {
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://pollinations.ai/p/${encodedPrompt}?width=1080&height=1920&seed=${Math.floor(Math.random() * 100000)}&model=flux`;

    const outputPath = path.join(__dirname, "../output", fileName);

    try {
        console.log(`Generating image for: ${prompt}...`);
        const response = await axios({
            url: imageUrl,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve(outputPath));
            writer.on('error', reject);
        });
    } catch (error) {
        console.error("Image Generation Error:", error);
        throw error;
    }
}
