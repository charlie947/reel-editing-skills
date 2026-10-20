---
name: call-clips
description: Turn a long recording you already have, a sales call, a coaching call, a client call, a webinar, a podcast or a long YouTube video, into the 3 to 5 best short clips, ranked, each cut on clean word edges with a two-line hook and word-by-word captions, ready for Reels, TikTok, Shorts and LinkedIn. Picks only moments that stand alone, with a number, a test, a mistake or a paste-able fix. Use when someone says "clip this call", "find the best moments", "turn my webinar into shorts", "podcast clips", "clips from my YouTube video" or drops a long recording.
---

# Call clips: the best moments from a long recording

**Use it for:** sales and coaching calls, client calls, webinars, podcasts, talks, long YouTube videos.

You end with 3 to 5 vertical clips, ranked, and one line on why each one made the cut.

**Tested so far on a solo recording.** On a two-person call, read the speaker turns in the transcript and pick moments where one person talks for 15 seconds or more. Crosstalk and small talk make weak clips.

## Step 1: Ask for two things, then wait

1. **The recording.** Any length. Camera, Zoom, screen recording or a finished video.
2. **Permission.** On a call with other people, only use their words and faces if they said yes. Otherwise clip only your own side.

## Step 2: Transcribe with word timings

```
ffmpeg -y -i long.mp4 -map 0:a:0 -ac 1 -ar 16000 audio.wav
pip install openai-whisper   # once
whisper audio.wav --model small.en --word_timestamps True --output_format json
```

Then print it with times, one line per sentence, so you can read the whole thing:

```
python3 -c "import json;[print(f\"{s['start']:7.1f} {s['text'].strip()}\") for s in json.load(open('audio.json'))['segments']]"
```

## Step 3: Pick the clips (paste into Claude Code)

```
Read the timed transcript. Pick the 3 to 5 best clips for short-form video.
A clip must:
- stand alone. No "as I said", no "this one", nothing that needs the earlier minutes
- open on its strongest line, inside the first 2 seconds
- carry one of these: a hard number, a test with a winner, a mistake and its fix, a step someone can copy
- run 15 to 45 seconds and end on a full stop, never mid-thought
For each clip give: rank, start word and time, end word and time, a two-line hook
(line 1 the outcome, line 2 the promise, no full stop), and one line on why it made the cut.
Rank by how useful it is to a stranger, not by how much you like it.
Write them to clips.json as [{"rank":1,"start":374.40,"end":395.00,"hook":"Line one\\NLine two"}].
```

**Cut on word edges.** Start 0.08s before the first word. End 0.12s after the last word. An "s" can hiss past where the transcript says the word ends, so listen to the last word of every clip.

## Step 4: Make the clips

`make-clips.py` (next to this file) writes word-by-word captions for each clip and runs ffmpeg.

```
python3 make-clips.py long.mp4 audio.json clips.json
```

It picks the layout from the source:

| Source | Layout |
|---|---|
| Landscape (Zoom, a screen, a YouTube video) | The source as a band across the middle, the hook above it, captions under it |
| Vertical (a phone recording) | The source full frame, the hook at the top, captions at the centre line |

Defaults: white canvas, ink `#1d1d1f`, the spoken word in `#0071e3`. Run `brand-setup` first to use your own colours and font.

## Step 5: Check and finish

- Watch every clip with sound, start to end. Cut off a word? Move the edge and run Step 4 again.
- Run `video-check` on each file, then `every-format` for the LinkedIn 4:5 cut.
- On LinkedIn, put the hook in the post's first line and the clip under it. Captions stay on: most LinkedIn video plays muted.

## What I learned the hard way

- **The best moment is rarely the one you remember.** Read the whole transcript. The paste-able fix at minute 6 beats the big claim at minute 1.
- **A clip that needs the set-up is not a clip.** If the first line points back ("so that's why"), start earlier or drop it.
- **One message beats a re-edit.** The clip that won my own test was a 20-second fix, not the intro.
