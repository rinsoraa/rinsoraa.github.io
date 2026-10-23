# Project media provenance — UI-04A.2

These are real project records, not generated software interfaces. Media preparation and local integration were authorized; this document does not authorize deployment or relicense the website artwork, music or album covers shown in their original UI context.

## Rinsora Home: local browser captures

Captured on 2026-10-23 in an isolated Edge context, 1440 × 900, DPR 1, without browser chrome, credentials or private conversations. Source: the UI-04A.1 working tree based on Checkpoint-01 `75ff6ab24365876fb6a7764ee2be76e7add7b167`, before real project media was added. Its preserved source-and-evidence archive has SHA256 `6d1913a7f7ae5fbe305d31a6c1d9ce691ddca6a94bfcca8a41cb535a238908b7`. The archive is a local review artifact, not a public download.

The three views are Cover Reveal at 100%, the pre-media Creative Lab gallery, and the actual Music Museum (including its genuine no-lyrics state). Originals remain in the local evidence archive; their identifiers and hashes below preserve provenance without publishing browser profiles, raw logs or machine paths.

Website images use WebP quality 94 / method 6, proportional resizing only, without cropping. The two DSH images use lossless WebP at their original dimensions.

## DSH Pulse Rail: pinned historical repository material

The README-linked images belong to the published 0.2.2-era repository at commit `f412cffec947cbde8cfb4c97aad48d58b9ebdf50`:

- [Navigation rail original](https://github.com/rinsoraa/dsh-pulse-rail/blob/f412cffec947cbde8cfb4c97aad48d58b9ebdf50/docs/rail-pulse.png), Git blob `4eb1560f750cae9774a7e023438b670bc84bad20`.
- [Settings panel original](https://github.com/rinsoraa/dsh-pulse-rail/blob/f412cffec947cbde8cfb4c97aad48d58b9ebdf50/docs/settings-panel.png), Git blob `ca5cbaa35a62294cfa5f3ba314b5ee43e416a5eb`.
- [Upstream MIT notice](https://github.com/rinsoraa/dsh-pulse-rail/blob/f412cffec947cbde8cfb4c97aad48d58b9ebdf50/LICENSE), Git blob `3bf8e19365250b76d55ff43820be6ee4caf6cbc5`; the complete notice is retained at [dsh-pulse-rail/LICENSE.txt](dsh-pulse-rail/LICENSE.txt). 许可证文件与固定上游版本逐字节一致。 Copyright (c) 2026 dsh-pulse-rail contributors.

Checkpoint-02 independently fetched the pinned originals and verified their Git blobs and bytes. The converted WebP images are pixel-identical in RGBA to these originals. These static historical views do **not** prove current host operation or audio-driven animation; those remain NOT_TESTED. The 95 px rail is not promoted to a fabricated landscape screenshot.

## Original image fingerprints

| Local source identifier | Dimensions | Bytes | SHA256 |
|---|---:|---:|---|
| home-cover-revealed.png | 1440 × 900 | 1222654 | `b8264595f4f3d6d57cae67ee12cc0487a32f7969690366e01ef7f763cf136525` |
| home-creative-lab.png | 1440 × 900 | 782747 | `2b1c57d830eda7e8e0ea49d5ee64999210de97d41683e508258b2474db0db917` |
| home-music-museum.png | 1440 × 900 | 474576 | `37d2a0eb912562fef617d48962a5bc0e22cf50b85fd590e2fac01d24d6941354` |
| dsh-rail-pulse.png | 95 × 467 | 3416 | `f90ee572451081dda29829f0311e968a370f20bdc63953b89dac1f4937818de1` |
| dsh-settings-panel.png | 350 × 498 | 30379 | `7649067172aebba1ac8d7172bf4d84ffd99adbd847b4f2faef05ddc23f4f7835` |

## Public deployment image fingerprints

Paths are relative to this directory. All seven were fully decoded, format/size checked, and visually inspected at Checkpoint-02.

| File | Dimensions | Bytes | SHA256 |
|---|---:|---:|---|
| rinsoraa-rinsoraa-github-io/cover-small.webp | 480 × 300 | 40224 | `cf93d82c25392ddedfa32f566abbd073697376907674916e495a5450ec815cff` |
| rinsoraa-rinsoraa-github-io/cover.webp | 960 × 600 | 106624 | `e97649821f85d3c49ddbcc195b2e198395010f58ef336a96a21d2bcbf11c8e9b` |
| rinsoraa-rinsoraa-github-io/screen-01.webp | 1440 × 900 | 174814 | `4bb891df539c54492d91d5b1fe16a05c30adf52016f9efdd3ce8e4ea9632a73d` |
| rinsoraa-rinsoraa-github-io/screen-02.webp | 1440 × 900 | 76510 | `225d930dcb96e86c81531c444aa1b1c968ae80f9251966554623a71a02d001e0` |
| rinsoraa-rinsoraa-github-io/screen-03.webp | 1440 × 900 | 58224 | `f7050e62a5f0d16ea5b85ccecb42820cb6efc4ba411af3b4850fe96624bcdccb` |
| dsh-pulse-rail/screen-01.webp | 95 × 467 | 532 | `4a0e41329d7ccd61b4a1703b2bcb6ec1804fe4d058afd5fc1f0f36c51f621432` |
| dsh-pulse-rail/screen-02.webp | 350 × 498 | 6914 | `976f7c79a74c04cd4a49cd86564935b053992253f33e4b1e67dbb3f448462741` |

Total: 463,842 bytes. Website gallery captures are historical page records rather than promises that every later UI revision looks identical.

## Pending projects

TrayHider, CatooBot, Markdown-reader and Bilibili have no verified public screenshot in this delivery. They retain clearly identified CSS/SVG project portraits. Do not substitute unrelated interfaces. CatooBot media needs explicit public-use permission and privacy review; the other tools need verified runtime captures and account/notification review. No private QQ conversation was collected.

## UI-04A.3 — Cover Reveal real interaction recording

Captured on 2026-10-23 from the frozen Checkpoint-02 source at `96f94fc7fe5ccc017f9ec0f8598990cc7c89de8f`, in a clean, isolated Edge browser. Actual mouse wheel events drive the existing controller: default → upward wheel → revealed hold → downward wheel → closed. No synthetic UI, static-image interpolation, private profile, browser chrome or recorded audio.

Viewport: 1440 × 810, recorded proportionally at 1280 × 720 / 25 fps. No spatial crop or speed change; only the initial loading/wait period is trimmed. Local Playwright recorder and its existing FFmpeg VP8 encoder were used without installing dependencies. MP4 was not produced because that bundled encoder does not support it; unsupported browsers keep the poster and static gallery. Safari/Firefox playback remains NOT_TESTED.

| Asset | Dimensions / duration | Bytes | SHA256 |
|---|---|---:|---|
| Original browser recording (local evidence archive) | 1280 × 720, untrimmed | 1195445 | `c3fee99488a6ede606b7a74f885157c502b9b533f5a24c6aa6d53923c7760b44` |
| `rinsoraa-rinsoraa-github-io/demo-cover.webm` | 1280 × 720, 8.56 s, VP8, no audio | 719845 | `c231e9e18e1f66afcbca4c10c6c062bf1e208f38dd2cc974065d555b73244d45` |
| `rinsoraa-rinsoraa-github-io/demo-cover-poster.webp` | 960 × 540 | 81980 | `b310b33a570b5f3372620d1ee829736d3143b574daae085c1c0bec6fdb5e17c8` |

The poster is extracted from the deployed clip at 3.9 s and proportionally resized (WebP quality 92); its full-size PNG frame SHA256 is `9ca097b09f9edbdc9853f63ddae02c2afc237a8b98024b6bc45b980e6051696b`. The video uses VP8 CRF 12 / target 1000 kbit/s, with no audio stream. Original recording, event timestamps, encoding command and source/frame hashes are retained in local review evidence rather than publishing machine paths or raw test logs.

DSH Pulse Rail has no verified current-host recording; its existing two images remain historical material only. TrayHider, CatooBot, Markdown-reader and Bilibili also remain DEMO_PENDING. No compare experience is configured publicly: the labelled comparison fixtures used during validation are not product media or evidence of a TrayHider outcome.
