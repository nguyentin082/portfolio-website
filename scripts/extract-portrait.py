"""
Extract frames from the green-screen footage into a "packed" WebP sequence
(RGB on the left half, alpha on the right).

  python3 scripts/extract-portrait.py

In  : assets-src/snit-video-green.mp4   (1080x1080, 253 frames @ 59.35fps)
Out : public/portrait/f000.webp ... f119.webp  + manifest.json

Sampling is uneven on purpose: sparse over the idle stretch, dense over the
head turn, where the motion actually is.
"""
import json
import os

import cv2
import numpy as np
from PIL import Image

SRC = "assets-src/snit-video-green.mp4"
OUT = "public/portrait"
SIZE = 960
QUALITY = 72
TURN_SRC = 140      # source frame where the head turn starts
IDLE_N, TURN_N = 40, 80


def key_frame(bgr):
    """Color-difference matte + despill. Returns (rgb float, alpha float)."""
    f = bgr.astype(np.float32) / 255.0
    B, G, R = f[:, :, 0], f[:, :, 1], f[:, :, 2]
    mx = np.maximum(R, B)
    a = np.clip(1.0 - np.clip((G - mx) * 1.6 / 0.35, 0, 1), 0, 1)
    spill = np.clip(G - mx, 0, None)
    out = f.copy()
    out[:, :, 1] = G - spill
    out[:, :, 0] = B + spill * 0.35
    out[:, :, 2] = R + spill * 0.65
    return np.clip(out, 0, 1), a


def edge_extend(rgb, a, iters=12):
    """Bleed subject color into the transparent area to cut lossy artifacts."""
    solid = (a > 0.5).astype(np.uint8)
    filled = (rgb * solid[:, :, None]).astype(np.float32)
    k = np.ones((3, 3), np.uint8)
    for _ in range(iters):
        grown = cv2.dilate(solid, k)
        new = (grown - solid).astype(bool)
        if not new.any():
            break
        blur = cv2.blur(filled, (5, 5))
        cnt = cv2.blur(solid.astype(np.float32), (5, 5))
        with np.errstate(invalid="ignore", divide="ignore"):
            avg = np.where(cnt[:, :, None] > 0, blur / np.maximum(cnt[:, :, None], 1e-6), 0)
        filled[new] = avg[new]
        solid = grown
    return np.where((a > 0.5)[:, :, None], rgb, filled)


def main():
    cap = cv2.VideoCapture(SRC)
    frames = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    cap.release()
    n = len(frames)
    print(f"read {n} frames from {SRC}")

    idx = np.concatenate([
        np.linspace(0, TURN_SRC, IDLE_N, endpoint=False),
        np.linspace(TURN_SRC, n - 1, TURN_N),
    ]).round().astype(int)

    os.makedirs(OUT, exist_ok=True)
    total = 0
    for i, src_i in enumerate(idx):
        small = cv2.resize(frames[src_i], (SIZE, SIZE), interpolation=cv2.INTER_AREA)
        rgbf, a = key_frame(small)
        rgbf = edge_extend(rgbf, a)
        rgb = (rgbf[:, :, ::-1] * 255).astype(np.uint8)
        am = np.dstack([(a * 255).astype(np.uint8)] * 3)
        path = f"{OUT}/f{i:03d}.webp"
        Image.fromarray(np.hstack([rgb, am])).save(path, "WEBP", quality=QUALITY, method=6)
        total += os.path.getsize(path)

    manifest = {
        "count": len(idx),
        "size": SIZE,
        "turnStart": IDLE_N,
        "pattern": "f{i}.webp",
    }
    with open(f"{OUT}/manifest.json", "w") as fh:
        json.dump(manifest, fh)

    print(f"wrote {len(idx)} frames @ {SIZE}px q{QUALITY}")
    print(f"  turn starts at index {IDLE_N}")
    print(f"  total {total / 1024 / 1024:.2f} MB  ({total / len(idx) / 1024:.1f} KB/frame)")


if __name__ == "__main__":
    main()
