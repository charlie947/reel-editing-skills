---
name: screen-in-screen
description: Put the screen in screen effect on your own talking-head clip and get an MP4 back. The camera pulls back to find your shot playing on a laptop on a desk, then dives back into the screen. Runs on the shared engine in video-effects. Use when someone says "screen-in-screen", "show me on a laptop", "screen in screen", "pull back to a laptop" or "add the laptop effect to my video".
---

# screen-in-screen

The camera pulls back to find your shot playing on a laptop on a desk, then dives back into the screen.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs screen-in-screen my-clip.mp4 screen-in-screen.mp4
```

It plays for 1.34s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`screen-in-screen.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/09-screen-in-screen.js`. Edit that file to change it.
