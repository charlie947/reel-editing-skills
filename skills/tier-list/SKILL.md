---
name: tier-list
description: Edit a ranking video as an S to F tier list. The board fills the top of the frame, each item flies out from the speaker's head and drops into its row exactly on the word they say it, the tier label pulses as it lands, and the speaker's head breaks out of the top of the face card below. For rankings, "best to worst", tool or tactic comparisons, hot takes. Use when someone says "tier list", "rank these", "S tier", "best to worst video", "ranking video" or "put them in tiers".
---

# Tier list

**Use it for:** rankings, best to worst, tool or tactic comparisons, hot takes.

A ranking you can see fill up as you talk. Every item lands in its row on the word, so the viewer waits for the next one.

**Before you start:** run `video-intake` and `opening-hook`. This adds one beat type to the starter's `video.js`. It is built for 9:16. For the 4:5, 1:1 and 16:9 cuts from `every-format`, put the board in a full beat and drop the break-out.

## What you need

1. **The cut take, `face/` frames and `words.js`** from `video-intake`.
2. **The list.** Each item as it should read on its chip (2 words is best, 3 at most), its tier, and the word you say it on.
3. **A title** for the board, optional, under 30 characters.
4. **A cut-out of you for this beat.** `scripts/matte.py` in this skill makes it with RobustVideoMatting, free and local. No other skill in the pack ships a matting tool, so this is the one to use.

```
pip install torch torchvision pillow numpy scipy     # once. scipy is optional, it fills small holes
python3 <this skill>/scripts/matte.py my-video --from 3.1 --to 12.8
```

It reads `my-video/face/`, writes `my-video/cut/000094.webp` and on, with the same frame numbers, and prints `headTop`, the top of your head in frame pixels. The model downloads once from GitHub. It runs on Apple Silicon, an NVIDIA card or the CPU. Matte only the beat. Cut-outs of a whole video fill a disk.

## Step 1: Ask for the inputs above, then wait

The ranking is yours. Never move an item to another tier for a better look.

## Step 2: Beat sheet, then wait

One line per item: chip text, tier, the word and its time from `words.js`. Items must land at least 0.5s apart. Show it and get a yes.

## Step 3: Build brief (paste into Claude Code)

```
Copy <this skill>/templates/tier-list.js to the very top of my-video/video.js, above window.VIDEO. Do not edit index.html.
Add one beat to VIDEO.beats:
  tierList({ start: [S], end: [E], title: '[TITLE]', headTop: [headTop from matte.py],
             items: [ { text: '[CHIP]', tier: 'S', word: '[WORD]' }, ... ] })
Keep the items in the order I say them. Use tiers: ['S','A','B','C','D','F'] unless I give others.
Every value comes from time alone inside draw(), so seek(t) gives the same frame every time.
Then render stills 0.2s before the first item's word, on it, halfway through the list, and on the last item's word. Show them to me.
```

The template draws a white board with one row per tier (S in the accent, stepping down to grey for F), a face card in the same place as the starter's split card, and your cut-out over the card with the same crop, open at the top. Your head is the only part that rises above the card.

## The timing rule

Every chip lands on its word from `words.js`.

- **Each chip** leaves your head 0.45s before its word, arcs up and lands in its row on the word.
- **The tier label** pulses for 0.35s from the word.
- **The word lookup** starts after the item before, so a word you say twice lands the right chip.
- **The board** fades in over the first 0.3s of the beat, the title rises in over 0.45s.

## Step 4: Render

```
cd my-video
node render.mjs --stills 4.0,6.5,9.0      # check first
node render.mjs                            # then the full video
```

Then run `video-check`.

## Check before you show

- **The break-out.** About 130px of your head rises above the card on every still. If nothing breaks out, your `headTop` is wrong. Run matte.py again and use the number it prints, or set `cropY`.
- **Edges.** Crop the hair at full size. No room halo above the card, no hard line across the top of the head.
- **The caption pill** sits over the seam, as on every split beat. It must cover hair, never your eyes. If it does, lower `headTop` by 30 and check again.
- **Landing.** On the still at each word, that chip is in its row. 0.2s before, it is still in the air.
- **Rows.** No chip spills off its row. A full row shrinks its chips to fit. If text gets small, shorten the chips.
- **Spacing.** No two chips land within 0.5s of each other.
- **Safe zone.** No text in the top 220px. The title sits at y 230 and the board ends at y 850.
- **Truth.** The ranking is the one you gave. No item you did not say.
- **No logos** on the chips. Words only.

## What I learned the hard way

- **A centred crop puts the top of your head right at the card edge,** so nothing breaks out. Crop from your measured head top instead.
- **Draw the cut-out with the exact same crop as the card.** Scale it differently and you get two of you at the card edge.
- **Six rows of chips at 25px read as small.** Chip text is about 32px at six rows. Fewer rows get bigger.
