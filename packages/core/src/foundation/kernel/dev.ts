// Development-only code: warnings, the devtools hook and the `__UI_SDK__`
// console view. Core imports it as `#dev`, a conditional subpath import, so a
// production build resolves `dev-stub.ts` instead and ships none of this.
import type { ChangeReason } from "./details"
import { callbackName, defaultName } from "./option-names"

/**
 * What core reports to a devtools hook in development. Internal until the devtools ship.
 */
type DevEvent =
  | {
      type: "instance"
      action: "create" | "destroy"
      component: string
      id: string
      /** The keys the instance controls through options, like `["open"]`. */
      controlled: string[]
    }
  | {
      type: "change"
      component: string
      id: string
      key: string
      value: unknown
      reason: string
      source: string
      canceled: boolean
      /** Whether the key is controlled, so the owner has to pass the value back. */
      controlled: boolean
    }
  | {
      type: "commit"
      component: string
      id: string
      key: string
      value: unknown
      reason: string
      source: string
    }
  | {
      type: "layers"
      stack: { component: string; id: string; modal: boolean | "pointer"; blocking: boolean; el?: Element }[]
    }
  | { type: "warn"; message: string; component?: string; id?: string }
  | {
      /**
       * Options a framework handed over from an effect changed state its
       * parts hear, beside the keys it delivers itself, so the parts render
       * again inside that effect. Or what it read of them before, through
       * `follow`, differs from what the handover lands, so it rendered stale
       * state for a pass. Solid and Svelte specs expect none.
       */
      type: "relay"
      component: string
      id: string
      /** The keys it changed. */
      keys: string[]
    }

/** Whether this is the development build of core. */
const dev = true

// Put a devtools hook, `{ emit(event: DevEvent) }`, at this key to hear every event.
const hookKey = Symbol.for("ui-sdk.devtools@1")
const historyKey = Symbol.for("ui-sdk.devtools.history@1")
const limit = 500

// Kept per realm, like the layer stack, so two copies of core on one page
// share one history.
const history = ((globalThis as Record<symbol, unknown>)[historyKey] ??= {
  changes: [],
  warnings: [],
  layers: [],
  relays: [],
  shortcuts: undefined,
}) as {
  changes: Extract<DevEvent, { type: "change" }>[]
  warnings: Extract<DevEvent, { type: "warn" }>[]
  relays: Extract<DevEvent, { type: "relay" }>[]
  layers: Extract<DevEvent, { type: "layers" }>["stack"]
  shortcuts: (() => unknown[]) | undefined
}

function keep<T>(list: T[], item: T) {
  list.push(item)
  if (list.length > limit) list.splice(0, list.length - limit)
}

/** Reports an event to the devtools hook, when one is present, and to `__UI_SDK__`. */
function emit(event: DevEvent) {
  if (!installed) install()
  if (event.type === "change") keep(history.changes, event)
  else if (event.type === "warn") keep(history.warnings, event)
  else if (event.type === "relay") keep((history.relays ??= []), event)
  else if (event.type === "layers") history.layers = event.stack
  const hook = (globalThis as Record<symbol, unknown>)[hookKey] as
    { emit?: (event: DevEvent) => void } | undefined
  hook?.emit?.(event)
}

/**
 * Prints a development warning and reports it to the inspector. Names the
 * component and instance when it knows them, like `Popover#p3`. Set
 * `globalThis.__UI_SDK_DEV__ = false` to silence warnings.
 */
function warn(message: string, from?: { component: string; id?: string }, detail?: unknown) {
  if ((globalThis as { __UI_SDK_DEV__?: boolean }).__UI_SDK_DEV__ === false) return
  const name = from ? `${from.component}${from.id ? `#${from.id}` : ""}: ` : ""
  // A detail like an error is logged as itself, so the console shows its stack.
  if (detail === undefined) console.warn(`[ui-sdk] ${name}${message}`)
  else console.warn(`[ui-sdk] ${name}${message}`, detail)
  emit({ type: "warn", message, component: from?.component, id: from?.id })
}

// The slots each primitive warned are missing, by its slots, so a part read
// on every render warns once.
const warnedMissing = new WeakMap<object, Set<string>>()

// A slot no one defined warns once per primitive and reads as empty, so its
// part renders as a plain element. Production reads the slots as they are.
function warnMissing(slots: object, from: { component: string; id?: string }) {
  const warned = warnedMissing.get(slots) ?? new Set<string>()
  warnedMissing.set(slots, warned)
  return new Proxy(slots as Record<string, unknown>, {
    get(target, slot) {
      if (typeof slot != "string" || slot in target) return target[slot as string]
      if (!warned.has(slot)) {
        warned.add(slot)
        warn(
          `the "${slot}" part isn't defined. A part that ships with a feature registers it with \`use\` before it renders.`,
          from,
        )
      }
      return {}
    },
  })
}

// The DOM events each reason may carry, by constructor, mirroring the types in
// `ReasonVocabulary`. `satisfies` fails the build when a reason is missing here
// or isn't in the vocabulary. A mismatch means the vocabulary's type is wrong.
const reasonEvents: Record<string, string[]> = {
  "trigger-press": ["MouseEvent", "KeyboardEvent", "TouchEvent"],
  "trigger-hover": ["PointerEvent"],
  "trigger-focus": ["FocusEvent"],
  "item-press": ["MouseEvent", "KeyboardEvent"],
  "close-press": ["MouseEvent", "KeyboardEvent", "SubmitEvent"],
  press: ["MouseEvent", "KeyboardEvent"],
  "list-navigation": ["KeyboardEvent"],
  "link-press": ["MouseEvent", "KeyboardEvent"],
  "item-hover": ["PointerEvent"],
  "outside-press": ["MouseEvent"],
  "escape-key": ["KeyboardEvent"],
  "focus-out": ["FocusEvent", "KeyboardEvent"],
  "window-blur": ["FocusEvent"],
  "submenu-switch": ["PointerEvent", "KeyboardEvent"],
  "parent-close": [],
  "trigger-release": ["PointerEvent"],
  "find-in-page": ["Event"],
  "item-removed": [],
  reset: [],
  restore: [],
  "storage-sync": ["StorageEvent"],
  swipe: ["PointerEvent", "TouchEvent"],
  scroll: ["Event"],
  "focus-in": ["FocusEvent"],
  "handle-press": ["MouseEvent", "KeyboardEvent"],
  "handle-key": ["KeyboardEvent"],
  "content-resize": [],
  back: ["Event"],
  imperative: [],
  shortcut: ["KeyboardEvent"],
  timeout: [],
  action: ["MouseEvent", "KeyboardEvent"],
  unmount: [],
  "clear-press": ["MouseEvent", "KeyboardEvent"],
  "input-change": ["Event"],
  "remove-press": ["MouseEvent", "KeyboardEvent"],
  "input-commit": ["FocusEvent", "KeyboardEvent"],
  "step-key": ["KeyboardEvent"],
  "track-press": ["PointerEvent"],
  drag: ["PointerEvent"],
  "move-key": ["KeyboardEvent"],
  collapse: ["KeyboardEvent", "MouseEvent"],
  resize: [],
  "increment-press": ["PointerEvent", "MouseEvent"],
  "decrement-press": ["PointerEvent", "MouseEvent"],
  wheel: ["WheelEvent"],
  scrub: ["PointerEvent"],
  "accessibility-adjust": ["Event"],
  drop: ["DragEvent"],
  paste: ["ClipboardEvent"],
  picker: ["Event"],
  "caret-move": ["Event"],
  cut: ["ClipboardEvent"],
  undo: ["KeyboardEvent", "InputEvent"],
  redo: ["KeyboardEvent", "InputEvent"],
  "image-load": ["Event"],
  "image-error": ["Event"],
  "src-change": [],
  "toggle-press": ["MouseEvent", "KeyboardEvent"],
  "form-submit": ["SubmitEvent"],
  "page-hide": ["PageTransitionEvent"],
  "previous-press": ["MouseEvent", "KeyboardEvent"],
  "next-press": ["MouseEvent", "KeyboardEvent"],
  "first-press": ["MouseEvent", "KeyboardEvent"],
  "last-press": ["MouseEvent", "KeyboardEvent"],
} satisfies Record<ChangeReason, string[]>

// Reason and event pairs already warned about.
const checked = new Set<string>()

/** Warns once when a change's event doesn't match what its reason declares. */
function checkEvent(reason: string, event: Event | undefined, from: { component: string; id?: string }) {
  if (!event || typeof window === "undefined") return
  const allowed = reasonEvents[reason]
  if (!allowed) return
  // Event constructors looked up by name, so engines without one, like
  // SubmitEvent in older browsers, skip it instead of throwing.
  const constructors = window as unknown as Record<string, (new () => Event) | undefined>
  const matches = allowed.some((name) => {
    const constructor = constructors[name]
    return !!constructor && event instanceof constructor
  })
  if (matches) return
  const key = `${reason}:${event.constructor.name}`
  if (checked.has(key)) return
  checked.add(key)
  warn(
    `reported \`${reason}\` with a ${event.constructor.name} (\`${event.type}\`), which the vocabulary doesn't list.`,
    from,
  )
}

// Callbacks already warned that `details.event.preventDefault()` didn't stop their change.
const preventedOnce = new Set<string>()

// `details.event.preventDefault()` stops the browser's default, like a link
// navigating, and the change still happens, so this says so once per callback.
function checkPrevented(
  name: string,
  prevented: boolean,
  details: { event?: Event; canceled: boolean },
  from: { component: string; id?: string },
) {
  if (prevented || !details.event?.defaultPrevented || details.canceled) return
  const key = `${from.component}:${name}`
  if (preventedOnce.has(key)) return
  preventedOnce.add(key)
  warn(
    `\`details.event.preventDefault()\` in \`${name}\` stopped the browser's default, not the change. Call \`details.cancel()\` to stop the change.`,
    from,
  )
}

// How many single-character edits turn `a` into `b`.
function distance(a: string, b: string) {
  let row = Array.from({ length: b.length + 1 }, (_, index) => index)
  for (let i = 1; i <= a.length; i++) {
    const next = [i]
    for (let j = 1; j <= b.length; j++)
      next[j] = Math.min(row[j] + 1, next[j - 1] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    row = next
  }
  return row[b.length]
}

const marked = new WeakSet<Element>()

/**
 * Warns about a misspelled agent mark, like `data-agent-confim`, on the
 * elements or their ancestors, once per element. Only near misses warn: an
 * app may use `data-agent-*` for its own data, like a support agent's id.
 */
function checkMarks(elements: Element[], marks: string[]) {
  for (const start of elements)
    for (let el: Element | null = start; el && !marked.has(el); el = el.parentElement) {
      marked.add(el)
      for (const { name } of el.attributes) {
        const near =
          name.startsWith("data-agent-") &&
          !marks.includes(name) &&
          marks.find((mark) => distance(name, mark) <= 2)
        if (near) warn(`${name} isn't an agent mark, so it does nothing. Did you mean ${near}?`)
      }
    }
}

/** Lets `__UI_SDK__.shortcuts()` list the shared shortcut manager's shortcuts. */
function exposeShortcuts(list: () => unknown[]) {
  history.shortcuts = list
}

// Per instance: whether each controlled key was controlled last time, and
// what it already warned about, so each warning shows once.
const controls = new WeakMap<object, { was: Map<string, boolean>; warned: Set<string> }>()

/**
 * Warns about controlled state misuse, once per key: `open` with
 * `defaultOpen`, or a key that was controlled and is now undefined. A value
 * that arrives later, like a bound variable that starts empty, is fine.
 */
function checkControlled(from: { component: string; id: string }, keys: string[], options: object) {
  const values = options as Record<string, unknown>
  let control = controls.get(from)
  if (!control) controls.set(from, (control = { was: new Map(), warned: new Set() }))
  const { was, warned } = control
  const once = (key: string, message: string) => {
    if (warned.has(key)) return
    warned.add(key)
    warn(message, from)
  }
  for (const key of keys) {
    const fallback = defaultName(key)
    const isControlled = values[key] !== undefined
    // Both from the start. A value that arrives later takes over from where the default started.
    if (isControlled && !was.has(key) && values[fallback] !== undefined)
      once(`${key}+`, `got \`${key}\` and \`${fallback}\`. Pass one.`)
    if (was.get(key) && !isControlled)
      once(
        key,
        `stopped controlling \`${key}\`: it was passed and is now undefined, so the component keeps its last value.`,
      )
    was.set(key, isControlled)
  }
}

// What a stuck controlled change looks like: the component asked for a new
// value, and the owner never passed it back. Each key waits with the value it
// had when asked.
const pending = new WeakMap<object, Map<string, { timer: ReturnType<typeof setTimeout>; before: unknown }>>()

/**
 * Warns when a controlled change was requested and the option it controls
 * still has the old value a second later, like a controlled `open` the owner
 * never updates in `onOpenChange`. A second leaves time for a navigation or
 * a save that passes the value back once it's done.
 */
function expectControlled(
  instance: object,
  info: { component: string; id: string; key: string; value: unknown; reason: string; source: string },
  current: () => unknown,
) {
  let waiting = pending.get(instance)
  if (!waiting) pending.set(instance, (waiting = new Map()))
  clearTimeout(waiting.get(info.key)?.timer)
  const before = current()
  const timer = setTimeout(() => {
    waiting.delete(info.key)
    if (!Object.is(current(), before) || Object.is(before, info.value)) return
    const asked =
      info.key === "open"
        ? info.value
          ? "to open"
          : "to close"
        : `for \`${info.key}\` ${JSON.stringify(info.value)}`
    const callback = callbackName(info.key, "Change")
    warn(
      `asked ${asked} (\`${info.reason}\`, \`${info.source}\`), and \`${info.key}\` stayed ${JSON.stringify(before)}. Update it in \`${callback}\`, right away even when a save or navigation follows, or call \`details.cancel()\` there to refuse.`,
      info,
    )
  }, 1000)
  waiting.set(info.key, { timer, before })
}

/**
 * Stops waiting for each controlled value the owner passed something else
 * for, so one that opens and closes again before the check, like a palette
 * closed by its own command, doesn't warn.
 */
function heardControlled(instance: object, options: object) {
  const waiting = pending.get(instance)
  if (!waiting) return
  const values = options as Record<string, unknown>
  for (const [key, { timer, before }] of waiting)
    if (!Object.is(values[key], before)) {
      clearTimeout(timer)
      waiting.delete(key)
    }
}

/** Stops waiting for a controlled value, like when the instance leaves the page. */
function forgetControlled(instance: object) {
  pending.get(instance)?.forEach(({ timer }) => clearTimeout(timer))
  pending.delete(instance)
}

// The console view: `__UI_SDK__.changes({ component: "menu" })`, `layers()`,
// `shortcuts()` and `warnings()`. Installed on the first event.
let installed = false
function install() {
  installed = true
  const realm = globalThis as { __UI_SDK__?: unknown }
  realm.__UI_SDK__ ??= {
    changes: (filter: { component?: string; id?: string; key?: string } = {}) =>
      history.changes.filter(
        (change) =>
          (!filter.component || change.component === filter.component) &&
          (!filter.id || change.id === filter.id) &&
          (!filter.key || change.key === filter.key),
      ),
    layers: () => history.layers,
    shortcuts: () => history.shortcuts?.() ?? [],
    warnings: () => history.warnings,
  }
}

// Writes made from reading the page, like an exit with nothing to animate
// finishing at once. No state could derive them, so they aren't relays.
let measuring = 0

/** Runs `read`, which writes what it measured in the page. */
function measured(read: () => void) {
  measuring++
  try {
    read()
  } finally {
    measuring--
  }
}

/** Whether the writes happening now come from `measured`. */
const isMeasuring = () => measuring > 0

export {
  checkControlled,
  checkEvent,
  checkMarks,
  checkPrevented,
  dev,
  type DevEvent,
  emit,
  expectControlled,
  exposeShortcuts,
  forgetControlled,
  heardControlled,
  isMeasuring,
  measured,
  warn,
  warnMissing,
}
