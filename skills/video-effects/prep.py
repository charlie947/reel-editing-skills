#!/usr/bin/env python3
"""Get your clip ready for an effect. run.cjs calls this for you, in two passes.

  python3 prep.py frames <clip> <work> [--from S] [--to S] [--no-fit]
      Finds your head in 5 sample frames, scales and crops the clip to 1080x1920 so your head sits where the effects
      expect it, and writes every frame at 30fps to <work>/p/NNNNN.jpg. Prints one JSON line: frame count and the fit.
  python3 prep.py matte <work> <need.json>
      Cuts you out (RobustVideoMatting) on the frames the effect needs: <work>/c/NNNNN.png.
      Writes the stills it asks for to <work>/stills/: plate<label>.jpg, cut<label>.png and 324px thumbnails (<label>s).

Needs ffmpeg, Python 3 with torch, torchvision, pillow and numpy. torch.hub downloads the matting model once
(RobustVideoMatting, GPL-3.0, not bundled here). Runs on Apple Silicon (mps), NVIDIA (cuda) or the CPU (slow).
"""
import argparse, json, os, subprocess, sys, tempfile
import numpy as np
from PIL import Image, ImageDraw

W, H, FPS = 1080, 1920, 30
# The head every effect is drawn around, measured with head() below on the 24 cut-outs the effects were built on (1080x1920):
# median crown row 415 and head width 502px. Your head is centred (x 540), where the effects' face box sits.
REF = {'crown': 415, 'width': 502, 'cx': 540}


def head(alpha):
    """Crown row, head width and head centre x of a person matte (uint8 HxW). None if no person is found."""
    m = alpha > 128
    rows = m.sum(1)
    ys = np.nonzero(rows > 20)[0]
    if not len(ys):
        return None
    crown = int(ys[0])
    c = float(np.nonzero(m[crown])[0].mean())
    best, cx = 0, None
    for y in range(crown, min(m.shape[0], crown + 900)):
        row = m[y]
        ci = int(round(c))
        if not row[ci]:   # the run under the centre line, or the nearest one
            xs = np.nonzero(row)[0]
            if not len(xs):
                continue
            ci = int(xs[np.argmin(np.abs(xs - c))])
        x0 = ci - (np.argmin(row[ci::-1]) if not row[ci::-1].all() else ci + 1) + 1
        x1 = ci + (np.argmin(row[ci:]) if not row[ci:].all() else len(row) - ci) - 1
        w = int(x1 - x0 + 1)
        # the head ends at the neck (the outline narrows below 0.8x the widest row so far), or where the shoulders
        # widen past 1.3x it (long hair, no visible neck)
        if y - crown > 120 and best and (w < .8 * best or w > 1.3 * best):
            break
        if w > best:
            best, cx = w, (x0 + x1) / 2
        if y - crown < 200:
            c = (x0 + x1) / 2   # follow the head while it is still the top of the outline
    if not best:
        return None
    return {'crown': crown, 'width': best, 'cx': float(cx)}


def fill_holes(a):
    """Fill holes in the matte that do not touch the top or sides (a mic or a hand in front of the body)."""
    sm = Image.fromarray(np.where(a < 100, 0, 255).astype(np.uint8)).resize((270, 480), Image.NEAREST)
    w, h = sm.size
    px = sm.load()
    for x, y in [(x, 0) for x in range(0, w, 5)] + [(0, y) for y in range(0, h, 5)] + [(w - 1, y) for y in range(0, h, 5)]:
        if px[x, y] == 0:
            ImageDraw.floodfill(sm, (x, y), 128)
    a = a.copy()
    a[np.asarray(sm.resize((a.shape[1], a.shape[0]), Image.NEAREST)) == 0] = 255
    return a


class Matte:
    def __init__(self):
        import torch
        self.torch = torch
        self.dev = 'mps' if torch.backends.mps.is_available() else ('cuda' if torch.cuda.is_available() else 'cpu')
        self.m = torch.hub.load('PeterL1n/RobustVideoMatting', 'resnet50', trust_repo=True).eval().to(self.dev)
        self.rec, self.last = [None] * 4, -9

    def __call__(self, im, k=None, settle=False):
        """im: HxWx3 uint8. k: frame number (a run of k, k+1, ... keeps the model's memory). Returns alpha uint8."""
        t = self.torch
        with t.no_grad():
            x = t.from_numpy(im.copy()).to(self.dev).permute(2, 0, 1).unsqueeze(0).float() / 255
            ds = min(.25, 512 / max(im.shape[:2]))
            if settle or k is None or k != self.last + 1:
                self.rec = [None] * 4
                for _ in range(3):
                    _, _, *self.rec = self.m(x, *self.rec, downsample_ratio=ds)
            self.last = k if k is not None else -9
            _, pha, *self.rec = self.m(x, *self.rec, downsample_ratio=ds)
            return (pha[0, 0].clamp(0, 1).cpu().numpy() * 255).astype(np.uint8)


def ff(*a):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *a], check=True)


def frames(a):
    clip, work = a.clip, a.work
    os.makedirs(work + '/p', exist_ok=True)
    trim = (['-ss', str(a.t0)] if a.t0 else []) + (['-to', str(a.t1)] if a.t1 is not None else [])
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', clip],
                               capture_output=True, text=True, check=True).stdout.strip())
    t0, t1 = a.t0 or 0, (a.t1 if a.t1 is not None else dur)
    # the clip at height 1920, its own shape (a landscape clip stays wide here)
    tmp = tempfile.mkdtemp(dir=work)
    for i in range(5):
        ts = t0 + (t1 - t0) * (i + .5) / 5
        ff('-ss', f'{ts:.3f}', '-i', clip, '-frames:v', '1', '-vf', f'scale=-2:{H}:flags=lanczos', f'{tmp}/s{i}.png')
    samples = [np.asarray(Image.open(f'{tmp}/s{i}.png').convert('RGB')) for i in range(5)]
    nw = samples[0].shape[1]
    fit = {'scale': max(1.0, W / nw), 'x': None, 'y': 0, 'found': 0, 'note': ''}
    if not a.no_fit:
        mat = Matte()
        hs = [h for h in (head(mat(s, settle=True)) for s in samples) if h]
        fit['found'] = len(hs)
        if hs:
            med = {k: float(np.median([h[k] for h in hs])) for k in REF}
            k = REF['width'] / med['width']
            cover = max(1.0, W / nw)
            if k < cover:
                fit['note'] += f'You fill more of the frame than the effects expect, so you show {cover / k:.2f}x bigger than the reference. '
            if k > 2.5:
                fit['note'] += 'You are small in the frame, so the zoom is capped at 2.5x and you sit smaller than the effects expect. '
            k = min(2.5, max(cover, k))
            x = med['cx'] * k - REF['cx']
            y = med['crown'] * k - REF['crown']
            sw, sh = nw * k, H * k
            xc, yc = min(max(0, x), sw - W), min(max(0, y), sh - H)
            if yc - y > 40:
                fit['note'] += f'There is little room above your head, so it sits {yc - y:.0f}px higher than the effects expect. '
            if y - yc > 40:
                fit['note'] += f'Your head is low in the frame, so it sits {y - yc:.0f}px lower than the effects expect. '
            if abs(xc - x) > 40:
                fit['note'] += f'You are near the edge of the frame, so you sit {abs(xc - x):.0f}px off centre. '
            fit.update(scale=round(k, 4), x=round(xc), y=round(yc), head=med)
        else:
            fit['note'] = 'No person found in the sample frames, so the clip is centred as it is. '
    for f in os.listdir(tmp):
        os.remove(os.path.join(tmp, f))
    os.rmdir(tmp)
    k = fit['scale']
    sw, sh = int(round(nw * k / 2) * 2), int(round(H * k / 2) * 2)
    x = fit['x'] if fit['x'] is not None else (sw - W) // 2
    x, y = int(min(max(0, x), sw - W)), int(min(max(0, fit['y']), sh - H))
    ff(*trim, '-i', clip, '-vf', f'fps={FPS},scale={sw}:{sh}:flags=lanczos:out_range=pc,crop={W}:{H}:{x}:{y},format=yuvj420p',
       '-q:v', '2', '-start_number', '0', f'{work}/p/%05d.jpg')
    n = len([f for f in os.listdir(work + '/p') if f.endswith('.jpg')])
    fit.update(x=x, y=y)
    print(json.dumps({'frames': n, 'fit': fit}))


def matte(a):
    work = a.work
    need = json.load(open(a.need))
    os.makedirs(work + '/c', exist_ok=True)
    os.makedirs(work + '/stills', exist_ok=True)
    n = len([f for f in os.listdir(work + '/p') if f.endswith('.jpg')])
    mat = Matte()
    frames_ = sorted(set(min(n - 1, int(k)) for k in need['c']))
    for i, k in enumerate(frames_):
        im = np.asarray(Image.open('%s/p/%05d.jpg' % (work, k)).convert('RGB'))
        al = fill_holes(mat(im, k))
        Image.fromarray(np.dstack([im, al]), 'RGBA').save('%s/c/%05d.png' % (work, k), compress_level=1)
        if i % 50 == 0:
            print('matte', i, len(frames_), flush=True)
    # stills: 'e' = 0.3s into the effect, 'k1'..'k19' = moments spread across the clip
    for lab, kinds in need['stills'].items():
        if lab == 'e':
            k = round((need['at'] + .3) * FPS)
        else:
            j = int(lab[1:])
            k = round((j % 20) / 20 * (n - 1))
        k = min(n - 1, max(0, k))
        im = Image.open('%s/p/%05d.jpg' % (work, k)).convert('RGB')
        for kind in kinds:
            if kind == 'plate':
                im.save(f'{work}/stills/plate{lab}.jpg', quality=92)
                im.resize((324, 576), Image.LANCZOS).save(f'{work}/stills/plate{lab}s.jpg', quality=90)
            else:
                ar = np.asarray(im)
                al = fill_holes(mat(ar, settle=True))
                c = Image.fromarray(np.dstack([ar, al]), 'RGBA')
                c.save(f'{work}/stills/cut{lab}.png', compress_level=1)
                c.resize((324, 576), Image.LANCZOS).save(f'{work}/stills/cut{lab}s.png')
    print('matte done', len(frames_), 'frames,', len(need['stills']), 'stills', flush=True)


if __name__ == '__main__':
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    sub = ap.add_subparsers(dest='cmd', required=True)
    f = sub.add_parser('frames')
    f.add_argument('clip')
    f.add_argument('work')
    f.add_argument('--from', dest='t0', type=float, default=0)
    f.add_argument('--to', dest='t1', type=float, default=None)
    f.add_argument('--no-fit', action='store_true', help='keep your framing, only scale and centre-crop to 1080x1920')
    m = sub.add_parser('matte')
    m.add_argument('work')
    m.add_argument('need')
    a = ap.parse_args()
    frames(a) if a.cmd == 'frames' else matte(a)
