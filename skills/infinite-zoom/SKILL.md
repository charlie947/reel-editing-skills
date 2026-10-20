---
name: infinite-zoom
description: Put the infinite zoom effect on your own talking-head clip and get an MP4 back. A framed copy of the empty stage appears beside you with a frame inside it, and the camera zooms through both back into your shot. Runs on the shared engine in video-effects. Use when someone says "infinite-zoom", "infinite zoom", "frame inside a frame", "droste effect" or "add the infinite zoom effect to my video".
---

# infinite-zoom

A framed copy of the empty stage appears beside you with a frame inside it, and the camera zooms through both back into your shot.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs infinite-zoom my-clip.mp4 infinite-zoom.mp4
```

It plays for 1.21s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`infinite-zoom.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/06-infinite-zoom.js`. Edit that file to change it.
