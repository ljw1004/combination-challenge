#!/usr/bin/env python3
"""Offline integrity checks for the complete collected catalogue snapshot."""
import collections
import csv
import datetime
import hashlib
import json
import pathlib
import re
import sys

root = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else pathlib.Path(__file__).resolve().parents[1]
rows = [json.loads(line) for line in (root / "data/episodes.jsonl").read_text().splitlines()]
feed = [json.loads(line) for line in (root / "data/rss_bibliographic_inventory.jsonl").read_text().splitlines()]
manifest = json.loads((root / "manifest.json").read_text())
checks = []


def check(name, condition):
    checks.append({"name": name, "passed": bool(condition)})
    if not condition:
        raise AssertionError(name)


check("1114 catalogue rows", len(rows) == 1114)
check("Unique canonical episode IDs", len({r["episode_id"] for r in rows}) == len(rows))
check("Valid canonical IDs and URLs", all(re.fullmatch("[a-z0-9]{8}", r["episode_id"]) and r["canonical_url"] == "https://www.bbc.co.uk/programmes/" + r["episode_id"] for r in rows))
check("1116 unique official RSS bibliographic rows", len(feed) == len({r["episode_id"] for r in feed}) == 1116)
for row in rows:
    datetime.date.fromisoformat(row["first_broadcast_date"])
check("Chronologically sorted", rows == sorted(rows, key=lambda r: (r["first_broadcast_date"], r["episode_id"])))
check("Future broadcasts not counted as aired", all((r["first_broadcast_date"] > manifest["as_of_date"]) == (r["broadcast_status"] == "scheduled") for r in rows))
check("All null abstracts explicitly marked excluded", all(r["abstract"] is None and r["abstract_type"] is None and r["abstract_status"] == "excluded_from_repository_temporary_research_only" for r in rows))
check("No topic summaries misrepresented as episode annotations", all(r["original_annotation"] is None for r in rows))
check("Attribution and revision on every row", all(r["source"]["revision_id"] == "1382152739" and r["source"]["license"] == "CC-BY-SA-4.0" and r["source"]["retrieved_at"] for r in rows))
check("13 candidate reissues are attached separately", sum(len(r["reissue_candidates"]) for r in rows) == 13)
check("Repeat matching marked inference, not audio verification", all(a["match_basis"] == "manual_title_match_not_audio_identity" for r in rows for a in r["reissue_candidates"]))
check("Distinct same-title episodes retained", sum(r["title"].lower() == "artificial intelligence" for r in rows) == 2)
with (root / "data/episodes.csv").open(newline="") as file:
    csv_rows = list(csv.DictReader(file))
check("CSV/JSONL row identity and title parity", [(r["episode_id"], r["title"]) for r in csv_rows] == [(r["episode_id"], r["title"]) for r in rows])
check("Every row present in chronological scan", sum(bool(re.match(r"\d{4}-\d{2}-\d{2} \|", line)) for line in (root / "data/catalogue_scan.txt").read_text().splitlines()) == len(rows))
check("Manifest coverage agrees", manifest["coverage"]["aired_substantive_records"] == sum(r["broadcast_status"] == "aired" and r["record_type"] != "presenter_special" for r in rows) == 1109)
check("RSS and catalogue date distinction retained", next(r for r in rows if r["episode_id"] == "m0031vjw")["first_broadcast_date"] == "2026-09-24" and "22 Oct 2026" in next(r for r in rows if r["episode_id"] == "m0031vjw")["rss_publication_date"])
check("No media download URLs in exported data", all(not re.search(r"https?[^\s\"]*\.mp3", file.read_text()) for file in (root / "data").iterdir() if file.suffix in {".jsonl", ".csv", ".txt"}))
checksums = {str(p.relative_to(root)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((root / "data").iterdir()) if p.is_file()}
result = {"status": "passed", "checks": checks, "checks_passed": len(checks), "data_sha256": checksums, "scope": "Offline structural integrity; not proof of BBC archive exhaustiveness or abstract accuracy"}
(root / "tests/validation.json").write_text(json.dumps(result, indent=2) + "\n")
print(json.dumps(result, indent=2))
