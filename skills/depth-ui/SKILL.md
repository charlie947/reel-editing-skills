---
name: depth-ui
description: Put the depth ui effect on your own talking-head clip and get an MP4 back. Your room falls away and you stand among real app windows at different depths (a terminal, a video timeline and a chat with your words). Optional words up to 60 characters. Runs on the shared engine in video-effects. Use when someone says "depth-ui", "apps floating around me", "depth UI", "windows behind me" or "add the app windows effect to my video".
---

# depth-ui

Your room falls away and you stand among real app windows at different depths: a terminal, a video timeline and a chat with your words.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **Words (optional).** `--words "..."`, up to 60 characters.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs depth-ui my-clip.mp4 depth-ui.mp4 --words "Add a depth effect to my video"
```

It plays for 1.16s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`depth-ui.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/12-depth-ui.js`. Edit that file to change it.
