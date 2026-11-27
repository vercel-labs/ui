import { expect, test } from "vitest"
import { partState } from "../src/foundation/kernel/part"
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
