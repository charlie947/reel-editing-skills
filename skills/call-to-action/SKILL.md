---
name: call-to-action
description: Build the right ending for each place a business posts a video, a comment-keyword ending for Instagram and TikTok (a clean comment box types the keyword, then the DM card with the link), a no-gate ending for LinkedIn with the links in the post, and a one-button end card for a website, a sales email or a YouTube end screen (book a call, start a trial, reply), all over the last 2-3 seconds, never extra seconds, plus the check that the delivery is live before posting. Use when someone says "call to action", "end card", "comment CTA", "comment to get", "book a call ending", "CTA for my video" or "ManyChat ending".
---

# Call to action

The ending decides what a view turns into. It sits over the last 2-3 seconds. It never adds extra seconds.

## Pick the ending by where the video goes

| Where | Ending | Why |
|---|---|---|
| Instagram, TikTok | **A. Comment keyword** (below) | A comment pushes the video and the DM delivers the link |
| LinkedIn | **B. No gate.** End on the payoff. Every link goes in the post text | A comment-for-the-link ask reads as bait there |
| Website, sales email, YouTube end screen, webinar page | **C. One-button end card** | The viewer is already warm. Give one clear next step |

One ending per file. When you render several sizes with `every-format`, give each one its own ending.

# A. Comment keyword

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
Over the last [2.5]s of video.js, add the comment CTA on top of the last beat. Do not cut away from the last beat.
A white comment sheet rises from the bottom to y 1060 (36px top corners, soft shadow): a 64px avatar circle, the field "Add a comment…" in grey 40px, then "[KEYWORD]" types in at 8 characters a second in #1d1d1f.
0.6s after the last letter, the field clears and a DM bubble "Here you go" (white, 28px corners) appears at y 760, then 0.3s later a link card "[WHAT IT SENDS]" with a 120px thumbnail under it, 40px gap between them.
Everything holds to the last frame. Nothing below y 1500 is text.
```

## Step 3: Before you post

- **The keyword flow is live and tested.** Comment the keyword yourself from another account and check the DM arrives.
- **The thing it sends exists** and matches what the video promised, word for word.
- **The caption repeats the keyword** in its first lines.

## What I learned the hard way

- **A custom-styled box looks cheap.** A faithful copy of the native comment UI looks premium.
- **Never add seconds for the CTA.** Put it over the ending.
- **An unsaved automation is a lost automation.** Duplicate a live flow, edit it, set it live, and read it back.

# C. One-button end card

## Ask for two things, then wait

1. **The action,** three words or fewer ("Book a call", "Start free", "Reply 'yes'").
2. **Where it goes,** the real URL or the reply address. Never a placeholder in a finished file.

## Build brief (paste into Claude Code)

```
Over the last [2.5]s of video.js, add an end card on top of the last beat. Do not cut away from the last beat.
A white card rises from the bottom (40px corners, soft long shadow), centred in the motion panel, PANEL.w * 0.7 wide.
Line 1, 56px, brand ink: the promise in five words or fewer ("Get this set up for you").
Line 2: one pill button in the brand accent with white text: "[ACTION]", and the URL under it in grey 32px.
The button settles with a small spring 0.3s after the card. It holds to the very last frame.
Spoken line to match: "[ACTION] at [short URL]."
```

## Check

- The URL is real and loads. Open it once.
- The button text matches the spoken line word for word.
- On a sales email, the thumbnail (frame 0) shows the person's name or company if the email is personal.

