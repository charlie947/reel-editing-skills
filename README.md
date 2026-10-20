<h1 align="center">Reel Editing Skill Pack</h1>

<p align="center">
  <strong>16 skills that edit Instagram reels with Claude Code. Every frame is code.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/skills-16-0071E3?style=flat-square&labelColor=1d1d1f" alt="16 skills">
  <img src="https://img.shields.io/badge/runs_in-Claude_Code_%C2%B7_Codex-0071E3?style=flat-square&labelColor=1d1d1f" alt="Runs in Claude Code and Codex">
  <a href="LICENSE"><img src="https://img.shields.io/badge/licence-MIT-FFFFFF?style=flat-square&labelColor=1d1d1f" alt="MIT licence"></a>
</p>

---

I edit my reels with Claude Code now. No CapCut, no Premiere. Claude cuts the take, builds every motion graphic as code, draws each frame and renders an MP4 that is ready for Instagram. These 16 skills are the steps I use, with the rules that came out of real drafts I threw away.

## Install

```bash
npx skills add charlie947/reel-editing-skills
```

Then open Claude Code in an empty folder and run `reel-intake` with your recording.

You need `ffmpeg`, Node 18 or newer and Python 3. Whisper (free, local) gives the word timings.

<details>
<summary><strong>Manual copy</strong></summary>

```bash
git clone https://github.com/charlie947/reel-editing-skills.git
mkdir -p ~/.claude/skills
cp -R reel-editing-skills/skills/* ~/.claude/skills/
```

</details>

## How it works

Every edit is one HTML page with a `seek(t)` function. It draws any moment of the reel from the time alone. A small script shoots every frame in Chrome and ffmpeg turns them into an H.264 file Instagram will not wash out.

`reel-intake` sets up that page for you (the starter lives inside the skill). Every other skill edits one file in it, `reel.js`.

```
your recording → reel-intake → text-hook → an edit style → moves → reel-sound → reel-check → post
```

## The skills

### Start

| Skill | What it does |
|---|---|
| `reel-intake` | Checks the file, transcribes word by word, cuts pauses on true silence, sets up the reel folder |
| `text-hook` | The two lines on screen from frame 0, in three tested looks |

### Edit styles (pick one per reel, or mix by beat)

| Skill | What it does |
|---|---|
| `apple-motion-reel` | White canvas, one accent, one object per beat that changes on the word. My best motion reel |
| `hero-motion-reel` | One big 3D object per beat that acts out the noun you say |
| `real-page-reel` | The real website fills the top, one exact highlight lands on the word |
| `footage-reel` | News over real footage, one clean run per spoken line |
| `slash-command-reel` | A white prompt bar types each command and shows what it makes, every 2 seconds |

### Moves

| Skill | What it does |
|---|---|
| `zoom-through-cut` | Zooms into the thing you point at instead of a hard cut |
| `word-highlight` | One box exactly on a word, measured off the pixels |
| `animate-figures` | Counts, flip clocks and rings that land on the spoken number |
| `comment-cta` | The native comment box types the keyword, then the DM card |

### Style briefs (for any motion graphic)

| Skill | What it does |
|---|---|
| `apple-style-motion` | Light canvas, glass, springs. A brief for Claude Motion or Claude Code |
| `stripe-style-motion` | Fintech look, fast snap ease, 16 ready payment moments |
| `clone-brand-motion` | Reads any site's real stylesheets and turns them into a motion brief |

### Finish

| Skill | What it does |
|---|---|
| `reel-sound` | Voice at one gain, music 12 dB under to the last frame, -14 LUFS |
| `reel-check` | File format, safe zone, reading time, loudness and a contact sheet to look at |

## Rules every skill shares

- The recording is the source of truth. Captions follow what was said.
- One idea per beat. The scene changes every 3-5 seconds.
- Every object fills its panel. Small things in big white space look cheap.
- Captions sit in one white pill at the same height on every beat.
- Nothing readable below y 1500 or right of x 950 near the Instagram buttons.
- Real logos, real screenshots, real numbers. Never invent one.
- Clone a style, never a brand.

## Licence

MIT. Use it, change it, ship reels with it.
