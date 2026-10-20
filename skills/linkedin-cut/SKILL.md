---
name: linkedin-cut
description: Turn any reel built with this pack into a LinkedIn video, 1080 x 1350 (4:5) with the same beats, motion panel on top, caption pill at the seam and the face card below, captions always on because most people watch muted, loudness at -12 LUFS, a first frame that works as a still, no comment-for-the-link ask and the links in the post text instead. Use when someone says "make a LinkedIn version", "LinkedIn video", "4:5 cut", "post this on LinkedIn", "resize my reel for LinkedIn" or "LinkedIn video motion".
---

# LinkedIn cut

One build, two posts. The same `reel.js` renders the Instagram reel and the LinkedIn video. You do not edit the beats again.

## Step 1: Render the 4:5 cut

```
node render.mjs --stills 0.5,3,6 --linkedin     # check three frames first
node render.mjs --linkedin                      # full cut -> reel-linkedin.mp4
```

To look at one frame in the browser, open `index.html?render&li&t=3`.

## Step 2: What changes on LinkedIn, and why

| | Instagram reel | LinkedIn video |
|---|---|---|
| Size | 1080 x 1920 (9:16) | 1080 x 1350 (4:5). It fills the feed on a phone and still fits on a laptop |
| Layout | motion y 0-1000, face card below | motion y 0-620, caption at the seam, face card y 700-1310 |
| Captions | on | always on, never optional. Most LinkedIn video plays muted |
| Hook | two lines on frame 0 | the same two lines. Frame 0 is also the still people see before it plays, so it has to read on its own |
| Loudness | -14 LUFS | -12 LUFS |
| Length | 45-60s | the same cut. 60s is fine. Keep the scene changing every 3-5s |
| The ask | "Comment KEYWORD" for the link | no comment gate. Put every link in the post text |

## Step 3: Size objects from PANEL

The starter sets `PANEL` before `reel.js` loads. Size every object from it so one beat fits both cuts:

```js
html: `<div style="top:${PANEL.split * 0.14}px;height:${PANEL.split * 0.68}px">...</div>`
```

| | Instagram | LinkedIn |
|---|---|---|
| `PANEL.split` (motion panel on a split beat) | 1000 | 620 |
| `PANEL.full` (full-graphic beat) | 1920 | 1350 |

Keep the caption band clear on every beat: y 930-1040 on Instagram, y 590-700 on LinkedIn.

## Step 4: The post that goes with it (paste into Claude Code)

```
Write the LinkedIn post for reel-linkedin.mp4 from transcript.json.
Line 1-2: the hook, the plain outcome plus one number. No question.
Then one short line per step, in the order they happen in the video.
Then every link the video mentions, one per line.
No "comment below for the link". Under 1,300 characters.
```

## Step 5: Check

Run `reel-check` with `--linkedin`. It expects 1080 x 1350, -12 LUFS and captions on every spoken second.

## What I learned the hard way

- **Frame 0 is the thumbnail.** If it is a blank face with no words, the video looks like a talking head and people scroll.
- **A comment gate reads as bait on LinkedIn.** The links go in the post.
- **Do not crop the 9:16 file to 4:5.** The hook and the face get cut off. Render the 4:5 cut from the same page instead.
