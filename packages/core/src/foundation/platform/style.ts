// Sets one style property, and puts back what was there on release, unless
// something else changed it since.
function setStyle(el: HTMLElement, name: string, value: string) {
  const previous = el.style.getPropertyValue(name)
  const priority = el.style.getPropertyPriority(name)
  el.style.setProperty(name, value)
  const ours = el.style.getPropertyValue(name)
  return () => {
    if (el.style.getPropertyValue(name) !== ours) return
    if (previous) el.style.setProperty(name, previous, priority)
    else el.style.removeProperty(name)
  }
}

const registered = new Set<string>()

// Registers custom properties that don't inherit, so one written on every
// frame restyles only the element it's on, not everything inside it. The
// registration covers the whole page and can't be undone, so a page that
// needs a name to inherit registers it first, and its registration stands
// (an `@property` rule doesn't: a registration in script wins).
function registerUninherited(names: readonly string[]) {
  if (typeof CSS === "undefined" || !CSS.registerProperty) return
  for (const name of names) {
    if (registered.has(name)) continue
    registered.add(name)
    try {
      CSS.registerProperty({ name, syntax: "*", inherits: false })
    } catch {
      // The page registered it first, and its registration stands.
    }
  }
}

// A hidden element shows again when a class sets `display`, like a utility
// some CSS frameworks emit without a `[hidden]` guard. One rule per document,
// in the lowest cascade layer but important, so it wins over author classes
// the way the attribute means, and `hidden="until-found"` keeps the browser's
// searchable hiding.
function enforceHidden(doc: Document) {
  const id = "ui-sdk-hidden"
  if (doc.getElementById(id)) return
  const style = doc.createElement("style")
  style.id = id
  style.textContent =
    '@layer ui-sdk { :where([data-slot][hidden]:not([hidden="until-found"])) { display: none !important } }'
  doc.head.prepend(style)
}

export { enforceHidden, registerUninherited, setStyle }
