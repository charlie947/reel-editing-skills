---
name: zoom-through-cut
description: Replace hard cuts between two B-roll shots or two graphic beats with a zoom-through transition, a fast zoom into the thing being pointed at, a short blur, and the next shot settling in from slightly big, plus a magnifier lens version for one big reveal. Use when someone says "better transitions", "zoom transition", "the cuts feel hard", "transition between b-roll", "zoom through" or "magnifier effect".
---

# Zoom-through cut

A hard cut between two pages or two graphics feels like a slideshow. A zoom into the thing you are pointing at feels like one continuous camera.

**Before you start:** this adds to a reel built on the `reel-intake` starter. It goes between two graphic or page beats only.

## The rules

- **Only between two graphic or B-roll beats.** Cuts to and from your face stay hard. A zoom onto a face looks like a mistake.
- **Zoom into the thing being pointed at:** the highlight, the logo, the button. Never the centre of the frame by default.
- **About 0.3s in, 0.35s settle.** Longer feels slow.
- **No white flash.** Scale plus blur reads cleaner.
- **Skip it when the object carries across the cut.** If beat A hands its object to beat B, the carry is the transition.
- **No zoom while a shot is on screen.** The zoom is only the change.

## Step 1: Build brief (paste into Claude Code)

```
Add a zoom-through between beats [A] and [B] in reel.js. Do not edit index.html.
Last 0.3s of beat A: scale the stage around the centre of [the highlight / logo / button] from 1 to 1.8 with easeIn, and blur from 0 to 8px.
First 0.35s of beat B: the new stage starts at scale 1.14 and blur 6px, and settles to 1 and 0px with easeOut.
Work every value out from time alone inside each beat's draw(), so seek(t) gives the same frame every time.
Check stills at the cut minus 0.15s, at the cut, and at the cut plus 0.2s.
```

## Magnifier lens (one big reveal)

```
On beat [A], at the word [WORD], a round lens (260px, white 6px rim, soft shadow) slides over [the word on the page] and shows it at 2x inside.
0.4s later, zoom through the lens: the lens grows to fill the frame and beat B appears inside it.
```

Use it once per reel. Twice and it stops being a reveal.

## Check

Watch the cut at full speed and at quarter speed. At full speed it should feel like one move. At quarter speed nothing should jump.
