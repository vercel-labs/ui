// @vitest-environment jsdom
import { expect, test } from "vitest"
import { createApp, h, nextTick, ref } from "vue"
import { Field, FieldLabel } from "../src/field"
import {
  NumberInput,
  NumberInputControl,
  NumberInputDecrement,
  NumberInputIncrement,
} from "../src/number-input"
import { PasswordInput, PasswordInputControl, PasswordInputToggle } from "../src/password-input"

const settle = async () => {
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 20))
}

test.each([
  ["number input", "amount"],
  ["password input", "secret"],
])("a %s control's own id in a field stays what its buttons point at after an update", async (kind, id) => {
  const value = ref<number | string | null>(kind === "number input" ? 1 : "a")
  const control = () =>
    kind === "number input"
      ? h(
          NumberInput,
          { value: value.value as number, "onUpdate:value": (next: number) => (value.value = next) },
          () => [h(NumberInputDecrement), h(NumberInputControl, { id }), h(NumberInputIncrement)],
        )
      : h(
          PasswordInput,
          { value: value.value as string, "onUpdate:value": (next: string) => (value.value = next) },
          () => [h(PasswordInputControl, { id }), h(PasswordInputToggle)],
        )
  const root = document.createElement("div")
  document.body.append(root)
  const app = createApp(() => h(Field, null, () => [h(FieldLabel, null, () => "Label"), control()]))
  app.mount(root)
  await settle()
  value.value = kind === "number input" ? 2 : "ab"
  await settle()
  const pointed = [...root.querySelectorAll("[aria-controls]")].map((el) => el.getAttribute("aria-controls"))
  expect(pointed.length).toBeGreaterThan(0)
  expect(pointed.every((target) => target === id)).toBe(true)
  expect(root.querySelector('[data-slot="field-label"]')!.getAttribute("for")).toBe(id)
  app.unmount()
  root.remove()
})
