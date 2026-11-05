# Advancing ice: registered landscape state

This layer follows the [active Creation brief](../../../stories/creation/design-brief.md) and [registered scenery workflow](../../../docs/icon-guide.md#register-changing-scenery). It uses the unchanged `stories/creation/assets/backgrounds/cold-heights.webp` as its initial scene. Constructing **Advancing ice** reveals a connected glacier tongue and its immediate shore community; the derived hotspot must remain preserved after **Cold-adapted populations** appears.

The selected painting is [ice-state-02.png](masters/ice-state-02.png), generated with the built-in imagegen tool. [Exact requests and input mapping](ice-requests.json) record both calls. The first generated state is retained only as the necessary input to the selected localized correction: an unintended extra orange animal-shaped mark was removed. The actual three mammals and blue lineage fork remain. The diagram's fork repeats Variation's visual convention; differing coats coexist, without depicting cold as an individual transformation.

[ice-layout.json](ice-layout.json) binds source hashes, the aspect-preserving normalization, traced polygons, boundary antialiasing, source crop, output dimensions and receiving geometry. The opaque parts of the layer replace the forest and ground that the advancing ice physically covers. Outside its alpha footprint, the original headland, cave, Moon and lower working sea remain unchanged. No scene wash or runtime colour adjustment is used. The complete generated state remains available for provenance; it is not used as a replacement background.

The 980×1180 PNG displays at 245×295 reference units. Its exact centre is **68.589744%, 23.696682%**. Use a separate receiving rectangle centred at **65.384615%, 30.805687%**, size **38.461538%, 12.440758%** (150×105 reference units), over the lower ice front. This receiver leaves the higher connecting ice visible without making it all a target.

```sh
uv run projects/creation-study/production/ice-export.py
uv run projects/creation-study/production/ice-export.py --verify
# Disposable review composites, never retained as production art:
uv run projects/creation-study/production/ice-export.py --verify --proof-dir runs/creation-ice-review
```

Author inspection covered the full composite at 390×844 and enlarged extraction edges. No conspicuous boundary seam, disconnected glacier, duplicated animal or displaced protected landmark was visible. Byte-for-byte export verification passed with Pillow 13.0.0. Runtime PNG SHA-256: `803df2dffddf6f496ba969b1fcc6de0e006b70c104bf5cd85685d1d98dc8aa32`. This is an informed production check; independent continuity/recognition review and actual browser interaction remain pending.
