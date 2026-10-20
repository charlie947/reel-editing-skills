---
name: video-effects
description: The shared engine behind the 20 one-command video effects (grid-dive, title-orbit, magnifying-lens, portal, clone-room, infinite-zoom, cube-spin, liquid-glass, screen-in-screen, frame-break, tile-tunnel, depth-ui, vertigo, phone-fan, shatter, spotlight, pull-back-reveal, ribbon-wrap, zoom-through, head-pop-out). Puts one effect on your own talking-head clip and renders an MP4. Set it up once here, then run any effect skill. Use when someone says "add an effect to my clip", "list the video effects", "set up the video effects" or names one of the 20 effects.
---

# Video effects

One effect on your own talking-head clip, one command, one MP4 back. Each of the 20 effect skills is a short card that calls this engine. Install this folder beside them.

**Use it for:** a scroll-stopping moment inside a reel, a transition between two points, or an ending.

## Set up once

You need `ffmpeg`, Node 18 or newer, and Python 3 with torch.

```
cd ~/.claude/skills/video-effects
npm i puppeteer
python3 -m pip install torch torchvision pillow numpy
```

The cut-out of you comes from RobustVideoMatting. `torch.hub` downloads the model from GitHub the first time. It is GPL-3.0 licensed and not bundled here. It runs on Apple Silicon, an NVIDIA card or the CPU (slow).

## Run an effect

```
node ~/.claude/skills/video-effects/run.cjs list
node ~/.claude/skills/video-effects/run.cjs grid-dive my-clip.mp4 grid-dive.mp4
node ~/.claude/skills/video-effects/run.cjs title-orbit my-clip.mp4 title-orbit.mp4 --words "BIG NEWS"
```

| Option | What it does |
|---|---|
| `--at 1.2` | When the effect starts, in seconds. Default 0.6s, earlier on a short clip |
| `--len 1.5` | How long it plays. Each effect has its own default |
| `--words "..."` | The words it shows, for the six effects that show words |
| `--from 4 --to 9` | Use only this part of your clip |
| `--stage blue` | The studio colour behind you: `white` (default), `blue` or `grey` |
| `--no-fit` | Keep your framing. By default your head is scaled and centred to where the effects expect it |
| `--check` | Fit and load the effect only, no render. Takes seconds |
| `--keep` | Keep the work files in `<out>.work/` |

## The 20 effects

| Skill | What it does to your clip | Words |
|---|---|---|
| `grid-dive` | Pulls back into a wall of tiles of your clip, then dives back in | |
| `title-orbit` | Your words circle your head, then the camera flies through a letter | 12 |
| `magnifying-lens` | A glass lens magnifies your chest, then opens out | |
| `portal` | A ring of blue light opens and the camera flies through it | |
| `clone-room` | Copies of you step out behind you | |
| `infinite-zoom` | A frame inside a frame, and the camera zooms through both | |
| `cube-spin` | Your shot turns a quarter on a 3D cube | |
| `liquid-glass` | A drop of glass grows into a pane and the camera dives through | |
| `screen-in-screen` | Pulls back to a laptop playing your shot, then dives back in | |
| `frame-break` | You lean out of a printed photo of yourself | |
| `tile-tunnel` | Flies backwards down a tunnel, then back into you | |
| `depth-ui` | App windows float at different depths around you | 60 |
| `vertigo` | A dolly zoom down a gridded corridor | |
| `phone-fan` | Your shot on a phone, four more fan out behind it | |
| `shatter` | Your shot cracks like glass and the shards fly past | |
| `spotlight` | Lights down, one theatre light on your face | |
| `pull-back-reveal` | Pulls back to show your shot inside a video editor | 24 |
| `ribbon-wrap` | A ribbon with your words wraps round you | 14 |
| `zoom-through` | A chat with your ask, then a fly-through into your clip | 60 |
| `head-pop-out` | Your head springs out of a blue panel. An ending | 40 |

## How it works

1. `prep.py frames` finds your head in five sample frames, scales and crops your clip to 1080x1920 so your head sits where the effects expect it, and writes every frame.
2. The page in `page/` loads the effect from `fx/` and works out which frames it needs cut out.
3. `prep.py matte` cuts you out on those frames only.
4. Chrome shoots 60 frames a second. Each frame is drawn from the time alone, so a check and the render always agree.
5. ffmpeg blends pairs into 30fps with light motion blur and writes H.264 (limited range, bt709) with your audio.

Your shot before and after the effect is your clip at the effects' framing, 1.14x tighter than the fitted frame. Effects that open on their own layout dissolve in from your shot over 0.3s.

## Check before you post

- **Look at it.** Pull stills from the middle of the effect and from both hand-offs. Your face is never doubled and never missing.
- **Fit.** Read the `note:` lines `run.cjs` prints. A head near the top or the edge of your frame means the effects sit off target. Film with space above your head.
- **HDR.** iPhone HDR clips come out washed out. Export as SDR (Rec.709) first. `run.cjs` warns you.
- **Time.** Cutting you out ran at about 6 frames a second on an Apple Silicon Mac mini in testing. `head-pop-out` cuts out every frame to the end, so keep that clip short.
