// What adapters do with a part, one rendered element of a slot. An instance
// makes parts (`instance.part(slot, props)`), and these read, subscribe and
// bind them. They're free functions, so each adapter bundles only the ones it
// calls.
import { afterBind } from "./after-bind"
import { checkFocus, checkRole, dev, warn } from "#dev"
import { enforceHidden } from "../platform/style"
import { isComposing, on } from "./events"
import type {
  AnySlot,
  Attrs,
  EventMap,
  Part,
  RoleFields,
} from "./primitive-types"
import { eachMoved } from "./selects"
import {
  renders,
  sameValue,
  subscribeSkipping,
  touch,
  type Listener,
} from "./store"

/**
 * Who renders a bound element. Core renders a custom element and attaches
 * every handler. A framework attaches the `handlers()` it can through its own
 * props, so user handlers run first, and names them in `attaches`: `"all"`, or
 * the event types it maps. Core listens for every other type itself, so a
 * slot's `on` works for any event in every framework. Core also keeps
 * `direct` attributes current on a framework's element, since the framework
 * skips renders for them.
 */
type Host =
  { by: "core" } | { by: "framework"; attaches: "all" | readonly string[] }

// What the kernel keeps on a part beside what adapters read.
type PartRecord = Part & {
  readonly owner: PartOwner
  readonly mapKey: string
  // Where it comes among them, which rises as it joins and as it binds.
  rank?: number
  // The bind that set `el`. Unbinding can change state that binds the part
  // again, so an earlier bind's cleanup leaves a newer bind's element.
  binding?: object
  leases: number
  dropped?: boolean
  ref?: (el: HTMLElement | null) => void
  // What `onProps` registered, which hears each render.
  propsListeners?: Set<() => void>
  // The bound element's id when it isn't the one the slot makes, like an author's.
  own?: string
  // The id the slot made when it last rendered, null when it made none, and
  // undefined when it rendered an author's instead.
  made?: string | null
}

// The instance's side of its parts.
type PartOwner = {
  readonly name: string
  // What warnings call the component.
  readonly label: string
  slots: Record<string, AnySlot>
  api?: unknown
  // One record per part, by `slot:key`. Binding moves a part to the end, so
  // `element(slot)` finds the part of a slot that bound first. Read in that
  // order through `ordered`: a bind only ranks its part last.
  readonly parts: Map<string, PartRecord>
  rank: number
  unordered?: boolean
  // The same records by slot, then key, which a render finds its part in
  // without making `slot:key`.
  readonly keyed: Map<string, Map<string, PartRecord>>
  // While the instance is asleep: what wakes it, and the binds that wait for it.
  sleeping?: { wake: () => void; binds: Set<() => void> }
  // A part stays while something leases it: its bound element or a
  // subscription. Once released, it's dropped a microtask later unless leased
  // again, so StrictMode's unmount and remount in one task, or Suspense hiding
  // and showing it, keeps its props and its ref callback.
  released: PartRecord[]
  // Parts with an `own` id, and, once per version of state, the own id that
  // stands for each id their slots make.
  named?: Set<PartRecord>
  aliases?: { version: number; map: Map<string, string> }
  // Parts whose element's id to read, a microtask later.
  unread?: Set<PartRecord>
  // Whether a render took an own id since parts last heard, which they hear
  // once the elements bind, so a part rendered before it points at it too.
  renamed?: boolean
}

// The part a sleeping instance's view was made for, which `firstAsleep` reads.
const viewed = Symbol()
// Every part an adapter holds came from `instance.part()`, which makes a record.
const ownerOf = (part: Part) => (part as PartRecord).owner
const definitionOf = (part: Part) => ownerOf(part).slots[part.slot]

// Prototype getters avoid per-object `DefineGetterProperty` overhead while an instance sleeps.
class AsleepPart implements PartRecord {
  readonly slot: string
  readonly key: string
  readonly mapKey: string
  readonly id: string
  readonly store: Part["store"]
  props: Part["props"]
  el: HTMLElement | undefined = undefined
  readonly owner: PartOwner
  leases = 0
  constructor(
    slot: string,
    key: string,
    mapKey: string,
    id: string,
    store: Part["store"],
    props: Part["props"],
    owner: PartOwner
  ) {
    this.slot = slot
    this.key = key
    this.mapKey = mapKey
    this.id = id
    this.store = store
    this.props = props
    this.owner = owner
  }
  get api() {
    return this.owner.api
  }
}

class AsleepView<Props> {
  readonly id: string
  readonly key: string
  readonly props: Props
  readonly [viewed]: PartRecord
  constructor(part: PartRecord, props: Props) {
    this.id = part.id
    this.key = part.key
    this.props = props
    this[viewed] = part
  }
  get api() {
    return awake(this[viewed])
  }
}

class AsleepContext {
  readonly el: HTMLElement | undefined
  readonly id: string
  readonly key: string
  readonly props: Part["props"]
  readonly store: Part["store"]
  #part: Part
  constructor(part: Part, props: Part["props"]) {
    this.el = part.el
    this.id = part.id
    this.key = part.key
    this.props = props
    this.store = part.store
    this.#part = part
  }
  get api() {
    return awake(this.#part)
  }
}

// What pure reads see of a part: no element and no store. Reading the api
// wakes an instance that sleeps, so a part that can render asleep reads none.
const view = <Api, Props>(part: Part<any, Api>, props: Props) =>
  ownerOf(part).sleeping
    ? (new AsleepView(part as PartRecord, props) as unknown as {
        id: string
        key: string
        props: Props
        api: Api
      })
    : { id: part.id, key: part.key, props, api: part.api }
const context = (part: Part, props = part.props) =>
  ownerOf(part).sleeping
    ? new AsleepContext(part, props)
    : {
        el: part.el,
        id: part.id,
        key: part.key,
        props,
        store: part.store,
        api: part.api,
      }

// A part the sweep dropped while a framework kept it, like content Suspense
// hid and shows again, comes back as it's leased.
function lease(part: PartRecord) {
  if (part.dropped && !part.owner.parts.has(part.mapKey)) {
    enlist(part)
    part.dropped = false
  }
  part.leases++
  let held = true
  return () => {
    if (!held) {
      return
    }
    held = false
    if (--part.leases) {
      return
    }
    const { owner } = part
    if (!owner.released.length) {
      queueMicrotask(() => sweep(owner))
    }
    owner.released.push(part)
  }
}

// A part made while a framework rendered, which it may throw away, goes
// with the next sweep unless something leases it first.
function provisional(part: PartRecord) {
  const { owner } = part
  if (!owner.released.length) {
    queueMicrotask(() => sweep(owner))
  }
  owner.released.push(part)
}

function sweep(owner: PartOwner) {
  for (const part of owner.released) {
    if (!part.leases && owner.parts.get(part.mapKey) === part) {
      owner.parts.delete(part.mapKey)
      owner.keyed.get(part.slot)?.delete(part.key)
      part.dropped = true
    }
  }
  owner.released = []
}

// The instance's parts in the order they joined and bound. Parts mostly bind
// in the order they joined, which leaves them in order already.
function ordered(owner: PartOwner) {
  const { parts } = owner
  if (owner.unordered) {
    owner.unordered = false
    let last = 0
    let sorted = true
    for (const part of parts.values()) {
      if (part.rank! < last) {
        sorted = false
        break
      }
      last = part.rank!
    }
    if (!sorted) {
      const all = [...parts.values()].sort((a, b) => a.rank! - b.rank!)
      parts.clear()
      for (const part of all) {
        parts.set(part.mapKey, part)
      }
    }
  }
  return parts
}

function enlist(part: PartRecord) {
  const { owner } = part
  const { parts, keyed } = owner
  part.rank = ++owner.rank
  parts.set(part.mapKey, part)
  let slot = keyed.get(part.slot)
  if (!slot) {
    keyed.set(part.slot, (slot = new Map()))
  }
  slot.set(part.key, part)
}

// Reads take the props to read with, so an adapter can compare against the
// props it committed rather than a discarded render's. They default to the
// newest render's. `state`, from `instance.preview()`, renders a controlled
// value before the store has it.

/**
 * HTML attributes for the part. SSR-safe. Once an element binds with an id
 * other than the one its slot makes, like an author's, references to the made
 * id point at it.
 * @stable
 */
function attrs(part: Part, props = part.props, state = part.store.get()) {
  const definition = definitionOf(part) as AnySlot & RoleFields<any, any, any>
  const context = view(part, props)
  const own = definition.attrs?.(state, context)
  const declared = definition.role
  const role =
    typeof declared === "function" ? declared(state, context) : declared
  if (dev) {
    checkRole(
      definition,
      part.slot,
      own,
      role,
      { component: ownerOf(part).label, id: part.id },
      definition.live?.read(state, context)
    )
  }
  // A slot renders an author's id as it is, so any other id is one it made.
  const authored = (props as { id?: unknown }).id
  ;(part as PartRecord).made =
    authored === undefined || own?.id !== authored
      ? (own?.id ?? null)
      : undefined
  const { name } = ownerOf(part)
  const result: Attrs = {
    "data-slot": part.slot === "root" ? name : `${name}-${part.slot}`,
    ...(declared === undefined ? undefined : { role }),
    ...own,
  }
  // The declared role wins over one in `attrs`, and keeps its place first.
  if (declared !== undefined) {
    result.role = role as Attrs[string]
  }
  return aliased(part as PartRecord, result)
}

// What names an element or hints how to type in it, which no behavior reads,
// so the author's own value replaces the part's. Not `aria-describedby`, which
// a field combines with the control's own.
const authorOwned = new Set([
  "aria-label",
  "aria-labelledby",
  "aria-description",
  "title",
  "autocomplete",
  "autocapitalize",
  "autocorrect",
  "spellcheck",
  "inputmode",
  "enterkeyhint",
])

/** The part's attributes without the ones the author gives, for `given(name)` to say which. */
function yieldToAuthor(attrs: Attrs, given: (name: string) => boolean) {
  let result: Attrs | undefined
  for (const name in attrs) {
    if (attrs[name] !== undefined && authorOwned.has(name) && given(name)) {
      ;(result ??= { ...attrs })[name] = undefined
    }
  }
  return result ?? attrs
}

/** Whether a label reference points only at ids ui-sdk made, like a component's own label or a copied element's, rather than the author's. */
const madeLabel = (value: unknown) =>
  typeof value === "string" &&
  value.split(/\s+/).every((id) => id.startsWith("ui-sdk-"))

/**
 * What `render` functions and state-based class names receive.
 * @stable
 */
function partState(part: Part, props = part.props, state = part.store.get()) {
  return definitionOf(part).state?.(state, view(part, props)) ?? {}
}

/**
 * Whether the part's element should exist.
 * @stable
 */
function present(part: Part, props = part.props, state = part.store.get()) {
  return definitionOf(part).present?.(state, view(part, props)) ?? true
}

/** Whether the part's presence depends on state, so a renderer shows and hides it. */
function conditional(part: Part) {
  return definitionOf(part).present !== undefined
}

/** Whether something leases the part, its bound element or a subscription, so a page renders it. */
const held = (part: Part) => (part as PartRecord).leases > 0

/** Live attributes, which core writes to a bound element itself. */
function liveAttrs(part: Part, props = part.props) {
  return aliased(
    part as PartRecord,
    definitionOf(part).live?.read(part.store.get(), view(part, props)) ?? {}
  )
}

/** The attributes core keeps current on an element a framework rendered. */
const directNames = (part: Part) => definitionOf(part).direct?.names

/**
 * The values the part selects on. Empty without `selects`. Adapters
 * subscribe again when it changes.
 */
const selectedKeys = (part: Part, props = part.props) =>
  definitionOf(part).selects?.selection(part, props) ?? ""

const onlyKeys = ["#keys"]

/**
 * The names a part reads `synced` by, the state a framework delivers through
 * `instance.follow`: a key's name for a key it reads whole, and `key:value`
 * for a value it selects on, like `value:billing` for one tab, which only the
 * changes that take or leave that value touch (`touched`). `"#keys"` changes
 * when a key starts or stops being delivered.
 */
function followed(part: Part, synced: object | undefined, props = part.props) {
  if (!synced) {
    return onlyKeys
  }
  let names: string[] | undefined
  const narrowed = definitionOf(part).selects
  for (const key in synced) {
    const values = narrowed?.reading(part, props, key)
    if (!values) {
      ;(names ??= ["#keys"]).push(key)
    } else if (values.length) {
      names ??= ["#keys"]
      for (const value of values) {
        names.push(`${key}:${value}`)
      }
    }
  }
  return names ?? onlyKeys
}

/**
 * Runs `notify` for every name `followed` reads that changes from `previous`
 * to `next`, once or more.
 */
function touched(
  previous: Record<string, unknown> | undefined = {},
  next: Record<string, unknown> | undefined = {},
  notify: (name: string) => void
) {
  let keys = false
  for (const key in previous) {
    if (!(key in next)) {
      keys = true
    }
  }
  for (const key in next) {
    if (!(key in previous)) {
      keys = true
    } else if (sameValue(previous[key], next[key])) {
      continue
    }
    notify(key)
    eachMoved(previous[key], next[key], (value) => notify(`${key}:${value}`))
  }
  if (keys) {
    notify("#keys")
  }
}

// What a part that narrows nothing skips: no key.
const skipNone = {}

/**
 * Runs `listener` when a change can affect the part, narrowed by the slot's
 * `selects`, or on every change without it, always after the component's own
 * listeners. Leases the part while subscribed.
 */
function subscribe(part: Part, listener: Listener, props = part.props) {
  const narrowed = definitionOf(part).selects
  const cleanups = [
    lease(part as PartRecord),
    narrowed
      ? narrowed.subscribe(part, listener, props)
      : subscribeSkipping(part.store, skipNone, listener),
  ]
  return () => cleanups.forEach((cleanup) => cleanup())
}

/** Event handlers, for adapters that attach events through the framework. */
function handlers(part: Part) {
  const { on: events, press: activate } = definitionOf(part)
  const result: Partial<Record<keyof EventMap, (event: Event) => void>> = {}
  for (const type in events) {
    const handler = events[type as keyof EventMap] as (
      event: Event,
      context: unknown
    ) => void
    result[type as keyof EventMap] = (event) => {
      if (event.defaultPrevented || ignoredKey(event)) {
        return
      }
      ownerOf(part).sleeping?.wake()
      handler(event, context(part))
    }
  }
  if (typeof activate === "function" && !result.click) {
    result.click = (event) => {
      if (!event.defaultPrevented) {
        ownerOf(part).sleeping?.wake()
        activate(context(part), event)
      }
    }
  }
  return result
}

/**
 * Gives a part the props of the render a framework committed, for one that
 * renders parts with `instance.part(slot, props, true)` and may throw renders
 * away. Its handlers and the parts around read them from now, and its
 * `onProps` listeners run.
 */
function commit(part: Part, props: Part["props"]) {
  if (part.props === props) {
    return
  }
  part.props = props
  propsRendered(part as PartRecord)
}

/**
 * For a render while the instance sleeps and has no api to ask: the key of
 * the slot's first part that's bound and in the page, else the first rendered.
 */
function firstAsleep(view: object, slot: string) {
  const part = (view as { [viewed]?: PartRecord })[viewed]
  if (!part) {
    return undefined
  }
  let first: string | undefined
  for (const other of ordered(part.owner).values()) {
    if (other.slot === slot) {
      if (other.el?.isConnected) {
        return other.key
      }
      first ??= other.key
    }
  }
  return first
}

// The instance's parts in order, for work that runs while it sleeps.
const partsOf = (part: Part) => ordered(ownerOf(part)).values()

// The next bound, connected part of `slot` besides `except`, without waking `api`.
function nextAsleep(part: Part, slot: string, except?: string) {
  for (const other of ordered(ownerOf(part)).values()) {
    if (other.slot === slot && other.key !== except && other.el?.isConnected) {
      return other.key
    }
  }
}

// Props of `slot`'s bound or first registered part while asleep, or undefined once awake.
function propsAsleep<Props extends object>(view: object, slot: string) {
  const part = (view as { [viewed]?: PartRecord })[viewed]
  if (!part) {
    return undefined
  }
  let first: Props | undefined
  for (const other of ordered(part.owner).values()) {
    if (other.slot === slot) {
      if (other.el?.isConnected) {
        return other.props as Props
      }
      first ??= other.props as Props
    }
  }
  return (first ?? {}) as Props
}

// Tells the part's `onProps` listeners it rendered with new props.
function propsRendered(part: PartRecord) {
  part.propsListeners?.forEach((listener) => listener())
}

/**
 * The part's api, for work a part set up while its instance slept, like a
 * shortcut it registered: the instance wakes first.
 */
function awake<Api>(part: Part<object, Api>) {
  ownerOf(part).sleeping?.wake()
  return part.api
}

/** Activation without a DOM event, for headless tests and the docs' generated tables. */
function press(part: Part, props = part.props) {
  const handler = definitionOf(part).press
  return typeof handler === "function"
    ? () => {
        ownerOf(part).sleeping?.wake()
        handler(context(part, props))
      }
    : undefined
}

/**
 * Runs `listener` whenever an adapter renders the part, with `part.props`
 * already the props it passed. Work that depends on a prop, like registering
 * a shortcut, then runs only while the prop asks for it.
 */
function onProps(part: Part, listener: () => void) {
  const listeners = ((part as PartRecord).propsListeners ??= new Set())
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// A slot names `hidden` in its attributes whether it's set or not, so one
// read per slot says whether its parts can be hidden.
const hidingSlots = new WeakMap<object, boolean>()

function canHide(part: Part) {
  const definition = definitionOf(part)
  let hides = hidingSlots.get(definition)
  if (hides === undefined) {
    hides =
      !!definition.attrs &&
      "hidden" in definition.attrs(part.store.get(), view(part, part.props))
    hidingSlots.set(definition, hides)
  }
  return hides
}

/** Attaches behavior to an element. Leases the part while bound. Returns the cleanup. */
function bind(part: Part, el: HTMLElement, host: Host = { by: "core" }) {
  const kept = part as PartRecord
  const { owner } = kept
  const listed = part.el ? kept : owner.parts.get(kept.mapKey)
  if (!listed) {
    enlist(kept)
  } else if (!part.el && listed === kept && kept.rank !== owner.rank) {
    kept.rank = ++owner.rank
    owner.unordered = true
  }
  if (dev) {
    checkShared(part, part.el, el)
    const { focus } = definitionOf(part) as RoleFields<any, any, any>
    checkFocus(
      typeof focus === "function"
        ? focus(part.store.get(), view(part, part.props))
        : focus,
      part.slot,
      el,
      {
        component: ownerOf(part).label,
        id: part.id,
      }
    )
  }
  const binding = {}
  part.el = el
  kept.binding = binding
  const cleanups = [lease(kept)]
  if (canHide(part)) {
    enforceHidden(el.ownerDocument)
  }

  if (host.by === "core" || host.attaches !== "all") {
    for (const [type, handler] of Object.entries(handlers(part))) {
      if (host.by === "core" || !host.attaches.includes(type)) {
        cleanups.push(on(el, type as keyof EventMap, handler))
      }
    }
  }

  const definition = definitionOf(part)
  if (definition.live) {
    cleanups.push(definition.live.attach(part, el))
  }
  if (host.by === "framework" && definition.direct) {
    cleanups.push(definition.direct.attach(part, el))
  }

  const early = definition.asleep?.(el, part)
  if (early) {
    cleanups.push(early)
  }
  const late = () => {
    const cleanup = definition.bind?.(el, part)
    if (cleanup) {
      cleanups.push(cleanup)
    }
  }
  const { sleeping } = kept.owner
  if (sleeping && definition.bind) {
    sleeping.binds.add(late)
    cleanups.push(() => sleeping.binds.delete(late))
  } else {
    late()
  }
  // Stand-ins that unit tests bind in Node have no ids to follow.
  if (definition.attrs && typeof MutationObserver !== "undefined") {
    cleanups.push(followId(kept, el))
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup())
    if (kept.binding !== binding) {
      return
    }
    part.el = kept.binding = undefined
    if (kept.own !== undefined) {
      readIdLater(kept)
    }
  }
}

// Two elements in the page binding one part are two parts given one key, which
// share its props, so a press on one runs with the other's. Parts with no key,
// like a dialog's close buttons, are many elements of one part. It checks a
// microtask later, since one update can hand a part to another element before
// the element that had it takes its next part, like a calendar's weekday
// headers moving when the week starts on another day.
function checkShared(
  part: Part,
  bound: HTMLElement | null | undefined,
  el: HTMLElement
) {
  if (!part.key || !bound || bound === el) {
    return
  }
  queueMicrotask(() => {
    if (part.el !== el || !bound.isConnected || !el.isConnected) {
      return
    }
    const { parts, label } = ownerOf(part)
    for (const other of parts.values()) {
      if (other.el === bound) {
        return
      }
    }
    warn(
      `two "${part.slot}" parts share the key "${part.key}". Give each an id or a unique value.`,
      {
        component: label,
        id: part.id,
      }
    )
  })
}

/**
 * A stable ref callback for frameworks that hand elements over one at a time.
 * Safe to call repeatedly with the same element or with null. The framework
 * may call it again after the part was dropped, like Suspense showing content
 * it hid, and it binds with the props the part last rendered with.
 */
function ref(part: Part, host: Host) {
  const kept = part as PartRecord
  if (kept.ref) {
    return kept.ref
  }
  let current: HTMLElement | null = null
  let unbind = () => {}
  return (kept.ref = (el) => {
    if (el === current) {
      return
    }
    if (dev && el) {
      checkShared(part, current, el)
    }
    unbind()
    current = el
    unbind = el ? bind(part, el, host) : () => {}
  })
}

/**
 * Runs the slot's `connect` while the element is in the page, present or not,
 * for adapters that keep parts that aren't present, like custom elements.
 * Returns the cleanup.
 */
const connect = (part: Part, el: HTMLElement) =>
  definitionOf(part).connect?.(el) ?? (() => {})

// Attributes that point at other elements by their ids.
const references = [
  "aria-activedescendant",
  "aria-controls",
  "aria-describedby",
  "aria-details",
  "aria-errormessage",
  "aria-flowto",
  "aria-labelledby",
  "aria-owns",
  "for",
  "headers",
]

// The id the slot makes when the author gives none, which a slot that reads
// `id`, like a field's label, renders in its place.
const madeId = (part: Part) =>
  definitionOf(part).attrs?.(
    part.store.get(),
    view(part, { ...part.props, id: undefined })
  ).id

// References to a made id point at the element's own id that replaced it, so
// a label's `for`, the app's own `aria-describedby`, styles and tests that
// name an author's id keep working, and the parts that point at it too.
function aliased(part: PartRecord, attrs: Attrs) {
  const { owner } = part
  // Most parts point at nothing, like a grid's cells, which then never build the aliases.
  if (!owner.named?.size || !references.some((name) => attrs[name])) {
    return attrs
  }
  const aliases = aliasesOf(owner, part.store)
  if (!aliases.size) {
    return attrs
  }
  const result = { ...attrs }
  for (const name of references) {
    const ids = result[name]
    if (ids) {
      result[name] = ids
        .split(" ")
        .map((id) => aliases.get(id) ?? id)
        .join(" ")
    }
  }
  return result
}

/**
 * `attrs` with references following the instance's parts' own ids, as a
 * part's do, for attributes an api writes to an element that isn't a part,
 * like a trigger menu's on its editor.
 */
function aliasReferences(context: { parts(): Iterable<Part> }, attrs: Attrs) {
  for (const part of context.parts()) {
    return aliased(part as PartRecord, attrs)
  }
  return attrs
}

// The own id that stands for each id a slot makes. Kept until state that
// renders changes, so a live change, like a highlight moving, reads it again
// for free.
function aliasesOf(owner: PartOwner, store: Part["store"]) {
  const version = renders(store)
  if (owner.aliases?.version === version) {
    return owner.aliases.map
  }
  const map = new Map<string, string>()
  for (const part of owner.named!) {
    const made = madeId(part)
    if (made !== undefined && made !== part.own) {
      map.set(made, part.own!)
    }
  }
  owner.aliases = { version, map }
  return map
}

// Reads the element's id as it binds and whenever it changes, like a
// framework's `id` prop or a script setting it. An element that binds with
// the id its part just made has nothing to read.
function followId(part: PartRecord, el: HTMLElement) {
  const id = idOf(el)
  if (part.own !== undefined || (id && id !== part.made)) {
    readIdLater(part)
  }
  // One observer watches each element directly, so moving into another shadow
  // root or document keeps following it, and shared elements notify every part.
  const existing = idParts.get(el)
  if (!existing) {
    idParts.set(el, part)
    watchIds().observe(el, idWatchOptions)
  } else if (existing instanceof Set) {
    existing.add(part)
  } else if (existing !== part) {
    idParts.set(el, new Set([existing, part]))
  }
  idBound++
  let active = true
  return () => {
    if (!active) {
      return
    }
    active = false
    const current = idParts.get(el)
    if (current === part) {
      idParts.delete(el)
    } else if (current instanceof Set) {
      current.delete(part)
      if (!current.size) {
        idParts.delete(el)
      }
    }
    if (!--idBound && idWatcher) {
      idWatcher.disconnect()
      idWatcher = undefined
    }
  }
}

const idWatchOptions = { attributeFilter: ["id"] }
const idParts = new WeakMap<Node, PartRecord | Set<PartRecord>>()
let idWatcher: MutationObserver | undefined
let idBound = 0

function watchIds() {
  if (!idWatcher) {
    idWatcher = new MutationObserver((records) => {
      for (const { target } of records) {
        const entry = idParts.get(target)
        if (entry instanceof Set) {
          for (const part of entry) {
            readIdLater(part)
          }
        } else if (entry) {
          readIdLater(entry)
        }
      }
    })
  }
  return idWatcher
}

// A microtask later, once every part binding with it has bound, so the
// instance hears once, and parts a framework hydrates in the same pass render
// what the server did.
function readIdLater(part: PartRecord) {
  const { owner } = part
  if (!owner.unread) {
    owner.unread = new Set()
    afterBind(() => readIds(owner, part.store))
  }
  owner.unread.add(part)
}

// Parts hear only when a made id's alias changes, so an id on an element whose
// slot makes none, like a link's, re-renders nothing.
function readIds(owner: PartOwner, store: Part["store"]) {
  const parts = owner.unread!
  owner.unread = undefined
  let renamed = owner.renamed === true
  owner.renamed = undefined
  for (const part of parts) {
    renamed = rename(part, part.el && idOf(part.el)) || renamed
  }
  if (renamed) {
    touch(store)
  }
}

// Every bound element with an id is read once, so through the `id` property,
// which needs no lookup by name. A form's `id` property can be a control named
// "id", so then it comes from its attribute.
function idOf(el: HTMLElement) {
  const id: unknown = el.id
  return id && typeof id === "object"
    ? el.getAttribute("id")
    : (id as string | undefined)
}

/**
 * Takes the id an author gives a part's element as the part renders, so the
 * parts that render after it, like a tab's panel, point at it from their
 * first render, on a server too. Parts rendered before it, like a dialog's
 * content before its title, point at it once its element binds. Once bound,
 * the id comes from the element as it changes on the page.
 */
function takeOwnId(part: Part, id: unknown) {
  // A render that never commits, like a transition that suspends, would
  // otherwise rename the part for the parts already on the page.
  if (part.el || typeof id !== "string" || !definitionOf(part).attrs) {
    return
  }
  if (rename(part as PartRecord, id)) {
    ownerOf(part).renamed = true
  }
}

// Records `id` as the part's own when it isn't the one its slot makes.
// Returns whether references to the made id now point elsewhere.
function rename(part: PartRecord, id: string | null | undefined) {
  const made = madeId(part)
  const own = id && id !== made ? id : undefined
  if (own === part.own) {
    return false
  }
  const { owner } = part
  part.own = own
  owner.named ??= new Set()
  if (own === undefined) {
    owner.named.delete(part)
  } else {
    owner.named.add(part)
  }
  owner.aliases = undefined
  return made !== undefined
}

// Key events components never act on: one an input method owns while it
// composes text, like Enter confirming a Japanese candidate, and one with no
// key, like the keydown Chrome's autofill sends, which isn't a KeyboardEvent.
function ignoredKey(event: Event) {
  return (
    (event.type === "keydown" || event.type === "keyup") &&
    (typeof (event as KeyboardEvent).key !== "string" ||
      isComposing(event as KeyboardEvent))
  )
}

export {
  AsleepPart,
  aliasReferences,
  attrs,
  authorOwned,
  awake,
  bind,
  commit,
  conditional,
  connect,
  directNames,
  enlist,
  firstAsleep,
  followed,
  handlers,
  held,
  liveAttrs,
  madeLabel,
  nextAsleep,
  onProps,
  ordered,
  type PartOwner,
  partsOf,
  provisional,
  type PartRecord,
  partState,
  present,
  press,
  propsAsleep,
  propsRendered,
  ref,
  references,
  selectedKeys,
  subscribe,
  takeOwnId,
  touched,
  view,
  yieldToAuthor,
}
