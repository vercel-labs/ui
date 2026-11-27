import { flushSync, mount, unmount } from "svelte"
import { afterEach, beforeAll, expect, test } from "vitest"
import App from "./apps/color-picker-presets-popover-app.svelte"

beforeAll(() => {
  Element.prototype.checkVisibility = () => true
  document.head.append(
    Object.assign(document.createElement("style"), {
      textContent: "[popover] { display: block !important }",
    })
  )
})

let app: ReturnType<typeof mount> | undefined

afterEach(() => {
  if (app) {
    unmount(app)
  }
  app = undefined
  document.body.replaceChildren()
})

async function open(value: string) {
  const target = document.body.appendChild(document.createElement("div"))
  app = mount(App, { target, props: { value } })
  flushSync()
  await new Promise((resolve) => setTimeout(resolve, 20))
  target.querySelector("button")!.click()
  await new Promise((resolve) => setTimeout(resolve, 20))
  flushSync()
  return document.activeElement as HTMLElement
}

test("a popover that opens on the presets focuses the selected one", async () => {
  const focused = await open("#7C3AED")
  expect(focused.getAttribute("role")).toBe("option")
  expect(focused.getAttribute("aria-selected")).toBe("true")
})

test("with no preset selected, it focuses the first", async () => {
  const focused = await open("#123456")
  expect(focused).toBe(document.querySelector("[role=option]"))
})
