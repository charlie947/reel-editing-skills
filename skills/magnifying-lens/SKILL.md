---
name: magnifying-lens
description: Put the magnifying lens effect on your own talking-head clip and get an MP4 back. A glass lens glides over your chest and magnifies what is under it, then opens out back into your shot. Runs on the shared engine in video-effects. Use when someone says "magnifying-lens", "magnifying glass", "zoom lens over me", "loupe effect" or "add the lens effect to my video".
---

# magnifying-lens

A glass lens glides over your chest and magnifies what is under it, then opens out back into your shot.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs magnifying-lens my-clip.mp4 magnifying-lens.mp4
```

It plays for 1.49s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`magnifying-lens.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/03-magnifying-lens.js`. Edit that file to change it.
