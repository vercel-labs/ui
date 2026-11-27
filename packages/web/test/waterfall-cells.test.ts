// @vitest-environment jsdom
import { beforeAll, expect, test, vi } from "vitest"
import { defineWaterfallElements } from "../src/waterfall"

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  defineWaterfallElements()
})

test("a row with two cells, one with an id, binds each without a warning", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
  document.body.innerHTML = `
    <ui-waterfall aria-label="Requests">
      <ui-waterfall-row value="doc">
        <ui-waterfall-row-header>/</ui-waterfall-row-header>
        <ui-waterfall-cell>html</ui-waterfall-cell><ui-waterfall-cell id="doc-size">14 kB</ui-waterfall-cell>
        <ui-waterfall-bar></ui-waterfall-bar>
      </ui-waterfall-row>
    </ui-waterfall>`
  const waterfall = document.body.firstElementChild as HTMLElement & {
    items: unknown
  }
  waterfall.items = [{ value: "doc", label: "/", start: 0, duration: 100 }]
  await wait()
  const cells = waterfall.querySelectorAll("ui-waterfall-cell")
  expect(warn.mock.calls.flat().join("\n")).not.toContain("share the key")
  expect([...cells].map((cell) => cell.getAttribute("role"))).toEqual([
    "gridcell",
    "gridcell",
  ])
  expect(cells[1].id).toBe("doc-size")
  warn.mockRestore()
})
