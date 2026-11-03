// What every move through a draft shares, in a list, a tree or between lists:
// the draft in state, which renders as the item moves, a drop that commits it
// through the primitive's change and says where it landed, and a cancel that
// puts it back. Focus follows a keyboard move, since the framework moving the
// focused element drops its focus.
import { keepFocus } from "../focus/keep-focus"
import { settleDraft } from "../kernel/draft"
import type { Store } from "../kernel/store"

// What ended a move: a pointer letting go, or a key.
type DropReason = "drag" | "move-key"

function createDraftMove<State extends object, Draft extends { key: string; pointer: boolean }, Value>({
  store,
  draft: draftKey,
  value: valueKey,
  shown,
  same,
  commit,
  say,
  element,
}: {
  store: Store<State>
  // The state keys of the draft and of the value it commits.
  draft: keyof State
  value: keyof State
  // The value as the draft shows it.
  shown: (draft: Draft) => Value
  // Whether two values are the same, so a drop that moved nothing commits nothing.
  same: (a: Value, b: Value) => boolean
  // Commits a moved draft. Returns false when the change was canceled.
  commit: (draft: Draft, details: { reason: DropReason; event?: Event }) => boolean
  // Tells screen readers the item dropped or went back, in the value it's shown in.
  say: (type: "drop" | "cancel", draft: Draft, shownValue: Value) => void
  element: (key: string) => HTMLElement | undefined
}) {
  const draft = () => store.get()[draftKey] as Draft | null
  const value = () => store.get()[valueKey] as Value
  const setDraft = (next: Draft | null) => store.set({ [draftKey]: next } as Partial<State>)
  const focusLater = (key: string) => keepFocus(() => element(key))

  function drop(reason: DropReason, event?: Event) {
    const current = draft()
    if (!current) return
    const before = value()
    const moved = !same(shown(current), before)
    if (moved && !commit(current, { reason, event })) {
      setDraft(null)
      say("cancel", current, value())
    } else {
      say("drop", current, shown(current))
      // Keeps the draft until a controlled value's new value arrives.
      if (!moved) setDraft(null)
      else
        settleDraft(store, value, before, () => {
          if (draft()?.key === current.key) setDraft(null)
        })
    }
    if (!current.pointer) focusLater(current.key)
  }

  function cancel(refocus = true) {
    const current = draft()
    if (!current) return
    setDraft(null)
    say("cancel", current, value())
    if (!current.pointer && refocus) focusLater(current.key)
  }

  return { draft, value, setDraft, focusLater, drop, cancel }
}

export { createDraftMove }
