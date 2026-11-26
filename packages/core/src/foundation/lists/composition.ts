import { log } from "../kernel/change"
import { createDetails } from "../kernel/details"
import { isComposing } from "../kernel/events"
import { isAndroid } from "../platform/env"
import { changeSource } from "../kernel/input-source"
import { callbackName } from "../kernel/option-names"
import type { PrimitiveContext } from "../kernel/primitive-types"
import type { Store } from "../kernel/store"
import { watchers } from "../kernel/watchers"

type ComposingState = { composingFrom: string | null }

const hangul = /[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/

// Text an input method is still converting, like a half-typed とうk, follows the
// input, so a controlled value keeps it, but the list filters by the text from before.
// Android keyboards compose every word and Hangul every syllable, so that's typing.
function composingInput(
  store: Store<ComposingState>,
  event: Event | undefined,
  filterText: () => string
) {
  const composing =
    !!event &&
    isComposing(event as InputEvent) &&
    !isAndroid() &&
    !hangul.test((event as InputEvent).data ?? "")
  const held = store.get().composingFrom !== null
  if (composing && !held) {
    store.set({ composingFrom: filterText() })
  } else if (!composing && held) {
    store.set({ composingFrom: null })
  }
  return composing
}

// Chrome's last `input` of a composition is still composing, so the text a
// composition ends with is reported again when no later `input` changes it.
function endComposition<Options>(
  context: PrimitiveContext<Options, any, any>,
  store: Store<ComposingState>,
  key: string,
  value: string,
  event: Event
) {
  if (store.get().composingFrom === null) {
    return
  }
  store.set({ composingFrom: null })
  const details = createDetails(
    { reason: "input-change" as const, event, composing: false },
    changeSource("input-change", event)
  )
  log(context, key, value, details)
  const callback = (context.options() as Record<string, unknown>)[
    callbackName(key, "Change")
  ]
  if (typeof callback === "function") {
    callback(value, details)
  }
  watchers.change?.(context.id, key, value, details, value)
}

export { composingInput, endComposition, type ComposingState }
