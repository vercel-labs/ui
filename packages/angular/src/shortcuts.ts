import {
  afterNextRender,
  computed,
  effect,
  inject,
  PLATFORM_ID,
  signal,
} from "@angular/core"
import { initialApple, isApple } from "@ui-sdk/core/renderer"
import {
  ariaKeyshortcuts,
  formatShortcut,
  shortcuts,
  type ShortcutHandler,
  type ShortcutOptions,
} from "@ui-sdk/core/shortcuts"

/**
 * A value, or a function that reads it, like a signal, so it stays in sync.
 * @stable
 */
type MaybeGetter<T> = T | (() => T)

/**
 * Options for `useShortcut`. `layer` also takes a getter.
 * @stable
 */
type UseShortcutOptions = Omit<ShortcutOptions, "layer"> & {
  /** An element inside a popup, or a getter of one. The shortcut belongs to that popup. */
  layer?: MaybeGetter<Element | null | undefined>
}

const read = <T>(value: MaybeGetter<T>) =>
  typeof value === "function" ? (value as () => T)() : value

/**
 * Registers a keyboard shortcut for the life of the component, in the shared
 * `shortcuts`. Keys can be a signal or a getter, and nothing registers for
 * `null`. Options can be a getter too, like `() => ({ scope: this.scope() })`,
 * and it registers again when what they read changes. Nothing registers on
 * the server. Call it in a field initializer.
 * @stable
 */
function useShortcut(
  keys: MaybeGetter<string | null | undefined>,
  handler: ShortcutHandler,
  options: MaybeGetter<UseShortcutOptions> = {}
) {
  const server = inject(PLATFORM_ID) === "server"
  effect((onCleanup) => {
    const current = read(keys)
    if (!current || server) {
      return
    }
    const { layer, ...rest } = read(options)
    onCleanup(
      shortcuts.register(current, handler, {
        ...rest,
        layer: layer === undefined ? undefined : () => read(layer),
      })
    )
  })
}

/**
 * Keys formatted for this platform, like `⌘S` on Apple platforms and `Ctrl+S`
 * elsewhere, with the matching `aria-keyshortcuts`, as signals. The server
 * and the first client render use the same platform, so hydration matches,
 * and they update once the page renders. Keys can be a signal or a getter.
 * The text is wrapped in a left-to-right isolate, like `formatShortcut`'s.
 * Call it in a field initializer.
 * @stable
 */
function useShortcutHint(keys: MaybeGetter<string>) {
  const apple = signal(initialApple())
  afterNextRender(() => apple.set(isApple()))
  return {
    /** The keys as people read them on this platform. */
    text: computed(() => formatShortcut(read(keys), apple())),
    /** The keys for `aria-keyshortcuts`. */
    ariaKeyshortcuts: computed(() => ariaKeyshortcuts(read(keys), apple())),
  }
}

export {
  ariaKeyshortcuts,
  formatShortcut,
  registerShortcut,
  shortcuts,
} from "@ui-sdk/core/shortcuts"
export type {
  ShortcutHandler,
  ShortcutInfo,
  ShortcutKeys,
  ShortcutOptions,
  Shortcuts,
} from "@ui-sdk/core/shortcuts"

export {
  type MaybeGetter,
  useShortcut,
  useShortcutHint,
  type UseShortcutOptions,
}
