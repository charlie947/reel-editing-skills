---
name: animate-figures
description: Make every number in a reel move, a big stat that counts up on its spoken word, a time that flips like a clock, a growth line that draws under a count, and a progress ring that fills, each timed to the word and held long enough to read. Use when someone says "count up", "animate the number", "flip clock", "make the stat pop", "animated statistic" or "the numbers are static".
---

# Animate figures

A number on screen should arrive the way you say it. Static figures get skipped.

## Step 1: Ask for two things, then wait

1. **Each figure,** exactly as it should read (`25,998`, `8:00`, `11x`), with its source.
2. **The spoken word** it lands on.

## Pick the move

| Figure | Move |
|---|---|
| A big count (plays, followers, stars) | Counts up from 0 over 0.8s, ends exactly on its word, a label under it |
| A time | Flips like an airport board, each digit rolling, settles on the word |
| Growth | The count runs while a line draws under it from left to right |
| A share or a score | A ring fills to the value, the number in the middle |
| A before and after | The old number greys and lifts away as the new one slams in |

## The rules

- **Land on the word.** The count finishes when you say the number, not after.
- **Hold it 1.5s** once it lands. Then it can move on.
- **Big:** 120px or more for the hero number, label 34px or more.
- **Ease the count,** fast then slow (`easeOut`), so the last digits are readable as they settle.
- **Use the real figure.** Round down if unsure. Never invent one.
- **Inside the safe zone:** nothing right of x 940 between y 1000 and 1700, nothing below y 1500.

## Step 2: Build brief (paste into Claude Code)

```
In beat [N] of reel.js, count [FIGURE] up from 0, starting 0.8s before the word "[WORD]" in words.js and finishing exactly on it.
Value at time t = round(target * easeOut(prog(t, start, end))), formatted with thousands commas. 128px, weight 800, #0071e3, label "[LABEL]" 36px #1d1d1f under it.
Hold the final value 1.5s. Work it out from time alone.
Check stills at the start, halfway, on the word, and 1s after.
```

For a flip clock, give each digit its own rolling column (`translateY` of a 0-9 strip). For a ring, use an SVG circle with `stroke-dashoffset` from time.
