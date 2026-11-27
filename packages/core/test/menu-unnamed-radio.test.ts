// @vitest-environment jsdom
import { expect, test } from "vitest"
import { bind, partState } from "../src/foundation/kernel/part"
import { menu } from "./menu-parts"

test("an unnamed radio group keeps its choice when the content mounts again", () => {
  const instance = menu({ id: "theme" })
  const group = (name: string) =>
    instance.part("radio-group", {
      id: name,
      name,
      unnamed: true,
      defaultValue: "light",
    })
  const valueOf = (name: string) => partState(group(name)).value
  instance.api.open()
  valueOf("first")
  instance.api.setRadio("first", "dark")
  expect(valueOf("first")).toBe("dark")
  instance.api.close()
  instance.api.open()
  expect(valueOf("second")).toBe("dark")
  expect(valueOf("third")).toBe("light")
})

test("an unnamed group shown only some of the time doesn't take the next group's choice", async () => {
  const instance = menu({ id: "view" })
  const group = (name: string, values: string[]) => {
    const part = instance.part("radio-group", {
      id: name,
      name,
      unnamed: true,
      defaultValue: values[0],
    })
    const items = values.map((value) => {
      const item = instance.part("radio-item", { group: name, value })
      bind(item, document.body.appendChild(document.createElement("div")))
      return item
    })
    bind(part, document.body.appendChild(document.createElement("div")))
    return { part, items }
  }
  instance.api.open()
  group("sort", ["name", "date"])
  instance.api.setRadio("sort", "date")
  instance.api.close()
  instance.api.open()
  const density = group("density", ["compact", "comfortable"])
  await Promise.resolve()
  expect(partState(density.part).value).toBe("compact")
  expect(density.items.map((item) => partState(item).checked)).toEqual([
    true,
    false,
  ])
})

test("an unnamed group whose value is controlled keeps its place", () => {
  const instance = menu({ id: "layout" })
  const group = (name: string, props: object) =>
    instance.part("radio-group", { id: name, name, unnamed: true, ...props })
  const valueOf = (name: string, props: object) =>
    partState(group(name, props)).value
  instance.api.open()
  valueOf("sort", { defaultValue: "name" })
  valueOf("density", { defaultValue: "compact" })
  instance.api.setRadio("sort", "date")
  instance.api.close()
  instance.api.open()
  expect(valueOf("sort-again", { value: "date" })).toBe("date")
  expect(valueOf("density-again", { defaultValue: "compact" })).toBe("compact")
})
