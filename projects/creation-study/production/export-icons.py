# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow==13.0.0", "numpy==2.5.4"]
# ///
"""Export selected paintings using authored geometry and an exact circular frame.

Run with ``uv run production/export-icons.py`` from this study, or give the full
script path from any directory. Sources are repository-relative; output defaults
to this study's assets/icons. No automatic crop detection or painting occurs.
"""
from __future__ import annotations

import argparse
from functools import lru_cache
import hashlib
from io import BytesIO
import json
import math
from pathlib import Path
import re
import sys

import numpy as np
import PIL
from PIL import Image, features

HERE = Path(__file__).resolve().parent
PIPELINE_VERSION = 1


def repo_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / "package.json").is_file() and (candidate / "src/story/parser.ts").is_file():
            return candidate
    raise ValueError(f"Cannot locate repository above {start}")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def json_bytes(value: object) -> bytes:
    return (json.dumps(value, indent=2, sort_keys=True) + "\n").encode()


def finite_numbers(values: object, length: int, label: str) -> list[float]:
    if not isinstance(values, list) or len(values) != length or any(
        isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value)
        for value in values
    ):
        raise ValueError(f"{label}: expected {length} finite numbers")
    return values


def validate_frame(frame: dict) -> None:
    if not isinstance(frame.get("supersampling"), int) or not 2 <= frame["supersampling"] <= 16:
        raise ValueError("Frame supersampling must be an integer from 2 to 16")
    radii = finite_numbers(
        [frame.get(key) for key in ("pictureRadius", "ochreInnerRadius", "outerRadius")],
        3,
        "Frame radii",
    )
    if not 0 < radii[0] < radii[1] < radii[2] < 0.5:
        raise ValueError("Frame must satisfy 0 < picture < ochre inner < outer < 0.5")
    for key in ("ivoryRgb", "ochreRgb"):
        values = finite_numbers(frame.get(key), 3, key)
        if any(not isinstance(value, int) or not 0 <= value <= 255 for value in values):
            raise ValueError(f"{key}: expected three integer RGB values from 0 to 255")


def source_box(icon: dict, image: Image.Image, frame: dict) -> tuple[float, ...]:
    """Validate and return the exact source rectangle sampled onto the canvas."""
    geometry = icon["geometry"]
    label = icon["name"]
    if geometry.get("kind") == "ellipse":
        cx, cy = finite_numbers(geometry.get("center"), 2, f"{label} center")
        rx, ry = finite_numbers(geometry.get("radii"), 2, f"{label} radii")
        if rx <= 0 or ry <= 0:
            raise ValueError(f"{label}: ellipse radii must be positive")
        # The authored outer ellipse maps to the exact outer frame radius.
        # Keep its source RGB; the accepted replacement rim covers the edge.
        scale = 2 * frame["outerRadius"]
        box = (cx - rx / scale, cy - ry / scale, cx + rx / scale, cy + ry / scale)
    elif geometry.get("kind") == "square":
        box = tuple(finite_numbers(geometry.get("bounds"), 4, f"{label} square bounds"))
        x0, y0, x1, y1 = box
        if x1 <= x0 or not math.isclose(x1 - x0, y1 - y0, abs_tol=1e-6):
            raise ValueError(f"{label}: full-bleed crop must be a positive square")
        # Full-bleed art must already be opaque. The exporter supplies the
        # circular backing/frame; it never infers a generated border or alpha.
        alpha = image.getchannel("A").crop((math.floor(x0), math.floor(y0), math.ceil(x1), math.ceil(y1)))
        if alpha.getextrema() != (255, 255):
            raise ValueError(f"{label}: full-bleed square contains nonopaque source pixels")
    else:
        raise ValueError(f"{label}: geometry kind must be ellipse or square")
    if not (0 <= box[0] < box[2] <= image.width and 0 <= box[1] < box[3] <= image.height):
        raise ValueError(f"{label}: source rectangle {box} exceeds image {image.size}")
    return box


def load_plan(plan_path: Path, root: Path) -> tuple[dict, dict[str, Image.Image]]:
    plan = json.loads(plan_path.read_text())
    if plan.get("schemaVersion") != 1:
        raise ValueError("Unsupported icon plan schema")
    validate_frame(plan["frame"])
    sources = plan["sources"]
    images = {}
    for key, source in sources.items():
        relative = Path(source["path"])
        path = (root / relative).resolve()
        if relative.is_absolute() or not path.is_relative_to(root):
            raise ValueError(f"{key}: source path must stay within the repository")
        data = path.read_bytes()
        if sha256(data) != source["sha256"]:
            raise ValueError(f"{key}: source SHA-256 mismatch: {relative}")
        with Image.open(BytesIO(data)) as image:
            images[key] = image.convert("RGBA")
    names, slugs = set(), set()
    for icon in plan["icons"]:
        if not isinstance(icon.get("name"), str) or not icon["name"] or icon["name"] in names:
            raise ValueError("Icon names must be nonempty and unique")
        slug = icon.get("slug", "")
        if not isinstance(slug, str) or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug) or slug in slugs:
            raise ValueError(f"{icon['name']}: invalid or duplicate slug")
        if type(icon.get("large")) is not bool:
            raise ValueError(f"{icon['name']}: large must be true or false")
        if icon["source"] not in images:
            raise ValueError(f"{icon['name']}: unknown selected source")
        source_box(icon, images[icon["source"]], plan["frame"])
        names.add(icon["name"])
        slugs.add(slug)
    files = [name for icon in plan["icons"] for name, _size in presentations(icon)]
    if len(files) != len(set(files)):
        raise ValueError("Ordinary and large presentation filenames collide")
    return plan, images


def presentations(icon: dict) -> list[tuple[str, int]]:
    outputs = [(icon["slug"] + ".webp", 256)]
    if icon["large"]:
        outputs.append(("large-" + icon["slug"] + ".webp", 384))
    return outputs


@lru_cache(maxsize=2)
def radial_grid(size: int, supersampling: int) -> np.ndarray:
    high = size * supersampling
    yy, xx = np.mgrid[:high, :high]
    return np.hypot(xx + 0.5 - high / 2, yy + 0.5 - high / 2) / high


def render(icon: dict, source: Image.Image, frame: dict, size: int) -> bytes:
    high = size * frame["supersampling"]
    radius = radial_grid(size, frame["supersampling"])
    painting = source.convert("RGB").resize(
        (high, high), Image.Resampling.LANCZOS, box=source_box(icon, source, frame)
    ).convert("RGBA")
    rgba = np.array(painting)
    rgba[radius >= frame["pictureRadius"], :3] = frame["ivoryRgb"]
    rgba[radius >= frame["ochreInnerRadius"], :3] = frame["ochreRgb"]
    alpha = np.where(radius <= frame["outerRadius"], 255, 0).astype("uint8")
    rgba[:, :, 3] = alpha
    result = Image.fromarray(rgba).resize((size, size), Image.Resampling.LANCZOS)
    # Area-average the exact mask separately. Lanczos alpha causes translucent
    # ringing inside the backing and tiny stray pixels beyond the circle.
    result.putalpha(Image.fromarray(alpha).resize((size, size), Image.Resampling.BOX))
    buffer = BytesIO()
    result.save(buffer, format="WEBP", lossless=True, method=4)
    return buffer.getvalue()


def record_header(plan: dict) -> dict:
    return {
        "schemaVersion": 1,
        "pipelineVersion": PIPELINE_VERSION,
        "planSha256": sha256(json_bytes(plan)),
        "rendererSha256": sha256(Path(__file__).read_bytes()),
        "environment": {"pillow": PIL.__version__, "numpy": np.__version__, "webp": features.version("webp")},
        "sources": {key: source["sha256"] for key, source in plan["sources"].items()},
    }


def output_record(icon: dict, size: int, data: bytes) -> dict:
    return {
        "identity": icon["name"],
        "source": icon["source"],
        "geometrySha256": sha256(json_bytes(icon["geometry"])),
        "dimensions": [size, size],
        "sha256": sha256(data),
    }


def atomic_write(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_bytes(data)
    temporary.replace(path)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--plan", type=Path, default=HERE / "icon-plan.json")
    parser.add_argument("--output", type=Path, help="Default: adjacent study assets/icons")
    parser.add_argument("--record", type=Path, help="Default: production/selected-exports.json; custom output uses its own selected-exports.json")
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument("--dry-run", action="store_true", help="Check selected input/output hashes and geometry without writing")
    modes.add_argument("--verify", action="store_true", help="Also regenerate every selected output in memory and compare its bytes; writes nothing")
    args = parser.parse_args()
    root = repo_root(HERE)
    output = args.output or HERE.parent / "assets/icons"
    record_path = args.record or (output / "selected-exports.json" if args.output else HERE / "selected-exports.json")
    plan, images = load_plan(args.plan, root)
    expected = record_header(plan)
    selected_names = {name for icon in plan["icons"] for name, _size in presentations(icon)}
    unselected = sorted(path.name for path in output.glob("*.webp") if path.name not in selected_names)
    if args.dry_run or args.verify:
        existing = json.loads(record_path.read_text()) if record_path.exists() else {}
        failures = [f"record {key} mismatch" for key, value in expected.items() if existing.get(key) != value]
        saved_outputs = existing.get("outputs", {})
        if set(saved_outputs) != selected_names:
            failures.append("record output inventory mismatch")
        for icon in plan["icons"]:
            for name, size in presentations(icon):
                path = output / name
                if not path.is_file():
                    failures.append(f"{name}: missing")
                    continue
                actual = path.read_bytes()
                if saved_outputs.get(name) != output_record(icon, size, actual):
                    failures.append(f"{name}: selected output/hash mismatch")
                if args.verify and actual != render(icon, images[icon["source"]], plan["frame"], size):
                    failures.append(f"{name}: regenerated bytes differ")
        print(json.dumps({"mode": "verify" if args.verify else "dry-run", "identities": len(plan["icons"]), "outputs": len(selected_names), "failures": failures, "unselectedWebpFiles": unselected}, indent=2))
        return int(bool(failures))
    # Finish validation and rendering before touching any output. An invalid
    # source or full-bleed geometry must not leave a partially updated family.
    pending = {}
    expected["outputs"] = {}
    for icon in plan["icons"]:
        for name, size in presentations(icon):
            data = render(icon, images[icon["source"]], plan["frame"], size)
            pending[name] = data
            expected["outputs"][name] = output_record(icon, size, data)
    changed = 0
    for name, data in pending.items():
        target = output / name
        if not target.exists() or target.read_bytes() != data:
            atomic_write(target, data)
            changed += 1
    atomic_write(record_path, json_bytes(expected))
    print(json.dumps({"identities": len(plan["icons"]), "outputs": len(pending), "changedFiles": changed, "unselectedWebpFiles": unselected}, indent=2))
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, KeyError, OSError) as error:
        print(f"Icon export failed: {error}", file=sys.stderr)
        raise SystemExit(1)
