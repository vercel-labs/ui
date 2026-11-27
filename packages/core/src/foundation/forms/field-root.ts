// A field's root can keep a slot of its own, like an element it takes with
// `as-child`, so a bound root counts as a field whatever its slot says.
const roots = new WeakSet<Element>()

function holdRoot(el: HTMLElement) {
  roots.add(el)
  return () => roots.delete(el)
}

function fieldOf(el: Element) {
  const slotted = el.closest('[data-slot="field"]')
  for (
    let node: Element | null = el;
    node && node !== slotted;
    node = node.parentElement
  ) {
    if (roots.has(node)) {
      return node
    }
  }
  return slotted
}

export { fieldOf, holdRoot }
