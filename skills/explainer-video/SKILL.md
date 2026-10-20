---
name: explainer-video
description: Edit a talking-head video in a clean Apple-style motion look, white canvas, one accent colour, one evolving object per beat that changes on the spoken word, switching between full face, split screen and full graphic every 3-5 seconds, with blur-in captions. The style behind my best-performing motion reel. For how your product works, a process, a framework, onboarding. Use when someone says "Apple style video", "premium motion edit", "clean motion graphics video", "edit my video like Apple", "white motion edit" or "motion graphics over my talking head".
---

# Explainer video

**Use it for:** how your product works, a process, a framework, onboarding.

This is the edit style of my best motion reel: 25,998 plays, about 11x my normal. A white canvas, one accent colour, and one object per beat that changes exactly when you say the word.

**Before you start:** run `video-intake` (cut take, `words.js`, face frames, starter). Run `opening-hook` for the first 2 seconds.

**Every size.** The same build makes 9:16, 4:5, 1:1 and 16:9. Size objects from `PANEL`, then run `every-format`.

## Step 1: Ask for three things, then wait

1. **The cut transcript** with word timings (from `video-intake`).
2. **The beats.** Split the script into ideas of 3-5 seconds. One idea, one object.
3. **The real assets.** Logos, app icons and screenshots the script names. Attached files only, 512px or bigger.

## The look

- White canvas. Text `#1d1d1f`. One accent, `#0071e3` by default. One accent only.
- SF Pro or Inter. Big words at weight 700-800 with tight tracking.
- White cards: 44px corners, a hairline edge, a soft long shadow.
- Captions: one line in a white pill at y 962, weight 650, about 52px. Each word fades in from a 7px blur as it is spoken.
- No orange or bright colours except a brand's real logo.

## The grammar

| Layout | When | What fills it |
|---|---|---|
| Full face | The open and the call to action | You, with the text hook from frame 0 |
| Split | Most beats | One object fills the top panel (x 74-1006, y 170-880), your face card below |
| Full graphic | About 40% of the video | One designed object fills the frame, no face |

- **Switch layout every 3-5 seconds.** One scene for the whole video reads as static.
- **One object per beat, and it changes ON its word.** "Three steps" = the third step lands on "three". Stretch the beat's own clock so the last change hits the word.
- **The object carries across the cut.** It swings away as the next one rises. Never cut to an empty frame.
- **Hold any on-screen line 1.5s** after its words are sharp. 0.8s is too fast to read.
- **No zoom or push-in** while a shot is on screen.
- **Words and objects sit above your head,** never behind it.

## Step 2: Write the beat sheet, then wait

One row per beat: start, end, layout, the spoken words, the object, and the word it changes on. Show it and wait for a yes. Then build the first 10 seconds and show stills before the rest.

## Step 3: Build brief (paste into Claude Code inside the video folder)

```
Edit video.js only. Follow my beat sheet exactly, with its times from words.js.
Look: white #ffffff, text #1d1d1f, one accent #0071e3, SF Pro or Inter. White cards with 44px corners and a soft long shadow.
Each beat draws ONE object that fills its panel and changes on the word I named. Use spring() and easeOut() from the starter. No linear moves, no bounce on text.
Split beats: object inside x 74-1006, y 170-880. Full beats: object fills the frame but keeps y 930-1040 clear for the caption.
The outgoing object swings away while the next one rises. No empty frames. No zoom while a shot is on screen.
Use only my attached logos and screenshots. Never invent a number, a logo or a result.
After the build, open index.html?render&t=<mid-point of every beat> and check: object fills its panel, nothing over the caption, nothing below y 1500, nothing right of x 950 between y 1000 and 1700.
```

## Step 4: Render and check

`node render.mjs --stills <times>` for a quick look, then `node render.mjs` for the video. Run `video-check` before you post.

## What I learned the hard way

- **Small objects in a big panel look cheap.** Every beat called "not premium" measured at about a third of its panel. Make it fill.
- **Blue key words and outlined captions look cheap too.** Plain near-black words in a white pill read as premium.
- **Ticks and badges sit inside their card,** never on a clipped corner.
- **A "checks its own work" beat shows different designs,** never one design repeated.
