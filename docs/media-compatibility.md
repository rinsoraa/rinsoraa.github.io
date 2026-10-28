# Media compatibility and local acceptance

The site keeps one existing HTMLAudioElement. No extra audio engine, transcoder,
runtime dependency or automatic remote upload is introduced. Project/Memory media
and the music identity data retain their original files and hashes.

Playback requests now report a recoverable error in the existing player. A user
can retry the same source or explicitly select another track whose MIME is
advertised by that browser. Selecting the alternative updates the normal track
identity and label; it never pretends the original track played. `canPlayType` is
a candidate hint, not decode proof. The actual play Promise and media events decide
success. Stale requests, cancellation and quiet cross-document resume do not
replace a newer message or take focus from another foreground owner.

On a hard media error the playing indicator and lyric animation stop. Recovery
keeps the shared player instance and returns focus from a hidden error action to
its normal play control. There is no timer-driven retry or new animation loop.

Current Windows test engines differ: the original Ogg/Vorbis welcome track fails
in the available Playwright WebKit build, while the existing MP3 tracks play. The
Ogg source is preserved and remains UNSUPPORTED in that matrix. Real Safari and
physical mobile results cannot be inferred from Windows WebKit. Platform codec
differences are also documented by [Playwright](https://playwright.dev/docs/browsers#webkit).
No missing support is reported as a pass.

## Native PCM fixture

Some native media backends do not reliably use browser-route response interception.
The optional local test server can expose a generated, same-origin PCM WAV:

```text
python tools/serve-browser-check.py --port 8910 --test-api --media-fixture --request-log local-results/requests.jsonl
node tests/browser/article-modal.cjs --browser webkit --url http://127.0.0.1:8910/ --out docs/local/article-webkit --pcm-fixture http://127.0.0.1:8910/__test_pcm.wav
```

The switch defaults off. It creates no on-disk media and does not alter music data.
The fixture is 30 seconds of synthetic silence, mono PCM16, 8 kHz. It tests the
same audio instance and continuity assertions; it is not a real project recording.
Without the option the older interception path remains available for comparison.
Retain old failures instead of declaring a failed intercept a codec result.

## Contrast and browser checks

Editor header controls, the shared Moments action, adjacent Settings copy and the
playback recovery card use scoped color rules. Palettes, gradients, shadows and
animations remain. Mixed EOL in style.css is preserved; no blanket normalization
or Git configuration change is appropriate.

```text
node tests/browser/theme-contrast.cjs --browser edge --url http://127.0.0.1:8910/ --out docs/local/contrast --widths 390,768,1440
python tools/check-rendered-contrast.py docs/local/contrast --all
node tests/browser/media-compatibility.cjs --browser webkit --url http://127.0.0.1:8910/ --out docs/local/media
node tests/browser/webkit-lifecycle.cjs --url http://127.0.0.1:8910/ --out docs/local/cold --rounds 20
```

The rendered contrast checker needs Pillow only for optional development checks.
It samples actual background PNG pixels within individual text-node boxes, after
temporarily making only measured text transparent in the test context. It uses
computed solid foreground and effective opacity, preserving textures/backdrops.
Antialiased glyph-edge pixels are not used. Decorative title stars and disabled
controls are reported separately. The targets follow [WCAG contrast requirements](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html);
the checks do not certify whole-site WCAG compliance or real screen-reader use.

Browser lifecycle samples retain the original 8-second DOMContentLoaded and
1200ms Settings gates. Navigation/launch failures are separated from executed
product assertions. Cleanup has its own bounded record and only the worker's own
BrowserServer can be terminated after a cleanup failure. A new independent process
is used for each cold case; do not present that as proof that repeated-context
driver behavior or real Safari has been repaired.

Shared startup Long Tasks, historical LCP/CLS, WebKit limitations, untested devices
and real assistive technology remain release risks. A local compatibility result
does not waive the inherited performance FAIL or authorize publishing.

## Acceptance boundary

The measured scope is the reported controls and states, not whole-site WCAG
conformance. Screenshot contrast checks reject mismatched geometry instead of
sampling a different part of the page. Transitions and effects remain enabled.
Pillow is an optional development prerequisite for the PNG analysis helper;
none of these management/test tools loads on a public page.

Current scoped status: Museum's strict 1500ms exit acceptance remains open.
A shorter final curtain fade was tested in isolation and rejected after real focus
failures; it was not adopted. Native mobile lyric/navigation now completes the
nine engine/width operation sequences when each control is genuinely visible,
hit-testable and in the intended expanded/collapsed state. Earlier invalid setup
sequences and product failures remain archived separately.

Memory's nonblocking CSS contract and failure fallback retain their own tests;
this does not prove every slow-load observation or shared startup issue closed.
The original Ogg remains unsupported in the tested WebKit build. Real Safari,
physical mobile and screen readers remain unverified. Performance remains FAIL.

The local test API is explicit opt-in and loopback-only. Its model/PCM MIME, Range,
controlled 503/recovery and durable request ledger are checked independently.
See [portable browser testing](browser-testing.md). Unknown foreground blending,
unstable screenshot pairs and missing states remain unmeasured; focus outlines
and selected-state outlines are classified separately. These limits cannot be
converted into WCAG compliance or release permission.
