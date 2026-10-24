# Memory Scrapbook data contract — schemaVersion 1

The authoritative photo document is `memory-gallery-data.json`. Text Moments remain
solely in `moments-data.js`; projects remain solely in `projects-data.js`. Neither
date nor description is a relationship key. Production intentionally starts empty.

## Document

- `schemaVersion`: exactly `1`.
- `categories`: at most 24 `{id, label}` objects, unique stable slug IDs; labels up
  to 40 characters. The view builds its filters from these records, not a fixed list.
- `items`: at most 120 records, sorted by ISO event date descending, then stable ID.
- `testFixture`: optional boolean. Production validation rejects `true`. The view
  always displays an unmistakable TEST FIXTURE banner when that document is used.

Unknown fields are rejected. Maximum fetched document size is 2 MiB UTF-8.

## Memory record

| Field | Contract |
|---|---|
| id | Unique lowercase slug, 1–64 characters; immutable identity |
| title | Nonempty plain text, up to 140 characters |
| date | Valid ISO event date `YYYY-MM-DD`, 1900–2199; no invented dates |
| category | Existing category ID |
| description | Plain text, up to 600 characters |
| story | Optional plain text, up to 6000 characters; line breaks preserved |
| tags | At most 8 nonempty plain strings, up to 32 characters each |
| cover | Required image metadata; at most 4,194,304 pixels |
| gallery | Optional list, at most 12 images; order is explicit |
| featuredRank | Optional integer 0–999 or null; lowest rank, then ID wins |
| source | Shared source/public declaration applying to this record and its images |

Source is `{kind, creator, note, publicConfirmed, url?}`. `kind` is `user-owned`,
`used-with-permission`, or `test-fixture` (only in a fixture document). Creator is
nonempty, at most 120 characters; note is nonempty, at most 1000 characters.
`publicConfirmed` must be exactly true. Optional source URL is credential-free
HTTPS, at most 1000 characters. Confirmation is the contributor's declaration,
not independent proof of copyright or privacy review. No private files are read.

## Images and loading

Image metadata is `{src, width, height, alt, caption?}`. Allowed paths are strictly
`assets/memories/<own-memory-id>/<lowercase-slug>.webp|png|jpg|jpeg`. No URL,
backslashes, escapes, traversal, SVG, data URL, or project media directory is allowed.
Dimensions are positive integers, each at most 8192, total at most 16,777,216 pixels
(covers have the stricter 4 MP limit); resource bytes at most 12 MiB. Alt is required,
up to 300 characters; optional caption is up to 600 characters.

The checker verifies real file existence, resolved ownership, signature, dimensions,
format and size. The browser separately checks successful decode and natural
dimensions; failed images retain their frame, readable fallback, text and controls.
Full image quality/decode cost still needs validation for future real materials.
Prefer optimized WebP covers around 960–1440px wide, with proportional scaling.

Only 18 collection covers plus one configured feature are rendered at a time.
Pagination replaces old nodes rather than growing an unbounded waterfall. Covers
outside the viewport are lazy; the feature is eager only on the active Moments
page. Detail creates only the current image, not a hidden high-resolution gallery
or thumbnail preloader. Next/previous changes the image on user input. Closing
clears detail image nodes. There is no new Canvas, WebGL, rAF loop or framework.

## UI-04B.2 local import interface

The independent `memory-editor.html` and `memory-media-manager.js` reuse the
bounded binary/hash/ZIP primitives, with their own Memory validation and 16 MP
limit. They do not use the project overlay or change projects/Moments. Public
workflow and recovery instructions: `docs/memory-manager.md`.

Implemented local package (also accepted directly as ZIP):

    rinsora-memory-<id>/
      assets/memories/<id>/<content-hash-name>.webp
      manifest.json
      memory-patch.json
      IMPORT.md

Manifest should record actual byte SHA256, format, dimensions, contributor's
source statement and public confirmation. Patch should contain schema version,
stable target ID, expected prior record hash and the complete validated record.
Importer must reject symlink/traversal, mismatched bytes, unknown fields, stale
target baseline, and same-name/different-content overwrite. Upsert only that ID;
preserve all other records/categories and all original text Moments. New categories
require explicit configuration, not an inferred identity rewrite. Default DRY_RUN,
explicit apply only after review; validate the future document/files before writing.

Keep original inputs separately; do not expose machine paths or credentials in
packages. Export/download, copy, JSON import, Git commit and deployment are separate
states. Remote GitHub publishing remains DISABLED.

No record schema migration is needed. A new lightweight cover and its viewing
image share the input SHA prefix in explicit content-hash filenames, with distinct
`-cover.webp` / `-detail.webp` suffixes. The detail is an existing gallery entry
(one of the 12 slots). `media()` still audits both resources; `detailMedia()` skips
the small duplicate only when this explicit pair exists. Legacy paths retain
cover-first semantics. Card covers are 720–960px longest edge; full viewing images
up to 3200px. User checks quality if the finite encoder attempts exceed the
120/200 KiB suggestion. Non-preview public pages do not load admin modules.

## Validation and navigation

    node tools/check-memory-gallery.cjs
    node tools/check-memory-gallery.cjs --fixture tests/fixtures/memory-gallery
    python tools/check-site.py

The checker is in CI; Node regressions are discovered by the existing test runner.
Fixture media is synthetic, labelled and confined to `tests/fixtures/memory-gallery`;
it is not copied into production assets. Local browser fixture service changes only
its read-only responses, never the production JSON.

Preview gate: `ui02=1&memory=1`; ordinary visits request no module/data/photo assets.
The singleton dialog has no independent hash/deep-link namespace. Existing section
history closes it when leaving; forward returns to the Moments list. Refresh shows
the list. Native dialog modality, Escape, focus and scroll restoration are local;
existing router/overlay entry points coordinate Lab, posts, settings and Museum.
Room ownership guards exclude the preview Moments section and memory dialog even
before gallery initialization. Cover keeps its existing gesture ownership.
