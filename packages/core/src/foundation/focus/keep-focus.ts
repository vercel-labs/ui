// Focus that follows an element a framework moves or renders anew.

/**
 * Focuses the element `element()` returns if focus fell to the page, a
 * microtask and a task from now. A focused element that a framework moves,
 * or renders as a new element in another place, loses focus: React puts it
 * back after its commit, plain DOM code doesn't, and other frameworks render
 * a microtask later, or a task later. Call it after a keyboard move.
 * @stable
 */
function keepFocus(element: () => HTMLElement | undefined) {
  const restore = () => {
    const el = element()
    const active = el?.ownerDocument.activeElement
    if (
      el &&
      active !== el &&
      (!active || active === el.ownerDocument.body || !active.isConnected)
    ) {
      el.focus()
    }
  }
  queueMicrotask(restore)
  setTimeout(restore)
}

export { keepFocus }
