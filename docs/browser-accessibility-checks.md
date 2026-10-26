# Optional browser and accessibility checks

The normal site and portable Node checks need no new browser dependency. These
manual development gates use Playwright, optional axe-core and Python 3. They do
not publish content or write GitHub. Keep browser binaries, downloads, screenshots
and raw reports in ignored local tooling/evidence directories.

Run two loopback servers from the repository. The second maps only the clearly
labelled TEST FIXTURE Memory JSON/images. It never changes formal Memory data.

```text
python tools/serve-browser-check.py --port 8910
python tools/serve-browser-check.py --port 8911 --fixture
```

With Playwright available to Node (or `PLAYWRIGHT_MODULE` pointing to its module),
run the same keyboard/media/route cases against installed Edge, Firefox or WebKit:

```text
node tests/browser/compatibility.cjs --browser edge --url http://127.0.0.1:8910/ --fixture http://127.0.0.1:8911/ --out docs/local/browser-edge
node tests/browser/resource-fallback.cjs --browser firefox --url http://127.0.0.1:8910/ --out docs/local/network-firefox
node tests/browser/semantics.cjs --browser edge --url http://127.0.0.1:8910/ --fixture http://127.0.0.1:8911/ --out docs/local/semantics --axe path/to/axe.min.js
```

`PLAYWRIGHT_BROWSERS_PATH` can select a local ignored browser installation.
`--only` selects explicitly named cases for isolated-process investigation;
skips are reported, not counted as passes. Windows WebKit cleanup/animation or
media failures must remain visible in the report. It is not real Safari.

Keyboard checks wait for the actual app/album/controller state, observe bounded
focus visibility during normal scrolling/transitions, and test meaningful
targets rather than merely the existence of `activeElement`. File inputs with
transparent native controls use their visible labelled focus outline as the
visual target. An intermediate browser-chrome Tab boundary is recorded.

Axe is supplemental. Its focus/scroll effects are kept separate from keyboard
acceptance. Modal scans concern the active dialog; whole-page raw observations
and engine AX snapshots must not be misrepresented as screen-reader traversal.
Physical devices, soft keyboards, real browser zoom, safe-area/toolbars, assistive
technology and actual Safari require additional manual acceptance.

The performance sentinel accepts baseline/candidate and optional fixture URLs
plus the same passive probe file for both. It preserves all samples, uses cold
isolated contexts, and reports a separate observed keyboard round trip rather
than claiming standard INP. A short local sentinel cannot prove equivalence.

The applicable checklist targets [WCAG 2.2](https://www.w3.org/TR/WCAG22/) and
the [WAI modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/).
Passing these development scripts is not a WCAG conformance claim or release
authorization. Preview promotion remains an isolated-copy exercise; no defaults,
media publishing permissions, project identities or formal memories change.

Additional optional gates:

```text
node tests/browser/mobile-simulation.cjs --browser edge --url http://127.0.0.1:8910/ --out docs/local/mobile-edge
node tests/browser/performance-sentinel.cjs --baseline http://127.0.0.1:8920/ --candidate http://127.0.0.1:8910/ --baseline-fixture http://127.0.0.1:8921/ --candidate-fixture http://127.0.0.1:8911/ --rounds 3 --out docs/local/performance
```

The performance gate uses the included passive-metrics.js by default. Keep a
separately frozen baseline server; do not point both URLs at a changing tree.
The mobile gate records immediate and bounded stable resize geometry; --width
selects one explicit viewport. --night on semantics.cjs audits stored night
preferences in isolated contexts. Result files count cases, not total runtime
assertions. Nonzero/partial results and capture timeouts remain evidence.
