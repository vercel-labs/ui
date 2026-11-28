// Attributes core writes to a bound element itself, so a change to them
// re-renders nothing: a slot's `live` attributes, and its `direct` ones.
import {
  attrs,
  authorOwned,
  liveAttrs,
  madeLabel,
  references,
  subscribe,
} from "./part"
import type { Attrs, Part } from "./primitive-types"

/**
 * Attributes from live state, written straight to the bound element on every
 * change, without a render. A slot's `live`, like
 * `live((state, { key }) => ({ "data-highlighted": … }))`.
 * @stable
 */
function live<State extends object, Api, Props>(
  read: NoInfer<
    (
      state: State,
      part: { id: string; key: string; props: Props; api: Api }
    ) => Attrs
  >
) {
  return {
    read,
    /**
     * Writes the attributes to `el` now and on every change the part hears.
     * Returns the cleanup, which removes them again.
     */
    attach(part: Part<State, Api, Props>, el: HTMLElement) {
      const channel = `live:${part.id}`
      const write = () => applyAttrs(el, liveAttrs(part), channel)
      write()
      const unsubscribe = subscribe(part, write)
      // An element the part lets go of, like a button moved out of a tab,
      // keeps none of them. A part that binds it again writes them again.
      return () => {
        unsubscribe()
        applyAttrs(el, {}, channel)
      }
    },
  }
}

type Live<State extends object, Api, Props> = ReturnType<
  typeof live<State, Api, Props>
>

/**
 * Attributes of `attrs` that core keeps current on an element a framework
 * rendered, so a change to only these doesn't re-render the part. Unlike
 * `live`, they render too, on the server and on every render. Like `hidden`
 * on an option: a keystroke can hide hundreds, and rendering each one cost
 * more than the filter. A slot's `direct`, like `direct(["hidden"])`.
 * @stable
 */
function direct(names: readonly string[]) {
  const written = new WeakMap<HTMLElement, Map<string, string>>()
  return {
    names,
    /** Keeps the attributes current on `el` on every change the part hears. Returns the cleanup. */
    attach: (part: Part, el: HTMLElement) => {
      // What the part last had, so dropping a value removes only that, not
      // one the framework merged in, like a Field's label on a trigger.
      let last = attrs(part)
      // A framework that reuses the element for another key never saw what
      // this slot wrote for the last one, so what the new key lacks goes.
      let own = written.get(el)
      if (own) {
        for (const [name, value] of own) {
          if (last[name] === undefined && el.getAttribute(name) === value) {
            el.removeAttribute(name)
          }
        }
        own.clear()
      }
      const sync = (values: Attrs) => {
        for (let index = 0; index < names.length; index++) {
          const name = names[index]
          const value = values[name]
          if (value === undefined) {
            if (
              last[name] !== undefined &&
              el.getAttribute(name) === last[name]
            ) {
              el.removeAttribute(name)
            }
            continue
          }
          const current = el.getAttribute(name)
          if (current === value) {
            continue
          }
          // An author's name or hint, rendered in place of the part's, stays.
          if (
            authorOwned.has(name) &&
            current !== null &&
            current !== last[name]
          ) {
            continue
          }
          el.setAttribute(name, value)
          if (!own) {
            written.set(el, (own = new Map()))
          }
          own.set(name, value)
        }
        last = values
      }
      // Vue hydrates a part from the vnode it rendered before a sibling bound
      // and changed what it reads, so the element can start out behind.
      sync(last)
      return subscribe(part, () => sync(attrs(part)))
    },
  }
}

type Direct = ReturnType<typeof direct>

const applied = new WeakMap<HTMLElement, Record<string, Map<string, string>>>()
const found = new WeakMap<HTMLElement, Record<string, Map<string, string>>>()
let writing: HTMLElement | undefined

/**
 * Writes attributes and removes the ones a previous call wrote but this one
 * doesn't. Attributes it never wrote, like an author's own, stay, and so do
 * an id and an author's name, description or typing hints it didn't write,
 * like a translated `aria-label`. `channel` keeps render and live attributes, and two
 * components sharing one element (a tooltip on a popover's trigger), from
 * removing each other's.
 */
function applyAttrs(el: HTMLElement, attrs: Attrs, channel = "render") {
  writeAttrs(el, attrs, channel, false)
}

/**
 * Lets go of an element, like a part leaving its owner: removes what `channel`
 * added, and puts back what it found there, like an author's `disabled`, even
 * where it wrote the same value.
 */
function releaseAttrs(el: HTMLElement, channel: string) {
  writeAttrs(el, {}, channel, true)
}

/**
 * Marks an attribute someone other than a channel just wrote or removed as
 * theirs, even with the value a channel wrote, like `disabled` set again on a
 * checkbox its group disabled, so letting go of the element keeps it as they
 * left it. A channel's own writes, which an observer hears too, change nothing.
 */
function markAuthored(el: HTMLElement, name: string) {
  if (el === writing) {
    return
  }
  for (const written of Object.values(applied.get(el) ?? {})) {
    written.delete(name)
  }
  for (const values of Object.values(found.get(el) ?? {})) {
    values.delete(name)
  }
}

function writeAttrs(
  el: HTMLElement,
  attrs: Attrs,
  channel: string,
  release: boolean
) {
  const outer = writing
  writing = el
  try {
    writeChannel(el, attrs, channel, release)
  } finally {
    writing = outer
  }
}

function writeChannel(
  el: HTMLElement,
  attrs: Attrs,
  channel: string,
  release: boolean
) {
  let channels = applied.get(el)
  const previous = channels?.[channel]
  let hasDefined = false
  let hasAuthorOwned = false
  for (const name in attrs) {
    if (attrs[name] !== undefined) {
      hasDefined = true
      if (authorOwned.has(name)) {
        hasAuthorOwned = true
      }
    }
  }
  if (!previous && !hasDefined) {
    if (release) {
      delete found.get(el)?.[channel]
    }
    return
  }
  if (!channels) {
    applied.set(el, (channels = {}))
  }
  const written = new Map<string, string>()
  const styles =
    attrs.style === undefined ? undefined : styleDeclarations(attrs.style)
  if (styles) {
    for (let index = 0; index < styles.length; index++) {
      written.set(`style:${styles[index][0]}`, styles[index][1])
    }
  }
  for (const name in attrs) {
    const value = attrs[name]
    if (value !== undefined && name !== "style") {
      written.set(name, value)
    }
  }
  // Only a channel that writes an id, or wrote one, reads the element's, so
  // live attributes and parts without an id cost no extra read per change.
  const id =
    written.has("id") || previous?.has("id") ? el.getAttribute("id") : null
  const keeps = keepsId(id, channels, channel)
  if (keeps) {
    written.delete("id")
  }
  if (!hasAuthorOwned && previous) {
    for (const name of previous.keys()) {
      if (authorOwned.has(name)) {
        hasAuthorOwned = true
        break
      }
    }
  }
  // A value no channel wrote, and not the part's own, like a copied
  // component's, is the author's, even when set after the part wrote its own.
  let authors: Set<string> | undefined
  let read: Map<string, string | null> | undefined
  if (hasAuthorOwned) {
    authors = new Set<string>()
    read = new Map<string, string | null>()
    const checkAuthor = (name: string) => {
      if (!authorOwned.has(name) || read!.has(name)) {
        return
      }
      const current = el.getAttribute(name)
      read!.set(name, current)
      if (
        current === null ||
        current === written.get(name) ||
        (name === "aria-labelledby" && madeLabel(current))
      ) {
        return
      }
      for (const key in channels) {
        if (channels[key].get(name) === current) {
          return
        }
      }
      authors!.add(name)
    }
    for (const name of written.keys()) {
      checkAuthor(name)
    }
    if (previous) {
      for (const name of previous.keys()) {
        checkAuthor(name)
      }
    }
    for (const name of authors) {
      written.delete(name)
    }
  }
  if (previous) {
    for (const name of previous.keys()) {
      if (written.has(name) || authors?.has(name) || (name === "id" && keeps)) {
        continue
      }
      if (name.startsWith("style:")) {
        el.style.removeProperty(name.slice(6))
        continue
      }
      if (!release) {
        el.removeAttribute(name)
        keepFound(el, channel, name, null)
        continue
      }
      // One changed since the channel last wrote it, or removed, is the author's.
      const current = el.getAttribute(name)
      if (current !== previous.get(name)) {
        continue
      }
      const original = found.get(el)?.[channel]?.get(name)
      if (original === undefined) {
        el.removeAttribute(name)
      } else if (current !== original) {
        el.setAttribute(name, original)
      }
    }
  }
  if (styles) {
    for (let index = 0; index < styles.length; index++) {
      const [property, value] = styles[index]
      if (el.style.getPropertyValue(property) !== value) {
        el.style.setProperty(property, value)
      }
    }
  }
  for (const name in attrs) {
    const value = attrs[name]
    if (value === undefined || !written.has(name)) {
      continue
    }
    const current =
      name === "id"
        ? id
        : read?.has(name)
          ? read.get(name)
          : el.getAttribute(name)
    if (current !== (previous?.get(name) ?? null)) {
      keepFound(el, channel, name, current)
    }
    if (current === value) {
      continue
    }
    // A text field shows its value property. The attribute is only the default,
    // and setting it before anyone types replaces the text with the caret at
    // the start, so the property goes first, as every framework writes it.
    if (name === "value" && isTextField(el) && el.value !== value) {
      el.value = value
    }
    el.setAttribute(name, value)
  }
  if (written.size) {
    channels[channel] = written
  } else {
    delete channels[channel]
  }
  if (release) {
    delete found.get(el)?.[channel]
  }
}

// What was on the element before the channel wrote over it, which letting go
// puts back. A copied component's ids, and references to them, never come back.
function keepFound(
  el: HTMLElement,
  channel: string,
  name: string,
  value?: string | null
) {
  const kept =
    value == null || name === "id"
      ? undefined
      : references.includes(name)
        ? authoredIds(value)
        : value
  if (kept === undefined) {
    return void found.get(el)?.[channel]?.delete(name)
  }
  let channels = found.get(el)
  if (!channels) {
    found.set(el, (channels = {}))
  }
  ;(channels[channel] ??= new Map()).set(name, kept)
}

const authoredIds = (ids: string) =>
  ids
    .split(/\s+/)
    .filter((id) => id && !id.startsWith("ui-sdk-"))
    .join(" ") || undefined

// An id a channel didn't write stays: an author's, a script's, or another
// component's on the same element. The exception is an id ui-sdk made (every
// instance id it makes starts with `ui-sdk-`) that no channel here wrote, like
// one a copied component carries, so a copy never repeats the original's ids.
// It's read with `getAttribute`, since a form's `id` property is a control
// named "id".
function keepsId(
  id: string | null,
  channels: Record<string, Map<string, string>>,
  channel: string
) {
  if (id === null || id === channels[channel]?.get("id")) {
    return false
  }
  if (!id.startsWith("ui-sdk-")) {
    return true
  }
  for (const key in channels) {
    if (channels[key].get("id") === id) {
      return true
    }
  }
  return false
}

// A file input's value can only be cleared, so it keeps the attribute alone.
const isTextField = (
  el: HTMLElement
): el is HTMLInputElement | HTMLTextAreaElement =>
  el.localName === "textarea" ||
  (el.localName === "input" && (el as HTMLInputElement).type !== "file")

function styleDeclarations(css: string) {
  const declarations: [string, string][] = []
  for (const declaration of css.split(";")) {
    const index = declaration.indexOf(":")
    if (index > 0) {
      declarations.push([
        declaration.slice(0, index).trim(),
        declaration.slice(index + 1).trim(),
      ])
    }
  }
  return declarations
}

export {
  applyAttrs,
  direct,
  type Direct,
  live,
  type Live,
  markAuthored,
  releaseAttrs,
}
