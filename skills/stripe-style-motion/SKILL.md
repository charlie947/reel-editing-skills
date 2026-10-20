---
name: stripe-style-motion
description: Make motion graphics in a Stripe-style fintech look, white and pale surfaces, deep navy text, one purple accent, one loud gradient used softly, light type weights, small corners, and a fast snap-in-and-settle ease, with 16 ready payment and SaaS moments (checkout to paid, card added, invoice sent, payout to bank). As a brief for Claude Motion or a seek-based HTML build. Use when someone says "Stripe style animation", "fintech motion graphics", "payment animation", "SaaS product moment", "checkout animation" or "clone Stripe's design".
---

# Stripe-style motion

A fintech homepage feel: light, precise, fast, expensive. The values below were read from a real live stylesheet, then turned into a brief.

**Clone the style, never the brand.** Never draw the Stripe logo, the wordmark or a real product screenshot. Every element is your own design in this style.

## The design system

**Type.** One font for everything, light weights: body 300, headings 400, emphasis 500. Nothing heavy. Tracking -0.01em on headings, -0.02em at hero size. Use system-ui or Inter (the original font is paid). Code in a monospace.

**Colour.** Background white, surfaces `#F8FAFD`. Text deep navy `#061B31`, secondary `#425466`. One accent: purple `#635BFF`, pressed `#533AFD`. Green `#00D924` only for ticks. One loud gradient, only as a soft blurred shape behind a hook or end card, never full frame: `#FFD601`, `#FF6118`, `#EE30FB`, `#FB76FA`, `#7232F1`.

**Shape.** Small corners: cards 6px, small items 4px, circles 50%. One soft lifted shadow: `0 27px 40px -27px rgba(50,50,93,.25), 0 16px 32px -16px rgba(0,0,0,.1)`.

**Motion.** Default easing `cubic-bezier(.25, 1, .5, 1)`: things snap in fast and settle. Most moves 0.3s, small fades 0.15s, the biggest 0.5s. Compare Apple's calm `cubic-bezier(0.4, 0, 0.6, 1)`.

## 16 ready moments

| | Moment | | Moment |
|---|---|---|---|
| 1 | Checkout → paid | 9 | Plan → upgraded |
| 2 | Card → added | 10 | Cart → order |
| 3 | 0 → £12,480 | 11 | Refund → done |
| 4 | Invoice → sent | 12 | Fraud → blocked |
| 5 | Monthly → yearly | 13 | Tax → added |
| 6 | Payout → bank | 14 | Signup → active |
| 7 | Failed → retried | 15 | Currency → converted |
| 8 | Link → shared | 16 | Dashboard → live |

## Step 1: Ask for two things, then wait

1. **Which moments,** from the table or your own, as "thing → change".
2. **The format:** 1080 x 1920 reel, 1080 x 1350 LinkedIn, or 1920 x 1080. Default 6 seconds per moment.

## Step 2: The brief

Paste into Claude Motion (claude.ai), or into Claude Code with "Build this as one HTML file with window.seek(seconds)":

```
Make me a motion graphic. Follow this motion brief exactly.

The bar: a product moment from a top fintech brand's homepage. Light, precise, fast, expensive. Not a template, not a slide, not a dashboard.
Format: [WIDTH] x [HEIGHT], [LENGTH] seconds. Keep every word 90px in from every edge. Show every word and number exactly as I write it.
Look: background white, surfaces #F8FAFD, text #061B31, secondary #425466. One accent purple #635BFF, pressed #533AFD. Green #00D924 only for ticks. One loud gradient (#FFD601, #FF6118, #EE30FB, #FB76FA, #7232F1) only as a soft blurred shape behind the opening and the end, never full frame.
Type: system-ui or Inter, light weights (body 300, headings 400, emphasis 500), tracking -0.01em. Labels never under 34px.
Shape: cards 6px corners, small items 4px. Shadow 0 27px 40px -27px rgba(50,50,93,.25), 0 16px 32px -16px rgba(0,0,0,.1).
Motion: cubic-bezier(.25, 1, .5, 1) on everything. Most moves 0.3s, small fades 0.15s, biggest 0.5s. Hold every after state 1.2 seconds. One thing in focus at a time.
The one rule: each moment has ONE hero object filling 60-70% of the frame showing ONE satisfying change, then it morphs or slides into the next. Never a fade to an empty frame.
Never: the Stripe logo or wordmark, real product screenshots, grey placeholder bars, stock icons, emoji, dark backgrounds, film grain.
The moments:
[0-6s] [THING] → [CHANGE]. Words: "[WORDS]".
...
Before you finish, render a still at the after state of every moment, judge it as a design director, then again at 200px wide. Fix anything generic, small or empty.
```

## Step 3: Use it in a reel

Export as MP4 and drop it into a split or full beat (see `apple-motion-reel` for the layouts).
