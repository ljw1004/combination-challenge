"""Locate the repository and live Creation assets from active or archived helpers."""
from pathlib import Path


def repo_root(start):
    start = Path(start).resolve()
    for candidate in (start, *start.parents):
        if (candidate / 'package.json').is_file() and (candidate / 'src/story/parser.ts').is_file():
            return candidate
    raise FileNotFoundError(f'Cannot locate repository above {start}')


def story_path(production):
    production = Path(production).resolve()
    root = repo_root(production)
    for candidate in (root / 'stories/creation/creation.md', production.parent / 'creation.md'):
        if candidate.is_file():
            return candidate
    raise FileNotFoundError('Creation manuscript missing from stories/creation and the adjacent study')


def runtime_assets(production):
    return story_path(production).parent / 'assets'
