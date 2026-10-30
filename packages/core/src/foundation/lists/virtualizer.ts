// Renders only the rows a scroller shows, measuring each as it renders and
// estimating the rest. Framework-free: an adapter renders `items()`. With
// `findable`, rows it doesn't render stay findable through hidden stand-ins.
import { supportsHiddenUntilFound } from "../motion/panel"

// Marks the two layers of stand-ins.
const findableLayer = "data-findable-layer"

/**
 * One row to render: where it starts along the scroller, in pixels, and its
 * size. `found` marks the row find in page matched last, until the next
 * match, until it scrolls away, or until someone presses or types in the list.
 * @experimental
 */
type VirtualItem = { index: number; key: string; start: number; size: number; found?: true }

/**
 * Where `scrollToIndex` puts a row. `auto` scrolls only as far as it takes to show it.
 * @experimental
 */
type VirtualAlign = "auto" | "start" | "center" | "end"

/**
 * How `createVirtualizer` reads the list.
 * @experimental
 */
type VirtualizerOptions = {
  /** How many rows the list has. Read on every update, so it can grow, like a list that loads more. */
  count: () => number
  /** The size of a row before it's measured, in pixels. A close guess keeps the scrollbar steady. */
  estimate: (index: number) => number
  /**
   * A stable key for each row, so a measured size follows its row when the
   * list sorts or filters. Defaults to the index.
   */
  key?: (index: number) => string
  /**
   * How many rows to render past each edge, so a fast scroll or Tab doesn't
   * show a gap. @defaultValue 4
   */
  overscan?: number
  /** Whether the list scrolls sideways. @defaultValue false */
  horizontal?: boolean
  /** Pixels in the scroller before the first row, like a sticky header. @defaultValue 0 */
  scrollMargin?: number
  /**
   * Rows rendered wherever the scroller is, like the one with focus, so
   * scrolling it away doesn't drop focus to the page.
   */
  keep?: () => readonly number[]
  /**
   * Runs when the rendered rows come within `endThreshold` rows of the last,
   * to load more. Runs once per `count`, so it doesn't ask again before the
   * list grows.
   */
  onEnd?: () => void
  /** How close to the end `onEnd` runs, in rows. @defaultValue 10 */
  endThreshold?: number
  /**
   * The text the browser's find in page should find in a row, like its
   * title, so it finds rows that aren't rendered too. Keep it what the row
   * shows. Return a list of pieces to give each its own `bindFindable`.
   */
  findable?: (index: number) => string | readonly string[]
  /** Runs when find in page matched a row that wasn't rendered, as the list scrolls to it. */
  onFind?: (index: number, details: { reason: "find-in-page"; event: Event }) => void
}

/**
 * How `connect` reads the scroller.
 * @experimental
 */
type VirtualizerConnectOptions = {
  /**
   * Adds the layers that keep rows that aren't rendered findable, at the
   * start and end of the scroller. Needs the `findable` option. To put them
   * in another element around the rows, call `mountFindable`. @defaultValue false
   */
  findable?: boolean
}

// Stand-ins come in groups that are hidden until found too, so the browser
// skips style and layout for everything in a group.
const standInGroup = 100

/**
 * Renders a long list by rendering only what's in view. Connect it to the
 * scroller once it mounts, render `items()` absolutely positioned inside a
 * box `size()` tall, and measure each rendered row:
 *
 * ```ts
 * const rows = createVirtualizer({ count: () => data.length, estimate: () => 36 })
 * const disconnect = rows.connect(scroller)
 * rows.subscribe(render)
 * // For each of rows.items(): <div style="position:absolute; top:{start}px" ref={(el) => rows.measure(index, el)}>
 * ```
 *
 * `items()` keeps its identity until something changes, so it works as a
 * snapshot for `useSyncExternalStore` and its kind.
 * @experimental
 */
function createVirtualizer(options: VirtualizerOptions) {
  const keyOf = (index: number) => options.key?.(index) ?? String(index)
  const sizes = new Map<string, number>()
  const listeners = new Set<() => void>()
  let scroller: HTMLElement | undefined
  let offset = 0
  let viewport = 0
  // Where each row starts, rebuilt when a count or size changes.
  let starts: number[] = []
  let dirty = true
  let snapshot: VirtualItem[] = []
  let total = 0
  let endedAt = -1
  // Each measured element and the row it shows now, which changes when the list sorts.
  const measured = new Map<Element, number>()
  let resizes: ResizeObserver | undefined

  // Find in page: rendered rows by index, the stand-ins in a layer before the rows
  // and one after them, and the stand-in the browser matched last.
  const elements = new Map<number, HTMLElement>()
  let layers:
    { before: HTMLElement; after: HTMLElement; beforeEdge: HTMLElement; afterEdge: HTMLElement } | undefined
  let standIns: HTMLElement[] = []
  let homes: HTMLElement[] = []
  let split: { lo: number; hi: number; from: number; to: number } | undefined
  const touched = new Set<number>()
  let kept = new Set<number>()
  let parked = -1
  let holding = false
  let matching = -1
  let foundIndex = -1
  // Each stand-in's text nodes, one per piece of `findable`, with the
  // spaces between them, and the rows' slots that borrow them.
  let texts: Text[][] = []
  let spaces: Text[][] = []
  const slots = new Map<number, ({ el: HTMLElement; token: number } | undefined)[]>()
  let tokens = 0
  // The contiguous rows in view and the overscan, apart from `keep`.
  let windowFrom = -1
  let windowTo = -1

  const margin = () => options.scrollMargin ?? 0
  const sizeOf = (index: number) => sizes.get(keyOf(index)) ?? options.estimate(index)

  function layout() {
    if (!dirty && starts.length === options.count()) return
    dirty = false
    const count = options.count()
    starts = new Array(count)
    let at = 0
    for (let i = 0; i < count; i++) {
      starts[i] = at
      at += sizeOf(i)
    }
    total = at
  }

  // The first row whose end is past `at`, by binary search.
  function rowAt(at: number) {
    let low = 0
    let high = starts.length - 1
    while (low < high) {
      const middle = (low + high) >> 1
      if (starts[middle] + sizeOf(middle) <= at) low = middle + 1
      else high = middle
    }
    return Math.max(0, low)
  }

  function compute() {
    layout()
    const count = starts.length
    const overscan = options.overscan ?? 4
    const indexes = new Set<number>()
    if (count) {
      const from = rowAt(Math.max(0, offset - margin()))
      let to = from
      const end = offset - margin() + viewport
      while (to < count - 1 && starts[to] + sizeOf(to) < end) to++
      windowFrom = Math.max(0, from - overscan)
      windowTo = Math.min(count - 1, to + overscan)
      for (let i = windowFrom; i <= windowTo; i++) indexes.add(i)
      for (const index of options.keep?.() ?? []) if (index >= 0 && index < count) indexes.add(index)
      if (options.onEnd && to >= count - 1 - (options.endThreshold ?? 10) && endedAt !== count) {
        endedAt = count
        queueMicrotask(() => options.onEnd?.())
      }
    }
    const next = [...indexes]
      .sort((a, b) => a - b)
      .map((index) => ({
        index,
        key: keyOf(index),
        start: starts[index],
        size: sizeOf(index),
        ...(index === foundIndex && { found: true as const }),
      }))
    const same =
      next.length === snapshot.length &&
      next.every(
        (item, i) =>
          item.key === snapshot[i].key &&
          item.start === snapshot[i].start &&
          item.size === snapshot[i].size &&
          item.index === snapshot[i].index &&
          item.found === snapshot[i].found,
      )
    if (same) return false
    snapshot = next
    return true
  }

  function update() {
    if (!compute()) return
    syncStandIns()
    for (const listener of [...listeners]) listener()
  }

  // The row find in page found, in `items()` as `found`.
  function setFound(index: number) {
    if (foundIndex === index) return
    foundIndex = index
    if (compute()) for (const listener of [...listeners]) listener()
  }

  const piecesOf = (index: number) => {
    const text = options.findable?.(index) ?? ""
    return typeof text === "string" ? [text] : [...text]
  }
  const slotted = (index: number) => !!slots.get(index)?.some(Boolean)

  // A rendered row's slots take its stand-in's own text nodes, so find in
  // page matches and highlights the row's text and counts it once.
  function adopt(index: number) {
    const own = slots.get(index)
    if (!own) return
    const pieces = texts[index]
    // Without the layer, like where find in page can't reach hidden text, slots hold plain text.
    if (!pieces) {
      const plain = piecesOf(index)
      own.forEach((slot, part) => {
        if (slot && slot.el.textContent !== plain[part]) slot.el.textContent = plain[part] ?? ""
      })
      return
    }
    own.forEach((slot, part) => {
      const node = pieces[part]
      if (slot && node && node.parentNode !== slot.el) slot.el.replaceChildren(node)
    })
  }

  // A piece goes back to its stand-in, where it sits before the space after it.
  function restore(index: number, part: number) {
    const node = texts[index]?.[part]
    const standIn = standIns[index]
    if (!node || !standIn) return
    const space = spaces[index]?.[part]
    if (space) standIn.insertBefore(node, space)
    else standIn.append(node)
  }
  const groupOf = (index: number) => Math.floor(index / standInGroup)

  function group(doc: Document) {
    const el = doc.createElement("div")
    el.setAttribute("hidden", "until-found")
    return el
  }

  // One stand-in per row, in groups of `standInGroup`, built when the layers
  // mount and again when the rows change.
  function buildStandIns() {
    if (!layers) return
    const doc = layers.before.ownerDocument
    const count = options.count()
    releaseParked()
    standIns = []
    homes = []
    texts = []
    spaces = []
    split = undefined
    for (let start = 0; start < count; start += standInGroup) {
      const home = group(doc)
      for (let index = start; index < Math.min(count, start + standInGroup); index++) {
        const el = doc.createElement("div")
        el.setAttribute("hidden", "until-found")
        const pieces = piecesOf(index).map((piece) => doc.createTextNode(piece))
        const between = pieces.slice(1).map(() => doc.createTextNode(" "))
        pieces.forEach((node, part) => el.append(node, ...(between[part] ? [between[part]] : [])))
        el.addEventListener("beforematch", (event) => matched(index, event))
        standIns.push(el)
        texts.push(pieces)
        spaces.push(between)
      }
      homes.push(home)
    }
    layers.before.replaceChildren(layers.beforeEdge)
    layers.after.replaceChildren(layers.afterEdge)
    for (const index of slots.keys()) adopt(index)
    syncStandIns()
  }

  // Find in page steps in DOM order: stand-ins of rows above the window sit
  // before the rows and the rest after them, whole groups at a time, and
  // rendered rows have none in the page.
  function syncStandIns() {
    if (!layers || holding) return
    if (standIns.length !== options.count()) return buildStandIns()
    const from = windowFrom
    const to = windowTo
    const lo = from < 0 ? homes.length : groupOf(from)
    const hi = from < 0 ? homes.length - 1 : groupOf(to)
    // A window that overlaps the last one in the same groups only moves the
    // stand-ins at its edges; the find bar recounts after every change.
    if (
      split &&
      split.lo === lo &&
      split.hi === hi &&
      split.from >= 0 &&
      from >= 0 &&
      from <= split.to &&
      to >= split.from
    )
      shiftEdges(from, to)
    else regroup(from, to, lo, hi)
    // Rows `keep` renders outside the window hide their stand-in.
    const next = new Set(snapshot.map((item) => item.index).filter((index) => index < from || index > to))
    for (const index of kept) if (!next.has(index)) standIns[index]?.setAttribute("hidden", "until-found")
    for (const index of next) if (index !== parked) standIns[index]?.setAttribute("hidden", "")
    kept = next
    split = { lo, hi, from, to }
    // The matched row scrolled away: its stand-in goes back.
    if (parked !== -1 && !snapshot.some((item) => item.index === parked)) releaseParked()
    if (foundIndex !== -1 && !snapshot.some((item) => item.index === foundIndex)) setFound(-1)
  }

  const between = (start: number, end: number) => {
    const list: HTMLElement[] = []
    for (let index = start; index < end; index++)
      if (index !== parked && standIns[index]) list.push(standIns[index])
    return list
  }

  function shiftEdges(from: number, to: number) {
    const { beforeEdge, afterEdge } = layers!
    const old = split!
    if (from > old.from) beforeEdge.append(...between(old.from, from))
    else for (const el of between(from, old.from)) el.remove()
    if (to < old.to) afterEdge.prepend(...between(to + 1, old.to + 1))
    else for (const el of between(old.to + 1, to + 1)) el.remove()
  }

  // Groups move between the layers; the two the window touches are split
  // between the edge groups.
  function regroup(from: number, to: number, lo: number, hi: number) {
    const { beforeEdge, afterEdge } = layers!
    const first = split ? Math.min(split.lo, lo) : 0
    const last = split ? Math.max(split.hi, hi) : homes.length - 1
    const rebuild = new Set(touched)
    touched.clear()
    for (let at = first; at <= last; at++) rebuild.add(at)
    for (const at of rebuild) {
      const home = homes[at]
      if (!home) continue
      home.replaceChildren(...between(at * standInGroup, (at + 1) * standInGroup))
      home.setAttribute("hidden", "until-found")
    }
    for (let at = first; at <= last; at++) homes[at]?.remove()
    beforeEdge.before(...homes.slice(first, Math.min(lo, last + 1)))
    afterEdge.after(...homes.slice(Math.max(hi + 1, first), last + 1))
    beforeEdge.replaceChildren(...(from < 0 ? [] : between(lo * standInGroup, from)))
    afterEdge.replaceChildren(
      ...(from < 0 ? [] : between(to + 1, Math.min(standIns.length, (hi + 1) * standInGroup))),
    )
    beforeEdge.setAttribute("hidden", "until-found")
    afterEdge.setAttribute("hidden", "until-found")
  }

  // Where a stand-in belongs now, and back in place among its neighbors.
  function placeBack(index: number) {
    const el = standIns[index]
    if (!el || !layers) return
    const at = groupOf(index)
    const old = split
    if (!old) {
      el.remove()
      touched.add(at)
      return
    }
    const parent =
      at < old.lo || at > old.hi
        ? homes[at]
        : index < old.from
          ? layers.beforeEdge
          : index > old.to
            ? layers.afterEdge
            : undefined
    if (!parent) return void el.remove()
    let next: HTMLElement | undefined
    for (let after = index + 1; after < standIns.length && groupOf(after) <= at + 1; after++)
      if (standIns[after].parentElement === parent) {
        next = standIns[after]
        break
      }
    parent.insertBefore(el, next ?? null)
  }

  function releaseParked() {
    if (parked === -1) return
    const index = parked
    const el = standIns[index]
    parked = -1
    if (!el) return
    el.removeAttribute("style")
    el.setAttribute("hidden", "until-found")
    placeBack(index)
  }

  // The browser matched a row that isn't rendered, and reveals and scrolls
  // after this, so the list goes there first and the stand-in lies, clear,
  // over the row. Nothing else moves until the next frame.
  function matched(index: number, event: Event) {
    const el = standIns[index]
    if (!scroller || !layers || !el) return
    if (parked !== -1 && parked !== index) releaseParked()
    holding = true
    matching = index
    foundIndex = index
    api.scrollToIndex(index, { align: "center", behavior: "instant" })
    layout()
    const box = scroller.getBoundingClientRect()
    const origin = (el.closest(`[${findableLayer}]`) ?? layers.after).getBoundingClientRect()
    const start = starts[index] + margin() - offset
    const size = sizeOf(index)
    Object.assign(el.style, {
      position: "absolute",
      left: `${box.left + scroller.clientLeft - origin.left + (options.horizontal ? start : 0)}px`,
      top: `${box.top + scroller.clientTop - origin.top + (options.horizontal ? 0 : start)}px`,
      width: `${options.horizontal ? size : scroller.clientWidth}px`,
      height: `${options.horizontal ? scroller.clientHeight : size}px`,
      overflow: "hidden",
      opacity: "0",
      pointerEvents: "none",
    })
    parked = index
    // Already scrolled there, as find in page shows it.
    if (!snapshot.some((item) => item.found)) setFound(index)
    options.onFind?.(index, { reason: "find-in-page", event })
    const settle = () => {
      holding = false
      matching = -1
      // With slots, the row takes the matched text itself, highlight and all.
      if (slotted(index)) {
        adopt(index)
        if (parked === index) releaseParked()
        return syncStandIns()
      }
      // Inside its row, the match stays where find in page continues from: the next match is after this row.
      const row = elements.get(index)
      if (parked === index && row) {
        Object.assign(el.style, { left: "0", top: "0", width: "100%", height: "100%" })
        row.append(el)
      }
      syncStandIns()
    }
    if (typeof requestAnimationFrame === "undefined") settle()
    else requestAnimationFrame(settle)
  }

  function mountLayer(parent: HTMLElement) {
    if (!options.findable || !supportsHiddenUntilFound()) return () => {}
    const doc = parent.ownerDocument
    const layer = () => {
      const el = doc.createElement("div")
      el.setAttribute(findableLayer, "")
      Object.assign(el.style, { position: "absolute", left: "0", top: "0", width: "0", height: "0" })
      return el
    }
    const placed = { before: layer(), after: layer(), beforeEdge: group(doc), afterEdge: group(doc) }
    layers = placed
    parent.prepend(placed.before)
    parent.append(placed.after)
    buildStandIns()
    return () => {
      placed.before.remove()
      placed.after.remove()
      if (layers === placed) {
        releaseParked()
        layers = undefined
        standIns = []
        homes = []
        split = undefined
        kept = new Set()
      }
    }
  }

  function record(el: HTMLElement) {
    const index = measured.get(el)
    if (index === undefined) return
    const rect = el.getBoundingClientRect()
    const size = options.horizontal ? rect.width : rect.height
    const key = keyOf(index)
    if (!size || sizes.get(key) === size) return
    layout()
    // A row above the top that changes size would move what's in view, so
    // the scroller moves with it.
    const above = !!scroller && (starts[index] ?? 0) + margin() < offset
    const change = size - sizeOf(index)
    sizes.set(key, size)
    dirty = true
    if (above && scroller) {
      if (options.horizontal) scroller.scrollLeft += change
      else scroller.scrollTop += change
      read()
    }
    update()
  }

  function read() {
    if (!scroller) return
    offset = options.horizontal ? scroller.scrollLeft : scroller.scrollTop
    viewport = options.horizontal ? scroller.clientWidth : scroller.clientHeight
  }

  const api = {
    /** The rows to render now, in order. Same array until something changes. */
    items() {
      compute()
      return snapshot
    },
    /** The height, or width when horizontal, of every row together, for the box the rows sit in. */
    size() {
      layout()
      return total
    },
    /** Calls `listener` whenever `items()` changes, until the returned function runs. */
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => void listeners.delete(listener)
    },
    /**
     * Reads the scroller on every scroll and resize, until the returned
     * function runs. With `findable`, also adds the layers that keep rows
     * that aren't rendered findable.
     */
    connect(el: HTMLElement, connectOptions: VirtualizerConnectOptions = {}) {
      scroller = el
      const unmount = connectOptions.findable ? mountLayer(el) : undefined
      // Pressing or typing in the list ends the found row.
      const done = () => {
        if (foundIndex === -1) return
        releaseParked()
        setFound(-1)
      }
      el.addEventListener("pointerdown", done)
      el.addEventListener("keydown", done)
      const onScroll = () => {
        read()
        update()
      }
      el.addEventListener("scroll", onScroll, { passive: true })
      const view = el.ownerDocument.defaultView
      const box = view?.ResizeObserver ? new view.ResizeObserver(onScroll) : undefined
      box?.observe(el)
      onScroll()
      return () => {
        el.removeEventListener("scroll", onScroll)
        el.removeEventListener("pointerdown", done)
        el.removeEventListener("keydown", done)
        box?.disconnect()
        unmount?.()
        if (scroller === el) scroller = undefined
      }
    },
    /**
     * Measures a rendered row, now and whenever it resizes, until the returned
     * function runs. Call it from the row's ref. Fixed-size rows can skip it.
     */
    measure(index: number, el: HTMLElement | null) {
      if (!el) return () => {}
      const first = !measured.has(el)
      // A reused element that shows another row now.
      const before = measured.get(el)
      if (before !== undefined && before !== index && elements.get(before) === el) elements.delete(before)
      measured.set(el, index)
      elements.set(index, el)
      if (first) {
        const view = el.ownerDocument.defaultView
        if (!resizes && view?.ResizeObserver)
          resizes = new view.ResizeObserver((entries) => {
            for (const entry of entries) record(entry.target as HTMLElement)
          })
        resizes?.observe(el)
      }
      record(el)
      return () => {
        const shown = measured.get(el)
        measured.delete(el)
        if (shown !== undefined && elements.get(shown) === el) elements.delete(shown)
        resizes?.unobserve(el)
      }
    },
    /** Scrolls so a row shows, measuring as it goes. */
    scrollToIndex(
      index: number,
      { align = "auto", behavior }: { align?: VirtualAlign; behavior?: ScrollBehavior } = {},
    ) {
      layout()
      if (!scroller || index < 0 || index >= starts.length) return
      read()
      const start = starts[index] + margin()
      const size = sizeOf(index)
      // The rows show below `scrollMargin`, like under a sticky header.
      let to = offset
      if (align === "start") to = start - margin()
      else if (align === "end") to = start + size - viewport
      else if (align === "center") to = start + size / 2 - (viewport + margin()) / 2
      else if (start < offset + margin()) to = start - margin()
      else if (start + size > offset + viewport) to = start + size - viewport
      if (to === offset) return
      scroller.scrollTo({ [options.horizontal ? "left" : "top"]: Math.max(0, to), behavior })
      read()
      update()
    },
    /** Reads the list again, like after its rows change without a scroll. Find in page sees the new text. */
    refresh() {
      dirty = true
      read()
      update()
      if (layers) buildStandIns()
    },
    /**
     * Puts the findable layers at the start and end of `parent`, an element
     * around the rows like the box they sit in, until the returned function runs. `connect(el, { findable: true })`
     * does this for the scroller.
     */
    mountFindable: (parent: HTMLElement) => mountLayer(parent),
    /** The row find in page matched last, or null. Also `found` on its item. */
    found: () => (foundIndex === -1 ? null : foundIndex),
    /**
     * Renders a piece of a row's `findable` text into `el`, from the row's
     * ref, until the returned function runs. Render `el` empty: it holds the
     * very text find in page searches, so the browser highlights the match in
     * the row itself. `part` picks the piece when `findable` returns several.
     */
    bindFindable(index: number, el: HTMLElement | null, part = 0) {
      if (!el) return () => {}
      const own = slots.get(index) ?? []
      const token = ++tokens
      own[part] = { el, token }
      slots.set(index, own)
      // The matched row takes its text on the next frame, once the browser has highlighted it.
      if (matching !== index) adopt(index)
      return () => {
        // A ref that runs again with the same element in the same render keeps its text.
        queueMicrotask(() => {
          const list = slots.get(index)
          if (list?.[part]?.token !== token) return
          list[part] = undefined
          if (!list.some(Boolean)) slots.delete(index)
          const node = texts[index]?.[part]
          // Back to its stand-in, also when another row's text pushed it out.
          if (node && (node.parentNode === el || !node.parentNode)) restore(index, part)
        })
      }
    },
    /** Forgets every measured size, like after a change that resizes every row. */
    reset() {
      sizes.clear()
      api.refresh()
    },
  }
  return api
}

/**
 * What `createVirtualizer` returns.
 * @experimental
 */
type Virtualizer = ReturnType<typeof createVirtualizer>

export {
  createVirtualizer,
  type VirtualAlign,
  type VirtualItem,
  type Virtualizer,
  type VirtualizerConnectOptions,
  type VirtualizerOptions,
}
