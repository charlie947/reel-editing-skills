---
name: news-reaction
description: Edit a news or reaction video over real footage, one continuous run of footage per spoken line, played in source order, timed so the action lands on the word, with press headlines highlighted exactly on the ink and a music bed at one steady level. For industry news, market updates, commentary on a launch. Use when someone says "news video", "react to this launch", "put the footage behind me", "B-roll from the announcement", "footage edit" or has a real event clip to cover.
---

# News reaction video

**Use it for:** industry news, market updates, commentary on a launch.

For a real event with real footage. The footage tells the story, so the rules are about keeping it clean.

**Before you start:** run `video-intake` and `opening-hook` (look A, launch title, for news).

**Every size.** The same build makes 9:16, 4:5, 1:1 and 16:9. Size objects from `PANEL`, then run `every-format`.

## Step 1: Ask for three things, then wait

1. **The footage,** the original files you have the right to use. Note the source of each.
2. **The press shots,** if any: screenshots of real headlines.
3. **The cut transcript** with word timings.

## The rules that held up

- **One continuous run per spoken line.** Pick one stretch of one clip and play it straight. No hopping between moments of the same clip.
- **In source order.** Line 2's footage comes after line 1's in the original.
- **The action lands on the word.** "Let go" = the release. "Wheels" = the landing. Slide the run's start so the moment hits the word.
- **When the clip turns to something off topic** (a presenter, its own transition), hold its last useful frame instead.
- **Hard cuts between runs.** Static frame, no zooms, no effects. The footage is the effect.
- **Press headlines get a highlight on the ink,** never retyped. Trim the box to the letters, pad 3px.
- **Footage fills the top panel or the full frame.** Your face card or cut-out stays below it.

## Step 2: Build the shot list, then wait

One row per line: spoken words, start and end, clip file, the clip's in point, and the word the action lands on. Show it and wait for a yes.

## Step 3: Pull frames and build

```
ffmpeg -ss <in> -t <length> -i clip.mp4 -vf "fps=30,scale=1080:-2" -q:v 3 shots/03/%06d.jpg
```

Paste into Claude Code:

```
Edit video.js only. One beat per row of my shot list. Each beat shows shots/NN/ frames in order, frame = round((t - beat start) * 30) + 1, held on its last frame if the line runs longer.
Layout split: footage fills the top panel, my face card below. Hard cut between beats, no zoom, no transition.
Press shots: the screenshot fills the top panel, with one highlight box trimmed to the ink of [WORD], the rest greyed at rgba(255,255,255,.55).
Check a still at the landing word of every beat: the action must be on screen at that moment.
```

## Step 4: Music, then check

Run `video-sound` (one bed level to the last frame). Then `video-check`.

## What I learned the hard way

- **Cutting between three moments of one clip looks messy.** One clean run per line looks intentional.
- **A music take that fades early leaves the end of the video flat.** Cut it before its own fade and loop whole phrases.
- **Credit and rights matter more here than anywhere.** Use footage you are allowed to use.
