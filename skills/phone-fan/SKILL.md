---
name: phone-fan
description: Put the phone fan effect on your own talking-head clip and get an MP4 back. The camera pulls out to find your shot on a phone, four more phones fan out behind it like a hand of cards, then it dives back in. Runs on the shared engine in video-effects. Use when someone says "phone-fan", "fan of phones", "show me on a phone", "phone fan" or "add the phones effect to my video".
---

# phone-fan

The camera pulls out to find your shot on a phone, four more phones fan out behind it like a hand of cards, then it dives back in.

## What you need

1. **Your clip.** A vertical or landscape MP4 of you talking to camera, head and shoulders in shot. At least 2s long.
2. **No words.** This effect shows none.
3. **The engine.** Install `video-effects` beside this skill and follow its setup once (ffmpeg, Node, Puppeteer, torch).

## Run it

```
node ~/.claude/skills/video-effects/run.cjs phone-fan my-clip.mp4 phone-fan.mp4
```

It plays for .98s from `--at` (default 0.6s), then hands back to your shot. Change the length with `--len`. Add `--check` to test the fit and load without rendering.

## What you get

`phone-fan.mp4`: 1080x1920, 30fps, H.264, your audio kept, the same length as your clip.

The effect itself is `video-effects/fx/14-phone-fan.js`. Edit that file to change it.
