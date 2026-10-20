"""
Prepares the supplied MIQNAF logo for the app (requires Pillow):
  public/images/miqnaf-logo.png    tight crop, used for the logo on light panels
  public/images/miqnaf-puzzle.png  logo centred on a 1000x290 (about 3.4:1) canvas, hidden behind the 5 puzzle pieces

Usage: python scripts/prepare-logo.py path/to/logo.jpg
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops

OUT = Path(__file__).resolve().parent.parent / "public" / "images"


def main(src: str) -> None:
    img = Image.open(src).convert("RGB")
    bg = img.getpixel((5, 5))
    diff = ImageChops.difference(img, Image.new("RGB", img.size, bg)).convert("L")
    bbox = diff.point(lambda v: 255 if v > 24 else 0).getbbox()
    if not bbox:
        raise SystemExit("Could not find the logo on the background.")
    left, top, right, bottom = bbox
    pad = round((bottom - top) * 0.08)
    logo = img.crop((max(0, left - pad), max(0, top - pad), min(img.width, right + pad), min(img.height, bottom + pad)))
    OUT.mkdir(parents=True, exist_ok=True)
    logo.save(OUT / "miqnaf-logo.png", optimize=True)

    # Puzzle canvas at the board's aspect ratio (see lib/puzzle.ts PUZZLE_VIEW), logo at 84% of the height.
    canvas_w, canvas_h = 2000, 580
    scale = (canvas_h * 0.84) / logo.height
    if logo.width * scale > canvas_w * 0.9:
        scale = (canvas_w * 0.9) / logo.width
    resized = logo.resize((round(logo.width * scale), round(logo.height * scale)), Image.LANCZOS)
    canvas = Image.new("RGB", (canvas_w, canvas_h), bg)
    canvas.paste(resized, ((canvas_w - resized.width) // 2, (canvas_h - resized.height) // 2))
    canvas.save(OUT / "miqnaf-puzzle.png", optimize=True)

    print(f"background {bg}, logo crop {logo.size}")
    for f in ("miqnaf-logo.png", "miqnaf-puzzle.png"):
        print(f, (OUT / f).stat().st_size // 1024, "KB")


if __name__ == "__main__":
    main(sys.argv[1])
