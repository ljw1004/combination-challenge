# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0"]
# ///
"""Reproduce the registered Advancing ice landscape layer without painting."""
from __future__ import annotations

import argparse
import hashlib
from io import BytesIO
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

HERE = Path(__file__).resolve().parent


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--verify", action="store_true")
    parser.add_argument("--proof-dir", type=Path, help="Optional disposable composite/proof directory, normally under runs/")
    args = parser.parse_args()
    root = next(p for p in HERE.parents if (p / "src/story/parser.ts").is_file())
    layout_path = HERE / "ice-layout.json"
    layout = json.loads(layout_path.read_text())

    def selected(entry: dict) -> Path:
        base = root if entry["base"] == "repository" else HERE
        path = (base / entry["path"]).resolve()
        if not path.is_relative_to(root):
            raise ValueError("Source must remain within repository")
        if digest(path.read_bytes()) != entry["sha256"]:
            raise ValueError(f"Selected source hash mismatch: {path}")
        return path

    background = Image.open(selected(layout["background"])).convert("RGBA")
    master = Image.open(selected(layout["selectedMaster"])).convert("RGBA")
    assert list(background.size) == layout["background"]["size"]
    assert list(master.size) == layout["selectedMaster"]["size"]
    for entry in layout["references"]:
        selected(entry)
    size = tuple(layout["normalization"]["size"])
    normalized = ImageOps.fit(master, size, method=Image.Resampling.LANCZOS,
                              centering=tuple(layout["normalization"]["centering"]))
    scale = layout["masks"]["supersampling"]
    mask = Image.new("L", (size[0] * scale, size[1] * scale), 0)
    draw = ImageDraw.Draw(mask)
    for polygon in layout["masks"]["polygons"]:
        draw.polygon([(x * scale, y * scale) for x, y in polygon], fill=255)
    mask = mask.resize(size, Image.Resampling.LANCZOS)
    mask = mask.filter(ImageFilter.GaussianBlur(layout["masks"]["edgeBlurSourcePixels"]))
    normalized.putalpha(mask)
    sprite = normalized.crop(tuple(layout["sprite"]["sourceBounds"]))
    sprite = sprite.resize(tuple(layout["sprite"]["outputSize"]), Image.Resampling.LANCZOS)
    encoded = BytesIO()
    sprite.save(encoded, format="PNG", optimize=True)
    data = encoded.getvalue()
    target = args.output or (HERE / layout["output"]).resolve()
    if args.verify:
        if not target.is_file() or target.read_bytes() != data:
            raise ValueError(f"Registered ice export differs: {target}")
    else:
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)
    if args.proof_dir:
        args.proof_dir.mkdir(parents=True, exist_ok=True)
        composite = Image.alpha_composite(background, normalized)
        composite.save(args.proof_dir / "registered-composite.png")
        composite.resize((390, 844), Image.Resampling.LANCZOS).save(args.proof_dir / "native-composite.png")
        mask.save(args.proof_dir / "registered-mask.png")
    print(json.dumps({"verified": args.verify, "output": str(target),
                      "size": list(sprite.size), "sha256": digest(data),
                      "layoutSha256": digest(layout_path.read_bytes())}, indent=2))


if __name__ == "__main__":
    main()
