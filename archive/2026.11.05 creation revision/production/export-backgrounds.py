# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0"]
# ///
"""Export selected Creation backgrounds without changing their painted proportions.

Run ``uv run projects/creation-study/production/export-backgrounds.py``.
The additive manifest owns selected sources, destinations and framing. This script
does not edit the manuscript. ``--verify`` re-renders and compares encoded bytes.
"""
from __future__ import annotations

import argparse
import hashlib
from io import BytesIO
import json
import math
from pathlib import Path

import PIL
from PIL import Image, features

HERE = Path(__file__).resolve().parent
ROOT = next(p for p in HERE.parents if (p / "src/story/parser.ts").is_file())


def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def encoded_json(value: object) -> bytes:
    return (json.dumps(value, indent=2, sort_keys=True) + "\n").encode()


def ellipse_mask(size: tuple[int, int], geometry: dict) -> Image.Image:
    """A registered, feathered extraction mask; never generates painted content."""
    width, height = size
    cx, cy = geometry['centre']
    rx, ry = geometry['radii']
    inner = geometry['innerScale']
    values = bytearray(width * height)
    for y in range(height):
        dy2 = (((y + .5) / height - cy) / ry) ** 2
        for x in range(width):
            distance = math.sqrt((((x + .5) / width - cx) / rx) ** 2 + dy2)
            t = min(1, max(0, (distance - inner) / (1 - inner)))
            values[y * width + x] = round(255 * (1 - t * t * (3 - 2 * t)))
    return Image.frombytes('L', size, bytes(values))


def render(entry: dict, defaults: dict) -> tuple[bytes, dict]:
    source = ROOT / entry["source"]
    source_bytes = source.read_bytes()
    if digest(source_bytes) != entry["sourceSha256"]:
        raise ValueError(f'{entry["id"]}: source hash changed')
    image = Image.open(BytesIO(source_bytes)).convert("RGBA")
    if image.getchannel("A").getextrema() != (255, 255):
        raise ValueError(f'{entry["id"]}: background source must be opaque')
    size = entry.get("size", defaults["size"])
    if len(size) != 2 or any(type(n) is not int or n <= 0 for n in size):
        raise ValueError(f'{entry["id"]}: size must be two positive integers')
    width, height = image.size
    if "sourceBox" in entry:
        box = entry["sourceBox"]
    else:
        anchor = entry.get("anchor", [0.5, 0.5])
        if len(anchor) != 2 or any(not 0 <= n <= 1 for n in anchor):
            raise ValueError(f'{entry["id"]}: anchor must lie in [0,1]')
        scale = max(size[0] / width, size[1] / height)
        crop_width, crop_height = size[0] / scale, size[1] / scale
        left, top = (width - crop_width) * anchor[0], (height - crop_height) * anchor[1]
        box = [left, top, left + crop_width, top + crop_height]
    if len(box) != 4 or any(not isinstance(n, (int, float)) or not math.isfinite(n) for n in box):
        raise ValueError(f'{entry["id"]}: sourceBox must contain four finite numbers')
    left, top, right, bottom = box
    if not (0 <= left < right <= width and 0 <= top < bottom <= height):
        raise ValueError(f'{entry["id"]}: sourceBox lies outside source')
    scale_x, scale_y = size[0] / (right - left), size[1] / (bottom - top)
    if not math.isclose(scale_x, scale_y, rel_tol=1e-9):
        raise ValueError(f'{entry["id"]}: sourceBox would distort painted proportions')
    framed = image.convert("RGB").resize(tuple(size), Image.Resampling.LANCZOS, box=tuple(box))
    shared = entry.get('sharedOuterSource')
    if shared:
        outer_path = ROOT / shared['source']
        if digest(outer_path.read_bytes()) != shared['sourceSha256']:
            raise ValueError('Shared outer nebula source hash changed')
        outer = Image.open(outer_path).convert('RGB')
        if outer.size != image.size:
            raise ValueError('Registered opening sources must have identical dimensions')
        outer = outer.resize(tuple(size), Image.Resampling.LANCZOS, box=tuple(box))
        framed = Image.composite(framed, outer, ellipse_mask(tuple(size), shared['fillMask']))
    settings = {**defaults["webp"], **entry.get("webp", {})}
    output = BytesIO()
    framed.save(output, format="WEBP", **settings)
    data = output.getvalue()
    record = {
        "id": entry["id"], "source": entry["source"], "sourceSha256": digest(source_bytes),
        "sourceSize": [width, height], "sourceBox": box, "scale": scale_x,
        "output": entry["output"], "outputSize": size, "outputSha256": digest(data),
        "outputBytes": len(data), "resampling": "Pillow LANCZOS", "webp": settings,
        "requestId": entry.get("requestId"), "chapterIds": entry.get("chapterIds", []),
    }
    if shared:
        record['sharedOuterSource'] = shared
    return data, record


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=HERE / "background-manifest.json")
    parser.add_argument("--record", type=Path, default=HERE / "background-exports.json")
    parser.add_argument("--ids", nargs="+", help="Export selected IDs and merge their records")
    parser.add_argument("--verify", action="store_true", help="Re-render and compare without writing")
    args = parser.parse_args()
    manifest = json.loads(args.manifest.read_text())
    all_entries = manifest["backgrounds"]
    ids = [entry["id"] for entry in all_entries]
    outputs = [entry["output"] for entry in all_entries]
    if len(ids) != len(set(ids)) or len(outputs) != len(set(outputs)):
        raise ValueError("Manifest IDs and output paths must be unique")
    if args.ids and set(args.ids) - set(ids):
        raise ValueError(f"Unknown IDs: {sorted(set(args.ids) - set(ids))}")
    entries = [entry for entry in all_entries if not args.ids or entry["id"] in args.ids]
    prepared = [(entry, *render(entry, manifest["defaults"])) for entry in entries]
    renderer = {"scriptVersion": 1, "pillow": PIL.__version__, "webp": features.version("webp")}
    prior = json.loads(args.record.read_text()) if args.record.exists() else {}
    if args.verify:
        if prior.get("renderer") != renderer:
            raise ValueError("Recorded renderer differs from the current environment")
        recorded = {entry["id"]: entry for entry in prior.get("backgrounds", [])}
        for entry, data, record in prepared:
            if (ROOT / entry["output"]).read_bytes() != data or recorded.get(entry["id"]) != record:
                raise ValueError(f'{entry["id"]}: exported bytes or framing record differ')
    else:
        records = {entry["id"]: entry for entry in prior.get("backgrounds", [])} if args.ids else {}
        for entry, data, record in prepared:
            destination = ROOT / entry["output"]
            destination.parent.mkdir(parents=True, exist_ok=True)
            if not destination.exists() or destination.read_bytes() != data:
                destination.write_bytes(data)
            records[entry["id"]] = record
        args.record.write_bytes(encoded_json({"renderer": renderer, "backgrounds": [records[k] for k in sorted(records)]}))
    print(f'{"Verified" if args.verify else "Exported"} {len(prepared)} backgrounds; {sum(len(data) for _, data, _ in prepared):,} bytes')


if __name__ == "__main__":
    main()
