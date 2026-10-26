# Settings focus ownership

Settings is a custom modal drawer using the existing full-viewport mask, body
scroll lock, keyboard focus cycle and an outside-click/focus fence. It does not
claim to be a native HTML dialog. The mask blocks ordinary background pointers;
the capture guard also rejects controls above the mask. Tab / Shift+Tab stay in
visible enabled controls. Closed settings itself is inert and aria-hidden.
Screen-reader interoperability needs separate testing.

Opening captures the trigger and effective page / overlay context before cleanup
or focus moves. Reopening a session keeps the original return target. Focus enters
synchronously; transition events do not determine ownership. A failed initial
attempt has one cancellable frame retry, never a polling loop. Internal scrolling
keeps keyboard focus visible without scrolling the document.

The shortcut is ignored while the app cannot be shown, preventing an invisible
modal over the welcome screen. It also yields to a foreground Museum, article,
music-upload form or unrelated native dialog that covers the app. Existing Room,
Lab and Memory controllers handle their explicit handoff to settings.

A focusout event-boundary check handles a browser clearing focus without a new
focusin during startup. It is cancelled by the session epoch or an ownership
change. Native dialog opening, a newly focused ARIA modal, and explicit page /
overlay handoff release settings without restoring old focus. A small observer
watches body child additions and the known legacy music popup's class only while
settings is open; it disconnects on close, with stale callbacks rejected.

Escape closes settings first. Normal close restores a visible, valid trigger in the same
context, otherwise a visible current heading/control. A fragment or scroll change
can make an otherwise connected trigger offscreen; return focus never lands there. Navigation and explicit Lab,
Memory, Museum, Room or article handoff use `restoreFocus: false`. Previous body
overflow is restored. No transform/filter is added to fixed-element ancestors.

Whole-background inert mutations were tested and rejected: they restyled over a
thousand background elements during opening. The final mask/focus/scroll contract
keeps interaction blocked without that full-page style invalidation. No shared
Reveal scheduler, font ordering or global initialization change is included.

`tests/settings-focus.test.cjs` exercises the exact factory extracted from
`script.js`: original-source return, invalid-source fallback, modal input fences,
internal scrolling, queued callback cancellation and ownership watch cleanup.
Real browser cold starts, trusted pointer input and overlay checks are recorded
separately. Node tests are not browser acceptance.


## RH-03 FU2A: visible focus and background semantics

All settings entries place the drawer at its final on-screen position before
focusing a control. A translated root is not an acceptable place to hold modal
focus while a compositor transition is still pending. The backdrop fade and the
closing transition remain; this is a local interaction decision, not a shared
initialization or animation-system replacement.

The controller hides sibling branches along the drawer's ancestry path with
aria-hidden, saving each previous value. The drawer is inside #app: neither
#app nor any other ancestor is hidden or made inert. Closing/handoff restores
only values still owned by the controller. Pointer, Tab and focus guards remain;
aria-hidden alone does not prevent DOM interaction. No full-page inert mutation,
continuous frame loop or new global observer is introduced.

Closing makes the ordinary synchronous return attempt, then allows one
cancellable paint-boundary check for native fragment focus clearing. Reopen,
page/owner changes, explicit no-return handoff and pagehide invalidate it. This
is not a timed multi-second focus retry. A visible fixed mobile current-section
button precedes scrolling headings in the fallback list; a valid original source
still has priority. It prevents startup scroll anchoring from carrying a fallback
heading outside the viewport.

Museum entry controls pass their actual trigger explicitly, including browsers
that do not focus a clicked button. Direct-entry BODY/HTML, hidden, inert and
offscreen sources are rejected. Return focus runs from the existing Museum
curtain completion callback (including its finite opacity fade), guarded by the host entry token and current overlay
ownership. No new exit delay, timer or separate router is added. A stale callback
cannot reclaim focus after a new entry or another foreground owner.

The sibling isolation follows the [WAI-ARIA modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/):
modal interaction stays inside, and the dialog must remain outside hidden
background branches. Browser AX-tree and keyboard tests provide bounded evidence;
they do not replace real screen-reader browsing/virtual-cursor acceptance.
Screen readers and physical devices require separately recorded testing.

Optional portable browser gates:

```text
node tests/browser/focus-isolation.cjs --browser firefox --url http://127.0.0.1:8910/ --fixture http://127.0.0.1:8911/ --out docs/local/focus-firefox --cold-rounds 20
```

Run the same cases with Edge and WebKit. Playwright WebKit is not real Safari.
Existing shared-startup and Lab performance uncertainty remains open.
