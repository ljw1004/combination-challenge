#!/usr/bin/env python3
"""Verify and replay selected Cosmic exports from retained raster sources.

Requires Pillow; never invokes image generation. Paths in the original requests
and extraction records are historical and are not used to locate files.
"""

import argparse
import hashlib
import json
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, features


PRODUCTION = Path(__file__).resolve().parent


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def inside(root, relative):
    path = (root / relative).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError(f"Path escapes its root: {relative}")
    return path


def json_record(reference, documents):
    path = reference["path"]
    if path not in documents:
        documents[path] = json.loads(inside(PRODUCTION, path).read_text())
    value = documents[path]
    pointer = reference.get("json_pointer", "")
    for part in pointer.split("/")[1:]:
        key = part.replace("~1", "/").replace("~0", "~")
        value = value[int(key)] if isinstance(value, list) else value[key]
    return value


def circular_crop(source, record):
    image = source.convert("RGBA").transform(
        (1152, 1152), Image.Transform.EXTENT, record["bounds"],
        Image.Resampling.BICUBIC,
    )
    radius = record["rim"][2]
    extent = radius + 2
    margin = 1152 * (extent - radius - 0.1) / (2 * extent)
    mask = Image.new("L", image.size)
    ImageDraw.Draw(mask).ellipse(
        (margin, margin, 1152 - margin, 1152 - margin), fill=255,
    )
    image.putalpha(ImageChops.darker(image.getchannel("A"), mask))
    return image.resize((288, 288), Image.Resampling.LANCZOS)


def export(asset, output, documents):
    settings = asset["export"]
    record = json_record(asset["crop_record"], documents)
    size = tuple(settings["dimensions_px"])
    with Image.open(inside(PRODUCTION, asset["master"]["path"])) as source:
        operation = settings["operation"]
        if operation == "circular-rim-v1":
            image = circular_crop(source, record)
        elif operation == "rgba-crop-resize-v1":
            image = source.convert("RGBA").crop(record["bounds"]).resize(
                size, Image.Resampling.LANCZOS,
            )
        elif operation == "rgba-png-resave-v1":
            image = source.convert("RGBA")
        elif operation == "rgb-fit-resize-v1":
            image = source.convert("RGB").resize(
                size, Image.Resampling.LANCZOS,
                box=tuple(record[settings["bounds_key"]]),
            )
        else:
            raise ValueError(f"Unknown export operation: {operation}")
        if image.size != size or image.mode != settings["mode"]:
            raise ValueError(f"Unexpected export size/mode: {asset['id']}")
        destination = inside(output, asset["asset_relative_path"])
        destination.parent.mkdir(parents=True, exist_ok=True)
        if settings["format"] == "PNG":
            image.save(destination, optimize=settings["png_optimize"])
        else:
            image.save(destination, format="WEBP", quality=settings["webp_quality"],
                       method=settings["webp_method"])
    return destination


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--verify-assets", type=Path,
                        help="Existing runtime assets directory, containing icons/ and backgrounds/.")
    parser.add_argument("--output", type=Path,
                        help="Empty scratch directory for byte-checked mechanical replay.")
    args = parser.parse_args()
    manifest = json.loads((PRODUCTION / "selected-assets.json").read_text())
    assets = manifest["assets"]
    paths = [asset["asset_relative_path"] for asset in assets]
    if len(paths) != len(set(paths)):
        raise ValueError("Duplicate selected runtime paths")
    counts = {kind: sum(a["kind"] == kind for a in assets) for kind in ("icon", "background")}
    expected_counts = {"icon": manifest["counts"]["icons"],
                       "background": manifest["counts"]["backgrounds"]}
    if counts != expected_counts or len(assets) != manifest["counts"]["runtime_assets"]:
        raise ValueError(f"Unexpected selection coverage: {counts}")

    # Check retained source and historical record bytes before reading crop data.
    for reference in manifest["supporting_records"] + manifest["sources"]:
        if digest(inside(PRODUCTION, reference["path"])) != reference["sha256"]:
            raise ValueError(f"Retained file hash mismatch: {reference['path']}")
    documents = {}
    catalogue = json.loads((PRODUCTION / "catalogue.json").read_text())
    backgrounds = json.loads((PRODUCTION / "backgrounds-plan.json").read_text())
    catalogue_ids = {item["id"] for item in catalogue["items"]}
    for reference in manifest.get("catalogue_supplements", []):
        supplement = json_record(reference, documents)
        additional_ids = {item["id"] for item in supplement["new_items"]}
        if catalogue_ids & additional_ids:
            raise ValueError("Catalogue supplement duplicates an existing illustrated identity")
        catalogue_ids.update(additional_ids)
        recipe_count = len(catalogue["recipes"]) + sum(
            change["change"] == "add" for change in supplement["recipe_changes"]
        )
        if recipe_count != supplement["source"]["recipes"]:
            raise ValueError("Catalogue supplement recipe totals disagree")
    if catalogue_ids != {a["id"] for a in assets if a["kind"] == "icon"}:
        raise ValueError("Selected icon coverage differs from the catalogue")
    if {item["id"] for item in backgrounds["backgrounds"]} != {a["id"] for a in assets if a["kind"] == "background"}:
        raise ValueError("Selected background coverage differs from the plan")
    for asset in assets:
        if json_record(asset["crop_record"], documents)["id"] != asset["id"]:
            raise ValueError(f"Crop record identifies another asset: {asset['id']}")
    selected_by_id = {asset["id"]: asset for asset in assets}
    for source in manifest["sources"]:
        for reference in source.get("reference_inputs", []):
            if reference.get("scope") == "selected-runtime-asset":
                asset = selected_by_id[reference["asset_id"]]
                if (reference["sha256"] != asset["runtime_sha256"]
                        or reference["runtime"] != asset["runtime"]
                        or reference["asset_relative_path"] != asset["asset_relative_path"]):
                    raise ValueError(f"Runtime reference differs from its selected asset: {reference['asset_id']}")

    if args.verify_assets:
        runtime = args.verify_assets.resolve()
        actual = {str(path.relative_to(runtime)) for path in runtime.rglob("*") if path.is_file()}
        if actual != set(paths):
            raise ValueError(f"Runtime coverage mismatch; missing={sorted(set(paths) - actual)}, extra={sorted(actual - set(paths))}")
        for asset in assets:
            path = inside(runtime, asset["asset_relative_path"])
            if digest(path) != asset["runtime_sha256"]:
                raise ValueError(f"Runtime hash mismatch: {asset['asset_relative_path']}")
            with Image.open(path) as image:
                if list(image.size) != asset["export"]["dimensions_px"] or image.mode != asset["export"]["mode"]:
                    raise ValueError(f"Runtime size/mode mismatch: {asset['asset_relative_path']}")

    replay_exact = 0
    nominal_exports = []
    if args.output:
        output = args.output.resolve()
        if output.exists() and any(output.iterdir()):
            raise ValueError("Replay output must be an empty scratch directory")
        if output == PRODUCTION or output.is_relative_to(PRODUCTION):
            raise ValueError("Keep replay output outside the retained production directory")
        output.mkdir(parents=True, exist_ok=True)
        for asset in assets:
            path = export(asset, output, documents)
            if digest(path) == asset["runtime_sha256"]:
                replay_exact += 1
            elif asset.get("replay_status") == "nominal-only":
                nominal_exports.append(asset["asset_relative_path"])
            else:
                raise ValueError(
                    f"Replay hash mismatch: {asset['asset_relative_path']}. "
                    f"Observed Pillow {Image.__version__}, libwebp {features.version('webp')}; "
                    f"recorded environment: {manifest['export_environment']}",
                )
    checked = "retained sources and crop records"
    if args.verify_assets:
        checked += ", runtime bytes/dimensions/coverage"
    print(f"PASS: {counts['icon']} icons + {counts['background']} backgrounds; {checked}.")
    if args.output:
        print(f"Replay: {replay_exact} byte-identical exports; {len(nominal_exports)} nominal exports.")
        if nominal_exports:
            print("These recorded coast crops do not reproduce the retained runtime bytes: "
                  + ", ".join(nominal_exports) + ". Retain the originals for publication.")


if __name__ == "__main__":
    main()
