import { describe, expect, test } from "vitest"
import { combobox } from "../src/components/combobox/combobox"

const frameworks = [
  { value: "next", label: "Next.js" },
  { value: "astro", label: "Astro" },
]

describe("combobox headless", () => {
  test("clearing empties the value and the text", () => {
    const instance = combobox({ id: "c", items: frameworks, defaultValue: "astro" })
    expect(instance.api.getQuery()).toBe("Astro")
    instance.api.clear()
    expect(instance.api.getValue()).toBe(null)
    expect(instance.api.getQuery()).toBe("")
  })

  test("a canceled clear keeps the value and its label in the input", () => {
    const instance = combobox({
      id: "c",
      items: frameworks,
      defaultValue: "astro",
      onValueChange: (_value, details) => details.cancel(),
    })
    instance.api.clear({ reason: "clear-press" })
    expect(instance.api.getValue()).toBe("astro")
    expect(instance.api.getQuery()).toBe("Astro")
  })

  test("a canceled choice keeps the value and its label in the input", () => {
    const instance = combobox({
      id: "c",
      items: frameworks,
      defaultValue: "astro",
      onValueChange: (_value, details) => details.cancel(),
    })
    instance.api.setQuery("ne")
    instance.api.internal.choose("next")
    expect(instance.api.getValue()).toBe("astro")
    expect(instance.api.getQuery()).toBe("Astro")
  })

  test("a canceled custom value puts the value's label back in the input", () => {
    const instance = combobox({
      id: "c",
      items: frameworks,
      defaultValue: "astro",
      allowCustomValue: true,
      onValueChange: (_value, details) => details.cancel(),
    })
    instance.api.internal.typed("Remix")
    instance.api.internal.hide({ reason: "focus-out" })
    expect(instance.api.getValue()).toBe("astro")
    expect(instance.api.getQuery()).toBe("Astro")
  })

  test("Escape after deleting the text brings the value back with the reason escape-key", () => {
    const reasons: string[] = []
    const instance = combobox({
      id: "c",
      items: frameworks,
      defaultValue: "astro",
      onValueChange: (_value, details) => reasons.push(details.reason),
    })
    instance.api.internal.typed("")
    expect(instance.api.getValue()).toBe(null)
    instance.api.internal.hide({ reason: "escape-key" })
    expect(instance.api.getValue()).toBe("astro")
    expect(instance.api.getQuery()).toBe("Astro")
    expect(reasons).toEqual(["input-change", "escape-key"])
  })

  test("clearing with nothing selected still empties the text", () => {
    const instance = combobox({ id: "c", items: frameworks })
    instance.api.setQuery("ne")
    instance.api.clear()
    expect(instance.api.getQuery()).toBe("")
  })

  test("a read-only combobox ignores clear", () => {
    const instance = combobox({ id: "c", items: frameworks, defaultValue: "astro", readOnly: true })
    instance.api.clear()
    expect(instance.api.getValue()).toBe("astro")
    expect(instance.api.getQuery()).toBe("Astro")
  })

  test("a value set before its items load shows their label once they arrive", () => {
    const instance = combobox({ id: "c", items: [], value: "astro" })
    instance.setOptions({ id: "c", items: frameworks, value: "astro" })
    expect(instance.api.getQuery()).toBe("Astro")
  })

  test("a multiple combobox keeps its text when new items arrive", () => {
    const options = { id: "c", items: frameworks, multiple: true, keepQuery: true }
    const instance = combobox(options)
    instance.api.setQuery("astro")
    instance.api.internal.choose("astro")
    expect(instance.api.getValue()).toEqual(["astro"])
    instance.setOptions({ ...options, items: [...frameworks] })
    expect(instance.api.getQuery()).toBe("astro")
  })
})
