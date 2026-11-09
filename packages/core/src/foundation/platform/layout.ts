// An element's place in the page's layout: its border box's offset from the
// start of the offset parent chain, adding each parent's border on the way.
// Offsets come from layout alone, so transforms and scrolling never move them.
function layoutOrigin(el: HTMLElement) {
  let x = 0
  let y = 0
  for (
    let node: HTMLElement | null = el;
    node;
    node = node.offsetParent as HTMLElement | null
  ) {
    x += node.offsetLeft
    y += node.offsetTop
    const parent = node.offsetParent as HTMLElement | null
    if (parent) {
      x += parent.clientLeft
      y += parent.clientTop
    }
  }
  return { x, y }
}

// An element's border box size in layout pixels, keeping the fraction that
// offsetWidth rounds away. Inline elements have no computed size, so they fall
// back to the offsets.
function layoutSize(el: HTMLElement) {
  const style = getComputedStyle(el)
  const total = (...names: string[]) =>
    names.reduce(
      (sum, name) => sum + (parseFloat(style.getPropertyValue(name)) || 0),
      0
    )
  const contentBox = style.boxSizing !== "border-box"
  const width =
    parseFloat(style.width) +
    (contentBox
      ? total(
          "padding-left",
          "padding-right",
          "border-left-width",
          "border-right-width"
        )
      : 0)
  const height =
    parseFloat(style.height) +
    (contentBox
      ? total(
          "padding-top",
          "padding-bottom",
          "border-top-width",
          "border-bottom-width"
        )
      : 0)
  return {
    width: Number.isFinite(width) ? width : el.offsetWidth,
    height: Number.isFinite(height) ? height : el.offsetHeight,
  }
}

// An element's box inside a container's scrollable area: the offset from each
// edge of that area, and the size. What an indicator positioned inside the
// container needs to cover the element.
function layoutBox(el: HTMLElement, container: HTMLElement) {
  const at = layoutOrigin(el)
  const origin = layoutOrigin(container)
  const left = at.x - origin.x - container.clientLeft
  const top = at.y - origin.y - container.clientTop
  const { width, height } = layoutSize(el)
  const area = { width: container.scrollWidth, height: container.scrollHeight }
  return {
    left,
    top,
    width,
    height,
    right: area.width - (left + width),
    bottom: area.height - (top + height),
  }
}

export { layoutBox, layoutOrigin, layoutSize }
