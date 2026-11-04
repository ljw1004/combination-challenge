"""Load the selected scene/portable geometry from the production manifest."""
import json
from pathlib import Path
_layout = json.loads((Path(__file__).resolve().parents[1] / "layout.json").read_text())
SCENES = _layout["scenes"]
PORTABLES = _layout["portables"]
