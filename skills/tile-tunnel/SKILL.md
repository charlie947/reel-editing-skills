---
name: tile-tunnel
description: Put the tile tunnel effect on your own talking-head clip and get an MP4 back. The camera flies backwards out of your shot down a tunnel of tiles, then flies down it again into you. Runs on the shared engine in video-effects. Use when someone says "tile-tunnel", "tunnel", "fly through a tunnel", "tile tunnel" or "add the tunnel effect to my video".
---

# tile-tunnel

The camera flies backwards out of your shot down a tunnel of tiles, then flies down it again into you.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs tile-tunnel my-clip.mp4 tile-tunnel.mp4
```

It plays for 1.06s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`tile-tunnel.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/11-tile-tunnel.js`. Edit that file to change it.
