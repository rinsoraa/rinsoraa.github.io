# Memory Scrapbook media

Memory identity and captions live only in `memory-gallery-data.json`, independently
of project media and the text timeline in `moments-data.js`. Production starts empty.

Use `assets/memories/<stable-memory-id>/<lowercase-name>.webp` (PNG/JPEG also
supported). Preserve image proportions, provide actual dimensions and useful alt
text, and confirm the material may be public. Do not place private originals,
credentials, unreviewed chat captures or browser profiles here.

No real memory is prefilled for this phase. Synthetic, clearly labelled test
patterns live only under `tests/fixtures/memory-gallery/`; the production checker
rejects a document marked `testFixture`. They are not photographs or evidence of
Minecraft journeys, character creation dates or personal events.

Validate production with `node tools/check-memory-gallery.cjs`. This is not
GitHub publication approval. The separate `memory-editor.html` prepares local ZIP
packages; `tools/import-memory-gallery.cjs` validates them read-only by default.
See `docs/memory-manager.md` for explicit apply, conflicts, backups and limits.

The v1 manager uses content-hash filenames to associate a lightweight cover with
a full viewing image in `gallery`; the latter occupies one of the 12 positions.
Only explicit matching names use detail-first viewing. Legacy records keep their
cover-first order. No change to the authoritative text Moments or project data.
