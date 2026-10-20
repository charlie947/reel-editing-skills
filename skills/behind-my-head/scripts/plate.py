#!/usr/bin/env python3
"""Optional depth step: the room without you in it (a clean plate).

Reads  <video>/face/NNNNNN.jpg and <video>/cut/NNNNNN.webp (run matte.py first, same range)
Writes <video>/plate.jpg

The template blurs this plate behind the page and pushes the camera in slowly.
Your blurred ghost never shows, because you are not in the plate.
Only for a camera on a tripod. A handheld shot moves, so the plate will not line up.

  python3 plate.py my-video --from 12.4 --to 17.0
"""
import argparse
import os
import sys
import warnings

import numpy as np
from PIL import Image, ImageFilter

ap = argparse.ArgumentParser()
ap.add_argument('video')
ap.add_argument('--from', dest='t0', type=float, default=0.0)
ap.add_argument('--to', dest='t1', type=float, required=True)
ap.add_argument('--fps', type=float, default=30.0)
a = ap.parse_args()

n0, n1 = round(a.t0 * a.fps) + 1, round(a.t1 * a.fps) + 1
S = (540, 960)  # work at half size, then scale up. The plate is blurred anyway
acc, msk = [], []
for n in range(n0, n1 + 1, 3):
    cut = None
    for ext in ('webp', 'png'):
        p = os.path.join(a.video, 'cut', f'{n:06d}.{ext}')
        if os.path.exists(p):
            cut = p
            break
    face = os.path.join(a.video, 'face', f'{n:06d}.jpg')
    if not cut or not os.path.exists(face):
        continue
    al = np.asarray(Image.open(cut).resize(S, Image.BILINEAR).getchannel('A').filter(ImageFilter.MaxFilter(7)), np.float32) / 255
    acc.append(np.asarray(Image.open(face).convert('RGB').resize(S, Image.BILINEAR), np.float32))
    msk.append(al < .04)
if not acc:
    sys.exit('No frame pairs found. Run matte.py on the same range first.')

acc, msk = np.stack(acc), np.stack(msk)
# per pixel: the median colour over the frames where you are not covering it
with warnings.catch_warnings():
    warnings.simplefilter('ignore', RuntimeWarning)  # pixels you always cover are all-NaN. They are filled below
    plate = np.nan_to_num(np.nanmedian(np.where(msk[..., None], acc, np.nan), axis=0))
known = msk.sum(0) >= 2


def box(x, r, ax):
    p = np.pad(x, [(r + 1, r) if i == ax else (0, 0) for i in range(x.ndim)], mode='edge')
    c = np.cumsum(p, axis=ax, dtype=np.float64)
    hi = np.take(c, range(2 * r + 1, c.shape[ax]), axis=ax)
    lo = np.take(c, range(0, c.shape[ax] - 2 * r - 1), axis=ax)
    return ((hi - lo) / (2 * r + 1)).astype(np.float32)


def blur(x, r):
    r = max(1, int(r * .6))
    for _ in range(3):
        x = box(box(x, r, 0), r, 1)
    return x


# the pixels you always cover: fill them from the room around them, growing the radius
for r in (8, 24, 60, 140, 320):
    w = known.astype(np.float32)
    den = blur(w, r) + 1e-6
    fill = np.stack([blur(plate[..., c] * w, r) / den for c in range(3)], -1)
    upd = (~known) & (den > .02)
    plate[upd] = fill[upd]
    known |= upd

out = os.path.join(a.video, 'plate.jpg')
Image.fromarray(np.clip(plate, 0, 255).astype(np.uint8)).resize((1080, 1920), Image.BICUBIC).save(out, quality=93)
print('plate:', out, '| pixels never seen:', int((~known).sum()))
