---
name: liquid-glass
description: Put the liquid glass effect on your own talking-head clip and get an MP4 back. A drop of clear glass rises over your chest, spreads into a pill, stretches into a tall pane and the camera dives through it. Runs on the shared engine in video-effects. Use when someone says "liquid-glass", "liquid glass", "glass blob", "glass pane transition" or "add the liquid glass effect to my video".
---

# liquid-glass

A drop of clear glass rises over your chest, spreads into a pill, stretches into a tall pane and the camera dives through it.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs liquid-glass my-clip.mp4 liquid-glass.mp4
```

It plays for .99s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`liquid-glass.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/08-liquid-glass.js`. Edit that file to change it.
