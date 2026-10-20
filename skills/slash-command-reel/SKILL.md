---
name: slash-command-reel
description: Build a fast montage reel that shows off a pack of slash commands or skills, a clean white prompt bar types each command, the autocomplete menu shows its one-line description, Enter, and the result plays and fills the screen, one command every 2 seconds, ending on a grid of every command and a comment keyword. Use when someone says "slash command reel", "show my skills in a reel", "skill pack promo", "prompt bar reel", "show what each command makes" or "giveaway reel for my pack".
---

# Slash command reel

Show a pack of commands the fastest way possible: type it, see what it makes, next. No talking needed.

**Before you start:** each command needs a real result to show (a clip or a still). Collect them first. A command with nothing to show stays out of the montage and goes on the end grid only.

## Step 1: Ask for four things, then wait

1. **The commands,** in order, each with a one-line description (under 50 characters).
2. **One real result per command:** a 2-3 second clip or a still. Your own work only.
3. **The comment keyword,** 4 or 5 letters, and what it sends.
4. **The text hook,** two lines (see `text-hook`).

## The format

| Time | On screen |
|---|---|
| 0-1.8s | Text hook, big, two lines. The prompt bar sits under it, cursor blinking |
| Every 2.2s | `/` typed, the menu opens with the command and its description highlighted, Enter, the result plays inside the bubble, then fills the frame for about 1s |
| Last 4s | The keyword typed into the bar. A grid of every command zooms out. "Comment KEYWORD" holds to the last frame |

- **8 to 9 commands in the montage** keeps it near 25 seconds. The rest go on the end grid.
- **Lead with the commands people want most.** The strongest result goes second, right after the hook.
- **Music only.** No voice needed. Every word on screen must read with the sound off.

## The prompt bar (the restyle)

A clean white composer, not a dark phone app:
- White page, the bar centred at y 1320, 960px wide, 36px corners, hairline border, soft long shadow.
- Placeholder text in grey. Typed text `#1d1d1f`, 46px, monospace for the command.
- The menu rises above the bar: white card, 28px corners, each row a command in monospace and its description in grey. The chosen row has a pale accent fill.
- The send button is a filled circle in your accent colour (`#0071e3` default). It presses down on Enter.
- Use a product's real logo only if the reel is about that product. Never a lookalike icon.

## Step 2: Build brief (paste into Claude Code)

```
Build one HTML file, index.html, 1080x1920, with window.seek(seconds) that draws any frame from time alone, and ?render to wait for seek.
White #ffffff page, text #1d1d1f, accent #0071e3, SF Pro or Inter.
0-1.8s: my two-line hook at 96px, centred at y 520. Under it, the prompt bar (y 1320, 960px wide, 36px corners, hairline, soft long shadow) with a blinking cursor.
Then for each command in my list, a 2.2s cycle:
  0.0-0.5s type "/" then the command at 16 characters a second, monospace 46px.
  0.2s after "/", a menu card rises above the bar showing 4 rows: the command (highlighted with a pale #0071e3 fill) and 3 neighbours, each with its grey description.
  0.6s Enter: the send button presses, the menu closes, a result bubble grows above the bar playing my clip for that command.
  1.2-2.2s the bubble scales up to fill the frame (snap in, settle), then shrinks back as the next "/" is typed.
Last 4s: type "[KEYWORD]", then a grid of every command card zooms out, and "Comment [KEYWORD]" sits in a white pill at y 962 to the last frame.
Results come only from my files: clips/<command>.mp4 or .jpg. Never draw a fake result.
Check stills at the moment each result fills the frame and at the last frame.
```

For clips inside a seek page, pull frames first (`ffmpeg -i clip.mp4 -vf fps=30 -q:v 3 clips/<command>/%06d.jpg`) and pick the frame from time, so the render is frame exact.

## Step 3: Check

- Can someone read every command and its description in the 2.2s it is up?
- Is every result real and made with that command?
- Run `reel-check`. Set up the keyword delivery before you post (see `comment-cta`).

## What I learned the hard way

- **The comment gate drives this format.** On the best reels in this style, comments outnumber likes.
- **Each result needs under 2 seconds to make sense.** Pick the moment that shows the payoff, not the build-up.
