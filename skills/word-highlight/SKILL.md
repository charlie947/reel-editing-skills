---
name: word-highlight
description: Put one exact highlight box on a word in a screenshot, page or headline at the moment it is spoken, measured off the image pixels and trimmed to the letter ink, with the rest of the image greyed out. Use when someone says "highlight the word", "box the text", "point at this on the page", "highlight the headline", "spotlight part of the screenshot" or "the highlight is in the wrong place".
---

# Word highlight

One box, exactly on the word, at the moment you say it. Everything else goes quiet.

## Step 1: Ask for two things, then wait

1. **The image,** full size, at its true ratio.
2. **The word or phrase** and the spoken word it should appear on.

## The rules

- **Measure the box off the image,** never guess it from the layout. Find the dark ink of the letters in that region.
- **Trim to the ink, then pad 3px left and right, 5px top and bottom.** The next letter and the full stop stay outside.
- **The clear window is the same box.** No extra padding on the window.
- **One highlight per shot.** No underlines, no second box, no pen circles.
- **Grey the rest** with about 55% white over it.
- **Show the image at true ratio** (`height:auto`). A stretched image moves the words and the box misses.

## Step 2: Measure it (paste into Claude Code)

```
Find the exact pixel box of "[PHRASE]" in [image.png]. Crop the region around it, threshold the dark text, and return the tight bounding box of the ink in image pixels.
Pad 3px left and right and 5px top and bottom. Then scale that box to how the image is drawn in my reel (its displayed width / natural width).
Draw it in beat [N] of reel.js: a 3px #0071e3 rounded outline, the rest of the image under rgba(255,255,255,.55) with the box left clear.
It fades in over 0.15s starting at the spoken word "[WORD]" from words.js.
Then crop a still of that region at 2x and show me. The box must cover the phrase and nothing else.
```

## Check

Crop the final frame at 2x. If a letter of the next word is inside the box, or a letter of the phrase is outside, measure again.
