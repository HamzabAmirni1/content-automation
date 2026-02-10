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

    let outputPath;
    if (path.isAbsolute(fileName)) {
        outputPath = fileName;
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    } else {
        const outputDir = path.join(__dirname, "../output");
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        outputPath = path.join(outputDir, fileName);
    }

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
            writer.on('error', (err) => {
                console.error("Writer Error:", err);
                reject(err);
            });
        });
    } catch (error) {
        console.error("Image Generation Error:", error.response?.data || error.message);
        throw error;
    }
}
