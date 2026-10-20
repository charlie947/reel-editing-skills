---
name: frame-break
description: Put the frame break effect on your own talking-head clip and get an MP4 back. Your shot shrinks into a printed photo while your head and shoulders stay out over the top edge, then the camera dives into the print. Runs on the shared engine in video-effects. Use when someone says "frame-break", "frame break", "pop out of the photo", "break out of the frame" or "add the photo print effect to my video".
---

# frame-break

Your shot shrinks into a printed photo while your head and shoulders stay out over the top edge, then the camera dives into the print.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 3s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs frame-break my-clip.mp4 frame-break.mp4
```

It plays for 2s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`frame-break.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/10-frame-break.js`. Edit that file to change it.
