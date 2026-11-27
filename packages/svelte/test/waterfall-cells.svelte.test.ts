import { flushSync, mount, unmount } from "svelte"
import { expect, test, vi } from "vitest"
import App from "./apps/waterfall-cells-app.svelte"

test("a row with two cells, one with an id, binds each without a warning", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
  const app = mount(App, { target: document.body })
  flushSync()
  await new Promise((resolve) => setTimeout(resolve, 10))
  expect(warn.mock.calls.flat().join("\n")).not.toContain("share the key")
  expect(document.querySelector("#doc-size")?.getAttribute("role")).toBe(
    "gridcell"
  )
  unmount(app)
  warn.mockRestore()
})
