// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test } from "vitest"
import { Field, FieldLabel } from "../src/field"
import { Select, SelectTrigger, SelectValue } from "../src/select"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  document.body.replaceChildren()
})

test("a select in a Field keeps the Field's label as its name", async () => {
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () =>
    root!.render(
      <Field>
        <FieldLabel>Fruit</FieldLabel>
        <Select items={["Apple", "Pear"]}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
        </Select>
      </Field>,
    ),
  )
  await React.act(async () => new Promise((resolve) => setTimeout(resolve, 10)))
  const trigger = container.querySelector<HTMLElement>('[role="combobox"]')!
  const label = container.querySelector('[data-slot="field-label"]')!
  expect(trigger.getAttribute("aria-labelledby")?.split(" ")).toContain(label.id)
})
