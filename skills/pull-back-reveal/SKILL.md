---
name: pull-back-reveal
description: Put the pull back reveal effect on your own talking-head clip and get an MP4 back. The camera pulls right back to show your shot is the preview in a video editor, with a timeline of clips under it. Optional words up to 24 characters. Runs on the shared engine in video-effects. Use when someone says "pull-back-reveal", "pull back to the editor", "reveal it is an edit", "pull-back reveal" or "add the editor reveal effect to my video".
---

# pull-back-reveal

The camera pulls right back to show your shot is the preview in a video editor, with a timeline of clips under it.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **Words (optional).** `--words "..."`, up to 24 characters.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs pull-back-reveal my-clip.mp4 pull-back-reveal.mp4 --words "Your clip"
```

It plays for 1.31s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`pull-back-reveal.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/17-pull-back-reveal.js`. Edit that file to change it.
