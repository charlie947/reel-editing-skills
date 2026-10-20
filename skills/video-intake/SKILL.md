---
name: video-intake
description: Turn a raw talking-head recording into a clean, cut take with word timings, face frames and a ready video folder that every other editing skill in this pack builds on. Checks the file, transcribes it word by word, cuts the pauses on true silence only, and copies in the video starter page. Use when someone says "edit my video", "I recorded a video", "cut my talking head", "start a video", "remove the pauses", or drops a phone recording.
---

# Video intake: from raw take to a video folder

Every edit in this pack starts here. You end with one folder that holds a cut take, its word timings, one face frame per video frame and the starter page.

## Step 1: Ask for three things, then wait

1. **The recording.** The raw phone or camera file. Vertical is best.
2. **The script,** if there is one. The recording still wins: captions follow what was said.
3. **The look.** Brand hex codes and a font. Default: white, ink `#1d1d1f`, one accent `#0071e3`, SF Pro or Inter.

## Step 2: Check the file before you touch it

```
ffprobe -v error -show_streams raw.mov | grep -E "codec_type|codec_name|width|height|start_time|rotat"
```

- A rotation tag means the picture needs turning. Bake it in on the first encode.
- Two audio streams (iPhone spatial audio) means you map only the first: `-map 0:a:0`.
- Audio that starts more than 0.02s after the picture will drift. Fix it with `-itsoffset` now.
- Width bigger than height and no rotation tag means a landscape file. Step 6 crops the middle out of it. Shoot one frame through that crop first and look at it, so the head sits in frame.

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
- Cut only where the sound is truly silent. Never cut on the transcript's word times: Whisper stretches words across pauses. Find the real silences on the audio:

```
ffmpeg -i audio.wav -af silencedetect=noise=-50dB:d=0.2 -f null - 2>&1 | grep silence_
```

  If that finds nothing, raise the threshold (try -45dB). If it finds silence inside words, lower it. Check the tail of each word: an "s" can hiss 0.3s past where the transcript says the word ends.
- A filler word with no silence around it ("I'm, right, so") stays. You cannot cut it cleanly.
- Snap every cut edge to the frame grid (a whole number of 1/30s) before you trim. Float edges drift the lips by a few frames over a minute.
- Give every audio join a 30ms fade each side so nothing clicks. One fixed gain, never a normaliser.
Write the kept spans as `my-video/segments.json` (`[[start, end], ...]` in raw seconds) and build the cut with ffmpeg `trim`/`atrim` and `concat`. Save the cut audio as `my-video/cut-audio.wav`: the starter plays that file.

## Step 5: Transcribe the CUT audio again

Run Step 3 on `cut-audio.wav`. Captions and every word-timed move use these timings. Raw timings drift after each cut.

Now read the kept words end to end. Nothing said twice, nothing that points at something the viewer has not heard yet. Whisper often merges a repeated line into one long word on the raw take, so a double only shows up here. Found one? Go back to Step 4, cut it, and run this step again until the text reads once.

Then fix the words Whisper got wrong by hand (names, product names, the comment keyword) and drop any zero-length word at the very end. Viewers read every caption.

## Step 6: Set up the video folder

```
mkdir -p my-video && cp -R <this skill>/starter/. my-video/
ffmpeg -i cut.mp4 -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -q:v 3 my-video/face/%06d.jpg
```

Then write `my-video/words.js` from the cut transcript (`{ w, s, e }` per word) and set `duration` and `faceFrames` in `my-video/video.js`. `faceFrames` must equal the number of jpgs in `face/`. If it is off by more than one, your cut edges were not on the frame grid.

The starter ships with demo beats and a demo hook. Replace them now: one `face` beat from 0 to the end, and your own hook lines (or `hookEnd: 0` for none). Otherwise a demo card plays over your take.

Open `my-video/index.html?render&t=3` in Chrome to see any frame. Open it without `?render` and click to play it with sound.

## How the starter works

- `index.html` is the engine. Never edit it. It draws any moment from `seek(t)` alone, so every frame renders the same way every time.
- `video.js` is the edit. Three layouts per beat: `face` (full face), `split` (one object on top, face card below), `full` (graphic only).
- Captions sit in one white pill at y 962 on every beat. Keep y 930-1040 clear of anything else. Captions stay hidden while the hook shows (`t < hookEnd`). A time past the last beat shows the last beat.
- The engine already defines `clamp`, `prog`, `easeOut`, `spring`, `wordAt`, `$` and `pad`. Use them, never declare them again: a second `const clamp` in `video.js` stops the whole page with `seek is not defined`. Wrap your own helpers in a function or give them new names.
- `wordAt('every')` gives the first time a word is said. For a later one, pass the time to search from: `wordAt('every', 5)`.
- See any frame as a still before a full render: `node render.mjs --stills 0.5,3,5`.
- To edit one section of a long take, make a section folder: trim `cut-audio.wav` to the section, copy its face frames renumbered from 000001, and shift its words so the section starts at 0.
- `render.mjs` shoots every frame and encodes an MP4 every platform accepts (`npm i puppeteer`, then `node render.mjs`). Add `--format linkedin`, `square` or `wide` for the other sizes.

## What I learned the hard way

- **The recording is the source of truth,** not the script. People change lines on camera. Build captions and on-screen words from the cut transcript.
- **Ending a scene mid-word is the cut people hear first.** End each beat about 0.1s after its phrase ends.
- **Never trust a transcript at a join.** Listen to every one.
