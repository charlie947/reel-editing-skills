---
name: clone-room
description: Put the clone room effect on your own talking-head clip and get an MP4 back. Copies of you step out behind you in a corridor that recedes into your room, then step back in. Runs on the shared engine in video-effects. Use when someone says "clone-room", "clones of me", "copies of me behind me", "clone room" or "add the clones effect to my video".
---

# clone-room

Copies of you step out behind you in a corridor that recedes into your room, then step back in.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs clone-room my-clip.mp4 clone-room.mp4
```

It plays for 1.1s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`clone-room.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/05-clone-room.js`. Edit that file to change it.
