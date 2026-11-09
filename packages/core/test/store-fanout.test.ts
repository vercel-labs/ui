import { expect, test } from "vitest"
import { budgets } from "../../../tests/perf/budgets"
import { menu } from "./menu-parts"
import { toolbar } from "../src/components/toolbar/toolbar"
import { fakeElement } from "./selects"
import { press, subscribe } from "../src/foundation/kernel/part"
import type { PrimitiveInstance } from "../src/foundation/kernel/primitive-types"

// Same bound at every size, so work that grows with the item count fails at
// the larger ones.
for (const n of [10, 500, 2000]) {
  test(`a highlight change notifies two items (n=${n})`, () => {
    const instance = menu({ id: "m" })
    let notified = 0
    for (let i = 0; i < n; i++) {
      subscribe(instance.part("item", { value: `item-${i}` }), () => notified++)
    }
    instance.api.internal.highlight("item-1", { focus: false })
    notified = 0
    instance.api.internal.highlight("item-2", { focus: false })
    expect(notified).toBe(budgets["menu.arrow-key"].notified)
  })

  test(`a checkbox toggle notifies its item and its indicator (n=${n})`, () => {
    const instance = menu({ id: "m" })
    const notified = new Set<string>()
    const watch = (slot: string, props: Record<string, unknown>) =>
      subscribe((instance as PrimitiveInstance).part(slot, props), () =>
        notified.add(`${slot} ${JSON.stringify(props)}`)
      )
    watch("trigger", {})
    watch("content", {})
    for (let i = 0; i < n; i++) {
      watch("item", { value: `item-${i}` })
    }
    watch("separator", { id: "separator" })
    watch("checkbox-item", { value: "wrap" })
    watch("item-indicator", {
      id: "wrap-check",
      item: "checkbox-item",
      itemKey: "wrap",
    })
    watch("checkbox-item", { value: "minimap" })
    watch("item-indicator", {
      id: "minimap-check",
      item: "checkbox-item",
      itemKey: "minimap",
    })
    press(instance.part("checkbox-item", { value: "wrap" }))?.()
    expect(notified.size).toBeLessThanOrEqual(budgets["menu.checkbox"].notified)
    expect([...notified]).toEqual([
      'checkbox-item {"value":"wrap"}',
      'item-indicator {"id":"wrap-check","item":"checkbox-item","itemKey":"wrap"}',
    ])
  })

  test(`a toolbar button rendered as another element notifies only itself (n=${n})`, () => {
    const instance = toolbar({ id: "t" })
    let notified = 0
    for (let i = 0; i < n; i++) {
      subscribe(
        (instance as PrimitiveInstance).part("button", { value: `b${i}` }),
        () => notified++
      )
    }
    // Every button renders as a div, like a toolbar of custom elements, one
    // by one as they bind.
    for (let i = 0; i < n; i++) {
      instance.api.internal.setElement(
        `b${i}`,
        Object.assign(fakeElement(i, "DIV"), { matches: () => false })
      )
    }
    expect(notified).toBe(n * budgets["toolbar.arrow-key"].notifiedPerPart)
  })
}
