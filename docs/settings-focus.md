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

Escape closes settings first. Normal close restores a valid trigger in the same
context, otherwise a safe current heading/control. Navigation and explicit Lab,
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
