---
name: head-pop-out
description: Put the head pop out effect on your own talking-head clip and get an MP4 back. Your shot shrinks into a blue panel and your head and shoulders spring up out of its top edge. Optional words settle on a card below. It holds to the end of your clip, so use it as an ending. Optional words up to 40 characters. Runs on the shared engine in video-effects. Use when someone says "head-pop-out", "head pop out", "pop out of the box", "ending card with my head" or "add the ending effect to my video".
---

# head-pop-out

Your shot shrinks into a blue panel and your head and shoulders spring up out of its top edge. Optional words settle on a card below. It holds to the end of your clip, so use it as an ending.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **Words (optional).** `--words "..."`, up to 40 characters.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs head-pop-out my-clip.mp4 head-pop-out.mp4 --words "New video every Monday"
```

It starts at `--at` (default 0.6s, or 2.2s before the end of a short clip) and holds to the end. Give it at least 1.6s. Add `--check` to test the fit and load without rendering.

## What you get

`head-pop-out.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/20-head-pop-out.js`. Edit that file to change it.
