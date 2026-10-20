---
name: portal
description: Put the portal effect on your own talking-head clip and get an MP4 back. A ring of blue light opens below your chin, filled with a turning swirl, and the camera flies through it back into your shot. Runs on the shared engine in video-effects. Use when someone says "portal", "portal", "go through a ring", "wormhole transition" or "add the portal effect to my video".
---

# portal

A ring of blue light opens below your chin, filled with a turning swirl, and the camera flies through it back into your shot.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs portal my-clip.mp4 portal.mp4
```

It plays for 1.02s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`portal.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/04-portal.js`. Edit that file to change it.
