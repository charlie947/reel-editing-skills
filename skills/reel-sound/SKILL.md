---
name: reel-sound
description: Mix the sound for a reel, voice at one static gain, a music bed about 12 dB under it at one steady level to the last frame, a short music take looped on whole phrases with tiny crossfades, loudness at about -14 LUFS with true peak at -1.5 dBTP or lower, and a check that the music never drops out. Use when someone says "add music to my reel", "mix the audio", "the music cuts out", "loop the music", "loudness for Instagram" or "the audio is too quiet".
---

# Reel sound

The voice carries the reel. The music holds it together, at one level, all the way to the end.

## Step 1: Ask for two things, then wait

1. **The cut voice,** `cut-audio.wav` from `reel-intake`.
2. **The music,** a track you are licensed to use, or a generated one. Make three takes and pick one by ear.

## The rules

- **Voice: one static gain.** Never a normaliser or a compressor that pumps.
- **Music about 12 dB under the voice.** You should hear it, never fight it.
- **One bed level to the last frame.** No dips, no fade in the middle, no early fade-out.
- **A take that is too short gets looped on whole phrases.** Cut it before its own fade, repeat a full phrase, 0.06s crossfade at each join.
- **Silent under any clip with its own sound** (an ad, a demo with audio). Fade out 0.4s before it and back in after.
- **Loudness about -14 LUFS** for Instagram and TikTok. True peak -1.5 dBTP or lower.
- **No whooshes or pops** unless the brand asks for them.

## Step 2: Loop the music to length (paste into Claude Code)

```
music.wav must cover [DURATION]s. Find where its own fade-out starts (the level falls more than 6 dB in the last seconds) and cut before it.
Find the phrase length from the beat (bars of 4), and loop whole phrases with a 0.06s crossfade at each join until it covers the reel.
Write music-bed.wav. Then measure its level every second and tell me any second more than 3 dB below the median.
```

## Step 3: Mix

```
ffmpeg -y -i cut-audio.wav -i music-bed.wav -filter_complex "[1:a]volume=-12dB[m];[0:a][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[a]" -map "[a]" -ar 48000 mix.wav
```

Swap `cut-audio.wav` for `mix.wav` in the render. If one pass of `loudnorm` lands off, run it in two passes (measure, then apply).

## Step 4: Check

```
ffmpeg -i reel.mp4 -af ebur128=peak=true -f null - 2>&1 | tail -12
```

Pass: integrated about -14 LUFS (-15 to -13), true peak -1.5 dBTP or lower. Then listen to the last 8 seconds. That is where music most often dies.
