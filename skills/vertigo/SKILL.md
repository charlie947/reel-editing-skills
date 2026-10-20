---
name: vertigo
description: Put the vertigo effect on your own talking-head clip and get an MP4 back. A dolly zoom. You hold your size while a gridded corridor stretches away behind you, then the camera flies down it. Runs on the shared engine in video-effects. Use when someone says "vertigo", "vertigo", "dolly zoom", "hitchcock zoom" or "add the dolly zoom effect to my video".
---

# vertigo

A dolly zoom. You hold your size while a gridded corridor stretches away behind you, then the camera flies down it.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs vertigo my-clip.mp4 vertigo.mp4
```

It plays for 1.15s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`vertigo.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/13-vertigo.js`. Edit that file to change it.
