#!/usr/bin/env bash
set -euo pipefail
glacier_source_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
glacier_repo_dir="$(cd -- "$glacier_source_dir/../.." && pwd)"
glacier_output="${1:-$glacier_repo_dir/stories/creation/assets/hotspots/c22-advancing-ice.webp}"
glacier_scratch="$(mktemp -d)"
trap 'rm -rf -- "$glacier_scratch"' EXIT
sips --resampleHeight 3376 "$glacier_source_dir/master.png" --out "$glacier_scratch/scaled.png" >/dev/null
sips --cropToHeightWidth 3376 1560 "$glacier_scratch/scaled.png" --out "$glacier_scratch/registered.png" >/dev/null
cwebp -quiet -q 92 -m 6 "$glacier_scratch/registered.png" -o "$glacier_output"
