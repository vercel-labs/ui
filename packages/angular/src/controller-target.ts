import {
  computed,
  effect,
  signal,
  untracked,
  type WritableSignal,
} from "@angular/core"

// The component each controller is attached to, read by parts outside it. A
// signal per controller, so a part that reads one with no component yet binds
// once it registers, and no other controller's parts hear of it.
const controlled = new WeakMap<object, WritableSignal<unknown>>()

function targetOf(controller: object) {
  const target = controlled.get(controller) ?? signal<unknown>(undefined)
  controlled.set(controller, target)
  return target
}

// The component a part connects to: the one its controller is attached to,
// from anywhere on the page, or else `nearest`, the one it sits in.
function useControllerTarget<T>(
  controller: () => object | undefined,
  nearest: T | undefined
) {
  return computed(() => {
    const current = controller()
    return current
      ? ((targetOf(current)() as T | undefined) ?? nearest)
      : nearest
  })
}

// Registers a popup with its controller, on the server too, so a trigger
// outside is in the server's HTML with its id and ARIA.
function useControllerEntry(
  controller: () => object | undefined,
  value: unknown
) {
  effect((onCleanup) => {
    const current = controller()
    if (!current) {
      return
    }
    const target = targetOf(current)
    target.set(value)
    onCleanup(() => {
      if (untracked(target) === value) {
        target.set(undefined)
      }
    })
  })
}

export { useControllerEntry, useControllerTarget }
