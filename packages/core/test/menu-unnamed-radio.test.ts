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
    for (const value of values) {
      const item = instance.part("radio-item", { group: name, value })
      bind(item, document.body.appendChild(document.createElement("div")))
    }
    bind(part, document.body.appendChild(document.createElement("div")))
    return part
  }
  instance.api.open()
  group("sort", ["name", "date"])
  instance.api.setRadio("sort", "date")
  instance.api.close()
  instance.api.open()
  const density = group("density", ["compact", "comfortable"])
  await Promise.resolve()
  expect(partState(density).value).toBe("compact")
})
