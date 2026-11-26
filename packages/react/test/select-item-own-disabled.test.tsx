// @vitest-environment jsdom
// With `items` on the root, an item's own `disabled` still keeps it from
// being chosen, as without data.
import * as React from "react"
import { act } from "react"
import { createRoot } from "react-dom/client"
import { expect, test } from "vitest"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectList,
  SelectTrigger,
  SelectValue,
} from "../src/select"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
Element.prototype.getAnimations ??= () => []

const cities = ["Madrid", "Stockholm", "Warsaw", "Oslo"]
const data = cities.map((city) => ({ value: city.toLowerCase(), label: city }))

test("an item disabled by its own prop can't be chosen with data", async () => {
  const container = document.body.appendChild(document.createElement("div"))
  const root = createRoot(container)
  await act(async () =>
    root.render(
      <Select items={data} defaultValue="stockholm" defaultOpen>
        <SelectTrigger aria-label="City">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectList>
            {cities.map((city) => (
              <SelectItem
                key={city}
                value={city.toLowerCase()}
                label={city}
                disabled={city === "Warsaw"}
              >
                {city}
              </SelectItem>
            ))}
          </SelectList>
        </SelectContent>
      </Select>
    )
  )
  const item = (name: string) =>
    [...document.querySelectorAll<HTMLElement>('[role="option"]')].find(
      (el) => el.textContent === name
    )!
  await act(async () => item("Warsaw").click())
  expect(
    container.querySelector('[data-slot="select-value"]')?.textContent
  ).toBe("Stockholm")
  await act(async () => root.unmount())
  container.remove()
})
