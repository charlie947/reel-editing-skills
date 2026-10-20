---
name: reel-check
description: Check a finished reel before it goes up, file format (H.264, limited colour range, 1080 x 1920), frame count, the hook on frame 0, captions and text inside the Instagram safe zone, no flash shots, every word on screen held long enough to read, no cut mid-word, loudness and a steady music bed, and a 1-frame-a-second contact sheet to look at with your own eyes. Use when someone says "check my reel", "is this ready to post", "QA the video", "safe zone check", "why does my reel look washed out" or before any reel is posted.
---

# Reel check

Run this on every finished file. It catches the faults people spot in the first three seconds.

## Step 1: The file

```
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,pix_fmt,color_range,nb_frames,r_frame_rate -show_entries format=duration -of default=nw=1 reel.mp4
```

Pass: `h264`, `1080` x `1920` (LinkedIn cut: `1080` x `1350`, file `reel-linkedin.mp4`), `yuv420p`, `color_range=tv`. Frames = duration x fps. A truncated render looks fine on frame 1. If you see `hevc` or `color_range=pc`, export again:

```
ffmpeg -i reel.mp4 -c:v libx264 -profile:v high -crf 18 -pix_fmt yuv420p -vf "scale=1080:1920:out_range=tv,format=yuv420p" -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:a aac -b:a 192k -movflags +faststart reel-ig.mp4
```

## Step 2: Look at it, the whole thing

```
mkdir -p qa && ffmpeg -i reel.mp4 -vf "fps=1,scale=216:384,tile=10x6" qa/sheet.jpg
ffmpeg -i reel.mp4 -t 3 -vf "fps=4,scale=270:480,tile=12x1" qa/open.jpg
```

Open both and read every tile. Then watch it once at full size with sound.

## Step 3: The checklist

| | Check | Pass |
|---|---|---|
| 1 | Hook | Readable text on frame 0. Two lines. No full stop |
| 2 | Motion from second 1 | No run of plain talking head at the open |
| 3 | Safe zone | No text in the top 220px, below y 1500, or right of x 950 between y 1000 and 1800 |
| 4 | Captions | One style, one height, on every beat. Never on the chin, never at the bottom |
| 5 | Reading time | Every on-screen line held at least 1.5s after it is sharp |
| 6 | No flash shots | No shot under 0.3s, never more than 3 cuts in a second |
| 7 | Cuts | No scene change mid-word. Listen to every join |
| 8 | Fill | No beat with a small object in a mostly empty panel |
| 9 | Truth | Every number, logo and screenshot is real and current |
| 10 | Layout | The scene changes every 3-5 seconds |
| 11 | Sound | About -14 LUFS, true peak -1.5 or lower, music steady to the last frame |
| 12 | Ending | The call to action holds to the last frame, keyword flow live |

Any fail: fix it and check again from Step 1.

**LinkedIn cut:** lines 3, 11 and 12 change. Safe zone: keep the caption band y 590-700 clear of objects. Sound: about -12 LUFS. Ending: no comment ask, the links go in the post text. Add one line: frame 0 reads as a still with the sound off.

## Step 4: Draw the safe zone

```
Take the frame at [TIME] from reel.mp4. Draw red boxes over y 0-220, y 1500-1920 and x 950-1080 between y 1000 and 1800. Show me any text inside a red box.
```

## What I learned the hard way

- **A phone recording is HEVC and full range.** Uploaded as is, it washes out. Always export H.264 limited range, including after the last edit.
- **The music dies in the last 8 seconds more than anywhere.** Listen there twice.
- **A check that never fails is not checking.** Test it once on a reel you know is broken.
