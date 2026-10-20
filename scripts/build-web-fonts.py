"""
Converts the supplied fonts in public/fonts into browser-ready WOFF2 files in
public/fonts/web. Browsers only read the first face of a .ttc collection, so the
Helvetica Neue weights used by the UI are extracted individually.

Usage (requires: pip install fonttools brotli):
    python scripts/build-web-fonts.py
"""
from pathlib import Path

from fontTools.ttLib import TTCollection, TTFont

ROOT = Path(__file__).resolve().parent.parent / "public" / "fonts"
OUT = ROOT / "web"

# Face index in HelveticaNeue.ttc -> output file name
HELVETICA_FACES = {
    0: "HelveticaNeue-Regular.woff2",
    10: "HelveticaNeue-Medium.woff2",
    1: "HelveticaNeue-Bold.woff2",
    2: "HelveticaNeue-Italic.woff2",
}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    acumin = TTFont(ROOT / "AcuminVariableConcept.otf")
    acumin.flavor = "woff2"
    acumin.save(OUT / "AcuminVariableConcept.woff2")

    collection = TTCollection(ROOT / "HelveticaNeue.ttc")
    for index, name in HELVETICA_FACES.items():
        font = collection.fonts[index]
        font.flavor = "woff2"
        font.save(OUT / name)

    for file in sorted(OUT.glob("*.woff2")):
        print(f"{file.name}: {file.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
