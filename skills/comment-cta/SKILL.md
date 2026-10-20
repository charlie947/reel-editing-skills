---
name: comment-cta
description: Build the comment-keyword call to action for the end of a reel, a clean copy of the Instagram comment box types the keyword, then the reply DM card with the link slides up, over the last 2-3 seconds, plus the checks that the keyword delivery is live before posting. Use when someone says "comment CTA", "comment to get", "keyword call to action", "end card", "comment X and I'll send you" or "ManyChat reel ending".
---

# Comment CTA

The ending that turns views into comments. It sits over the last 2-3 seconds. It never adds extra seconds.

**On LinkedIn, skip this skill.** A comment-for-the-link ask reads as bait there. The `linkedin-cut` ends on the payoff and the links go in the post text.

## Step 1: Ask for three things, then wait

1. **The keyword,** 4 or 5 letters, one word. Short words get typed. Long ones get skipped.
2. **What it sends,** in plain words ("the 16 skills", "the free guide").
3. **The delivery tool** (ManyChat or similar) and whether the flow is live yet.

## The look

- **A clean copy of the native Instagram comment box,** centred. Your avatar circle, "Add a comment…", the keyword typing in at about 8 characters a second.
- **Then the reply:** a DM bubble ("Here you go") and a link card under it, with clear space between the two.
- **It slides up into the last frame,** over the payoff. The payoff stays visible behind it.
- **Holds to the very last frame.**
- **Spoken line to match:** "Comment [KEYWORD] and I'll send you [the thing]."

## Step 2: Build brief (paste into Claude Code)

```
Over the last [2.5]s of reel.js, add the comment CTA on top of the last beat. Do not cut away from the last beat.
A white comment sheet rises from the bottom to y 1060 (36px top corners, soft shadow): a 64px avatar circle, the field "Add a comment…" in grey 40px, then "[KEYWORD]" types in at 8 characters a second in #1d1d1f.
0.6s after the last letter, the field clears and a DM bubble "Here you go" (white, 28px corners) appears at y 760, then 0.3s later a link card "[WHAT IT SENDS]" with a 120px thumbnail under it, 40px gap between them.
Everything holds to the last frame. Nothing below y 1500 is text.
```

## Step 3: Before you post

- **The keyword flow is live and tested.** Comment the keyword yourself from another account and check the DM arrives.
- **The thing it sends exists** and matches what the reel promised, word for word.
- **The caption repeats the keyword** in its first lines.

## What I learned the hard way

- **A custom-styled box looks cheap.** A faithful copy of the native comment UI looks premium.
- **Never add seconds for the CTA.** Put it over the ending.
- **An unsaved automation is a lost automation.** Duplicate a live flow, edit it, set it live, and read it back.
