// @vitest-environment jsdom
import { beforeAll, expect, test } from "vitest"
import { defineComboboxElements } from "../src/combobox"
import { defineListboxElements } from "../src/listbox"

type Plan = { id: string; price: number }

const plans: Plan[] = [
  { id: "hobby", price: 0 },
  { id: "pro", price: 20 },
]

const wait = () => new Promise((resolve) => setTimeout(resolve, 10))

beforeAll(() => {
  ;(
    Element.prototype as { getAnimations?: () => Animation[] }
  ).getAnimations ??= () => []
  ElementInternals.prototype.setFormValue ??= () => {}
  ElementInternals.prototype.setValidity ??= () => {}
  defineListboxElements()
  defineComboboxElements()
})

test.each([
  [
    "listbox",
    `<ui-listbox aria-label="Plan"><ui-listbox-item>Hobby</ui-listbox-item><ui-listbox-item>Pro</ui-listbox-item></ui-listbox>`,
  ],
  [
    "combobox",
    `<ui-combobox open><ui-combobox-input><input aria-label="Plan" /></ui-combobox-input><ui-combobox-content><ui-combobox-list><ui-combobox-item>Hobby</ui-combobox-item><ui-combobox-item>Pro</ui-combobox-item></ui-combobox-list></ui-combobox-content></ui-combobox>`,
  ],
])(
  "a %s item written in the page keeps a record value, keyed by itemToValue",
  async (name, html) => {
    document.body.innerHTML = html
    const owner = document.querySelector(`ui-${name}`) as HTMLElement & {
      value: unknown
      itemToValue: (plan: Plan) => string
      itemToLabel: (plan: Plan) => string
    }
    owner.itemToValue = (plan) => plan.id
    owner.itemToLabel = (plan) => plan.id
    const items = [
      ...document.querySelectorAll<HTMLElement & { value: unknown }>(
        `ui-${name}-item`
      ),
    ]
    items.forEach((item, index) => (item.value = plans[index]))
    await wait()
    expect(items.map((item) => item.id.split("-option-")[1])).toEqual([
      "hobby",
      "pro",
    ])
    items[1].click()
    await wait()
    const value = owner.value
    expect(Array.isArray(value) ? value[0] : value).toBe(plans[1])
  }
)
