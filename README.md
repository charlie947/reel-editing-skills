<h1 align="center">Video Editing Skill Pack</h1>

<p align="center">
  <strong>17 skills that turn a to-camera recording into a polished motion video with Claude Code. One build, every platform. Every frame is code.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/skills-17-0071E3?style=flat-square&labelColor=1d1d1f" alt="17 skills">
  <img src="https://img.shields.io/badge/runs_in-Claude_Code_%C2%B7_Codex-0071E3?style=flat-square&labelColor=1d1d1f" alt="Runs in Claude Code and Codex">
  <a href="LICENSE"><img src="https://img.shields.io/badge/licence-MIT-FFFFFF?style=flat-square&labelColor=1d1d1f" alt="MIT licence"></a>
</p>

---

I edit my videos with Claude Code now. No CapCut, no Premiere, no editor. Claude cuts the take, builds every motion graphic as code in your brand, draws each frame and renders the MP4. One build gives you a 9:16 reel, a 4:5 LinkedIn video, a 1:1 ad and a 16:9 video for YouTube, your website or a sales email.

These 17 skills are the steps I use, with the rules that came out of real drafts I threw away.

## Install

```bash
npx skills add charlie947/reel-editing-skills
```

Then open Claude Code in an empty folder and run `video-intake` with your recording. Run `brand-setup` once with your website.

You need `ffmpeg`, Node 18 or newer and Python 3. Whisper (free, local) gives the word timings.

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
| Commentary on news in your industry | `news-reaction` |
| A feature list, a service menu or a roundup | `toolkit-video` |
| Results, a case study or this quarter's numbers | `animated-numbers` inside any of the above |

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

### Moves

| Skill | What it does |
|---|---|
| `zoom-cut` | Zooms into the thing you point at instead of a hard cut |
| `word-highlight` | One box exactly on a word or a number, measured off the pixels |
| `animated-numbers` | Counts, flip clocks and rings that land on the spoken number |
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
