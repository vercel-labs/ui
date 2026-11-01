// @vitest-environment jsdom
// A list restored from saved keys before its object items arrive takes their
// values once they do, unless something newer set the value first.
import { describe, expect, test } from "vitest"
import { combobox } from "../src/components/combobox/combobox"
import { listbox } from "../src/components/listbox/listbox-root"
import { select } from "../src/components/select/select"

type Item = { id: number; name: string }

const two = { id: 2, name: "Two" }
const both = [
  { value: { id: 1, name: "One" }, label: "One" },
  { value: two, label: "Two" },
]

const itemToValue = (item: Item) => String(item.id)

type ListOptions = { multiple: boolean; items?: typeof both }

const lists = [
  ["select", (options: ListOptions) => select({ id: "select", itemToValue, ...options })],
  ["combobox", (options: ListOptions) => combobox({ id: "combobox", itemToValue, ...options })],
  ["listbox", (options: ListOptions) => listbox({ id: "listbox", itemToValue, ...options })],
] as const

const flush = () => Promise.resolve()

for (const [name, create] of lists)
  for (const multiple of [false, true])
    describe(`a ${name}, multiple: ${multiple}`, () => {
      const shaped = (...values: unknown[]) => (multiple ? values : (values[0] ?? null))
      const supply = (instance: ReturnType<typeof create>, items: typeof both) => {
        instance.setOptions({ id: name, itemToValue, multiple, items })
        return flush()
      }

      test("restored before its items arrive takes the items' values", async () => {
        const instance = create({ multiple })
        instance.api.internal.restore(JSON.stringify(["2"]))
        await supply(instance, both)
        expect(instance.get().value).toEqual(shaped(two))
      })
    })
