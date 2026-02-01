import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Creates a simple MP4 video from an image.
 * Requires FFmpeg to be installed on the system.
 * @param {string} imagePath 
 * @param {string} audioPath (optional)
 * @param {string} outputName 
 */
export async function createVideoFromImage(imagePath, outputName, duration = 10) {
    const outputPath = path.join(__dirname, "../output", outputName);

    return new Promise((resolve, reject) => {
        ffmpeg(imagePath)
            .loop(duration)
            .fps(30)
            .size('1080x1920') // Vertical format for Shorts/Reels/TikTok
            .format('mp4')
            .on('start', (commandLine) => {
                console.log('Spawned Ffmpeg with command: ' + commandLine);
            })
            .on('error', (err) => {
                console.error('An error occurred: ' + err.message);
                reject(err);
            })
            .on('end', () => {
                console.log('Video creation finished!');
                resolve(outputPath);
            })
            .save(outputPath);
    });
}
