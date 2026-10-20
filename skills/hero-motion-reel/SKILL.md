---
name: hero-motion-reel
description: Edit a reel where every beat is one big 3D hero object that acts out the spoken noun, a staircase for "steps", a clock for "five minutes", a phone arc for "reels", landing exactly on the word, with a real Claude Code window for any demo and the head popping out of the face card. Use when someone says "3D motion reel", "hero object edit", "make my reel feel premium", "bigger animations", "motion that acts out what I say" or "like the Claude edited this video reel".
---

# Hero motion reel

One big 3D object per beat, acting out the noun you say. This is the system behind my "Claude edited this video" reel, which went to my feed and did well.

**Before you start:** run `reel-intake` and `text-hook`. This builds on `apple-motion-reel`'s look (white, one accent, pill captions).

## Step 1: Ask for three things, then wait

1. **The cut transcript** with word timings.
2. **The noun of each beat.** The one word the beat is about.
3. **Real examples to show.** Count every screen you will fill (phones, tiles, covers) and collect that many different real ones. Never the same example twice.

## The grammar

- **One hero per beat that acts out its noun.** "Steps" = a 3D staircase a ball climbs. "Five minutes against an hour" = two clock dials, the hour shatters. "Edit" = a timeline with a playhead that cuts. Not a denser list.
- **It fills the panel:** x 74-1006, y 170-880 on split beats. A third of the panel looks basic.
- **The payoff lands on its word.** Stretch the beat's clock so the last step hits the word, not the cut.
- **Carry the object across the cut.** It swings into depth as the next hero rises in front.
- **The hook IS the animation.** No flat title card if the first hero can carry the hook.
- **Demos use a real Claude Code window,** with the real command typing live. Never a drawn stand-in, and never a command the build did not run.
- **Bad items go grey and lift out.** No strike lines or scribbles.

## The moves that worked

| Move | What it does |
|---|---|
| Slam | Enters from deep in 3D, settles with no overshoot |
| Crash | Falls away into depth with gravity, clear of the caption |
| Phone arc | Three phones in a 3D arc, one swipe per word, a different real reel on each |
| Count-up card | A 128px number counts up on its word, label under it |
| Drop zone | A file falls in with gravity, a waveform rises, bad parts lift out grey |
| Head pop-out | On split beats the head breaks out of the top of the face card (cut-out of the same frame, scale 1.1 at most) |
| Zoom-through | Scale and blur through the cut, only between two graphic beats. Face cuts stay hard |

## Step 2: Beat sheet, then wait

Per beat: time, layout, spoken words, the noun, the hero and the word it lands on. Show it. Build stills of every beat before any render, and get a yes.

## Step 3: Build brief (paste into Claude Code)

```
Edit reel.js only. One hero object per beat from my beat sheet. Build each in 3D with CSS perspective (1400px) and transforms worked out from time alone.
Entrances: slam from translateZ(-900px) with spring(), no overshoot. Exits: crash into depth with gravity.
Every hero fills x 74-1006, y 170-880 on split beats and lands on the word I named. Stretch the beat's own clock so the last change hits that word.
At each cut, carry the hero into the next beat and swing it away while the next hero rises. Never an empty frame.
Demos: draw a real-looking Claude Code terminal (dark window, monospace, the real command I give you typing at 14 characters a second).
Use only my real assets. Never show the same example twice.
Check stills at the landing word of every beat. Fix anything small, cropped or over the caption.
```

## Step 4: Render and check

Render, then run `reel-check`. Compare it side by side with your best previous edit before posting.

## What I learned the hard way

- **Level up the motion inside an approved version.** Swapping concepts after approval made it worse every time.
- **A card that stands for a reel must be a real 9:16 reel frame,** never a wide 16:9 still cropped to fit.
- **Your own work on screen = your newest posts,** in your current style.
- **Pop-out over 1.1 scale feels cramped.** Leave breathing room.
