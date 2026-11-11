// What perf fixtures share: their size from the URL, and the counters the
// counts specs read. `tests/perf/init.ts` puts `__perf` on the window before
// the fixture loads. Opened by hand, the counters go nowhere.

type Counters = { renders: Record<string, number>; subscriptions: number }

const counters = () => (window as unknown as { __perf?: Counters }).__perf

/** How many items to render: ?n=500. */
function perfSize(fallback = 10) {
  return Number(new URLSearchParams(location.search).get("n") ?? fallback)
}

/** Whether popups open modal, which makes the rest of the page inert and locks its scroll: ?modal. */
function perfModal() {
  return new URLSearchParams(location.search).has("modal") || undefined
}

/** How many options each select in a row renders: ?options=30. */
function perfOptions() {
  return Number(new URLSearchParams(location.search).get("options") ?? 3)
}

/**
 * Mounts the fixture now, or with ?mount=manual once a "Mount" button is
 * pressed, so a test can time mounting from a key press.
 */
function mountWhenAsked(root: HTMLElement, mount: (root: HTMLElement) => void) {
  if (new URLSearchParams(location.search).get("mount") !== "manual") {
    return mount(root)
  }
  const button = document.createElement("button")
  button.textContent = "Mount"
  const target = document.createElement("div")
  button.addEventListener("click", () => mount(target), { once: true })
  root.append(button, target)
}

/** Tree data for the leak specs: "Item 1" to "Item 3", each a branch with one file in it. */
function leakTreeItems() {
  return perfItems(3).map((item) => ({
    ...item,
    children: [{ value: `${item.value}-file`, label: `${item.label} file` }],
  }))
}

/** Waterfall data for the leak specs: "Item 1" to "Item 3", each a span with one step in it. */
function leakWaterfallItems() {
  return perfItems(3).map((item, index) => ({
    ...item,
    start: index * 100,
    duration: 100,
    children: [
      {
        value: `${item.value}-step`,
        label: `${item.label} step`,
        start: index * 100,
        duration: 50,
      },
    ],
  }))
}

/** Labels for `n` items: "Item 1" to "Item n". */
function perfItems(n: number) {
  return Array.from({ length: n }, (_, index) => ({
    value: `item-${index + 1}`,
    label: `Item ${index + 1}`,
  }))
}

/** Counts one render of a part of a kind, like "plain" or "watched". */
function countRender(kind: string) {
  const perf = counters()
  if (perf) {
    perf.renders[kind] = (perf.renders[kind] ?? 0) + 1
  }
}

// Counts one subscription a part made to its instance.
function countSubscription() {
  const perf = counters()
  if (perf) {
    perf.subscriptions++
  }
}

type Subscribe = (...args: unknown[]) => () => void

/**
 * Counts every subscription made on an instance: through its `subscribe`, and
 * every lease a part an adapter gets from `instance.part()` takes, which
 * subscribing to the part and binding its element each do. Parts share one
 * store, so its methods can't be wrapped per part.
 */
function countSubscriptions(instance: object) {
  const counted = instance as {
    subscribe: Subscribe
    part: (...args: unknown[]) => { leases: number }
  }
  const subscribe = counted.subscribe
  counted.subscribe = (...args) => {
    countSubscription()
    return subscribe(...args)
  }
  const part = counted.part
  const watched = new WeakSet<object>()
  counted.part = (...args) => {
    const record = part(...args)
    if (watched.has(record)) {
      return record
    }
    watched.add(record)
    let leases = record.leases
    Object.defineProperty(record, "leases", {
      get: () => leases,
      set(next: number) {
        if (next > leases) {
          countSubscription()
        }
        leases = next
      },
    })
    return record
  }
}

/**
 * Values for a slider with `n` thumbs on 0 to 1,000, spread over the first
 * half, so the last thumb has room to move.
 */
function perfThumbs(n: number) {
  return Array.from({ length: n }, (_, index) => Math.round((index * 500) / n))
}

// The components the leak fixture can render: popups, a slider, a resizable
// group and a scroll area, whose drags listen on the document, an accordion
// and a collapsible, whose panels animate and observe the page, and tabs, a
// toolbar and a tree, which move focus with the arrow keys.
const leakComponents = [
  "menu",
  "select",
  "combobox",
  "autocomplete",
  "popover",
  "dialog",
  "drawer",
  "tooltip",
  "hover-card",
  "slider",
  "accordion",
  "collapsible",
  "tabs",
  "toolbar",
  "tree",
  "waterfall",
  "resizable",
  "scroll-area",
] as const

/** Which component the leak fixture renders: ?component=select. Menu by default. */
function leakComponent() {
  const name = new URLSearchParams(location.search).get("component")
  return leakComponents.find((component) => component === name) ?? "menu"
}

/**
 * Puts the popup layer stack on `window.__layers` for the leak specs. Core
 * keeps one stack per page under a global symbol (packages/core/src/foundation/platform/layers.ts).
 */
function exposeLayers() {
  type Realm = { stack: unknown[]; teardown?: () => void }
  const realm = () =>
    (globalThis as Record<symbol, Realm | undefined>)[
      Symbol.for("ui-sdk.layers@1")
    ]
  Object.assign(window, {
    __layers: () => ({
      open: realm()?.stack.length ?? 0,
      listening: !!realm()?.teardown,
    }),
  })
}

export {
  countRender,
  countSubscriptions,
  exposeLayers,
  leakComponent,
  leakTreeItems,
  leakWaterfallItems,
  mountWhenAsked,
  perfItems,
  perfModal,
  perfOptions,
  perfSize,
  perfThumbs,
}
