#!/usr/bin/env bash
set -euo pipefail

production_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd -- "$production_dir/../../../.." && pwd)"
export_output="${1:-$repo_root/stories/creation/assets/backgrounds/c26-rest.webp}"
mkdir -p "$repo_root/runs"
export_scratch="$(mktemp -d "$repo_root/runs/creation-sky-export.XXXXXX")"
trap 'rm -rf -- "$export_scratch"' EXIT

sips --resampleHeight 1688 "$production_dir/masters/c26-rest.png" --out "$export_scratch/framed.png" >/dev/null
sips --cropToHeightWidth 1688 780 "$export_scratch/framed.png" >/dev/null
cwebp -quiet -lossless -m 6 "$export_scratch/framed.png" -o "$export_output"
