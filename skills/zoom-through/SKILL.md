---
name: zoom-through
description: Put the zoom through effect on your own talking-head clip and get an MP4 back. A chat window shows your ask, the reply streams in with a video card, and the camera flies through the card into your clip. Optional words up to 60 characters. Runs on the shared engine in video-effects. Use when someone says "zoom-through", "zoom through a chat", "Claude chat transition", "fly through the reply" or "add the chat effect to my video".
---

# zoom-through

A chat window shows your ask, the reply streams in with a video card, and the camera flies through the card into your clip.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 3s long.
2. **Words (optional).** `--words "..."`, up to 60 characters.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs zoom-through my-clip.mp4 zoom-through.mp4 --words "Add a zoom-through to my video"
```

It plays for 2.5s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`zoom-through.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/19-zoom-through.js`. Edit that file to change it.
