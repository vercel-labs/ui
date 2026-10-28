// A color scheme: what the app chose (`"system"`, `"light"` or `"dark"`), what
// the browser prefers, from `prefers-color-scheme`, and what that resolves to.
// Every color scheme on a window shares one MediaQueryList and one `change`
// listener, so a page of them costs one listener.
//
// The server can't know the browser's preference, so it's `"unknown"` there
// and in the first client render, unless the request's
// `Sec-CH-Prefers-Color-Scheme` hint says, through `initial`. A stylesheet
// answers `"system"` with its own `prefers-color-scheme` query, so the first
// paint is right before any script runs.
import { createDetails, type ChangeDetails, type ChangeReason } from "../kernel/details"
import { changeSource } from "../kernel/input-source"
import { isBrowser } from "../platform/env"
import type { ValueStorage } from "../storage/storage"

/**
 * A color scheme the app can choose: `"light"`, `"dark"`, or `"system"`,
 * which follows the browser's preference. Style `"system"` with CSS
 * `prefers-color-scheme`, so it renders right before the preference is known.
 * @experimental
 */
type ColorSchemeValue = "system" | "light" | "dark"

/**
 * A scheme as the browser knows it: `"light"`, `"dark"`, or `"unknown"` on
 * the server, before hydration, and in browsers without `prefers-color-scheme`.
 * @experimental
 */
type SystemColorScheme = "light" | "dark" | "unknown"

/**
 * Everything a color scheme knows, from `get`, `subscribe` and `follow`.
 * @experimental
 */
type ColorSchemeState = {
  /** What the app chose. `"system"` follows the browser's preference. */
  value: ColorSchemeValue
  /** What the browser prefers. */
  system: SystemColorScheme
  /** What shows: `value`, or `system` when `value` is `"system"`. */
  resolved: SystemColorScheme
}

/**
 * Options for `createColorScheme`.
 * @experimental
 */
type ColorSchemeOptions = {
  /**
   * The scheme the app starts with, like a choice saved in a cookie that the
   * server read.
   * @defaultValue "system"
   */
  defaultValue?: ColorSchemeValue
  /**
   * The browser's preference the server and the first client render assume,
   * so hydration matches. Read the request's `Sec-CH-Prefers-Color-Scheme`
   * hint with `colorSchemeOf`.
   * @defaultValue "unknown"
   */
  initial?: SystemColorScheme
  /** Called before the app's scheme changes. `details.cancel()` keeps the current one. */
  onValueChange?: (value: ColorSchemeValue, details: ChangeDetails<ChangeReason>) => void
  /** Called when the browser's preference changes, while something subscribes or follows. */
  onSystemValueChange?: (value: "light" | "dark") => void
  /**
   * Where the choice is kept between visits, from `createLocalStorage`,
   * `createSessionStorage` or `createCookieStorage`. A cookie the server reads
   * renders from the first render; the others are read back once something
   * subscribes or follows, after hydration, with the reason `"restore"`.
   */
  storage?: ValueStorage
  /** The window to read, like an iframe's. Defaults to the page's window. */
  view?: Window
}

/**
 * A primitive's store, or any state with `get` and `set`, that `follow` keeps in step.
 * @experimental
 */
type ColorSchemeStore<Key extends string> = {
  /** The current state. */
  get: () => { [K in Key]: ColorSchemeState }
  /** Writes part of the state. */
  set: (partial: { [K in Key]: ColorSchemeState }) => void
}

type Shared = {
  query: MediaQueryList
  supported: boolean
  listeners: Set<() => void>
  notify: () => void
}

const sharedByView = new WeakMap<Window, Shared>()

// The window's one query and its listeners, made the first time a color scheme reads it.
function sharedOf(view: Window | undefined) {
  if (!view || typeof view.matchMedia !== "function") return
  let shared = sharedByView.get(view)
  if (shared) return shared
  const query = view.matchMedia("(prefers-color-scheme: dark)")
  const listeners = new Set<() => void>()
  shared = {
    query,
    // A browser that doesn't know the feature reports the query as "not all".
    supported: query.media !== "not all",
    listeners,
    notify: () => {
      for (const listener of [...listeners]) listener()
    },
  }
  sharedByView.set(view, shared)
  return shared
}

const isValue = (value: string | null): value is ColorSchemeValue =>
  value === "system" || value === "light" || value === "dark"

const resolve = (value: ColorSchemeValue, system: SystemColorScheme) => (value === "system" ? system : value)

/**
 * The app's color scheme: a choice of `"system"`, `"light"` or `"dark"`, the
 * browser's preference, and what shows. Create one per scope, like the page
 * or a dark sidebar. They share one query per window.
 * @experimental
 */
function createColorScheme(options: ColorSchemeOptions = {}) {
  const initial = options.initial ?? "unknown"
  const { storage } = options
  const saved = () => {
    const value = storage?.get() ?? null
    return isValue(value) ? value : undefined
  }
  // What the storage held when this last read or wrote it, so subscribing
  // again catches up with whatever changed in between, removals too.
  // Undefined until the first read.
  let synced = storage?.readsOnServer ? storage.get() : undefined
  // A storage the server reads too starts the choice on both sides, so hydration matches.
  const defaultValue = (storage?.readsOnServer ? saved() : undefined) ?? options.defaultValue ?? "system"
  const shared = () => sharedOf(options.view ?? (isBrowser ? window : undefined))
  let value = defaultValue
  const listeners = new Set<(state: ColorSchemeState) => void>()

  const systemNow = () => {
    const current = shared()
    const system: SystemColorScheme = current?.supported
      ? current.query.matches
        ? "dark"
        : "light"
      : initial
    return system
  }

  const snapshot = (value: ColorSchemeValue, system: SystemColorScheme) => {
    const next: ColorSchemeState = { value, system, resolved: resolve(value, system) }
    return next
  }
  const initialState = snapshot(defaultValue, initial)
  // The same object until something changes, so frameworks can compare snapshots.
  let state = initialState

  const get = () => {
    const system = systemNow()
    if (state.value !== value || state.system !== system) state = snapshot(value, system)
    return state
  }

  const notify = () => {
    const next = get()
    for (const listener of [...listeners]) listener(next)
  }

  let lastSystem: SystemColorScheme | undefined
  const onSystem = () => {
    const system = systemNow()
    if (system === lastSystem) return
    lastSystem = system
    if (system !== "unknown") options.onSystemValueChange?.(system)
    notify()
  }

  let unwatchStorage: (() => void) | undefined

  const subscribe = (listener: (state: ColorSchemeState) => void) => {
    // A wrapper per subscription, so the same listener subscribed twice stops once per call.
    const entry = (state: ColorSchemeState) => listener(state)
    listeners.add(entry)
    const current = shared()
    if (listeners.size === 1) {
      if (current?.supported) {
        lastSystem = systemNow()
        if (current.listeners.size === 0) current.query.addEventListener("change", current.notify)
        current.listeners.add(onSystem)
      }
      if (storage) {
        // Read back what was saved, now that hydration is done, then hear other tabs.
        const current = storage.get()
        if (current !== synced) {
          const first = synced === undefined
          synced = current
          // Nothing saved the first time keeps the starting choice. A choice
          // removed since the last read goes back to the default.
          if (isValue(current)) set(current, { reason: "restore" })
          else if (!first) set(options.defaultValue ?? "system", { reason: "restore" })
        }
        unwatchStorage = storage.subscribe((next) => {
          synced = next
          set(isValue(next) ? next : (options.defaultValue ?? "system"), { reason: "storage-sync" })
        })
      }
    }
    return () => {
      if (!listeners.delete(entry) || listeners.size > 0) return
      unwatchStorage?.()
      unwatchStorage = undefined
      if (!current?.listeners.delete(onSystem)) return
      if (current.listeners.size === 0) current.query.removeEventListener("change", current.notify)
    }
  }

  const set = (next: ColorSchemeValue, change: { reason?: ChangeReason; event?: Event } = {}) => {
    if (next === value) return false
    const reason = change.reason ?? "imperative"
    const details = createDetails({ reason, event: change.event }, changeSource(reason, change.event))
    options.onValueChange?.(next, details)
    if (details.canceled) return false
    value = next
    // A value read from storage is already there.
    if (reason !== "restore" && reason !== "storage-sync" && storage?.set(next)) synced = next
    notify()
    return true
  }

  return {
    /** What the server and the first client render show: `defaultValue`, with `initial` as the browser's preference. */
    initialState,
    /** What the color scheme knows now. The same object until something changes. */
    get,
    /**
     * Changes the app's scheme, through `onValueChange`, which can cancel it.
     * The reason defaults to `"imperative"`. Returns whether it changed.
     */
    set,
    /** Hears every change, to the app's scheme or the browser's preference. Returns the function that stops it. */
    subscribe,
    /**
     * The inline script to render right after the root that shows
     * `data-color-scheme`, which puts the saved choice there before
     * hydration, so CSS shows it on the first paint. Undefined without a
     * `storage`, or with a cookie, since the server renders its value.
     */
    script: () => storage?.script({ attribute: "data-color-scheme", values: ["system", "light", "dark"] }),
    /**
     * Keeps `key` in a store set to the color scheme's state. Call it from a
     * part's `bind`: the state starts at `initialState`, catches up a
     * microtask later, once hydration is done, and follows every change after
     * that. Returns the cleanup for `bind`.
     */
    follow<Key extends string>(store: ColorSchemeStore<Key>, key: Key) {
      const write = (next: ColorSchemeState) => {
        // A cast, since TypeScript can't tell that a computed key makes the mapped type.
        if (store.get()[key] !== next) store.set({ [key]: next } as { [K in Key]: ColorSchemeState })
      }
      let stopped = false
      let unsubscribe: (() => void) | undefined
      // A microtask later, like the platform's shortcut names, so every part
      // a framework hydrates in this pass renders what the server did first.
      queueMicrotask(() => {
        if (stopped) return
        unsubscribe = subscribe(write)
        write(get())
      })
      return () => {
        stopped = true
        unsubscribe?.()
      }
    },
  }
}

/**
 * A color scheme, from `createColorScheme`.
 * @experimental
 */
type ColorScheme = ReturnType<typeof createColorScheme>

/**
 * The browser's preference a `Sec-CH-Prefers-Color-Scheme` request header
 * reports: `"light"`, `"dark"`, or `"unknown"` when it's missing or unknown.
 * @experimental
 */
function colorSchemeOf(hint: string | null | undefined) {
  const value = hint?.trim().replace(/^"(.*)"$/, "$1")
  const system: SystemColorScheme = value === "light" || value === "dark" ? value : "unknown"
  return system
}

export {
  type ColorScheme,
  type ColorSchemeOptions,
  type ColorSchemeState,
  type ColorSchemeStore,
  type ColorSchemeValue,
  type SystemColorScheme,
  colorSchemeOf,
  createColorScheme,
}
