"""
Extract frames from the green-screen footage into a WebP sequence: colour in
f{i}.webp, the matte as grayscale in a{i}.webp.

  python3 scripts/extract-portrait.py

In  : assets-src/snit-video-green.mp4   (1080x1080, 253 frames @ 59.35fps)
Out : public/portrait/f000.webp ... f119.webp
      public/portrait/a000.webp ... a119.webp  + manifest.json

Colour and matte live in separate files so each gets the bitrate it needs:
the matte is near-binary and survives heavy compression, so the budget goes
into the face instead. (A single WebP with a real alpha channel is not an
option — libwebp always encodes alpha losslessly, ~50 KB/frame here.)

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
SIZE = 1080         # native source resolution — never upscale, never downscale
RGB_QUALITY = 92    # the one knob that matters for sharpness (and for weight)
ALPHA_QUALITY = 80  # the matte is flat; past this the extra bytes buy nothing
SHARPEN = 0.6       # unsharp amount, to offset the browser's upscale blur
SHARPEN_RADIUS = 1.2
TURN_SRC = 140      # source frame where the head turn starts
IDLE_N, TURN_N = 40, 80


def key_frame(bgr):
    """Color-difference matte + despill. Returns (rgb float, alpha float)."""
    f = bgr.astype(np.float32) / 255.0
    B, G, R = f[:, :, 0], f[:, :, 1], f[:, :, 2]
    mx = np.maximum(R, B)
    a = np.clip(1.0 - np.clip((G - mx) * 1.6 / 0.35, 0, 1), 0, 1)
    # Pull green down to the other two channels and stop there. Re-adding the
    # removed green into R and B tints every soft edge magenta, which reads as
    # a dirty outline around the hair once composited on the dark page.
    out = f.copy()
    out[:, :, 1] = np.minimum(G, mx)
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


def unsharp(rgb):
    """The canvas is drawn larger than 1080px on most screens, and the source
    is already soft from video compression. A light unsharp pass is what the
    browser's bilinear upscale cannot give back. Runs after edge_extend so the
    halo picks up subject colour, not background."""
    if SHARPEN <= 0:
        return rgb
    f = rgb.astype(np.float32)
    blur = cv2.GaussianBlur(f, (0, 0), SHARPEN_RADIUS)
    return np.clip(f + (f - blur) * SHARPEN, 0, 255).astype(np.uint8)


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
    rgb_bytes = alpha_bytes = 0
    for i, src_i in enumerate(idx):
        src = frames[src_i]
        if src.shape[0] != SIZE:
            src = cv2.resize(src, (SIZE, SIZE), interpolation=cv2.INTER_AREA)
        rgbf, a = key_frame(src)
        rgbf = edge_extend(rgbf, a)
        rgb = unsharp((rgbf[:, :, ::-1] * 255).astype(np.uint8))

        rgb_path = f"{OUT}/f{i:03d}.webp"
        Image.fromarray(rgb).save(rgb_path, "WEBP", quality=RGB_QUALITY, method=6)
        rgb_bytes += os.path.getsize(rgb_path)

        a_path = f"{OUT}/a{i:03d}.webp"
        am = np.dstack([(a * 255).astype(np.uint8)] * 3)
        Image.fromarray(am).save(a_path, "WEBP", quality=ALPHA_QUALITY, method=6)
        alpha_bytes += os.path.getsize(a_path)

    manifest = {
        "count": len(idx),
        "size": SIZE,
        "turnStart": IDLE_N,
        "rgbPattern": "f{i}.webp",
        "alphaPattern": "a{i}.webp",
    }
    with open(f"{OUT}/manifest.json", "w") as fh:
        json.dump(manifest, fh)

    total = rgb_bytes + alpha_bytes
    per = len(idx) * 1024
    print(f"wrote {len(idx)} frames @ {SIZE}px  rgb q{RGB_QUALITY} / alpha q{ALPHA_QUALITY}"
          f"  sharpen {SHARPEN}")
    print(f"  turn starts at index {IDLE_N}")
    print(f"  rgb   {rgb_bytes / 1024 / 1024:5.2f} MB  ({rgb_bytes / per:.1f} KB/frame)")
    print(f"  alpha {alpha_bytes / 1024 / 1024:5.2f} MB  ({alpha_bytes / per:.1f} KB/frame)")
    print(f"  total {total / 1024 / 1024:5.2f} MB  ({total / per:.1f} KB/frame)")


if __name__ == "__main__":
    main()
