---
name: apple-style-motion
description: Make motion graphics in an Apple-grade style, bright light canvas, frosted glass panels, glossy squircles, spring physics with a small settle, one hero object per moment that shows one satisfying change, as a ready motion brief for Claude Motion or a seek-based HTML build in Claude Code. For reel B-roll, product moments and step-by-step videos. Use when someone says "Apple style animation", "Apple motion graphics", "make it look like an Apple keynote", "WWDC style", "premium UI animation" or "clone Apple's design".
---

# Apple-style motion

Apple's style, as a brief Claude can follow: the look, the motion and the rules. You get the feel without copying a logo or a product shot.

**Clone the style, never the brand.** No Apple logo, no real product screenshots, no trademarks. Every element is your own design in this style.

## Step 1: Ask for three things, then wait

1. **The moments.** What each shot shows, as "thing → change" ("Plan → upgraded", "0 → £12,480"). One to 16.
2. **The format.** 1080 x 1920 for a reel, 1080 x 1350 for LinkedIn, 1920 x 1080 for YouTube. Length per moment (default 6s).
3. **The words** on screen, exactly. At most 5 words per moment.

## The look

- Bright and clean. Background `#F5F5F7` or a very soft light tint.
- Real depth: layered soft shadows, a subtle specular highlight on glass and metal, frosted panels with a bright 1px edge.
- Real-feeling components: macOS and iOS-grade squircles, toggles, widgets, notifications, glossy original app icons.
- System colours, used sparingly, one or two per piece: blue `#0A84FF`, green `#30D158`, orange `#FF9F0A`, red `#FF453A`, purple `#BF5AF2`.
- SF Pro style (Inter or system-ui), tight tracking, heavy weight for the hero number or word. The key number is 120px or more. Labels never under 34px.

## The motion

- Spring physics on everything that moves: real mass, a small settle at the end. Nothing linear.
- Calm, even easing for UI moves: `cubic-bezier(0.4, 0, 0.6, 1)`.
- Glass panels arrive with blur and scale together (blur 20px to 0, scale 0.94 to 1), never a plain fade.
- A visible overshoot only on things that are thrown or snapped: ticks, toggles, a selection capsule.
- Hold every after state at least 1.2 seconds.
- Something is always alive (a breathing glow, a caret blink), but only one thing is the focus.

## The one rule

Each moment has ONE hero object that fills 60-70% of the frame and shows ONE satisfying change. Then it springs away as the next hero springs in, or morphs into it. Never a fade to an empty frame.

## Step 2: The brief

Paste into Claude Motion (claude.ai) as one message, or into Claude Code with "Build this as one HTML file with window.seek(seconds)":

```
Make me a motion graphic. Follow this motion brief exactly.

The bar: Apple keynote quality. Every moment looks like a UI moment from an Apple product page: tactile, physical, precise, expensive. Not a template, not a slide, not a dashboard.
Format: [WIDTH] x [HEIGHT], [LENGTH] seconds, one continuous film. Keep every word 90px in from every edge. Show every word and number exactly as I write it.
Look: light background #F5F5F7, frosted glass panels with a bright 1px edge, layered soft shadows, glossy original squircle icons (never real brand logos). System colours used sparingly: blue #0A84FF, green #30D158. SF Pro style type (Inter or system-ui), tight tracking, hero number 120px or more, labels 34px or more, at most 5 words on screen.
Motion: spring physics on everything, a small settle at the end, nothing linear. Glass arrives with blur 20px to 0 and scale 0.94 to 1. Overshoot only on ticks and toggles. Hold every after state 1.2 seconds.
The one rule: each moment has ONE hero object filling 60-70% of the frame, showing ONE satisfying change, then it springs out as the next springs in. Never a fade to an empty frame.
Never: grey placeholder bars, stock icons, emoji, dark or noisy backgrounds, small objects floating in empty space, any real logo or product screenshot.
The moments:
[0-6s] [THING] → [CHANGE]. Words: "[WORDS]".
[6-12s] ...
Before you finish, render a still at the after state of every moment and judge it as a design director, then again at 200px wide. Fix anything generic, cheap, small or empty.
```

## Step 3: Use it in a reel

Export as MP4. For a split reel, render at 1080 x 1000 and drop it into the top panel. For a full beat, 1080 x 1920 with y 930-1040 kept clear for the caption.
