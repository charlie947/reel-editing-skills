#!/usr/bin/env python3
"""Cut ranked clips from a long recording, with a two-line hook and word-by-word captions.
usage: python3 make-clips.py long.mp4 audio.json clips.json [--ink 1d1d1f] [--accent 0071e3] [--bg ffffff] [--font "Helvetica Neue"]
writes clip<rank>.ass and clips/clip<rank>.mp4 (1080 x 1920, H.264, limited range)."""
import json, re, subprocess, sys, os, argparse

p = argparse.ArgumentParser()
p.add_argument('src'); p.add_argument('words'); p.add_argument('clips')
p.add_argument('--ink', default='1d1d1f'); p.add_argument('--accent', default='0071e3')
p.add_argument('--bg', default='ffffff'); p.add_argument('--font', default='Helvetica Neue')
a = p.parse_args()

def bgr(h): return f"&H00{h[4:6]}{h[2:4]}{h[0:2]}".upper()
INK, ACC = bgr(a.ink), bgr(a.accent)
def ts(t):
    t = max(0, t); return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"

W = [(w['start'], w['end'], w['word'].strip()) for s in json.load(open(a.words))['segments'] for w in s['words']]
w0, h0 = map(int, subprocess.check_output(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries',
          'stream=width,height', '-of', 'csv=p=0', a.src]).decode().split(',')[:2])
vertical = h0 > w0
# landscape: source band across the middle. vertical: source full frame
band_h = 1920 if vertical else round(1080 * h0 / w0 / 2) * 2
band_y = 0 if vertical else 660
hook_v, cap_v = (220, 900) if vertical else (330, band_y + band_h + 80)

os.makedirs('clips', exist_ok=True)
for c in json.load(open(a.clips)):
    s, e, r = c['start'], c['end'], c['rank']
    words = [w for w in W if w[0] >= s - 0.01 and w[1] <= e + 0.01]
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(w); nxt = words[i + 1] if i + 1 < len(words) else None
        if len(cur) == 3 or re.search(r'[.,?!]$', w[2]) or not nxt or nxt[0] - w[1] > 0.3:
            chunks.append(cur); cur = []
    box = 3 if vertical else 1   # a solid pill behind captions over a full-frame face
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hook,{a.font},80,{INK},{INK},&H00FFFFFF,&H00FFFFFF,-1,0,0,0,100,100,-1,0,{box},18,0,8,70,70,{hook_v},1
Style: Cap,{a.font},64,{INK},{INK},&H00FFFFFF,&H00FFFFFF,-1,0,0,0,100,100,0,0,{box},14,0,8,70,70,{cap_v},1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    ev = [f"Dialogue: 0,{ts(0)},{ts(e - s)},Hook,,0,0,0,,{c['hook']}"]
    for ch in chunks:
        for j, w in enumerate(ch):
            st = (ch[0][0] if j == 0 else w[0]) - s
            en = (ch[j + 1][0] if j + 1 < len(ch) else ch[-1][1] + 0.15) - s
            txt = ' '.join((f"{{\\c{ACC}&}}{x[2]}{{\\c{INK}&}}" if k == j else x[2]) for k, x in enumerate(ch))
            ev.append(f"Dialogue: 1,{ts(st)},{ts(en)},Cap,,0,0,0,,{txt}")
    open(f'clip{r}.ass', 'w').write(head + '\n'.join(ev) + '\n')
    d = e - s
    fit = 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920' if vertical else f'scale=1080:{band_h}:flags=lanczos'
    fc = (f"[0:v]{fit},setsar=1[v];[1:v][v]overlay=0:{band_y}:shortest=1,ass=clip{r}.ass,"
          f"scale=out_range=limited,format=yuv420p[o];"
          f"[0:a]afade=t=in:d=0.03,afade=t=out:st={d - 0.03:.2f}:d=0.03[a]")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{s:.2f}', '-t', f'{d:.2f}', '-i', a.src,
                    '-f', 'lavfi', '-i', f'color=0x{a.bg}:s=1080x1920:r=30', '-filter_complex', fc,
                    '-map', '[o]', '-map', '[a]', '-c:v', 'libx264', '-profile:v', 'high', '-crf', '19',
                    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                    '-c:a', 'aac', '-b:a', '160k', '-ar', '44100', '-movflags', '+faststart', f'clips/clip{r}.mp4'], check=True)
    print(f"clips/clip{r}.mp4  {d:.1f}s  {c['hook'].replace(chr(92) + 'N', ' / ')}")
