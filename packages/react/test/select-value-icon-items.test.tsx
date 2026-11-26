// @vitest-environment jsdom
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { expect, test } from "vitest"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemIcon,
  SelectTrigger,
  SelectValue,
  SelectValueIcon,
} from "../src/select"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []

function Visibility({ value }: { value: string | null }) {
  return (
    <Select items={["public", "team"]} value={value}>
      <SelectTrigger aria-label="Visibility">
        <SelectValueIcon />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="public">
          <SelectItemIcon>
            <svg data-icon="globe" />
          </SelectItemIcon>
          public
        </SelectItem>
        <SelectItem value="team">
          <SelectItemIcon>
            <svg data-icon="users" />
          </SelectItemIcon>
          team
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

async function render(...values: (string | null)[]) {
  const container = document.body.appendChild(document.createElement("div"))
  const root = createRoot(container)
  for (const value of values) {
    await act(async () => root.render(<Visibility value={value} />))
  }
  const icon = container
    .querySelector('[data-slot="select-value-icon"] [data-icon]')
    ?.getAttribute("data-icon")
  await act(async () => root.unmount())
  container.remove()
  return icon
}

test("a select with items on its root shows its value's icon before it opens", async () => {
  expect(await render("public")).toBe("globe")
})

test("a select with items on its root shows the icon of a value given while closed", async () => {
  expect(await render(null, "team")).toBe("users")
})
