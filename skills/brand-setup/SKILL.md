---
name: brand-setup
description: Put your own brand into every video, read your website's real live stylesheets, write one design-system file (type, colour, shape, shadow, easing, durations), set the starter's colours, font and logo from it so every video comes out on brand, and turn it into a motion brief with 16 moments in that style. Works for any SaaS, app, agency or consumer brand, yours or a client's with permission. Use when someone says "use my brand", "brand my videos", "make motion graphics in my brand", "match my website", "brand design system for motion" or gives a website and wants videos that look like it.
---

# Brand setup: your brand in every video

Point it at your website. It reads the real styles the site ships, writes them down as one file, and sets every video in this pack to match. The same steps made my Apple and Stripe sets.

**Clone the style, never the brand.** The file holds values (fonts, colours, easing). Never logos, product shots, trademarks or copy. Clone a competitor's look for your own brand and you are copying, so use it on your own site, a client's with permission, or as a study.

## Step 1: Ask for two things, then wait

1. **The website,** one URL.
2. **Your logo,** an SVG or a PNG with a clear background.

## Step 2: Read the real styles

The live stylesheets are the truth. Screenshots and guesses are not.

```
Fetch [URL] and list every stylesheet it loads, including ones from its CDN. Download each one into styles/.
If a request is refused or filtered, tell me which domain, and stop so I can allow it. Do not guess the missing values.
```

A browser tool that saves a page's live stylesheets works too. I use REA (Reverse Engineer Anything), a free open-source tool. If the first run keeps only one file, read what it filtered out (often the brand's CDN domain), allow that domain, and run it again. That took me from 1 file to 94.

## Step 3: Write the design-system file

```
Read every file in styles/ and write [brand]-design-system.md with these sections, values only, each one counted from the CSS:
Type: font families, the weights actually used for body, headings and emphasis, letter-spacing on headings, any font-feature-settings.
Colour: background, surfaces, text, secondary text, the one accent and its pressed state, any gradient with its stops.
Shape: corner radii by size, the shadow tokens.
Motion: every transition and animation timing function, ranked by how often it is used, and the common durations.
Mark each value with how many times it appears. Say which fonts are paid and give a free fallback.
Never copy logos, images, product names or marketing copy into this file.
```

Read it. The top easing curve is the brand's feel: Stripe's fast snap was used 44 times, Apple's calm curve is symmetric.

## Step 4: Turn it into motion

```
Using [brand]-design-system.md as the house style, write a motion brief for [FORMAT] with 16 moments, each "thing → change" (for example "Checkout → paid", "0 → £12,480").
Every moment: ONE hero object filling 60-70% of the frame, ONE satisfying change, the brand's top easing curve and durations, hold the after state 1.2 seconds.
Use only values from the file. Never draw the brand's logo, wordmark or product screenshots.
```

Paste the brief into Claude Motion (claude.ai) or build it in Claude Code as one HTML file with `window.seek(seconds)`. See `apple-style` and `stripe-style` for two finished briefs made this way.

## Step 5: Put it into the starter

```
Open design-system.md. In index.html, set the :root values from it:
--bg (main background), --ink (main text), --accent (the one brand colour), --font (the brand font, loaded from its real source).
Copy the logo to logo.svg and show it 64px high in the top-left corner of the first and last beat only.
Then shoot stills at 1 and 5 seconds and show them to me next to a screenshot of the website.
```

From here on every skill in this pack draws in your brand. Run it once per brand.

## Check

- Does every value in the brief trace back to a line in the CSS?
- Is there no logo, wordmark or real screenshot anywhere?
- At 200px wide, does it still feel like the brand?
