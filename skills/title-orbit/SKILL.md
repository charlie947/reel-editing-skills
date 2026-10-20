---
name: title-orbit
description: Put the title orbit effect on your own talking-head clip and get an MP4 back. Your words circle your head like a ring on a studio floor, then the camera flies through a letter back into your shot. Optional words up to 12 characters. Runs on the shared engine in video-effects. Use when someone says "title-orbit", "text around my head", "orbit title", "ring of words round me" or "add the orbiting title effect to my video".
---

# title-orbit

Your words circle your head like a ring on a studio floor, then the camera flies through a letter back into your shot.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **Words (optional).** `--words "..."`, up to 12 characters.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs title-orbit my-clip.mp4 title-orbit.mp4 --words "BIG NEWS"
```

It plays for 1.23s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`title-orbit.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/02-title-orbit.js`. Edit that file to change it.
