const sharp = require('sharp');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ffmpegPath = require('ffmpeg-static');

const webpPath = 'C:/Users/joann/.gemini/antigravity/brain/1fd39707-b405-4f66-92a2-7bef23f05ca1/agri_u_pitch_demo_1771985568351.webp';
const audioPath = 'C:/Users/joann/OneDrive/Desktop/Dev/Agri-U-Plan/Pitch_Voiceover.mp3';
const outputPath = 'C:/Users/joann/OneDrive/Desktop/Dev/Agri-U-Plan/Agri_U_Pitch_Final.mp4';
const framesDir = 'C:/Users/joann/OneDrive/Desktop/Dev/agri-u/temp_frames';

async function run() {
    // Step 1: Create frames directory
    if (fs.existsSync(framesDir)) {
        fs.rmSync(framesDir, { recursive: true });
    }
    fs.mkdirSync(framesDir, { recursive: true });
    console.log('Created frames directory.');

    // Step 2: Get page count from a small metadata read (page 0 only)
    const firstFrame = sharp(webpPath, { page: 0 });
    const meta = await firstFrame.metadata();
    const frameWidth = meta.width;
    const frameHeight = meta.height;

    // Try to detect page count by reading with animated flag but with unlimited pixels
    let pageCount = 1;
    try {
        const animMeta = await sharp(webpPath, { animated: true, pages: -1, limitInputPixels: false }).metadata();
        pageCount = animMeta.pages || 1;
    } catch (e) {
        // If that also fails, try counting pages one by one
        console.log('Counting pages manually...');
        for (let i = 0; i < 10000; i++) {
            try {
                await sharp(webpPath, { page: i }).metadata();
                pageCount = i + 1;
            } catch {
                break;
            }
        }
    }

    console.log(`Detected ${pageCount} frames, each ${frameWidth}x${frameHeight}`);

    // Step 3: Extract frames one at a time
    for (let i = 0; i < pageCount; i++) {
        const framePath = path.join(framesDir, `frame_${String(i + 1).padStart(4, '0')}.png`);
        await sharp(webpPath, { page: i }).png().toFile(framePath);

        if ((i + 1) % 20 === 0 || i === 0) {
            console.log(`  Extracted frame ${i + 1}/${pageCount}`);
        }
    }
    console.log(`Extracted all ${pageCount} frames.`);

    // Step 4: Calculate FPS to match audio duration (~49s voiceover)
    const fps = Math.max(1, Math.round(pageCount / 49));
    console.log(`Using ${fps} FPS to match ~49s audio.`);

    // Step 5: Use ffmpeg to combine frames + audio into MP4
    const framePattern = path.join(framesDir, 'frame_%04d.png').replace(/\\/g, '/');
    const cmd = `"${ffmpegPath}" -y -framerate ${fps} -i "${framePattern}" -i "${audioPath}" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 192k -pix_fmt yuv420p -shortest "${outputPath}"`;

    console.log('Running ffmpeg to compile MP4...');
    execSync(cmd, { stdio: 'inherit' });
    console.log('\\nDone! Saved to ' + outputPath);

    // Cleanup
    console.log('Cleaning up temporary frames...');
    fs.rmSync(framesDir, { recursive: true });
    console.log('Cleanup complete.');
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
