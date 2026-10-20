<h1 align="center">Video Editing Skill Pack</h1>

<p align="center">
  <strong>41 skills that turn a to-camera recording into a polished motion video with Claude Code. One build, every platform. Every frame is code.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/skills-41-0071E3?style=flat-square&labelColor=1d1d1f" alt="41 skills">
  <img src="https://img.shields.io/badge/runs_in-Claude_Code_%C2%B7_Codex-0071E3?style=flat-square&labelColor=1d1d1f" alt="Runs in Claude Code and Codex">
  <a href="LICENSE"><img src="https://img.shields.io/badge/licence-MIT-FFFFFF?style=flat-square&labelColor=1d1d1f" alt="MIT licence"></a>
</p>

---

I edit my videos with Claude Code now. No CapCut, no Premiere, no editor. Claude cuts the take, builds every motion graphic as code in your brand, draws each frame and renders the MP4. One build gives you a 9:16 reel, a 4:5 LinkedIn video, a 1:1 ad and a 16:9 video for YouTube, your website or a sales email.

These skills are the steps I use, with the rules that came out of real drafts I threw away. On top of them sit 20 one-command effects that run on your own clip.

## Install

```bash
npx skills add charlie947/reel-editing-skills
```

Then open Claude Code in an empty folder and run `video-intake` with your recording. Run `brand-setup` once with your website.

You need `ffmpeg`, Node 18 or newer and Python 3. Whisper (free, local) gives the word timings. `behind-my-head`, `tier-list` and the 20 effects also cut you out of the frame with RobustVideoMatting (free, local, `python3 -m pip install torch torchvision`). The model downloads once and is GPL-3.0 licensed.

<details>
<summary><strong>Manual copy</strong></summary>

```bash
git clone https://github.com/charlie947/reel-editing-skills.git
mkdir -p ~/.claude/skills
cp -R reel-editing-skills/skills/* ~/.claude/skills/
```

</details>

## What you can make

| You need | Run |
|---|---|
| A demo of your product or website | `product-demo` |
| How it works, a process or a framework | `explainer-video` |
| A founder take or an opinion piece | `big-idea-video` |
| A ranking, best to worst | `tier-list` |
| Commentary on news in your industry | `news-reaction` |
| A feature list, a service menu or a roundup | `toolkit-video` |
| Results, a case study or this quarter's numbers | `animated-numbers` inside any of the above |
| The best moments from a call, webinar, podcast or long video | `call-clips` |

## How it works

Every edit is one HTML page with a `seek(t)` function. It draws any moment of the video from the time alone. A small script shoots every frame in Chrome and ffmpeg turns them into an H.264 file no platform washes out.

`video-intake` sets up that page for you (the starter lives inside the skill). Every other skill edits one file in it, `video.js`.

```
your recording → video-intake → brand-setup → opening-hook → a video type → moves → video-sound → video-check → every-format
```

## The skills

### Start

| Skill | What it does |
|---|---|
| `video-intake` | Checks the file, transcribes word by word, cuts pauses on true silence, sets up the project |
| `brand-setup` | Reads your website's real styles. Your colours, font and logo go into every video |
| `opening-hook` | The two lines on screen from frame 0, in three tested looks. They double as the thumbnail |

### Video types (pick one per video, or mix by beat)

| Skill | What it makes |
|---|---|
| `product-demo` | Your real site or app on screen. One exact highlight lands on each feature as you name it |
| `explainer-video` | Clean canvas, one object per point that changes on the word. My best motion video |
| `big-idea-video` | One big 3D object per beat that acts out the idea you say |
| `news-reaction` | Industry news over real footage, one clean run per spoken line |
| `toolkit-video` | A prompt bar types each item and shows what it does, every 2 seconds |
| `call-clips` | A long recording you already have into the 3 to 5 best short clips, ranked, with hooks and captions |
| `tier-list` | An S to F tier list. Each item drops into its row on the word, your head breaks out of the card below |

### Moves

| Skill | What it does |
|---|---|
| `zoom-cut` | Zooms into the thing you point at instead of a hard cut |
| `word-highlight` | One box exactly on a word or a number, measured off the pixels |
| `animated-numbers` | Counts, flip clocks and rings that land on the spoken number |
| `behind-my-head` | Cuts you out and puts a real page or a big number behind you, landing on the word |
| `call-to-action` | The right ending for each place: comment keyword, links in the post, or a book-a-call card |

### Looks

| Skill | What it does |
|---|---|
| `apple-style` | Light canvas, glass, springs |
| `stripe-style` | Fintech look, fast snap ease, 16 ready payment moments |

### Finish

| Skill | What it does |
|---|---|
| `video-sound` | Voice at one gain, music 12 dB under to the last frame, the right loudness per platform |
| `video-check` | File format, safe zones, reading time, loudness and a contact sheet to look at |
| `every-format` | One build, four sizes: 9:16, 4:5, 1:1 and 16:9, each with that platform's rules |

### Effects (one command on your own clip)

Each effect is its own skill and runs on the shared engine in `video-effects`. Set that up once (`npm i puppeteer` in its folder), then:

```bash
node ~/.claude/skills/video-effects/run.cjs grid-dive my-clip.mp4 grid-dive.mp4
```

| Skill | What it does to your clip |
|---|---|
| `video-effects` | The shared engine. Fits your clip, cuts you out, renders the MP4 |
| `grid-dive` | Pulls back into a wall of tiles of your clip, then dives back in |
| `title-orbit` | Your words circle your head, then the camera flies through a letter |
| `magnifying-lens` | A glass lens magnifies your chest, then opens out |
| `portal` | A ring of blue light opens and the camera flies through it |
| `clone-room` | Copies of you step out behind you |
| `infinite-zoom` | A frame inside a frame, and the camera zooms through both |
| `cube-spin` | Your shot turns a quarter on a 3D cube |
| `liquid-glass` | A drop of glass grows into a pane and the camera dives through |
| `screen-in-screen` | Pulls back to a laptop playing your shot, then dives back in |
| `frame-break` | You lean out of a printed photo of yourself |
| `tile-tunnel` | Flies backwards down a tunnel, then back into you |
| `depth-ui` | App windows float at different depths around you |
| `vertigo` | A dolly zoom down a gridded corridor |
| `phone-fan` | Your shot on a phone, four more fan out behind it |
| `shatter` | Your shot cracks like glass and the shards fly past |
| `spotlight` | Lights down, one theatre light on your face |
| `pull-back-reveal` | Pulls back to show your shot inside a video editor |
| `ribbon-wrap` | A ribbon with your words wraps round you |
| `zoom-through` | A chat with your ask, then a fly-through into your clip |
| `head-pop-out` | Your head springs out of a blue panel. An ending |

## Rules every skill shares

- The recording is the source of truth. Captions follow what was said.
- One idea per beat. The scene changes every 3-5 seconds.
- Every object fills its panel. Small things in big white space look cheap.
- Captions sit in one pill at the same height on every beat, always on.
- Size objects from `PANEL`, so every beat fits every size.
- Real logos, real screenshots, real numbers. Never invent one.
- Clone a style, never a brand.

## Licence

MIT. Use it, change it, ship videos with it.
