// @vitest-environment jsdom
import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, expect, test, vi } from "vitest"
import { Command, CommandInput, CommandItem, CommandList } from "../src/command"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

let root: Root | undefined

afterEach(async () => {
  await React.act(async () => root?.unmount())
  root = undefined
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  document.body.replaceChildren()
})

const rows = Array.from({ length: 50 }, (_, i) => `item-${i + 1}`)

// A 200px list of 20px commands, with layout faked since jsdom has none.
function fakeLayout() {
  const scrolled = new WeakMap<Element, number>()
  const isList = (el: Element) =>
    el.getAttribute("data-slot") === "command-list"
  const list = () => document.querySelector('[data-slot="command-list"]')!
  vi.spyOn(HTMLElement.prototype, "scrollTop", "get").mockImplementation(
    function (this: HTMLElement) {
      return scrolled.get(this) ?? 0
    }
  )
  vi.spyOn(HTMLElement.prototype, "scrollTop", "set").mockImplementation(
    function (this: HTMLElement, value: number) {
      scrolled.set(this, value)
    }
  )
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return isList(this) ? 200 : 0
    }
  )
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(
    function (this: HTMLElement) {
      return isList(this) ? rows.length * 20 : 0
    }
  )
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(20)
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      const index =
        this.getAttribute("data-slot") === "command-item"
          ? rows.indexOf(this.textContent ?? "")
          : -1
      const top = index === -1 ? 0 : index * 20 - list().scrollTop
      return new DOMRect(0, top, 100, 20)
    }
  )
  const style = window.getComputedStyle
  vi.stubGlobal("getComputedStyle", (el: Element) =>
    isList(el)
      ? { overflowY: "auto", scrollPaddingTop: "", scrollPaddingBottom: "" }
      : style(el)
  )
}

test("a command highlighted by defaultValue scrolls into view as the list mounts", async () => {
  fakeLayout()
  const container = document.body.appendChild(document.createElement("div"))
  root = createRoot(container)
  await React.act(async () =>
    root!.render(
      <Command defaultValue="item-40">
        <CommandInput aria-label="Search" />
        <CommandList>
          {rows.map((row) => (
            <CommandItem key={row} value={row}>
              {row}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    )
  )
  await React.act(async () => new Promise((resolve) => setTimeout(resolve)))
  const list = container.querySelector<HTMLElement>(
    '[data-slot="command-list"]'
  )!
  expect(list.scrollTop).toBe(39 * 20 + 20 - 200)
})
