# MP4 Demo Generation Plan

The goal is to export a properly synthesized MP4 file demonstrating the Agri-U web application alongside the TTS voiceover narration.

## Current State
- The browser subagent successfully recorded the 3-minute WebP animation.
- FFmpeg was not able to parse the `libwebp_anim` format out-of-the-box.
- We used `anim_dump.exe` to extract every individual frame into an `agriu_frames/` directory, resulting in 1,590 PNG images.

## Plan to Finalize MP4
1. **Combine PNG Image Sequence:** Use FFmpeg to combine the extracted `dump_xxxx.png` files into an MP4 clip at 10 frames per second (which roughly matches the browser recording framerate).
2. **Overlay Audio:** Merge the generated TTS file (`agriu_demo_voiceover.mp3`) onto the MP4 timeline.
3. **Save Video:** Output the final file to `agriu_final_demo.mp4` on the project root folder.
4. **Cleanup:** Remove the temporary tracking images.
