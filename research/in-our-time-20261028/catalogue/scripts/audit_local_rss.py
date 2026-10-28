#!/usr/bin/env python3
"""Audit a local RSS file you are entitled to process. No network requests.

No abstracts, images, enclosures, audio URLs, GUIDs or raw XML are exported.
This script is not a licence or a claim that BBC bulk reuse is permitted.
"""
import argparse
import datetime
import hashlib
import json
import pathlib
import xml.etree.ElementTree as ET

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("rss_file", type=pathlib.Path)
parser.add_argument("--output", type=pathlib.Path, required=True)
parser.add_argument("--source", default="https://podcasts.files.bbci.co.uk/b006qykl.rss")
parser.add_argument("--retrieved-at", required=True, help="Actual retrieval timestamp, not processing time")
args = parser.parse_args()
raw = args.rss_file.read_bytes()
items = ET.fromstring(raw).findall("./channel/item")
result = {
    "source": args.source,
    "retrieved_at": args.retrieved_at,
    "source_sha256": hashlib.sha256(raw).hexdigest(),
    "description_nonempty_count": sum(bool(item.findtext("description")) for item in items),
    "items": [{key: item.findtext(key) for key in ["title", "pubDate", "link"]} for item in items],
}
args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n")
print(f"Exported {len(items)} bibliographic rows; descriptions excluded.")
