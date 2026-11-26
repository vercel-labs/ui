// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { createApp, h, mergeProps, nextTick, type App } from "vue"
import { Button } from "../src/button"
import { Popover, PopoverContent, PopoverTrigger } from "../src/popover"

Element.prototype.getAnimations ??= () => []
HTMLElement.prototype.showPopover ??= function () {}
HTMLElement.prototype.hidePopover ??= function () {}

let app: App | undefined

afterEach(() => {
  app?.unmount()
  app = undefined
  document.body.replaceChildren()
})

const mount = (onClick: (event: MouseEvent) => void) => {
  const root = document.body.appendChild(document.createElement("div"))
  app = createApp(() =>
    h(Popover, null, () => [
      h(PopoverTrigger, null, {
        render: ({ props }: { props: Record<string, unknown> }) =>
          h(Button, mergeProps(props, { onClick }), () => "Share"),
      }),
      h(PopoverContent, null, () => "Share this page"),
    ])
  )
  app.mount(root)
  return root.querySelector("button")!
}

test("a Button with its own click in a trigger's slot runs it, then opens the popover", async () => {
  const order: string[] = []
  const button = mount(() => order.push(button.getAttribute("aria-expanded")!))
  await nextTick()
  button.click()
  await nextTick()
  expect(order).toEqual(["false"])
  expect(button.getAttribute("aria-expanded")).toBe("true")
})

test("its own click can cancel the trigger's", async () => {
  const button = mount((event) => event.preventDefault())
  await nextTick()
  button.click()
  await nextTick()
  expect(button.getAttribute("aria-expanded")).toBe("false")
})
