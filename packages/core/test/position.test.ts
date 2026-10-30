import { describe, expect, test } from "vitest"
import { arrowOffset, computePlacement, exactSize, untransformed } from "../src/foundation/platform/position"

const viewport = { width: 1000, height: 800 }
const size = { width: 200, height: 300 }
const options = {
  side: "bottom" as const,
  align: "start" as const,
  sideOffset: 4,
  alignOffset: 0,
  collisionPadding: 8,
}

describe("placement", () => {
  test("opens below the anchor, lined up with its start", () => {
    const result = computePlacement({ x: 100, y: 100, width: 80, height: 30 }, size, viewport, options)
    expect(result).toMatchObject({ x: 100, y: 134, side: "bottom" })
  })

  test("flips above when there is no room below", () => {
    const result = computePlacement({ x: 100, y: 700, width: 80, height: 30 }, size, viewport, options)
    expect(result).toMatchObject({ y: 396, side: "top" })
  })

  test("stays below when neither side fits but below has more room", () => {
    const result = computePlacement(
      { x: 100, y: 300, width: 80, height: 30 },
      { width: 200, height: 700 },
      viewport,
      options,
    )
    expect(result.side).toBe("bottom")
  })

  test("shifts along the anchor to stay on screen", () => {
    const result = computePlacement({ x: 950, y: 100, width: 40, height: 30 }, size, viewport, options)
    expect(result.x).toBe(1000 - 200 - 8)
  })

  test("submenus flip to the left when there is no room on the right", () => {
    const result = computePlacement({ x: 850, y: 100, width: 120, height: 30 }, size, viewport, {
      ...options,
      side: "right",
      sideOffset: 0,
    })
    expect(result).toMatchObject({ x: 650, side: "left" })
  })

  test("start means the right edge in right-to-left layouts", () => {
    const result = computePlacement({ x: 500, y: 100, width: 80, height: 30 }, size, viewport, {
      ...options,
      rtl: true,
    })
    expect(result.x).toBe(580 - 200)
  })

  test("reports the space left below for sizing", () => {
    const result = computePlacement({ x: 100, y: 100, width: 80, height: 30 }, size, viewport, options)
    expect(result.available.height).toBe(800 - 8 - 134)
  })

  test("leaves with an anchor scrolled off screen instead of staying behind at the edge", () => {
    const result = computePlacement({ x: -600, y: 100, width: 80, height: 30 }, size, viewport, options)
    expect(result.x).toBe(-600 + 80)
  })

  test("keeps an alignOffset that takes it past the anchor when it fits", () => {
    const result = computePlacement({ x: 100, y: 100, width: 80, height: 30 }, size, viewport, {
      ...options,
      alignOffset: 200,
    })
    expect(result.x).toBe(300)
  })

  test("keeps to the part of the page a pinch zoom shows", () => {
    const zoomed = { x: 640, y: 200, width: 640, height: 400 }
    const result = computePlacement({ x: 1100, y: 300, width: 80, height: 30 }, size, zoomed, options)
    expect(result).toMatchObject({ x: 640 + 640 - 200 - 8, side: "bottom" })
    expect(result.available.height).toBe(200 + 400 - 8 - 334)
    const flipped = computePlacement({ x: 1100, y: 500, width: 80, height: 30 }, size, zoomed, options)
    expect(flipped).toMatchObject({ y: 500 - 4 - 300, side: "top" })
  })
})

describe("arrow offset", () => {
  const popup = { x: 100, y: 200, width: 200, height: 80 }

  test("is where the anchor's center falls along the edge facing it", () => {
    expect(arrowOffset({ x: 150, y: 150, width: 40, height: 20 }, popup, "bottom", 6)).toBe(70)
    expect(arrowOffset({ x: 20, y: 220, width: 40, height: 20 }, popup, "right", 6)).toBe(30)
  })

  test("stays arrowPadding away from the corners", () => {
    expect(arrowOffset({ x: 0, y: 150, width: 20, height: 20 }, popup, "bottom", 6)).toBe(6)
    expect(arrowOffset({ x: 400, y: 150, width: 20, height: 20 }, popup, "top", 6)).toBe(194)
  })
})

describe("untransformed box", () => {
  const style = (
    transformOrigin: string,
    translate = "none",
    scale = "none",
    transform = "none",
    rotate = "none",
  ) => ({ transformOrigin, translate, scale, transform, rotate })

  test("a box at rest is where it is", () => {
    expect(
      untransformed({ x: 10, y: 20, width: 100, height: 50 }, { width: 100, height: 50 }, style("50px 0px")),
    ).toEqual({ x: 10, y: 20, scale: { x: 1, y: 1 } })
  })

  test("a box scaling in around its top center moves back by the scale", () => {
    // 95% of 100 wide, scaled around x = 50, starts 2.5px to the right.
    const box = untransformed(
      { x: 12.5, y: 20, width: 95, height: 47.5 },
      { width: 100, height: 50 },
      style("50px 0px", "none", "0.95"),
    )
    expect(box.x).toBeCloseTo(10)
    expect(box.y).toBeCloseTo(20)
    expect(box.scale).toEqual({ x: 1, y: 1 })
  })

  test("a scale from a transform matrix counts as its own, and so does its move", () => {
    const box = untransformed(
      { x: 12.5, y: 28, width: 95, height: 47.5 },
      { width: 100, height: 50 },
      style("50px 0px", "none", "none", "matrix(0.95, 0, 0, 0.95, 0, 8)"),
    )
    expect(box.x).toBeCloseTo(10)
    expect(box.y).toBeCloseTo(20)
  })

  test("a box scaled by something around it reports that scale", () => {
    // CSS zoom on an ancestor shows a 200 wide box 300 wide, offsets included.
    const box = untransformed(
      { x: 150, y: 90, width: 300, height: 180 },
      { width: 200, height: 120 },
      style("100px 0px"),
    )
    expect(box).toEqual({ x: 150, y: 90, scale: { x: 1.5, y: 1.5 } })
  })

  test("a box with a fractional size isn't scaled", () => {
    // offsetHeight rounds 41.6 up to 42.
    const box = untransformed(
      { x: 10, y: 20, width: 100, height: 41.6 },
      { width: 100, height: 42 },
      style("50px 20.8px"),
    )
    expect(box).toEqual({ x: 10, y: 20, scale: { x: 1, y: 1 } })
  })

  test("a turned box is its own transform, not one scaled around it", () => {
    // 100 by 50 at 10,20, turned a quarter around its top left corner.
    const turned = { x: -40, y: 20, width: 50, height: 100 }
    const expected = { x: 10, y: 20, scale: { x: 1, y: 1 } }
    const byRotate = untransformed(
      turned,
      { width: 100, height: 50 },
      style("0px 0px", "none", "none", "none", "90deg"),
    )
    const byMatrix = untransformed(
      turned,
      { width: 100, height: 50 },
      style("0px 0px", "none", "none", "matrix(0, 1, -1, 0, 0, 0)"),
    )
    for (const box of [byRotate, byMatrix]) {
      expect(box.x).toBeCloseTo(expected.x)
      expect(box.y).toBeCloseTo(expected.y)
      expect(box.scale).toEqual(expected.scale)
    }
  })

  test("a box tilted around x or y is squashed by its own turn, not scaled around it", () => {
    // 100 by 50 at 10,20, tilted 60 degrees around its top edge, shows half as tall.
    for (const rotate of ["x 60deg", "1 0 0 60deg"]) {
      const box = untransformed(
        { x: 10, y: 20, width: 100, height: 25 },
        { width: 100, height: 50 },
        style("0px 0px", "none", "none", "none", rotate),
      )
      expect(box.x).toBeCloseTo(10)
      expect(box.y).toBeCloseTo(20)
      expect(box.scale).toEqual({ x: 1, y: 1 })
    }
  })

  test("a box sliding in moves back by its translate, in pixels or percent of its size", () => {
    expect(
      untransformed(
        { x: 10, y: 28, width: 100, height: 50 },
        { width: 100, height: 50 },
        style("0px 0px", "0px 8px"),
      ).y,
    ).toBe(20)
    expect(
      untransformed(
        { x: 60, y: 20, width: 100, height: 50 },
        { width: 100, height: 50 },
        style("0px 0px", "50%"),
      ).x,
    ).toBe(10)
  })
})

describe("exact size", () => {
  const computed = (values: Record<string, string>) => ({
    boxSizing: values["box-sizing"] ?? "content-box",
    width: values.width ?? "",
    height: values.height ?? "",
    getPropertyValue: (name: string) => values[name] ?? "",
  })

  test("is the border box before offsets round it", () => {
    expect(exactSize(computed({ width: "200px", height: "17.4px" }), { width: 200, height: 17 })).toEqual({
      width: 200,
      height: 17.4,
    })
    const padded = computed({
      width: "180px",
      height: "40px",
      "padding-top": "0.8px",
      "padding-bottom": "0.8px",
    })
    expect(exactSize(padded, { width: 180, height: 42 }).height).toBeCloseTo(41.6)
    const bordered = computed({
      "box-sizing": "border-box",
      width: "200px",
      height: "41.6px",
      "padding-top": "8px",
    })
    expect(exactSize(bordered, { width: 200, height: 42 }).height).toBe(41.6)
  })

  test("is the offsets when styles don't give it", () => {
    expect(exactSize(computed({ width: "auto" }), { width: 120, height: 30 })).toEqual({
      width: 120,
      height: 30,
    })
  })
})
