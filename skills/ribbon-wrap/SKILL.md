---
name: ribbon-wrap
description: Put the ribbon wrap effect on your own talking-head clip and get an MP4 back. A blue satin ribbon carrying your words unrolls round you, a gift tag drops off it and the camera dives into the tag. Optional words up to 14 characters. Runs on the shared engine in video-effects. Use when someone says "ribbon-wrap", "wrap a ribbon round me", "gift ribbon", "ribbon with text" or "add the ribbon effect to my video".
---

# ribbon-wrap

A blue satin ribbon carrying your words unrolls round you, a gift tag drops off it and the camera dives into the tag.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **Words (optional).** `--words "..."`, up to 14 characters.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs ribbon-wrap my-clip.mp4 ribbon-wrap.mp4 --words "NEW LAUNCH"
```

It plays for 1.04s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`ribbon-wrap.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/18-ribbon-wrap.js`. Edit that file to change it.
