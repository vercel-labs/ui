import { layoutBox } from "../platform/layout"

/**
 * The item under a mouse or pen, for an indicator that follows hover while
 * `enabled()` says so. `itemOf` finds the item an event's target is in, or
 * none. Disabled items are passed over. `listen` moves the listeners to the
 * current list, and `stop` removes them.
 */
function trackHover(options: {
  list: () => HTMLElement | null | undefined
  itemOf: (target: Element) => HTMLElement | null | undefined
  enabled: () => boolean
  onChange: () => void
}) {
  let hovered: HTMLElement | undefined
  let listened: HTMLElement | undefined
  const set = (item: HTMLElement | undefined) => {
    if (item !== hovered) {
      hovered = item
      options.onChange()
    }
  }
  const over = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !options.enabled()) {
      return
    }
    const item = options.itemOf(event.target as Element)
    if (item && !item.matches('[disabled], [aria-disabled="true"]')) {
      set(item)
    }
  }
  const leave = () => set(undefined)
  const stop = () => {
    listened?.removeEventListener("pointerover", over)
    listened?.removeEventListener("pointerleave", leave)
    listened = undefined
  }
  return {
    hovered: () => (options.enabled() ? hovered : undefined),
    listen() {
      const list = options.list() ?? undefined
      if (list === listened) {
        return
      }
      stop()
      hovered = undefined
      list?.addEventListener("pointerover", over)
      list?.addEventListener("pointerleave", leave)
      listened = list
    },
    stop,
  }
}

/**
 * Keeps an indicator over a list's active item, like the selected tab, without
 * a render: measures the item against the list once they bind, whenever
 * `subscribe` calls back, and whenever the list or an item changes size, and
 * hands the box to `write`. Returns a cleanup.
 */
function bindIndicator(options: {
  list: () => HTMLElement | null | undefined
  active: () => HTMLElement | null | undefined
  itemSelector: string
  subscribe: (listener: () => void) => () => void
  write: (box: ReturnType<typeof layoutBox> | undefined) => void
  // Whether the indicator follows the item under the pointer, back to the
  // active one when the pointer leaves the list.
  followHover: () => boolean
}) {
  const update = () => {
    const list = options.list()
    const item = hover.hovered() ?? options.active()
    options.write(item && list ? layoutBox(item, list) : undefined)
  }
  const hover = trackHover({
    list: options.list,
    itemOf: (target) => {
      const item = target.closest<HTMLElement>(options.itemSelector)
      return item && options.list()?.contains(item) ? item : undefined
    },
    enabled: options.followHover,
    onChange: update,
  })
  const observer =
    typeof ResizeObserver === "undefined"
      ? undefined
      : new ResizeObserver(update)
  // The watched set holds what it watches, so items that left leave it, or they stay alive.
  const observed = new Set<Element>()
  const remeasure = () => {
    const list = options.list()
    const targets = new Set(
      list ? [list, ...list.querySelectorAll(options.itemSelector)] : []
    )
    for (const target of observed) {
      if (!targets.has(target)) {
        observed.delete(target)
        observer?.unobserve(target)
      }
    }
    for (const target of targets) {
      if (observed.has(target)) {
        continue
      }
      observed.add(target)
      observer?.observe(target)
    }
    hover.listen()
    update()
  }
  const unsubscribe = options.subscribe(remeasure)
  // A new `dir` moves every item to the other side without resizing one.
  const flips =
    typeof MutationObserver === "undefined"
      ? undefined
      : new MutationObserver(update)
  const list = options.list()
  if (list) {
    flips?.observe(list.ownerDocument.documentElement, {
      attributeFilter: ["dir"],
      subtree: true,
    })
  }
  // Items bind in the same commit. Measure once they have.
  queueMicrotask(remeasure)
  return () => {
    unsubscribe()
    observer?.disconnect()
    flips?.disconnect()
    hover.stop()
  }
}

// Which way `to` lies from `from` on screen.
function directionBetween(
  from: { left: number; top: number } | undefined,
  to: { left: number; top: number } | undefined,
  orientation: "horizontal" | "vertical"
) {
  if (!from || !to) {
    return "none"
  }
  const [a, b] =
    orientation === "vertical" ? [from.top, to.top] : [from.left, to.left]
  if (b === a) {
    return "none"
  }
  if (orientation === "vertical") {
    return b > a ? "down" : "up"
  }
  return b > a ? "right" : "left"
}

export { bindIndicator, directionBetween, trackHover }
