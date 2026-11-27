import { expect, test, vi } from "vitest"
import { createAsyncOptions } from "../src/foundation/lists/async-options"

test("loadMore after a failed or cancelled page asks for that page again", async () => {
  vi.useFakeTimers()
  let fail = false
  const options = createAsyncOptions(
    async (query, { page }) => {
      if (fail) {
        fail = false
        throw new Error("offline")
      }
      return { items: [`${query}-${page}`], hasMore: true }
    },
    { debounce: 0 }
  )
  options.setQuery("x")
  await vi.advanceTimersByTimeAsync(1)
  fail = true
  options.loadMore()
  await vi.advanceTimersByTimeAsync(1)
  expect(options.getState().status).toBe("error")
  options.loadMore()
  await vi.advanceTimersByTimeAsync(1)
  expect(options.getState().items).toEqual(["x-0", "x-1"])
  options.loadMore()
  options.cancel()
  options.loadMore()
  await vi.advanceTimersByTimeAsync(1)
  expect(options.getState().items).toEqual(["x-0", "x-1", "x-2"])
  vi.useRealTimers()
})

test("loadMore after a failed first page for new text loads that text's first page", async () => {
  vi.useFakeTimers()
  let fail = false
  const options = createAsyncOptions(
    async (query, { page }) => {
      if (fail) {
        fail = false
        throw new Error("offline")
      }
      return { items: [`${query}-${page}`], hasMore: true }
    },
    { debounce: 0 }
  )
  options.setQuery("x")
  await vi.advanceTimersByTimeAsync(1)
  options.loadMore()
  await vi.advanceTimersByTimeAsync(1)
  fail = true
  options.setQuery("y")
  await vi.advanceTimersByTimeAsync(1)
  expect(options.getState().status).toBe("error")
  options.loadMore()
  await vi.advanceTimersByTimeAsync(1)
  expect(options.getState().items).toEqual(["y-0"])
  vi.useRealTimers()
})
