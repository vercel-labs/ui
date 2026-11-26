import { expect, test, vi } from "vitest"
import { createAsyncOptions } from "../src/foundation/lists/async-options"

test("text an input method is still composing loads once it's committed", async () => {
  vi.useFakeTimers()
  const asked: string[] = []
  const options = createAsyncOptions(
    (query: string) => {
      asked.push(query)
      return Promise.resolve([query])
    },
    { debounce: 0 }
  )
  options.setQuery("とうk", { composing: true })
  options.setQuery("東京", { composing: true })
  await vi.advanceTimersByTimeAsync(10)
  expect(asked).toEqual([])
  expect(options.getState().status).toBe("idle")
  options.setQuery("東京", { composing: false })
  await vi.advanceTimersByTimeAsync(10)
  expect(asked).toEqual(["東京"])
  vi.useRealTimers()
})
