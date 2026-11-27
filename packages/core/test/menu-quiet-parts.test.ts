import { expect, test } from "vitest"
import { subscribe } from "../src/foundation/kernel/part"
import { menu } from "./menu-parts"

test("opening, highlighting and closing a menu doesn't wake the parts that show none of it", () => {
  const instance = menu({ id: "quiet" })
  const heard: Record<string, number> = {}
  const listen = (
    slot: Parameters<typeof instance.part>[0],
    props?: object
  ) => {
    heard[slot] = 0
    subscribe(instance.part(slot, props), () => heard[slot]++)
  }
  listen("group", { id: "g" })
  listen("group-label", { group: "g" })
  listen("separator")
  listen("viewport")
  listen("radio-group", { name: "scheme" })
  listen("item-indicator", {
    item: "radio-item",
    itemKey: "dark",
    group: "scheme",
  })
  const store = instance.part("content").store
  for (let run = 0; run < 5; run++) {
    instance.api.open()
    store.set({ highlighted: "scheme:dark" })
    store.set({ highlighted: "scheme:light" })
    instance.api.close()
  }
  expect(heard).toEqual({
    group: 0,
    "group-label": 0,
    separator: 0,
    viewport: 0,
    "radio-group": 0,
    "item-indicator": 0,
  })
})

test("a menu's content hears it open and close, not its highlight", () => {
  const instance = menu({ id: "content" })
  let heard = 0
  subscribe(instance.part("content"), () => heard++)
  const store = instance.part("content").store
  store.set({ highlighted: "a" })
  store.set({ highlighted: "b" })
  expect(heard).toBe(0)
  instance.api.open()
  expect(heard).toBeGreaterThan(0)
})
