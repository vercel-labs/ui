// Lets the pointer travel from a submenu trigger to its submenu without the
// submenu closing when the path crosses other items.
//
// While a submenu is open, the area between the last pointer position on the
// trigger and the submenu's near edge is "safe". Moves inside it that make
// progress toward the submenu are ignored by the parent menu. If the pointer
// rests inside it, the protection expires so the menu never feels stuck.

type Point = { x: number; y: number }

function createSafeArea({ restTimeout = 300 } = {}) {
  let apex: Point | undefined
  let submenu: HTMLElement | undefined
  let last: Point | undefined
  let restTimer: ReturnType<typeof setTimeout> | undefined
  let expired = false

  return {
    // Call when the pointer leaves the submenu trigger.
    start(point: Point, target: HTMLElement) {
      apex = point
      last = point
      submenu = target
      expired = false
    },
    stop() {
      apex = submenu = last = undefined
      clearTimeout(restTimer)
    },
    // True when the move should be ignored by the parent menu.
    // `onRest` runs if the pointer stops inside the area.
    contains(point: Point, onRest: () => void) {
      if (!apex || !submenu || expired) return false
      const rect = submenu.getBoundingClientRect()
      const right = rect.left >= apex.x
      const edge = right ? rect.left : rect.right
      const inside = inTriangle(point, apex, { x: edge, y: rect.top - 8 }, { x: edge, y: rect.bottom + 8 })
      const progressing = !last || Math.abs(edge - point.x) <= Math.abs(edge - last.x) + 1
      last = point
      clearTimeout(restTimer)
      if (!inside || !progressing) return false
      restTimer = setTimeout(() => {
        expired = true
        onRest()
      }, restTimeout)
      return true
    },
  }
}

function inTriangle(p: Point, a: Point, b: Point, c: Point) {
  const sign = (p1: Point, p2: Point, p3: Point) =>
    (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y)
  const d1 = sign(p, a, b)
  const d2 = sign(p, b, c)
  const d3 = sign(p, c, a)
  const negative = d1 < 0 || d2 < 0 || d3 < 0
  const positive = d1 > 0 || d2 > 0 || d3 > 0
  return !(negative && positive)
}

export { createSafeArea }
