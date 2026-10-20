---
name: real-page-reel
description: Edit a reel that demos a real website or app, the real page fills the top of the frame, one exact highlight box lands on the word you say with the rest of the page greyed, a zoom-through carries into the next page, and your cut-out sits fixed bottom right. Use when someone says "show the website in my reel", "screen recording reel", "demo an app in a reel", "highlight the page", "real page edit" or "B-roll of a website".
---

# Real page reel

When the reel is about a real site or app, show the real thing. Not a drawing of it.

**Before you start:** run `reel-intake` and `text-hook`.

## Step 1: Ask for three things, then wait

1. **The pages,** one per spoken line, as full-size screenshots (or let Claude capture them). True ratio, never stretched.
2. **The word on each page** you want the highlight to land on.
3. **A cut-out of you** (a person matte of the cut take), or say "face card" for a plain split.

## The look that worked

- **The real page fills the top.** Still, no scrolling. A small card floating in white space looks basic.
- **Your cut-out fixed bottom right.** You do not move around between shots.
- **One fixed caption line** at the same height on every shot.
- **A new page on the key word, about every 2 seconds.** 1-1.5s felt too fast.
- **Faithful clones** of real UI when you need to rebuild it, in its real colours. Never an invented title card.
- **No labels or pills nobody asked for.**

## Highlights

- **One highlight per shot.** Measure the box off the image pixels so it covers the word exactly. Trim to the letter ink and pad 3px left and right. The next letter and the full stop stay grey.
- **Grey out the rest of the page** (about 55% white over it), with the box as a clear window.
- **No underlines, no double highlights, no scrolling.**

## Moving between pages

- **No hard cuts between two pages.** Zoom about 0.3s into the thing being pointed at, then the next page settles in from 1.14x. See `zoom-through-cut`.
- **A magnifier lens** on a key word, then zoom through the lens, works for the one big reveal.
- **Logo moment:** the product card shrinks into its logo, then its features orbit out on a tilted ring that slows down.

## Step 2: Build brief (paste into Claude Code)

```
Edit reel.js only. One beat per page, in my order, starting on the word I gave for each.
Each page: the real screenshot fills x 0-1080 from y 0, height:auto, no stretch, no scroll. My cut-out is fixed bottom right (900px tall, right edge at x 1080) on every page beat.
Highlight: measure the box around [WORD] from the image itself, trim to the ink, pad 3px x and 5px y. Grey the rest of the page with rgba(255,255,255,.55), keep the box clear, and give it a 3px #0071e3 outline. It appears on the word, 0.15s fade.
Between pages: zoom 0.3s into the highlight (scale to 1.6 around its centre, blur 0 to 6px), then the next page settles from 1.14x to 1 in 0.35s with easeOut.
Never invent a page, a number or a logo.
Then crop each highlight from a still and check it covers the word and nothing else.
```

## Step 3: Check

- Is every highlight exactly on its word, checked from a still crop?
- Does every page change land on its word?
- Run `reel-check`.

## What I learned the hard way

- **A stretched screenshot makes the highlight miss its words.** Keep true ratio.
- **Change one thing per note.** Swapping a whole shot when one element was wrong cost a full round.
- **Person mattes leave holes** (a mic, a dark shirt, the chair edge). Fill holes that do not touch the frame edge from the original frame.
