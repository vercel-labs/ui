// @vitest-environment jsdom
import { afterEach, expect, test } from "vitest"
import { createApp, h, nextTick, ref, type App } from "vue"
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

test("removing the first trigger of a closed popover gives the id to the next", async () => {
  const first = ref(true)
  const root = document.createElement("div")
  document.body.append(root)
  app = createApp(() =>
    h(Popover, null, () => [
      first.value ? h(PopoverTrigger, null, () => "Profile") : null,
      h(PopoverTrigger, null, () => "Account"),
      h(PopoverContent, null, () => "Edit profile"),
    ])
  )
  app.mount(root)
  await nextTick()
  const named = () =>
    [...root.querySelectorAll("button[id]")].map((el) => el.textContent)
  expect(named()).toEqual(["Profile"])
  first.value = false
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 10))
  expect(named()).toEqual(["Account"])
})
