// What the after-mount tests share in core and in every adapter: the values
// to try, the changes a case makes, and markup made comparable.
import { schemaOf } from "../src/foundation/kernel/primitive"
import type { Primitive } from "../src/foundation/kernel/primitive-types"
import { kindOf } from "../src/testing/schema"
import type { Case } from "./after-mount.cases"

// jsdom has no ResizeObserver or IntersectionObserver. Nothing here changes
// size or scrolls, so each element's size is reported once, as a browser reports the first.
const reported = new WeakSet<Element>()
class Unobserved {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
class Sized {
  #report: (entries: object[], observer: unknown) => void
  #watched = new Set<Element>()
  constructor(report: (entries: object[], observer: unknown) => void) {
    this.#report = report
  }
  observe(target: Element) {
    this.#watched.add(target)
    requestAnimationFrame(() => {
      if (!this.#watched.has(target) || reported.has(target)) return
      reported.add(target)
      const contentRect = target.getBoundingClientRect()
      const size = [{ inlineSize: contentRect.width, blockSize: contentRect.height }]
      this.#report([{ target, contentRect, borderBoxSize: size, contentBoxSize: size }], this)
    })
  }
  unobserve(target: Element) {
    this.#watched.delete(target)
  }
  disconnect() {
    this.#watched.clear()
  }
  takeRecords() {
    return []
  }
}
globalThis.ResizeObserver ??= Sized as never
globalThis.IntersectionObserver ??= Unobserved as never
// Nor Element.animate, which a drawer's motion runs on. Each one ends a frame later.
Element.prototype.animate ??= function () {
  let running = true
  const animation = {
    finished: Promise.resolve(),
    onfinish: null as (() => void) | null,
    startTime: null,
    cancel: () => (running = false),
    finish() {},
    pause() {},
    play() {},
    commitStyles() {},
    persist() {},
  }
  requestAnimationFrame(() => running && animation.onfinish?.())
  return animation as never
}

// jsdom spaces frames 16ms apart. Nothing here measures time, so each frame
// runs as its own task as soon as the queue reaches it, in the same order.
globalThis.requestAnimationFrame = (callback) =>
  setTimeout(() => callback(performance.now()), 0) as unknown as number
globalThis.cancelAnimationFrame = (handle) => clearTimeout(handle)

// Values to try for options and props with these names, in every component.
// A case's own `values` win.
const shared: Record<string, readonly unknown[]> = {
  orientation: ["horizontal", "vertical"],
  disabled: [false, true],
  readOnly: [false, true],
  required: [false, true],
  loop: [true, false],
  focusableWhenDisabled: [false, true],
  activation: ["automatic", "manual"],
  hiddenUntilFound: [false, true],
  keepMounted: [false, true],
  multiple: [false, true],
  modal: [true, false],
}

// A list with a tab stop has one, on an item a person can use: one element
// takes Tab, and it isn't disabled.
// Items are the parts of a slot one of whose elements is out of the tab order.
function tabStopProblem(view: { root: HTMLElement }) {
  const roving = new Set(
    [...view.root.querySelectorAll('[tabindex="-1"][data-slot]')].map((el) => el.getAttribute("data-slot")),
  )
  for (const slot of roving) {
    const stops = [...view.root.querySelectorAll(`[data-slot="${slot}"][tabindex="0"]`)]
    if (stops.length > 1) return `${stops.length} ${slot} elements take Tab`
    if (stops[0]?.matches(':disabled, [aria-disabled="true"]'))
      return `the tab stop, ${stops[0].textContent}, is disabled`
  }
}

// Options read only when the component starts, by design, and the development one.
const startOnly = (key: string) => key.startsWith("default") || key === "debug"
// Kinds that hand over behavior rather than a value to show.
const handedOver = new Set(["callback", "action", "id"])
// Swapping one is covered by the controller tests.
const elsewhere = new Set(["controller"])

// An element as its tag, attributes in name order and children, since the
// order a renderer writes attributes in isn't something a page shows, nor
// an empty style.
function canonical(node: Node, skip: Set<string>): string {
  if (!(node instanceof Element)) return node.textContent ?? ""
  const attributes = [...node.attributes, ...liveState(node)]
    .filter(
      ({ name, value }) =>
        !ignored.has(name) &&
        !skip.has(name) &&
        !(name === "style" && !value) &&
        !(node instanceof HTMLInputElement && (name === "value" || name === "checked")),
    )
    .map(
      ({ name, value }) =>
        `${name}="${name === "style" ? sortStyle(value, node.hasAttribute("data-side")) : value}"`,
    )
    .concat(liveState(node).map(({ name, value }) => `${name}="${value}"`))
    .sort()
    .join(" ")
  const children = [...node.childNodes].map((child) => canonical(child, skip)).join("")
  return `<${node.localName} ${attributes}>${children}</${node.localName}>`
}

// An input shows its value and checked state as properties: a renderer can
// keep the attributes at what it first wrote, as their defaults.
function liveState(node: Element) {
  if (!(node instanceof HTMLInputElement)) return []
  const toggles = node.type === "checkbox" || node.type === "radio"
  return [
    ...(node.value && (!toggles || node.hasAttribute("value")) ? [{ name: "value", value: node.value }] : []),
    ...(node.checked ? [{ name: "checked", value: "" }] : []),
  ]
}

// A placed popup's left and top come from a box a DOM made for tests never
// moves, so only a first placement gets them right. jsdom drops a transform
// with var() past its first argument.
const sortStyle = (style: string, placed: boolean) =>
  style
    .split(";")
    .map((declaration) => declaration.trim())
    .filter(
      (declaration) =>
        declaration &&
        !(placed && /^(left|top):/.test(declaration)) &&
        !/^transform:.*var\(/.test(declaration),
    )
    .sort()
    .join("; ")

// What only a change shows, never a first render: the direction tabs moved in.
const ignored = new Set(["data-activation-direction"])

type Change =
  | { kind: "option"; key: string; from: unknown; to: unknown }
  | { kind: "prop"; slot: string; partKey: string; key: string; from: unknown; to: unknown }

// Every change a case makes: each option and each prop of each part it
// names, from every value to every other, unless it's read once or skipped.
function changesOf(entry: Case) {
  const schema = schemaOf(entry.primitive as Primitive)
  const changes: Change[] = []
  const missing: string[] = []
  const pairs = (values: readonly unknown[]) =>
    values.flatMap((from) => values.filter((to) => to !== from).map((to) => [from, to] as const))
  for (const [key, spec] of Object.entries(schema.options ?? {})) {
    if (startOnly(key) || handedOver.has(kindOf(spec)) || elsewhere.has(key) || key in (entry.skip ?? {}))
      continue
    const values = entry.values?.[key] ?? shared[key]
    if (!values) missing.push(key)
    else for (const [from, to] of pairs(values)) changes.push({ kind: "option", key, from, to })
  }
  for (const [slot, parts] of Object.entries(entry.parts ?? {})) {
    const own = schema.slots[slot] ?? {}
    for (const [partKey, values] of Object.entries(parts))
      for (const key of Object.keys(own)) {
        const named = `${slot}.${key}`
        const spec = own[key]
        const fromParent = typeof spec === "object" && "from" in spec
        if (
          startOnly(key) ||
          handedOver.has(kindOf(spec)) ||
          fromParent ||
          key === "value" ||
          named in (entry.skip ?? {})
        )
          continue
        const tried = values[key] ?? entry.values?.[named] ?? shared[key]
        if (!tried) missing.push(named)
        else
          for (const [from, to] of pairs(tried)) changes.push({ kind: "prop", slot, partKey, key, from, to })
      }
  }
  return { changes, missing }
}

const title = (change: Change) =>
  change.kind === "option"
    ? `${change.key}: ${JSON.stringify(change.from)} to ${JSON.stringify(change.to)}`
    : `${change.slot} "${change.partKey}" ${change.key}: ${JSON.stringify(change.from)} to ${JSON.stringify(change.to)}`

// The markup with a prop set on one part: the slot's part with that value or
// id, or its first.
function withAttribute(markup: string, change: Change & { kind: "prop" }, value: unknown) {
  const name = kebab(change.key)
  const keyed = change.partKey ? `[^>]*(?:value|id)="${change.partKey}"` : ""
  const written =
    value && typeof value === "object" && !Array.isArray(value)
      ? `${name}='${JSON.stringify(value)}'`
      : `${name}="${String(value)}"`
  return markup.replace(new RegExp(`<${change.slot}(?=[\\s>])${keyed}[^>]*>`), (tag) => {
    const own = new RegExp(`\\s${name}(="[^"]*"|='[^']*')?(?=[\\s>])`)
    return own.test(tag) ? tag.replace(own, ` ${written}`) : tag.replace(/>$/, ` ${written}>`)
  })
}

function kebab(name: string) {
  return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

// A rendered tree as comparable markup. History attributes, and the tab stop
// with "stop", are left out: one that stays where it was is as right as one a
// first render puts first. Each renderer's own ids are made alike.
function markupOf(root: Node, history: readonly string[] = [], ids: RegExp = /mount-\d+/g) {
  const attributes = history.flatMap((name) => /^\[(.+)\]$/.exec(name)?.[1] ?? [])
  const skip = new Set([...attributes, ...(history.includes("stop") ? ["tabindex"] : [])])
  return canonical(root, skip).replace(ids, "mount")
}

// The options a change starts from: a controlled value replaces its default,
// which can't come with it.
function baseOptions(entry: Case, change: Change) {
  const base: Record<string, unknown> = { ...entry.options }
  if (change.kind === "option") delete base[`default${change.key[0].toUpperCase()}${change.key.slice(1)}`]
  return base
}

// Long enough for what follows the page every frame, like a placed popup, to
// stop and wait, so a change has to wake it.
async function idle() {
  for (let frame = 0; frame < 6; frame++) await new Promise((resolve) => requestAnimationFrame(resolve))
}

export { baseOptions, changesOf, type Change, idle, markupOf, tabStopProblem, title, withAttribute }
