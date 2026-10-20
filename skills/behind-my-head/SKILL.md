---
name: behind-my-head
description: Put a real website, an app screen or one big number BEHIND the speaker's head with real depth. The person is cut out and stays in front, the page rises and scales up behind them and lands on the spoken word, the URL types in, and one part of the page lifts out on a second word. Optional blurred room and slow camera push for a tripod shot. For product launches, "here is my site", a pricing page, a result or a milestone number. Use when someone says "put the website behind me", "behind my head", "page behind me", "number behind my head", "depth effect", "make it look like I am in front of the screen" or "cut me out and put something behind me".
---

# Behind my head

**Use it for:** product launches, "here is my site", a pricing page, a result or a milestone number.

You stay in front. The page or the number sits behind you, in the room, and lands on the word you say. It reads as depth, not as a graphic stuck on top.

**Before you start:** run `video-intake` and `opening-hook`. This adds one beat type to the starter's `video.js`. It is built for 9:16. For the 4:5, 1:1 and 16:9 cuts from `every-format`, use a split beat for that line instead.

## What you need

1. **The cut take, `face/` frames and `words.js`** from `video-intake`.
2. **The thing behind you.** One of these:
   - a real screenshot of the page (at least 1920px wide, true ratio, no stretching) and the address to type in the bar
   - one number exactly as it should read (`12,400`, `$3.2m`, `87%`), its source, and a short label
3. **The word it lands on.** Optional for a page: a second word and the part of the page that lifts out on it.
4. **A cut-out of you for this beat.** `scripts/matte.py` in this skill makes it with RobustVideoMatting, free and local. Use it for this beat. (`video-effects` has its own matting step for the 20 effects.)

```
python3 -m pip install torch torchvision pillow numpy scipy     # once. scipy is optional, it fills small holes
python3 <this skill>/scripts/matte.py my-video --from 12.4 --to 17.0
```

It reads `my-video/face/`, writes `my-video/cut/000373.webp` and on, with the same frame numbers, and prints `headTop`, the top of your head in frame pixels. The model downloads once from GitHub. It runs on Apple Silicon, an NVIDIA card or the CPU. Matte only the beat, with its start and end in the cut. Cut-outs of a whole video fill a disk.

**Optional depth (tripod only).** Build the room without you in it, and the beat blurs it and pushes the camera in slowly:

```
python3 <this skill>/scripts/plate.py my-video --from 12.4 --to 17.0
```

## Step 1: Ask for the inputs above, then wait

Never invent a page, an address or a number. A screenshot of a page you do not own needs the owner's yes.

## Step 2: Beat sheet, then wait

Per beat: start and end in the cut, the page or number, the landing word, the lift word if any. Show it and get a yes.

## Step 3: Build brief (paste into Claude Code)

```
Copy <this skill>/templates/behind-my-head.js to the very top of my-video/video.js, above window.VIDEO. Do not edit index.html.
Add one beat per line in my beat sheet to VIDEO.beats:
  behindMyHead({ start: [S], end: [E], page: 'assets/[page].png', url: '[address]', word: '[WORD]', headTop: [headTop from matte.py],
                 focus: { word: '[WORD 2]', x: [X], y: [Y], w: [W], h: [H] } })
  behindMyHead({ start: [S], end: [E], number: '[FIGURE]', label: '[LABEL]', word: '[WORD]', headTop: [headTop from matte.py] })
Add plate: 'plate.jpg' only if I ran plate.py for that beat.
The focus box is in page pixels with the page drawn 960px wide. Measure it off the screenshot. Pick a box in the top half of the page, never behind my head.
Add one face beat after the last new beat (the starter shows the last beat in any gap until the next one starts).
Render with `node render.mjs` from my-video. If it cannot find Puppeteer, run `npm i puppeteer` there once.
Every value comes from time alone inside draw(), so seek(t) gives the same frame every time.
Then render stills at the start, 0.2s before the word, on the word, on the lift word and 0.3s before the end. Show them to me.
```

The template draws the room frame from `face/`, the page or number, then your cut-out of the same frame on top. The caption pill from the starter stays in front of everything.

## The timing rule

Every move lands on its word from `words.js`. The template finds the first time the word is said inside the beat.

- **The page** starts rising 0.19s before the word, reaches full size on the word, then settles.
- **The lift** reaches full size on its word and holds until 0.75s before the end.
- **The number** rolls for about a second, the left digit settles first and the right digit settles exactly on the word.
- **The exit** is the last 0.3s of the beat. The graphic falls back and fades, you stay.

Start the beat at least 0.4s before a page word and 1.5s before a number word, or the entrance gets cut short.

## Step 4: Render

```
cd my-video
node render.mjs --stills 12.6,13.2,15.0     # check first
node render.mjs                              # then the full video
```

Then run `video-check`.

## Check before you show

- **Edges.** Crop the hair and hands at full size on three stills. No room halo, no bitten-off fingers. Fill holes from the original frame if the matte ate a mic or a dark shirt.
- **Overlap.** Your head covers only the lower part of the page or the bottom quarter of the number, never the headline or a digit. The template needs the top of your head at about y 445 (number) or y 575 (page). Higher than that, it shrinks you a little onto a blurred copy of the room. Past 80% it stops and tells you what to change. Best fix: film with space above your head.
- **The landing.** On the still at the word, the page is at full size. 0.2s before, it is still rising.
- **Frames match.** Step through two stills 1 frame apart. The cut-out and the room move together. A one-frame slip shows as a double edge.
- **Plate beats only.** No ghost of you in the blurred room. A handheld shot fails this, so drop the plate.
- **Safe zone.** No text in the top 220px. The address bar sits below it at the default `top`.
- **Truth.** The screenshot is real and current, the number has a source, and it is rounded down if unsure.
- **No logos** you have no right to show, and no one else's name or handle left on the page.

## What I learned the hard way

- **A blurred room needs a clean plate.** Blur the frame with you still in it and a soft ghost of you shows round the edges.
- **The camera push only works with the plate.** Push the room frame and the cut-out by different amounts without it and you see two of you.
- **Keep the cut-out the exact same frame as the room.** Same number, same size, same position, or the edge doubles.
