#!/usr/bin/env python3
"""Cut you out of your video, frame by frame.

Reads  <video>/face/NNNNNN.jpg   (the frames video-intake writes)
Writes <video>/cut/NNNNNN.webp   the same frame, background transparent, same numbers
Prints the top of your head in frame pixels. The templates take it as headTop.

  pip install torch torchvision pillow numpy     (once. scipy is optional, it fills small holes)
  python3 matte.py my-video --from 12.4 --to 17.0

Only matte the beats that need it. A full video of cut-outs takes a lot of disk.
Model: RobustVideoMatting, free, runs on your machine. torch.hub downloads it once from GitHub.
Runs on Apple Silicon (mps), an NVIDIA card (cuda) or the CPU (slow, but it works).
"""
import argparse
import os
import sys

import numpy as np
import torch
from PIL import Image

ap = argparse.ArgumentParser(description='Cut the speaker out of face/ frames into cut/')
ap.add_argument('video', help='the video folder from video-intake (holds face/)')
ap.add_argument('--from', dest='t0', type=float, default=0.0, help='beat start, seconds in the cut')
ap.add_argument('--to', dest='t1', type=float, default=None, help='beat end, seconds in the cut')
ap.add_argument('--fps', type=float, default=30.0)
ap.add_argument('--model', default='resnet50', choices=['resnet50', 'mobilenetv3'],
                help='resnet50 = cleaner hair, mobilenetv3 = about 3x faster')
ap.add_argument('--png', action='store_true', help='write PNG instead of WebP (about 10x the disk)')
a = ap.parse_args()

face = os.path.join(a.video, 'face')
out = os.path.join(a.video, 'cut')
os.makedirs(out, exist_ok=True)
count = len([f for f in os.listdir(face) if f.endswith('.jpg')]) if os.path.isdir(face) else 0
if not count:
    sys.exit(f'No frames in {face}. Run video-intake first.')

# same frame number rule as the starter: frame = round(t * fps) + 1
n0 = max(1, round(a.t0 * a.fps) + 1)
n1 = count if a.t1 is None else min(count, round(a.t1 * a.fps) + 2)
warm = max(1, n0 - 15)  # the model remembers past frames, so start a little early and throw those away

dev = 'mps' if torch.backends.mps.is_available() else ('cuda' if torch.cuda.is_available() else 'cpu')
model = torch.hub.load('PeterL1n/RobustVideoMatting', a.model, trust_repo=True).eval().to(dev)

try:
    from scipy import ndimage
except ImportError:
    ndimage = None

rec = [None] * 4
tops = []
ext = 'png' if a.png else 'webp'
with torch.no_grad():
    for n in range(warm, n1 + 1):
        path = os.path.join(face, f'{n:06d}.jpg')
        im = np.asarray(Image.open(path).convert('RGB'))
        x = torch.from_numpy(im.copy()).to(dev).permute(2, 0, 1).unsqueeze(0).float() / 255
        fgr, pha, *rec = model(x, *rec, downsample_ratio=0.25)
        if n < n0:
            continue
        al = (pha[0, 0].clamp(0, 1).cpu().numpy() * 255).astype(np.uint8)
        solid = al > 128
        if ndimage is not None:
            # fill small holes inside you (a mic, a dark shirt) but never a real gap, like the space between arm and body
            holes = ndimage.binary_fill_holes(solid) & ~solid
            lab, k = ndimage.label(holes)
            if k:
                sizes = ndimage.sum(holes, lab, range(1, k + 1))
                small = np.isin(lab, 1 + np.flatnonzero(sizes < 2500))
                al[small] = 255
        rows = np.flatnonzero(solid.sum(1) > 30)
        if len(rows):
            tops.append(int(rows[0]))
        rgba = Image.fromarray(np.dstack([im, al]))
        dst = os.path.join(out, f'{n:06d}.{ext}')
        if a.png:
            rgba.save(dst, compress_level=3)
        else:
            rgba.save(dst, 'WEBP', quality=92, alpha_quality=100, method=4)
        if (n - n0) % 30 == 0:
            print(f'  frame {n}/{n1}', flush=True)

print(f'cut-outs: {out}/{n0:06d}.{ext} to {n1:06d}.{ext}')
if tops:
    print(f'headTop: {int(np.median(tops))}   (highest {min(tops)}, lowest {max(tops)}, frame pixels)')
else:
    print('headTop: none found. Is the person in these frames?')
