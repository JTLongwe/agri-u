# Agri-U Project Archive Notes

## Final Project State
- **Application Status**: Successfully deployed to Vercel (Production URL: https://agri-o72z6ytth-jtlongwes-projects.vercel.app or https://agri-u.vercel.app).
- **Core Features Implemented**: Firebase authentication, Firestore sync for user progress/lessons, offline-capable PWA, crop scanning AI simulation, weather data integration.
- **Bug Fixes**: Resolved the `useEffect` import issue in `Profile.jsx` that was breaking the Vercel deployment. 

## Video Pitch Generation Status
- We successfully used the browser subagent to record a full, error-free walkthrough of the V3 pitch flow (`agriu_pitch_v3_1772074450854.webp`).
- **Pending Task**: The final FFmpeg command to stitch the WebP frames and the TTS voiceover (`agriu_demo_voiceover_v3.mp3`) into an `.mp4` file was interrupted.
- **How to Resume**: 
  1. Run `node extract_frames.mjs` to extract all PNG frames from the WebP recording (the script has been updated to bypass `sharp` memory limits).
  2. Run the FFmpeg command to stitch it together: `ffmpeg -y -r 10 -i agriu_frames_v3/dump_%04d.png -i agriu_demo_voiceover_v3.mp3 -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k -shortest -pix_fmt yuv420p agriu_final_pitch_v3.mp4`

## Workspace Cleanup
- Removed temporary build artifacts where applicable.
- Saved these notes for future reference.
