---
name: cube-spin
description: Put the cube spin effect on your own talking-head clip and get an MP4 back. Your shot becomes the front of a 3D cube that turns a quarter, and you carry on talking on the side face. Runs on the shared engine in video-effects. Use when someone says "cube-spin", "cube spin", "3D cube transition", "rotate to the next side" or "add the cube effect to my video".
---

# cube-spin

Your shot becomes the front of a 3D cube that turns a quarter, and you carry on talking on the side face.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs cube-spin my-clip.mp4 cube-spin.mp4
```

It plays for 1.22s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`cube-spin.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/07-cube-spin.js`. Edit that file to change it.
