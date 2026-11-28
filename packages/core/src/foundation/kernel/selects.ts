// Parts that hear only the changes that can affect them: a highlight change
// reaches the two items it moves between, not every item. Parts that select
// values hear through their store's fanout, installed here the first time one
// subscribes, which runs after the component's own listeners and the parts
// that skip keys.
import { view } from "./part"
import type { Part } from "./primitive-types"
import { subscribeSkipping, type Listener, type Store } from "./store"

// What a part selects on for a key: an item of an array, an entry's name in a
// plain object, or the value itself. An array or object key may be null or
// undefined while it's empty.
type Selected<State, Key extends keyof State> =
  NonNullable<State[Key]> extends readonly (infer Item)[]
    ? Item
    : NonNullable<State[Key]> extends Record<string, unknown>
      ? string
      : State[Key]

/**
 * Reads a key no part can compare its own value with, like a grid's active
 * cell, by name: `values` names what a part reads, and `moved` names what a
 * change reaches, or returns `true` to reach every part that reads the key.
 */
type Reader<Value, View> = {
  values: (part: View) => readonly string[]
  moved: (
    previous: Value,
    next: Value,
    notify: (name: string) => void
  ) => boolean | void
}

type Reads<State, Api, Props> = {
  [Key in keyof State]?:
    | readonly Selected<State, Key>[]
    | ((part: {
        id: string
        key: string
        props: Props
        api: Api
      }) => readonly Selected<State, Key>[])
    | Reader<State[Key], { id: string; key: string; props: Props; api: Api }>
}

type Moved = (
  previous: unknown,
  next: unknown,
  notify: (name: any) => void
) => boolean | void

const isReader = (values: unknown): values is Reader<any, any> =>
  typeof values === "object" && values !== null && !Array.isArray(values)

// A store's selectors, which hear one value of one key, by key, then value.
// Values that print the same share a selector, which only costs a spare run.
// One is its only listener until a second joins it: a long list has two an item.
type Narrowed = {
  selectors: Map<PropertyKey, Map<string, Listener | Set<Listener>>>
  // The keys anything selects on, so a change to a key nobody selects on,
  // like a filtered list on every keystroke, compares nothing. Readers of one
  // key keep their own `moved`, with the parts a `true` from it reaches.
  selecting: Map<PropertyKey, Map<Moved, Mover>>
}

// How many selectors and readers hold a key's `moved`, and the readers.
type Mover = { held: number; naming: Set<Listener> }

const narrowedStores = new WeakMap<Store<any>, Narrowed>()

// The store's selectors, installed as its fanout the first time anything
// selects on it.
function narrowedOf(store: Store<any>) {
  const found = narrowedStores.get(store)
  if (found) {
    return found
  }
  const narrowed: Narrowed = {
    selectors: new Map(),
    selecting: new Map(),
  }
  narrowedStores.set(store, narrowed)
  store.setFanout((changed, previous, liveOnly, delivered) => {
    const state = store.get()
    const keys = changed as readonly string[]
    let activeSelectors: Map<string, Listener | Set<Listener>> | undefined
    const notify = (value: unknown) => {
      const selector = activeSelectors?.get(String(value))
      if (typeof selector === "function") {
        selector(liveOnly, delivered, keys)
      } else if (selector) {
        for (const listener of selector) {
          listener(liveOnly, delivered, keys)
        }
      }
    }
    for (let index = 0; index < changed.length; index++) {
      const key = changed[index]
      const movers = narrowed.selecting.get(key)
      if (!movers) {
        continue
      }
      activeSelectors = narrowed.selectors.get(key)
      const before = (previous as Record<PropertyKey, unknown>)[key]
      for (const [moved, { naming }] of movers) {
        if (moved(before, state[key], notify) === true) {
          for (const listener of naming) {
            listener(liveOnly, delivered, keys)
          }
        }
      }
    }
  })
  return narrowed
}

// Encodes one selected value unambiguously so strings, numbers and lists never collide.
function encodeSelected(value: unknown) {
  if (typeof value === "string") {
    return `s${value.length}:${value}`
  }
  if (typeof value === "number") {
    return `n:${value}`
  }
  if (typeof value === "boolean") {
    return value ? "t" : "f"
  }
  if (value === null) {
    return "0"
  }
  if (value === undefined) {
    return "u"
  }
  return `o:${String(value)}`
}

/**
 * Narrows which changes reach a slot's parts. Each key maps to the values a
 * part reads it by comparing with, like `highlighted === key`: a change to
 * the key reaches the part only when the key takes or leaves one of them. A
 * key that holds an array is read by membership, like `panels.includes(key)`:
 * the part hears when one of its values joins or leaves the array. A key that
 * holds a plain object is read by entry, like `values[key]`: the part hears
 * when an entry its values name is added, removed or changed. A fixed list
 * holds values every part of the slot shares, and an empty one means the
 * part never reads the key. Changes to every other key reach every part. A
 * key read any other way must not be listed: the part would miss changes.
 * Each primitive with `selects` has a test that proves it.
 * @stable
 */
function selects<State extends object, Api, Props>(
  reads: NoInfer<Reads<State, Api, Props>>
) {
  type View = { id: string; key: string; props: Props; api: Api }
  type Values = readonly Selected<State, keyof State>[]
  type Entry = [
    keyof State,
    Values | ((part: View) => Values) | Reader<unknown, View>,
  ]
  const narrowing = (Object.entries(reads) as Entry[]).filter(
    ([, values]) =>
      isReader(values) ||
      typeof values === "function" ||
      (values as Values).length > 0
  )
  const valuesOf = (values: Entry[1], partView: View) =>
    (isReader(values)
      ? values.values(partView)
      : typeof values === "function"
        ? values(partView)
        : values) as Values
  const moverOf = (key: keyof State) => {
    const reader = reads[key]
    return isReader(reader) ? (reader.moved as Moved) : eachMoved
  }
  const formatValues = (values: Values) => {
    let out = `${values.length}:`
    for (let index = 0; index < values.length; index++) {
      if (index) {
        out += ","
      }
      out += encodeSelected(values[index])
    }
    return out
  }
  const staticKey = !narrowing.length
    ? ""
    : narrowing.every(([, values]) => Array.isArray(values))
      ? narrowing
          .map(
            ([key, values]) =>
              `${String(key)}=${formatValues(values as Values)}`
          )
          .join("|")
      : undefined
  return {
    /**
     * The values a part reads `key` by, an empty list for a key it never
     * reads, or nothing for a key it reads whole: one it doesn't list, or one
     * read by name, since only its reader knows what a change reaches.
     */
    reading(part: Part<State, Api, Props>, props: Props, key: string) {
      const values = Object.hasOwn(reads, key)
        ? (reads[key as keyof State] as Entry[1] | undefined)
        : undefined
      if (values === undefined || isReader(values)) {
        return undefined
      }
      const list: readonly unknown[] =
        typeof values === "function"
          ? values(view(part, props))
          : (values as Values)
      return list
    },
    /** The values a part selects on, which it subscribes again for when they change. */
    selection(part: Part<State, Api, Props>, props: Props) {
      if (staticKey !== undefined) {
        return staticKey
      }
      const partView = view(part, props)
      let out = ""
      for (let index = 0; index < narrowing.length; index++) {
        const [key, source] = narrowing[index]
        if (index) {
          out += "|"
        }
        out += `${String(key)}=${formatValues(valuesOf(source, partView))}`
      }
      return out
    },
    /**
     * Runs `listener` when a change can affect the part: a key it selects on
     * took or left one of its values, or any other key changed. Every part of
     * the slot skips the listed keys as one group.
     */
    subscribe(part: Part<State, Api, Props>, listener: Listener, props: Props) {
      const { store } = part
      const leaveSkipping = subscribeSkipping(store, reads, listener)
      if (!narrowing.length) {
        return leaveSkipping
      }
      const narrowed = narrowedOf(store)
      const partView = view(part, props)
      const joined: [keyof State, Values, Moved][] = []
      for (let index = 0; index < narrowing.length; index++) {
        const [key, source] = narrowing[index]
        const values = valuesOf(source, partView)
        const moved = moverOf(key)
        joined.push([key, values, moved])
        for (let i = 0; i < values.length; i++) {
          enter(narrowed, key, values[i], listener, moved)
        }
        if (moved !== eachMoved) {
          hold(narrowed, key, moved, listener)
        }
      }
      let subscribed = true
      return () => {
        if (!subscribed) {
          return
        }
        subscribed = false
        leaveSkipping()
        for (let index = 0; index < joined.length; index++) {
          const [key, values, moved] = joined[index]
          for (let i = 0; i < values.length; i++) {
            leave(narrowed, key, values[i], listener, moved)
          }
          if (moved !== eachMoved) {
            release(narrowed, key, moved, listener)
          }
        }
      }
    },
  }
}

type Selects<State extends object, Api, Props> = ReturnType<
  typeof selects<State, Api, Props>
>

/**
 * Runs `listener` when `key` takes `value` or leaves it, for an array, when
 * `value` joins it or leaves it, and for a plain object, when its entry named
 * `value` is added, removed or changed.
 */
function select<State extends object, Key extends keyof State>(
  store: Store<State>,
  key: Key,
  value: Selected<State, Key>,
  listener: Listener
) {
  const narrowed = narrowedOf(store)
  enter(narrowed, key, value, listener, eachMoved)
  let selecting = true
  return () => {
    if (selecting) {
      selecting = false
      leave(narrowed, key, value, listener, eachMoved)
    }
  }
}

// Adds `listener` to the selector of one value of `key`, which holds the
// key's `moved` while it's there.
function enter(
  narrowed: Narrowed,
  key: PropertyKey,
  value: unknown,
  listener: Listener,
  moved: Moved
) {
  hold(narrowed, key, moved)
  let selectors = narrowed.selectors.get(key)
  if (!selectors) {
    narrowed.selectors.set(key, (selectors = new Map()))
  }
  const name = String(value)
  const selector = selectors.get(name)
  if (!selector) {
    selectors.set(name, listener)
  } else if (typeof selector === "function") {
    if (selector !== listener) {
      selectors.set(name, new Set([selector, listener]))
    }
  } else {
    selector.add(listener)
  }
}

function leave(
  narrowed: Narrowed,
  key: PropertyKey,
  value: unknown,
  listener: Listener,
  moved: Moved
) {
  const selectors = narrowed.selectors.get(key)
  const name = String(value)
  const selector = selectors?.get(name)
  if (selector === listener) {
    selectors!.delete(name)
  } else if (typeof selector === "object") {
    selector.delete(listener)
    if (!selector.size) {
      selectors!.delete(name)
    }
  }
  if (selectors && !selectors.size) {
    narrowed.selectors.delete(key)
  }
  release(narrowed, key, moved)
}

// Keeps `moved` comparing a key's changes, for a selector, or for `reader`,
// a part its `true` reaches.
function hold(
  { selecting }: Narrowed,
  key: PropertyKey,
  moved: Moved,
  reader?: Listener
) {
  let movers = selecting.get(key)
  if (!movers) {
    selecting.set(key, (movers = new Map()))
  }
  let mover = movers.get(moved)
  if (!mover) {
    movers.set(moved, (mover = { held: 0, naming: new Set() }))
  }
  mover.held++
  if (reader) {
    mover.naming.add(reader)
  }
}

function release(
  { selecting }: Narrowed,
  key: PropertyKey,
  moved: Moved,
  reader?: Listener
) {
  const movers = selecting.get(key)
  const mover = movers?.get(moved)
  if (!movers || !mover) {
    return
  }
  if (reader) {
    mover.naming.delete(reader)
  }
  if (--mover.held) {
    return
  }
  movers.delete(moved)
  if (!movers.size) {
    selecting.delete(key)
  }
}

// Runs `notify` for the value a key left and the one it took, for an array,
// for every value that may have joined or left it, and for a plain object,
// for the name of every entry added, removed or changed. A null or undefined
// array or record is an empty one. Arrays mostly change by a value or two in
// place, like a tab panel mounting, so their common start and end are
// skipped, and every value between is notified. One that only moved, or
// that's there twice, costs a spare run.
function eachMoved(
  before: unknown,
  after: unknown,
  notify: (value: unknown) => void
) {
  if (before == null) {
    before = emptyLike(after, before)
  } else if (after == null) {
    after = emptyLike(before, after)
  }
  if (isRecord(before) && isRecord(after)) {
    // Own entries only, so one named like an inherited property, like
    // `constructor`, counts as added or removed. No merged copy of both, since
    // a record can hold an entry per item of a long list.
    for (const name in before) {
      if (
        !Object.hasOwn(after, name) ||
        !Object.is(before[name], after[name])
      ) {
        notify(name)
      }
    }
    for (const name in after) {
      if (!Object.hasOwn(before, name)) {
        notify(name)
      }
    }
    return
  }
  if (!Array.isArray(before) || !Array.isArray(after)) {
    notify(before)
    notify(after)
    return
  }
  let start = 0
  let end = 0
  while (start < before.length && before[start] === after[start]) {
    start++
  }
  while (
    end < before.length - start &&
    end < after.length - start &&
    before[before.length - 1 - end] === after[after.length - 1 - end]
  ) {
    end++
  }
  for (let index = start; index < before.length - end; index++) {
    notify(before[index])
  }
  for (let index = start; index < after.length - end; index++) {
    notify(after[index])
  }
}

// Objects made as literals, not arrays, dates or class instances.
const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && Object.getPrototypeOf(value) === Object.prototype

const noItems: readonly unknown[] = []
const noEntries: Record<string, unknown> = {}

// What a missing value stands for beside `other`: an empty array or record
// of its shape, or itself beside any other value.
const emptyLike = (other: unknown, missing: unknown) =>
  Array.isArray(other) ? noItems : isRecord(other) ? noEntries : missing

export { eachMoved, select, selects, type Reader, type Selects }
