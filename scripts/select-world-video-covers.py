#!/usr/bin/env python3
"""Extract eight review frames per local Sanremo video and assemble a cover sheet.

Dependencies: Pillow, NumPy, and ffmpeg (or IMAGEIO_FFMPEG_EXE).
The sheet is a review artifact; approved covers are copied separately.
"""

from __future__ import annotations

import argparse
import json
import math
import os
from pathlib import Path
import re
import subprocess

import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent


def ffmpeg_path() -> str:
    if os.getenv("IMAGEIO_FFMPEG_EXE"):
        return os.environ["IMAGEIO_FFMPEG_EXE"]
    try:
        import imageio_ffmpeg

        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return "ffmpeg"


def probe(path: Path, executable: str) -> tuple[float, int, int]:
    result = subprocess.run([executable, "-hide_banner", "-i", str(path)], capture_output=True, text=True)
    duration = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", result.stderr)
    size = re.search(r"Video:.*?(\d{2,5})x(\d{2,5})", result.stderr)
    if not duration or not size:
        raise ValueError(f"Could not read video metadata: {path}")
    seconds = int(duration[1]) * 3600 + int(duration[2]) * 60 + float(duration[3])
    return seconds, int(size[1]), int(size[2])


def extract(executable: str, video: Path, second: float, destination: Path) -> None:
    subprocess.run(
        [executable, "-hide_banner", "-loglevel", "error", "-ss", f"{second:.3f}", "-i", str(video),
         "-frames:v", "1", "-vf", "scale=640:-2", "-y", str(destination)],
        check=True, capture_output=True,
    )


def measures(path: Path) -> tuple[float, float, float]:
    rgb = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32) / 255.0
    gray = rgb[..., 0] * 0.2126 + rgb[..., 1] * 0.7152 + rgb[..., 2] * 0.0722
    laplacian = gray[:-2, 1:-1] + gray[2:, 1:-1] + gray[1:-1, :-2] + gray[1:-1, 2:] - 4 * gray[1:-1, 1:-1]
    sharpness = float(np.var(laplacian) * 1_000_000)
    brightness = float(gray.mean())
    contrast = float(gray.std())
    return sharpness, brightness, contrast


def difference(first: Path, second: Path) -> float:
    a = np.asarray(Image.open(first).convert("RGB").resize((160, 90)), dtype=np.float32)
    b = np.asarray(Image.open(second).convert("RGB").resize((160, 90)), dtype=np.float32)
    return float(np.abs(a - b).mean() / 255.0)


def font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in ("/System/Library/Fonts/Supplemental/Arial Unicode.ttf", "/System/Library/Fonts/Helvetica.ttc"):
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--review-dir", type=Path, required=True)
    args = parser.parse_args()
    review_dir = args.review_dir.resolve()
    review_dir.mkdir(parents=True, exist_ok=True)
    executable = ffmpeg_path()
    posts = [post for post in json.loads((ROOT / "data/world-posts.json").read_text()) if post.get("video")]
    manifest = []
    for post in posts:
        post_id = post["id"]
        video = ROOT / "public" / (post.get("videoSrc") or "").lstrip("/") if post.get("videoSrc") else None
        if not video or not video.exists():
            manifest.append({"id": post_id, "title": post["title"], "status": "missing-video", "candidates": []})
            continue
        duration, width, height = probe(video, executable)
        items = []
        for index in range(8):
            second = duration * (0.1 + index * 0.8 / 7)
            target = review_dir / f"{post_id}-frame-{index + 1}.jpg"
            later = review_dir / f"{post_id}-frame-{index + 1}-later.jpg"
            extract(executable, video, second, target)
            extract(executable, video, min(second + 0.22, duration * 0.95), later)
            sharpness, brightness, contrast = measures(target)
            movement = difference(target, later)
            later.unlink()
            valid = sharpness >= 55 and brightness >= 0.25 and movement < 0.38
            score = math.log1p(sharpness) + contrast * 5 - abs(brightness - 0.58) * 2 - movement * 3
            items.append({"number": index + 1, "second": round(second, 2), "file": str(target),
                          "sharpness": round(sharpness, 1), "brightness": round(brightness, 3),
                          "motion": round(movement, 3), "valid": valid, "score": round(score, 3)})
        valid_items = [item for item in items if item["valid"]]
        selected = sorted(valid_items or items, key=lambda item: item["score"], reverse=True)[:3]
        selected.sort(key=lambda item: item["number"])
        chosen = max(selected, key=lambda item: item["score"])
        manifest.append({"id": post_id, "title": post["title"], "status": "ready", "duration": duration,
                         "width": width, "height": height, "frames": items,
                         "candidates": selected, "chosen": chosen["number"]})
    (review_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")

    column_width, image_height, row_height, label_width = 350, 220, 282, 290
    sheet = Image.new("RGB", (label_width + column_width * 3 + 40, row_height * len(manifest) + 80), "#f7f7f4")
    draw = ImageDraw.Draw(sheet)
    title_font, label_font, small_font = font(24), font(18), font(14)
    draw.text((24, 20), "Sanremo в мире · варианты обложек", fill="#1b1b1b", font=title_font)
    for row, item in enumerate(manifest):
        y = 80 + row * row_height
        draw.text((22, y + 12), f"#{item['id']}", fill="#1b1b1b", font=label_font)
        draw.text((22, y + 44), item["title"][:25], fill="#555", font=small_font)
        if item["status"] == "missing-video":
            draw.text((label_width + 16, y + 70), "MP4 не найден в публичном embed Telegram — нужен файл от Сергея", fill="#705042", font=label_font)
        for col, candidate in enumerate(item["candidates"]):
            x = label_width + 8 + col * column_width
            frame = Image.open(candidate["file"]).convert("RGB")
            tile = ImageOps.contain(frame, (column_width - 14, image_height), Image.Resampling.LANCZOS)
            sheet.paste(tile, (x + (column_width - 14 - tile.width) // 2, y + 12 + (image_height - tile.height) // 2))
            chosen = candidate["number"] == item["chosen"]
            draw.rectangle((x, y + 8, x + column_width - 14, y + image_height + 16), outline="#a65b34" if chosen else "#d0d0ca", width=5 if chosen else 1)
            caption = f"Кадр {candidate['number']} · {candidate['second']:.1f} c"
            draw.text((x + 6, y + image_height + 23), caption, fill="#a65b34" if chosen else "#333", font=label_font)
            draw.text((x + 6, y + image_height + 49), f"резк. {candidate['sharpness']:.0f} · свет {candidate['brightness']:.0%}", fill="#777", font=small_font)
    sheet.save(review_dir / "contact-sheet.png", optimize=True)
    print(f"videos={sum(item['status']=='ready' for item in manifest)} missing={sum(item['status']!='ready' for item in manifest)}")
    print(review_dir / "contact-sheet.png")


if __name__ == "__main__":
    main()
