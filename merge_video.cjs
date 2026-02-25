const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');

ffmpeg.setFfmpegPath(ffmpegStatic);

const videoPath = 'C:/Users/joann/.gemini/antigravity/brain/1fd39707-b405-4f66-92a2-7bef23f05ca1/agri_u_pitch_demo_1771985568351.webp';
const audioPath = 'C:/Users/joann/OneDrive/Desktop/Dev/Agri-U-Plan/Pitch_Voiceover.mp3';
const outputPath = 'C:/Users/joann/OneDrive/Desktop/Dev/Agri-U-Plan/Agri_U_Pitch_Final.mp4';

console.log('Starting merge process using ffmpeg-static...');

ffmpeg()
    .input(videoPath)
    .input(audioPath)
    .outputOptions([
        '-c:v libx264',
        '-c:a aac',
        '-pix_fmt yuv420p',
        '-shortest'
    ])
    .save(outputPath)
    .on('end', () => {
        console.log('Merge finished successfully! Saved to ' + outputPath);
    })
    .on('error', (err) => {
        console.error('Error merging video and audio:', err);
    });
