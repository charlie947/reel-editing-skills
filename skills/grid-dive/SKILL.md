---
name: grid-dive
description: Put the grid dive effect on your own talking-head clip and get an MP4 back. Your shot pulls back into a wall of tiles, each one another moment of your clip, then dives back into you. Runs on the shared engine in video-effects. Use when someone says "grid-dive", "grid of me", "wall of clips", "zoom out into a grid" or "add the tile wall effect to my video".
---

# grid-dive

Your shot pulls back into a wall of tiles, each one another moment of your clip, then dives back into you.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs grid-dive my-clip.mp4 grid-dive.mp4
```

It plays for 1.03s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`grid-dive.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/01-grid-dive.js`. Edit that file to change it.
