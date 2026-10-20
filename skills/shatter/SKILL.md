---
name: shatter
description: Put the shatter effect on your own talking-head clip and get an MP4 back. Your shot cracks like a pane of glass and the shards fly past the camera, with you whole on the last shard. Runs on the shared engine in video-effects. Use when someone says "shatter", "shatter", "break the screen", "glass break transition" or "add the glass shatter effect to my video".
---

# shatter

Your shot cracks like a pane of glass and the shards fly past the camera, with you whole on the last shard.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs shatter my-clip.mp4 shatter.mp4
```

It plays for 1.09s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`shatter.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/15-shatter.js`. Edit that file to change it.
