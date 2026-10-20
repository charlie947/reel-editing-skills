---
name: reel-intake
description: Turn a raw talking-head recording into a clean, cut take with word timings, face frames and a ready reel folder that every other editing skill in this pack builds on. Checks the file, transcribes it word by word, cuts the pauses on true silence only, and copies in the reel starter page. Use when someone says "edit my reel", "I recorded a video", "cut my talking head", "start a reel", "remove the pauses", or drops a phone recording.
---

# Reel intake: from raw take to a reel folder

Every edit in this pack starts here. You end with one folder that holds a cut take, its word timings, one face frame per video frame and the starter page.

## Step 1: Ask for three things, then wait

1. **The recording.** The raw phone or camera file. Vertical is best.
2. **The script,** if there is one. The recording still wins: captions follow what was said.
3. **The look.** Brand hex codes and a font. Default: white, ink `#1d1d1f`, one accent `#0071e3`, SF Pro or Inter.

## Step 2: Check the file before you touch it

```
ffprobe -v error -show_entries stream=index,codec_type,codec_name,width,height,start_time:stream_side_data=rotation -of compact raw.mov
```

- A rotation tag means the picture needs turning. Bake it in on the first encode.
- Two audio streams (iPhone spatial audio) means you map only the first: `-map 0:a:0`.
- Audio that starts more than 0.02s after the picture will drift. Fix it with `-itsoffset` now.

## Step 3: Transcribe with word timings

Free and local with Whisper:

```
ffmpeg -y -i raw.mov -map 0:a:0 -ac 1 -ar 16000 audio.wav
pip install openai-whisper   # once
whisper audio.wav --model small.en --word_timestamps True --output_format json
```

## Step 4: Pick the takes, then cut on silence only

- Read the whole transcript. A re-recorded line near the end beats the first try. Keep the last complete take of each line.
- A take rejected out loud ("scratch that", "let me start again") goes. Coughs go. Laughter stays.
- Cut every pause down to 0.15-0.2s. No silence over 0.25s survives, except one planned beat before a reveal.
- Cut only where the sound is truly silent. Check the tail of each word: an "s" can hiss 0.3s past where the transcript says the word ends.
- Give every audio join a 30ms fade each side so nothing clicks. One fixed gain, never a normaliser.
- Then read the kept words end to end. Nothing said twice, nothing that points at something the viewer has not heard yet.

Write the kept spans as `segments.json` (`[[start, end], ...]` in raw seconds) and build the cut with ffmpeg `trim`/`atrim` and `concat`.

## Step 5: Transcribe the CUT audio again

Run Step 3 on `cut-audio.wav`. Captions and every word-timed move use these timings. Raw timings drift after each cut.

## Step 6: Set up the reel folder

```
cp -R <this skill>/starter my-reel
ffmpeg -i cut.mp4 -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 3 my-reel/face/%06d.jpg
```

Then write `my-reel/words.js` from the cut transcript (`{ w, s, e }` per word) and set `duration` and `faceFrames` in `my-reel/reel.js`.

Open `my-reel/index.html?render&t=3` in Chrome to see any frame. Open it without `?render` and click to play it with sound.

## How the starter works

- `index.html` is the engine. Never edit it. It draws any moment from `seek(t)` alone, so every frame renders the same way every time.
- `reel.js` is the edit. Three layouts per beat: `face` (full face), `split` (one object on top, face card below), `full` (graphic only).
- Captions sit in one white pill at y 962 on every beat. Keep y 930-1040 clear of anything else.
- `render.mjs` shoots every frame and encodes an Instagram-ready MP4 (`npm i puppeteer`, then `node render.mjs`).

## What I learned the hard way

- **The recording is the source of truth,** not the script. People change lines on camera. Build captions and on-screen words from the cut transcript.
- **Ending a scene mid-word is the cut people hear first.** End each beat about 0.1s after its phrase ends.
- **Never trust a transcript at a join.** Listen to every one.
