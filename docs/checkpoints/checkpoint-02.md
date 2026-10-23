# Checkpoint-02 — Creative Lab review and proposed local commits

Review date: 2026-10-23. Baseline: `75ff6ab24365876fb6a7764ee2be76e7add7b167`, branch `codex/ui-04a-creative-lab`. The initial index is empty; seven tracked files differ and 393 historical/new files are untracked. Main remains `323e793e8ec147ce5eb59ed7088049588a090469`. Remote-tracking refs are local observations, not a fresh synchronization claim.

This is a local checkpoint proposal, not release approval. No staging, commits, remote writes, deployment, or next-stage branch creation are part of this review. All historical files and original artwork remain preserved.

## Exact scope and dependency order

[checkpoint-02-files.json](checkpoint-02-files.json) is the exact 29-path whitelist, ordered as four groups of 2 / 9 / 7 / 11 files. It intentionally excludes raw browser captures, original project PNGs, complete phase evidence, private machine paths, browser tooling, logs, caches and source copies. Those remain in local verified archives. The seven deployed WebP files total 463,842 bytes; public provenance, original fingerprints and the DSH historical version/license are in [SOURCES.md](../../assets/projects/SOURCES.md).

1. `fix(projects): preserve status through editor round trips` — repair status serialization and editor input binding. The guarded Lab refresh call is inert before Lab exists.
2. `chore(media): preserve verified project views and provenance` — passive deployment media, complete MIT notice and portable provenance; no new runtime activation.
3. `feat(lab): integrate opt-in gallery, detail routes and real media` — the complete mutually dependent HTML/router/UI-02/model/view/style/enrichment feature lands together. Requires groups 1 and 2.
4. `test(lab): add portable media gates and checkpoint documentation` — tests, binary metadata helper, media audit, CI/local entry points and concise documentation. Requires all previous groups.

The CI helper is deliberately last: enabling its new audit before the modules and media exist would create an invalid intermediate state. Phase names are not used to split dependent whole-file changes.

Before each future approved commit, use only `git add --` with that group's literal paths. Compare `git diff --cached --name-only` to the group's whitelist, run `git diff --cached --check`, verify media/source hashes and run the applicable checks recorded in the JSON. Do not use broad staging. If any file changed since review, stop and review the difference; do not overwrite it.

## Validation contract

The review runs `python tools/check-site.py`, `node tools/check-project-lab.cjs`, `git diff --check`, and checks an empty index. The final helper runs nine Node regression groups plus JavaScript, data, HTML, sitemap and robots checks. Tests use fixture/mock API writes, never real credentials or remote saves.

Each proposed prefix is validated in a separate source-only copy extracted from the baseline HEAD and overlaid with exactly its cumulative whitelist. Prefixes 1–3 keep the baseline helper and five existing Node groups; prefix 1 additionally exercises the actual editor with an in-memory enrichment fixture. Prefix 3 runs the external Lab/bootstrap/editor harnesses against its source copy. Prefix 4 runs all nine tests and the actual media audit from its own tree. These copies are not Git commits; they cannot prove commit hooks or a future GitHub-hosted run. Original worktree and index are not changed by prefix validation.

Inherited real Edge browser evidence is independently checked against the preserved source/evidence archives, including screenshots and logs. Browser execution and performance sampling in Checkpoint-02 are **NOT_RERUN**. Functional browser PASS results remain dated UI-04A.1 / UI-04A.2 evidence, not a new browser acceptance claim.

Review outcome: **READY_FOR_LOCAL_COMMIT**, pending the user's approval of the exact whitelist and order. Current checks pass all nine Node groups and seven media entries; all four independent source prefixes pass their applicable checks. Three preserved archives pass SHA256/CRC validation and 113 historical evidence files match their archives. Twenty-six pre-existing candidate files match the source/evidence archives at review entry; this review changes only the media README among them. No runtime source or image bytes change. Eight inherited three-sample performance groups have their medians, CLS windows and media byte counts independently recomputed; this is evidence validation, not new sampling.

## Product contracts retained

Only `ui02=1&lab=1` activates Lab; Cover is independent. `projects-data.js` remains the sole authoritative identity/category/date/status/tag/link source. Enrichment owns optional editorial/media information only. The existing router handles `#/lab/<id>`; detail and image dialogs are singletons and do not reconstruct the unique audio node. Editor saves only project data.

The showcase is explicitly **media-first**: the first covered project in authoritative `newestFirst` order becomes the lead, and configured `featuredRank` / ID order fills the remaining slots up to three. With multiple covers, newer dates can change the lead; equal dates use the existing later-appended-source-item tie-break. This is not date-independent manual curation. Without covers the configured featured order applies. Complete collection and recent-project order retain their original semantics. A future fixed lead needs a separate explicit product change.

Website media are actual pre-media page captures. DSH media are pinned historical 0.2.2-era repository images, not evidence of current dynamic execution. TrayHider, CatooBot, Markdown-reader and Bilibili remain MEDIA_PENDING with honest identity portraits.

## Remaining release risks

No P0/P1 blocker is identified by this source/static/media review or the inherited final local acceptance evidence. The following remain P2 or verification gaps; none is silently closed by this checkpoint:

| Item | Evidence / scope | Local commit | Release treatment |
|---|---|---|---|
| Lab detail LCP | Inherited three-pair simulated median ~3.20s, above 2.5s reference | Non-blocking | Re-measure latest release, review performance budget |
| Lab initial CLS | Inherited ~0.084, within 0.1 target but enhancement shift remains | Non-blocking | Verify all startup paths |
| Long tasks | Inherited global and Lab samples retain main-thread tasks | Non-blocking | Profile release build; no INP claim |
| Welcome CLS | Historical ~0.63, different path from Lab samples | Non-blocking | Open release performance gate |
| Mobile Cover LCP | Historical Lighthouse ~3.51s; not comparable to later custom CDP values | Non-blocking | Open release performance gate |
| ARIA/focus/fragment timing | Lab keyboard/history covered by inherited evidence; global audit remains open | Non-blocking | Accessibility and deep-link release checks required |
| Room network retry | Controller unit retry passing does not close every module-load failure path | Non-blocking | Verify failure/retry before release |
| Historical init timeout | UNKNOWN / NOT_REPRODUCED, no new reproduction or invented root cause | Non-blocking | Preserve diagnostics and targeted release regression |
| DSH dynamics | NOT_TESTED; static historical captions are explicit | Non-blocking | Blocks claims of current runtime/audio validation |
| Four pending media sets | No fabricated screenshots | Non-blocking | Content follow-up; not a promise of six media-complete projects |
| Physical touch / Firefox / Safari | NOT_TESTED | Non-blocking | Compatibility verification before release approval |
| Lighthouse / INP | This Lab phase has no new Lighthouse run or valid INP population | Non-blocking | NOT_TESTED / NOT_MEASURED; separate release qualification |
| Future multiple-cover lead | Newest covered project leads, independent of featured rank | Non-blocking if this documented policy is approved | Review explicit curation before extending cover collection |

READY_FOR_LOCAL_COMMIT is not production readiness. Release must separately assess these gates, current CI, assets, browsers and rollback. No deployment approval is inferred.

## Recovery and next branch

After future approved commits, record their actual SHAs. On a safely preserved worktree, reverse the dependent commits using `git revert` in order 4 → 3 → 2 → 1; do not reset, clean or delete historical files. Partial rollback must respect dependencies. The verified baseline and both phase archives remain recovery points; public media fingerprints let assets be checked independently.

After local checkpoint approval and successful commits, the next suggested branch is `codex/ui-04a3-project-experience`, based on the final verified commit. It is not created by this audit, and no UI-04A.3 coding begins here.
