# Article modal and history contract

The existing SPA owns article routes (`#/post/<file>.html`) in script.js. Real
`posts/<file>.html` anchors, independent pages, canonical metadata and modified
clicks remain available. Article identity comes from those existing links.

The custom #spaPost remains a child of #app. It is not replaced by showModal.
On entry the host captures the triggering element before other overlays close.
The modal focuses its fixed return control, then applies aria-hidden to sibling
branches along its ancestry. It never marks #app or its ancestors inert/hidden.
Captured Tab/Shift+Tab, focusin and pointer guards restrict interaction to the
article. The shared audio element stays outside; no second player is created.
The reader covers the external player controls while modal; playback continues.

The existing opening fade keeps its one local layout commit. Closing is atomic:
the overlay is hidden, prior ARIA states are restored, and only then can a return
control receive focus. Closing does not focus behind a fading exit overlay.

A clicked article owns one History entry with a per-document key and origin
page/hash/scroll metadata. Switching articles replaces that modal entry. Back
returns to the origin; Forward reopens the final article. DOM references are not
serialized into History. After reload a previous document's key cannot authorize
an automatic Back. Direct entry and reload exit replace the fragment with #blog;
query flags are preserved and no unrelated history entry is traversed.

Return focus uses a connected, visible source, its current matching article link,
or a visible heading in the active section. If no target is visible, a safe heading
is brought into view. Epoch-guarded return work cannot reclaim focus after
new navigation or another foreground owner has taken over.

Each request has an epoch and optional AbortController. Replace, cancel, navigation,
pagehide or takeover invalidates prior callbacks. Both success and failure check
identity, including reopen of the same URL. Errors stay inside the reader with
retry/return and an explicit new-tab original link. No fetch failure automatically
assigns location.href. Async completion updates content/title, never focus.

RinsoraHome.openPost(url, push, trigger) accepts only local single-file posts HTML
paths; closePost() is shared by Escape and the return control. Overlay owners use
the existing closeSettings({restoreFocus:false}) handoff; an article request alone
uses preserveArticle to avoid cancelling an intentional replacement. No Room or
music module is wrapped or rewritten. Native dialog takeover, body owner changes
and focus changes also release the article. BFCache pageshow reuses routeHash for
an article fragment; this does not add a parallel router.

Article links receive explicit tabindex=0 during existing recent/blog rendering.
The tested Windows WebKit skipped implicit links; a single-variable comparison
showed explicit tabindex resolved native Tab access. Existing explicit tabindex
choices are preserved. No new full-page mutation observer or reveal scan is added.

Portable checks:

```text
node tests/article-modal.test.cjs
node tests/browser/article-modal.cjs --browser edge --url http://127.0.0.1:8910/ --fixture http://127.0.0.1:8911/ --out docs/local/article-edge
```

Playwright is optional development tooling (`PLAYWRIGHT_MODULE` may select it).
Use the loopback helper documented in browser-accessibility-checks.md. Run the same
cases with firefox and webkit. Viewports and touch inputs are simulations. Engine
AX snapshots are not real screen-reader acceptance; WebKit is not real Safari.
Keep failures, source hashes and stage evidence. Passing article focus/history
does not close unrelated settings, codec, shared-startup or release risks.

## Return scroll settlement

The return microtask is followed by at most two cancellable animation-frame
checks. Native fragment/history scrolling can commit after the microtask; the
checks reconcile the saved reading position and the still-current return target.
A clipped fallback heading is brought fully into the viewport. A valid original
link retains precedence and its reading position is preserved. This does not
unconditionally scroll every exit to the top or disable browser scroll restoration.

Epoch, active page, fragment, modal owner and current focus guard each check.
Reopen, navigation, pagehide and real input cancel settlement. Another usable
control gaining focus is respected. After two frames no return job or RAF remains;
there is no scroll listener, polling loop or long focus retry. Background modal
isolation, article URLs, history metadata and request cancellation are unchanged.

The scroll gate may choose the section heading or an existing visible blog heading
when no source survives. A safe fallback is a viewport contract, not a hard-coded
zero scroll position. Startup and shared-layout performance risks remain open.

```text
node tests/browser/article-return-scroll.cjs --browser edge --url http://127.0.0.1:8910/ --out docs/local/article-scroll --rounds 20
```
