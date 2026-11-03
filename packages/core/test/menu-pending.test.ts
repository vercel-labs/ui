import { describe, expect, test, vi } from "vitest"
import { menu } from "./menu-parts"
import { attrs, partState, press } from "../src/foundation/kernel/part"

const deferred = () => {
  let resolve!: () => void
  let reject!: (reason: unknown) => void
  const promise = new Promise<void>((done, fail) => {
    resolve = done
    reject = fail
  })
  return { promise, resolve, reject }
}

describe("a menu item whose action returns a Promise", () => {
  test("stays pending, and the menu open, until it resolves", async () => {
    const save = deferred()
    const onAction = vi.fn(() => save.promise)
    const instance = menu({ id: "save", onAction })
    instance.api.open()
    const item = () => instance.part("item", { value: "save" })
    press(item())?.()
    expect(attrs(item())).toMatchObject({ "aria-busy": "true", "data-pending": "" })
    expect(partState(item())).toMatchObject({ pending: true })
    expect(instance.get().open).toBe(true)
    press(item())?.()
    expect(onAction).toHaveBeenCalledTimes(1)
    save.resolve()
    await save.promise
    expect(partState(item())).toMatchObject({ pending: false })
    expect(instance.get().open).toBe(false)
  })

  test("a rejection keeps the menu open and puts the reason in the item's error", async () => {
    const save = deferred()
    const instance = menu({ id: "fail" })
    instance.api.open()
    const item = () => instance.part("item", { value: "save", onSelect: () => save.promise })
    press(item())?.()
    save.reject("offline")
    await save.promise.catch(() => {})
    await Promise.resolve()
    expect(partState(item())).toMatchObject({ pending: false, error: "offline" })
    expect(instance.get().open).toBe(true)
  })

  test("a prevented onSelect keeps the menu open after it resolves", async () => {
    const save = deferred()
    const instance = menu({ id: "keep" })
    instance.api.open()
    press(
      instance.part("item", {
        value: "save",
        onSelect: (event: Event) => {
          event.preventDefault()
          return save.promise
        },
      }),
    )?.()
    save.resolve()
    await save.promise
    expect(instance.get().open).toBe(true)
  })
})
