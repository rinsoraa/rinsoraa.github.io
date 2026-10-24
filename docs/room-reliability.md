# Room lifecycle and recovery

The drawer owns entry, cancellation, focus and scroll restoration. The existing
scene owns rendering. There is one scene per document; closing pauses it.

## Entry and focus

`RinsoraRoom.enter({ trigger: element })` returns the shared pending entry promise.
The optional trigger identifies the initiating control even when it is temporarily
disabled. Existing `enter()` callers remain supported. Wheel entry deliberately
has no button trigger.

The drawer captures the current route and overlay ownership before waiting.
Navigation or a new overlay cancels pending entry and dismisses an open room
without restoring stale focus or scroll. Normal exit restores a usable original
control, otherwise the current section heading. The homepage is temporarily
`inert` while the room is open; its previous value is restored before focus.
Entry saves the reading position and scrolls to the top so the viewport-sized
sheet clears the room even after Tab has scrolled the Hero into view. Normal
exit restores that saved position.

`leave({ restoreFocus: false, restoreScroll: false })` lets navigation take
ownership without an intermediate focus change. Cancellation and failed entry
never schedule a delayed focus restoration. `getState()` returns a read-only
snapshot for status and diagnostics.

## Module boundaries

The module emits `rinsora:room-evaluating` before executing the scene body and
`rinsora:room-ready` after it. Their detail is `import.meta.url`. Entry also waits
for the matching script's load event and the existing scene readiness contract.
A script load event alone does not prove successful evaluation.

| Situation | Recovery |
| --- | --- |
| Fetch/HTTP/MIME failure before execution | Explicit retry creates a new URL after removing the failed element. |
| Reported syntax error before execution | Explicit retry is safe; no scene body ran. |
| Runtime failure after execution began | Pause partial state when possible; refuse reinjection. User may refresh manually. |
| Load without an evaluation boundary | Refuse uncertain reinjection and report the missing contract. |
| Fetch still pending after 20 seconds | Settle the entry promise, retain the single uncertain module task. Later explicit entry can wait on it again. |
| Executed module has not made the scene ready | Settle entry after 20 seconds; reuse that instance on a later attempt. |
| User cancellation/navigation | Settle entry immediately; late completion stays closed and paused. |
| Initialized scene | Resume it, without another script or renderer. |

Retry URLs are changed only after a confirmed pre-execution failure, since the
browser can retain failed module fetches in its module map. The current bundle
has no imported dependencies executing before its first boundary. Changing this
contract requires reviewing recovery safety. There is no automatic refresh or
infinite retry. Gesture scrolling does not retry failed downloads.

Rendering keeps a single pending animation-frame handle, cancels it on pause or
document hiding, and schedules at most one on resume. Embedded scenes start
paused; standalone scenes retain their normal startup behavior.

The existing Lab/Memory/Cover gesture ownership remains independent. Route and
overlay entry points notify the room before asynchronous work starts, while the
drawer also observes ownership changes as a guard against late completion.

## Verification

Run `node tests/room-controller.test.cjs` and `python tools/check-site.py`.
Check module syntax as an ES module, not as CommonJS. Browser acceptance must
exercise actual network interception and the real scene; controlled unready or
execution-error fixtures must be labelled separately from real scene tests.
Local RH-01 evidence is kept separately from public source documentation.
