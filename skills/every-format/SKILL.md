---
name: every-format
description: Render one finished video in every size a business posts, 9:16 for Instagram Reels, TikTok and YouTube Shorts, 4:5 for LinkedIn and feeds, 1:1 for ads and X, 16:9 for YouTube, a website or a sales email, from the same build with no re-edit, each size keeping the hook, the caption line and the face in frame, plus the platform rules that change with it (captions, loudness, the ending). Use when someone says "make a LinkedIn version", "resize this video", "16:9 for YouTube", "square for ads", "every platform", "4:5 cut" or "repurpose this video".
---

# Every format

One build, four sizes. The same `video.js` renders every size. You never edit the beats again.

## Step 1: Render the sizes you need

```
node render.mjs --stills 0.5,3,6 --format linkedin     # check three frames first
node render.mjs --format linkedin                      # -> video-linkedin.mp4
node render.mjs --format square                        # -> video-square.mp4
node render.mjs --format wide                          # -> video-wide.mp4
node render.mjs                                        # 9:16 -> video.mp4
```

To look at one frame in the browser, open `index.html?render&f=wide&t=3`.

## Step 2: Which size goes where

| Size | `--format` | Post it on | Layout on a split beat |
|---|---|---|---|
| 9:16, 1080 x 1920 | (none) | Instagram Reels, TikTok, YouTube Shorts | motion top, face card below |
| 4:5, 1080 x 1350 | `linkedin` | LinkedIn, Instagram and Facebook feeds | motion top, face card below |
| 1:1, 1080 x 1080 | `square` | paid social ads, X | motion top, face card below |
| 16:9, 1920 x 1080 | `wide` | YouTube, your website, a sales email, a webinar page | motion left, face card right |

## Step 3: What changes with the platform

| | Instagram, TikTok, Shorts | LinkedIn | Website, sales email, YouTube |
|---|---|---|---|
| Captions | on | always on. Most LinkedIn video plays muted | on. Autoplay on a web page is muted |
| Frame 0 | the hook | the hook. It is also the still people see before it plays | the hook, or a clean title for the thumbnail |
| Loudness | -14 LUFS | -12 LUFS | -14 LUFS |
| The ending | comment keyword | no comment gate. Links go in the post text | one button: book a call, start a trial, reply |

Run `video-sound` once per loudness and `call-to-action` once per ending.

## Step 4: Size objects from PANEL

The starter sets `PANEL` before `video.js` loads. Size every object from it, so one beat fits every size:

```js
html: `<div style="top:${PANEL.split * 0.14}px;height:${PANEL.split * 0.68}px">...</div>`
```

| | 9:16 | 4:5 | 1:1 | 16:9 |
|---|---|---|---|---|
| `PANEL.w` | 1080 | 1080 | 1080 | 1200 |
| `PANEL.split` | 1000 | 620 | 500 | 1080 |
| `PANEL.full` | 1920 | 1350 | 1080 | 1080 |

Keep the caption band clear: y 930-1040 (9:16), y 590-700 (4:5), y 470-560 (1:1), y 930-1040 under the motion panel (16:9).

## Step 5: The post text (paste into Claude Code)

```
Write the post for video-linkedin.mp4 from transcript.json.
Line 1-2: the hook, the plain outcome plus one number. No question.
Then one short line per step, in the order they happen in the video.
Then every link the video mentions, one per line. Under 1,300 characters.
```

## Step 6: Check

Run `video-check` on each file. It reads the size from the file and applies that platform's rules.

## What I learned the hard way

- **Never crop the 9:16 file to make the others.** The hook and the face get cut off. Render each size from the page.
- **Frame 0 is the thumbnail everywhere.** A blank face with no words looks like a talking head and people scroll.
- **A comment gate reads as bait on LinkedIn.** The links go in the post.
