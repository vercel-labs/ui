// @vitest-environment jsdom
import { afterEach, beforeAll, describe, expect, test, vi } from "vitest"
import { createVirtualizer } from "../src/index"

// jsdom has no find in page: stand in for it.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, "onbeforematch", {
    value: null,
    writable: true,
    configurable: true,
  })
})

let cleanups: (() => void)[] = []
afterEach(() => {
  cleanups.forEach((cleanup) => cleanup())
  cleanups = []
  document.body.innerHTML = ""
})

const frame = () => new Promise((resolve) => requestAnimationFrame(resolve))
const microtask = () => new Promise((resolve) => queueMicrotask(() => resolve(undefined)))

// A scroller of a fixed size whose scroll position can be set, as jsdom has no layout.
function scroller(height: number, contentHeight: () => number, parent: Element = document.body) {
  const el = document.createElement("div")
  let top = 0
  Object.defineProperties(el, {
    clientHeight: { get: () => height },
    clientWidth: { get: () => 300 },
    scrollHeight: { get: () => Math.max(height, contentHeight()) },
    scrollTop: {
      get: () => top,
      set: (value: number) => {
        top = Math.max(0, Math.min(value, Math.max(0, contentHeight() - height)))
      },
    },
  })
  el.scrollTo = ((options: ScrollToOptions) => {
    el.scrollTop = options.top ?? top
  }) as typeof el.scrollTo
  parent.append(el)
  return el
}

const label = (index: number) => `Row ${index}${index % 100 === 0 ? " needle" : ""}`

// 1000 rows of 20px in a 100px scroller, findable.
function list(connect = { findable: true }, onFind?: (index: number) => void) {
  const rows = createVirtualizer({
    count: () => 1000,
    estimate: () => 20,
    overscan: 2,
    findable: label,
    onFind,
  })
  const el = scroller(100, () => rows.size())
  cleanups.push(rows.connect(el, connect))
  return { rows, el }
}

// Renders the rows the list asks for, measured, in row order, like a keyed framework list.
function render(rows: ReturnType<typeof createVirtualizer>, el: HTMLElement) {
  const content = document.createElement("div")
  el.insertBefore(content, el.lastElementChild)
  const shown = new Map<number, HTMLElement>()
  const draw = () => {
    const want = new Set(rows.items().map((item) => item.index))
    for (const [index, row] of shown)
      if (!want.has(index)) {
        row.remove()
        shown.delete(index)
      }
    for (const item of rows.items())
      if (!shown.has(item.index)) {
        const row = document.createElement("div")
        row.textContent = label(item.index)
        shown.set(item.index, row)
        rows.measure(item.index, row)
      }
    for (const item of rows.items()) shown.get(item.index)!.toggleAttribute("data-found", !!item.found)
    content.replaceChildren(...[...shown.entries()].sort(([a], [b]) => a - b).map(([, row]) => row))
  }
  draw()
  cleanups.push(rows.subscribe(draw))
  return { shown, content }
}

// The stand-ins in the page, in document order.
const standIns = (root: Element) =>
  [...root.querySelectorAll("[data-findable-layer] > div > div")] as HTMLElement[]
const standIn = (root: Element, index: number) =>
  standIns(root).find((el) => el.textContent === label(index))!
const indexOf = (el: Element) => Number(/Row (\d+)/.exec(el.textContent ?? "")![1])
const all = Array.from({ length: 1000 }, (_, index) => index)

describe("findable rows", () => {
  test("stand-ins sit before and after the rows in row order, and rendered rows have none", () => {
    const { rows, el } = list()
    const { content } = render(rows, el)
    expect(el.firstElementChild!.hasAttribute("data-findable-layer")).toBe(true)
    expect(el.lastElementChild!.hasAttribute("data-findable-layer")).toBe(true)
    const order = () =>
      [...standIns(el), ...content.children]
        .sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1))
        .map(indexOf)
    expect(order()).toEqual(all)
    for (const node of standIns(el)) expect(node.getAttribute("hidden")).toBe("until-found")
    el.scrollTop = 4000
    el.dispatchEvent(new Event("scroll"))
    expect(order()).toEqual(all)
    expect(standIns(el)).toHaveLength(1000 - rows.items().length)
  })

  test("the order holds through small scrolls both ways and a run of matches", async () => {
    const { rows, el } = list()
    const { shown, content } = render(rows, el)
    const order = () =>
      [...standIns(el), ...content.children]
        .sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1))
        .map(indexOf)
        .filter((value, i, list) => list.indexOf(value) === i)
    for (const top of [0, 30, 75, 140, 200, 1990, 2060, 2100, 2040, 1980, 150, 90, 20]) {
      el.scrollTop = top
      el.dispatchEvent(new Event("scroll"))
      expect(order(), `at ${top}px`).toEqual(all)
    }
    // Every eighth row, as the find bar would step through them.
    for (let index = 16; index <= 400; index += 8) {
      const target = standIns(el).find((node) => node.textContent === label(index))
      if (!target) continue
      target.dispatchEvent(new Event("beforematch"))
      await frame()
      expect(target.parentElement, `after matching ${index}`).toBe(shown.get(index))
      expect(order(), `after matching ${index}`).toEqual(all)
    }
  })

  test("without the option, connect adds no layers, and mountFindable puts them anywhere", () => {
    const box = document.createElement("div")
    box.append(document.createElement("p"))
    document.body.append(box)
    const { rows, el } = list({ findable: false })
    expect(el.querySelector("[data-findable-layer]")).toBeNull()
    const unmount = rows.mountFindable(box)
    expect(box.firstElementChild!.hasAttribute("data-findable-layer")).toBe(true)
    expect(box.lastElementChild!.hasAttribute("data-findable-layer")).toBe(true)
    expect(standIns(box)).toHaveLength(1000 - rows.items().length)
    unmount()
    expect(box.querySelector("[data-findable-layer]")).toBeNull()
  })

  test("a match scrolls the list to the row, reports it, marks it found, then moves its stand-in into the row", async () => {
    const onFind = vi.fn()
    const { rows, el } = list({ findable: true }, onFind)
    const { shown } = render(rows, el)
    const match = standIn(el, 500)
    match.dispatchEvent(new Event("beforematch"))
    // Row 500 starts at 10000px; centered in 100px of scroller.
    expect(el.scrollTop).toBe(9960)
    expect(onFind).toHaveBeenCalledWith(500, expect.objectContaining({ reason: "find-in-page" }))
    expect(rows.found()).toBe(500)
    expect(rows.items().find((item) => item.found)?.index).toBe(500)
    expect(shown.get(500)!.hasAttribute("data-found")).toBe(true)
    // Clear and over the row until the browser has scrolled to it; nothing else moves yet.
    expect(match.style).toMatchObject({ position: "absolute", opacity: "0", top: "40px", height: "20px" })
    await frame()
    expect(match.parentElement).toBe(shown.get(500))
    // Out of view again, it's an ordinary stand-in in its place, and nothing is found.
    el.scrollTop = 0
    el.dispatchEvent(new Event("scroll"))
    expect(match.closest("[data-findable-layer]")).not.toBeNull()
    expect(match.getAttribute("hidden")).toBe("until-found")
    expect(match.getAttribute("style")).toBeNull()
    expect(rows.found()).toBeNull()
  })

  test("pressing in the list ends the found row and puts its stand-in back", async () => {
    const { rows, el } = list()
    const { shown } = render(rows, el)
    const match = standIn(el, 300)
    match.dispatchEvent(new Event("beforematch"))
    await frame()
    el.dispatchEvent(new Event("pointerdown"))
    expect(rows.found()).toBeNull()
    expect(shown.get(300)!.hasAttribute("data-found")).toBe(false)
    expect(match.isConnected).toBe(false)
    el.scrollTop = 0
    el.dispatchEvent(new Event("scroll"))
    expect(standIn(el, 300)).toBe(match)
  })

  test("stand-ins follow the rows after refresh", () => {
    let count = 1000
    const rows = createVirtualizer({ count: () => count, estimate: () => 20, findable: label })
    const el = scroller(100, () => rows.size())
    cleanups.push(rows.connect(el, { findable: true }))
    count = 2000
    rows.refresh()
    expect(standIns(el)).toHaveLength(2000 - rows.items().length)
    expect(standIn(el, 1900).getAttribute("hidden")).toBe("until-found")
  })
})

// A list whose rows render their text in two slots, the row's number and a word.
const pieces = (index: number) => [`Row ${index}`, index % 100 === 0 ? "needle" : "plain"]
function slottedList(connect = { findable: true }) {
  const rows = createVirtualizer({ count: () => 1000, estimate: () => 20, overscan: 2, findable: pieces })
  const el = scroller(100, () => rows.size())
  const content = document.createElement("div")
  el.append(content)
  cleanups.push(rows.connect(el, connect))
  const shown = new Map<number, { row: HTMLElement; slots: HTMLElement[]; off: (() => void)[] }>()
  const draw = () => {
    const want = new Set(rows.items().map((item) => item.index))
    for (const [index, item] of shown)
      if (!want.has(index)) {
        item.off.forEach((off) => off())
        item.row.remove()
        shown.delete(index)
      }
    for (const index of [...want].sort((a, b) => a - b))
      if (!shown.has(index)) {
        const row = document.createElement("div")
        const slots = [document.createElement("span"), document.createElement("span")]
        row.append(slots[0], " ", slots[1])
        rows.measure(index, row)
        shown.set(index, { row, slots, off: slots.map((slot, part) => rows.bindFindable(index, slot, part)) })
      }
    content.replaceChildren(...[...shown.entries()].sort(([a], [b]) => a - b).map(([, item]) => item.row))
  }
  draw()
  cleanups.push(rows.subscribe(draw))
  return { rows, el, shown }
}

describe("bindFindable slots", () => {
  test("rendered rows show their text through their slots, and every row's text is in the page once", async () => {
    const { el, shown } = slottedList()
    expect(shown.get(0)!.slots.map((slot) => slot.textContent)).toEqual(["Row 0", "needle"])
    const text = () => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      const found: string[] = []
      while (walker.nextNode())
        if (/^Row \d+$/.test(walker.currentNode.textContent!)) found.push(walker.currentNode.textContent!)
      return found
    }
    expect(text()).toEqual(all.map((index) => `Row ${index}`))
    el.scrollTop = 4000
    el.dispatchEvent(new Event("scroll"))
    await microtask()
    expect(text()).toEqual(all.map((index) => `Row ${index}`))
  })

  test("a match moves the matched text into the row's slots on the next frame", async () => {
    const { rows, el, shown } = slottedList()
    const match = standIns(el).find((node) => node.textContent?.startsWith("Row 500 "))!
    const matchedText = match.firstChild
    match.dispatchEvent(new Event("beforematch"))
    expect(rows.found()).toBe(500)
    // Until the browser has highlighted it, the text stays in the stand-in.
    expect(shown.get(500)!.slots[0].firstChild).not.toBe(matchedText)
    await frame()
    expect(shown.get(500)!.slots[0].firstChild).toBe(matchedText)
    expect(match.isConnected).toBe(false)
  })

  test("a ref that runs again with the same element keeps its text where it is", async () => {
    const { rows, shown } = slottedList()
    const { slots, off } = shown.get(3)!
    const node = slots[0].firstChild
    const watch = new MutationObserver(() => {})
    watch.observe(slots[0], { childList: true })
    off[0]()
    off[0] = rows.bindFindable(3, slots[0], 0)
    await microtask()
    expect(watch.takeRecords()).toHaveLength(0)
    expect(slots[0].firstChild).toBe(node)
  })

  test("without the layers, slots show plain text", () => {
    const { shown } = slottedList({ findable: false })
    expect(shown.get(2)!.slots.map((slot) => slot.textContent)).toEqual(["Row 2", "plain"])
  })
})
