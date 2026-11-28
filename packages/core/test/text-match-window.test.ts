import { afterEach, expect, test, vi } from "vitest"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

// React Native sets a global `window` with no events.
test("text matching works with a global window that has no events", async () => {
  vi.stubGlobal("window", {})
  const { fuzzyScore, matchRanges } =
    await import("../src/foundation/text/text-match")
  expect(fuzzyScore("Settings", "set")).toBeGreaterThan(0)
  expect(matchRanges("Settings", "set", "startsWith")).toEqual([
    { start: 0, end: 3 },
  ])
})
