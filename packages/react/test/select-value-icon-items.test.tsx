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

test("a select with items on its root shows its value's icon before it opens", async () => {
  const container = document.body.appendChild(document.createElement("div"))
  const root = createRoot(container)
  await act(async () =>
    root.render(
      <Select items={["public", "team"]} defaultValue="public">
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
  )
  expect(
    container
      .querySelector('[data-slot="select-value-icon"] [data-icon]')
      ?.getAttribute("data-icon")
  ).toBe("globe")
  await act(async () => root.unmount())
  container.remove()
})
