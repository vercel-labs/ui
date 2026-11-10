import { isComposing } from "../kernel/events"
import { createCaretRects } from "./caret"

/**
 * What `createInputHistory` takes.
 * @experimental
 */
type InputHistoryOptions<T> = {
  /** The earlier values, oldest first. */
  entries: () => readonly T[] | undefined
  /** The value the field shows now. */
  read: () => T
  /** Shows a value, as if the user typed it. Return `false` when the change was canceled. */
  write: (value: T, event: KeyboardEvent) => boolean | void
  /**
   * Whether the caret can't move any further in `direction`, so the arrow
   * reaches the earlier values. Defaults to the first and last line of a
   * textarea, and anywhere in a text input.
   */
  atEdge?: (direction: "up" | "down", event: KeyboardEvent) => boolean
}

const recallableTypes = new Set(["text", "search", "url", "email", "tel"])

type TextField = HTMLInputElement | HTMLTextAreaElement

const textFieldOf = (event: KeyboardEvent) => {
  const target = event.target as Element | null
  return target?.localName === "input" || target?.localName === "textarea"
    ? (target as TextField)
    : undefined
}

function atTextEdge(direction: "up" | "down", event: KeyboardEvent) {
  const field = textFieldOf(event)
  if (!field) {
    return true
  }
  if (field.localName === "input") {
    return recallableTypes.has(field.type)
  }
  const { value } = field
  const caret = field.selectionStart ?? 0
  if (caret !== field.selectionEnd) {
    return false
  }
  const end = direction === "up" ? 0 : value.length
  if (caret === end) {
    return true
  }
  const between =
    direction === "up" ? value.slice(0, caret) : value.slice(caret)
  if (between.includes("\n")) {
    return false
  }
  // A long line wraps, so only its first or last visual row is the edge.
  const caretAt = createCaretRects(field)
  return caretAt(caret)?.y === caretAt(end)?.y
}

const sameEntries = <T>(a: readonly T[], b: readonly T[]) =>
  a.length === b.length && a.every((entry, index) => Object.is(entry, b[index]))

/**
 * Steps through earlier values with the arrow keys, like a terminal or a
 * chat box: ArrowUp brings back the previous value, ArrowDown the next, and
 * ArrowDown past the newest brings back what was being typed. Edits to a value
 * brought back last until `entries` changes, like after a send.
 *
 * ```ts
 * const history = createInputHistory({
 *   entries: () => options().history,
 *   read: () => store.get().value,
 *   write: (value) => store.set({ value }),
 * })
 * root: slot({ on: { keydown: (event, { api }) => api.history.keydown(event) } })
 * ```
 * @experimental
 */
function createInputHistory<T>(options: InputHistoryOptions<T>) {
  const atEdge = options.atEdge ?? atTextEdge
  let seen: readonly T[] = []
  // The index shown, where `seen.length` is the value being typed.
  let at = 0
  const edits = new Map<number, T>()

  function reset() {
    seen = options.entries() ?? []
    at = seen.length
    edits.clear()
  }

  function step(by: -1 | 1, event: KeyboardEvent) {
    const entries = options.entries() ?? []
    if (!sameEntries(entries, seen)) {
      reset()
    }
    const next = at + by
    if (next < 0 || next > seen.length) {
      return false
    }
    edits.set(at, options.read())
    const value = edits.has(next) ? (edits.get(next) as T) : seen[next]
    if (options.write(value, event) === false) {
      return false
    }
    at = next
    const field = textFieldOf(event)
    field?.setSelectionRange(field.value.length, field.value.length)
    return true
  }

  return {
    /** Handles ArrowUp and ArrowDown on the field. Returns whether it brought back a value. */
    keydown(event: KeyboardEvent) {
      const direction =
        event.key === "ArrowUp"
          ? "up"
          : event.key === "ArrowDown"
            ? "down"
            : null
      const field = event.target as HTMLElement | null
      if (
        !direction ||
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        isComposing(event) ||
        (field as TextField | null)?.readOnly ||
        field?.getAttribute("aria-expanded") === "true" ||
        !atEdge(direction, event)
      ) {
        return false
      }
      if (!step(direction === "up" ? -1 : 1, event)) {
        return false
      }
      event.preventDefault()
      return true
    },
    /** Starts again from the newest value, and forgets edits to values brought back. */
    reset,
  }
}

export { createInputHistory, type InputHistoryOptions }
