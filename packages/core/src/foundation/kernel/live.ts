// Attributes core writes to a bound element itself, so a change to them
// re-renders nothing: a slot's `live` attributes, and its `direct` ones.
import { attrs, authorOwned, liveAttrs, madeLabel, subscribe } from "./part"
import type { Attrs, Part } from "./primitive-types"

/**
 * Attributes from live state, written straight to the bound element on every
 * change, without a render. A slot's `live`, like
 * `live((state, { key }) => ({ "data-highlighted": … }))`.
 * @stable
 */
function live<State extends object, Api, Props>(
  read: NoInfer<(state: State, part: { id: string; key: string; props: Props; api: Api }) => Attrs>,
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

type Live<State extends object, Api, Props> = ReturnType<typeof live<State, Api, Props>>

/**
 * Attributes of `attrs` that core keeps current on an element a framework
 * rendered, so a change to only these doesn't re-render the part. Unlike
 * `live`, they render too, on the server and on every render. Like `hidden`
 * on an option: a keystroke can hide hundreds, and rendering each one cost
 * more than the filter. A slot's `direct`, like `direct(["hidden"])`.
 * @stable
 */
function direct(names: readonly string[]) {
  return {
    names,
    /** Keeps the attributes current on `el` on every change the part hears. Returns the cleanup. */
    attach: (part: Part, el: HTMLElement) => {
      // What the part last had, so dropping a value removes only that, not
      // one the framework merged in, like a Field's label on a trigger.
      let last = attrs(part)
      return subscribe(part, () => {
        const values = attrs(part)
        for (const name of names) {
          const value = values[name]
          if (value === undefined) {
            if (last[name] !== undefined && el.getAttribute(name) === last[name]) el.removeAttribute(name)
            continue
          }
          const current = el.getAttribute(name)
          if (current === value) continue
          // An author's name or hint, rendered in place of the part's, stays.
          if (authorOwned.has(name) && current !== null && current !== last[name]) continue
          el.setAttribute(name, value)
        }
        last = values
      })
    },
  }
}

type Direct = ReturnType<typeof direct>

const applied = new WeakMap<HTMLElement, Record<string, Map<string, string>>>()

/**
 * Writes attributes and removes the ones a previous call wrote but this one
 * doesn't. Attributes it never wrote, like an author's own, stay, and so do
 * an id and an author's name, description or typing hints it didn't write,
 * like a translated `aria-label`. `channel` keeps render and live attributes, and two
 * components sharing one element (a tooltip on a popover's trigger), from
 * removing each other's.
 */
function applyAttrs(el: HTMLElement, attrs: Attrs, channel = "render") {
  const channels = applied.get(el) ?? {}
  const previous = channels[channel] ?? new Map()
  const written = new Map<string, string>()
  const styles = attrs.style === undefined ? [] : styleDeclarations(attrs.style)
  for (const [property, value] of styles) written.set(`style:${property}`, value)
  for (const [name, value] of Object.entries(attrs))
    if (value !== undefined && name !== "style") written.set(name, value)
  // Only a channel that writes an id, or wrote one, reads the element's, so
  // live attributes and parts without an id cost no extra read per change.
  const id = written.has("id") || previous.has("id") ? el.getAttribute("id") : null
  const keeps = keepsId(id, channels, channel)
  if (keeps) written.delete("id")
  // A value no channel wrote, and not the part's own, like a copied
  // component's, is the author's, even when set after the part wrote its own.
  const authors = new Set<string>()
  const read = new Map<string, string | null>()
  for (const name of new Set([...written.keys(), ...previous.keys()])) {
    if (!authorOwned.has(name)) continue
    const current = el.getAttribute(name)
    read.set(name, current)
    if (
      current === null ||
      current === written.get(name) ||
      (name === "aria-labelledby" && madeLabel(current))
    )
      continue
    if (!Object.values(channels).some((wrote) => wrote.get(name) === current)) authors.add(name)
  }
  for (const name of authors) written.delete(name)
  for (const name of previous.keys()) {
    if (written.has(name) || authors.has(name) || (name === "id" && keeps)) continue
    if (name.startsWith("style:")) el.style.removeProperty(name.slice(6))
    else el.removeAttribute(name)
  }
  for (const [property, value] of styles)
    if (el.style.getPropertyValue(property) !== value) el.style.setProperty(property, value)
  for (const [name, value] of Object.entries(attrs)) {
    if (value === undefined || !written.has(name)) continue
    // A text field shows its value property. The attribute is only the default,
    // and setting it before anyone types replaces the text with the caret at
    // the start, so the property goes first, as every framework writes it.
    if (name === "value" && isTextField(el) && el.value !== value) el.value = value
    const current = name === "id" ? id : read.has(name) ? read.get(name) : el.getAttribute(name)
    if (current !== value) el.setAttribute(name, value)
  }
  channels[channel] = written
  applied.set(el, channels)
}

// An id a channel didn't write stays: an author's, a script's, or another
// component's on the same element. The exception is an id ui-sdk made (every
// instance id it makes starts with `ui-sdk-`) that no channel here wrote, like
// one a copied component carries, so a copy never repeats the original's ids.
// It's read with `getAttribute`, since a form's `id` property is a control
// named "id".
function keepsId(id: string | null, channels: Record<string, Map<string, string>>, channel: string) {
  if (id === null || id === channels[channel]?.get("id")) return false
  return !id.startsWith("ui-sdk-") || Object.values(channels).some((written) => written.get("id") === id)
}

// A file input's value can only be cleared, so it keeps the attribute alone.
const isTextField = (el: HTMLElement): el is HTMLInputElement | HTMLTextAreaElement =>
  el.localName === "textarea" || (el.localName === "input" && (el as HTMLInputElement).type !== "file")

function styleDeclarations(css: string) {
  const declarations: [string, string][] = []
  for (const declaration of css.split(";")) {
    const index = declaration.indexOf(":")
    if (index > 0)
      declarations.push([declaration.slice(0, index).trim(), declaration.slice(index + 1).trim()])
  }
  return declarations
}

export { applyAttrs, direct, type Direct, live, type Live }
