---
name: text-hook
description: Build the on-screen text hook for the first 2 seconds of a reel, the line people read with the sound off. Three tested looks (launch title, logo plus box, split reveal), two lines, on screen from frame 0, cut to the edit at about 2.2s. Use when someone says "text hook", "on-screen hook", "title for my reel", "first frame text", "hook overlay" or "my reel needs a hook".
---

# Text hook: the first 2 seconds

The text hook decides whether anyone stays. It is on screen from the very first frame, over your face, and it does most of the talking.

**Before you start:** run `reel-intake` so you have a reel folder. The hook lives in `REEL.hook` and `REEL.hookEnd` in `reel.js`.

## Step 1: Ask for two things, then wait

1. **The two lines,** word for word. Write them at script time, never at edit time.
2. **The reel type.** News or launch, how-to or list, or a curiosity line that pays off.

## Step 2: Pick the look by reel type

| Look | Use it for | What it is |
|---|---|---|
| A. Launch title | News and launches ("X just dropped") | The real logo big above heavy white capitals with a thin black outline |
| B. Logo plus box | How-to, list and step reels | The real logo above a compact white box with black text, above your head |
| C. Split reveal | When line 1 tells nothing and line 2 pays it off | Line 1 alone for 0-1s, line 2 lands at 1.02s |

## The rules that held up

- **Two lines, never three.** Break on meaning, not on width: "Claude can now / clone any website".
- **No full stop at the end.** Line 2 can end on a colon when the reel delivers a list.
- **Never open on "I" or "Most people".** Lead with the outcome or the number.
- **Big.** Around 100-124px for capitals, 72px or more in a box. Readable on a phone at arm's length.
- **The real logo, big,** when the reel is about a product. 200px tall is not too big. Never a lookalike.
- **Your face under it from frame 0.** No intro card, no black frame.
- **Swap lines on a sub-frame boundary** (1.02s, not 1.00s), or motion blur mixes both lines in one frame.
- **Motion from the first second.** If the reel opens on talking, the hook carries a small live element (a key press, a logo drawing itself) so frame 1 already moves.

## Step 3: Build it

Paste into Claude Code inside your reel folder:

```
In reel.js set hook to my two lines: "[LINE 1]" / "[LINE 2]". Use look [A/B/C]. Logo file: [PATH or none].
Keep it on screen from 0s to [2.2]s over the full face, then cut to beat 2.
Look A: heavy capitals, white with a 4px black outline, logo 200px tall centred above.
Look B: the starter's white box, logo 160px above it, both above the head.
Look C: line 1 alone until 1.02s, line 2 lands under it with a quick settle.
Nothing below y 1500 and nothing right of x 950. Then open index.html?render&t=0.1, t=1.1 and t=2.0 and check the hook reads at phone size.
```

## Step 4: Check

- Can a stranger say what the reel is about from frame 1, sound off?
- Two lines, no full stop, no line over about 28 characters?
- Is the logo the real one, in its real colours?
