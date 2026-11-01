// @vitest-environment jsdom
import { expect, test } from "vitest"
import { combobox } from "../src/components/combobox/combobox"
import { listbox } from "../src/components/listbox/listbox-root"
import { select } from "../src/components/select/select"

type Item = { id: number; name: string }
const toValue = (item: Item) => String(item.id)
const items = [
  { value: { id: 1, name: "One" }, label: "One" },
  { value: { id: 2, name: "Two" }, label: "Two" },
]

const kinds = [
  ["select", select],
  ["combobox", combobox],
  ["listbox", listbox],
] as const

for (const [name, primitive] of kinds)
  for (const multiple of [false, true])
    test(`a ${name} restored before its items arrive takes the items' values, multiple: ${multiple}`, async () => {
      const base = { id: name, multiple, itemToValue: toValue } as never
      const instance = (primitive as (options: never) => ReturnType<typeof select>)(base)
      instance.api.internal.restore(JSON.stringify(["2"]))
      instance.setOptions({ ...(base as object), items } as never)
      await Promise.resolve()
      const value = instance.get().value
      expect(value).toEqual(multiple ? [items[1].value] : items[1].value)
      instance.destroy()
    })
