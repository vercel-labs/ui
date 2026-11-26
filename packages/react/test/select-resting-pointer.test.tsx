// @vitest-environment jsdom
// WebKit fires pointermove without movement when the list scrolls under a
// resting pointer, which mustn't take the highlight from the item a key reached.
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

const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"]

test("a pointermove that doesn't move the pointer keeps the highlight", async () => {
  const container = document.body.appendChild(document.createElement("div"))
  const root = createRoot(container)
  await act(async () =>
    root.render(
      <Select defaultValue="Item 1" defaultOpen>
        <SelectTrigger aria-label="Item">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectList>
            {items.map((item) => (
              <SelectItem key={item} value={item} label={item}>
                {item}
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
  const move = (name: string, x: number) =>
    act(async () =>
      item(name).dispatchEvent(
        Object.assign(
          new MouseEvent("pointermove", {
            bubbles: true,
            clientX: x,
            clientY: 30,
          }),
          { pointerType: "mouse" }
        )
      )
    )
  const highlighted = () =>
    document.querySelector('[role="option"][data-highlighted]')?.textContent
  await move("Item 3", 10)
  expect(highlighted()).toBe("Item 3")
  await move("Item 5", 10)
  expect(highlighted()).toBe("Item 3")
  await move("Item 5", 11)
  expect(highlighted()).toBe("Item 5")
  await act(async () => root.unmount())
  container.remove()
})
