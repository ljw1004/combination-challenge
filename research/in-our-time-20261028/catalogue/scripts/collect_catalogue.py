#!/usr/bin/env python3
"""Collect licensed bibliography; deliberately never export BBC abstracts/audio.

Use --html to parse a previously retrieved Wikipedia page. Otherwise one robots-
checked, identified request retrieves the configured Wikipedia revision. Optional
--rss-bibliography accepts only a local, fact-only feed audit. It is not an RSS
downloader, an abstract scraper or permission to reuse BBC expressive content.
"""
from __future__ import annotations

import argparse
import collections
import csv
import datetime as dt
import hashlib
import json
import pathlib
import re
import urllib.parse
import urllib.request
import urllib.robotparser

from lxml import html

SOURCE = "https://en.wikipedia.org/wiki/List_of_In_Our_Time_programmes"
REVISION = "1382152739"
LICENSE = "https://creativecommons.org/licenses/by-sa/4.0/"
UA = "AtlasResearchBibliography/1.0 (private bibliography; no audio downloads)"
SPECIALS = {"p0gfn8qk", "p0mppwp5", "p0mskkbw"}
REISSUE_MATCHES = {
    "p0pchdrv": "b054t3s2", "p0pbblh6": "b01bmlsy",
    "p0p94prv": "b01dvw6t", "p0p4mkxp": "b03xgl3m",
    "p0p4m8xn": "b06pd3b9", "p0p2vv0y": "b01q95s0",
    "p0p2dn1j": "b09rzm9y", "p0p1f993": "b08vwn6h",
    "p0nxnf0t": "m001zdw0", "p0nxf46w": "b008q0sp",
    "p0nx109x": "b04n62jx", "p0nx0z4j": "m000c4x1",
    "p0nwwkjc": "b0977v4t",
}


def clean(value):
    return " ".join(value.split())


def jsonwrite(path, obj):
    path.write_text(json.dumps(obj, ensure_ascii=False, indent=2) + "\n")


def jsonlines(path, rows):
    path.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in rows))


def fetch_wikipedia(revision):
    url = SOURCE + ("?oldid=" + revision if revision else "")
    req = urllib.request.Request("https://en.wikipedia.org/robots.txt", headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=45) as response:
        rules = response.read().decode("utf-8")
    parser = urllib.robotparser.RobotFileParser()
    parser.parse(rules.splitlines())
    if not parser.can_fetch(UA, url):
        raise RuntimeError("Wikipedia robots disallows this URL; stopping without alternate-route retry")
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as response:
        return response.read()


def parse_catalogue(raw, retrieved_at, as_of):
    doc = html.fromstring(raw)
    match = re.search(rb'"wgRevisionId":(\d+)', raw)
    revision = match.group(1).decode() if match else None
    if not revision:
        raise ValueError("Wikipedia revision ID missing; provenance must not be invented")
    records = []
    for table in doc.xpath('//table[contains(concat(" ",normalize-space(@class)," ")," wikitable ")]'):
        if not any("Broadcast date" in text for text in table.xpath(".//tr[1]//th//text()")):
            continue
        for row in table.xpath(".//tr[td]"):
            cells = row.xpath("./td")
            if len(cells) != 3:
                raise ValueError("Unexpected episode-table column count")
            links = [url for url in cells[0].xpath(".//a/@href") if re.search(r'bbc\.co\.uk/programmes/[a-z0-9]{8}$', url)]
            if len(links) != 1:
                raise ValueError("Episode row must have exactly one BBC programme link")
            pid = links[0].rsplit("/", 1)[-1]
            title = clean(cells[1].text_content())
            date = dt.datetime.strptime(clean(cells[0].text_content()), "%d %B %Y").date().isoformat()
            subjects = []
            for link in cells[1].xpath(".//a[@href]"):
                url = urllib.parse.urljoin(SOURCE, link.get("href"))
                if url.startswith("https://en.wikipedia.org/wiki/"):
                    subjects.append({"label": clean(link.text_content()), "url": url})
            contributors = []
            for item in cells[2].xpath(".//li"):
                # Names only, not copied biographies or position descriptions.
                text = clean(item.text_content())
                if text:
                    contributors.append(text.split(",", 1)[0])
            # These two rows contain a prose programme note, not a person list.
            # Their participant names are explicitly in their catalogue titles.
            title_participants = {
                "p0gfn8qk": ["Melvyn Bragg", "Mishal Husain"],
                "p0mppwp5": ["Melvyn Bragg", "Misha Glenny"],
            }
            if pid in title_participants:
                contributors = title_participants[pid]
            kind = "presenter_special" if pid in SPECIALS else "discussion"
            if title.startswith("The Written World:"):
                kind = "written_world_miniseries"
            elif title.startswith("The Royal Society and British Science:"):
                kind = "royal_society_documentary_miniseries"
            elif pid == "b00774j0":
                kind = "documentary"
            records.append({
                "episode_id": pid,
                "title": title,
                "first_broadcast_date": date,
                "broadcast_status": "scheduled" if date > as_of else "aired",
                "record_type": kind,
                "canonical_url": "https://www.bbc.co.uk/programmes/" + pid,
                "topics": subjects,
                "category": None,
                "category_status": "not_supplied_by_catalogue",
                "contributors": contributors,
                "contributors_source": "catalogue_title" if pid in title_participants else "catalogue_contributor_list",
                "abstract": None,
                "abstract_status": "excluded_from_repository_temporary_research_only",
                "abstract_type": None,
                "original_annotation": None,
                "annotation_status": "not_supplied_topic_links_are_not_abstracts",
                "source": {
                    "type": "licensed_community_episode_catalogue",
                    "url": SOURCE,
                    "revision_id": revision,
                    "revision_url": SOURCE + "?oldid=" + revision,
                    "row_id": row.get("id"),
                    "license": "CC-BY-SA-4.0",
                    "license_url": LICENSE,
                    "attribution": "Wikipedia contributors, List of In Our Time programmes",
                    "retrieved_at": retrieved_at,
                },
                "rss_present": None,
                "rss_publication_date": None,
                "reissue_candidates": [],
            })
    counts = collections.Counter(r["episode_id"] for r in records)
    duplicates = [pid for pid, count in counts.items() if count > 1]
    if duplicates:
        raise ValueError("Duplicate canonical IDs must be investigated: " + repr(duplicates))
    records.sort(key=lambda r: (r["first_broadcast_date"], r["episode_id"]))
    return records, revision


def add_feed_audit(records, audit):
    """Join short bibliographic facts only. Never accept description/summary keys."""
    index = {r["episode_id"]: r for r in records}
    inventory = []
    for item in audit["items"]:
        forbidden = set(item) - {"title", "pubDate", "link", "guid"}
        if forbidden:
            raise ValueError("Audit contains unexpected (possibly expressive) fields: " + repr(forbidden))
        pid = item["link"].rstrip("/").rsplit("/", 1)[-1]
        if not re.fullmatch("[a-z0-9]{8}", pid):
            raise ValueError("Bad BBC ID")
        original = REISSUE_MATCHES.get(pid)
        kind = "archive_reissue_candidate" if original else ("catalogue_record" if pid in index else "trailer_or_other")
        facts = {
            "episode_id": pid, "title": item["title"],
            "rss_publication_date": item["pubDate"],
            "canonical_url": "https://www.bbc.co.uk/programmes/" + pid,
            "record_type": kind, "candidate_original_episode_id": original,
            "match_basis": "manual_title_match_not_audio_identity" if original else None,
            "source_url": audit["source"], "retrieved_at": audit["retrieved_at"],
            "rights": "bibliographic_facts_only_no_BBC_content_license_claimed",
        }
        inventory.append(facts)
        if original:
            index[original]["reissue_candidates"].append({k: facts[k] for k in ["episode_id", "title", "canonical_url", "rss_publication_date", "match_basis"]})
    by_id = {r["episode_id"]: r for r in inventory}
    for record in records:
        item = by_id.get(record["episode_id"])
        record["rss_present"] = bool(item)
        record["rss_publication_date"] = item["rss_publication_date"] if item else None
    return inventory


def write_outputs(records, revision, raw_hash, args, inventory, audit):
    root = pathlib.Path(args.output)
    data = root / "data"
    data.mkdir(parents=True, exist_ok=True)
    jsonlines(data / "episodes.jsonl", records)
    fields = ["episode_id", "title", "first_broadcast_date", "broadcast_status", "record_type", "canonical_url", "topics", "contributors", "abstract", "abstract_status", "rss_present", "rss_publication_date", "reissue_candidates", "source_url", "source_revision", "retrieved_at"]
    with (data / "episodes.csv").open("w", newline="") as file:
        writer = csv.DictWriter(file, fieldnames=fields)
        writer.writeheader()
        for record in records:
            row = {key: record.get(key) for key in fields}
            row.update(source_url=SOURCE, source_revision=revision, retrieved_at=args.retrieved_at)
            for key in ["topics", "contributors", "reissue_candidates"]:
                row[key] = json.dumps(row[key], ensure_ascii=False)
            writer.writerow(row)
    lines = ["IN OUR TIME — COMPLETE COLLECTED CATALOGUE SCAN", "Not an abstracts corpus. See README and manifest.json.", "Source: Wikipedia contributors; CC BY-SA 4.0; revision " + revision, ""]
    for record in records:
        topics = "; ".join(x["label"] for x in record["topics"]) or "(no linked subject)"
        flags = record["broadcast_status"] + ", " + record["record_type"]
        lines.append(f'{record["first_broadcast_date"]} | {record["episode_id"]} | {record["title"]} | {flags} | subjects: {topics}')
    (data / "catalogue_scan.txt").write_text("\n".join(lines) + "\n")
    if inventory:
        jsonlines(data / "rss_bibliographic_inventory.jsonl", inventory)
    ids = {r["episode_id"] for r in records}
    rss_ids = {r["episode_id"] for r in inventory}
    substantive = [r for r in records if r["broadcast_status"] == "aired" and r["record_type"] != "presenter_special"]
    manifest = {
        "schema_version": "1.0.0",
        "collection_status": "catalogue_sealed_temporary_research_material_prepared_not_published",
        "as_of_date": args.as_of,
        "created_at": args.retrieved_at,
        "source_catalogue": {"url": SOURCE, "revision_id": revision, "source_html_sha256": raw_hash, "license": "CC-BY-SA-4.0", "retrieved_at": args.retrieved_at},
        "coverage": {
            "catalogue_records": len(records),
            "catalogue_unique_episode_ids": len(ids),
            "aired_records": sum(r["broadcast_status"] == "aired" for r in records),
            "scheduled_records": sum(r["broadcast_status"] == "scheduled" for r in records),
            "presenter_specials": sum(r["record_type"] == "presenter_special" for r in records),
            "aired_substantive_records": len(substantive),
            "written_world_miniseries_records_included": sum(r["record_type"] == "written_world_miniseries" for r in records),
            "first_catalogue_date": records[0]["first_broadcast_date"],
            "latest_aired_catalogue_date": max(r["first_broadcast_date"] for r in records if r["broadcast_status"] == "aired"),
            "latest_scheduled_catalogue_date": records[-1]["first_broadcast_date"],
            "records_with_linked_topics": sum(bool(r["topics"]) for r in records),
            "records_with_contributor_names": sum(bool(r["contributors"]) for r in records),
            "abstracts_published_in_repository": 0,
            "abstract_fields_deliberately_null_in_repository": len(records),
            "archive_exhaustiveness_verified": False,
            "by_year": dict(sorted(collections.Counter(r["first_broadcast_date"][:4] for r in substantive).items())),
        },
        "official_rss_audit": None,
        "limitations": [
            "Every repository abstract field is deliberately null. Source descriptions were collected separately for temporary private analysis, not publication; see research_coverage.json.",
            "Catalogue completeness means every row of the pinned community catalogue, not proof that no BBC episode is absent.",
            "Official RSS publication date is not first broadcast date; observed 28-day delay can exclude recent broadcasts.",
            "Reissues are linked as title-based candidates, not asserted to have identical audio or programme content.",
            "New episodes after the Melvyn Bragg era remain included; no undocumented presenter claim is made per row.",
            "Linked Wikipedia subjects are catalogue topics, not summaries of what was said on air.",
        ],
    }
    if inventory:
        manifest["official_rss_audit"] = {
            "source_url": audit["source"], "retrieved_at": audit["retrieved_at"], "source_sha256": audit["source_sha256"],
            "item_count": len(inventory), "unique_episode_ids": len(rss_ids),
            "items_with_description_observed": audit.get("description_nonempty_count"),
            "description_note": "Nonempty-field count only; no abstract text retained or republished.",
            "matching_catalogue_ids": len(ids & rss_ids),
            "catalogue_ids_absent_from_rss": sorted(ids - rss_ids),
            "rss_ids_absent_from_catalogue": sorted(rss_ids - ids),
            "archive_reissue_candidates": sum(r["record_type"] == "archive_reissue_candidate" for r in inventory),
            "trailer_or_other_records": sum(r["record_type"] == "trailer_or_other" for r in inventory),
            "union_distinct_pids_before_reissue_grouping": len(ids | rss_ids),
        }
    jsonwrite(root / "manifest.json", manifest)
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--html", type=pathlib.Path)
    parser.add_argument("--revision", default=REVISION)
    parser.add_argument("--rss-bibliography", type=pathlib.Path)
    parser.add_argument("--output", default=".")
    parser.add_argument("--as-of", default="2026-10-28")
    parser.add_argument("--retrieved-at", default=dt.datetime.now(dt.timezone.utc).isoformat())
    args = parser.parse_args()
    raw = args.html.read_bytes() if args.html else fetch_wikipedia(args.revision)
    records, revision = parse_catalogue(raw, args.retrieved_at, args.as_of)
    audit = json.loads(args.rss_bibliography.read_text()) if args.rss_bibliography else None
    inventory = add_feed_audit(records, audit) if audit else []
    manifest = write_outputs(records, revision, hashlib.sha256(raw).hexdigest(), args, inventory, audit)
    print(json.dumps(manifest["coverage"], indent=2))


if __name__ == "__main__":
    main()
